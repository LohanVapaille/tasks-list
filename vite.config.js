import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Configuration de Vite:
// - plugin React pour JSX, Fast Refresh, etc.
// - base pour que les assets fonctionnent sur GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: "/tasks-list/",
});
