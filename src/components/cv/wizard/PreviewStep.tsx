"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { Box } from "@mui/material";
import { CVData } from "@/lib/types";
import {
  ModernCV,
  MinimalistCV,
  ProfessionalCV,
  CreativeCV,
  COLOR_THEMES,
  DEFAULT_THEME,
} from "@/components/cv/templates";

const TEMPLATES = {
  modern: ModernCV,
  minimalist: MinimalistCV,
  professional: ProfessionalCV,
  creative: CreativeCV,
};

// Loaded via next/dynamic with ssr: false (react-pdf is browser-only).
export default function PreviewStep({ data }: { data: CVData }) {
  const Template = TEMPLATES[data.templateId as keyof typeof TEMPLATES] ?? ModernCV;
  const colors = COLOR_THEMES[data.themeId ?? DEFAULT_THEME] ?? COLOR_THEMES[DEFAULT_THEME];
  return (
    <Box
      sx={{
        height: { xs: 480, md: 720 },
        borderRadius: 1,
        overflow: "hidden",
        border: 1,
        borderColor: "divider",
      }}
    >
      <PDFViewer width="100%" height="100%" style={{ border: "none" }}>
        <Template data={data} colors={colors} />
      </PDFViewer>
    </Box>
  );
}
