import { CloseIcon, EditIcon } from "./Icons.jsx";

const styles = `
.view-backdrop { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; padding: 20px; background: rgba(5,5,4,.76); backdrop-filter: blur(8px); }
.note-view { width: min(760px, 100%); max-height: 84vh; overflow: auto; border: 1px solid #2b2a26; border-radius: 15px; background: #171715; box-shadow: 0 35px 90px rgba(0,0,0,.44); }
.note-view-top { min-height: 62px; display: flex; align-items: center; justify-content: space-between; gap: 15px; padding: 0 22px; border-bottom: 1px solid #2b2a26; }
.note-view-date { color: #68655e; font-size: 9px; font-weight: 700; letter-spacing: .08em; text-transform: uppercase; }
.note-view-actions { display: flex; gap: 7px; }
.note-view-actions button { width: 34px; height: 34px; display: grid; place-items: center; border: 1px solid #2b2a26; border-radius: 8px; background: transparent; color: #858278; }
.note-view-actions svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.note-view-body { padding: 38px 40px 46px; }
.note-view-body h2 { margin: 0 0 23px; font-family: "Instrument Serif", serif; font-size: clamp(36px, 5vw, 52px); font-weight: 400; line-height: 1; overflow-wrap: anywhere; }
.note-view-body p { margin: 0; color: #8a877e; font-size: 14px; line-height: 1.85; white-space: pre-wrap; overflow-wrap: anywhere; }
@media (max-width: 650px) { .view-backdrop { align-items: end; padding: 0; } .note-view { width: 100%; max-height: 91vh; border-radius: 18px 18px 0 0; } .note-view-body { padding: 31px 21px 42px; } }
`;

export default function NoteViewModal({ note, onClose, onEdit, formatDate }) {
  return (
    <>
      <style>{styles}</style>
      <div className="view-backdrop" onMouseDown={onClose}>
        <article className="note-view" onMouseDown={(event) => event.stopPropagation()}>
          <div className="note-view-top">
            <span className="note-view-date">{formatDate(note.updatedAt || note.createdAt)}</span>
            <div className="note-view-actions"><button onClick={onEdit} aria-label="Edit"><EditIcon /></button><button onClick={onClose} aria-label="Close"><CloseIcon /></button></div>
          </div>
          <div className="note-view-body"><h2>{note.title}</h2><p>{note.content || "There is no additional content in this note."}</p></div>
        </article>
      </div>
    </>
  );
}
