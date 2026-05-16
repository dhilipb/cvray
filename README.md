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

## Development Workflow

This project uses **ESLint**, **TypeScript (TSC)**, and **Prettier** to maintain code quality. These checks are automatically run before every commit using **Husky**.

### Available Scripts

- `yarn lint`: Run Next.js linting.
- `yarn type-check`: Run TypeScript type checking.
- `yarn format`: Format the codebase with Prettier.
- `yarn format:check`: Check if the codebase follows Prettier formatting.
- `yarn check-all`: Run all the above checks (Lint + TSC + Prettier Check).

### Pre-commit Hook

A Husky pre-commit hook is configured to run `yarn check-all` before any commit. If any check fails, the commit will be blocked.

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Set up your environment variables by copying `.env.example` to `.env` and filling in the values:

```bash
cp .env.example .env
```

Sync the database and generate the Prisma client:

```bash
npx prisma db push
npx prisma generate
```

Then, run the development server:

```bash
yarn dev
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
