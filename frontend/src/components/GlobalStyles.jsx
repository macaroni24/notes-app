const styles = `
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Instrument+Serif:ital@0;1&display=swap");

* { box-sizing: border-box; }
:root {
  font-family: "DM Sans", sans-serif;
  color: #f3f0ea;
  background: #11110f;
  font-synthesis: none;
  text-rendering: optimizeLegibility;
}
html, body, #root { min-width: 320px; min-height: 100%; margin: 0; background: #11110f; }
body { min-height: 100vh; color: #f3f0ea; }
button, input, textarea { font: inherit; }
button { cursor: pointer; }
button, input, textarea { -webkit-tap-highlight-color: transparent; }
button:focus-visible, input:focus-visible, textarea:focus-visible { outline: 2px solid #c5642f; outline-offset: 2px; }
svg { display: block; }
`;

export default function GlobalStyles() {
  return <style>{styles}</style>;
}
