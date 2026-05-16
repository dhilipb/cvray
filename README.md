# CVRay

A Next.js application for rendering and managing CVs and Cover Letters, with support for PDF generation and AI-powered tailoring.

## Tech Stack

- **Framework:** Next.js (App Router)
- **Authentication:** NextAuth.js (Google OAuth)
- **Database:** Prisma with LibSQL/SQLite
- **UI Components:** Material UI (MUI)
- **PDF Rendering:** @react-pdf/renderer
- **AI:** Google Gemini
- **Language:** TypeScript (Strict ESLint with deprecation checks)

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Set up your environment variables by copying `.env.example` to `.env` and filling in the values:

```bash
cp .env.example .env
```

Sync the database:

```bash
npx prisma db push
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3344](http://localhost:3344) with your browser to see the result.

## Features

- **Google Authentication:** Secure sign-in using Google OAuth.
- **Profiles-First Architecture:** Focused on managing multiple professional profiles.
- **AI CV Tailoring:** Upload base CV and let Gemini AI parse and structure your data automatically for specific roles.
- **Premium UI:** "Obsidian & Neon" aesthetic with glassmorphism, responsive layouts, and smooth micro-animations.
- **PDF Preview & Export:** View and download high-quality PDFs of your tailored CVs.

## Project Structure

- `src/app`: Next.js pages and API routes.
- `src/app/(main)`: Main application area (profiles, jobs).
- `src/app/api/auth`: NextAuth authentication routes.
- `src/lib`: Core utilities (Prisma client, Auth config).
- `src/components`: Reusable UI components.
- `prisma`: Database schema and migrations.
