# CVRay Architecture & Features

## UI / UX

- **Material UI (MUI):** The project uses MUI as the core UI library.
- **Premium Aesthetics:** The dashboard leverages gradients, glassmorphism (`backdrop-filter`), and dynamic micro-animations for an exceptional user experience.
- **Grid Layouts:** Using MUI v6 standard `<Grid size={{ xs: 12, md: 6 }}>` layout system.
- **Navigation:** Top-only AppBar layout (`src/app/(main)/layout.tsx`) replacing traditional sidebars to maximize horizontal space. Root (`/`) redirects directly to `/profiles`.

## Next.js

- Uses Next.js App Router for all routes (`src/app`).

## Authentication

- **NextAuth.js:** Integrated for secure user sessions.
- **Google OAuth:** Primary sign-in method via a premium landing page at the root (`/`).
- **Session Strategy:** Uses JWT strategy for efficient session handling.

## Features

- **Landing Page:** A visually stunning entry point with the CVRay logo and "Sign in with Google" functionality.
- **Profiles First:** Users start by managing foundational base profiles (`/profiles`). Includes an advanced **Create Profile** modal flow allowing instant upload and multi-modal AI parsing.
- **Modular & High-Fidelity Profile Cards:** Upgraded, responsive card widgets featuring linear-gradient accent headers, glassmorphic layout backing, a custom neon radial-gradient initials avatar, a preview row of key skills, and an exceptionally premium, dynamic hover state.
- **Job Tracking:** Nested routing (`/profiles/[profileId]/jobs`) tracks all applications tailored to a specific base profile, featuring status tracking, real-time filtering, sorting, and search. Includes a direct **Edit Profile** shortcut button for instant profile modifications.
- **CV Tailoring Page:** A comprehensive workspace (`/profiles/[profileId]/jobs/[jobId]/cv`) featuring job details, an AI tailoring assistant, and live previews of the CV and cover letter.
- **AI CV Assistant:** An interactive chatbot powered by Gemini Flash that can automatically modify CV data and cover letters using specialized tools (`updateCV`, `updateCoverLetter`).
- **Dynamic Previews:** Side-by-side view of the CV and Cover Letter with instant updates as the AI modifies them.
- **Dynamic PDF Generation:** Built-in CV viewing and PDF generation using `@react-pdf/renderer` across 5 highly customized styles (Classic, Modern, Minimalist, Professional, Creative).
- **Centralized PDF Utilities:** Shareable, lint-safe parser functions, clean URL formatters, and central text renderers imported from `src/components/cv/templates/constants.tsx`.
- **Layout Integrity Safeguard:** Automatic prevention of fragmented/broken experience lists on the very first work experience block to ensure visual excellence and design coherence.

## Tech Implementation Details

- **CV Parsing:** Handled via `/api/upload-cv`. Uses Vercel AI SDK (`ai` and `@ai-sdk/google`) to send files directly to Gemini Flash for multi-modal processing and structured data extraction.
- **AI Engine:** Google Gemini Flash (`gemini-1.5-flash`) is used to extract and structure CV data via `generateObject`, using the `GEMINI_API_KEY`.
- **Database:** Prisma with SQLite/LibSQL. Schema includes standard NextAuth models (`User`, `Account`, `Session`) linked to `UserProfile`.
- **Theme:** "Obsidian & Neon" aesthetic implemented via MUI Theme and custom glassmorphism overrides.

## Coding Standards & Maintenance

- **Self-Updating Documentation:** This file (`.gemini/GEMINI.md`) must be updated whenever new significant features, requirements, or architectural changes are introduced.
- **Modularity:** Code must be modular. Keep components and functions focused and decoupled.
- **Type Safety:** Strictly avoid using `any`. Use descriptive types and interfaces.
- **File Size:** If a file exceeds 250 lines, it must be split into smaller, logical components or modules.
- **Organization:** Maintain a clean project structure with well-named files and folders. Use subfolders to group related logic.
- **UI Components:** Never use native `alert()`. Always use Material UI (MUI) components, specifically `MUI Alert` for notifications.

## Development Workflow

- **Gemini Dev Hook:** This project uses a custom Webpack plugin (`scripts/gemini-webpack-plugin.mjs`) registered in `next.config.mjs`.
- **How it works:** Every time you run `pnpm dev`, the server is automatically "hooked". If a compilation error occurs, Gemini will automatically launch in an interactive session to help you fix it.
- **Opt-out:** To run the dev server without Gemini, use `SKIP_GEMINI=1 pnpm dev`.
