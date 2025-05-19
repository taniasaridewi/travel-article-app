import React from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";

import MainLayout from "@/Layouts/MainLayout";
import App from "@/App";

import LandingPage from "@/pages/LandingPage";

import ArticleListPage from "@/pages/Article/ArticleListPage";
import ArticleDetailPage from "@/pages/Article/ArticleDetailPage";

import CategoryListPage from "@/pages/Category/CategoryListPage";

import { useAuthStore } from "@/store/authStore";

const ProtectedRoute: React.FC<{ children?: React.ReactNode }> = ({
  children,
}) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

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
