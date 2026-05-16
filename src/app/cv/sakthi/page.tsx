"use client";

import {
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Stack,
  Switch,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Download as DownloadIcon, OpenInNew as OpenInNewIcon } from "@mui/icons-material";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { CVCoverLetter } from "./_components/CVCoverLetter";
import { CVResume } from "./_components/CVResume";
import { cvData } from "./_data/cvData";
import { registerFonts } from "./_styles";

/* --------- Dynamic Imports --------- */

const PDFViewerComp = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <CircularProgress color="primary" />
    </Box>
  ),
});

/* --------- Page Component --------- */

export default function SakthiCVPage() {
  const [isMounted, setIsMounted] = useState(false);
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [isHeadhunterMode, setIsHeadhunterMode] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        await registerFonts();
        setFontsLoaded(true);
      } catch (error) {
        console.error("Failed to register fonts:", error);
        setFontsLoaded(true); // Fallback to allow rendering
      }
      setIsMounted(true);
    };
    init();
  }, []);

  if (!isMounted || !fontsLoaded) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          flexDirection: "column",
          gap: 2,
        }}
      >
        <CircularProgress color="primary" />
        <Typography variant="body2" color="text.secondary">
          Initializing PDF Renderer & Fonts...
        </Typography>
      </Box>
    );
  }
  const fileNameSuffix = isHeadhunterMode ? "Candidate" : "Sakthi_Buddha";

  const getDownloadUrl = (type: "cv" | "coverletter") => {
    return `/cv/sakthi/api/pdf?type=${type}&headhunter=${isHeadhunterMode}`;
  };

  const handleDownload = (type: "cv" | "coverletter") => {
    const url = getDownloadUrl(type);
    // Force download by using a temporary anchor
    const link = document.createElement("a");
    link.href = url;
    link.download =
      type === "coverletter" ? `Cover_Letter_${fileNameSuffix}.pdf` : `CV_${fileNameSuffix}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box sx={{ height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      {/* Control Bar */}
      <Paper
        elevation={0}
        square
        sx={{
          px: 3,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "background.paper",
          zIndex: 10,
        }}
      >
        <FormControlLabel
          control={
            <Switch
              checked={isHeadhunterMode}
              onChange={(e) => setIsHeadhunterMode(e.target.checked)}
              color="primary"
            />
          }
          label={
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              Headhunter Mode
            </Typography>
          }
        />

        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          {/* Cover Letter Downloads */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}
            >
              Cover Letter:
            </Typography>
            <Button
              variant="outlined"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("coverletter")}
            >
              Download
            </Button>
            <Tooltip title="Open in New Tab">
              <IconButton
                onClick={() => window.open(getDownloadUrl("coverletter"), "_blank")}
                size="small"
                sx={{ ml: 0.5 }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>

          <Box sx={{ height: 24, width: 1, bgcolor: "divider" }} />

          {/* CV Downloads */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="caption"
              sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase" }}
            >
              CV / Resume:
            </Typography>
            <Button
              variant="contained"
              size="small"
              startIcon={<DownloadIcon />}
              onClick={() => handleDownload("cv")}
              disableElevation
            >
              Download
            </Button>
            <Tooltip title="Open in New Tab">
              <IconButton
                onClick={() => window.open(getDownloadUrl("cv"), "_blank")}
                size="small"
                sx={{ ml: 0.5 }}
              >
                <OpenInNewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        </Stack>
      </Paper>

      <Stack direction="row" sx={{ flexGrow: 1, width: "100%", overflow: "hidden" }}>
        {/* Cover Letter Viewer */}
        <Box sx={{ width: "50%", height: "100%", borderRight: 1, borderColor: "divider" }}>
          <PDFViewerComp width="100%" height="100%" style={{ border: "none" }}>
            <CVCoverLetter data={cvData} isHeadhunterMode={isHeadhunterMode} />
          </PDFViewerComp>
        </Box>

        {/* CV/Resume Viewer */}
        <Box sx={{ width: "50%", height: "100%" }}>
          <PDFViewerComp width="100%" height="100%" style={{ border: "none" }}>
            <CVResume data={cvData} isHeadhunterMode={isHeadhunterMode} />
          </PDFViewerComp>
        </Box>
      </Stack>
    </Box>
  );
}
