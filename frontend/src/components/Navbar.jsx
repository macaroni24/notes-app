import { LogoutIcon, PlusIcon, SearchIcon, LogoIcon } from "./Icons.jsx";

const styles = `
.navbar { position: sticky; top: 0; z-index: 50; height: 76px; border-bottom: 1px solid #23221f; background: rgba(17,17,15,.92); backdrop-filter: blur(18px); }
.navbar-inner { width: min(1320px, calc(100% - 44px)); height: 100%; margin: 0 auto; display: grid; grid-template-columns: auto minmax(240px, 520px) auto; align-items: center; gap: 34px; }
.nav-brand { display: flex; align-items: center; gap: 11px; }
.nav-brand svg { width: 27px; height: 27px; color: #c5642f; }
.nav-brand span { font-family: "Instrument Serif", serif; font-size: 22px; font-style: italic; letter-spacing: .08em; }
.nav-search { height: 43px; display: flex; align-items: center; gap: 10px; padding: 0 13px; border: 1px solid #2b2a26; border-radius: 9px; background: #181816; }
.nav-search svg { width: 17px; height: 17px; fill: none; stroke: #747168; stroke-width: 1.7; }
.nav-search input { width: 100%; border: 0; outline: 0; background: transparent; color: #f3f0ea; font-size: 13px; }
.nav-actions { display: flex; align-items: center; gap: 8px; }
.nav-user { max-width: 150px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #858278; font-size: 11px; }
.nav-icon-button, .nav-new { height: 40px; display: inline-flex; align-items: center; justify-content: center; border-radius: 8px; }
.nav-icon-button { width: 40px; border: 1px solid #2b2a26; background: #181816; color: #858278; }
.nav-new { gap: 8px; padding: 0 14px; border: 1px solid #c5642f; background: #c5642f; color: #17120f; font-size: 11px; font-weight: 800; }
.nav-icon-button svg, .nav-new svg { width: 16px; height: 16px; fill: none; stroke: currentColor; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
@media (max-width: 760px) { .navbar-inner { width: calc(100% - 28px); grid-template-columns: auto 1fr auto; gap: 12px; } .nav-brand span, .nav-user, .nav-new span { display: none; } .nav-search { min-width: 0; } .nav-new { width: 40px; padding: 0; } }
`;

export default function Navbar({ search, onSearch, onNew, onLogout, user }) {
  return (
    <>
      <style>{styles}</style>
      <header className="navbar">
        <div className="navbar-inner">
          <div className="nav-brand"><LogoIcon /><span>NOTES.</span></div>
          <label className="nav-search"><SearchIcon /><input value={search} onChange={(event) => onSearch(event.target.value)} placeholder="Search your notes" aria-label="Search notes" /></label>
          <div className="nav-actions">
            <span className="nav-user">{user.name}</span>
            <button className="nav-icon-button" onClick={onLogout} aria-label="Sign out"><LogoutIcon /></button>
            <button className="nav-new" onClick={onNew}><PlusIcon /><span>New note</span></button>
          </div>
        </div>
      </header>
    </>
  );
}
