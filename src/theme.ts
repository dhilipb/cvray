import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10b981", // Neon Emerald
    },
    secondary: {
      main: "#d946ef", // Vibrant Fuchsia
    },
    background: {
      default: "#09090b", // Obsidian / Zinc 950
      paper: "rgba(24, 24, 27, 0.7)", // Zinc 900 with transparency
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 600,
    },
    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)", // For Safari
          border: "1px solid rgba(255, 255, 255, 0.08)",
          boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
          borderRadius: 4,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 12px 0 rgba(16, 185, 129, 0.4)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: 4,
          background: "linear-gradient(145deg, rgba(24,24,27,0.9) 0%, rgba(9,9,11,0.9) 100%)",
        },
      },
    },
  },
});

export default theme;
