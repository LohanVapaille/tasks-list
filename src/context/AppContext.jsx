import { useReducer } from "react";
import { AppContext } from "./appContextObject";

const STORAGE_KEY = "mes-notes";

const createInitialState = () => {
  const savedNotes = localStorage.getItem(STORAGE_KEY);
  if (savedNotes) {
    return { notes: JSON.parse(savedNotes), isDarkMode: false };
  }
  return { notes: [], isDarkMode: false };
};

const appReducer = (state, action) => {
  switch (action.type) {
    // Trouve le case "ADD_NOTE" dans ton appReducer et remplace-le :
    case "ADD_NOTE": {
      const newNote = {
        id: Date.now(),
        text: action.payload.text,
        date: action.payload.date, // Ajout de la date cible
        completed: false,
      };
      // Optionnel : tu peux laisser le tri se faire au rendu ou directement à l'insertion
      return { ...state, notes: [newNote, ...state.notes] };
    }

    case "TOGGLE_NOTE": {
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload
            ? { ...note, completed: !note.completed }
            : note,
        ),
      };
    }

    case "EDIT_NOTE": {
      return {
        ...state,
        notes: state.notes.map((note) =>
          note.id === action.payload.id
            ? { ...note, text: action.payload.text }
            : note,
        ),
      };
    }

    case "DELETE_NOTE": {
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    }

    case "CLEAR_NOTES": {
      return { ...state, notes: [] };
    }

    case "TOGGLE_DARK_MODE": {
      return { ...state, isDarkMode: !state.isDarkMode };
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

  const addNote = (text, date) =>
    dispatch({ type: "ADD_NOTE", payload: { text, date } });
  const toggleComplete = (id) => dispatch({ type: "TOGGLE_NOTE", payload: id });
  const editNote = (id, text) =>
    dispatch({ type: "EDIT_NOTE", payload: { id, text } });
  const deleteNote = (id) => dispatch({ type: "DELETE_NOTE", payload: id });
  const clearAllNotes = () => dispatch({ type: "CLEAR_NOTES" });
  const toggleDarkMode = () => dispatch({ type: "TOGGLE_DARK_MODE" });

  const notesSummary = (() => {
    const completed = state.notes.filter((n) => n.completed).length;
    const total = state.notes.length;
    return { total, completed, pending: total - completed };
  })();

  const contextValue = {
    notes: state.notes,
    isDarkMode: state.isDarkMode,
    notesSummary,
    addNote,
    toggleComplete,
    editNote,
    deleteNote,
    clearAllNotes,
    toggleDarkMode,
  };

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
