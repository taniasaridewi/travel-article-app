import React, { useEffect } from "react";
import { useModalStore } from "@/store/modalStore";
import { useCategoryStore } from "@/store/categoryStore";
import ModalDialog from "@/components/common/ModalDialog";
import CategoryForm from "@/components/categories/CategoryForm";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryData,
} from "@/types/categoryTypes";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CategoryModals: React.FC = () => {
  const { currentOpenModal, modalData, closeModal } = useModalStore();
  const { toast } = useToast();
  const {
    createCategory,
    updateCategory,
    fetchCategoryById,
    currentCategory,
    isLoading: isLoadingCategoryDetail,
    isSubmitting,
    clearCurrentCategory,
    clearError: clearCategoryStoreError,
    error: categoryStoreError,
  } = useCategoryStore();

  const isCreateMode = currentOpenModal === "createCategory";
  const isEditMode = currentOpenModal === "editCategory";
  const categoryIdToEdit = isEditMode
    ? (modalData?.itemId as string)
    : undefined;

  useEffect(() => {
    if (isEditMode && categoryIdToEdit) {
      if (!currentCategory || currentCategory.documentId !== categoryIdToEdit) {
        if (typeof clearCategoryStoreError === "function")
          clearCategoryStoreError();
        fetchCategoryById(categoryIdToEdit);
      }
    }
    return () => {
      if (!isEditMode && currentCategory) {
        if (typeof clearCurrentCategory === "function") clearCurrentCategory();
      }
    };
  }, [
    isEditMode,
    categoryIdToEdit,
    fetchCategoryById,
    currentCategory,
    clearCurrentCategory,
    clearCategoryStoreError,
  ]);

  const handleCreateSubmit = async (data: CreateCategoryPayload | UpdateCategoryPayload) => {
    if (typeof clearCategoryStoreError === "function")
      clearCategoryStoreError();

    // Type guard to ensure we have the required fields for creation
    if (!data.name) {
      toast({
        title: "Error",
        description: "Name is required for category creation.",
        variant: "destructive",
      });
      return;
    }

    const createPayload: CreateCategoryPayload = {
      name: data.name,
      description: data.description,
    };

    const newCategory = await createCategory(createPayload);
    if (newCategory) {
      toast({
        title: "Sukses!",
        description: "Kategori baru berhasil dibuat.",
        variant: "default",
      });
      closeModal();
    } else if (categoryStoreError) {
      toast({
        title: "Gagal Membuat Kategori",
        description: categoryStoreError,
        variant: "destructive",
      });
    }
  };

  const handleEditSubmit = async (data: CreateCategoryPayload | UpdateCategoryPayload) => {
    if (!categoryIdToEdit) return;
    if (typeof clearCategoryStoreError === "function")
      clearCategoryStoreError();

    const updatePayload: UpdateCategoryPayload = {
      name: data.name,
      description: data.description,
    };

    const updatedCategory = await updateCategory(categoryIdToEdit, updatePayload);
    if (updatedCategory) {
      toast({
        title: "Sukses!",
        description: "Kategori berhasil diperbarui.",
        variant: "default",
      });
      closeModal();
    } else if (categoryStoreError) {
      toast({
        title: "Gagal Memperbarui Kategori",
        description: categoryStoreError,
        variant: "destructive",
      });
    }
  };

  const getInitialDataForEditForm = (): Partial<CategoryData> | undefined => {
    if (
      isEditMode &&
      currentCategory &&
      currentCategory.documentId === categoryIdToEdit
    ) {
      return {
        name: currentCategory.name,
        description: currentCategory.description || "",
      };
    }
    return undefined;
  };
  const initialFormData = getInitialDataForEditForm();

  const handleModalOpenChange = (open: boolean) => {
    if (!open) {
      closeModal();
      if (typeof clearCategoryStoreError === "function")
        clearCategoryStoreError();
      if (isEditMode && typeof clearCurrentCategory === "function") {
        clearCurrentCategory();
      }
    }
  };

  return (
    <>
      <ModalDialog
        isOpen={isCreateMode}
        onOpenChange={handleModalOpenChange}
        title="Buat Kategori Baru"
        description="Masukkan nama dan deskripsi untuk kategori baru."
        className="sm:max-w-md"
      >
        <CategoryForm
          onSubmit={handleCreateSubmit}
          isSubmitting={isSubmitting}
          formTitle="Buat Kategori Baru"
          submitButtonText="Simpan Kategori"
        />
      </ModalDialog>

      <ModalDialog
        isOpen={isEditMode}
        onOpenChange={handleModalOpenChange}
        title="Edit Kategori"
        description="Perbarui nama atau deskripsi kategori ini."
        className="sm:max-w-md"
      >
        {isLoadingCategoryDetail && isEditMode && !initialFormData && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="text-brand-primary h-8 w-8 animate-spin" />
            <p className="text-brand-text ml-3">Memuat data kategori...</p>
          </div>
        )}
        {!isLoadingCategoryDetail &&
          isEditMode &&
          !initialFormData &&
          categoryIdToEdit &&
          categoryStoreError && (
            <p className="py-4 text-center text-red-600">
              {categoryStoreError}
            </p>
          )}
        {!isLoadingCategoryDetail &&
          isEditMode &&
          !initialFormData &&
          categoryIdToEdit &&
          !categoryStoreError && (
            <p className="text-brand-muted py-4 text-center">
              Kategori tidak ditemukan atau gagal dimuat.
            </p>
          )}
        {isEditMode && initialFormData && (
          <CategoryForm
            onSubmit={handleEditSubmit}
            isSubmitting={isSubmitting}
            initialData={initialFormData}
            formTitle="Edit Kategori"
            submitButtonText="Simpan Perubahan"
          />
        )}
      </ModalDialog>
    </>
  );
};

export default CategoryModals;