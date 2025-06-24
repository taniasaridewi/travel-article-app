import React from "react";
import { Outlet } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import ProtectedRoute from "./ProtectedRoute";

const ProtectedLayout: React.FC = () => (
  <ProtectedRoute>
    <MainLayout>
      <Outlet />
    </MainLayout>
  </ProtectedRoute>
);

export default ProtectedLayout;