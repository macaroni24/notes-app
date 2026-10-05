import { useState } from "react";
import { loginUser, registerUser } from "../services/api.js";
import { LogoIcon } from "./Icons.jsx";

const styles = `
.auth-shell { min-height: 100vh; display: grid; grid-template-columns: 1.1fr .9fr; background: #11110f; }
.auth-visual { position: relative; display: flex; flex-direction: column; justify-content: space-between; padding: 54px; overflow: hidden; border-right: 1px solid #25241f; background: radial-gradient(circle at 20% 20%, rgba(197,100,47,.16), transparent 34%), #141412; }
.auth-visual:after { content: ""; position: absolute; width: 440px; height: 440px; border: 1px solid rgba(197,100,47,.18); border-radius: 50%; right: -150px; bottom: -170px; }
.auth-brand { display: flex; align-items: center; gap: 12px; z-index: 1; }
.auth-brand svg { width: 31px; height: 31px; color: #c5642f; }
.auth-brand span { font-family: "Instrument Serif", serif; font-size: 24px; font-style: italic; letter-spacing: .08em; }
.auth-copy { max-width: 660px; z-index: 1; }
.auth-kicker { display: block; margin-bottom: 18px; color: #c5642f; font-size: 11px; font-weight: 700; letter-spacing: .22em; }
.auth-copy h1 { margin: 0 0 22px; font-family: "Instrument Serif", serif; font-size: clamp(58px, 7vw, 96px); font-weight: 400; line-height: .9; letter-spacing: -.04em; }
.auth-copy h1 em { color: #c5642f; font-weight: 400; }
.auth-copy p { max-width: 520px; margin: 0; color: #8d8a80; line-height: 1.8; }
.auth-panel { display: grid; place-items: center; padding: 42px; }
.auth-card { width: min(440px, 100%); }
.auth-card h2 { margin: 0 0 7px; font-family: "Instrument Serif", serif; font-size: 42px; font-weight: 400; }
.auth-subtitle { margin: 0 0 32px; color: #858278; font-size: 14px; }
.auth-tabs { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 26px; padding: 5px; border: 1px solid #2b2a26; border-radius: 11px; background: #181816; }
.auth-tabs button { height: 40px; border: 0; border-radius: 8px; background: transparent; color: #7e7b72; font-size: 12px; font-weight: 700; }
.auth-tabs button.active { background: #24231f; color: #f3f0ea; }
.auth-form { display: grid; gap: 17px; }
.auth-field { display: grid; gap: 8px; }
.auth-field label { color: #aaa69a; font-size: 11px; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; }
.auth-field input { height: 49px; width: 100%; border: 1px solid #2b2a26; border-radius: 9px; padding: 0 14px; outline: 0; background: #181816; color: #f3f0ea; }
.auth-field input:focus { border-color: #c5642f; }
.auth-error { padding: 12px 14px; border: 1px solid rgba(197,100,47,.35); border-radius: 9px; background: rgba(197,100,47,.1); color: #df8553; font-size: 12px; line-height: 1.5; }
.auth-submit { height: 49px; margin-top: 5px; border: 1px solid #c5642f; border-radius: 9px; background: #c5642f; color: #17120f; font-size: 12px; font-weight: 800; }
.auth-submit:disabled { opacity: .55; cursor: not-allowed; }
.auth-security { margin-top: 18px; color: #68655e; font-size: 11px; line-height: 1.6; }
@media (max-width: 820px) { .auth-shell { grid-template-columns: 1fr; } .auth-visual { min-height: 290px; padding: 34px 26px; border-right: 0; border-bottom: 1px solid #25241f; } .auth-copy h1 { font-size: 54px; } .auth-copy p { display: none; } .auth-panel { padding: 38px 22px 52px; } }
`;

export default function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function setField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = { email: form.email.trim(), password: form.password };
      const user = mode === "register"
        ? await registerUser({ ...payload, name: form.name.trim() })
        : await loginUser(payload);
      onAuthenticated(user);
    } catch (err) {
      const validation = err.errors ? Object.values(err.errors).flat()[0] : null;
      setError(validation || err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <main className="auth-shell">
        <section className="auth-visual">
          <div className="auth-brand"><LogoIcon /><span>NOTES.</span></div>
          <div className="auth-copy">
            <span className="auth-kicker">PRIVATE BY DEFAULT</span>
            <h1>Your thoughts.<br /><em>Your space.</em></h1>
            <p>Each account has its own private note collection. Your notes are only returned when the authenticated user owns them.</p>
          </div>
        </section>

        <section className="auth-panel">
          <div className="auth-card">
            <h2>{mode === "login" ? "Welcome back" : "Create account"}</h2>
            <p className="auth-subtitle">{mode === "login" ? "Sign in to open your notes." : "Start your own private notes workspace."}</p>

            <div className="auth-tabs">
              <button className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); }} type="button">Sign in</button>
              <button className={mode === "register" ? "active" : ""} onClick={() => { setMode("register"); setError(""); }} type="button">Register</button>
            </div>

            <form className="auth-form" onSubmit={handleSubmit}>
              {mode === "register" && (
                <div className="auth-field"><label htmlFor="name">Name</label><input id="name" name="name" value={form.name} onChange={setField} minLength="2" maxLength="60" autoComplete="name" required /></div>
              )}
              <div className="auth-field"><label htmlFor="email">Email</label><input id="email" name="email" type="email" value={form.email} onChange={setField} maxLength="254" autoComplete="email" required /></div>
              <div className="auth-field"><label htmlFor="password">Password</label><input id="password" name="password" type="password" value={form.password} onChange={setField} minLength="8" maxLength="128" autoComplete={mode === "login" ? "current-password" : "new-password"} required /></div>
              {error && <div className="auth-error" role="alert">{error}</div>}
              <button className="auth-submit" disabled={loading} type="submit">{loading ? "Please wait..." : mode === "login" ? "Sign in" : "Create account"}</button>
            </form>
            <p className="auth-security">Authentication uses an HttpOnly cookie, CSRF protection and server-side ownership checks for every note operation.</p>
          </div>
        </section>
      </main>
    </>
  );
}
