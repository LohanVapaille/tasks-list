import { useState } from "react";
import Header from "./components/Header";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const saved = localStorage.getItem("mes-notes");
    if (saved) {
      return JSON.parse(saved);
    } else {
      return [];
    }
  });

  const clearAllNotes = () => {
    setNotes([]);

    localStorage.removeItem("mes-notes");
  };

  const [isDarkMode, setIsDarkMode] = useState(false);

  // Inverser l'état "fait / à faire"
  const toggleComplete = (id) => {
    const updatedNotes = notes.map((note) => {
      if (note.id === id) {
        return {
          id: note.id,
          text: note.text,
          completed: !note.completed, // false devient true, ou l'inverse
        };
      } else {
        return note;
      }
    });
    setNotes(updatedNotes);
  };

  // Supprimer une seule note
  const deleteNote = (id) => {
    const updatedNotes = notes.filter((note) => note.id !== id);
    setNotes(updatedNotes);
  };

  const addNote = (text) => {
    const newNote = { id: Date.now(), text, completed: false };
    setNotes([newNote, ...notes]);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className={`app ${isDarkMode ? "dark" : "light"}`}>
      <Header
        isDarkMode={isDarkMode}
        toggleDarkMode={toggleDarkMode}
        clearAllNotes={clearAllNotes}
      />

      <main>
        <NoteForm onAddNote={addNote} />
        <NoteList
          notes={notes}
          onToggle={toggleComplete}
          onDelete={deleteNote}
        />
      </main>
    </div>
  );
}

export default App;
