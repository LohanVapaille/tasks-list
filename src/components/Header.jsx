import useAppContext from "../context/useAppContext";

const Header = () => {
  const { isDarkMode, toggleDarkMode, clearAllNotes, notesSummary } =
    useAppContext();

  return (
    <header className="header">
      <div>
        <h1>Chose à faire !</h1>
        <p>Ajoute une tâche dans la liste pour ne pas l'oublier</p>
        <p>
          Total: {notesSummary.total} | À faire: {notesSummary.pending} | Fait:{" "}
          {notesSummary.completed}
        </p>
      </div>
      <button className="btndarkmode" onClick={toggleDarkMode}>
        Passer en mode {isDarkMode ? "Clair" : "Sombre"}
      </button>
      <button onClick={clearAllNotes} className="btn-clear">
        Vider toutes les notes
      </button>
    </header>
  );
};

export default Header;
