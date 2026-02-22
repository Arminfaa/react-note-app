import { createContext, useContext, useReducer, useEffect } from "react";

const STORAGE_KEY_NOTES = "react-note-app-notes";
const STORAGE_KEY_CATEGORIES = "react-note-app-categories";

const NotesContext = createContext(null);
const NotesDispatchContext = createContext(null);
const CategoriesContext = createContext(null);
const CategoriesDispatchContext = createContext(null);

function getInitialNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_NOTES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getInitialCategories() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CATEGORIES);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function notesReducer(notes, action) {
  switch (action.type) {
    case "add": {
      return [...notes, action.payload];
    }
    case "edit": {
      return notes.map((note) =>
        note.id === action.payload.id
          ? {
              ...note,
              ...action.payload,
              updatedAt: new Date().toISOString(),
            }
          : note
      );
    }
    case "delete": {
      return notes.filter((s) => s.id !== action.payload);
    }
    case "complete": {
      return notes.map((note) =>
        note.id === action.payload
          ? {
              ...note,
              completed: !note.completed,
              updatedAt: new Date().toISOString(),
            }
          : note
      );
    }
    case "set": {
      return action.payload;
    }
    default:
      throw new Error("unknown action " + action.type);
  }
}

function categoriesReducer(categories, action) {
  switch (action.type) {
    case "add": {
      const name = (action.payload || "").trim();
      if (!name || categories.includes(name)) return categories;
      return [...categories, name].sort((a, b) => a.localeCompare(b, "fa"));
    }
    case "remove": {
      return categories.filter((c) => c !== action.payload);
    }
    default:
      throw new Error("unknown action " + action.type);
  }
}

export function NotesProvider({ children }) {
  const [notes, dispatchNotes] = useReducer(notesReducer, [], () => getInitialNotes());
  const [categories, dispatchCategories] = useReducer(
    categoriesReducer,
    [],
    () => getInitialCategories()
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn("Could not save notes to localStorage", e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_CATEGORIES, JSON.stringify(categories));
    } catch (e) {
      console.warn("Could not save categories to localStorage", e);
    }
  }, [categories]);

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatchNotes}>
        <CategoriesContext.Provider value={categories}>
          <CategoriesDispatchContext.Provider value={dispatchCategories}>
            {children}
          </CategoriesDispatchContext.Provider>
        </CategoriesContext.Provider>
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}

export function useCategories() {
  return useContext(CategoriesContext);
}

export function useCategoriesDispatch() {
  return useContext(CategoriesDispatchContext);
}
