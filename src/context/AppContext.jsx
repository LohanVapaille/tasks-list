import { useCallback, useMemo, useReducer } from "react";
import { AppContext } from "./appContextObject";

const STORAGE_KEY = "mes-notes";

const createInitialState = () => {
  const savedNotes = localStorage.getItem(STORAGE_KEY);

  if (savedNotes) {
    return {
      notes: JSON.parse(savedNotes),
      isDarkMode: false,
    };
  }

  return {
    notes: [],
    isDarkMode: false,
  };
};

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
      return {
        ...state,
        notes: state.notes.filter((note) => note.id !== action.payload),
      };
    }

    case "CLEAR_NOTES": {
      return {
        ...state,
        notes: [],
      };
    }

    case "TOGGLE_DARK_MODE": {
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

  const addNote = useCallback(
    (text) => {
      dispatch({ type: "ADD_NOTE", payload: text });
    },
    [dispatch],
  );

  const toggleComplete = useCallback(
    (id) => {
      dispatch({ type: "TOGGLE_NOTE", payload: id });
    },
    [dispatch],
  );

  const deleteNote = useCallback(
    (id) => {
      dispatch({ type: "DELETE_NOTE", payload: id });
    },
    [dispatch],
  );

  const clearAllNotes = useCallback(() => {
    dispatch({ type: "CLEAR_NOTES" });
  }, [dispatch]);

  const toggleDarkMode = useCallback(() => {
    dispatch({ type: "TOGGLE_DARK_MODE" });
  }, [dispatch]);

  const notesSummary = useMemo(() => {
    const completed = state.notes.filter((note) => note.completed).length;
    const total = state.notes.length;

    return {
      total,
      completed,
      pending: total - completed,
    };
  }, [state.notes]);

  const contextValue = useMemo(
    () => ({
      notes: state.notes,
      isDarkMode: state.isDarkMode,
      notesSummary,
      addNote,
      toggleComplete,
      deleteNote,
      clearAllNotes,
      toggleDarkMode,
    }),
    [
      state.notes,
      state.isDarkMode,
      notesSummary,
      addNote,
      toggleComplete,
      deleteNote,
      clearAllNotes,
      toggleDarkMode,
    ],
  );

  return (
    <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
  );
};

export default AppProvider;
