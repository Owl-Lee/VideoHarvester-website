import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  root: fileURLToPath(new URL("./pages", import.meta.url)),
  publicDir: fileURLToPath(new URL("./public", import.meta.url)),
  base: process.env.PAGES_BASE || "/",
  plugins: [react()],
  build: { outDir: "../dist-pages", emptyOutDir: true },
});
