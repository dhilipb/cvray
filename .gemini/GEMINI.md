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
- **Profiles First:** Users start by managing foundational base profiles (`/profiles`) displayed as clickable cards.
- **Job Tracking:** Nested routing (`/profiles/[profileId]/jobs`) allows tracking applications tailored to a specific base profile.
- **CV Uploading & Tailoring:** Users can upload base CVs and use Gemini to parse/tailor them for specific Job Descriptions.
- **AI CV Previewer:** Reusable `CVPreviewer` component offering a side-by-side view of the generated CV alongside an AI Chat assistant.
- **Dynamic PDF Generation:** Built-in CV viewing and PDF generation using `@react-pdf/renderer`.

## Tech Implementation Details
- **CV Parsing:** Handled via `/api/upload-cv`. Uses `pdf-parse` for PDFs and `mammoth` for DOCX.
- **AI Engine:** Google Gemini (`gemini-1.5-flash`) is used to extract and structure CV data.
- **Database:** Prisma with SQLite/LibSQL. Schema includes standard NextAuth models (`User`, `Account`, `Session`) linked to `UserProfile`.
- **Theme:** "Obsidian & Neon" aesthetic implemented via MUI Theme and custom glassmorphism overrides.
