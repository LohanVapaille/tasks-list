import { useContext } from "react";
import { AppContext } from "./appContextObject";

const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error("useAppContext doit être utilisé dans AppProvider");
  }

  return context;
};

export default useAppContext;
