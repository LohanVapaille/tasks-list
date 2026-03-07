import { useContext } from "react";
import { AppContext } from "./appContextObject";

// Hook custom pour centraliser l'accès au Context.
// Avantage: importer une seule fonction au lieu de useContext + AppContext partout.
const useAppContext = () => {
  const context = useContext(AppContext);

  return context;
};

export default useAppContext;
