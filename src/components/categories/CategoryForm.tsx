import React, { useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import type {
  CreateCategoryPayload,
  UpdateCategoryPayload,
  CategoryData,
} from "@/types/categoryTypes";

const categorySchema = z.object({
  name: z
    .string()
    .min(3, { message: "Nama kategori minimal 3 karakter." })
    .max(100, { message: "Nama kategori maksimal 100 karakter." }),
  description: z.string().optional().or(z.literal("")),
});

type CategoryFormInputs = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  onSubmit: (
    data: CreateCategoryPayload | UpdateCategoryPayload,
  ) => Promise<void>;
  isSubmitting: boolean;
  initialData?: Partial<CategoryData>;
  submitButtonText?: string;
  formTitle: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  onSubmit,
  isSubmitting,
  initialData,
  submitButtonText = "Simpan Kategori",
  formTitle,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CategoryFormInputs>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name || "",
        description: initialData.description || "",
      });
    } else {
      reset({
        name: "",
        description: "",
      });
    }
  }, [initialData, reset]);

  const processSubmit: SubmitHandler<CategoryFormInputs> = (formData) => {
    const payload: CreateCategoryPayload | UpdateCategoryPayload = {
      name: formData.name,
      description: formData.description?.trim()
        ? formData.description.trim()
        : null,
    };
    onSubmit(payload);
  };

  return (
    <div className="bg-brand-surface border-brand-muted/20 rounded-xl border p-6 shadow-xl sm:p-8">
      <h1 className="font-heading text-brand-text border-brand-muted/30 mb-6 border-b pb-4 text-2xl font-bold sm:text-3xl">
        {formTitle}
      </h1>
      <form
        onSubmit={handleSubmit(processSubmit)}
        className="text-brand-text space-y-6"
      >
        <div>
          <Label htmlFor="name" className="mb-1.5 block text-sm font-medium">
            Nama Kategori
          </Label>
          <Input
            id="name"
            {...register("name")}
            className={`border-brand-muted/50 focus:border-brand-primary focus:ring-brand-primary mt-1 block w-full rounded-md py-2.5 shadow-sm focus:ring-1 sm:text-sm ${errors.name ? "border-red-500" : ""}`}
            placeholder="Contoh: Pantai, Pegunungan, Kota Sejarah"
          />
          {errors.name && (
            <p className="mt-1.5 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label
            htmlFor="description"
            className="mb-1.5 block text-sm font-medium"
          >
            Deskripsi (Opsional)
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={4}
            className={`border-brand-muted/50 focus:border-brand-primary focus:ring-brand-primary mt-1 block w-full rounded-md py-2.5 shadow-sm focus:ring-1 sm:text-sm ${errors.description ? "border-red-500" : ""}`}
            placeholder="Jelaskan sedikit tentang kategori ini..."
          />
          {errors.description && (
            <p className="mt-1.5 text-xs text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="flex items-center gap-4 pt-3">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-brand-primary w-full rounded-lg px-4 py-2.5 font-semibold text-white shadow-md transition-all hover:bg-opacity-80 hover:shadow-lg sm:w-auto"
          >
            {isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            {submitButtonText}
          </Button>
          {isSubmitting && (
            <span className="text-brand-muted text-sm">Memproses...</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
