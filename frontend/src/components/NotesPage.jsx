import { useEffect, useMemo, useState } from "react";
import {
  createNote,
  deleteNote,
  getNotes,
  logoutUser,
  updateNote,
} from "../services/api.js";
import Navbar from "./Navbar.jsx";
import NoteCard from "./NoteCard.jsx";
import NoteEditorModal from "./NoteEditorModal.jsx";
import NoteViewModal from "./NoteViewModal.jsx";
import { PlusIcon } from "./Icons.jsx";

const styles = `
.notes-app {
  min-height: 100vh;
  background: #1b1b1b;
}

.notes-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px 70px;
}

.notes-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.notes-heading h1 {
  margin: 0;
  font-size: 28px;
}

.notes-count {
  color: #888;
  font-size: 13px;
}

.notes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.create-card {
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px dashed #444;
  border-radius: 10px;
  background: transparent;
  color: #aaa;
}

.create-card:hover {
  border-color: #d56b2d;
  color: #d56b2d;
}

.create-card svg {
  width: 18px;
  height: 18px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
}

.notes-empty,
.notes-error {
  padding: 30px;
  border: 1px solid #333;
  border-radius: 10px;
  background: #242424;
}

.notes-empty {
  text-align: center;
  color: #aaa;
}

.notes-empty h2 {
  margin: 0 0 8px;
  color: #fff;
  font-size: 22px;
}

.notes-empty p {
  margin: 0;
  font-size: 13px;
}

.notes-error {
  margin-bottom: 16px;
  color: #ff9f9f;
}

.notes-loading {
  color: #aaa;
  text-align: center;
  padding: 40px;
}

@media (max-width: 900px) {
  .notes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .notes-grid {
    grid-template-columns: 1fr;
  }

  .notes-content {
    padding: 28px 14px 60px;
  }

  .notes-heading h1 {
    font-size: 24px;
  }
}
`;

function formatDate(value) {
  if (!value) {
    return "";
  }

  return new Intl.DateTimeFormat("en", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
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
    try {
      setLoading(true);
      setError("");

      const data = await getNotes();
      setNotes(data);
    } catch (error) {
      if (error.status === 401) {
        onSignedOut();
        return;
      }

      setError(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(payload) {
    const savedNote = editorNote
      ? await updateNote(editorNote.id, payload)
      : await createNote(payload);

    setNotes((current) => {
      if (editorNote) {
        return current.map((note) =>
          note.id === savedNote.id ? savedNote : note
        );
      }

      return [savedNote, ...current];
    });

    if (viewerNote?.id === savedNote.id) {
      setViewerNote(savedNote);
    }

    setEditorNote(undefined);
  }

  async function handleDelete(note) {
    const confirmed = window.confirm(`Delete "${note.title}"?`);

    if (!confirmed) {
      return;
    }

    try {
      await deleteNote(note.id);

      setNotes((current) =>
        current.filter((item) => item.id !== note.id)
      );

      if (viewerNote?.id === note.id) {
        setViewerNote(null);
      }
    } catch (error) {
      setError(error.message);
    }
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } finally {
      onSignedOut();
    }
  }

  const filteredNotes = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return notes;
    }

    return notes.filter((note) =>
      `${note.title} ${note.content}`
        .toLowerCase()
        .includes(value)
    );
  }, [notes, search]);

  return (
    <>
      <style>{styles}</style>

      <div className="notes-app">
        <Navbar
          search={search}
          onSearch={setSearch}
          onNew={() => setEditorNote(null)}
          onLogout={handleLogout}
          user={user}
        />

        <main className="notes-content">
          <div className="notes-heading">
            <h1>{search ? "Search results" : "Notes"}</h1>

            <span className="notes-count">
              {filteredNotes.length}{" "}
              {filteredNotes.length === 1 ? "note" : "notes"}
            </span>
          </div>

          {error && <div className="notes-error">{error}</div>}

          {loading ? (
            <div className="notes-loading">Loading notes...</div>
          ) : filteredNotes.length > 0 ? (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onOpen={setViewerNote}
                  onEdit={setEditorNote}
                  onDelete={handleDelete}
                  formatDate={formatDate}
                />
              ))}

              {!search && (
                <button
                  className="create-card"
                  onClick={() => setEditorNote(null)}
                >
                  <PlusIcon />
                  <span>New note</span>
                </button>
              )}
            </div>
          ) : (
            <div className="notes-empty">
              <h2>{search ? "No notes found" : "No notes yet"}</h2>
              <p>
                {search
                  ? "Try another search."
                  : "Create your first note."}
              </p>
            </div>
          )}
        </main>

        {editorNote !== undefined && (
          <NoteEditorModal
            note={editorNote}
            onClose={() => setEditorNote(undefined)}
            onSave={handleSave}
          />
        )}

        {viewerNote && (
          <NoteViewModal
            note={viewerNote}
            onClose={() => setViewerNote(null)}
            onEdit={() => setEditorNote(viewerNote)}
            formatDate={formatDate}
          />
        )}
      </div>
    </>
  );
}