import { createContext } from "react";

// Objet Context partagé dans toute l'application.
// null par défaut: utile pour détecter une mauvaise utilisation hors Provider.
export const AppContext = createContext(null);
