import { Font } from "@react-pdf/renderer";

Font.register({
  family: "Inter",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf",
      fontWeight: 400,
      fontStyle: "italic",
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
  family: "Merriweather",
  fonts: [
    {
      src: "https://fonts.gstatic.com/s/merriweather/v30/u-440qyriQwlOrhSvowK_l5-ciZJ.ttf",
      fontWeight: 400,
    },
    {
      src: "https://fonts.gstatic.com/s/merriweather/v30/u-4m0qyriQwlOrhSvowK_l5-eRZAf-c.ttf",
      fontWeight: 400,
      fontStyle: "italic",
    },
    {
      src: "https://fonts.gstatic.com/s/merriweather/v30/u-4n0qyriQwlOrhSvowK_l52xwNZVsf_.ttf",
      fontWeight: 700,
    },
  ],
});

// Default hyphenation splits ordinary words mid-syllable ("Develop-ment"); keep words whole,
// but chunk very long tokens (URLs, emails) so they wrap instead of overflowing the page.
Font.registerHyphenationCallback((word) =>
  word.length > 30 ? (word.match(/.{1,20}/g) ?? [word]) : [word],
);

export * from "./creative";
export * from "./minimalist";
export * from "./modern";
export * from "./professional";
export * from "./constants";
export { COLOR_THEMES, DEFAULT_THEME, type ColorPalette, type ThemeId } from "./themes";
