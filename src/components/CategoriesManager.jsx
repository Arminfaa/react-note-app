import { useState } from "react";
import { FiX } from "react-icons/fi";
import { useCategories, useCategoriesDispatch } from "../context/NotesContext";

function CategoriesManager() {
  const categories = useCategories();
  const dispatch = useCategoriesDispatch();
  const [newName, setNewName] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (!name) return;
    dispatch({ type: "add", payload: name });
    setNewName("");
  };

  return (
    <div className="categories-manager">
      <h2>دسته‌بندی‌ها</h2>
      <form className="categories-manager__form" onSubmit={handleAdd}>
        <input
          type="text"
          className="text-field"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="نام دسته جدید"
          aria-label="نام دسته‌بندی"
        />
        <button type="submit" className="btn btn--primary" disabled={!newName.trim()}>
          افزودن دسته
        </button>
      </form>
      <ul className="categories-manager__list">
        {categories.length === 0 ? (
          <li className="categories-manager__empty">هنوز دسته‌ای ساخته نشده.</li>
        ) : (
          categories.map((name) => (
            <li key={name} className="categories-manager__item">
              <span className="categories-manager__label">{name}</span>
              <button
                type="button"
                className="categories-manager__remove"
                onClick={() => dispatch({ type: "remove", payload: name })}
                aria-label={`حذف دسته ${name}`}
                title="حذف دسته"
              >
                <FiX size={18} />
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

export default CategoriesManager;
