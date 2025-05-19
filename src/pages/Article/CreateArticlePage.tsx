import React from "react";
import { Link, useNavigate } from "react-router-dom";
import ArticleForm from "@/components/articles/ArticleForm";
import { useArticleStore } from "@/store/articleStore";
import type { CreateArticlePayload } from "@/services/articleService";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const CreateArticlePage: React.FC = () => {
  const navigate = useNavigate();
  const { createArticle, isSubmitting, error, clearError } = useArticleStore();

  const handleSubmitArticle = async (data: CreateArticlePayload) => {
    if (typeof clearError === "function") {
      clearError();
    } else {
      console.error("clearError is not a function in CreateArticlePage");
    }

    const newArticle = await createArticle(data);
    if (newArticle) {
      alert("Artikel berhasil dibuat!");
      navigate(`/articles/${newArticle.documentId || newArticle.id}`);
    }
  };

  return (
    <div className="text-brand-text bg-brand-background min-h-screen py-8 antialiased">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/articles">
            <Button
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg px-4 py-2 font-medium shadow-sm transition-all hover:shadow-md"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali ke Daftar Artikel
            </Button>
          </Link>
        </div>

        <div className="bg-brand-surface border-brand-muted/20 rounded-xl border p-6 shadow-xl sm:p-8">
          <h1 className="font-heading text-brand-text border-brand-muted/30 mb-6 border-b pb-4 text-2xl font-bold sm:text-3xl">
            Buat Artikel Travel Baru
          </h1>

          {error && !isSubmitting && (
            <Alert
              variant="destructive"
              className="mb-6 border-red-500 bg-red-100 text-red-700"
            >
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">
                Gagal Membuat Artikel
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <ArticleForm
            onSubmit={handleSubmitArticle}
            isSubmitting={isSubmitting}
            submitButtonText="Publikasikan Artikel"
          />

          {isSubmitting && (
            <div className="text-brand-primary mt-6 flex items-center">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              <span>Menyimpan artikel...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateArticlePage;
