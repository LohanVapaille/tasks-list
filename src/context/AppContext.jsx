import { useReducer } from "react";
import { AppContext } from "./appContextObject";

const STORAGE_KEY = "mes-notes";

// Fonction d'initialisation du state.
// Elle est passée à useReducer pour éviter de relire localStorage à chaque rendu.
const createInitialState = () => {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  if (savedNotes) {
    return {
      // JSON.parse convertit la chaîne stockée en tableau d'objets JS.
      notes: JSON.parse(savedNotes),
      isDarkMode: false,
    };
  }

  return {
    notes: [],
    isDarkMode: false,
  };
};

// Le reducer centralise toutes les transitions d'état de l'application.
const appReducer = (state, action) => {
  switch (action.type) {
    case "ADD_NOTE": {
      const newNote = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };

      return {
        ...state,
        notes: [newNote, ...state.notes],
      };
    }

    case "TOGGLE_NOTE": {
      // Inverse l'état completed de la note ciblée.
      return {
        ...state,
        notes: state.notes.map((note) => {
          if (note.id === action.payload) {
            return {
              ...note,
              completed: !note.completed,
            };
          }

          return note;
        }),
      };
    }

    case "DELETE_NOTE": {
      // Supprime la note ciblée en filtrant le tableau.
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    }

    case "CLEAR_NOTES": {
      // Vide complètement la liste.
      return {
        ...state,
        notes: [],
      };
    }

    case "TOGGLE_DARK_MODE": {
      // Bascule entre thème clair et sombre.
      return {
        ...state,
        isDarkMode: !state.isDarkMode,
      };
    }

    default:
      return state;
  }
};

const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(
    appReducer,
    undefined,
    createInitialState,
  );

  // Actions exposées au reste de l'app.
  const addNote = (text) => {
    dispatch({ type: "ADD_NOTE", payload: text });
  };

  const toggleComplete = (id) => {
    dispatch({ type: "TOGGLE_NOTE", payload: id });
  };

  const deleteNote = (id) => {
    dispatch({ type: "DELETE_NOTE", payload: id });
  };

  const clearAllNotes = () => {
    dispatch({ type: "CLEAR_NOTES" });
  };

  const toggleDarkMode = () => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  };

  // Calcul dérivé: statistiques affichées dans l'entête.
  const notesSummary = (() => {
    const completed = state.notes.filter((note) => note.completed).length;
    const total = state.notes.length;

    return {
      total,
      completed,
      pending: total - completed,
    };
  })();

  // Valeur unique injectée dans le Context.
  const contextValue = {
    notes: state.notes,
    isDarkMode: state.isDarkMode,
    notesSummary,
    addNote,
    toggleComplete,
    deleteNote,
    clearAllNotes,
    toggleDarkMode,
  };

  // Rend le provider qui enveloppe les enfants de l'application.
  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
