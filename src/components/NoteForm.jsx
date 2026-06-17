// NoteForm.jsx
import { useState, useRef, useEffect } from "react";
import useAppContext from "../context/useAppContext";

const NoteForm = () => {
  const [content, setContent] = useState("");
  const [date, setDate] = useState(""); // Nouvel état pour la date
  const [error, setError] = useState("");
  const inputRef = useRef(null);
  const { addNote } = useAppContext();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (content.trim().length < 3) {
      setError("La tâche doit contenir au moins 3 caractères.");
      return;
    }
    if (!date) {
      setError("Veuillez sélectionner une date pour l'agenda.");
      return;
    }

    addNote(content.trim(), date); // Envoi du texte et de la date
    setContent("");
    setDate("");
    setError("");
    inputRef.current.focus();
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
          placeholder="Nouvelle tâche..."
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{
            padding: "11px",
            borderRadius: "10px",
            border: "1.5px solid var(--border)",
            background: "var(--surface)",
            color: "var(--text-primary)",
          }}
        />
        <button type="submit">+ Ajouter</button>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default NoteForm;
