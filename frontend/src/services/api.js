const API_URL = "/api";
let csrfToken = null;

async function parseResponse(response) {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get("content-type") || "";
  return contentType.includes("application/json") ? response.json() : null;
}

export async function refreshCsrfToken() {
  const response = await fetch(`${API_URL}/auth/csrf`, {
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error("Could not initialize security token.");
  }

  const data = await response.json();
  csrfToken = data.token;
  return csrfToken;
}

async function request(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const unsafe = ["POST", "PUT", "PATCH", "DELETE"].includes(method);

  if (unsafe && !csrfToken) {
    await refreshCsrfToken();
  }

  const headers = new Headers(options.headers || {});

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  if (unsafe) {
    headers.set("X-CSRF-TOKEN", csrfToken);
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed.");
    error.status = response.status;
    error.errors = data?.errors || null;
    throw error;
  }

  return data;
}

export async function registerUser(payload) {
  const user = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await refreshCsrfToken();
  return user;
}

export async function loginUser(payload) {
  const user = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await refreshCsrfToken();
  return user;
}

export async function getCurrentUser() {
  return request("/auth/me");
}

export async function logoutUser() {
  await request("/auth/logout", { method: "POST" });
  await refreshCsrfToken();
}

export function getNotes() {
  return request("/notes");
}

export function createNote(payload) {
  return request("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateNote(id, payload) {
  return request(`/notes/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
}

export function deleteNote(id) {
  return request(`/notes/${id}`, { method: "DELETE" });
}
