import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import authService, { type UserData, type ProcessedAuthResponse, type ProcessedRegisterResponse } from '@/services/authService';

interface AuthState {
  user: UserData | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginAction: (loginResponse: ProcessedAuthResponse) => void;
  registerSuccessAction: (registerResponse: ProcessedRegisterResponse) => void;
  logoutAction: () => void; 
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      loginAction: (loginResponse) => { 
        set({
          user: loginResponse.user,
          token: loginResponse.token, 
          isAuthenticated: true,
          error: null,
          isLoading: false,
        });
      },
      registerSuccessAction: (registerResponse) => {
        const updates: Partial<AuthState> = {
            user: registerResponse.user, 
            error: null,
            isLoading: false,
        };
        if (registerResponse.token) { 
            updates.token = registerResponse.token;
            updates.isAuthenticated = true;
        }
        set(updates);
      },
      logoutAction: () => {
        console.log("AuthStore: Performing client-side logout.");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        });
      },
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (errorMsg) => set({ error: errorMsg, isLoading: false }),
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage as StateStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export const initializeAuth = async () => {
  const store = useAuthStore.getState();
  const persistedToken = store.token;

  if (persistedToken) {
    console.log("AuthStore: Token found in storage. Attempting to verify and re-fetch user data...");
    store.setLoading(true);
    try {
      const currentUserData = await authService.getCurrentUser(); 

      if (currentUserData && typeof currentUserData.id !== 'undefined') {
        store.loginAction({
            user: currentUserData,
            token: persistedToken, 
            message: "User re-authenticated successfully." 
        });
        console.log("AuthStore: User re-authenticated successfully with stored token:", currentUserData);
      } else {
        console.warn("AuthStore: Token might be valid but no valid user data returned from /me. Logging out.");
        store.logoutAction();
      }
    } catch (error: any) {
      console.error("AuthStore: Failed to re-authenticate with stored token or fetch user data:", error.message || error);
      store.setError(`Gagal memverifikasi sesi: ${error.message || 'Tidak diketahui'}`);
      store.logoutAction();
    } finally {
      store.setLoading(false);
    }
  } else {
    console.log("AuthStore: No token found in storage. User is not logged in.");
    if (store.isAuthenticated || store.user || store.token) {
        store.logoutAction();
    }
  }
};
