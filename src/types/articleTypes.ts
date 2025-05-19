import { type UserData as AuthorData } from "@/services/authService";

export interface CategoryData {
  id: number;
  documentId: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
}

export interface CommentData {
  id: number;
  documentId: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string | null;
  user?: AuthorData;
}

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

export interface PaginationMeta {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface ArticlesApiResponse {
  data: Article[];
  meta: {
    pagination: PaginationMeta;
  };
}

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

type StrapiFilterOperator =
  | "$eq"
  | "$eqi"
  | "$ne"
  | "$lt"
  | "$lte"
  | "$gt"
  | "$gte"
  | "$in"
  | "$nin"
  | "$contains"
  | "$containsi"
  | "$notContains"
  | "$notContainsi"
  | "$startsWith"
  | "$startsWithi"
  | "$endsWith"
  | "$endsWithi"
  | "$null"
  | "$notNull"
  | "$between";

interface StrapiFilterValue {
  [key: string]: string | number | boolean | string[] | number[] | null;
}

interface StrapiFieldFilter {
  [operator: string]: any;
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
