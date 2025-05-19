import React from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useModalStore } from "@/store/modalStore";
import { Button } from "@/components/ui/button";
import LogoutButton from "@/components/auth/LogoutButton";
import { Home, LayoutGrid, ListChecks, UserPlus, LogIn } from "lucide-react";

const Header: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { openModal } = useModalStore();

  const handleLoginClick = () => {
    console.log(
      '[Header.tsx] Tombol Login diklik. Memanggil openModal("login").',
    );
    if (typeof openModal === "function") {
      openModal("login");
      setTimeout(() => {
        console.log(
          '[Header.tsx] Status modal setelah panggil openModal("login"):',
          useModalStore.getState().currentOpenModal,
        );
      }, 0);
    } else {
      console.error("[Header.tsx] openModal is not a function!");
    }
  };

  const handleRegisterClick = () => {
    console.log(
      '[Header.tsx] Tombol Daftar diklik. Memanggil openModal("register").',
    );
    if (typeof openModal === "function") {
      openModal("register");
      setTimeout(() => {
        console.log(
          '[Header.tsx] Status modal setelah panggil openModal("register"):',
          useModalStore.getState().currentOpenModal,
        );
      }, 0);
    } else {
      console.error("[Header.tsx] openModal is not a function!");
    }
  };

  return (
    <header className="bg-brand-surface border-brand-muted/20 sticky top-0 z-50 border-b shadow-lg">
      <div className="container mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-3.5 sm:px-6 lg:px-8">
        <div className="flex items-center gap-x-4">
          <Link
            to="/"
            className="group flex items-center"
            aria-label="Ke Halaman Utama"
          >
            <Home
              size={28}
              className="text-brand-primary group-hover:text-brand-accent transition-colors duration-300"
            />
            <span className="font-heading text-brand-text group-hover:text-brand-primary ml-2 text-xl font-bold transition-colors duration-300 sm:text-2xl">
              Travel
              <span className="text-brand-primary group-hover:text-brand-accent transition-colors duration-300">
                Article
              </span>
            </span>
          </Link>
          {isAuthenticated && (
            <nav className="hidden items-center space-x-2 sm:flex">
              <Link to="/articles">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-text hover:text-brand-primary hover:bg-brand-primary/10 font-medium"
                >
                  <LayoutGrid size={16} className="mr-1.5" /> Artikel
                </Button>
              </Link>
              <Link to="/categories">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-brand-text hover:text-brand-primary hover:bg-brand-primary/10 font-medium"
                >
                  <ListChecks size={16} className="mr-1.5" /> Kategori
                </Button>
              </Link>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-x-3">
          {isAuthenticated ? (
            <LogoutButton />
          ) : (
            <>
              <Button
                variant="outline"
                size="sm"
                className="border-brand-primary text-brand-primary hover:bg-brand-primary/10 hover:text-brand-primary font-semibold"
                onClick={handleLoginClick}
              >
                <LogIn size={16} className="mr-1.5" /> Login
              </Button>
              <Button
                size="sm"
                className="bg-brand-accent text-brand-text font-semibold hover:bg-opacity-90"
                onClick={handleRegisterClick}
              >
                <UserPlus size={16} className="mr-1.5" /> Daftar
              </Button>
            </>
          )}
        </div>
      </div>
      {isAuthenticated && (
        <div className="border-brand-muted/10 border-t py-2 sm:hidden">
          <nav className="container mx-auto flex items-center justify-around px-4">
            <Link to="/articles">
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-text hover:text-brand-primary hover:bg-brand-primary/10 flex-1 font-medium"
              >
                <LayoutGrid size={16} className="mr-1.5" /> Artikel
              </Button>
            </Link>
            <Link to="/categories">
              <Button
                variant="ghost"
                size="sm"
                className="text-brand-text hover:text-brand-primary hover:bg-brand-primary/10 flex-1 font-medium"
              >
                <ListChecks size={16} className="mr-1.5" /> Kategori
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
