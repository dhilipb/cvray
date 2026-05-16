"use client";

import React, { useState, useEffect, use, useMemo } from "react";
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
  IconButton,
  Card,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRouter } from "next/navigation";
import { AIChatAssistant } from "./_components/AIChatAssistant";
import { CVData } from "@/lib/types";
import dynamic from "next/dynamic";
import {
  ClassicCV, ClassicCoverLetter,
  ModernCV, ModernCoverLetter,
  MinimalistCV, MinimalistCoverLetter,
  ProfessionalCV, ProfessionalCoverLetter,
  CreativeCV, CreativeCoverLetter,
} from "@/components/cv/templates";
import StyleIcon from "@mui/icons-material/Style";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CropFreeIcon from "@mui/icons-material/CropFree";
import BusinessCenterIcon from "@mui/icons-material/BusinessCenter";
import ColorLensIcon from "@mui/icons-material/ColorLens";

const TEMPLATES = {
  classic: { id: "classic", name: "Classic", cv: ClassicCV, coverLetter: ClassicCoverLetter, icon: HistoryEduIcon },
  modern: { id: "modern", name: "Modern", cv: ModernCV, coverLetter: ModernCoverLetter, icon: AutoAwesomeIcon },
  minimalist: { id: "minimalist", name: "Minimalist", cv: MinimalistCV, coverLetter: MinimalistCoverLetter, icon: CropFreeIcon },
  professional: { id: "professional", name: "Professional", cv: ProfessionalCV, coverLetter: ProfessionalCoverLetter, icon: BusinessCenterIcon },
  creative: { id: "creative", name: "Creative", cv: CreativeCV, coverLetter: CreativeCoverLetter, icon: ColorLensIcon },
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
  const [templateId, setTemplateId] = useState<TemplateId>("classic");

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
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/profiles/${profileId}/jobs`)}
          size="small"
          sx={{
            color: "text.secondary",
            boxShadow: "none",
            py: 0.5,
            px: 1,
            "&:hover": {
              boxShadow: "none",
              color: "text.primary",
            },
          }}
        >
          Back to Applications
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: AI Chat */}
        <Grid size={{ xs: 12, md: 3 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 3,
              height: "calc(100vh - 180px)",
              position: "sticky",
              top: 20,
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
        <Grid size={{ xs: 12, md: 9 }}>
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 2,
              overflow: "hidden",
              minHeight: "calc(100vh - 180px)",
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
              }}
            >
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                sx={{ "& .MuiTab-root": { py: 2 } }}
              >
                <Tab
                  icon={<DescriptionIcon sx={{ fontSize: "1.1rem" }} />}
                  iconPosition="start"
                  label="Curriculum Vitae"
                />
                <Tab
                  icon={<EditIcon sx={{ fontSize: "1.1rem" }} />}
                  iconPosition="start"
                  label="Cover Letter"
                />
                <Tab
                  icon={<StyleIcon sx={{ fontSize: "1.1rem" }} />}
                  iconPosition="start"
                  label="Templates"
                />
                <Tab
                  icon={<WorkIcon sx={{ fontSize: "1.1rem" }} />}
                  iconPosition="start"
                  label="Job Details"
                />
              </Tabs>
              <Box sx={{ display: "flex", gap: 1 }}>
                {tabValue === 0 && (
                  <PDFDownloadLink
                    document={<CVComponent data={localCvData} />}
                    fileName="cv.pdf"
                    style={{ textDecoration: "none" }}
                  >
                    {({ loading }: { loading: boolean }) => (
                      <Button
                        component="span"
                        variant="contained"
                        size="small"
                        startIcon={<FileDownloadIcon />}
                        sx={{ bgcolor: "#10b981" }}
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
                        sx={{ bgcolor: "#10b981" }}
                        disabled={loading}
                      >
                        {loading ? "Preparing..." : "Download Letter"}
                      </Button>
                    )}
                  </PDFDownloadLink>
                )}
              </Box>
            </Box>

            <Box
              sx={{
                p: 4,
                bgcolor: tabValue === 2 || tabValue === 3 ? "transparent" : "#1e1e24",
                display: "flex",
                justifyContent: "center",
                minHeight: "800px",
              }}
            >
              {tabValue === 0 ? (
                <PDFViewer
                  width="100%"
                  height="800px"
                  style={{ border: "none", borderRadius: "8px" }}
                >
                  <CVComponent data={localCvData} />
                </PDFViewer>
              ) : tabValue === 1 ? (
                <PDFViewer
                  width="100%"
                  height="800px"
                  style={{ border: "none", borderRadius: "8px" }}
                >
                  <CoverLetterComponent content={localCvData.coverLetter} data={localCvData} />
                </PDFViewer>
              ) : tabValue === 2 ? (
                <Box sx={{ width: "100%", maxWidth: "1000px", color: "text.primary" }}>
                  <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>
                    Select a Template
                  </Typography>
                  <Grid container spacing={3}>
                    {Object.values(TEMPLATES).map((tmpl) => (
                      <Grid size={{ xs: 12, sm: 6, md: 4 }} key={tmpl.id}>
                        <Card
                          onClick={() => setTemplateId(tmpl.id as TemplateId)}
                          sx={{
                            p: 4,
                            cursor: "pointer",
                            textAlign: "center",
                            bgcolor: templateId === tmpl.id ? "rgba(16,185,129,0.1)" : "background.paper",
                            border: "2px solid",
                            borderColor: templateId === tmpl.id ? "#10b981" : "transparent",
                            transition: "all 0.2s ease-in-out",
                            "&:hover": {
                              borderColor: templateId === tmpl.id ? "#10b981" : "rgba(255,255,255,0.1)",
                              transform: "translateY(-4px)",
                            },
                          }}
                        >
                          <tmpl.icon sx={{ fontSize: 48, color: templateId === tmpl.id ? "#10b981" : "text.secondary", mb: 2 }} />
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>{tmpl.name}</Typography>
                        </Card>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
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
