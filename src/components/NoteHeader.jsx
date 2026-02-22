import { useState, useRef, useEffect } from "react";
import { FiSun, FiMoon, FiSliders } from "react-icons/fi";
import { useNotes, useCategories } from "../context/NotesContext";

function NoteHeader({ sortBy, onSort, search, onSearch, categoryFilter, onCategoryFilter, theme, onToggleTheme }) {
  const notes = useNotes();
  const categories = useCategories();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (settingsRef.current && !settingsRef.current.contains(e.target)) {
        setSettingsOpen(false);
      }
    }
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  return (
    <header className="note-header">
      <h1 className="note-header__title">یادداشت‌های من ({notes.length})</h1>

      {/* از lg به بالا: همهٔ کنترل‌ها در گرید */}
      <div className="note-header__controls note-header__controls--desktop">
        <input
          type="text"
          className="note-header__search"
          placeholder="جستجو در عنوان و متن..."
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          aria-label="جستجو"
        />
        <select
          value={categoryFilter}
          onChange={(e) => onCategoryFilter(e.target.value)}
          aria-label="فیلتر دسته‌بندی"
          className="note-header__filter"
        >
          <option value="">همه دسته‌ها</option>
          {notes.some((n) => !n.category || n.category === "") && (
            <option value="__no_category__">بدون دسته‌بندی</option>
          )}
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <select value={sortBy} onChange={onSort} aria-label="مرتب‌سازی">
          <option value="latest">جدیدترین</option>
          <option value="earliest">قدیمی‌ترین</option>
          <option value="completed">تکمیل‌شده‌ها اول</option>
        </select>
        <button
          type="button"
          className="theme-toggle"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
        >
          {theme === "dark" ? <><FiSun size={18} /> روشن</> : <><FiMoon size={18} /> تاریک</>}
        </button>
      </div>

      {/* زیر lg: تم (فقط آیکون) + منوی تنظیمات (جستجو، فیلتر، سورت) */}
      <div className="note-header__controls note-header__controls--mobile" ref={settingsRef}>
        <button
          type="button"
          className="theme-toggle theme-toggle--icon-only"
          onClick={onToggleTheme}
          aria-label={theme === "dark" ? "حالت روشن" : "حالت تاریک"}
        >
          {theme === "dark" ? <FiSun size={20} /> : <FiMoon size={20} />}
        </button>
        <div className="note-header__settings-wrap">
          <button
            type="button"
            className="note-header__settings-trigger"
            onClick={() => setSettingsOpen((o) => !o)}
            aria-label="تنظیمات"
            aria-expanded={settingsOpen}
          >
            <FiSliders size={20} />
          </button>
          {settingsOpen && (
            <div className="note-header__settings-dropdown">
              <input
                type="text"
                className="note-header__search"
                placeholder="جستجو..."
                value={search}
                onChange={(e) => onSearch(e.target.value)}
                aria-label="جستجو"
              />
              <select
                value={categoryFilter}
                onChange={(e) => onCategoryFilter(e.target.value)}
                aria-label="فیلتر دسته‌بندی"
                className="note-header__filter"
              >
                <option value="">همه دسته‌ها</option>
                {notes.some((n) => !n.category || n.category === "") && (
                  <option value="__no_category__">بدون دسته‌بندی</option>
                )}
                {categories.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
              <select value={sortBy} onChange={onSort} aria-label="مرتب‌سازی">
                <option value="latest">جدیدترین</option>
                <option value="earliest">قدیمی‌ترین</option>
                <option value="completed">تکمیل‌شده‌ها اول</option>
              </select>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NoteHeader;
