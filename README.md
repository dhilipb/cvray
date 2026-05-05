# CVRay

A Next.js application for rendering and managing CVs and Cover Letters, with support for PDF generation and headhunter mode.

## Tech Stack

- **Framework:** Next.js (App Router)
- **UI Components:** Material UI (MUI)
- **PDF Rendering:** @react-pdf/renderer
- **Language:** TypeScript

## Getting Started

First, install the dependencies:

```bash
yarn install
```

Then, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

- **Premium Dashboard UI:** Enhanced Material UI dashboard with glassmorphism, responsive sidebar, and smooth micro-animations.
- **Upload Base CV:** Upload your existing CV (PDF, DOCX) and let Gemini AI parse and structure your data automatically.
- **PDF Preview:** View CVs and Cover Letters directly in the browser.
- **Headhunter Mode:** Toggle between personal and candidate views.
- **PDF Download:** Download CVs and Cover Letters as PDF files.
- **Dynamic Fonts:** Support for custom fonts in PDF generation.

## Project Structure

- `src/app`: Next.js pages and API routes.
- `src/app/dashboard`: Premium user dashboard and layout.
- `src/app/cv/sakthi`: Main CV page and its components.
- `src/app/api/cv/sakthi/pdf`: API route for generating PDF files.
