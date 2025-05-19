import React from "react";
import RegisterForm from "@/components/auth/RegisterForm";
import { Link } from "react-router-dom";

const RegisterPage: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl">
        <div className="mb-8 text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Isi form di bawah untuk mendaftar.
          </p>
        </div>
        <RegisterForm />
        <p className="mt-8 text-center text-sm text-gray-600">
          Sudah punya akun?{" "}
          <Link
            to="/login"
            className="font-medium text-indigo-600 hover:text-indigo-500 hover:underline"
          >
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
