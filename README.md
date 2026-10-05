# Secure Notes App

A small full-stack CRUD application built with ASP.NET Core, Entity Framework Core, SQLite, React and Vite.

The important difference from a basic notes CRUD is ownership: every note belongs to one authenticated user, and every notes query is filtered by the authenticated user's ID on the server.

## Stack

- ASP.NET Core Web API (.NET 8)
- Entity Framework Core + SQLite
- Cookie authentication with HttpOnly cookies
- ASP.NET Core antiforgery protection
- Password hashing through `PasswordHasher<TUser>`
- Per-IP rate limiting on login and registration
- React 19 + Vite
- Component-based UI
- CSS kept inside `.jsx` components, with no `App.css` or `index.css`

## Project structure

```text
notes-app-secure/
├── backend/
│   ├── NotesApi.sln
│   └── NotesApi/
│       ├── Controllers/
│       ├── Data/
│       ├── Dtos/
│       ├── Migrations/
│       ├── Models/
│       ├── Properties/
│       ├── Program.cs
│       ├── appsettings.json
│       └── NotesApi.csproj
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── .gitignore
└── README.md
```

## Run backend

Requirements: .NET 8 SDK.

```bash
cd backend/NotesApi
dotnet restore
dotnet run
```

The development profile starts the API at:

```text
http://localhost:5148
```

The included initial EF Core migration is applied automatically on startup and creates `notes-users.db`.

Swagger is available in Development at:

```text
http://localhost:5148/swagger
```

## Run frontend

Requirements: Node.js 20+.

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

`VITE_API_URL` is optional. The frontend defaults to `http://localhost:5148/api`.

To override it, copy `.env.example` to `.env` and change the value.

## Security model

Passwords are never stored in plain text. The API hashes them with ASP.NET Core's password hasher.

Authentication uses an HttpOnly cookie, so authentication credentials are not exposed to React code or browser storage.

Unsafe requests use an ASP.NET Core antiforgery token sent through the `X-CSRF-TOKEN` header.

Each note has a `UserId` foreign key. The notes controller never trusts a user ID sent by the browser. It reads the authenticated user ID from server-side claims and applies it to every read, update and delete query.

CORS uses an explicit frontend origin and credentials support rather than `AllowAnyOrigin`.

Login and registration use rate limiting.

Validation exists on both the React forms and the API DTOs.

## Production configuration

For separate frontend and API origins, both must use HTTPS. Add the deployed frontend origin to `AllowedOrigins` in configuration. In Production, the authentication and antiforgery cookies are configured as `Secure` and `SameSite=None`.

For multi-instance production hosting, persist and share ASP.NET Core Data Protection keys between API instances.

Use a production database such as PostgreSQL or SQL Server instead of SQLite if the application needs concurrent multi-instance writes or larger scale.

## GitHub

Create a repository and push the project root:

```bash
git init
git add .
git commit -m "Build secure multi-user notes app"
git branch -M main
git remote add origin YOUR_REPOSITORY_URL
git push -u origin main
```
