import apiClient from "./apiClient";
import { UPLOAD_ENDPOINT } from "@/constants/apiEndpoints";
import type { FileUploadApiResponse } from "@/types/fileTypes";

const fileService = {
  uploadFiles: async (
    files: FileList | File[],
  ): Promise<FileUploadApiResponse> => {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      console.log("[fileService.uploadFiles] Uploading files...");
      const response = await apiClient.post<FileUploadApiResponse>(
        UPLOAD_ENDPOINT,
        formData,
        {
          headers: {},
        },
      );
      console.log(
        "[fileService.uploadFiles] Upload successful:",
        response.data,
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "fileService.uploadFiles error:",
        error.response?.data || error.message || error,
      );
      if (error.response?.data?.error) {
        const apiError = error.response.data.error;
        let errMsg = apiError.message || "Gagal mengupload file.";
        if (apiError.details?.errors) {
          errMsg +=
            ": " +
            apiError.details.errors.map((e: any) => e.message).join(", ");
        }
        throw new Error(errMsg);
      }
      throw new Error(error.message || "Gagal mengupload file.");
    }
  },
};

export default fileService;
