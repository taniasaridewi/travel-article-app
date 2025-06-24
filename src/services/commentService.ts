// src\services\commentService.ts
import apiClient from "./apiClient";
import { COMMENT_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  CommentData,
  CreateCommentPayload,
  UpdateCommentPayload,
  SingleCommentApiResponse,
} from "@/types/commentTypes";

const commentService = {
  createComment: async (
    payload: CreateCommentPayload,
  ): Promise<CommentData> => {
    try {
      const apiPayload = { data: payload };
      console.log(
        "[commentService.createComment] Payload:",
        JSON.stringify(apiPayload, null, 2),
      );
      const response = await apiClient.post<SingleCommentApiResponse>(
        COMMENT_ENDPOINTS.COMMENTS,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data komentar yang dibuat tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        "commentService.createComment error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errMsg = apiError.message || "Gagal membuat komentar.";
        if (apiError.details?.errors) {
          errMsg +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }
      throw new Error(error.message || "Gagal membuat komentar.");
    }
  },

  updateComment: async (
    documentId: string,
    payload: UpdateCommentPayload,
  ): Promise<CommentData> => {
    try {
      const apiPayload = { data: payload };
      console.log(
        `[commentService.updateComment] ID: ${documentId}, Payload:`,
        JSON.stringify(apiPayload, null, 2),
      );
      const response = await apiClient.put<SingleCommentApiResponse>(
        `${COMMENT_ENDPOINTS.COMMENTS}/${documentId}`,
        apiPayload,
      );
      if (response.data && response.data.data) {
        return response.data.data;
      } else {
        throw new Error(
          "Format data komentar yang diupdate tidak valid dari server.",
        );
      }
    } catch (error: any) {
      console.error(
        `commentService.updateComment (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errMsg = apiError.message || "Gagal mengupdate komentar.";
        if (apiError.details?.errors) {
          errMsg +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }
      throw new Error(
        error.message || `Gagal mengupdate komentar dengan ID ${documentId}.`,
      );
    }
  },

  deleteComment: async (documentId: string): Promise<CommentData | void> => {
    try {
      console.log(
        `[commentService.deleteComment] Deleting comment with documentId: ${documentId}`,
      );
      const response = await apiClient.delete<SingleCommentApiResponse | void>(
        `${COMMENT_ENDPOINTS.COMMENTS}/${documentId}`,
      );

      if (response?.data && (response.data as SingleCommentApiResponse).data) {
        return (response.data as SingleCommentApiResponse).data;
      }
    } catch (error: any) {
      console.error(
        `commentService.deleteComment (documentId: ${documentId}) error:`,
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) throw error.response.data.error;
      throw new Error(
        error.message || `Gagal menghapus komentar dengan ID ${documentId}.`,
      );
    }
  },

};

export default commentService;
