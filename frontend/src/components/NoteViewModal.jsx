import { CloseIcon, EditIcon } from "./Icons.jsx";

const styles = `
.view-backdrop {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
}

.note-view {
  width: 100%;
  max-width: 650px;
  max-height: 80vh;
  overflow-y: auto;
  border: 1px solid #333;
  border-radius: 12px;
  background: #242424;
}

.note-view-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #333;
}

.note-view-date {
  color: #888;
  font-size: 12px;
}

.note-view-actions {
  display: flex;
  gap: 8px;
}

.note-view-actions button {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #3a3a3a;
  border-radius: 7px;
  background: #2b2b2b;
  color: #aaa;
}

.note-view-actions button:hover {
  color: #d56b2d;
  border-color: #d56b2d;
}

.note-view-actions svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.note-view-body {
  padding: 24px 20px 30px;
}

.note-view-body h2 {
  margin: 0 0 16px;
  font-size: 28px;
  overflow-wrap: anywhere;
}

.note-view-body p {
  margin: 0;
  color: #aaa;
  font-size: 14px;
  line-height: 1.6;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}

@media (max-width: 600px) {
  .view-backdrop {
    padding: 12px;
  }

  .note-view {
    max-height: 90vh;
  }

  .note-view-body h2 {
    font-size: 24px;
  }
}
`;

export default function NoteViewModal({
  note,
  onClose,
  onEdit,
  formatDate,
}) {
  return (
    <>
      <style>{styles}</style>

      <div className="view-backdrop" onMouseDown={onClose}>
        <article
          className="note-view"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="note-view-top">
            <span className="note-view-date">
              {formatDate(note.updatedAt || note.createdAt)}
            </span>

            <div className="note-view-actions">
              <button onClick={onEdit} aria-label="Edit">
                <EditIcon />
              </button>

              <button onClick={onClose} aria-label="Close">
                <CloseIcon />
              </button>
            </div>
          </div>

          <div className="note-view-body">
            <h2>{note.title}</h2>
            <p>{note.content || "No content"}</p>
          </div>
        </article>
      </div>
    </>
  );
}