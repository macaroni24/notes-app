import { LogoutIcon, PlusIcon, SearchIcon } from "./Icons.jsx";

const styles = `
.navbar {
  position: sticky;
  top: 0;
  z-index: 50;
  border-bottom: 1px solid #333;
  background: #222;
}

.navbar-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 14px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.nav-title {
  font-size: 20px;
  font-weight: 700;
  color: #fff;
}

.nav-search {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
  height: 42px;
  padding: 0 12px;
  border: 1px solid #3a3a3a;
  border-radius: 8px;
  background: #1b1b1b;
}

.nav-search svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: #888;
  stroke-width: 1.8;
}

.nav-search input {
  width: 100%;
  border: 0;
  outline: none;
  background: transparent;
  color: #fff;
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-user {
  color: #aaa;
  font-size: 13px;
}

.nav-button,
.nav-new {
  height: 40px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.nav-button {
  width: 40px;
  border: 1px solid #3a3a3a;
  background: #2a2a2a;
  color: #ccc;
}

.nav-new {
  gap: 8px;
  padding: 0 14px;
  border: 0;
  background: #d56b2d;
  color: #fff;
  font-weight: 600;
}

.nav-button svg,
.nav-new svg {
  width: 16px;
  height: 16px;
  fill: none;
  stroke: currentColor;
  stroke-width: 1.8;
  stroke-linecap: round;
  stroke-linejoin: round;
}

@media (max-width: 700px) {
  .nav-user,
  .nav-new span {
    display: none;
  }

  .nav-new {
    width: 40px;
    padding: 0;
  }

  .navbar-inner {
    padding: 12px;
  }
}
`;

export default function Navbar({
  search,
  onSearch,
  onNew,
  onLogout,
  user,
}) {
  return (
    <>
      <style>{styles}</style>

      <header className="navbar">
        <div className="navbar-inner">
          <div className="nav-title">Notes</div>

          <div className="nav-search">
            <SearchIcon />

            <input
              value={search}
              onChange={(event) => onSearch(event.target.value)}
              placeholder="Search notes"
            />
          </div>

          <div className="nav-actions">
            <span className="nav-user">{user.name}</span>

            <button
              className="nav-button"
              onClick={onLogout}
              aria-label="Sign out"
            >
              <LogoutIcon />
            </button>

            <button className="nav-new" onClick={onNew}>
              <PlusIcon />
              <span>New note</span>
            </button>
          </div>
        </div>
      </header>
    </>
  );
}