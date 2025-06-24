import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useArticleStore } from "@/store/articleStore";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import {
  ArrowLeft,
  CalendarDays,
  UserCircle,
  Tag,
  MessageSquare,
  // Share2,
  Edit,
  Trash2,
  Loader2,
  AlertTriangle,
  Send,
  Check,
  X,
  Pencil,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import type {
  CreateCommentPayload,
  UpdateCommentPayload,
  CommentData,
} from "@/types/commentTypes";
import { Label } from "@/components/ui/label";

const ArticleDetailPage: React.FC = () => {
  const { id: articleIdFromParams } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { openModal } = useModalStore();
  const {
    currentArticle,
    isLoading,
    error: articleError,
    fetchArticleById,
    clearCurrentArticle,
    deleteArticle,
    isSubmitting: isArticleSubmitting,
    addComment,
    editComment,
    removeComment,
    isSubmittingComment,
    commentError,
    clearCommentError,
    clearError: clearArticleError,
  } = useArticleStore();
  const authUser = useAuthStore((state) => state.user);

  const [newCommentContent, setNewCommentContent] = useState("");
  const [editingComment, setEditingComment] = useState<CommentData | null>(
    null,
  );
  const [editCommentContent, setEditCommentContent] = useState("");

  useEffect(() => {
    if (articleIdFromParams) {
      if (
        currentArticle === null ||
        currentArticle.documentId !== articleIdFromParams
      ) {
        console.log(
          `[DetailPage] Fetching article with ID: ${articleIdFromParams}`,
        );
        if (typeof clearArticleError === "function") clearArticleError();
        if (typeof clearCommentError === "function") clearCommentError();

        fetchArticleById(articleIdFromParams, {
          populate: {
            user: "*",
            category: "*",
            comments: { populate: { user: "*" } },
          },
        });
      }
    }

    return () => {
      console.log(
        "[DetailPage] Cleanup: articleIdFromParams may have changed or component unmounted.",
      );
      if (typeof clearCurrentArticle === "function") {
        // clearCurrentArticle(); // Dikomentari untuk mencegah "Artikel tidak ditemukan" prematur
      }
    };
  }, [
    articleIdFromParams,
    fetchArticleById,
    clearArticleError,
    clearCommentError,
    currentArticle,
    clearCurrentArticle,
  ]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Tanggal tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleSocialShare = (
    platform: "facebook" | "twitter" | "linkedin" | "copy",
  ) => {
    if (!currentArticle) return;
    const articleUrl = window.location.href;
    const articleTitle = currentArticle.title;
    let shareUrl = "";
    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(articleUrl)}`;
        break;
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(articleUrl)}&text=${encodeURIComponent(articleTitle)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(articleUrl)}&title=${encodeURIComponent(articleTitle)}`;
        break;
      case "copy":
        navigator.clipboard
          .writeText(articleUrl)
          .then(() => alert("Link artikel berhasil disalin!"))
          .catch((err) => console.error("Gagal menyalin link:", err));
        return;
    }
    if (shareUrl) window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const handleTriggerEditArticleModal = () => {
    if (currentArticle?.documentId) {
      openModal("editArticle", { itemId: currentArticle.documentId });
    }
  };

  const handleDeleteArticle = async () => {
    if (
      currentArticle?.documentId &&
      window.confirm(
        "Apakah Anda yakin ingin menghapus artikel ini? Tindakan ini tidak dapat diurungkan.",
      )
    ) {
      if (typeof clearArticleError === "function") clearArticleError();
      const success = await deleteArticle(currentArticle.documentId);
      if (success) {
        alert("Artikel berhasil dihapus.");
        navigate("/articles");
      }
    }
  };

  const handleAddComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newCommentContent.trim() || !currentArticle || !authUser) return;
    if (typeof clearCommentError === "function") clearCommentError();

    const payload: CreateCommentPayload = {
      content: newCommentContent.trim(),
      article: currentArticle.id,
    };

    const addedComment = await addComment(payload);
    if (addedComment) {
      setNewCommentContent("");
    }
  };

  const handleRemoveComment = async (commentDocumentId: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus komentar ini?")) {
      if (typeof clearCommentError === "function") clearCommentError();
      await removeComment(commentDocumentId);
    }
  };

  const handleStartEditComment = (comment: CommentData) => {
    setEditingComment(comment);
    setEditCommentContent(comment.content);
    if (typeof clearCommentError === "function") clearCommentError();
  };

  const handleCancelEditComment = () => {
    setEditingComment(null);
    setEditCommentContent("");
  };

  const handleSaveEditComment = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editingComment || !editCommentContent.trim()) return;
    if (typeof clearCommentError === "function") clearCommentError();

    const payload: UpdateCommentPayload = {
      content: editCommentContent.trim(),
    };
    const updated = await editComment(editingComment.documentId, payload);
    if (updated) {
      setEditingComment(null);
      setEditCommentContent("");
    }
  };

  if (
    isLoading &&
    (!currentArticle || currentArticle.documentId !== articleIdFromParams)
  ) {
    return (
      <div className="bg-brand-background flex min-h-[calc(100vh-var(--header-height,80px))] flex-col items-center justify-center p-4 text-center">
        {" "}
        <Loader2 className="text-brand-primary mb-6 h-16 w-16 animate-spin" />{" "}
        <p className="text-brand-text text-xl font-medium">
          Memuat detail artikel...
        </p>{" "}
      </div>
    );
  }

  if (
    articleError &&
    !isLoading &&
    (!currentArticle || currentArticle.documentId !== articleIdFromParams)
  ) {
    return (
      <div className="bg-brand-background flex min-h-[calc(100vh-var(--header-height,80px))] items-center justify-center p-4">
        {" "}
        <div className="container mx-auto max-w-lg text-center">
          {" "}
          <div
            className="rounded-lg border-l-4 border-red-500 bg-red-100 p-6 text-red-700 shadow-lg"
            role="alert"
          >
            {" "}
            <div className="flex flex-col items-center">
              {" "}
              <AlertTriangle className="mb-3 h-12 w-12 text-red-500" />{" "}
              <p className="mb-2 text-2xl font-bold">Gagal Memuat Artikel</p>{" "}
              <p className="mb-4 text-lg">{articleError}</p>{" "}
              <Link to="/articles">
                {" "}
                <Button
                  variant="outline"
                  className="border-red-600 text-red-700 hover:bg-red-100 hover:text-red-700 focus:ring-red-500"
                >
                  {" "}
                  <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar
                  Artikel{" "}
                </Button>{" "}
              </Link>{" "}
            </div>{" "}
          </div>{" "}
        </div>{" "}
      </div>
    );
  }

  if (
    !isLoading &&
    !articleError &&
    (!currentArticle || currentArticle.documentId !== articleIdFromParams)
  ) {
    return (
      <div className="bg-brand-background flex min-h-[calc(100vh-var(--header-height,80px))] items-center justify-center p-4">
        {" "}
        <div className="container mx-auto max-w-md text-center">
          {" "}
          <h2 className="text-brand-muted mb-6 text-3xl font-semibold">
            Artikel tidak ditemukan.
          </h2>{" "}
          <Link to="/articles">
            {" "}
            <Button
              variant="default"
              className="bg-brand-primary text-white hover:bg-opacity-80"
            >
              {" "}
              <ArrowLeft size={18} className="mr-2" /> Kembali ke Daftar
              Artikel{" "}
            </Button>{" "}
          </Link>{" "}
        </div>{" "}
      </div>
    );
  }

  if (!currentArticle) {
    return (
      <div className="text-brand-muted p-10 text-center">
        Memuat atau artikel tidak valid...
      </div>
    );
  }

  const isArticleOwner =
    authUser && currentArticle.user && authUser.id === currentArticle.user.id;
  const contentHorizontalPadding = "px-6 sm:px-8 md:px-10 lg:px-12";

  return (
    <div className="container mx-auto px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
      <div className="mb-6">
        <Link to="/articles">
          <Button
            variant="outline"
            className="border-brand-primary/50 text-brand-primary hover:bg-brand-primary/10 rounded-lg px-3 py-2 font-medium shadow-sm transition-all hover:shadow-md"
          >
            <ArrowLeft size={18} className="mr-2" />
            Kembali ke Semua Artikel
          </Button>
        </Link>
      </div>

      <article className="bg-brand-surface overflow-hidden rounded-xl shadow-2xl">
        {articleError && isArticleSubmitting === false && (
          <div className={`${contentHorizontalPadding} pt-6`}>
            <Alert variant="destructive" className="mb-6">
              <AlertTriangle className="h-5 w-5" />
              <AlertTitle>Terjadi Kesalahan Artikel</AlertTitle>
              <AlertDescription>{articleError}</AlertDescription>
            </Alert>
          </div>
        )}

        {currentArticle.cover_image_url && (
          <div className="aspect-[16/7] w-full overflow-hidden rounded-t-xl bg-slate-200 sm:aspect-[16/6] md:aspect-[16/5]">
            <img
              src={currentArticle.cover_image_url}
              alt={`Gambar sampul untuk ${currentArticle.title}`}
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  `https://placehold.co/1200x400/e2e8f0/94a3b8?text=Gambar+Tidak+Tersedia`;
                (e.target as HTMLImageElement).alt = "Gambar tidak tersedia";
              }}
            />
          </div>
        )}

        <div className={`${contentHorizontalPadding} py-8 sm:py-10 md:py-12`}>
          <h1 className="font-heading text-brand-text mb-5 text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
            {currentArticle.title || "Judul Tidak Tersedia"}
          </h1>

          <div className="text-brand-muted mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <div className="flex items-center">
              <UserCircle size={18} className="text-brand-primary mr-1.5" />
              <span className="text-brand-text font-medium">
                {currentArticle.user?.username ||
                  currentArticle.user?.email ||
                  "Penulis Anonim"}
              </span>
            </div>
            <div className="flex items-center">
              <CalendarDays size={18} className="mr-1.5 text-sky-600" />
              <span>{formatDate(currentArticle.publishedAt)}</span>
            </div>
            {currentArticle.category?.name && (
              <div className="flex items-center">
                <Tag size={18} className="mr-1.5 text-emerald-600" />
                <Badge
                  variant="secondary"
                  className="bg-brand-secondary text-brand-primary font-medium"
                >
                  {currentArticle.category.name}
                </Badge>
              </div>
            )}
          </div>

          {isArticleOwner && (
            <div className="mb-8 flex flex-wrap gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleTriggerEditArticleModal}
                disabled={isArticleSubmitting}
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50 font-medium"
              >
                <Edit size={16} className="mr-2" /> Edit Artikel
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteArticle}
                disabled={isArticleSubmitting}
                className="bg-red-600 font-medium text-white hover:bg-red-700"
              >
                {isArticleSubmitting &&
                currentArticle?.documentId === articleIdFromParams ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 size={16} className="mr-2" />
                )}
                {isArticleSubmitting &&
                currentArticle?.documentId === articleIdFromParams
                  ? "Menghapus..."
                  : "Hapus Artikel"}
              </Button>
            </div>
          )}

          <div className="prose prose-lg prose-slate text-brand-text selection:bg-brand-primary/20 selection:text-brand-primary max-w-none leading-relaxed">
            {(currentArticle.description || "").split("\n").map(
              (paragraph, index) =>
                paragraph.trim() !== "" && (
                  <p key={index} className="mb-5 last:mb-0">
                    {paragraph}
                  </p>
                ),
            )}
          </div>

          <div className="border-brand-muted/20 mt-10 border-t pt-8">
            <h3 className="font-heading text-brand-text mb-4 text-xl font-semibold">
              Bagikan Artikel Ini:
            </h3>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
                onClick={() => handleSocialShare("twitter")}
              >
                Twitter
              </Button>
              <Button
                variant="outline"
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
                onClick={() => handleSocialShare("facebook")}
              >
                Facebook
              </Button>
              <Button
                variant="outline"
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
                onClick={() => handleSocialShare("linkedin")}
              >
                LinkedIn
              </Button>
              <Button
                variant="outline"
                className="border-brand-muted text-brand-text hover:bg-brand-secondary/50"
                onClick={() => handleSocialShare("copy")}
              >
                Salin Link
              </Button>
            </div>
          </div>

          <div className="border-brand-muted/20 mt-12 border-t pt-8">
            <h2 className="font-heading text-brand-text mb-8 text-2xl font-semibold md:text-3xl">
              <MessageSquare
                size={28}
                className="text-brand-primary mr-3 inline align-bottom"
              />
              Komentar ({currentArticle.comments?.length || 0})
            </h2>
            {authUser && (
              <form
                onSubmit={handleAddComment}
                className="bg-brand-secondary/20 border-brand-muted/20 mb-10 rounded-lg border p-5 shadow-sm"
              >
                {" "}
                <Label
                  htmlFor="newComment"
                  className="text-brand-text mb-1.5 block text-sm font-medium"
                >
                  Tinggalkan Komentar:
                </Label>{" "}
                <Textarea
                  id="newComment"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  rows={3}
                  placeholder="Tulis komentar Anda di sini..."
                  className="border-brand-muted/50 focus:ring-brand-primary focus:border-brand-primary bg-brand-surface w-full rounded-md p-3 transition-shadow focus:ring-2"
                  disabled={isSubmittingComment}
                />{" "}
                {commentError && !editingComment && (
                  <p className="mt-1.5 text-xs text-red-600">{commentError}</p>
                )}{" "}
                <Button
                  type="submit"
                  disabled={isSubmittingComment || !newCommentContent.trim()}
                  className="bg-brand-primary mt-3 rounded-md px-5 py-2.5 text-sm font-semibold text-white shadow transition-all hover:bg-opacity-80 hover:shadow-md"
                >
                  {" "}
                  {isSubmittingComment && !editingComment ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Send size={16} className="mr-2" />
                  )}{" "}
                  {isSubmittingComment && !editingComment
                    ? "Mengirim..."
                    : "Kirim Komentar"}{" "}
                </Button>{" "}
              </form>
            )}
            {!authUser && (
              <p className="text-brand-muted mb-8">
                {" "}
                <Link
                  to="/login"
                  className="text-brand-primary font-semibold hover:underline"
                >
                  Login
                </Link>{" "}
                untuk meninggalkan komentar.{" "}
              </p>
            )}
            {currentArticle.comments && currentArticle.comments.length > 0 ? (
              <div className="space-y-6">
                {" "}
                {currentArticle.comments
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime(),
                  )
                  .map((comment) => {
                    const isCommentOwner =
                      authUser &&
                      comment.user &&
                      authUser.id === comment.user.id;
                    const isEditingThisComment =
                      editingComment?.documentId === comment.documentId;
                    const commentWasEdited =
                      new Date(comment.createdAt).getTime() !==
                      new Date(comment.updatedAt).getTime();
                    return (
                      <div
                        key={comment.documentId || comment.id}
                        className="bg-brand-surface border-brand-muted/20 group relative rounded-lg border p-5 shadow-md"
                      >
                        {" "}
                        {isEditingThisComment ? (
                          <form
                            onSubmit={handleSaveEditComment}
                            className="space-y-3"
                          >
                            {" "}
                            <Label
                              htmlFor={`editComment-${comment.id}`}
                              className="sr-only"
                            >
                              Edit Komentar
                            </Label>{" "}
                            <Textarea
                              id={`editComment-${comment.id}`}
                              value={editCommentContent}
                              onChange={(e) =>
                                setEditCommentContent(e.target.value)
                              }
                              rows={3}
                              className="border-brand-primary focus:ring-brand-primary w-full rounded-md bg-white p-2 focus:ring-2"
                              disabled={isSubmittingComment}
                            />{" "}
                            {commentError &&
                              editingComment?.documentId ===
                                comment.documentId && (
                                <p className="text-xs text-red-600">
                                  {commentError}
                                </p>
                              )}{" "}
                            <div className="flex justify-end space-x-2">
                              {" "}
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={handleCancelEditComment}
                                disabled={isSubmittingComment}
                                className="text-brand-muted hover:bg-slate-200"
                              >
                                {" "}
                                <X size={16} className="mr-1" /> Batal{" "}
                              </Button>{" "}
                              <Button
                                type="submit"
                                size="sm"
                                disabled={
                                  isSubmittingComment ||
                                  !editCommentContent.trim()
                                }
                                className="bg-green-600 text-white hover:bg-green-700"
                              >
                                {" "}
                                {isSubmittingComment ? (
                                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />
                                ) : (
                                  <Check size={16} className="mr-1" />
                                )}{" "}
                                Simpan{" "}
                              </Button>{" "}
                            </div>{" "}
                          </form>
                        ) : (
                          <>
                            {" "}
                            <div className="mb-1 flex items-start">
                              {" "}
                              <UserCircle
                                size={28}
                                className="text-brand-primary mr-3 mt-0.5 flex-shrink-0"
                              />{" "}
                              <div className="flex-grow">
                                {" "}
                                <span className="text-brand-text font-semibold">
                                  {" "}
                                  {comment.user?.username ||
                                    "Pengguna Anonim"}{" "}
                                </span>{" "}
                                <p className="text-brand-muted text-xs">
                                  {formatDate(comment.createdAt)}
                                </p>{" "}
                              </div>{" "}
                              {isCommentOwner && (
                                <div className="absolute right-3 top-3 flex space-x-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                  {" "}
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="border-brand-primary/40 text-brand-primary hover:bg-brand-primary/10 hover:border-brand-primary h-8 w-8"
                                    onClick={() =>
                                      handleStartEditComment(comment)
                                    }
                                    disabled={isSubmittingComment}
                                  >
                                    {" "}
                                    <Edit size={14} />{" "}
                                    <span className="sr-only">
                                      Edit Komentar
                                    </span>{" "}
                                  </Button>{" "}
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 border-red-500/40 text-red-600 hover:border-red-600 hover:bg-red-500/10"
                                    onClick={() =>
                                      handleRemoveComment(comment.documentId)
                                    }
                                    disabled={isSubmittingComment}
                                  >
                                    {" "}
                                    {isSubmittingComment &&
                                    editingComment?.documentId !==
                                      comment.documentId ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Trash2 size={14} />
                                    )}{" "}
                                    <span className="sr-only">
                                      Hapus Komentar
                                    </span>{" "}
                                  </Button>{" "}
                                </div>
                              )}{" "}
                            </div>{" "}
                            <p className="text-brand-text whitespace-pre-wrap pl-10 leading-relaxed">
                              {comment.content}
                            </p>{" "}
                            {commentWasEdited && (
                              <div className="mt-1.5 text-right">
                                {" "}
                                <span className="text-brand-muted/70 flex items-center justify-end text-xs italic">
                                  {" "}
                                  <Pencil size={10} className="mr-1" />{" "}
                                  (diedit){" "}
                                </span>{" "}
                              </div>
                            )}{" "}
                          </>
                        )}{" "}
                      </div>
                    );
                  })}{" "}
              </div>
            ) : (
              <p className="text-brand-muted py-4 text-center">
                Belum ada komentar untuk artikel ini.
              </p>
            )}
          </div>
        </div>
      </article>
    </div>
  );
};

export default ArticleDetailPage;
