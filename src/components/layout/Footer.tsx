import React from "react";
import { Link } from "react-router-dom";
import { Linkedin, Mail, Github } from "lucide-react";

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const linkedinUrl = "https://www.linkedin.com/in/tania-sari-dewi/";
  const emailAddress = "taniasaridewi1012@gmail.com";
  const githubUrl = "https://github.com/TaniaSariDewi";

  return (
    <footer className="bg-brand-surface border-brand-muted/20 text-brand-text border-t py-10 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              TravelArticle
            </h3>
            <p className="text-brand-muted text-sm leading-relaxed">
              Platform untuk berbagi dan menemukan inspirasi perjalanan dari
              seluruh dunia. Jelajahi, tulis, dan terhubung dengan sesama
              petualang.
            </p>
          </div>
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              Navigasi Cepat
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-brand-primary hover:underline"
                >
                  Beranda
                </Link>
              </li>
              <li>
                <Link
                  to="/articles"
                  className="hover:text-brand-primary hover:underline"
                >
                  Artikel
                </Link>
              </li>
              <li>
                <Link
                  to="/categories"
                  className="hover:text-brand-primary hover:underline"
                >
                  Kategori
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-heading mb-3 text-lg font-semibold">
              Hubungi Saya (Tania Sari Dewi)
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a
                  href={`mailto:${emailAddress}`}
                  className="hover:text-brand-primary flex items-center hover:underline"
                >
                  <Mail size={16} className="mr-2 flex-shrink-0" />{" "}
                  {emailAddress}
                </a>
              </li>
              <li>
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary flex items-center hover:underline"
                >
                  <Linkedin size={16} className="mr-2 flex-shrink-0" /> LinkedIn
                </a>
              </li>
              <li>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-primary flex items-center hover:underline"
                >
                  <Github size={16} className="mr-2 flex-shrink-0" /> GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-brand-muted/20 border-t pt-8 text-center">
          <p className="text-brand-muted text-sm">
            &copy; {currentYear} TravelArticle App. Dibuat oleh Tania Sari Dewi.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
