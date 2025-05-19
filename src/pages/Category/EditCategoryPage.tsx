import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CategoryForm from "@/components/categories/CategoryForm";
import { useCategoryStore } from "@/store/categoryStore";
import type {
  UpdateCategoryPayload,
  CategoryData,
} from "@/types/categoryTypes";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

const EditCategoryPage: React.FC = () => {
  const { id: categoryDocumentId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    updateCategory,
    fetchCategoryById,
    currentCategory,
    isSubmitting,
    isLoading,
    error,
    clearError,
    clearCurrentCategory,
  } = useCategoryStore();

  const [formInitialData, setFormInitialData] = useState<
    Partial<CategoryData> | undefined
  >(undefined);

  useEffect(() => {
    if (categoryDocumentId) {
      if (typeof clearError === "function") clearError();
      console.log(
        `[EditCategoryPage] Fetching category with documentId: ${categoryDocumentId}`,
      );
      fetchCategoryById(categoryDocumentId);
    }
    return () => {
      if (typeof clearCurrentCategory === "function") {
        console.log(`[EditCategoryPage] Cleanup: Clearing current category.`);
        clearCurrentCategory();
      }
    };
  }, [categoryDocumentId, fetchCategoryById, clearCurrentCategory, clearError]);

  useEffect(() => {
    if (currentCategory && currentCategory.documentId === categoryDocumentId) {
      console.log(
        "[EditCategoryPage] currentCategory updated and matches ID. Setting formInitialData:",
        currentCategory,
      );
      setFormInitialData({
        name: currentCategory.name,
        description: currentCategory.description || "",
      });
    } else if (!isLoading && categoryDocumentId && !currentCategory && !error) {
      console.log(
        "[EditCategoryPage] Category not found or currentCategory is null after fetch attempt.",
      );
      setFormInitialData(undefined);
    }
  }, [currentCategory, categoryDocumentId, isLoading, error]);

  const handleSubmitUpdate = async (data: UpdateCategoryPayload) => {
    if (!categoryDocumentId) return;
    if (typeof clearError === "function") clearError();

    const updatedCategory = await updateCategory(categoryDocumentId, data);
    if (updatedCategory) {
      toast({
        title: "Sukses!",
        description: "Kategori berhasil diperbarui.",
      });
      navigate("/categories");
    } else if (error) {
      toast({
        title: "Gagal Memperbarui Kategori",
        description: error,
        variant: "destructive",
      });
    }
  };

  if (isLoading && !formInitialData) {
    return (
      <div className="bg-brand-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Loader2 className="text-brand-primary mb-4 h-12 w-12 animate-spin" />
        <p className="text-brand-text text-lg">Memuat data kategori...</p>
      </div>
    );
  }

  if (error && !isLoading && !formInitialData) {
    return (
      <div className="container mx-auto max-w-xl p-4 py-10 text-center">
        <Alert
          variant="destructive"
          className="mb-6 border-red-500 bg-red-100 text-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">
            Gagal Memuat Data Kategori
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link to="/categories">
          <Button
            variant="outline"
            className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
          >
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Kategori
          </Button>
        </Link>
      </div>
    );
  }

  if (!isLoading && !error && !formInitialData && categoryDocumentId) {
    return (
      <div className="container mx-auto max-w-xl p-4 py-10 text-center">
        <p className="text-brand-muted mb-4 text-xl">
          Kategori yang ingin diedit tidak ditemukan.
        </p>
        <Link to="/categories">
          <Button
            variant="outline"
            className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
          >
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Kategori
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-brand-text bg-brand-background min-h-screen py-8 antialiased">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/categories">
            <Button
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg px-4 py-2 font-medium shadow-sm transition-all hover:shadow-md"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Daftar Kategori
            </Button>
          </Link>
        </div>

        {error && isSubmitting === false && !isLoading && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-500 bg-red-100 text-red-700"
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              Gagal Memperbarui Kategori
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {formInitialData ? (
          <CategoryForm
            onSubmit={handleSubmitUpdate}
            isSubmitting={isSubmitting}
            initialData={formInitialData}
            formTitle="Edit Kategori"
            submitButtonText="Simpan Perubahan"
          />
        ) : (
          !error && (
            <div className="py-10 text-center">
              <Loader2 className="text-brand-primary mx-auto h-8 w-8 animate-spin" />
              <p className="text-brand-muted mt-2">Menyiapkan form edit...</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default EditCategoryPage;
