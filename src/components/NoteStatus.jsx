import { useNotes } from "../context/NotesContext";
import Message from "./Message";

function filterNotes(notes, categoryFilter, search) {
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
  return filtered;
}

function NoteStatus({ categoryFilter, search }) {
  const notes = useNotes();
  const filtered = filterNotes(notes, categoryFilter, search);

  if (!notes.length)
    return (
      <Message>
        هنوز یادداشتی اضافه نشده.
      </Message>
    );

  if (!filtered.length) return null;

  const allNotes = filtered.length;
  const completedNotes = filtered.filter((n) => n.completed).length;
  const unCompletedNotes = allNotes - completedNotes;

  return (
    <ul className="note-status">
      <li>
        همه <span>{allNotes}</span>
      </li>
      <li>
        انجام‌شده <span>{completedNotes}</span>
      </li>
      <li>
        باز <span>{unCompletedNotes}</span>
      </li>
    </ul>
  );
}

export default NoteStatus;
