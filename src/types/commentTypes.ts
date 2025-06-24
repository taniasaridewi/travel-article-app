// src/types/commentTypes.ts

import type { AuthorData } from './userTypes';
import type { PaginationMeta } from './commonTypes';

export interface CommentData {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  locale: string | null;
  user?: AuthorData;
  article?: { id: number }; // ✅ untuk relasi article
}

export interface CreateCommentPayload {
  content: string;
  article: number;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface SingleCommentApiResponse {
  data: CommentData;
  meta?: object;
}

export interface CommentsApiResponse {
  data: CommentData[];
  meta: {
    pagination: PaginationMeta;
  };
}
