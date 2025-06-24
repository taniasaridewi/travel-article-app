import React, { useEffect, useState, useRef } from 'react';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { CreateArticlePayload, UpdateArticlePayload } from '@/services/articleService'; 
import fileService from '@/services/fileService'; 
// import type { UploadedFileResponse } from '@/types/fileTypes'; 
import { useArticleStore } from '@/store/articleStore';
import { Loader2, UploadCloud, Image as ImageIcon, XCircle } from 'lucide-react';

// Schema for form validation (keep category as string for form handling)
const articleSchema = z.object({
  title: z.string().min(3, { message: "Judul minimal 3 karakter." }).max(200, { message: "Judul maksimal 200 karakter." }),
  description: z.string().min(10, { message: "Deskripsi minimal 10 karakter." }),
  category: z.string().refine(val => val !== '' && !isNaN(parseInt(val)), { message: "Kategori harus dipilih."}),
});

type ArticleFormInputs = z.infer<typeof articleSchema>;

interface ArticleInitialData {
  title?: string;
  description?: string;
  category?: string | number;
  cover_image_url?: string;
}

interface ArticleFormProps {
  onSubmit: (data: CreateArticlePayload | UpdateArticlePayload) => Promise<void>;
  isSubmitting: boolean; 
  initialData?: ArticleInitialData;
  submitButtonText?: string;
}

const ArticleForm: React.FC<ArticleFormProps> = ({
  onSubmit,
  isSubmitting,
  initialData,
  submitButtonText = "Simpan Artikel"
}) => {
  const { availableCategories, fetchAvailableCategories, isLoadingCategories, currentFetchParams } = useArticleStore();

  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrlPreview, setCoverImageUrlPreview] = useState<string | null>(initialData?.cover_image_url || null);
  const [isUploadingImage, setIsUploadingImage] = useState(false); 
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (availableCategories.length === 0 && !isLoadingCategories && typeof fetchAvailableCategories === 'function') {
      fetchAvailableCategories({ pagination: { pageSize: 200 } });
    }
  }, [availableCategories.length, fetchAvailableCategories, isLoadingCategories, currentFetchParams]);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<ArticleFormInputs>({
    resolver: zodResolver(articleSchema),
    defaultValues: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      category: initialData?.category ? String(initialData.category) : '',
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        title: initialData.title || '',
        description: initialData.description || '',
        category: initialData.category ? String(initialData.category) : '',
      });
      setCoverImageUrlPreview(initialData.cover_image_url || null);
      setCoverImageFile(null); 
      setUploadError(null);
    } else {
      reset({ title: '', description: '', category: '' });
      setCoverImageUrlPreview(null);
      setCoverImageFile(null);
      setUploadError(null);
    }
  }, [initialData, reset]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setUploadError("Ukuran file gambar maksimal 2MB.");
        setCoverImageFile(null);
        setCoverImageUrlPreview(initialData?.cover_image_url || null); 
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
      if (!allowedTypes.includes(file.type)) {
        setUploadError("Format file tidak didukung. Gunakan JPG, PNG, atau WEBP.");
        setCoverImageFile(null);
        setCoverImageUrlPreview(initialData?.cover_image_url || null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setCoverImageFile(file);
      setCoverImageUrlPreview(URL.createObjectURL(file));
      setUploadError(null);
    }
  };

  const handleRemoveImage = () => {
    setCoverImageFile(null);
    setCoverImageUrlPreview(null); 
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploadError(null);
  };

  const processSubmit: SubmitHandler<ArticleFormInputs> = async (formData) => {
    setUploadError(null);
    let finalCoverImageUrl = initialData?.cover_image_url; 

    if (coverImageFile) { 
      setIsUploadingImage(true);
      try {
        const uploadResponse = await fileService.uploadFiles([coverImageFile]);
        if (uploadResponse && uploadResponse.length > 0) {
          finalCoverImageUrl = uploadResponse[0].formats?.large?.url || uploadResponse[0].url;
          if (!finalCoverImageUrl) {
            throw new Error("URL gambar tidak valid dari respons upload.");
          }
        } else {
          throw new Error("Respons upload gambar tidak valid.");
        }
      } catch (err: unknown) {
        console.error("Gagal mengupload gambar sampul:", err);
        const errorMessage = err instanceof Error ? err.message : "Gagal mengupload gambar.";
        setUploadError(errorMessage);
        setIsUploadingImage(false);
        return; 
      }
      setIsUploadingImage(false);
    } else if (!coverImageUrlPreview && initialData?.cover_image_url) {
      finalCoverImageUrl = ""; 
    }

    // Convert category string to number for the payload
    const payload: CreateArticlePayload | UpdateArticlePayload = {
      title: formData.title,
      description: formData.description,
      category: parseInt(formData.category), // Convert string to number here
      cover_image_url: finalCoverImageUrl || undefined,
    };
    await onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit(processSubmit)} className="space-y-7 text-brand-text">
      <div>
        <Label htmlFor="title" className="block text-sm font-medium mb-1.5 text-brand-text">Judul Artikel</Label>
        <Input 
          id="title" 
          {...register('title')} 
          className={`mt-1 block w-full rounded-lg border-brand-muted/50 shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm py-2.5 px-3 ${errors.title ? 'border-red-500' : ''}`} 
          placeholder="Contoh: Petualangan Seru di Gunung Bromo" 
        />
        {errors.title && <p className="mt-1.5 text-xs text-red-600">{errors.title.message}</p>}
      </div>

      <div>
        <Label htmlFor="description" className="block text-sm font-medium mb-1.5 text-brand-text">Deskripsi</Label>
        <Textarea 
          id="description" 
          {...register('description')} 
          rows={10} 
          className={`mt-1 block w-full rounded-lg border-brand-muted/50 shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm py-2.5 px-3 ${errors.description ? 'border-red-500' : ''}`} 
          placeholder="Ceritakan pengalaman travel Anda secara detail..." 
        />
        {errors.description && <p className="mt-1.5 text-xs text-red-600">{errors.description.message}</p>}
      </div>

      <div>
        <Label htmlFor="category" className="block text-sm font-medium mb-1.5 text-brand-text">Kategori</Label>
        <Controller
          name="category"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value} disabled={isLoadingCategories}>
              <SelectTrigger className={`w-full mt-1 rounded-lg border-brand-muted/50 shadow-sm focus:border-brand-primary focus:ring-1 focus:ring-brand-primary sm:text-sm py-2.5 px-3 ${errors.category ? 'border-red-500' : ''}`}>
                <SelectValue placeholder={isLoadingCategories ? "Memuat kategori..." : "Pilih kategori artikel"} />
              </SelectTrigger>
              <SelectContent className="bg-brand-surface border-brand-muted/50 shadow-lg z-50">
                {isLoadingCategories && <div className="p-2 text-sm text-brand-muted text-center">Memuat...</div>}
                {!isLoadingCategories && availableCategories.length === 0 && (<div className="p-2 text-sm text-brand-muted text-center">Kategori tidak tersedia.</div>)}
                {availableCategories.map(cat => (
                  <SelectItem key={cat.id} value={String(cat.id)} className="text-brand-text hover:bg-brand-secondary/50 focus:bg-brand-secondary/70">
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errors.category && <p className="mt-1.5 text-xs text-red-600">{errors.category.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="cover_image_file" className="block text-sm font-medium text-brand-text mb-1.5">
          Gambar Sampul (Opsional)
        </Label>
        <div className="mt-2 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className={`flex-shrink-0 w-full sm:w-48 h-32 border-2 border-dashed rounded-lg flex items-center justify-center bg-slate-50 ${coverImageUrlPreview ? 'border-brand-primary/60 p-1' : 'border-brand-muted/60 hover:border-brand-primary/80'}`}>
            {coverImageUrlPreview ? (
              <img src={coverImageUrlPreview} alt="Preview Gambar Sampul" className="max-w-full max-h-full object-contain rounded-md" />
            ) : (
              <div className="text-center text-brand-muted/80">
                <ImageIcon size={36} className="mx-auto mb-1" />
                <span className="text-xs">Preview Gambar</span>
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2 items-start">
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              className="border-brand-muted text-brand-text hover:bg-brand-secondary/50 shadow-sm px-4 py-2 text-sm"
              disabled={isUploadingImage || isSubmitting}
            >
              <UploadCloud size={16} className="mr-2" />
              {coverImageFile || coverImageUrlPreview ? "Ganti Gambar" : "Pilih Gambar"}
            </Button>
            {coverImageFile && (
              <p className="text-xs text-brand-muted truncate max-w-xs" title={coverImageFile.name}>
                File: {coverImageFile.name} ({(coverImageFile.size / 1024).toFixed(1)} KB)
              </p>
            )}
            {coverImageUrlPreview && (
                 <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                    className="text-red-600 hover:text-red-700 hover:bg-red-500/10 px-2 py-1 text-xs"
                    disabled={isUploadingImage || isSubmitting}
                >
                    <XCircle size={14} className="mr-1" /> Hapus Gambar
                </Button>
            )}
             <input
              type="file"
              id="cover_image_file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
              disabled={isUploadingImage || isSubmitting}
            />
          </div>
        </div>
        {isUploadingImage && (
          <div className="mt-2 flex items-center text-sm text-brand-primary">
            <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
            <span>Mengupload gambar... Harap tunggu.</span>
          </div>
        )}
        {uploadError && <p className="mt-1.5 text-xs text-red-600">{uploadError}</p>}
        <p className="mt-1 text-xs text-brand-muted">Format yang didukung: JPG, PNG, WEBP. Ukuran maksimal: 2MB (contoh).</p>
      </div>

      <div className="pt-4 border-t border-brand-muted/20 mt-8">
        <Button 
          type="submit" 
          disabled={isSubmitting || isUploadingImage || isLoadingCategories} 
          className="w-full sm:w-auto bg-brand-primary hover:bg-opacity-80 text-white font-semibold py-2.5 px-6 rounded-lg shadow-md hover:shadow-lg transition-all"
        >
          {isSubmitting || isUploadingImage ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : null}
          {isUploadingImage ? "Gambar Diproses..." : (isSubmitting ? "Menyimpan..." : submitButtonText)}
        </Button>
      </div>
    </form>
  );
};

export default ArticleForm;