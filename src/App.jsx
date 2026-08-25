// App.jsx
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

      <main className="main-layout">
        {/* Colonne Gauche : Tâches */}
        <section className="left-panel">
          <NoteForm />
          <NoteList />
        </section>

        {/* Colonne Droite : Google Calendar */}
        <section className="right-panel">
          <iframe
            src="https://calendar.google.com/calendar/embed?src=579ef670bc51f337df94849c37c2da46f3cd26bc7c5710a455f33f334ede0b47%40group.calendar.google.com&ctz=Europe%2FParis"
            style={{ border: 0 }}
            width="100%"
            height="600"
            frameBorder="0"
            scrolling="no"
            title="Google Calendar"
          />
        </section>
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
