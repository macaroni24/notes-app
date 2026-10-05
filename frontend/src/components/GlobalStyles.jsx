const styles = `
* {
  box-sizing: border-box;
}

html,
body,
#root {
  margin: 0;
  min-width: 320px;
  min-height: 100%;
}

body {
  min-height: 100vh;
  font-family: Arial, sans-serif;
  background: #1b1b1b;
  color: #f5f5f5;
}

button,
input,
textarea {
  font: inherit;
}

button {
  cursor: pointer;
}

input,
textarea,
button {
  outline: none;
}

input:focus,
textarea:focus,
button:focus-visible {
  outline: 2px solid #d56b2d;
  outline-offset: 2px;
}
`;

export default function GlobalStyles() {
  return <style>{styles}</style>;
}