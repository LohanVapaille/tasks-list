// NoteForm.jsx
import { useState, useRef, useEffect } from "react";
import useAppContext from "../context/useAppContext";

const getTodayString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const NoteForm = ({ category }) => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(getTodayString());
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { addNote } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim().length < 3) {
      setError("La tâche doit contenir au moins 3 caractères.");
      return;
    }
    if (!date) {
      setError("Veuillez sélectionner une date.");
      return;
    }

    addNote(content.trim(), date, category);
    setContent("");
    setDate(getTodayString());
    setError("");
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="note-form">
        <input
          ref={inputRef}
          type="text"
          value={content}
          onChange={(e) => {
            setContent(e.target.value);
            if (error) setError("");
          }}
          placeholder={
            category === "fast"
              ? "Nouvelle tâche rapide..."
              : "Nouvelle tâche long terme..."
          }
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "8px",
            borderRadius: "10px",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
          }}
        />
        <button type="submit">+</button>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default NoteForm;
