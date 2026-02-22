import { useEffect } from "react";
import { FiX } from "react-icons/fi";

function Modal({ open, onClose, title, children }) {
  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? "modal-title" : undefined}
    >
      <div className="modal-box">
        <div className="modal-box__header">
          {title && <h2 id="modal-title" className="modal-box__title">{title}</h2>}
          <button
            type="button"
            className="modal-box__close"
            onClick={onClose}
            aria-label="بستن"
          >
            <FiX size={22} />
          </button>
        </div>
        <div className="modal-box__body">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
