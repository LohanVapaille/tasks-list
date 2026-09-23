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

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  const categoryClass = `note-card--${note.category || "fast"}`;

  return (
    <div
      className={`note-card ${categoryClass} ${note.completed ? "completed" : ""}`}
    >
      <div className="note-card-top">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={note.completed}
          onChange={() => toggleComplete(note.id)}
        />

        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
          {isEditing ? (
            <textarea
              className="edit-input"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              autoFocus
              rows={2}
            />
          ) : (
            <>
              <span className="note-text">{note.text}</span>
              {note.date && (
                <span className="note-date">📅 {formatDate(note.date)}</span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="note-card-actions">
        {isEditing ? (
          <>
            <button className="btn-icon btn-save" onClick={handleSave}>
              ✓
            </button>
            <button
              className="btn-icon btn-cancel"
              onClick={() => setIsEditing(false)}
            >
              ✕
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-icon btn-edit"
              onClick={() => setIsEditing(true)}
              disabled={note.completed}
            >
              ✏️
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => deleteNote(note.id)}
            >
              🗑
            </button>
          </>
        )}
      </div>
    </div>
  );
};

const NoteList = ({ category }) => {
  const { notes } = useAppContext();

  const filteredNotes = notes.filter(
    (note) => (note.category || "fast") === category,
  );

  if (filteredNotes.length === 0) {
    return <p className="empty-message">Aucune tâche ici.</p>;
  }

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    if (!a.date) return 1;
    if (!b.date) return -1;
    return a.date.localeCompare(b.date);
  });

  return (
    <div className="note-grid">
      {sortedNotes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default NoteList;
