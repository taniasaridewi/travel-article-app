import React, { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import { useArticleStore } from "@/store/articleStore";
import ModalDialog from "@/components/common/ModalDialog";
import ArticleForm from "@/components/articles/ArticleForm";
import type {
  CreateArticlePayload,
  UpdateArticlePayload,
} from "@/services/articleService";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ArticleModals: React.FC = () => {
  const { currentOpenModal, modalData, closeModal } = useModalStore();
  const { toast } = useToast();
  const {
    createArticle,
    updateArticle,
    fetchArticleById,
    currentArticle,
    isLoading: isLoadingArticleDetail,
    isSubmitting,
    clearCurrentArticle,
    clearError: clearArticleStoreError,
    error: articleStoreError,
  } = useArticleStore();

  const isCreateMode = currentOpenModal === "createArticle";
  const isEditMode = currentOpenModal === "editArticle";
  const articleIdToEdit = isEditMode
    ? (modalData?.itemId as string)
    : undefined;

  useEffect(() => {
    if (isEditMode && articleIdToEdit) {
      if (!currentArticle || currentArticle.documentId !== articleIdToEdit) {
        if (typeof clearArticleStoreError === "function")
          clearArticleStoreError();
        fetchArticleById(articleIdToEdit, { populate: { category: "*" } });
      }
    }
    return () => {
      if (!isEditMode && currentArticle) {
        if (typeof clearCurrentArticle === "function") clearCurrentArticle();
      }
    };
  }, [
    isEditMode,
    articleIdToEdit,
    fetchArticleById,
    currentArticle,
    clearCurrentArticle,
    clearArticleStoreError,
  ]);

  const handleCreateSubmit = async (data: CreateArticlePayload) => {
    if (typeof clearArticleStoreError === "function") clearArticleStoreError();
    const newArticle = await createArticle(data);
    if (newArticle) {
      toast({
        title: "Sukses!",
        description: "Artikel baru berhasil dibuat.",
        variant: "success",
      });
      closeModal();
    } else if (articleStoreError) {
      toast({
        title: "Gagal Membuat Artikel",
        description: articleStoreError,
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (data: UpdateArticlePayload) => {
    if (!articleIdToEdit) return;
    if (typeof clearArticleStoreError === "function") clearArticleStoreError();
    const updatedArticle = await updateArticle(articleIdToEdit, data);
    if (updatedArticle) {
      toast({
        title: "Sukses!",
        description: "Artikel berhasil diperbarui.",
        variant: "default",
      });
      closeModal();
    } else if (articleStoreError) {
      toast({
        title: "Gagal Memperbarui Artikel",
        description: articleStoreError,
        variant: "destructive",
      });
    }
  };

  const getInitialDataForEdit = () => {
    if (
      isEditMode &&
      currentArticle &&
      currentArticle.documentId === articleIdToEdit
    ) {
      return {
        title: currentArticle.title,
        description: currentArticle.description,
        category: currentArticle.category?.id
          ? String(currentArticle.category.id)
          : "",
        cover_image_url: currentArticle.cover_image_url || "",
      };
    }
    return undefined;
  };

  const initialData = getInitialDataForEdit();

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      if (typeof clearArticleStoreError === "function")
        clearArticleStoreError();
      if (isEditMode && typeof clearCurrentArticle === "function") {
        clearCurrentArticle();
      }
    }
  };

  return (
    <>
      <ModalDialog
        isOpen={isCreateMode}
        onOpenChange={handleModalOpenChange}
        title="Buat Artikel Baru"
        description="Isi detail artikel perjalanan Anda di bawah ini."
        className="sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        <ArticleForm
          onSubmit={handleCreateSubmit}
          isSubmitting={isSubmitting}
          submitButtonText="Publikasikan Artikel"
        />
      </ModalDialog>

      <ModalDialog
        isOpen={isEditMode}
        onOpenChange={handleModalOpenChange}
        title="Edit Artikel"
        description="Perbarui detail artikel perjalanan Anda."
        className="sm:max-w-lg md:max-w-xl lg:max-w-2xl"
      >
        {isLoadingArticleDetail && isEditMode && !initialData && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="text-brand-primary h-8 w-8 animate-spin" />
            <p className="text-brand-text ml-3">Memuat data artikel...</p>
          </div>
        )}
        {!isLoadingArticleDetail &&
          isEditMode &&
          !initialData &&
          articleIdToEdit &&
          articleStoreError && (
            <p className="py-4 text-center text-red-600">{articleStoreError}</p>
          )}
        {!isLoadingArticleDetail &&
          isEditMode &&
          !initialData &&
          articleIdToEdit &&
          !articleStoreError && (
            <p className="text-brand-muted py-4 text-center">
              Artikel tidak ditemukan atau gagal dimuat.
            </p>
          )}
        {isEditMode && initialData && (
          <ArticleForm
            onSubmit={handleEditSubmit}
            isSubmitting={isSubmitting}
            initialData={initialData}
            submitButtonText="Simpan Perubahan"
          />
        )}
      </ModalDialog>
    </>
  );
};

export default ArticleModals;
