import useAppContext from "../context/useAppContext";

const Header = () => {
  const { isDarkMode, toggleDarkMode, clearAllNotes, notesSummary } =
    useAppContext();

  return (
    <header>
      <div>
        <h1>Choses à faire</h1>
        <p>Ajoutez vos tâches, cochez-les au fil de la journée.</p>

        <div className="header-stats">
          <span className="stat-chip total">
            📋 {notesSummary.total} tâche{notesSummary.total !== 1 ? "s" : ""}
          </span>
          <span className="stat-chip pending">
            ⏳ {notesSummary.pending} en cours
          </span>
          <span className="stat-chip done">
            ✅ {notesSummary.completed} terminée
            {notesSummary.completed !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      <div className="header-actions">
        <button className="btndarkmode" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
        </button>

        <button onClick={clearAllNotes} className="btn-clear">
          Tout supprimer
        </button>
      </div>
    </header>
  );
};

export default Header;
