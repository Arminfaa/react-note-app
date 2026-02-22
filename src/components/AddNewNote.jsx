import { useState } from "react";
import { useNotesDispatch, useCategories } from "../context/NotesContext";

function AddNewNote({ onAfterSubmit }) {
  const dispatch = useNotesDispatch();
  const categories = useCategories();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    const newNote = {
      title: title.trim(),
      description: description.trim(),
      category: category || undefined,
      id: Date.now(),
      completed: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    dispatch({ type: "add", payload: newNote });
    setTitle("");
    setDescription("");
    setCategory("");
    onAfterSubmit?.();
  };

  return (
    <div className="add-new-note">
      <h2>افزودن یادداشت جدید</h2>
      <form className="note-form" onSubmit={handleSubmit}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          type="text"
          className="text-field"
          placeholder="عنوان یادداشت"
          aria-label="عنوان"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-field"
          placeholder="متن یادداشت"
          rows={4}
          aria-label="متن"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="select"
          aria-label="دسته‌بندی"
        >
          <option value="">بدون دسته‌بندی</option>
          {categories.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        <button type="submit" className="btn btn--primary">
          افزودن یادداشت
        </button>
      </form>
    </div>
  );
}

export default AddNewNote;
