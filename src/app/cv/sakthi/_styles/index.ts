import { Font, StyleSheet } from "@react-pdf/renderer";
import { getGoogleFontUrl } from "../_utils/fontLoader";

/* --------- Font Registration --------- */

/**
 * Register a global hyphenation callback that returns the original word to disable hyphenation.
 */
Font.registerHyphenationCallback((word) => [word]);

/**
 * Helper to register a Google Font family with standard weights.
 */
const registerFontFamily = async (family: string) => {
  const [regular, bold, italic] = await Promise.all([
    getGoogleFontUrl(family, 400),
    getGoogleFontUrl(family, 700),
    getGoogleFontUrl(family, 400, true),
  ]);

  Font.register({
    family,
    fonts: [
      { src: regular, fontWeight: 400 },
      { src: bold, fontWeight: 700 },
      { src: italic, fontStyle: "italic", fontWeight: 400 },
    ],
  });
};

/**
 * Register fonts asynchronously before rendering the PDF.
 */
export async function registerFonts() {
  await Promise.all([
    registerFontFamily("Inter"),
    registerFontFamily("Playfair Display"),
    registerFontFamily("Lora"),
  ]);
}

/* --------- Colour Palette --------- */

export const COLORS = {
  ink: "#1a1a2e",
  body: "#2d3748",
  muted: "#718096",
  light: "#a0aec0",
  border: "#e2e8f0",
  accent: "#2b6cb0",
  accentLight: "#ebf8ff",
  rowAlt: "#f7fafc",
  white: "#ffffff",
};

/* --------- Stylesheet --------- */

export const styles = StyleSheet.create({
  /* Page */
  page: {
    paddingHorizontal: 42,
    paddingTop: 24,
    paddingBottom: 16,
    fontFamily: "Inter",
    fontSize: 9,
    lineHeight: 1.35,
    color: COLORS.body,
  },

  /* ---- Header ---- */
  header: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1.5,
    borderBottomColor: COLORS.accent,
    borderBottomStyle: "solid",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: 6,
  },
  name: {
    fontSize: 22,
    fontFamily: "Playfair Display",
    fontWeight: 700,
    color: COLORS.ink,
    letterSpacing: 0.5,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 11,
    fontFamily: "Inter",
    fontWeight: 700,
    color: COLORS.accent,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 2,
    marginBottom: 2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 0,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  contactText: {
    fontSize: 8,
    color: COLORS.body,
    fontFamily: "Inter",
    lineHeight: 1.2,
  },
  contactSep: {
    fontSize: 8,
    color: COLORS.light,
    marginHorizontal: 6,
  },

  /* ---- Summary ---- */
  summary: {
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.accent,
    borderLeftStyle: "solid",
  },
  summaryText: {
    fontSize: 9,
    lineHeight: 1.4,
    color: COLORS.body,
    textAlign: "left",
  },

  /* ---- Section Header ---- */
  sectionHeader: {
    fontSize: 9,
    fontFamily: "Inter",
    fontWeight: 700,
    marginTop: 8,
    marginBottom: 4,
    textTransform: "uppercase",
    color: COLORS.accent,
    letterSpacing: 1.2,
    paddingBottom: 2,
    borderBottomWidth: 0.75,
    borderBottomColor: COLORS.border,
    borderBottomStyle: "solid",
  },

  /* ---- Skills Table ---- */
  skillsTable: {
    flexDirection: "column",
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderStyle: "solid",
    borderRadius: 3,
    overflow: "hidden",
  },
  skillsRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
    borderBottomStyle: "solid",
  },
  skillsRowEven: {
    backgroundColor: COLORS.rowAlt,
  },
  skillsLabel: {
    width: "27%",
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 8.5,
    color: COLORS.accent,
    borderRightWidth: 0.5,
    borderRightColor: COLORS.border,
    borderRightStyle: "solid",
    lineHeight: 1.3,
  },
  skillsContent: {
    width: "73%",
    paddingHorizontal: 7,
    paddingVertical: 4,
    fontSize: 8.5,
    color: COLORS.body,
    lineHeight: 1.3,
  },

  /* ---- Experience ---- */
  experienceItem: {
    marginTop: 2,
    marginBottom: 2,
  },
  roleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginTop: 2,
    marginBottom: 2,
  },
  role: {
    fontSize: 10,
    fontFamily: "Inter",
    fontWeight: 700,
    color: COLORS.ink,
    lineHeight: 1.2,
  },
  dates: {
    fontSize: 8.5,
    fontFamily: "Inter",
    fontStyle: "italic",
    color: COLORS.muted,
    lineHeight: 1.2,
  },
  companyClientRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  companyName: {
    fontSize: 9,
    fontFamily: "Inter",
    fontWeight: 700,
    color: COLORS.muted,
  },
  clientLabel: {
    fontSize: 9,
    fontFamily: "Inter",
    fontStyle: "italic",
    color: COLORS.muted,
    marginLeft: 3,
    marginRight: 1,
  },
  clientName: {
    fontSize: 9,
    fontFamily: "Inter",
    fontWeight: 700,
    color: COLORS.accent,
  },

  /* ---- Bullet Points ---- */
  bulletPoint: {
    flexDirection: "row",
    paddingLeft: 4,
    marginBottom: 3,
  },
  bullet: {
    width: 12,
    fontSize: 9,
    color: COLORS.accent,
    lineHeight: 1.3,
  },
  bulletContent: {
    flex: 1,
    fontSize: 8.5,
    lineHeight: 1.3,
    color: COLORS.body,
    textAlign: "left",
  },

  /* ---- Education & Certifications ---- */
  educationItem: {
    marginBottom: 4,
  },
  certificationItem: {
    flexDirection: "row",
    marginBottom: 2,
    alignItems: "flex-start",
  },

  /* ---- Typography utilities ---- */
  bold: {
    fontFamily: "Inter",
    fontWeight: 700,
  },
  italic: {
    fontFamily: "Inter",
    fontStyle: "italic",
  },
  small: {
    fontSize: 8,
    color: COLORS.muted,
  },
});
