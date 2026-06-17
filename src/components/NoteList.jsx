import { useState } from "react";
import useAppContext from "../context/useAppContext";

const NoteCard = ({ note }) => {
  const { toggleComplete, editNote, deleteNote } = useAppContext();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(note.text);

  const handleSave = () => {
    const trimmed = draft.trim();
    if (trimmed.length < 3) return;
    editNote(note.id, trimmed);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setDraft(note.text);
    setIsEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
    if (e.key === "Escape") handleCancel();
  };

  return (
    <div className={`note-card ${note.completed ? "completed" : ""}`}>
      <div className="note-card-top">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={note.completed}
          onChange={() => toggleComplete(note.id)}
          title={
            note.completed ? "Marquer comme non faite" : "Marquer comme faite"
          }
        />

        {isEditing ? (
          <textarea
            className="edit-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            autoFocus
            rows={2}
          />
        ) : (
          <span className="note-text">{note.text}</span>
        )}
      </div>

      <div className="note-card-actions">
        {isEditing ? (
          <>
            <button className="btn-icon btn-save" onClick={handleSave}>
              ✓ Enregistrer
            </button>
            <button className="btn-icon btn-cancel" onClick={handleCancel}>
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-icon btn-edit"
              onClick={() => setIsEditing(true)}
              disabled={note.completed}
              title={
                note.completed
                  ? "Impossible de modifier une tâche terminée"
                  : "Modifier"
              }
            >
              ✏️ Modifier
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => deleteNote(note.id)}
              title="Supprimer"
            >
              🗑 Supprimer
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const NoteList = () => {
  const { notes } = useAppContext();

  if (notes.length === 0) {
    return (
      <p className="empty-message">
        Aucune tâche pour l'instant — ajoutez-en une ci-dessus !
      </p>
    );
  }

  return (
    <div className="note-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NoteList;
