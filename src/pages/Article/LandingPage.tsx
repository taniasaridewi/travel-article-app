import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Compass, BookOpen, Users, Zap } from "lucide-react";
import { useAuthStore } from "@/store/authStore";

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/articles");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900 text-white antialiased">
      <header className="container mx-auto flex items-center justify-between px-6 py-6">
        <div className="text-3xl font-bold tracking-tight">
          Travel<span className="text-indigo-400">Article</span>
        </div>
        <nav className="space-x-4">
          {isAuthenticated ? (
            <>
              <Link to="/articles">
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  Artikel
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-slate-200 hover:bg-slate-700 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/register">
                <Button className="bg-indigo-500 text-white hover:bg-indigo-600">
                  Daftar
                </Button>
              </Link>
            </>
          )}
        </nav>
      </header>

      <section className="container mx-auto px-6 py-20 text-center md:py-32">
        <Compass
          size={64}
          className="mx-auto mb-8 animate-bounce text-indigo-400"
        />
        <h1 className="mb-6 text-5xl font-extrabold leading-tight md:text-7xl">
          Temukan{" "}
          <span className="bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent">
            Destinasi
          </span>{" "}
          Impianmu.
        </h1>
        <p className="mx-auto mb-10 max-w-3xl text-xl text-slate-300 md:text-2xl">
          Bagikan dan jelajahi artikel perjalanan menakjubkan dari seluruh
          dunia. Inspirasi tanpa batas untuk petualanganmu berikutnya.
        </p>
        <Button
          size="lg"
          className="transform rounded-lg bg-indigo-500 px-10 py-6 text-lg text-white shadow-lg transition-transform hover:scale-105 hover:bg-indigo-600"
          onClick={handleGetStarted}
        >
          Mulai Sekarang <ArrowRight size={20} className="ml-2" />
        </Button>
      </section>

      <section className="bg-slate-800/50 py-16 md:py-24">
        <div className="container mx-auto px-6">
          <h2 className="mb-16 text-center text-4xl font-bold">
            Mengapa Memilih Travel
            <span className="text-indigo-400">Article</span>?
          </h2>
          <div className="grid gap-10 md:grid-cols-3">
            <div className="rounded-xl bg-slate-700/70 p-8 shadow-xl transition-shadow duration-300 hover:shadow-indigo-500/30">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 shadow-lg">
                <BookOpen size={32} />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">
                Artikel Inspiratif
              </h3>
              <p className="leading-relaxed text-slate-300">
                Baca cerita perjalanan yang mendalam dan informatif dari para
                penulis berpengalaman.
              </p>
            </div>
            <div className="rounded-xl bg-slate-700/70 p-8 shadow-xl transition-shadow duration-300 hover:shadow-indigo-500/30">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 shadow-lg">
                <Users size={32} />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">
                Komunitas Traveler
              </h3>
              <p className="leading-relaxed text-slate-300">
                Bergabunglah dengan komunitas sesama petualang, bagikan
                pengalaman, dan dapatkan tips.
              </p>
            </div>
            <div className="rounded-xl bg-slate-700/70 p-8 shadow-xl transition-shadow duration-300 hover:shadow-indigo-500/30">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-500 shadow-lg">
                <Zap size={32} />
              </div>
              <h3 className="mb-3 text-2xl font-semibold">Mudah & Cepat</h3>
              <p className="leading-relaxed text-slate-300">
                Antarmuka yang ramah pengguna memudahkan Anda menemukan atau
                membuat artikel dengan cepat.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-20 text-center md:py-32">
        <h2 className="mb-6 text-4xl font-bold md:text-5xl">
          Siap Memulai Petualangan Literasimu?
        </h2>
        <p className="mx-auto mb-10 max-w-2xl text-xl text-slate-300">
          Daftar gratis dan mulailah menulis atau membaca artikel perjalanan
          hari ini!
        </p>
        <Button
          size="lg"
          variant="outline"
          className="transform rounded-lg border-indigo-400 px-10 py-6 text-lg text-indigo-400 shadow-lg transition-transform hover:scale-105 hover:bg-indigo-400 hover:text-white"
          onClick={() =>
            navigate(isAuthenticated ? "/articles/create" : "/register")
          }
        >
          {isAuthenticated ? "Tulis Artikel Pertamamu" : "Daftar Sekarang"}
        </Button>
      </section>

      <footer className="border-t border-slate-700 py-8 text-center">
        <p className="text-slate-400">
          &copy; {new Date().getFullYear()} TravelArticle. Dibuat dengan ❤️
          untuk para petualang.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
