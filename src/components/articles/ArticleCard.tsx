import React from "react";
import type { Article } from "@/types/articleTypes";
import { Link } from "react-router-dom";
import { CalendarDays, UserCircle, Tag } from "lucide-react";

interface ArticleCardProps {
  article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
  const truncateDescription = (text: string, maxLength: number = 150) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + "...";
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "Tanggal tidak diketahui";
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const detailUrl = article.documentId
    ? `/articles/${article.documentId}`
    : "#";

  return (
    <div className="flex flex-col overflow-hidden rounded-lg bg-white shadow-lg transition-all duration-300 hover:shadow-xl">
      {article.cover_image_url && (
        <Link to={detailUrl}>
          <img
            src={article.cover_image_url}
            alt={`Gambar sampul untuk ${article.title}`}
            className="h-48 w-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                `https://placehold.co/600x400/e2e8f0/94a3b8?text=Gambar+Tidak+Tersedia`;
              (e.target as HTMLImageElement).alt = "Gambar tidak tersedia";
            }}
          />
        </Link>
      )}
      <div className="flex flex-grow flex-col justify-between p-6">
        <div>
          <Link to={detailUrl} className="hover:underline">
            <h3 className="mb-2 text-2xl font-bold text-gray-800 transition-colors hover:text-indigo-600">
              {article.title || "Judul Tidak Tersedia"}
            </h3>
          </Link>
          <p className="mb-4 text-sm leading-relaxed text-gray-600">
            {truncateDescription(article.description)}
          </p>
        </div>

        <div>
          <div className="mb-1 flex items-center text-xs text-gray-500">
            <UserCircle size={14} className="mr-1.5 text-indigo-500" />
            <span>
              {article.user?.username ||
                article.user?.email ||
                "Pengguna Anonim"}
            </span>
          </div>
          <div className="mb-1 flex items-center text-xs text-gray-500">
            <CalendarDays size={14} className="mr-1.5 text-green-500" />
            <span>Diterbitkan pada {formatDate(article.publishedAt)}</span>
          </div>
          {article.category?.name && (
            <div className="flex items-center text-xs text-gray-500">
              <Tag size={14} className="mr-1.5 text-purple-500" />
              <span>Kategori: {article.category.name}</span>
            </div>
          )}
        </div>
      </div>
      <div className="border-t border-gray-200 px-6 pb-4 pt-2">
        <Link
          to={detailUrl}
          className={`inline-block rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors duration-300 hover:bg-indigo-700 ${!article.documentId ? "cursor-not-allowed opacity-50" : ""}`}
          aria-disabled={!article.documentId}
          onClick={(e) => !article.documentId && e.preventDefault()}
        >
          Baca Selengkapnya
        </Link>
      </div>
    </div>
  );
};

export default ArticleCard;
