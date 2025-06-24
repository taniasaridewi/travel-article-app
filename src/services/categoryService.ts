// src\services\categoryService.ts
import apiClient from "./apiClient";
import { CATEGORY_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  CategoryData,
  CategoriesApiResponse,
  SingleCategoryApiResponse,
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryMutationResponse,
} from "@/types/categoryTypes";

const categoryService = {
  getCategories: async (params?: {
    pagination?: { page?: number; pageSize?: number };
  }): Promise<CategoriesApiResponse> => {
    try {
      const response = await apiClient.get<CategoriesApiResponse>(
        CATEGORY_ENDPOINTS.CATEGORIES,
        { params },
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "categoryService.getCategories error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(error.message || "Gagal mengambil daftar kategori.");
    }
  },

  getCategoryById: async (documentId: string): Promise<CategoryData> => {
    try {
      const response = await apiClient.get<SingleCategoryApiResponse>(
        `${CATEGORY_ENDPOINTS.CATEGORIES}/${documentId}`,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data kategori tunggal tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        `categoryService.getCategoryById (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(
        error.message || `Gagal mengambil kategori dengan ID ${documentId}.`,
      );
    }
  },

  createCategory: async (
    payload: CreateCategoryPayload,
  ): Promise<CategoryData> => {
    try {
      const apiPayload = { data: payload };
      const response = await apiClient.post<CategoryMutationResponse>(
        CATEGORY_ENDPOINTS.CATEGORIES,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data kategori yang dibuat tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        "categoryService.createCategory error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errMsg = apiError.message || "Gagal membuat kategori.";
        if (apiError.details?.errors) {
          errMsg +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }
      throw new Error(error.message || "Gagal membuat kategori.");
    }
  },

  updateCategory: async (
    documentId: string,
    payload: UpdateCategoryPayload,
  ): Promise<CategoryData> => {
    try {
      const apiPayload = { data: payload };
      const response = await apiClient.put<CategoryMutationResponse>(
        `${CATEGORY_ENDPOINTS.CATEGORIES}/${documentId}`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data kategori yang diupdate tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        `categoryService.updateCategory (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errMsg = apiError.message || "Gagal mengupdate kategori.";
        if (apiError.details?.errors) {
          errMsg +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }
      throw new Error(
        error.message || `Gagal mengupdate kategori dengan ID ${documentId}.`,
      );
    }
  },

  deleteCategory: async (documentId: string): Promise<CategoryData | void> => {
    try {
      const response = await apiClient.delete<CategoryMutationResponse | void>(
        `${CATEGORY_ENDPOINTS.CATEGORIES}/${documentId}`,
      );

      if (response && response.data && (response.data as CategoryMutationResponse).data) {
        return (response.data as CategoryMutationResponse).data;
      }
    } catch (error: any) {
      console.error(
        `categoryService.deleteCategory (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(
        error.message || `Gagal menghapus kategori dengan ID ${documentId}.`,
      );
    }
  },
};

export default categoryService;
