# Admin Panel (Frontend Template)

Buyer setup guide for the Admin Panel project.

## What This Project Is

This is a **frontend-only** Next.js admin dashboard template.

- Built with Next.js, TypeScript, Tailwind CSS, and React Query
- Includes mock API calls in `lib/api.ts`
- No backend or database is included

## Requirements

- Node.js LTS (latest stable LTS recommended)
- npm (comes with Node.js)

## Quick Start

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

macOS/Linux:

```bash
cp .env.example .env.local
```

3. Edit `.env.local`:

```env
NEXT_PUBLIC_APP_NAME=Admin Panel
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
```

4. Run development server:

```bash
npm run dev
```

5. Open:

`http://localhost:3000`

## NPM Scripts

- `npm run dev` - Start development server
- `npm run build` - Create production build
- `npm run start` - Run production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode
- `npm run format` - Check formatting with Prettier
- `npm run format:write` - Auto-format project

## Production Setup

1. Build app:

```bash
npm run build
```

2. Start app:

```bash
npm run start
```

The production server also runs on port `3000` by default.

## Auth Note

Authentication is mocked on the frontend:

- App checks for `localStorage.admin_token`
- Missing token redirects user to `/login`
- Login page saves a mock token and redirects to `/dashboard`

## Extra Documentation

A short HTML install guide is included here:

- [INSTALLATION.html](./INSTALLATION.html)
