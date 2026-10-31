import useAppContext from "../context/useAppContext";

const Header = ({ todayOnly, onToggleTodayOnly }) => {
  const { isDarkMode, toggleDarkMode, clearAllNotes, notesSummary, signOut } =
    useAppContext();

  const handleClearAll = () => {
    if (window.confirm("Supprimer toutes tes tâches sur tous tes appareils ?")) {
      clearAllNotes();
    }
  };

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
        <button
          className={`btn-today-filter${todayOnly ? " active" : ""}`}
          onClick={onToggleTodayOnly}
          aria-pressed={todayOnly}
        >
          Today Only{todayOnly ? " ✓" : ""}
        </button>
        <button className="btndarkmode" onClick={toggleDarkMode}>
          {isDarkMode ? "☀️ Mode clair" : "🌙 Mode sombre"}
        </button>

        <button onClick={handleClearAll} className="btn-clear">
          Tout supprimer
        </button>

        <button onClick={signOut} className="btndarkmode">
          Se déconnecter
        </button>
      </div>
    </header>
  );
};

export default Header;
