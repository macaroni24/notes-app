import { useEffect, useState } from "react";
import AuthPage from "./components/AuthPage.jsx";
import GlobalStyles from "./components/GlobalStyles.jsx";
import NotesPage from "./components/NotesPage.jsx";
import { getCurrentUser, refreshCsrfToken } from "./services/api.js";

const styles = `
.app-loading { min-height: 100vh; display: grid; place-items: center; background: #11110f; color: #8a877e; font-size: 12px; letter-spacing: .08em; text-transform: uppercase; }
`;

export default function App() {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        await refreshCsrfToken();
        setUser(await getCurrentUser());
      } catch (err) {
        if (err.status !== 401) console.error(err);
      } finally {
        setReady(true);
      }
    }

    bootstrap();
  }, []);

  return (
    <>
      <GlobalStyles />
      <style>{styles}</style>
      {!ready ? <div className="app-loading">Opening notes...</div> : user ? <NotesPage user={user} onSignedOut={() => setUser(null)} /> : <AuthPage onAuthenticated={setUser} />}
    </>
  );
}
