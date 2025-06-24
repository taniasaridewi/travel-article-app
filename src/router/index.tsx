import { createBrowserRouter, Navigate } from "react-router-dom";

import App from "@/App";
import LandingPage from "@/pages/LandingPage";
import ArticleListPage from "@/pages/Article/ArticleListPage";
import ArticleDetailPage from "@/pages/Article/ArticleDetailPage";
import CategoryListPage from "@/pages/Category/CategoryListPage";
import ProtectedLayout from "./ProtectedLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <LandingPage />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          { path: "articles", element: <ArticleListPage /> },
          { path: "articles/:id", element: <ArticleDetailPage /> },
          { path: "categories", element: <CategoryListPage /> },
        ],
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default router;