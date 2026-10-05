import { useEffect, useState } from "react";
import { CloseIcon } from "./Icons.jsx";

const styles = `
.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: grid;
  place-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.7);
}

.editor-modal {
  width: 100%;
  max-width: 620px;
  border: 1px solid #333;
  border-radius: 12px;
  background: #242424;
}

.editor-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  border-bottom: 1px solid #333;
}

.editor-top h2 {
  margin: 0;
  font-size: 22px;
}

.editor-close {
  width: 34px;
  height: 34px;
  display: grid;
  place-items: center;
  border: 1px solid #3a3a3a;
  border-radius: 7px;
  background: #2b2b2b;
  color: #aaa;
}

.editor-close svg {
  width: 15px;
  height: 15px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.6;
}

.editor-form {
  padding: 20px;
}

.editor-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
  margin-bottom: 16px;
}

.editor-field label {
  color: #bbb;
  font-size: 13px;
}

.editor-field input,
.editor-field textarea {
  width: 100%;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #1b1b1b;
  color: #fff;
}

.editor-field input {
  height: 44px;
  padding: 0 12px;
}

.editor-field textarea {
  min-height: 200px;
  padding: 12px;
  resize: vertical;
  line-height: 1.5;
}

.editor-field input:focus,
.editor-field textarea:focus {
  border-color: #d56b2d;
}

.editor-error {
  margin-bottom: 14px;
  color: #ff9f9f;
  font-size: 13px;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.editor-counter {
  color: #777;
  font-size: 12px;
}

.editor-actions {
  display: flex;
  gap: 8px;
}

.editor-cancel,
.editor-save {
  height: 40px;
  padding: 0 14px;
  border-radius: 8px;
  font-weight: 600;
}

.editor-cancel {
  border: 1px solid #3a3a3a;
  background: #2b2b2b;
  color: #ccc;
}

.editor-save {
  border: 0;
  background: #d56b2d;
  color: #fff;
}

.editor-save:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 600px) {
  .modal-backdrop {
    padding: 12px;
  }

  .editor-footer {
    align-items: flex-end;
    flex-direction: column;
  }

  .editor-actions {
    width: 100%;
  }

  .editor-actions button {
    flex: 1;
  }
}
`;

export default function NoteEditorModal({ note, onClose, onSave }) {
  const [form, setForm] = useState({
    title: "",
    content: "",
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setForm({
      title: note?.title || "",
      content: note?.content || "",
    });

    setError("");
  }, [note]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title.trim()) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await onSave({
        title: form.title.trim(),
        content: form.content.trim(),
      });
    } catch (error) {
      const validationMessage = error.errors
        ? Object.values(error.errors).flat()[0]
        : null;

      setError(validationMessage || error.message);
      setSaving(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <div className="modal-backdrop" onMouseDown={onClose}>
        <section
          className="editor-modal"
          onMouseDown={(event) => event.stopPropagation()}
        >
          <div className="editor-top">
            <h2>{note ? "Edit note" : "New note"}</h2>

            <button
              className="editor-close"
              onClick={onClose}
              aria-label="Close"
            >
              <CloseIcon />
            </button>
          </div>

          <form className="editor-form" onSubmit={handleSubmit}>
            <div className="editor-field">
              <label htmlFor="note-title">Title</label>
              <input
                id="note-title"
                name="title"
                value={form.title}
                onChange={handleChange}
                maxLength="100"
                autoFocus
                required
              />
            </div>

            <div className="editor-field">
              <label htmlFor="note-content">Content</label>
              <textarea
                id="note-content"
                name="content"
                value={form.content}
                onChange={handleChange}
                maxLength="3000"
              />
            </div>

            {error && <div className="editor-error">{error}</div>}

            <div className="editor-footer">
              <span className="editor-counter">
                {form.content.length} / 3000
              </span>

              <div className="editor-actions">
                <button
                  className="editor-cancel"
                  type="button"
                  onClick={onClose}
                >
                  Cancel
                </button>

                <button
                  className="editor-save"
                  type="submit"
                  disabled={saving || !form.title.trim()}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </form>
        </section>
      </div>
    </>
  );
}