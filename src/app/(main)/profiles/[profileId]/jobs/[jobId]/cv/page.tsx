"use client";

import React, { useState, useEffect, use } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Alert,
  Tabs,
  Tab,
  TextField,
  Select,
  MenuItem,
  FormControl,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRouter } from "next/navigation";
import { AIChatAssistant } from "./_components/AIChatAssistant";
import { CVData } from "@/lib/types";
import dynamic from "next/dynamic";
import {
  ModernCV,
  ModernCoverLetter,
  MinimalistCV,
  MinimalistCoverLetter,
  ProfessionalCV,
  ProfessionalCoverLetter,
  CreativeCV,
  CreativeCoverLetter,
  COLOR_THEMES,
  DEFAULT_THEME,
  type ThemeId,
} from "@/components/cv/templates";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";

import CropFreeIcon from "@mui/icons-material/CropFree";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const TEMPLATES = {
  modern: {
    id: "modern",
    name: "Modern",
    cv: ModernCV,
    coverLetter: ModernCoverLetter,
    icon: HistoryEduIcon,
  },
  minimalist: {
    id: "minimalist",
    name: "Minimalist",
    cv: MinimalistCV,
    coverLetter: MinimalistCoverLetter,
    icon: CropFreeIcon,
  },
  professional: {
    id: "professional",
    name: "Professional",
    cv: ProfessionalCV,
    coverLetter: ProfessionalCoverLetter,
    icon: BusinessCenterIcon,
  },
  creative: {
    id: "creative",
    name: "Creative",
    cv: CreativeCV,
    coverLetter: CreativeCoverLetter,
    icon: ColorLensIcon,
  },
};

type TemplateId = keyof typeof TEMPLATES;

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "800px",
        width: "100%",
        bgcolor: "#1e1e24",
      }}
    >
      <CircularProgress sx={{ color: "#10b981" }} />
    </Box>
  ),
});

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => (
      <Button variant="outlined" size="small" disabled>
        Loading...
      </Button>
    ),
  },
);

const JobDetailsTab = ({
  job,
  profileId,
  jobId,
  onUpdate,
}: {
  job: JobWithProfile;
  profileId: string;
  jobId: string;
  onUpdate: (job: JobWithProfile) => void;
}) => {
  const [role, setRole] = useState(job.role);
  const [company, setCompany] = useState(job.company);
  const [description, setDescription] = useState(job.jobDescription || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, jobDescription: description }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        onUpdate(data.job);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: 4, width: "100%", maxWidth: "1000px", color: "text.primary" }}>
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
        Edit Job Details
      </Typography>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Company"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            variant="outlined"
            sx={{ mb: 2 }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Job Description"
            multiline
            rows={15}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            variant="outlined"
            sx={{ mb: 3 }}
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
        <Button
          variant="contained"
          onClick={handleSave}
          disabled={saving}
          sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
        >
          {saving ? "Saving..." : "Save Details"}
        </Button>
        {saveSuccess && (
          <Alert severity="success" sx={{ py: 0 }}>
            Saved successfully!
          </Alert>
        )}
      </Box>
    </Box>
  );
};

/* --------- Main Page --------- */

interface JobWithProfile {
  role: string;
  company: string;
  jobDescription?: string;
  tweakedCvJson?: string;
  userProfile: {
    parsedProfileJson: string;
  };
}

export default function JobCVPage({
  params,
}: {
  params: Promise<{ profileId: string; jobId: string }>;
}) {
  const router = useRouter();
  const { profileId, jobId } = use(params);

  const [job, setJob] = useState<JobWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  const [templateId, setTemplateId] = useState<TemplateId>("modern");
  const [themeId, setThemeId] = useState<ThemeId>(DEFAULT_THEME);

  const [localCvData, setLocalCvData] = useState<CVData | null>(null);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
          setLocalCvData(
            JSON.parse(data.job.tweakedCvJson || data.job.userProfile.parsedProfileJson),
          );
        } else {
          setError(data.error || "Failed to fetch job details");
        }
      } catch {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [profileId, jobId]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );

  if (!localCvData || !job) return null;

  const CVComponent = TEMPLATES[templateId].cv;
  const CoverLetterComponent = TEMPLATES[templateId].coverLetter;

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          p: 0.75,
          px: 2,
          bgcolor: "background.paper",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Button
          startIcon={<ArrowBackIcon sx={{ fontSize: "1rem !important" }} />}
          onClick={() => router.push(`/profiles/${profileId}/jobs`)}
          size="small"
          sx={{
            color: "text.secondary",
            boxShadow: "none",
            py: 0.25,
            px: 1,
            fontSize: "0.75rem",
            "&:hover": {
              boxShadow: "none",
              color: "text.primary",
            },
          }}
        >
          Back to Applications
        </Button>
      </Box>

      <Grid container sx={{ flexGrow: 1, overflow: "hidden" }}>
        {/* Left Column: AI Chat */}
        <Grid
          size={{ xs: 12, md: 3 }}
          sx={{ height: "100%", borderRight: 1, borderColor: "divider" }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <AIChatAssistant
              jobId={jobId}
              profileId={profileId}
              localCvData={localCvData}
              jobDescription={job?.jobDescription}
              onCvUpdate={setLocalCvData}
              onCoverLetterUpdate={(content) =>
                setLocalCvData((prev) => (prev ? { ...prev, coverLetter: content } : null))
              }
            />
          </Box>
        </Grid>

        {/* Right Column: Previews */}
        <Grid size={{ xs: 12, md: 9 }} sx={{ height: "100%" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              bgcolor: "background.paper",
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                px: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                minHeight: 40,
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{
                  minHeight: 40,
                  "& .MuiTab-root": {
                    py: 1,
                    px: 2,
                    minHeight: 40,
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    textTransform: "none",
                  },
                }}
              >
                <Tab
                  icon={<DescriptionIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="CV"
                />
                <Tab
                  icon={<EditIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="Cover Letter"
                />
                <Tab
                  icon={<WorkIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="Job Details"
                />
              </Tabs>
            </Box>

            {(tabValue === 0 || tabValue === 1) && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    TEMPLATE
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <Select
                      value={templateId}
                      onChange={(e) => setTemplateId(e.target.value as TemplateId)}
                      sx={{
                        fontSize: "0.85rem",
                        fontWeight: 600,
                        bgcolor: "rgba(255,255,255,0.05)",
                        "& .MuiSelect-select": {
                          display: "flex",
                          alignItems: "center",
                          gap: 1.5,
                          py: 0.5,
                        },
                      }}
                    >
                      {Object.values(TEMPLATES).map((tmpl) => (
                        <MenuItem
                          key={tmpl.id}
                          value={tmpl.id}
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            fontSize: "0.85rem",
                            fontWeight: 500,
                          }}
                        >
                          <tmpl.icon sx={{ fontSize: "1.2rem", color: "text.secondary" }} />
                          {tmpl.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <>
                    <Box sx={{ width: 1, height: 20, bgcolor: "divider", mx: 1 }} />
                    <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                      COLOR
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                      {Object.entries(COLOR_THEMES).map(([id, palette]) => (
                        <Box
                          key={id}
                          onClick={() => setThemeId(id as ThemeId)}
                          sx={{
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: palette.primary,
                            cursor: "pointer",
                            border: themeId === id ? "2px solid white" : "2px solid transparent",
                            boxShadow: themeId === id ? `0 0 0 2px ${palette.primary}` : "none",
                            transition: "all 0.15s",
                            "&:hover": {
                              transform: "scale(1.15)",
                            },
                          }}
                          title={id.charAt(0).toUpperCase() + id.slice(1)}
                        />
                      ))}
                    </Box>
                  </>
                </Box>

                <Box>
                  {tabValue === 0 && (
                    <PDFDownloadLink
                      document={<CVComponent data={localCvData} colors={COLOR_THEMES[themeId]} />}
                      fileName="cv.pdf"
                      style={{ textDecoration: "none" }}
                    >
                      {({ loading }: { loading: boolean }) => (
                        <Button
                          component="span"
                          variant="contained"
                          size="small"
                          startIcon={<FileDownloadIcon />}
                          sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, px: 2 }}
                          disabled={loading}
                        >
                          {loading ? "Preparing..." : "Download CV"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                  {tabValue === 1 && (
                    <PDFDownloadLink
                      document={
                        <CoverLetterComponent
                          content={localCvData.coverLetter}
                          data={localCvData}
                          colors={COLOR_THEMES[themeId]}
                        />
                      }
                      fileName="cover-letter.pdf"
                      style={{ textDecoration: "none" }}
                    >
                      {({ loading }: { loading: boolean }) => (
                        <Button
                          component="span"
                          variant="contained"
                          size="small"
                          startIcon={<FileDownloadIcon />}
                          sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" }, px: 2 }}
                          disabled={loading}
                        >
                          {loading ? "Preparing..." : "Download Letter"}
                        </Button>
                      )}
                    </PDFDownloadLink>
                  )}
                </Box>
              </Box>
            )}

            <Box
              sx={{
                flexGrow: 1,
                bgcolor: tabValue === 2 ? "transparent" : "#1e1e24",
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
              }}
            >
              {tabValue === 0 ? (
                <PDFViewer width="100%" height="100%" style={{ border: "none", borderRadius: 0 }}>
                  <CVComponent data={localCvData} colors={COLOR_THEMES[themeId]} />
                </PDFViewer>
              ) : tabValue === 1 ? (
                <PDFViewer width="100%" height="100%" style={{ border: "none", borderRadius: 0 }}>
                  <CoverLetterComponent
                    content={localCvData.coverLetter}
                    data={localCvData}
                    colors={COLOR_THEMES[themeId]}
                  />
                </PDFViewer>
              ) : (
                <JobDetailsTab
                  job={job}
                  profileId={profileId}
                  jobId={jobId}
                  onUpdate={(j) => setJob((prev) => (prev ? { ...prev, ...j } : j))}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
