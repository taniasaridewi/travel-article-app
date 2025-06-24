// src/types/fileTypes.ts

export interface ImageFormat {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes?: number;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
}

export interface UploadedFileResponse {
  id: number;
  documentId?: string;
  name: string;
  alternativeText: string | null;
  caption: string | null;
  width: number;
  height: number;
  formats: {
    large?: ImageFormat;
    small?: ImageFormat;
    medium?: ImageFormat;
    thumbnail?: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  sizeInBytes?: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata?: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
  publishedAt?: string | null;
  locale?: string | null;
}

export type FileUploadApiResponse = UploadedFileResponse[];
