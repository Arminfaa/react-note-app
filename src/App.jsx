import { useState, useEffect } from "react";
import "./App.css";
import AddNewNote from "./components/AddNewNote";
import CategoriesManager from "./components/CategoriesManager";
import Modal from "./components/Modal";
import NoteList from "./components/NoteList";
import NoteStatus from "./components/NoteStatus";
import NoteHeader from "./components/NoteHeader";
import { NotesProvider } from "./context/NotesContext";
import { FiPlus, FiFolder } from "react-icons/fi";

const THEME_KEY = "react-note-app-theme";

function App() {
  const [sortBy, setSortBy] = useState("latest");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem(THEME_KEY) || "light";
    } catch {
      return "light";
    }
  });
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [addNoteModalOpen, setAddNoteModalOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme === "dark" ? "dark" : "");
    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (_) {}
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "dark" ? "light" : "dark"));

  return (
    <NotesProvider>
      <div className="container">
        <NoteHeader
          sortBy={sortBy}
          onSort={(e) => setSortBy(e.target.value)}
          search={search}
          onSearch={setSearch}
          categoryFilter={categoryFilter}
          onCategoryFilter={setCategoryFilter}
          theme={theme}
          onToggleTheme={toggleTheme}
        />
        <div className="note-app">
          <div className="note-sidebar">
            {/* زیر lg: دکمه‌ها برای باز کردن مودال */}
            <div className="note-sidebar__mobile-actions">
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setCategoriesModalOpen(true)}
              >
                <FiFolder size={18} />
                دسته‌بندی‌ها
              </button>
              <button
                type="button"
                className="btn btn--primary"
                onClick={() => setAddNoteModalOpen(true)}
              >
                <FiPlus size={18} />
                افزودن یادداشت جدید
              </button>
            </div>
            {/* از lg: محتوا مثل قبل */}
            <div className="note-sidebar__desktop">
              <CategoriesManager />
              <AddNewNote />
            </div>
          </div>
          <div className="note-container">
            <NoteStatus categoryFilter={categoryFilter} search={search} />
            <NoteList sortBy={sortBy} search={search} categoryFilter={categoryFilter} />
          </div>
        </div>
      </div>

      {/* مودال‌ها فقط زیر lg استفاده می‌شن (با کلیک روی دکمه باز می‌شن) */}
      <Modal
        open={categoriesModalOpen}
        onClose={() => setCategoriesModalOpen(false)}
        title="دسته‌بندی‌ها"
      >
        <CategoriesManager />
      </Modal>
      <Modal
        open={addNoteModalOpen}
        onClose={() => setAddNoteModalOpen(false)}
        title="افزودن یادداشت جدید"
      >
        <AddNewNote onAfterSubmit={() => setAddNoteModalOpen(false)} />
      </Modal>
    </NotesProvider>
  );
}

export default App;
