// src/types/categoryTypes.ts

import type { ApiResponseMeta } from './commonTypes';

export interface CategoryData {
  id: number;
  documentId: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
}

export interface CategoriesApiResponse {
  data: CategoryData[];
  meta: ApiResponseMeta;
}

export interface SingleCategoryApiResponse {
  data: CategoryData;
  meta: object;
}

export interface CreateCategoryPayload {
  name: string;
  description?: string | null;
}

export interface UpdateCategoryPayload {
  name?: string;
  description?: string | null;
}

export interface CategoryMutationResponse {
  data: CategoryData;
  meta?: object;
}
