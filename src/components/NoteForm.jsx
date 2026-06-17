import { useState, useRef, useEffect } from "react";
import useAppContext from "../context/useAppContext";

const NoteForm = () => {
  const [content, setContent] = useState("");
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

    addNote(content.trim());
    setContent("");
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
        <button type="submit">+ Ajouter</button>
      </form>
      {error && <p className="error">{error}</p>}
    </>
  );
};

export default NoteForm;
