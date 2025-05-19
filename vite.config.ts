// vite.config.ts
import path from "path" // Pastikan untuk mengimpor 'path'
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), // Ini mendefinisikan @ sebagai ./src
    },
  },
})
