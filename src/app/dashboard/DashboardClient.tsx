"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Fade,
  Grid,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

interface DashboardStats {
  totalProfiles: number;
  tailoredCvs: number;
  applicationsTracked: number;
}

export default function DashboardClient({ stats }: { stats: DashboardStats }) {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setSelectedFile(file);
      
      setUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await fetch("/api/upload-cv", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (response.ok) {
          setFeedback({ message: "CV uploaded and parsed successfully!", type: "success" });
          router.refresh();
        } else {
          setFeedback({ message: data.error || "Failed to upload CV", type: "error" });
        }
      } catch (error) {
        setFeedback({ message: "An error occurred during upload", type: "error" });
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <Fade in={true} timeout={800}>
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        {/* --------- Header Area --------- */}
        <Box sx={{ mb: 6 }}>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 800,
              background: "linear-gradient(to right, #ffffff 0%, #a8b2c1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            AI-Powered CV Parsing and Job Tailoring. Manage your career assets here.
          </Typography>
        </Box>

        {/* --------- Stats Cards Row --------- */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            { label: "Total Profiles", value: stats.totalProfiles, icon: <InsertDriveFileIcon />, color: "#10b981" },
            { label: "AI Tailored CVs", value: stats.tailoredCvs, icon: <AutoAwesomeIcon />, color: "#d946ef" },
            { label: "Applications Tracked", value: stats.applicationsTracked, icon: <TrendingUpIcon />, color: "#f59e0b" }
          ].map((stat, i) => (
            <Grid key={i} size={{ xs: 12, sm: 4 }}>
              <Card sx={{ 
                height: "100%", 
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: `0 12px 24px -10px ${stat.color}40`,
                }
              }}>
                <CardContent sx={{ p: 3, display: "flex", alignItems: "center", gap: 2 }}>
                  <Box sx={{ 
                    p: 1.5, 
                    borderRadius: 1, 
                    bgcolor: `${stat.color}15`, 
                    color: stat.color,
                    display: "flex"
                  }}>
                    {stat.icon}
                  </Box>
                  <Box>
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {stat.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {stat.label}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* --------- Main Grid Layout --------- */}
        <Grid container spacing={4}>
          {/* --------- Upload Section --------- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%", position: "relative", overflow: "visible" }}>
              <CardContent sx={{ p: 5, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300 }}>
                {uploading ? (
                  <CircularProgress size={64} sx={{ mb: 4, color: "#10b981" }} />
                ) : (
                  <CloudUploadIcon sx={{ fontSize: 64, color: "primary.main", mb: 2, filter: "drop-shadow(0 0 12px rgba(16, 185, 129, 0.4))" }} />
                )}
                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                  {uploading ? "Parsing your CV..." : "Upload Base CV"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4, maxWidth: "80%" }}>
                  {uploading 
                    ? "Gemini is extracting your skills and experience. This will only take a moment."
                    : "Upload your base CV to let Gemini parse and structure your data for future applications."}
                </Typography>
                <Button
                  variant="contained"
                  component="label"
                  size="large"
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} color="inherit" /> : <CloudUploadIcon />}
                  sx={{
                    px: 4,
                    py: 1.5,
                    background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
                    fontWeight: 600,
                    letterSpacing: 0.5,
                  }}
                >
                  {uploading ? "Processing..." : "Browse Files"}
                  <input type="file" hidden accept=".pdf,.doc,.docx" onChange={handleFileUpload} />
                </Button>
                {selectedFile && !uploading && (
                  <Fade in={true}>
                    <Typography variant="body2" sx={{ mt: 3, color: "secondary.main", fontWeight: 500 }}>
                      ✓ Selected: {selectedFile.name}
                    </Typography>
                  </Fade>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* --------- AI Tailoring Section --------- */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Card sx={{ height: "100%" }}>
              <CardContent sx={{ p: 5, display: "flex", flexDirection: "column", minHeight: 300 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <AutoAwesomeIcon sx={{ fontSize: 32, color: "secondary.main" }} />
                  <Typography variant="h5" sx={{ fontWeight: 600 }}>
                    Tailor for a Job
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                  Have a specific job in mind? Paste the job description and our AI will automatically tailor your CV and generate a custom cover letter.
                </Typography>
                
                <Box sx={{ flexGrow: 1 }} />
                
                <Button
                  variant="outlined"
                  size="large"
                  fullWidth
                  sx={{
                    py: 1.5,
                    borderWidth: 2,
                    borderColor: "secondary.main",
                    color: "secondary.main",
                    fontWeight: 600,
                    "&:hover": {
                      borderWidth: 2,
                      background: "rgba(217, 70, 239, 0.05)",
                    }
                  }}
                >
                  Create New Tailored CV
                </Button>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Snackbar 
          open={!!feedback} 
          autoHideDuration={6000} 
          onClose={() => setFeedback(null)}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        >
          {feedback ? (
            <Alert onClose={() => setFeedback(null)} severity={feedback.type} sx={{ width: "100%" }}>
              {feedback.message}
            </Alert>
          ) : undefined}
        </Snackbar>
      </Box>
    </Fade>
  );
}
