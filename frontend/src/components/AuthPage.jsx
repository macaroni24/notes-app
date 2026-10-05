import { useState } from "react";
import { loginUser, registerUser } from "../services/api.js";

const styles = `
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: #1b1b1b;
  color: #f5f5f5;
}

.auth-card {
  width: 100%;
  max-width: 420px;
  padding: 32px;
  border: 1px solid #333;
  border-radius: 12px;
  background: #242424;
}

.auth-card h1 {
  margin: 0 0 8px;
  font-size: 30px;
}

.auth-card p {
  margin: 0 0 24px;
  color: #aaa;
  font-size: 14px;
}

.auth-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
}

.auth-tabs button {
  flex: 1;
  padding: 10px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #2c2c2c;
  color: #aaa;
}

.auth-tabs button.active {
  background: #d56b2d;
  border-color: #d56b2d;
  color: #fff;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.auth-field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.auth-field label {
  font-size: 13px;
  color: #ccc;
}

.auth-field input {
  height: 44px;
  padding: 0 12px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  outline: none;
  background: #1d1d1d;
  color: #fff;
}

.auth-field input:focus {
  border-color: #d56b2d;
}

.auth-error {
  padding: 10px 12px;
  border-radius: 8px;
  background: #3a1f1f;
  color: #ff9f9f;
  font-size: 13px;
}

.auth-submit {
  height: 44px;
  border: 0;
  border-radius: 8px;
  background: #d56b2d;
  color: #fff;
  font-weight: 600;
}

.auth-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-footer {
  margin-top: 20px;
  text-align: center;
  color: #777;
  font-size: 12px;
}
`;

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const credentials = {
        email: form.email.trim(),
        password: form.password,
      };

      const user =
        mode === "register"
          ? await registerUser({
              ...credentials,
              name: form.name.trim(),
            })
          : await loginUser(credentials);

      onAuthenticated(user);
    } catch (error) {
      const validationMessage = error.errors
        ? Object.values(error.errors).flat()[0]
        : null;

      setError(validationMessage || error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <main className="auth-page">
        <section className="auth-card">
          <h1>{mode === "login" ? "Sign in" : "Create account"}</h1>

          <p>
            {mode === "login"
              ? "Sign in to manage your notes."
              : "Create an account to start saving notes."}
          </p>

          <div className="auth-tabs">
            <button
              type="button"
              className={mode === "login" ? "active" : ""}
              onClick={() => changeMode("login")}
            >
              Sign in
            </button>

            <button
              type="button"
              className={mode === "register" ? "active" : ""}
              onClick={() => changeMode("register")}
            >
              Register
            </button>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === "register" && (
              <div className="auth-field">
                <label htmlFor="name">Name</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div className="auth-field">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            {error && <div className="auth-error">{error}</div>}

            <button
              className="auth-submit"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Sign in"
                  : "Create account"}
            </button>
          </form>

          <div className="auth-footer">Simple Notes App</div>
        </section>
      </main>
    </>
  );
}