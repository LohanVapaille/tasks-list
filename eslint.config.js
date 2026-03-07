import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

// Configuration ESLint "flat" (format moderne).
export default defineConfig([
  // Ignore le dossier de build généré par Vite.
  globalIgnores(["dist"]),
  {
    // Applique les règles à tous les fichiers JS/JSX du projet.
    files: ["**/*.{js,jsx}"],
    extends: [
      // Règles JS de base.
      js.configs.recommended,
      // Bonnes pratiques des hooks React (useEffect, dépendances...).
      reactHooks.configs.flat.recommended,
      // Vérifications pour le rechargement à chaud (Fast Refresh).
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    rules: {
      // Autorise des variables non utilisées si elles commencent par majuscule ou _.
      // Pratique pour certains composants/constants temporaires.
      "no-unused-vars": ["error", { varsIgnorePattern: "^[A-Z_]" }],
    },
  },
]);
