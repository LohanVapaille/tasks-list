import { useEffect } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import AppProvider from "./context/AppContext";
import useAppContext from "./context/useAppContext";
import "./App.css";

const STORAGE_KEY = "mes-notes";

function AppContent() {
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
