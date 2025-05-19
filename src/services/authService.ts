import apiClient from "./apiClient";
import { AUTH_ENDPOINTS } from "@/constants/apiEndpoints";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

export interface UserData {
  id: number;
  username: string;
  email: string;
  provider: string;
  confirmed: boolean;
  blocked: boolean;
  createdAt: string;
  updatedAt: string;
  documentId?: string;
  publishedAt?: string;
  locale?: string | null;
}

interface BackendLoginResponse {
  jwt: string;
  user: UserData;
  message?: string;
}

interface BackendRegisterResponse {
  jwt?: string;
  user: UserData;
  message?: string;
}

export interface ProcessedAuthResponse {
  message: string;
  token: string;
  user: UserData;
}

export interface ProcessedRegisterResponse {
  message: string;
  user: UserData;
  token?: string;
}

const authService = {
  login: async (
    credentials: LoginCredentials,
  ): Promise<ProcessedAuthResponse> => {
    try {
      const apiPayload = new URLSearchParams();
      apiPayload.append("identifier", credentials.email);
      apiPayload.append("password", credentials.password);

      const response = await apiClient.post<BackendLoginResponse>(
        AUTH_ENDPOINTS.LOGIN,
        apiPayload,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        },
      );

      const backendData = response.data;

      if (
        backendData &&
        typeof backendData.jwt === "string" &&
        backendData.jwt.trim() !== "" &&
        backendData.user &&
        typeof backendData.user.id !== "undefined"
      ) {
        return {
          message: backendData.message || "Login berhasil!",
          token: backendData.jwt,
          user: backendData.user,
        };
      } else {
        console.error(
          "authService.login: Respons API tidak lengkap atau data pengguna tidak valid.",
          backendData,
        );
        throw new Error(
          "Login gagal: Respons server tidak lengkap atau data pengguna tidak valid.",
        );
      }
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan saat proses login.";
      if (error.response && error.response.data && error.response.data.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message || errorMessage;
        if (apiError.details && apiError.details.errors) {
          errorMessage +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(
        "authService.login error:",
        error.response?.data || error.message || error,
      );
      throw new Error(errorMessage);
    }
  },

  register: async (data: RegisterData): Promise<ProcessedRegisterResponse> => {
    try {
      const apiPayload = new URLSearchParams();
      apiPayload.append("username", data.username);
      apiPayload.append("email", data.email);
      apiPayload.append("password", data.password);

      const response = await apiClient.post<BackendRegisterResponse>(
        AUTH_ENDPOINTS.REGISTER,
        apiPayload,
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } },
      );
      const backendData = response.data;

      if (backendData.user && typeof backendData.user.id !== "undefined") {
        return {
          message: backendData.message || "Registrasi berhasil!",
          user: backendData.user,
          token: backendData.jwt,
        };
      } else {
        console.error(
          "authService.register: Respons API tidak lengkap atau data pengguna tidak valid.",
          backendData,
        );
        throw new Error(
          "Registrasi gagal: Data pengguna dari server tidak lengkap atau tidak valid.",
        );
      }
    } catch (error: any) {
      let errorMessage = "Terjadi kesalahan saat registrasi.";
      if (error.response && error.response.data && error.response.data.error) {
        const apiError = error.response.data.error;
        errorMessage = apiError.message || errorMessage;
        if (apiError.details && apiError.details.errors) {
          errorMessage +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(
        "authService.register error:",
        error.response?.data || error.message || error,
      );
      throw new Error(errorMessage);
    }
  },

  getCurrentUser: async (): Promise<UserData> => {
    try {
      const response = await apiClient.get<UserData>(AUTH_ENDPOINTS.ME);
      if (response.data && typeof response.data.id !== "undefined") {
        return response.data;
      } else {
        console.error(
          "authService.getCurrentUser: Data pengguna dari server kosong atau tidak valid.",
          response.data,
        );
        throw new Error(
          "Gagal mengambil data pengguna: Format data tidak sesuai.",
        );
      }
    } catch (error: any) {
      let errorMessage = "Gagal mengambil data pengguna.";
      if (error.response && error.response.status === 403) {
        errorMessage =
          "Akses ditolak. Anda tidak memiliki izin untuk melihat data pengguna.";
      } else if (
        error.response &&
        error.response.data &&
        error.response.data.error
      ) {
        errorMessage = error.response.data.error.message || errorMessage;
      } else if (error.message) {
        errorMessage = error.message;
      }
      console.error(
        "authService.getCurrentUser error:",
        error.response?.data || error.message || error,
      );
      throw new Error(errorMessage);
    }
  },

  logout: async (): Promise<void> => {
    try {
      return Promise.resolve();
    } catch (error: any) {
      console.warn(
        "authService.logout API call failed (if any):",
        error.response?.data || error.message || error,
      );
      return Promise.resolve();
    }
  },
};

export default authService;
