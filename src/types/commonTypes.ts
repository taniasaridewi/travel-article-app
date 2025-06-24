// src/types/commonTypes.ts

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ApiResponseMeta {
  pagination: PaginationMeta;
}
