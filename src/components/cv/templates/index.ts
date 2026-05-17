import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjQ.ttf",
      fontWeight: 600,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjQ.ttf",
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Georgia",
  src: "https://fonts.cdnfonts.com/s/16061/Georgia.woff",
});

export * from "./classic";
export * from "./modern";
export * from "./minimalist";
export * from "./professional";
export * from "./creative";
export { COLOR_THEMES, DEFAULT_THEME, type ColorPalette, type ThemeId } from "./themes";
