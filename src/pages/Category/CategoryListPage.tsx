import React, { useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useCategoryStore } from '@/store/categoryStore';
import { useAuthStore } from '@/store/authStore';
import { useModalStore } from '@/store/modalStore';
import CategoryCard from '@/components/categories/CategoryCard';
import { Button } from '@/components/ui/button';
import { Loader2, AlertTriangle, PlusCircle, Compass } from 'lucide-react';
import type { CategoryData } from '@/types/categoryTypes';

const CategoryListPage: React.FC = () => {
  // const navigate = useNavigate(); 
  const authUser = useAuthStore((state) => state.user);
  const { openModal } = useModalStore();
  const {
    categories,
    pagination,
    isLoading,
    isSubmitting,
    error,
    fetchCategories,
    setCurrentPage,
    deleteCategory,
    clearError,
  } = useCategoryStore();

  const stableFetchCategories = useCallback(() => {
    if (typeof clearError === 'function') clearError();
    if (typeof fetchCategories === 'function') {
      fetchCategories();
    } else {
      console.error("fetchCategories is not a function in CategoryListPage");
    }
  }, [fetchCategories, clearError]);

  useEffect(() => {
    stableFetchCategories();
  }, [stableFetchCategories]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (pagination?.pageCount || 1) && newPage !== pagination?.page) {
      if (typeof setCurrentPage === 'function') {
        setCurrentPage(newPage);
      } else {
        console.error("setCurrentPage is not a function in CategoryListPage");
      }
    }
  };

  const handleTriggerEditCategoryModal = (category: CategoryData) => {
    console.log('[CategoryListPage] handleTriggerEditCategoryModal called for category:', category);
    if (category && category.documentId) {
      openModal('editCategory', { itemId: category.documentId });
      setTimeout(() => {
        console.log('[CategoryListPage] Modal state after openModal("editCategory"):', useModalStore.getState().currentOpenModal);
        console.log('[CategoryListPage] Modal data after openModal:', useModalStore.getState().modalData);
      }, 0);
    } else {
      console.error('[CategoryListPage] Invalid category data or missing documentId for edit modal:', category);
    }
  };

  const handleDeleteCategory = async (category: CategoryData) => {
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori "${category.name}"? Artikel yang menggunakan kategori ini mungkin perlu diperbarui.`)) {
      if (typeof clearError === 'function') clearError();
      if (typeof deleteCategory === 'function') {
        const success = await deleteCategory(category.documentId);
        if (success) {
          alert("Kategori berhasil dihapus."); 
        }
      } else {
        console.error("deleteCategory is not a function in CategoryListPage");
      }
    }
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8 pb-4 border-b border-brand-muted/20">
          <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl sm:text-4xl font-bold font-heading text-brand-text">
                  Manajemen Kategori
              </h1>
              {authUser && (
              <p className="text-lg text-brand-muted mt-1">
                  Kelola semua kategori artikel Anda di sini.
              </p>
              )}
          </div>
          <Button
            onClick={() => {
              console.log('[CategoryListPage] Tombol "Buat Kategori Baru" diklik.');
              openModal('createCategory');
              setTimeout(() => {
                console.log('[CategoryListPage] Modal state after openModal("createCategory"):', useModalStore.getState().currentOpenModal);
              }, 0);
            }}
            className="w-full sm:w-auto bg-brand-primary hover:bg-opacity-80 text-white font-semibold py-2.5 px-5 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircle size={18} className="mr-2" />
            Buat Kategori Baru
          </Button>
      </div>

      {error && !isLoading && !isSubmitting && (
        <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-800 p-4 rounded-md shadow" role="alert">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <div>
              <p className="font-bold">Terjadi Kesalahan</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center text-center py-20">
          <Loader2 className="h-16 w-16 animate-spin text-brand-primary mb-4" />
          <p className="text-xl font-medium text-brand-text">Memuat daftar kategori...</p>
        </div>
      )}

      {!isLoading && !error && categories.length === 0 && (
        <div className="text-center py-20">
          <Compass size={64} className="mx-auto mb-6 text-brand-muted/70" />
          <p className="text-2xl text-brand-muted">Belum ada kategori.</p>
          <p className="text-brand-muted/80">Mulai dengan membuat kategori baru!</p>
        </div>
      )}

      {!isLoading && !error && categories.length > 0 && (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <CategoryCard
                key={category.documentId || category.id}
                category={category}
                onEdit={handleTriggerEditCategoryModal}
                onDelete={handleDeleteCategory}
              />
            ))}
          </div>

          {pagination && pagination.pageCount > 1 && (
            <div className="flex flex-wrap justify-center items-center space-x-1 sm:space-x-2 mt-12 py-4">
              <Button
                onClick={() => handlePageChange(pagination.page - 1)}
                disabled={pagination.page === 1 || isLoading || isSubmitting}
                variant="outline" size="sm"
                className="m-1 border-brand-muted text-brand-text hover:bg-brand-secondary/70 rounded-md shadow-sm"
              >
                Sebelumnya
              </Button>
              {Array.from({ length: pagination.pageCount }, (_, i) => i + 1).map(pageNumber => (
                 <Button
                    key={`page-${pageNumber}`}
                    onClick={() => handlePageChange(pageNumber)}
                    variant={pagination.page === pageNumber ? 'default' : 'outline'}
                    size="sm"
                    className={`m-1 rounded-md shadow-sm ${pagination.page === pageNumber ? 'bg-brand-primary text-white hover:bg-opacity-90' : 'border-brand-muted text-brand-text hover:bg-brand-secondary/70'}`}
                  >
                    {pageNumber}
                  </Button>
              ))}
              <Button
                onClick={() => handlePageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.pageCount || isLoading || isSubmitting}
                variant="outline" size="sm"
                className="m-1 border-brand-muted text-brand-text hover:bg-brand-secondary/70 rounded-md shadow-sm"
              >
                Berikutnya
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CategoryListPage;
