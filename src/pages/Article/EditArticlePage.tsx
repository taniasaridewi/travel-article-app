import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import ArticleForm from "@/components/articles/ArticleForm";
import { useArticleStore } from "@/store/articleStore";
import type { UpdateArticlePayload } from "@/services/articleService";
// import type { Article } from "@/types/articleTypes";
import { ArrowLeft, Loader2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

const EditArticlePage: React.FC = () => {
  const { id: articleId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const {
    updateArticle,
    fetchArticleById,
    currentArticle,
    isSubmitting,
    isLoading: isLoadingArticle,
    error,
    clearError,
    clearCurrentArticle,
  } = useArticleStore();

  const [formInitialData, setFormInitialData] = useState<
    | Partial<{
        title: string;
        description: string;
        category: string | number;
        cover_image_url?: string;
      }>
    | undefined
  >(undefined);

  useEffect(() => {
    if (articleId) {
      if (typeof clearError === "function") clearError();
      fetchArticleById(articleId, {
        populate: { category: "*" },
      }).then((article) => {
        if (article) {
          setFormInitialData({
            title: article.title,
            description: article.description,
            category: article.category?.id ? String(article.category.id) : "",
            cover_image_url: article.cover_image_url || "",
          });
        }
      });
    }

    return () => {
      if (typeof clearCurrentArticle === "function") clearCurrentArticle();
    };
  }, [articleId, fetchArticleById, clearCurrentArticle, clearError]);

  const handleSubmitUpdate = async (data: UpdateArticlePayload) => {
    if (!articleId) return;
    if (typeof clearError === "function") clearError();

    const payloadToSubmit: UpdateArticlePayload = {
      title: data.title,
      description: data.description,
      category: data.category,
      cover_image_url: data.cover_image_url || undefined,
    };

    const updatedArticle = await updateArticle(articleId, payloadToSubmit);
    if (updatedArticle) {
      toast({
        title: "Sukses!",
        description: "Artikel berhasil diperbarui.",
      });
      navigate(`/articles/${updatedArticle.documentId || articleId}`);
    } else if (error) {
      toast({
        title: "Gagal Memperbarui Artikel",
        description: error,
        variant: "destructive",
      });
    }
  };

  if (isLoadingArticle && !formInitialData && !currentArticle) {
    return (
      <div className="bg-brand-background flex min-h-screen flex-col items-center justify-center p-4 text-center">
        <Loader2 className="text-brand-primary mb-4 h-12 w-12 animate-spin" />
        <p className="text-brand-text text-lg">
          Memuat data artikel untuk diedit...
        </p>
      </div>
    );
  }

  if (error && !formInitialData && !isLoadingArticle) {
    return (
      <div className="container mx-auto max-w-xl p-4 py-10 text-center">
        <Alert
          variant="destructive"
          className="mb-6 border-red-500 bg-red-100 text-red-700"
        >
          <AlertTriangle className="h-5 w-5" />
          <AlertTitle className="font-semibold">
            Gagal Memuat Data Artikel
          </AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Link to="/articles">
          <Button
            variant="outline"
            className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
          >
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Artikel
          </Button>
        </Link>
      </div>
    );
  }

  if (!formInitialData && !isLoadingArticle && !error) {
    return (
      <div className="container mx-auto max-w-xl p-4 py-10 text-center">
        <p className="text-brand-muted mb-4 text-xl">
          Artikel yang ingin diedit tidak ditemukan.
        </p>
        <Link to="/articles">
          <Button
            variant="outline"
            className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
          >
            <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar Artikel
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="text-brand-text bg-brand-background min-h-screen py-8 antialiased">
      <div className="container mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            to={
              currentArticle
                ? `/articles/${currentArticle.documentId || articleId}`
                : "/articles"
            }
          >
            <Button
              variant="outline"
              className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 rounded-lg px-4 py-2 font-medium shadow-sm transition-all hover:shadow-md"
            >
              <ArrowLeft size={18} className="mr-2" />
              Kembali
            </Button>
          </Link>
        </div>

        <div className="bg-brand-surface border-brand-muted/20 rounded-xl border p-6 shadow-xl sm:p-8">
          <h1 className="font-heading text-brand-text border-brand-muted/30 mb-6 border-b pb-4 text-2xl font-bold sm:text-3xl">
            Edit Artikel Travel
          </h1>

          {error && isSubmitting === false && !isLoadingArticle && (
            <Alert
              variant="destructive"
              className="mb-6 border-red-500 bg-red-100 text-red-700"
            >
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle className="font-semibold">
                Gagal Memperbarui Artikel
              </AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {formInitialData ? (
            <ArticleForm
              onSubmit={handleSubmitUpdate}
              isSubmitting={isSubmitting}
              initialData={formInitialData}
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
    </div>
  );
};

export default EditArticlePage;
