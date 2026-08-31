import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  base: "/informatik-lernlabor/",
  plugins: [react()],
  resolve: {
    alias: {
      "next/link": fileURLToPath(new URL("./src/Link.tsx", import.meta.url)),
    },
  },
  build: {
    outDir: "docs",
    emptyOutDir: true,
  },
});
