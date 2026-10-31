import { useCallback, useEffect, useReducer, useRef, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { AppContext } from "./appContextObject";

const LEGACY_STORAGE_KEY = "mes-notes";
const NOTE_COLUMNS = "id, text, date, category, completed";

const createInitialState = () => ({ notes: [], isDarkMode: false });

// Envoie une seule fois vers Supabase les tâches de l'ancienne version.
// Le localStorage n'est vidé qu'une fois l'envoi réussi.
const migrateLocalNotes = async (userId) => {
  const savedNotes = localStorage.getItem(LEGACY_STORAGE_KEY);
  if (!savedNotes) return null;

  const rows = JSON.parse(savedNotes).map((note) => ({
    user_id: userId,
    id: note.id,
    text: note.text,
    date: note.date || null,
    category: note.category || "fast",
    completed: Boolean(note.completed),
  }));

  if (rows.length > 0) {
    const { error } = await supabase
      .from("notes")
      .upsert(rows, { onConflict: "user_id,id", ignoreDuplicates: true });
    if (error) return error;
  }

  localStorage.removeItem(LEGACY_STORAGE_KEY);
  return null;
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTES": {
      return { ...state, notes: action.payload };
    }

    case "ADD_NOTE": {
      return { ...state, notes: [action.payload, ...state.notes] };
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

  // undefined = session en cours de lecture, null = personne de connecté.
  const [session, setSession] = useState(undefined);
  const [syncError, setSyncError] = useState("");
  const latestFetch = useRef(0);
  const userId = session?.user.id;

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));

    const { data } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => data.subscription.unsubscribe();
  }, []);

  const cancelPendingFetches = useCallback(() => {
    latestFetch.current++;
  }, []);

  // Seule la réponse de la lecture la plus récente est appliquée.
  const fetchNotes = useCallback(async () => {
    const fetchId = ++latestFetch.current;
    const { data, error } = await supabase
      .from("notes")
      .select(NOTE_COLUMNS)
      .order("id", { ascending: false });

    if (fetchId !== latestFetch.current) return;

    if (error) {
      setSyncError(`Synchronisation impossible : ${error.message}`);
      return;
    }

    dispatch({ type: "SET_NOTES", payload: data });
    setSyncError("");
  }, []);

  useEffect(() => {
    if (!userId) return undefined;

    const loadNotes = async () => {
      const migrationError = await migrateLocalNotes(userId);
      await fetchNotes();
      if (migrationError) {
        setSyncError(
          `Tes anciennes tâches n'ont pas pu être envoyées : ${migrationError.message}`,
        );
      }
    };
    loadNotes();

    // Un autre appareil a modifié une tâche: on relit la liste.
    // Le nom est unique car StrictMode monte l'effet deux fois de suite.
    const channel = supabase
      .channel(`notes-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "notes" },
        fetchNotes,
      )
      .subscribe();

    // Rattrape les changements manqués, par exemple téléphone en veille.
    const refreshIfVisible = () => {
      if (document.visibilityState === "visible") fetchNotes();
    };
    window.addEventListener("focus", refreshIfVisible);
    window.addEventListener("online", refreshIfVisible);
    document.addEventListener("visibilitychange", refreshIfVisible);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener("focus", refreshIfVisible);
      window.removeEventListener("online", refreshIfVisible);
      document.removeEventListener("visibilitychange", refreshIfVisible);
      cancelPendingFetches();
      dispatch({ type: "SET_NOTES", payload: [] });
    };
  }, [userId, fetchNotes, cancelPendingFetches]);

  // L'écran est mis à jour tout de suite, puis la relecture aligne l'état sur
  // Supabase. Si l'écriture échoue, elle annule donc aussi le changement local.
  const saveChange = async (request) => {
    const { error } = await request;
    await fetchNotes();
    if (error) {
      setSyncError(`Modification non enregistrée : ${error.message}`);
    }
  };

  const addNote = (text, date, category) => {
    const newNote = {
      id: Date.now(),
      text,
      date,
      category: category || "fast",
      completed: false,
    };
    dispatch({ type: "ADD_NOTE", payload: newNote });
    return saveChange(supabase.from("notes").insert(newNote));
  };

  const toggleComplete = (id) => {
    const note = state.notes.find((n) => n.id === id);
    if (!note) return undefined;
    dispatch({ type: "TOGGLE_NOTE", payload: id });
    return saveChange(
      supabase
        .from("notes")
        .update({ completed: !note.completed })
        .eq("id", id),
    );
  };

  const editNote = (id, text) => {
    dispatch({ type: "EDIT_NOTE", payload: { id, text } });
    return saveChange(supabase.from("notes").update({ text }).eq("id", id));
  };

  const deleteNote = (id) => {
    dispatch({ type: "DELETE_NOTE", payload: id });
    return saveChange(supabase.from("notes").delete().eq("id", id));
  };

  const clearAllNotes = () => {
    dispatch({ type: "CLEAR_NOTES" });
    return saveChange(supabase.from("notes").delete().eq("user_id", userId));
  };

  const toggleDarkMode = () => dispatch({ type: "TOGGLE_DARK_MODE" });

  const signIn = (email, password) =>
    supabase.auth.signInWithPassword({ email, password });
  const signUp = (email, password) => supabase.auth.signUp({ email, password });
  const signOut = () => supabase.auth.signOut();

  const notesSummary = (() => {
    const completed = state.notes.filter((n) => n.completed).length;
    const total = state.notes.length;
    return { total, completed, pending: total - completed };
  })();

  const contextValue = {
    notes: state.notes,
    isDarkMode: state.isDarkMode,
    notesSummary,
    session,
    syncError,
    signIn,
    signUp,
    signOut,
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
