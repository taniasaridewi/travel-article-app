// src\services\articleService.ts
import apiClient from "./apiClient";
import { ARTICLE_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ArticlesApiResponse,
  GetArticlesParams,
  Article,
} from "@/types/articleTypes";

// Error types
interface ApiErrorDetail {
  message: string;
}

interface ApiError {
  message?: string;
  details?: {
    errors?: ApiErrorDetail[];
  };
}

interface ErrorResponse {
  response?: {
    data?: {
      error?: ApiError;
      message?: string;
    };
  };
  message?: string;
}

export interface CreateArticlePayload {
  title: string;
  description: string;
  category: number;
  cover_image_url?: string;
}

export interface UpdateArticlePayload {
  title?: string;
  description?: string;
  category?: number;
  cover_image_url?: string;
}

interface SingleArticleApiResponse {
  data: Article;
  meta: object;
}

interface ArticleMutationResponse {
  data: Article;
  meta?: object;
  message?: string;
}

const articleService = {
  getArticles: async (
    params?: GetArticlesParams,
  ): Promise<ArticlesApiResponse> => {
    try {
      const queryParams: GetArticlesParams = { populate: "*", ...params };
      const response = await apiClient.get<ArticlesApiResponse>(
        ARTICLE_ENDPOINTS.ARTICLES,
        { params: queryParams },
      );
      return response.data;
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(
        "articleService.getArticles error:",
        err.response?.data || err.message || error,
      );
      if (err.response?.data?.error) throw err.response.data.error;
      throw new Error(err.message || "Gagal mengambil daftar artikel.");
    }
  },

  getArticleById: async (
    documentId: string,
    params?: { populate?: GetArticlesParams["populate"] },
  ): Promise<Article> => {
    try {
      const queryParams = { populate: "*", ...params };
      const response = await apiClient.get<SingleArticleApiResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}/${documentId}`,
        { params: queryParams },
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error("Format data artikel tunggal tidak valid dari server.");
      }
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(
        `articleService.getArticleById (documentId: ${documentId}) error:`,
        err.response?.data || err.message || error,
      );
      if (err.response?.data?.error) throw err.response.data.error;
      throw new Error(
        err.message || `Gagal mengambil artikel dengan ID ${documentId}.`,
      );
    }
  },

  createArticle: async (payload: CreateArticlePayload): Promise<Article> => {
    try {
      const apiPayload = { data: payload };
      const response = await apiClient.post<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data artikel yang dibuat tidak valid dari server.",
        );
      }
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(
        "articleService.createArticle error:",
        err.response?.data || err.message || error,
      );
      if (err.response?.data?.error) {
        const apiError = err.response.data.error;
        let errorMessage = apiError.message || "Gagal membuat artikel.";
        if (apiError.details?.errors) {
          errorMessage +=
            ": " +
            apiError.details.errors.map((e) => e.message).join(", ");
        }
        throw new Error(errorMessage);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error(err.message || "Gagal membuat artikel.");
    }
  },

  updateArticle: async (
    documentId: string,
    payload: UpdateArticlePayload,
  ): Promise<Article> => {
    try {
      const apiPayload = { data: payload };
      // const populateParams = "populate[user]=*&populate[category]=*";
      const response = await apiClient.put<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}/${documentId}`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data artikel yang diupdate tidak valid dari server.",
        );
      }
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(
        `articleService.updateArticle (documentId: ${documentId}) error:`,
        err.response?.data || err.message || error,
      );
      if (err.response?.data?.error) {
        const apiError = err.response.data.error;
        let errorMessage = apiError.message || "Gagal mengupdate artikel.";
        if (apiError.details?.errors) {
          errorMessage +=
            ": " +
            apiError.details.errors.map((e) => e.message).join(", ");
        }
        throw new Error(errorMessage);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error(
        err.message || `Gagal mengupdate artikel dengan ID ${documentId}.`,
      );
    }
  },

  deleteArticle: async (documentId: string): Promise<Article | void> => {
    try {
      const response = await apiClient.delete<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}/${documentId}`,
      );
      if (response.data && response.data.data) return response.data.data;
    } catch (error) {
      const err = error as ErrorResponse;
      console.error(
        `articleService.deleteArticle (documentId: ${documentId}) error:`,
        err.response?.data || err.message || error,
      );
      if (err.response?.data?.error) {
        const apiError = err.response.data.error;
        let errorMessage = apiError.message || "Gagal menghapus artikel.";
        if (apiError.details?.errors) {
          errorMessage +=
            ": " +
            apiError.details.errors.map((e) => e.message).join(", ");
        }
        throw new Error(errorMessage);
      } else if (err.response?.data?.message) {
        throw new Error(err.response.data.message);
      }
      throw new Error(
        err.message || `Gagal menghapus artikel dengan ID ${documentId}.`,
      );
    }
  },
};

export default articleService;