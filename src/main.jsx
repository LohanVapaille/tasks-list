import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

// Point d'entrée React:
// - on cible l'élément HTML #root
// - on monte l'application React dedans
createRoot(document.getElementById("root")).render(
  // StrictMode aide à repérer des mauvaises pratiques en développement.
  // Il n'affecte pas le rendu final en production.
  <StrictMode>
    <App />
  </StrictMode>,
);
