import { create } from 'zustand';
import articleService, { type CreateArticlePayload, type UpdateArticlePayload } from '@/services/articleService';
import categoryService from '@/services/categoryService'; 
import commentService from '@/services/commentService'; 
import type {
  Article,
  PaginationMeta,
  GetArticlesParams,
  ArticlesApiResponse,
  StrapiFilters,
  CategoryData
} from '@/types/articleTypes'; 
import type {
  CommentData,
  CreateCommentPayload as CreateCommentApiPayload, 
  UpdateCommentPayload as UpdateCommentApiPayload
} from '@/types/commentTypes'; 

interface ArticleState {
  articles: Article[];
  pagination: PaginationMeta | null;
  currentArticle: Article | null;
  isLoading: boolean; 
  isSubmitting: boolean;
  isSubmittingComment: boolean;
  error: string | null; 
  commentError: string | null; 
  currentFetchParams: GetArticlesParams;
  availableCategories: CategoryData[];
  isLoadingCategories: boolean; 

  fetchArticles: (params?: GetArticlesParams) => Promise<void>;
  fetchArticleById: (documentId: string, populateParams?: { populate?: GetArticlesParams['populate'] }) => Promise<Article | null>;
  createArticle: (articleData: CreateArticlePayload) => Promise<Article | null>;
  updateArticle: (documentId: string, articleData: UpdateArticlePayload) => Promise<Article | null>;
  deleteArticle: (documentId: string) => Promise<boolean>;

  fetchAvailableCategories: (params?: { pagination?: { page?: number, pageSize?: number } }) => Promise<void>;

  addComment: (payload: CreateCommentApiPayload) => Promise<CommentData | null>;
  editComment: (commentDocumentId: string, payload: UpdateCommentApiPayload) => Promise<CommentData | null>;
  removeComment: (commentDocumentId: string) => Promise<boolean>;

  setCurrentPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  applyFiltersAndResetSort: (filters: StrapiFilters) => void;
  setSort: (sort: string | string[]) => void;
  clearCurrentArticle: () => void;
  clearError: () => void; 
  clearCommentError: () => void; 
}

const initialArticleParams: GetArticlesParams = {
  pagination: { page: 1, pageSize: 9 },
  populate: { 
    user: '*',
    category: '*',
    comments: { populate: { user: '*' } } 
  },
  filters: {},
  sort: 'createdAt:desc',
};

export const useArticleStore = create<ArticleState>()((set, get) => ({
  articles: [],
  pagination: null,
  currentArticle: null,
  isLoading: false,
  isSubmitting: false,
  isSubmittingComment: false,
  error: null,
  commentError: null,
  currentFetchParams: initialArticleParams,
  availableCategories: [],
  isLoadingCategories: false,

  fetchArticles: async (params?: GetArticlesParams) => {
    set({ isLoading: true, error: null });
    const currentParams = get().currentFetchParams;
    const newParams: GetArticlesParams = {
      ...currentParams,
      ...params,
      pagination: {
        ...(currentParams.pagination || initialArticleParams.pagination),
        ...(params?.pagination || {}),
      },
      filters: params?.filters !== undefined
        ? params.filters
        : (currentParams.filters || initialArticleParams.filters),
      sort: params?.sort !== undefined
        ? params.sort
        : (currentParams.sort || initialArticleParams.sort),
      populate: params?.populate || currentParams.populate || initialArticleParams.populate,
    };
    newParams.pagination = {
        page: newParams.pagination?.page || initialArticleParams.pagination!.page,
        pageSize: newParams.pagination?.pageSize || initialArticleParams.pagination!.pageSize,
    };
    set({ currentFetchParams: newParams });
    try {
      const response: ArticlesApiResponse = await articleService.getArticles(newParams);
      set({ articles: response.data, pagination: response.meta.pagination, isLoading: false });
    } catch (err: any) {
      console.error("articleStore.fetchArticles error:", err);
      set({ error: err.message || "Gagal memuat artikel.", isLoading: false });
    }
  },

  fetchArticleById: async (documentId: string, populateParams?: { populate?: GetArticlesParams['populate'] }) => {
    set({ isLoading: true, error: null, commentError: null, currentArticle: null });
    try {
      const populateConfig = populateParams?.populate || initialArticleParams.populate;
      const articleData = await articleService.getArticleById(documentId, { populate: populateConfig });
      set({ currentArticle: articleData, isLoading: false });
      return articleData;
    } catch (err: any) {
      console.error(`articleStore.fetchArticleById (documentId: ${documentId}) error:`, err);
      set({ error: err.message || `Gagal memuat detail artikel.`, isLoading: false });
      return null;
    }
  },

  createArticle: async (articleData: CreateArticlePayload): Promise<Article | null> => {
    set({ isSubmitting: true, error: null });
    try {
      const newArticle = await articleService.createArticle(articleData);
      set({ isSubmitting: false });
      get().fetchArticles({ pagination: { page: 1 } }); 
      return newArticle;
    } catch (err: any) {
      console.error("articleStore.createArticle error:", err);
      set({ error: err.message || "Gagal membuat artikel.", isSubmitting: false });
      return null;
    }
  },

  updateArticle: async (documentId: string, articleData: UpdateArticlePayload): Promise<Article | null> => {
    set({ isSubmitting: true, error: null });
    try {
      const updatedArticle = await articleService.updateArticle(documentId, articleData);
      set(state => ({
        isSubmitting: false,
        articles: state.articles.map(article =>
          (article.documentId || String(article.id)) === documentId ? updatedArticle : article
        ),
        currentArticle: state.currentArticle?.documentId === documentId ? updatedArticle : state.currentArticle,
      }));
      return updatedArticle;
    } catch (err: any) {
      console.error(`articleStore.updateArticle (documentId: ${documentId}) error:`, err);
      set({ error: err.message || "Gagal mengupdate artikel.", isSubmitting: false });
      return null;
    }
  },

  deleteArticle: async (documentId: string): Promise<boolean> => {
    set({ isSubmitting: true, error: null });
    try {
      await articleService.deleteArticle(documentId);
      set(state => ({
        isSubmitting: false,
        articles: state.articles.filter(article => (article.documentId || String(article.id)) !== documentId),
        currentArticle: state.currentArticle?.documentId === documentId ? null : state.currentArticle,
      }));
      return true;
    } catch (err: any) {
      console.error(`articleStore.deleteArticle (documentId: ${documentId}) error:`, err);
      set({ error: err.message || "Gagal menghapus artikel.", isSubmitting: false });
      return false;
    }
  },

  fetchAvailableCategories: async (params?: { pagination?: { page?: number, pageSize?: number } }) => {
    if (get().isLoadingCategories) return; 
    set({ isLoadingCategories: true, error: null }); 
    try {
      const categoryResponse = await categoryService.getCategories(params || { pagination: { pageSize: 200 } });
      const sortedCategories = categoryResponse.data.sort((a, b) => a.name.localeCompare(b.name));
      set({ availableCategories: sortedCategories, isLoadingCategories: false });
    } catch (err: any) {
      console.error("articleStore.fetchAvailableCategories error:", err);
      set({ error: err.message || "Gagal memuat daftar kategori.", isLoadingCategories: false });
    }
  },

  addComment: async (payload: CreateCommentApiPayload): Promise<CommentData | null> => {
    set({ isSubmittingComment: true, commentError: null });
    try {
      const newComment = await commentService.createComment(payload);
      set(state => {
        if (state.currentArticle) {
          const updatedComments = [...(state.currentArticle.comments || []), newComment];
          return {
            currentArticle: { ...state.currentArticle, comments: updatedComments },
            isSubmittingComment: false,
          };
        }
        return { isSubmittingComment: false }; 
      });
      return newComment;
    } catch (err: any) {
      console.error("articleStore.addComment error:", err);
      set({ commentError: err.message || "Gagal menambah komentar.", isSubmittingComment: false });
      return null;
    }
  },

  editComment: async (commentDocumentId: string, payload: UpdateCommentApiPayload): Promise<CommentData | null> => {
    set({ isSubmittingComment: true, commentError: null });
    try {
      const updatedComment = await commentService.updateComment(commentDocumentId, payload);
      set(state => {
        if (state.currentArticle) {
          const updatedComments = (state.currentArticle.comments || []).map(comment =>
            (comment.documentId || String(comment.id)) === commentDocumentId ? updatedComment : comment
          );
          return {
            currentArticle: { ...state.currentArticle, comments: updatedComments },
            isSubmittingComment: false,
          };
        }
        return { isSubmittingComment: false };
      });
      return updatedComment;
    } catch (err: any) {
      console.error(`articleStore.editComment (commentDocId: ${commentDocumentId}) error:`, err);
      set({ commentError: err.message || "Gagal mengupdate komentar.", isSubmittingComment: false });
      return null;
    }
  },

  removeComment: async (commentDocumentId: string): Promise<boolean> => {
    set({ isSubmittingComment: true, commentError: null });
    try {
      await commentService.deleteComment(commentDocumentId);
      set(state => {
        if (state.currentArticle) {
          const updatedComments = (state.currentArticle.comments || []).filter(
            comment => (comment.documentId || String(comment.id)) !== commentDocumentId
          );
          return {
            currentArticle: { ...state.currentArticle, comments: updatedComments },
            isSubmittingComment: false,
          };
        }
        return { isSubmittingComment: false };
      });
      return true;
    } catch (err: any) {
      console.error(`articleStore.removeComment (commentDocId: ${commentDocumentId}) error:`, err);
      set({ commentError: err.message || "Gagal menghapus komentar.", isSubmittingComment: false });
      return false;
    }
  },

  setCurrentPage: (page: number) => { get().fetchArticles({ pagination: { page } }); },
  setPageSize: (pageSize: number) => { get().fetchArticles({ pagination: { page: 1, pageSize } }); },
  applyFiltersAndResetSort: (newFilters: StrapiFilters) => {
    const isResettingAll = Object.keys(newFilters).length === 0;
    get().fetchArticles({
      filters: newFilters,
      pagination: { page: 1 },
      sort: isResettingAll ? initialArticleParams.sort : undefined, 
    });
  },
  setSort: (sortOption: string | string[]) => {
    get().fetchArticles({
      sort: sortOption,
      pagination: { page: 1 }, 
    });
  },
  clearCurrentArticle: () => set({ currentArticle: null, error: null, commentError: null }),
  clearError: () => set({ error: null }),
  clearCommentError: () => set({ commentError: null }),
}));
