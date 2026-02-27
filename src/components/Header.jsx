const Header = ({ isDarkMode, toggleDarkMode, clearAllNotes }) => {
  return (
    <header className="header">
      <div>
        <h1>Chose à faire !</h1>
        <p>Ajoute une tâche dans la liste pour ne pas l'oublier</p>
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
