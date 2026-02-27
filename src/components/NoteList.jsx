const NoteList = ({ notes, onToggle, onDelete }) => {
  if (notes.length === 0) {
    return <p className="empty-message">Votre liste de tâches est vide ! </p>;
  }
  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            {/* 1. La Checkbox */}
            <input
              type="checkbox"
              checked={note.completed}
              onChange={() => onToggle(note.id)}
            />

            {/* 2. Le Texte (barré si completed est true) */}
            <span
              style={{
                textDecoration: note.completed ? "line-through" : "none",
                opacity: note.completed ? 0.5 : 1,
              }}
            >
              {note.text}
            </span>

            {/* 3. Le bouton supprimer */}
            <button
              onClick={() => onDelete(note.id)}
              style={{ color: "red", marginLeft: "auto" }}
            >
              X
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default NoteList;
