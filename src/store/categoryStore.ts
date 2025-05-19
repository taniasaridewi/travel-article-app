import { create } from 'zustand';
import categoryService from '@/services/categoryService'; 
import type {
  CategoryData,
  PaginationMeta,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoriesApiResponse,
} from '@/types/categoryTypes'; 

interface CategoryState {
  categories: CategoryData[];
  pagination: PaginationMeta | null;
  currentCategory: CategoryData | null; 
  isLoading: boolean;
  isSubmitting: boolean; 
  error: string | null;
  currentFetchParams: { pagination?: { page?: number; pageSize?: number } };

  fetchCategories: (params?: { pagination?: { page?: number; pageSize?: number } }) => Promise<void>;
  fetchCategoryById: (documentId: string) => Promise<CategoryData | null>;
  createCategory: (payload: CreateCategoryPayload) => Promise<CategoryData | null>;
  updateCategory: (documentId: string, payload: UpdateCategoryPayload) => Promise<CategoryData | null>;
  deleteCategory: (documentId: string) => Promise<boolean>;

  setCurrentPage: (page: number) => void; 
  clearError: () => void;
  clearCurrentCategory: () => void;
}

const initialCategoryParams = {
  pagination: { page: 1, pageSize: 25 }, 
};

export const useCategoryStore = create<CategoryState>()((set, get) => ({
  categories: [],
  pagination: null,
  currentCategory: null,
  isLoading: false,
  isSubmitting: false,
  error: null,
  currentFetchParams: initialCategoryParams,

  fetchCategories: async (params?: { pagination?: { page?: number; pageSize?: number } }) => {
    set({ isLoading: true, error: null });
    const queryParams = {
      ...get().currentFetchParams,
      ...params,
      pagination: {
        ...(get().currentFetchParams.pagination),
        ...(params?.pagination || {}),
      },
    };
    set({ currentFetchParams: queryParams });

    try {
      const response: CategoriesApiResponse = await categoryService.getCategories(queryParams);
      set({
        categories: response.data,
        pagination: response.meta.pagination,
        isLoading: false,
      });
    } catch (err: any) {
      console.error("categoryStore.fetchCategories error:", err);
      set({ error: err.message || "Gagal memuat daftar kategori.", isLoading: false });
    }
  },

  fetchCategoryById: async (documentId: string) => {
    set({ isLoading: true, error: null, currentCategory: null });
    try {
      const categoryData = await categoryService.getCategoryById(documentId);
      set({ currentCategory: categoryData, isLoading: false });
      return categoryData;
    } catch (err: any) {
      console.error(`categoryStore.fetchCategoryById (documentId: ${documentId}) error:`, err);
      set({ error: err.message || `Gagal memuat kategori dengan ID ${documentId}.`, isLoading: false });
      return null;
    }
  },

  createCategory: async (payload: CreateCategoryPayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const newCategory = await categoryService.createCategory(payload);
      set({ isSubmitting: false });
      get().fetchCategories(get().currentFetchParams); 
      return newCategory;
    } catch (err: any) {
      console.error("categoryStore.createCategory error:", err);
      set({ error: err.message || "Gagal membuat kategori.", isSubmitting: false });
      return null;
    }
  },

  updateCategory: async (documentId: string, payload: UpdateCategoryPayload) => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedCategory = await categoryService.updateCategory(documentId, payload);
      set(state => ({
        isSubmitting: false,
        categories: state.categories.map(cat =>
          (cat.documentId || String(cat.id)) === documentId ? updatedCategory : cat
        ),
        currentCategory: state.currentCategory?.documentId === documentId ? updatedCategory : state.currentCategory,
      }));
      return updatedCategory;
    } catch (err: any) {
      console.error(`categoryStore.updateCategory (documentId: ${documentId}) error:`, err);
      set({ error: err.message || "Gagal mengupdate kategori.", isSubmitting: false });
      return null;
    }
  },

  deleteCategory: async (documentId: string) => {
    set({ isSubmitting: true, error: null });
    try {
      await categoryService.deleteCategory(documentId);
      set(state => ({
        isSubmitting: false,
        categories: state.categories.filter(cat => (cat.documentId || String(cat.id)) !== documentId),
        currentCategory: state.currentCategory?.documentId === documentId ? null : state.currentCategory,
      }));
      return true;
    } catch (err: any) {
      console.error(`categoryStore.deleteCategory (documentId: ${documentId}) error:`, err);
      set({ error: err.message || "Gagal menghapus kategori.", isSubmitting: false });
      return false;
    }
  },

  setCurrentPage: (page: number) => {
    get().fetchCategories({ pagination: { page } });
  },

  clearError: () => set({ error: null }),
  clearCurrentCategory: () => set({ currentCategory: null }),
}));
