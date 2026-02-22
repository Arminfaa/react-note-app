import { useState } from "react";
import { FiTrash2, FiEdit2 } from "react-icons/fi";
import { useNotes, useNotesDispatch, useCategories } from "../context/NotesContext";
import Message from "./Message";

function formatDateFa(isoString) {
  try {
    return new Date(isoString).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return new Date(isoString).toLocaleDateString();
  }
}

function NoteList({ sortBy, search, categoryFilter }) {
  const notes = useNotes();
  const categories = useCategories();

  let filtered = notes;
  if (categoryFilter) {
    if (categoryFilter === "__no_category__") {
      filtered = filtered.filter((n) => !n.category || n.category === "");
    } else {
      filtered = filtered.filter((n) => (n.category || "") === categoryFilter);
    }
  }
  const q = (search || "").trim().toLowerCase();
  if (q) {
    filtered = filtered.filter(
      (n) =>
        (n.title || "").toLowerCase().includes(q) ||
        (n.description || "").toLowerCase().includes(q) ||
        (n.category || "").toLowerCase().includes(q)
    );
  }

  let sortedNotes = [...filtered];
  if (sortBy === "earliest")
    sortedNotes.sort(
      (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
    );
  if (sortBy === "latest")
    sortedNotes.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  if (sortBy === "completed")
    sortedNotes.sort(
      (a, b) => Number(a.completed) - Number(b.completed)
    );

  if (categoryFilter && sortedNotes.length === 0) {
    return (
      <Message>
        نوتی توی این دسته‌بندی نیست.
      </Message>
    );
  }

  return (
    <div className="note-list">
      {sortedNotes.map((note) => (
        <NoteItem key={note.id} note={note} formatDate={formatDateFa} categories={categories} />
      ))}
    </div>
  );
}

export default NoteList;

function NoteItem({ note, formatDate, categories }) {
  const dispatch = useNotesDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [removing, setRemoving] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const [editTitle, setEditTitle] = useState(note.title);
  const [editDesc, setEditDesc] = useState(note.description || "");
  const [editCategory, setEditCategory] = useState(note.category || "");

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editDesc.trim()) return;
    dispatch({
      type: "edit",
      payload: {
        id: note.id,
        title: editTitle.trim(),
        description: editDesc.trim(),
        category: editCategory.trim() || undefined,
      },
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    setRemoving(true);
    setTimeout(() => {
      dispatch({ type: "delete", payload: note.id });
      setShowDeleteConfirm(false);
    }, 250);
  };

  const openDeleteConfirm = () => setShowDeleteConfirm(true);
  const closeDeleteConfirm = () => setShowDeleteConfirm(false);

  if (isEditing) {
    return (
      <div className={`note-item ${removing ? "note-item--removing" : ""}`}>
        <form className="note-item__edit-form" onSubmit={handleSaveEdit}>
          <input
            type="text"
            className="text-field"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            placeholder="عنوان"
          />
          <textarea
            className="text-field"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            placeholder="متن"
            rows={3}
          />
          <select
            className="select"
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value)}
            aria-label="دسته‌بندی"
          >
            <option value="">بدون دسته‌بندی</option>
            {(categories || []).map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
          <div className="actions-row">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setIsEditing(false);
                setEditTitle(note.title);
                setEditDesc(note.description || "");
                setEditCategory(note.category || "");
              }}
            >
              انصراف
            </button>
            <button type="submit" className="btn btn--primary">
              ذخیره تغییرات
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <>
      <div className={`note-item ${note.completed ? "completed" : ""} ${removing ? "note-item--removing" : ""}`}>
        <div className="note-item__header">
          <div className="content">
            <p className="title">{note.title}</p>
            <p className="desc">{note.description}</p>
            {note.category && (
              <span className="note-item__tag">{note.category}</span>
            )}
          </div>
          <div className="actions">
            <button
              type="button"
              className="btn-delete"
              onClick={openDeleteConfirm}
              aria-label="حذف"
              title="حذف"
            >
              <FiTrash2 size={18} />
            </button>
            <button
              type="button"
              className="btn-edit"
              onClick={() => setIsEditing(true)}
              aria-label="ویرایش"
              title="ویرایش"
            >
              <FiEdit2 size={18} />
            </button>
            <input
              type="checkbox"
              name={note.id}
              id={note.id}
              value={note.id}
              checked={note.completed}
              onChange={() => dispatch({ type: "complete", payload: note.id })}
              aria-label="تکمیل"
            />
          </div>
        </div>
        <p className="note-item__footer">
          {formatDate(note.updatedAt || note.createdAt)}
        </p>
      </div>

      {showDeleteConfirm && (
        <div
          className="delete-confirm-overlay"
          onClick={(e) => e.target === e.currentTarget && closeDeleteConfirm()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-title"
        >
          <div className="delete-confirm-box">
            <p id="delete-title">این یادداشت حذف شود؟</p>
            <div className="buttons">
              <button
                type="button"
                className="btn btn--ghost"
                onClick={closeDeleteConfirm}
              >
                انصراف
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={handleDelete}
              >
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
