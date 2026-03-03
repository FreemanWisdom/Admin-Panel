# Admin Panel Frontend

Production-grade admin dashboard frontend built with Next.js App Router, TypeScript, Tailwind CSS, TanStack Query, Recharts, Framer Motion, and Lucide icons.

## Scope

This project is **frontend only**.

- No database logic
- No Prisma
- No backend API implementation
- Data layer uses mock API functions in `lib/api.ts` to represent existing REST endpoints

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- TanStack Query (React Query)
- Recharts
- Framer Motion
- Lucide React
- ESLint + Prettier
- Jest + React Testing Library

## Folder Structure

```txt
app/
  (auth)/
    forgot-password/page.tsx
    login/page.tsx
    layout.tsx
  (dashboard)/
    dashboard/
      orders/page.tsx
      page.tsx
    layout.tsx
  globals.css
  layout.tsx
  page.tsx
components/
  charts/
    daily-users-bar-chart.tsx
    revenue-area-chart.tsx
  layout/
    auth-guard.tsx
    dashboard-shell.tsx
    sidebar.tsx
    theme-toggle.tsx
    topbar.tsx
  table/
    data-table.tsx
  ui/
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    dropdown.tsx
    empty-state.tsx
    input.tsx
    modal.tsx
    select.tsx
    skeleton.tsx
    toast.tsx
  providers.tsx
hooks/
  use-debounce.ts
  use-toast.ts
lib/
  api.ts
  utils.ts
types/
  index.ts
styles/
  theme.css
__tests__/
  button.test.tsx
  data-table.test.tsx
  orders-page.test.tsx
```

## Getting Started

### 1) Install dependencies

```bash
npm install
```

### 2) Configure environment

Copy `.env.example` to `.env.local` and adjust values if needed.

```bash
cp .env.example .env.local
```

Example:

```env
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

### 3) Start development server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Commands

- Dev: `npm run dev`
- Build: `npm run build`
- Start production server: `npm run start`
- Lint: `npm run lint`
- Format check: `npm run format`
- Format write: `npm run format:write`
- Test: `npm run test`

## Auth Mock

Dashboard routes are protected by a frontend-only token check:

- If `localStorage.admin_token` is missing, user is redirected to `/login`
- On login submit, a mock token is stored and user is redirected to `/dashboard`

## Notes

- Charts are lazy-loaded with dynamic imports to optimize bundle size.
- Layout is server-first; interactive sections are isolated to client components.
- UI components are reusable, accessible, keyboard navigable, and responsive.
