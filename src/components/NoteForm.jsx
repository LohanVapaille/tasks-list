import { useState, useRef, useEffect } from "react";
import useAppContext from "../context/useAppContext";

const NoteForm = () => {
  const [content, setContent] = useState("");
  const inputRef = useRef(null);
  const { addNote } = useAppContext();

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.length < 3) return;

    addNote(content);
    setContent("");
    inputRef.current.focus();
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        ref={inputRef}
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Ajouter une note..."
      />
      <button type="submit">Ajouter</button>
    </form>
  );
};

export default NoteForm;
