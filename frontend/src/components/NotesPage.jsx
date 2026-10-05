import { useEffect, useMemo, useState } from "react";
import { createNote, deleteNote, getNotes, logoutUser, updateNote } from "../services/api.js";
import Navbar from "./Navbar.jsx";
import NoteCard from "./NoteCard.jsx";
import NoteEditorModal from "./NoteEditorModal.jsx";
import NoteViewModal from "./NoteViewModal.jsx";
import { PlusIcon } from "./Icons.jsx";

const styles = `
.notes-app { min-height: 100vh; background: radial-gradient(circle at 10% -10%, rgba(197,100,47,.08), transparent 26%), #11110f; }
.notes-content { width: min(1320px, calc(100% - 44px)); margin: 0 auto; padding: 58px 0 90px; }
.notes-heading { display: flex; align-items: end; justify-content: space-between; gap: 20px; margin-bottom: 27px; }
.notes-kicker { color: #c5642f; font-size: 10px; font-weight: 800; letter-spacing: .18em; }
.notes-heading h1 { margin: 8px 0 0; font-family: "Instrument Serif", serif; font-size: 42px; font-weight: 400; }
.notes-count { color: #6e6b63; font-size: 11px; }
.notes-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 15px; }
.create-card { min-height: 255px; display: flex; flex-direction: column; align-items: center; justify-content: center; border: 1px dashed #3a3933; border-radius: 12px; background: transparent; color: #77746b; transition: 180ms ease; }
.create-card:hover { border-color: #c5642f; background: rgba(197,100,47,.08); color: #c5642f; }
.create-card-icon { width: 44px; height: 44px; display: grid; place-items: center; margin-bottom: 14px; border: 1px solid currentColor; border-radius: 50%; }
.create-card svg { width: 18px; height: 18px; fill: none; stroke: currentColor; stroke-width: 1.8; }
.create-card span { color: #f3f0ea; font-size: 12px; font-weight: 800; }
.notes-empty, .notes-error { min-height: 310px; display: grid; place-items: center; padding: 35px; border: 1px solid #2b2a26; border-radius: 13px; background: #181816; text-align: center; }
.notes-empty h2 { margin: 0 0 8px; font-family: "Instrument Serif", serif; font-size: 34px; font-weight: 400; }
.notes-empty p { margin: 0; color: #858278; font-size: 12px; }
.notes-error { min-height: auto; color: #df8553; font-size: 12px; }
.notes-skeleton { min-height: 255px; border: 1px solid #2b2a26; border-radius: 12px; background: linear-gradient(90deg, #181816, #1d1d1a, #181816); background-size: 200% 100%; animation: shimmer 1.4s infinite; }
@keyframes shimmer { to { background-position: -200% 0; } }
@media (max-width: 980px) { .notes-grid { grid-template-columns: repeat(2, minmax(0,1fr)); } }
@media (max-width: 650px) { .notes-content { width: calc(100% - 28px); padding-top: 38px; } .notes-grid { grid-template-columns: 1fr; } .notes-heading h1 { font-size: 35px; } }
`;

function formatDate(value) {
  if (!value) return "Recently";
  return new Intl.DateTimeFormat("en", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value));
}

export default function NotesPage({ user, onSignedOut }) {
  const [notes, setNotes] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editorNote, setEditorNote] = useState(undefined);
  const [viewerNote, setViewerNote] = useState(null);

  useEffect(() => {
    loadNotes();
  }, []);

  async function loadNotes() {
    setLoading(true);
    setError("");
    try {
      setNotes(await getNotes());
    } catch (err) {
      if (err.status === 401) {
        onSignedOut();
        return;
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload) {
    const saved = editorNote ? await updateNote(editorNote.id, payload) : await createNote(payload);
    setNotes((current) => {
      const next = editorNote ? current.map((note) => note.id === saved.id ? saved : note) : [saved, ...current];
      return next.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    });
    if (viewerNote?.id === saved.id) setViewerNote(saved);
    setEditorNote(undefined);
  }

  async function handleDelete(note) {
    if (!window.confirm(`Delete "${note.title}"?`)) return;
    try {
      await deleteNote(note.id);
      setNotes((current) => current.filter((item) => item.id !== note.id));
      if (viewerNote?.id === note.id) setViewerNote(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      onSignedOut();
    }
  }

  const filtered = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return notes;
    return notes.filter((note) => `${note.title} ${note.content}`.toLowerCase().includes(value));
  }, [notes, search]);

  return (
    <>
      <style>{styles}</style>
      <div className="notes-app">
        <Navbar search={search} onSearch={setSearch} onNew={() => setEditorNote(null)} onLogout={handleLogout} user={user} />
        <main className="notes-content">
          <div className="notes-heading"><div><span className="notes-kicker">{search ? "SEARCH RESULTS" : "YOUR PRIVATE NOTES"}</span><h1>{search ? "Matching notes" : "Recent notes"}</h1></div><span className="notes-count">{filtered.length} {filtered.length === 1 ? "note" : "notes"}</span></div>
          {error && <div className="notes-error" role="alert">{error}</div>}
          {loading ? (
            <div className="notes-grid"><div className="notes-skeleton" /><div className="notes-skeleton" /><div className="notes-skeleton" /></div>
          ) : filtered.length ? (
            <div className="notes-grid">
              {filtered.map((note) => <NoteCard key={note.id} note={note} onOpen={setViewerNote} onEdit={setEditorNote} onDelete={handleDelete} formatDate={formatDate} />)}
              {!search && <button className="create-card" onClick={() => setEditorNote(null)}><div className="create-card-icon"><PlusIcon /></div><span>Create a new note</span></button>}
            </div>
          ) : (
            <div className="notes-empty"><div><h2>{search ? "No notes found" : "Your first note starts here"}</h2><p>{search ? "Try another search term." : "Create a note and it will only be visible in your account."}</p></div></div>
          )}
        </main>
        {editorNote !== undefined && <NoteEditorModal note={editorNote} onClose={() => setEditorNote(undefined)} onSave={handleSave} />}
        {viewerNote && <NoteViewModal note={viewerNote} onClose={() => setViewerNote(null)} onEdit={() => setEditorNote(viewerNote)} formatDate={formatDate} />}
      </div>
    </>
  );
}
