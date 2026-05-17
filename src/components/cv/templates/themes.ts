export interface ColorPalette {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  primaryText: string;
  accentBg: string;
}

export const COLOR_THEMES: Record<string, ColorPalette> = {
  emerald: {
    primary: "#065f46",
    primaryLight: "#047857",
    primaryDark: "#064e3b",
    primaryText: "#022c22",
    accentBg: "#d1fae5",
  },
  blue: {
    primary: "#1e3a8a",
    primaryLight: "#1e40af",
    primaryDark: "#1e293b",
    primaryText: "#0f172a",
    accentBg: "#dbeafe",
  },
  violet: {
    primary: "#5b21b6",
    primaryLight: "#6d28d9",
    primaryDark: "#4c1d95",
    primaryText: "#3b0764",
    accentBg: "#ede9fe",
  },
  amber: {
    primary: "#92400e",
    primaryLight: "#b45309",
    primaryDark: "#78350f",
    primaryText: "#451a03",
    accentBg: "#fef3c7",
  },
  rose: {
    primary: "#9f1239",
    primaryLight: "#be123c",
    primaryDark: "#881337",
    primaryText: "#4c0519",
    accentBg: "#ffe4e6",
  },
  slate: {
    primary: "#334155",
    primaryLight: "#475569",
    primaryDark: "#1e293b",
    primaryText: "#0f172a",
    accentBg: "#e2e8f0",
  },
};

export type ThemeId = keyof typeof COLOR_THEMES;

export const DEFAULT_THEME: ThemeId = "emerald";
