import type { Metadata, Viewport } from "next";
import { Providers } from "@/components/Providers";
// Self-hosted fonts referenced by name in the theme and component styles ("Outfit", "Inter")
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";

export const metadata: Metadata = {
  title: { default: "CVRay", template: "%s · CVRay" },
  description: "Tailor your CV to every job with AI and track your applications in one place.",
};

export const viewport: Viewport = {
  themeColor: "#09090b",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
