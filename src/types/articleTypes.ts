// src/types/articleTypes.ts

import type { AuthorData } from './userTypes';
import type { CommentData } from './commentTypes';
import type { CategoryData } from './categoryTypes';
import type { PaginationMeta } from './commonTypes';

export interface Article {
  id: number;
  documentId: string;
  title: string;
  description: string;
  cover_image_url: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  user: AuthorData;
  category: CategoryData;
  comments: CommentData[];
  localizations: any[];
}

export interface ArticlesApiResponse {
  data: Article[];
  meta: {
    pagination: PaginationMeta;
  };
}

// --- Filter & Populate ---

interface StrapiPagination {
  page?: number;
  pageSize?: number;
}

type PopulateField =
  | string
  | { [key: string]: "*" | { populate: PopulateField } };

interface StrapiPopulate {
  [key: string]: "*" | PopulateField | { populate: PopulateField };
}


interface StrapiFieldFilter {
  [operator: string]: unknown;
}

export interface StrapiFilters {
  [fieldPath: string]: StrapiFieldFilter | string | number | boolean;
}

export interface GetArticlesParams {
  pagination?: StrapiPagination;
  populate?: "*" | string[] | StrapiPopulate;
  filters?: StrapiFilters;
  sort?: string | string[];
}
