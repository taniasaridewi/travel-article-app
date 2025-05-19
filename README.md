# Travel Article App

Selamat datang di Travel Article App! Aplikasi web ini memungkinkan pengguna untuk menjelajahi, membuat, dan berinteraksi dengan artikel perjalanan dari berbagai destinasi. Pengguna dapat mendaftar, login, mengelola artikel dan kategori mereka sendiri, serta berdiskusi melalui fitur komentar. Aplikasi ini dibangun dengan fokus pada pengalaman pengguna yang bersih, responsif, dan menarik secara visual.

Proyek ini dikembangkan sebagai demonstrasi keahlian dalam pengembangan frontend modern, menampilkan informasi dan portofolio dari Tania Sari Dewi.

## Fitur Utama

* **Autentikasi Pengguna**: Sistem registrasi dan login pengguna yang aman (melalui modal), serta fungsionalitas logout.
* **Manajemen Artikel (CRUD)**:
    * Membuat artikel baru dengan judul, deskripsi, kategori, dan gambar sampul (upload gambar).
    * Menampilkan daftar artikel dalam format kartu yang menarik, lengkap dengan filter (judul, kategori), sorting, dan pagination.
    * Menampilkan halaman detail artikel yang komprehensif.
    * Mengedit artikel yang sudah ada (jika pengguna adalah pemiliknya) melalui modal.
    * Menghapus artikel (jika pengguna adalah pemiliknya).
* **Manajemen Kategori (CRUD)**:
    * Membuat, membaca, mengedit, dan menghapus kategori artikel melalui modal.
    * Menampilkan daftar kategori dalam format kartu.
    * Artikel dapat difilter berdasarkan kategori yang dipilih dari daftar kategori.
* **Sistem Komentar**:
    * Pengguna yang sudah login dapat menambahkan komentar pada artikel.
    * Pengguna dapat mengedit dan menghapus komentar mereka sendiri.
    * Menampilkan indikator "(diedit)" jika komentar telah dimodifikasi.
* **Halaman Landing**: Halaman utama yang menarik, menampilkan ringkasan portofolio developer (Tania Sari Dewi) dan navigasi ke fitur aplikasi.
* **Antarmuka Pengguna**:
    * Desain responsif untuk semua jenis perangkat (desktop & mobile).
    * Tema warna dan font kustom yang autentik dan profesional.
    * Notifikasi interaktif menggunakan sistem Toast (menggantikan `alert()` standar).
    * Indikator loading untuk operasi asynchronous.
    * Penanganan error yang informatif.
* **State Management**: Pengelolaan state aplikasi yang efisien menggunakan Zustand.
* **Validasi Form**: Validasi input pengguna di sisi klien menggunakan Zod.

## Tumpukan Teknologi (Tech Stack)

* **Framework/Library Utama**: React.js (dengan Vite)
* **Bahasa Pemrograman**: TypeScript, HTML5, CSS3
* **Styling**:
    * Tailwind CSS (framework CSS utility-first)
    * shadcn/ui (koleksi komponen UI yang dapat digunakan kembali)
    * Font Kustom: Poppins (untuk judul), Open Sans (untuk teks isi) dari Google Fonts
* **State Management**: Zustand
* **Routing**: React Router DOM v6
* **Klien API**: Axios (dengan interceptor untuk token JWT)
* **Form Handling**: React Hook Form
* **Validasi Skema**: Zod
* **Ikon**: Lucide React
* **Linting & Formatting**: ESLint, Prettier (konfigurasi direkomendasikan)
* **Build Tool**: Vite

## Struktur Proyek (Konvensi Penamaan)

Proyek ini mengikuti struktur folder yang umum untuk aplikasi React modern:

travel-article-app/
├── public/                 # Aset statis dan index.html
├── src/
│   ├── App.tsx             # Komponen utama aplikasi, merender Outlet router dan Modal global
│   ├── main.tsx            # Titik masuk aplikasi, merender App dengan RouterProvider
│   ├── index.css           # CSS Global dan direktif Tailwind
│   ├── vite-env.d.ts       # Definisi tipe untuk Vite
│   ├── assets/             # Gambar statis, font kustom (jika tidak dari CDN)
│   ├── components/
│   │   ├── ui/             # Komponen dari shadcn/ui (Button, Input, Select, dll.)
│   │   ├── common/         # Komponen umum yang dapat digunakan kembali (misal: ModalDialog.tsx)
│   │   ├── layout/         # Komponen layout (Header.tsx, Footer.tsx, MainLayout.tsx)
│   │   ├── auth/           # Komponen terkait otentikasi (LoginForm.tsx, RegisterForm.tsx, LogoutButton.tsx)
│   │   ├── articles/       # Komponen terkait artikel (ArticleCard.tsx, ArticleForm.tsx)
│   │   ├── categories/     # Komponen terkait kategori (CategoryCard.tsx, CategoryForm.tsx)
│   │   └── modals/         # Komponen modal global (AuthModals.tsx, ArticleModals.tsx, CategoryModals.tsx)
│   ├── constants/
│   │   └── apiEndpoints.ts # Kumpulan URL endpoint API
│   ├── hooks/
│   │   └── use-toast.ts    # Hook kustom untuk notifikasi (dari shadcn/ui)
│   ├── layouts/
│   │   └── MainLayout.tsx  # Layout utama dengan Header & Footer
│   ├── lib/
│   │   └── utils.ts        # Fungsi utilitas (misal: cn dari shadcn/ui)
│   ├── pages/              # Komponen level halaman, dikelompokkan per fitur
│   │   ├── Auth/           # (Dihapus, karena login/register via modal)
│   │   ├── Article/        # ArticleListPage.tsx, ArticleDetailPage.tsx, (Create/Edit jika halaman terpisah)
│   │   ├── Category/       # CategoryListPage.tsx, (Create/Edit jika halaman terpisah)
│   │   └── LandingPage.tsx # Halaman utama aplikasi
│   ├── router/
│   │   └── index.tsx       # Konfigurasi routing dengan React Router DOM
│   ├── services/           # Logika untuk interaksi dengan API
│   │   ├── apiClient.ts    # Konfigurasi instance Axios
│   │   ├── authService.ts
│   │   ├── articleService.ts
│   │   ├── categoryService.ts
│   │   └── fileService.ts  # Untuk upload gambar
│   ├── store/              # State management menggunakan Zustand
│   │   ├── authStore.ts
│   │   ├── articleStore.ts
│   │   ├── categoryStore.ts
│   │   └── modalStore.ts
│   └── types/              # Definisi tipe TypeScript global
│       ├── articleTypes.ts
│       ├── categoryTypes.ts
│       ├── commentTypes.ts
│       └── fileTypes.ts
├── .eslintrc.cjs           # Konfigurasi ESLint
├── .gitignore
├── index.html              # HTML utama (jika Vite, ada di root)
├── package.json
├── postcss.config.js       # Konfigurasi PostCSS (untuk Tailwind)
├── tailwind.config.js      # Konfigurasi Tailwind CSS
├── tsconfig.json           # Konfigurasi TypeScript
├── tsconfig.node.json
└── vite.config.ts          # Konfigurasi Vite

## Instalasi Proyek

1.  **Clone Repository**:
    ```bash
    git clone [URL_REPOSITORY_ANDA]
    cd travel-article-app
    ```

2.  **Instal Dependensi**:
    Pastikan Anda memiliki Node.js dan npm (atau Yarn) terinstal.
    ```bash
    npm install
    # atau
    # yarn install
    ```

3.  **Konfigurasi Environment Variables (jika ada)**:
    Buat file `.env` di root proyek jika ada variabel environment yang perlu diatur (misalnya, `VITE_API_BASE_URL`). Untuk proyek ini, URL API utama telah didefinisikan di `src/constants/apiEndpoints.ts`.

    Contoh `.env`:
    ```
    VITE_API_BASE_URL=[https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api](https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api)
    ```
    Dan pastikan `apiClient.ts` atau `apiEndpoints.ts` menggunakan `import.meta.env.VITE_API_BASE_URL`.

4.  **Jalankan Aplikasi**:
    ```bash
    npm run dev
    # atau
    # yarn dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173` (atau port lain yang dikonfigurasi Vite).

## Skrip yang Tersedia

Dalam direktori proyek, Anda dapat menjalankan:

* `npm run dev` atau `yarn dev`:
    Menjalankan aplikasi dalam mode pengembangan.

* `npm run build` atau `yarn build`:
    Membangun aplikasi untuk produksi ke folder `dist`.

* `npm run lint` atau `yarn lint`:
    Menjalankan ESLint untuk memeriksa masalah kode (jika skrip ini dikonfigurasi di `package.json`).

* `npm run preview` atau `yarn preview`:
    Menjalankan server lokal untuk melihat hasil build produksi.

## Referensi API

Dokumentasi API yang digunakan untuk proyek ini dapat ditemukan di:
* [Postman API Documentation (Awal)](https://documenter.getpostman.com/view/14406239/2sAXxJiajq)
* Endpoint utama yang digunakan: `https://extra-brooke-yeremiadio-46b2183e.koyeb.app/api`

## Prinsip Pemrograman yang Diterapkan

Dalam pengembangan aplikasi ini, beberapa prinsip pemrograman esensial diusahakan untuk diterapkan, antara lain:
* **Clean Code**: Penulisan kode yang mudah dibaca, dipahami, dan dikelola.
* **Component-Based Architecture**: Memecah UI menjadi komponen-komponen yang dapat digunakan kembali.
* **Separation of Concerns**: Memisahkan logika bisnis, tampilan, dan manajemen state.
* **Type Safety**: Menggunakan TypeScript untuk mengurangi error dan meningkatkan kualitas kode.

## Tentang Pengembang

Aplikasi ini dikembangkan oleh **Tania Sari Dewi**, seorang Front-End Developer dengan pengalaman dalam membangun antarmuka pengguna yang responsif dan menarik menggunakan React.js dan teknologi web modern lainnya.

* **Email**: [taniasaridewi1012@gmail.com](mailto:taniasaridewi1012@gmail.com)
* **LinkedIn**: [www.linkedin.com/in/tania-sari-dewi](https://www.linkedin.com/in/tania-sari-dewi/)
* **GitHub**: (Tambahkan link GitHub Anda di sini jika ada)

---

Terima kasih telah mengunjungi repositori Travel Article App!


# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    // Add the react-x and react-dom plugins
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    // other rules...
    // Enable its recommended typescript rules
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```
