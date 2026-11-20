# FixFlow

Issue tracking web app. React 19 + TypeScript + Vite + Tailwind CSS 4.

## Getting started

```bash
npm install
cp .env.example .env   # set VITE_API_BASE_URL
npm run dev            # http://localhost:3000
```

## Structure

```
src/
├── components/
│   ├── common/    Button, LoadingSpinner, PageHeader, Pagination
│   ├── forms/     InputField
│   ├── issue/     IssueCard, StatusBadge
│   └── layout/    Header, Footer, MainLayout
├── context/       AuthContext (user + loading state)
├── hooks/         useAuth
├── pages/         Home, IssueDetail, CreateIssue, Customers, AdminDashboard, Login, Register
├── router/        routes + RequireAuth (role guard)
└── service/       api (axios + token refresh), auth, issue
```

## Backend contract (expected)

Base URL from `VITE_API_BASE_URL`.

- `POST /auth/login`, `/auth/register`, `/auth/refresh`, `GET /auth/me`
- `GET /issues?page&limit`, `GET /issues/admin/all`, `GET /issues/my-issues`, `GET /issues/:id`
- `POST /issues` (multipart: title, description, priority, tags, image)
- `POST /issues/generate-summary`
- `PATCH /issues/:id/visibility`, `PATCH /issues/:id/upvote`

## Deploy

`vercel.json` rewrites all routes to `index.html` for SPA routing.
