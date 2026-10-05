import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons.jsx";

const styles = `
.modal-backdrop { position: fixed; inset: 0; z-index: 100; display: grid; place-items: center; padding: 20px; background: rgba(5,5,4,.78); backdrop-filter: blur(8px); }
.editor-modal { width: min(680px, 100%); overflow: hidden; border: 1px solid #2b2a26; border-radius: 15px; background: #171715; box-shadow: 0 35px 90px rgba(0,0,0,.45); }
.editor-top { display: flex; justify-content: space-between; gap: 20px; padding: 24px 26px 20px; border-bottom: 1px solid #2b2a26; }
.editor-kicker { color: #c5642f; font-size: 10px; font-weight: 800; letter-spacing: .18em; }
.editor-top h2 { margin: 7px 0 0; font-family: "Instrument Serif", serif; font-size: 31px; font-weight: 400; }
.editor-close { width: 35px; height: 35px; display: grid; place-items: center; border: 1px solid #2b2a26; border-radius: 8px; background: transparent; color: #858278; }
.editor-close svg { width: 15px; height: 15px; fill: none; stroke: currentColor; stroke-width: 1.6; }
.editor-form { padding: 25px 26px 24px; }
.editor-field { display: grid; gap: 8px; margin-bottom: 19px; }
.editor-field label { color: #858278; font-size: 10px; font-weight: 800; letter-spacing: .08em; text-transform: uppercase; }
.editor-field input, .editor-field textarea { width: 100%; border: 1px solid #2b2a26; border-radius: 9px; outline: 0; background: #181816; color: #f3f0ea; }
.editor-field input { height: 49px; padding: 0 14px; font-family: "Instrument Serif", serif; font-size: 22px; }
.editor-field textarea { min-height: 220px; padding: 14px; resize: vertical; font-size: 13px; line-height: 1.7; }
.editor-field input:focus, .editor-field textarea:focus { border-color: #c5642f; }
.editor-error { margin-bottom: 16px; color: #df8553; font-size: 11px; }
.editor-footer { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
.editor-counter { color: #68655e; font-size: 10px; }
.editor-actions { display: flex; gap: 8px; }
.editor-cancel, .editor-save { height: 40px; padding: 0 16px; border-radius: 8px; font-size: 11px; font-weight: 800; }
.editor-cancel { border: 1px solid #2b2a26; background: transparent; color: #858278; }
.editor-save { border: 1px solid #c5642f; background: #c5642f; color: #17120f; }
.editor-save:disabled { opacity: .5; cursor: not-allowed; }
@media (max-width: 650px) { .modal-backdrop { align-items: end; padding: 0; } .editor-modal { border-radius: 18px 18px 0 0; } .editor-top, .editor-form { padding-left: 20px; padding-right: 20px; } }
`;

export default function NoteEditorModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({ title: "", content: "" });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({ title: note?.title || "", content: note?.content || "" });
    setError("");
  }, [note]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!form.title.trim()) return;
    setSaving(true);
    setError("");

    try {
      await onSave({ title: form.title.trim(), content: form.content.trim() });
    } catch (err) {
      const validation = err.errors ? Object.values(err.errors).flat()[0] : null;
      setError(validation || err.message);
      setSaving(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="modal-backdrop" onMouseDown={onClose}>
        <section className="editor-modal" onMouseDown={(event) => event.stopPropagation()}>
          <div className="editor-top">
            <div><span className="editor-kicker">{note ? "EDIT NOTE" : "NEW NOTE"}</span><h2>{note ? "Refine your note" : "Capture a thought"}</h2></div>
            <button className="editor-close" onClick={onClose} aria-label="Close"><CloseIcon /></button>
          </div>
          <form className="editor-form" onSubmit={handleSubmit}>
            <div className="editor-field"><label htmlFor="note-title">Title</label><input id="note-title" autoFocus value={form.title} onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))} maxLength="100" required /></div>
            <div className="editor-field"><label htmlFor="note-content">Note</label><textarea id="note-content" value={form.content} onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))} maxLength="3000" /></div>
            {error && <div className="editor-error" role="alert">{error}</div>}
            <div className="editor-footer"><span className="editor-counter">{form.content.length} / 3000</span><div className="editor-actions"><button className="editor-cancel" type="button" onClick={onClose}>Cancel</button><button className="editor-save" disabled={saving || !form.title.trim()}>{saving ? "Saving..." : "Save note"}</button></div></div>
          </form>
        </section>
      </div>
    </>
  );
}
