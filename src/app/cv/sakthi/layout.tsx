import type { Metadata } from "next";
import { cvData } from "./_data/cvData";

export const metadata: Metadata = {
  title: `${cvData.name} CV`,
  description: cvData.summary,
};

export default function SakthiCVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
