import { useEffect } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import AppProvider from "./context/AppContext";
import useAppContext from "./context/useAppContext";
import "./App.css";

// Clé unique utilisée pour sauvegarder/recharger les notes dans le navigateur.
const STORAGE_KEY = "mes-notes";

function AppContent() {
  // Récupère l'état global partagé via le Context.
  const { notes, isDarkMode } = useAppContext();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  }, [notes]);

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <Header />

      <main>
        <NoteForm />
        <NoteList />
      </main>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
