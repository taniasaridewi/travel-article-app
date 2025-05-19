import React from "react";
import { Link } from "react-router-dom";
import type { CategoryData } from "@/types/categoryTypes";
import { Button } from "@/components/ui/button";
import { Edit2, Trash2, FolderKanban } from "lucide-react";

interface CategoryCardProps {
  category: CategoryData;
  onEdit: (category: CategoryData) => void;
  onDelete: (category: CategoryData) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
  onDelete,
}) => {
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const articlesByCategoryUrl = `/articles?filters[category][name][$eqi]=${encodeURIComponent(category.name)}`;

  return (
    <div className="bg-brand-surface border-brand-muted/20 flex h-full flex-col justify-between rounded-xl border p-5 shadow-lg transition-shadow duration-300 hover:shadow-2xl">
      <div>
        <div className="mb-3 flex items-center">
          <FolderKanban className="text-brand-primary mr-3 h-7 w-7 flex-shrink-0" />
          <Link to={articlesByCategoryUrl} className="group">
            <h3
              className="font-heading text-brand-text group-hover:text-brand-primary truncate text-xl font-semibold transition-colors duration-300 group-hover:underline"
              title={category.name}
            >
              {category.name}
            </h3>
          </Link>
        </div>
        <p
          className="text-brand-muted mb-2 line-clamp-3 text-sm"
          title={category.description || ""}
        >
          {category.description || "Tidak ada deskripsi."}
        </p>
        <p className="text-brand-muted/80 text-xs">
          ID: <span className="font-mono text-xs">{category.documentId}</span>
        </p>
        <p className="text-brand-muted/80 mt-0.5 text-xs">
          Dibuat: {formatDate(category.createdAt)}
        </p>
      </div>
      <div className="border-brand-muted/20 mt-5 flex justify-end space-x-2 border-t pt-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(category)}
          className="text-brand-primary border-brand-primary/50 hover:bg-brand-primary/10 hover:text-brand-primary rounded-md px-3 py-1.5 font-medium"
        >
          <Edit2 size={14} className="mr-1.5" /> Edit
        </Button>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(category)}
          className="rounded-md bg-red-600 px-3 py-1.5 font-medium text-white hover:bg-red-700"
        >
          <Trash2 size={14} className="mr-1.5" /> Hapus
        </Button>
      </div>
    </div>
  );
};

export default CategoryCard;
