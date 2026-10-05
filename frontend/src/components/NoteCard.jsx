import { EditIcon, TrashIcon } from "./Icons.jsx";

const styles = `
.note-card { min-height: 255px; display: flex; flex-direction: column; padding: 20px; border: 1px solid #2b2a26; border-radius: 12px; background: #181816; transition: 180ms ease; }
.note-card:hover { transform: translateY(-2px); border-color: rgba(197,100,47,.55); }
.note-card-top { display: flex; align-items: center; justify-content: space-between; min-height: 32px; }
.note-date { color: #68655e; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.note-actions { display: flex; gap: 6px; opacity: 0; transition: opacity 150ms ease; }
.note-card:hover .note-actions { opacity: 1; }
.note-actions button { width: 31px; height: 31px; display: grid; place-items: center; border: 1px solid #2b2a26; border-radius: 7px; background: #1e1e1b; color: #858278; }
.note-actions button:hover { border-color: #c5642f; color: #c5642f; }
.note-actions svg { width: 14px; height: 14px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.note-open { flex: 1; width: 100%; padding: 23px 0 10px; border: 0; background: transparent; color: inherit; text-align: left; }
.note-open h3 { margin: 0 0 12px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-family: "Instrument Serif", serif; font-size: 28px; font-weight: 400; }
.note-open p { display: -webkit-box; overflow: hidden; -webkit-box-orient: vertical; -webkit-line-clamp: 5; margin: 0; color: #8a877e; font-size: 12px; line-height: 1.7; white-space: pre-wrap; }
.note-footer { padding-top: 15px; border-top: 1px solid #24231f; color: #5f5c55; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
@media (max-width: 760px) { .note-actions { opacity: 1; } }
`;

export default function NoteCard({ note, onOpen, onEdit, onDelete, formatDate }) {
  return (
    <>
      <style>{styles}</style>
      <article className="note-card">
        <div className="note-card-top">
          <span className="note-date">{formatDate(note.updatedAt || note.createdAt)}</span>
          <div className="note-actions">
            <button onClick={() => onEdit(note)} aria-label="Edit note"><EditIcon /></button>
            <button onClick={() => onDelete(note)} aria-label="Delete note"><TrashIcon /></button>
          </div>
        </div>
        <button className="note-open" onClick={() => onOpen(note)}>
          <h3>{note.title}</h3>
          <p>{note.content || "There is no additional content in this note."}</p>
        </button>
        <div className="note-footer">Private note</div>
      </article>
    </>
  );
}
