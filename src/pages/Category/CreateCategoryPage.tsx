// src\pages\Category\CreateCategoryPage.tsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryForm from "@/components/categories/CategoryForm";
import { useCategoryStore } from "@/store/categoryStore";
import type { CreateCategoryPayload, UpdateCategoryPayload } from "@/types/categoryTypes";
import { ArrowLeft, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateCategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { createCategory, isSubmitting, error, clearError } =
    useCategoryStore();

  const handleSubmitCategory = async (
  data: CreateCategoryPayload | UpdateCategoryPayload
) => {
  if (!data.name) {
    console.error("Field 'name' wajib diisi.");
    return;
  }

  if (typeof clearError === "function") {
    clearError();
  } else {
    console.error("clearError is not a function in CreateCategoryPage");
  }

  const createPayload: CreateCategoryPayload = {
    name: data.name,
    description: data.description,
  };

  const newCategory = await createCategory(createPayload);
  if (newCategory) {
    alert("Kategori berhasil dibuat!");
    navigate("/categories");
  }
};

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

        {error && !isSubmitting && (
          <Alert
            variant="destructive"
            className="mb-6 border-red-500 bg-red-100 text-red-700"
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="font-semibold">
              Gagal Membuat Kategori
            </AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <CategoryForm
          onSubmit={handleSubmitCategory}
          isSubmitting={isSubmitting}
          formTitle="Buat Kategori Baru"
          submitButtonText="Simpan Kategori Baru"
        />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
