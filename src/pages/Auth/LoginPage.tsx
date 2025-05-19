import React from "react";
import LoginForm from "@/components/auth/LoginForm";
import { Link } from "react-router-dom";

const LoginPage: React.FC = () => {
  return (
    <div className="bg-brand-background flex min-h-screen items-center justify-center p-4">
      <div className="bg-brand-surface border-brand-muted/20 w-full max-w-md rounded-xl border p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="font-heading text-brand-text text-3xl font-bold">
            Selamat Datang Kembali!
          </h2>
          <p className="text-brand-muted mt-2 text-sm">
            Masuk untuk melanjutkan ke akun Travel Anda.
          </p>
        </div>
        <LoginForm />
        <p className="text-brand-muted mt-8 text-center text-sm">
          Belum punya akun?{" "}
          <Link
            to="/register"
            className="text-brand-primary hover:text-brand-accent font-medium hover:underline"
          >
            Daftar di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
