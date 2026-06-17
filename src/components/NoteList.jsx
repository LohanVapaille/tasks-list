// NoteList.jsx
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

  // Formater la date en français pour l'affichage (ex: 17/06/2026)
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <div className={`note-card ${note.completed ? "completed" : ""}`}>
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
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--accent)",
                    fontWeight: "600",
                    marginTop: "4px",
                  }}
                >
                  📅 Échéance : {formatDate(note.date)}
                </span>
              )}
            </>
          )}
        </div>
      </div>

      <div className="note-card-actions">
        {isEditing ? (
          <>
            <button className="btn-icon btn-save" onClick={handleSave}>
              ✓ Enregistrer
            </button>
            <button
              className="btn-icon btn-cancel"
              onClick={() => setIsEditing(false)}
            >
              Annuler
            </button>
          </>
        ) : (
          <>
            <button
              className="btn-icon btn-edit"
              onClick={() => setIsEditing(true)}
              disabled={note.completed}
            >
              ✏️ Modifier
            </button>
            <button
              className="btn-icon btn-delete"
              onClick={() => deleteNote(note.id)}
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
      <p className="empty-message">Aucune tâche planifiée dans l'agenda.</p>
    );
  }

  // TRI DE L'AGENDA : Du plus proche (le plus tôt) au plus lointain (le plus tard)
  const sortedNotes = [...notes].sort((a, b) => {
    // Si une tâche n'a pas de date, on la pousse à la fin
    if (!a.date) return 1;
    if (!b.date) return -1;

    // Comparaison des chaînes de caractères "YYYY-MM-DD"
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
