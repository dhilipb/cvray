# CVRay Architecture & Features

## UI / UX
- **Material UI (MUI):** The project uses MUI as the core UI library.
- **Premium Aesthetics:** The dashboard leverages gradients, glassmorphism (`backdrop-filter`), and dynamic micro-animations for an exceptional user experience.
- **Grid Layouts:** Using MUI v6 standard `<Grid size={{ xs: 12, md: 6 }}>` layout system.
- **Navigation:** Implemented a persistent Sidebar and AppBar layout in the dashboard.

## Next.js
- Uses Next.js App Router for all routes (`src/app`).

## Features
- **CV Uploading & Tailoring:** Users can upload base CVs and use Gemini to parse/tailor them for specific Job Descriptions.
- **Dynamic PDF Generation:** Built-in CV viewing and PDF generation using `@react-pdf/renderer` with "Headhunter Mode" variations.

## Tech Implementation Details
- **CV Parsing:** Handled via `/api/upload-cv`. Uses `pdf-parse` for PDFs and `mammoth` for DOCX.
- **AI Engine:** Google Gemini (`gemini-1.5-flash`) is used to extract and structure CV data into a standardized JSON format.
- **Database:** Parsed profiles are stored in the `UserProfile` table.
