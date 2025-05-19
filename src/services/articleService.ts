import apiClient from "./apiClient";
import { ARTICLE_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  ArticlesApiResponse,
  GetArticlesParams,
  Article,
} from "@/types/articleTypes";
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
    } catch (error: any) {
      console.error(
        "articleService.getArticles error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(error.message || "Gagal mengambil daftar artikel.");
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
    } catch (error: any) {
      console.error(
        `articleService.getArticleById (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(
        error.message || `Gagal mengambil artikel dengan ID ${documentId}.`,
      );
    }
  },

  createArticle: async (payload: CreateArticlePayload): Promise<Article> => {
    try {
      const apiPayload = { data: payload };
      const response = await apiClient.post<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}?populate=user,category`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data artikel yang dibuat tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        "articleService.createArticle error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errorMessage = apiError.message || "Gagal membuat artikel.";
        if (apiError.details?.errors)
          errorMessage +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        throw new Error(errorMessage);
      } else if (error.response?.data?.message)
        throw new Error(error.response.data.message);
      throw new Error(error.message || "Gagal membuat artikel.");
    }
  },

  updateArticle: async (
    documentId: string,
    payload: UpdateArticlePayload,
  ): Promise<Article> => {
    try {
      const apiPayload = { data: payload };
      const populateParams = "populate[user]=*&populate[category]=*";
      const response = await apiClient.put<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}/${documentId}?${populateParams}`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data artikel yang diupdate tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        `articleService.updateArticle (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errorMessage = apiError.message || "Gagal mengupdate artikel.";
        if (apiError.details?.errors)
          errorMessage +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        throw new Error(errorMessage);
      } else if (error.response?.data?.message)
        throw new Error(error.response.data.message);
      throw new Error(
        error.message || `Gagal mengupdate artikel dengan ID ${documentId}.`,
      );
    }
  },

  deleteArticle: async (documentId: string): Promise<Article | void> => {
    try {
      const response = await apiClient.delete<ArticleMutationResponse>(
        `${ARTICLE_ENDPOINTS.ARTICLES}/${documentId}`,
      );
      if (response.data && response.data.data) return response.data.data;
    } catch (error: any) {
      console.error(
        `articleService.deleteArticle (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errorMessage = apiError.message || "Gagal menghapus artikel.";
        if (apiError.details?.errors)
          errorMessage +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        throw new Error(errorMessage);
      } else if (error.response?.data?.message)
        throw new Error(error.response.data.message);
      throw new Error(
        error.message || `Gagal menghapus artikel dengan ID ${documentId}.`,
      );
    }
  },
};

export default articleService;
