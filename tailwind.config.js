// tailwind.config.js
const defaultTheme = require('tailwindcss/defaultTheme'); // Diperlukan untuk fallback font

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"], // Konfigurasi darkMode Anda
  content: [
    // Sesuaikan path ini jika struktur proyek Anda berbeda,
    // misalnya jika ada folder 'pages', 'components', dll. di luar 'src'
    // atau jika file HTML utama ada di root.
    "./index.html", // Jika file HTML utama ada di root
    "./src/**/*.{html,js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      // Menambahkan definisi font kustom kita
      fontFamily: {
        sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
        heading: ['Poppins', ...defaultTheme.fontFamily.sans],
      },
      // Menambahkan definisi warna kustom 'brand-*' kita
      // Ini akan ada di samping warna berbasis HSL dari shadcn/ui
      colors: {
        // Palet warna tema 'brand-*'
        'brand-primary': '#0077B6',      // Biru Cerulean Tua
        'brand-secondary': '#ADE8F4',   // Biru Langit Muda
        'brand-accent': '#FFB703',       // Kuning Selektif
        'brand-text': '#023047',         // Biru Imperial Tua (untuk teks utama)
        'brand-background': '#F1FAEE',  // Hijau Honeydew Muda (untuk latar belakang utama)
        'brand-surface': '#FFFFFF',      // Putih (untuk kartu, modal, dll.)
        'brand-muted': '#6C757D',         // Abu-abu (untuk teks sekunder, border)

        // Warna-warna dari konfigurasi shadcn/ui Anda (berbasis HSL) tetap ada
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        primary: { // Ini adalah 'primary' dari shadcn/ui, berbeda dari 'brand-primary' kita
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
        },
        secondary: { // Ini adalah 'secondary' dari shadcn/ui
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        muted: { // Ini adalah 'muted' dari shadcn/ui
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        accent: { // Ini adalah 'accent' dari shadcn/ui
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: { // Warna chart Anda
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      // Konfigurasi borderRadius Anda tetap ada
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      // Anda bisa menambahkan ekstensi lain di sini jika perlu, seperti keyframes untuk animasi
      // keyframes: {
      //   "accordion-down": { ... },
      //   "accordion-up": { ... }
      // },
      // animation: {
      //   "accordion-down": "accordion-down 0.2s ease-out",
      //   "accordion-up": "accordion-up 0.2s ease-out"
      // }
    }
  },
  plugins: [
    require("tailwindcss-animate"), // Plugin Anda yang sudah ada
    require('@tailwindcss/typography') // Tambahkan plugin typography
  ],
}
