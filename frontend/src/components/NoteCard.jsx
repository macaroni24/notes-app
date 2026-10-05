import { EditIcon, TrashIcon } from "./Icons.jsx";

const styles = `
.note-card {
  display: flex;
  flex-direction: column;
  min-height: 220px;
  padding: 18px;
  border: 1px solid #333;
  border-radius: 10px;
  background: #242424;
}

.note-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.note-date {
  color: #777;
  font-size: 12px;
}

.note-actions {
  display: flex;
  gap: 6px;
}

.note-actions button {
  width: 32px;
  height: 32px;
  display: grid;
  place-items: center;
  border: 1px solid #3a3a3a;
  border-radius: 6px;
  background: #2b2b2b;
  color: #aaa;
}

.note-actions button:hover {
  color: #d56b2d;
  border-color: #d56b2d;
}

.note-actions svg {
  width: 14px;
  height: 14px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.note-open {
  flex: 1;
  width: 100%;
  padding: 22px 0 0;
  border: 0;
  background: transparent;
  color: inherit;
  text-align: left;
}

.note-open h3 {
  margin: 0 0 10px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 22px;
}

.note-open p {
  margin: 0;
  overflow: hidden;
  color: #aaa;
  font-size: 13px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 5;
}
`;

export default function NoteCard({
  note,
  onOpen,
  onEdit,
  onDelete,
  formatDate,
}) {
  return (
    <>
      <style>{styles}</style>

      <article className="note-card">
        <div className="note-card-top">
          <span className="note-date">
            {formatDate(note.updatedAt || note.createdAt)}
          </span>

          <div className="note-actions">
            <button onClick={() => onEdit(note)} aria-label="Edit note">
              <EditIcon />
            </button>

            <button onClick={() => onDelete(note)} aria-label="Delete note">
              <TrashIcon />
            </button>
          </div>
        </div>

        <button className="note-open" onClick={() => onOpen(note)}>
          <h3>{note.title}</h3>
          <p>{note.content || "No content"}</p>
        </button>
      </article>
    </>
  );
}