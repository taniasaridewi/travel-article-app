export const API_BASE_URL =
  "https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api";

export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/local`,
  REGISTER: `${API_BASE_URL}/auth/local/register`,
  ME: `${API_BASE_URL}/users/me`,
  LOGOUT: `${API_BASE_URL}/logout-placeholder`,
};

export const ARTICLE_ENDPOINTS = {
  ARTICLES: `${API_BASE_URL}/articles`,
};

export const CATEGORY_ENDPOINTS = {
  CATEGORIES: `${API_BASE_URL}/categories`,
};

export const COMMENT_ENDPOINTS = {
  COMMENTS: `${API_BASE_URL}/comments`,
};

export const UPLOAD_ENDPOINT = `${API_BASE_URL}/upload`;
