// src/pages/LandingPage.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  // ArrowRight,
  Linkedin,
  Mail,
  // Briefcase,
  BookOpen,
  Layers,
  // Users,
  Code,
  CheckCircle,
  // Award,
  GraduationCap
  // ExternalLink,
  // Home,
} from "lucide-react";
// import { useAuthStore } from "@/store/authStore";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const portfolioData = {
  name: "Tania Sari Dewi",
  title: "Front-End Developer",
  location: "Cikarang Barat, Kabupaten Bekasi, Jawa Barat, Indonesia",
  email: "taniasaridewi1012@gmail.com",
  linkedin: "www.linkedin.com/in/tania-sari-dewi",
  summary:
    "Front-End Developer dengan dua tahun pengalaman, berspesialisasi dalam React.js, HTML, CSS, dan Bootstrap untuk membangun antarmuka pengguna yang responsif dan menarik secara visual. Terampil dalam membuat komponen dinamis dan interaktif serta menyusun tata letak yang bersih dan terstruktur. Bersemangat dalam meningkatkan pengalaman pengguna di berbagai perangkat dan berkomitmen untuk tetap mengikuti tren dan praktik terbaik front-end untuk memastikan hasil berkualitas tinggi.",
  keyCompetencies: [
    "React.JS",
    "HTML, CSS",
    "Bootstrap 5",
    "JavaScript",
    "Excellent Communication Skill",
    "Good Teamwork Skill",
    "Time Management",
    "Attention to Detail",
    "Visual Studio Code",
    "OpenProject",
    "Swagger",
    "Github",
  ],
  experience: [
    {
      company: "PT. Cahaya Jakarta",
      role: "Front-End Web Developer",
      period: "Jan 2024 - Sekarang",
      description:
        "Mengembangkan dan mengimplementasikan UI responsif menggunakan HTML, CSS, JavaScript, dan React.JS. Melakukan validasi UI/UX dan pengujian fungsional. Berkolaborasi dengan tim untuk optimasi dan perbaikan bug.",
    },
    {
      company: "PT. Cahaya Jakarta",
      role: "Front-End Web Developer Intern",
      period: "Jun 2023 - Des 2023",
      description:
        "Membantu pengembangan antarmuka yang ramah pengguna, berkolaborasi dengan desainer UI/UX dan pengembang backend untuk integrasi API.",
    },
    {
      company: "PT. Starion Wooin",
      role: "Full-Stack Web Developer Intern",
      period: "Jun 2022 - Sep 2022",
      description:
        "Berkontribusi pada desain dan pengembangan aplikasi web baru menggunakan PHP native, HTML, CSS, dan Bootstrap 5.",
    },
  ],
  education: {
    degree: "Bachelor of Science in Computing (B.Sc.IT)",
    major: "Teknologi Informasi",
    period: "Sep 2019 - Okt 2023",
    thesis:
      "Implementasi Algoritma C4.5 untuk Memprediksi Kelancaran Pembayaran Pinjaman pada Koperasi",
    gpa: "3.41 / 4.00",
  },
};

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  // const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <div className="bg-brand-background text-brand-text flex min-h-screen flex-col antialiased">
      <Header />

      <main className="flex-grow">
        <section className="from-brand-primary bg-gradient-to-br via-indigo-700 to-purple-800 py-16 text-white md:py-24">
          <div className="container mx-auto px-6 text-center">
            <Code
              size={64}
              className="text-brand-accent mx-auto mb-6 animate-pulse"
            />
            <h1 className="font-heading mb-4 text-4xl font-extrabold leading-tight sm:text-5xl md:text-6xl">
              {portfolioData.name}
            </h1>
            <p className="mb-8 text-2xl font-medium text-indigo-200 sm:text-3xl">
              {portfolioData.title}
            </p>
            <p className="mx-auto mb-10 max-w-3xl text-lg leading-relaxed text-indigo-100 md:text-xl">
              {portfolioData.summary}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/articles")}
                className="bg-brand-accent text-brand-text transform rounded-lg px-8 py-3 text-lg font-semibold shadow-xl transition-transform hover:scale-105 hover:bg-opacity-90"
              >
                Lihat Semua Artikel <BookOpen size={20} className="ml-2.5" />
              </Button>
              <a
                href={`https://${portfolioData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="hover:text-brand-primary transform rounded-lg border-indigo-300 px-8 py-3 text-lg font-semibold text-indigo-100 shadow-lg transition-transform hover:scale-105 hover:bg-indigo-100"
                >
                  LinkedIn Saya <Linkedin size={20} className="ml-2.5" />
                </Button>
              </a>
            </div>
          </div>
        </section>

        <section className="bg-brand-surface py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-heading text-brand-text mb-12 text-center text-3xl font-bold sm:text-4xl">
              Kompetensi Utama
            </h2>
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
              {portfolioData.keyCompetencies.map((skill, index) => (
                <div
                  key={index}
                  className="border-brand-muted/20 flex items-center rounded-lg border bg-white p-4 shadow-md transition-shadow hover:shadow-lg"
                >
                  <CheckCircle
                    size={20}
                    className="mr-3 flex-shrink-0 text-green-500"
                  />
                  <span className="text-brand-text text-sm sm:text-base">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-background py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-heading text-brand-text mb-12 text-center text-3xl font-bold sm:text-4xl">
              Pengalaman Profesional
            </h2>
            <div className="space-y-10">
              {portfolioData.experience.map((exp, index) => (
                <div
                  key={index}
                  className="bg-brand-surface border-brand-muted/20 rounded-xl border p-6 shadow-lg"
                >
                  <div className="mb-2 flex flex-col items-start justify-between sm:flex-row sm:items-center">
                    <h3 className="font-heading text-brand-primary text-xl font-semibold sm:text-2xl">
                      {exp.role}
                    </h3>
                    <span className="text-brand-muted mt-1 text-sm sm:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-md text-brand-text mb-3 font-medium">
                    {exp.company}
                  </p>
                  <p className="text-brand-muted text-sm leading-relaxed">
                    {exp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-brand-surface py-16 md:py-20">
          <div className="container mx-auto px-6">
            <h2 className="font-heading text-brand-text mb-12 text-center text-3xl font-bold sm:text-4xl">
              Pendidikan
            </h2>
            <div className="border-brand-muted/20 mx-auto max-w-2xl rounded-xl border bg-white p-6 shadow-lg">
              <div className="mb-3 flex items-center">
                <GraduationCap size={28} className="text-brand-primary mr-4" />
                <div>
                  <h3 className="font-heading text-brand-primary text-xl font-semibold sm:text-2xl">
                    {portfolioData.education.degree}
                  </h3>
                  <p className="text-md text-brand-text font-medium">
                    {portfolioData.education.major}
                  </p>
                </div>
              </div>
              <p className="text-brand-muted mb-1 text-sm">
                Periode: {portfolioData.education.period}
              </p>
              <p className="text-brand-muted mb-1 text-sm">
                Skripsi: {portfolioData.education.thesis}
              </p>
              <p className="text-brand-muted text-sm">
                IPK: {portfolioData.education.gpa}
              </p>
            </div>
          </div>
        </section>

        <section className="bg-gradient-to-r from-indigo-600 to-purple-700 py-16 text-white md:py-24">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading mb-6 text-3xl font-bold sm:text-4xl">
              Jelajahi Lebih Lanjut
            </h2>
            <p className="mx-auto mb-10 max-w-2xl text-lg text-indigo-100 md:text-xl">
              Lihat koleksi artikel perjalanan atau telusuri berdasarkan
              kategori.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                size="lg"
                onClick={() => navigate("/articles")}
                className="bg-brand-accent text-brand-text transform rounded-lg px-8 py-3 text-lg font-semibold shadow-xl transition-transform hover:scale-105 hover:bg-opacity-80"
              >
                Lihat Semua Artikel <BookOpen size={20} className="ml-2.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/categories")}
                className="hover:text-brand-primary transform rounded-lg border-indigo-300 px-8 py-3 text-lg font-semibold text-indigo-100 shadow-lg transition-transform hover:scale-105 hover:bg-indigo-100"
              >
                Lihat Kategori <Layers size={20} className="ml-2.5" />
              </Button>
            </div>
          </div>
        </section>

        <section className="bg-brand-background py-16 md:py-20">
          <div className="container mx-auto px-6 text-center">
            <h2 className="font-heading text-brand-text mb-6 text-3xl font-bold sm:text-4xl">
              Hubungi Saya
            </h2>
            <p className="text-brand-muted mx-auto mb-8 max-w-xl text-lg">
              Saya selalu terbuka untuk diskusi, kolaborasi, atau sekadar
              bertukar ide.
            </p>
            <div className="flex flex-col items-center justify-center gap-6 sm:flex-row">
              <a href={`mailto:${portfolioData.email}`}>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-brand-primary text-brand-primary hover:bg-brand-primary rounded-lg px-8 py-3 text-lg font-medium shadow-md transition-all hover:text-white hover:shadow-lg"
                >
                  <Mail size={20} className="mr-2.5" /> Email Saya
                </Button>
              </a>
              <a
                href={`https://${portfolioData.linkedin}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  size="lg"
                  className="rounded-lg bg-[#0077B5] px-8 py-3 text-lg font-medium text-white shadow-md transition-all hover:bg-[#005A8D] hover:shadow-lg"
                >
                  <Linkedin size={20} className="mr-2.5" /> LinkedIn
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LandingPage;
