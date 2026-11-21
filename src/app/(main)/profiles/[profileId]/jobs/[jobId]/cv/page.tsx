"use client";

import React, { useState, useEffect, use, useCallback, useMemo, useRef } from "react";
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
  Chip,
  Tooltip,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import InsightsIcon from "@mui/icons-material/Insights";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import UndoIcon from "@mui/icons-material/Undo";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloudOffIcon from "@mui/icons-material/CloudOff";
import { useRouter } from "next/navigation";
import { AIChatAssistant, type ChatPromptRequest } from "./_components/AIChatAssistant";
import { CoverLetterEditor } from "./_components/CoverLetterEditor";
import { TailoringPanel } from "./_components/TailoringPanel";
import CVWizard, { type WizardData } from "@/components/cv/CVWizard";
import { CVData } from "@/lib/types";
import { parseCv } from "@/lib/cv/mutations";
import { computeAtsMatch } from "@/lib/cv/ats";
import { buildPdfFileName } from "@/lib/cv/filename";
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

const MAX_HISTORY = 30;
const AUTOSAVE_DELAY_MS = 800;

type SaveStatus = "saved" | "unsaved" | "saving" | "error";

const PDFViewer = dynamic(() => import("@react-pdf/renderer").then((mod) => mod.PDFViewer), {
  ssr: false,
  loading: () => (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100%",
        minHeight: 400,
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

/* --------- Job Details Tab --------- */

const JobDetailsTab = ({
  job,
  profileId,
  jobId,
  onUpdate,
}: {
  job: JobWithProfile;
  profileId: string;
  jobId: string;
  onUpdate: (job: Partial<JobWithProfile>) => void;
}) => {
  const [role, setRole] = useState(job.role);
  const [company, setCompany] = useState(job.company);
  const [description, setDescription] = useState(job.jobDescription || "");
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role, company, jobDescription: description }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data.success) {
        setSaveSuccess(true);
        // Only take the fields edited here; the response may not include the CV/profile.
        onUpdate({ role, company, jobDescription: description });
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(data.error || "Failed to save job details");
      }
    } catch {
      setSaveError("Network error — job details not saved");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, width: "100%", maxWidth: "1000px", color: "text.primary" }}>
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
        {saveError && (
          <Alert severity="error" sx={{ py: 0 }}>
            {saveError}
          </Alert>
        )}
      </Box>
    </Box>
  );
};

/* --------- Save Status --------- */

const SaveStatusChip = ({ status, onRetry }: { status: SaveStatus; onRetry: () => void }) => {
  const config = {
    saved: { label: "Saved", icon: <CloudDoneIcon />, color: "success" as const },
    unsaved: { label: "Unsaved changes", icon: <CloudUploadIcon />, color: "default" as const },
    saving: { label: "Saving…", icon: <CircularProgress size={12} />, color: "default" as const },
    error: { label: "Save failed — retry", icon: <CloudOffIcon />, color: "error" as const },
  }[status];
  return (
    <Chip
      size="small"
      variant="outlined"
      icon={config.icon}
      label={config.label}
      color={config.color}
      onClick={status === "error" ? onRetry : undefined}
      aria-live="polite"
      sx={{ fontSize: "0.7rem" }}
    />
  );
};

/* --------- Main Page --------- */

interface JobWithProfile {
  role: string;
  company: string;
  jobDescription?: string | null;
  tweakedCvJson?: string | null;
  userProfile: {
    parsedProfileJson: string | null;
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
  const [localCvData, setLocalCvData] = useState<CVData | null>(null);
  const [history, setHistory] = useState<{ cv: CVData; label: string }[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [aiBusy, setAiBusy] = useState(false);
  const [promptRequest, setPromptRequest] = useState<ChatPromptRequest | null>(null);

  // Refs so async save logic always sees the latest state.
  const cvRef = useRef<CVData | null>(null);
  const editVersion = useRef(0);
  const savedVersion = useRef(0);
  const saveChain = useRef<Promise<void>>(Promise.resolve());
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const templateId: TemplateId =
    localCvData?.templateId && localCvData.templateId in TEMPLATES
      ? (localCvData.templateId as TemplateId)
      : "modern";
  const themeId: ThemeId =
    localCvData?.themeId && localCvData.themeId in COLOR_THEMES
      ? localCvData.themeId
      : DEFAULT_THEME;

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`);
        const data = await res.json().catch(() => ({}));
        if (res.ok && data.success) {
          const cv =
            parseCv(data.job.tweakedCvJson) ?? parseCv(data.job.userProfile?.parsedProfileJson);
          if (!cv) {
            setError("This job's CV data is missing or corrupted.");
            return;
          }
          setJob(data.job);
          cvRef.current = cv;
          setLocalCvData(cv);
        } else {
          setError(data.error || "Failed to fetch job details");
        }
      } catch {
        setError("An error occurred while loading this job.");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [profileId, jobId]);

  /* --------- Autosave --------- */

  const save = useCallback(() => {
    if (saveTimer.current) {
      clearTimeout(saveTimer.current);
      saveTimer.current = null;
    }
    // Queue behind any in-flight save so writes land in order.
    saveChain.current = saveChain.current.then(async () => {
      const version = editVersion.current;
      if (version === savedVersion.current || !cvRef.current) return;
      setSaveStatus("saving");
      try {
        const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tweakedCvJson: JSON.stringify(cvRef.current) }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        savedVersion.current = Math.max(savedVersion.current, version);
        setSaveStatus(editVersion.current === savedVersion.current ? "saved" : "unsaved");
      } catch (e) {
        console.error("Autosave failed:", e);
        setSaveStatus("error");
      }
    });
    return saveChain.current;
  }, [profileId, jobId]);

  const scheduleSave = useCallback(() => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(save, AUTOSAVE_DELAY_MS);
  }, [save]);

  /** Applies a change, records it for undo, and (unless already persisted) autosaves it. */
  const commit = useCallback(
    (next: CVData, label: string, { persisted = false } = {}) => {
      const prev = cvRef.current;
      if (prev) setHistory((h) => [...h.slice(-(MAX_HISTORY - 1)), { cv: prev, label }]);
      cvRef.current = next;
      setLocalCvData(next);
      if (persisted) {
        // Server already saved this; anything still pending would now be stale.
        if (saveTimer.current) clearTimeout(saveTimer.current);
        saveTimer.current = null;
        savedVersion.current = ++editVersion.current;
        setSaveStatus("saved");
      } else {
        editVersion.current++;
        setSaveStatus("unsaved");
        scheduleSave();
      }
    },
    [scheduleSave],
  );

  const undo = useCallback(() => {
    const last = history[history.length - 1];
    if (!last) return;
    setHistory(history.slice(0, -1));
    cvRef.current = last.cv;
    setLocalCvData(last.cv);
    editVersion.current++;
    setSaveStatus("unsaved");
    scheduleSave();
  }, [history, scheduleSave]);

  const handleAiCvUpdate = useCallback(
    (cv: CVData, label: string) => commit(cv, `AI: ${label}`, { persisted: true }),
    [commit],
  );

  // Make sure the server sees our latest edits before the AI reads the CV.
  const flushSave = useCallback(async () => {
    await save();
  }, [save]);

  const askAi = useCallback((text: string) => setPromptRequest({ text, nonce: Date.now() }), []);

  // Warn before leaving with unsaved edits; flush on unmount.
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (editVersion.current !== savedVersion.current) {
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => {
      window.removeEventListener("beforeunload", handler);
      // Reading the latest ref values at unmount is intended here.
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (editVersion.current !== savedVersion.current) void save();
    };
  }, [save]);

  // Ctrl/Cmd+Z outside text fields undoes the last CV change.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest("input, textarea, [contenteditable=true]")) return;
      if ((e.metaKey || e.ctrlKey) && !e.shiftKey && e.key.toLowerCase() === "z" && !aiBusy) {
        e.preventDefault();
        undo();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [undo, aiBusy]);

  const ats = useMemo(
    () =>
      localCvData && job?.jobDescription?.trim()
        ? computeAtsMatch(localCvData, job.jobDescription)
        : null,
    [localCvData, job?.jobDescription],
  );

  const onCoverLetterChange = useCallback(
    (text: string) =>
      cvRef.current && commit({ ...cvRef.current, coverLetter: text }, "Cover letter edit"),
    [commit],
  );

  const wizardData = useMemo(() => localCvData as WizardData | null, [localCvData]);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ p: 4 }}>
        <Alert
          severity="error"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => router.push(`/profiles/${profileId}/jobs`)}
            >
              Back
            </Button>
          }
        >
          {error}
        </Alert>
      </Box>
    );

  if (!localCvData || !job) return null;

  const CVComponent = TEMPLATES[templateId].cv;
  const CoverLetterComponent = TEMPLATES[templateId].coverLetter;
  const colors = COLOR_THEMES[themeId];
  const cvFileName = buildPdfFileName([localCvData.name, job.company, job.role], "CV");
  const letterFileName = buildPdfFileName(
    [localCvData.name, job.company, job.role],
    "Cover_Letter",
  );
  const lastChange = history[history.length - 1];
  const showToolbar = tabValue === 0 || tabValue === 1;

  const cvDocument = <CVComponent data={localCvData} colors={colors} />;
  const letterDocument = (
    <CoverLetterComponent content={localCvData.coverLetter} data={localCvData} colors={colors} />
  );

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column", minHeight: 0 }}>
      {/* Top bar */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          flexWrap: "wrap",
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
        <Typography variant="body2" noWrap sx={{ fontWeight: 600, flexGrow: 1, minWidth: 0 }}>
          {job.role}
          <Box component="span" sx={{ color: "text.secondary", fontWeight: 400 }}>
            {" "}
            at {job.company}
          </Box>
        </Typography>
        {ats && (
          <Tooltip title="ATS keyword match — see the Tailoring tab">
            <Chip
              size="small"
              label={`ATS ${ats.score}%`}
              color={ats.score >= 70 ? "success" : ats.score >= 40 ? "warning" : "error"}
              variant="outlined"
              onClick={() => setTabValue(2)}
              sx={{ fontSize: "0.7rem" }}
            />
          </Tooltip>
        )}
        <SaveStatusChip status={saveStatus} onRetry={() => void save()} />
        <Tooltip title={lastChange ? `Undo: ${lastChange.label} (Ctrl/Cmd+Z)` : "Nothing to undo"}>
          <span>
            <IconButton
              size="small"
              aria-label="Undo"
              onClick={undo}
              disabled={!lastChange || aiBusy}
            >
              <UndoIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Reset to base profile CV (undoable)">
          <span>
            <IconButton
              size="small"
              aria-label="Reset to base profile"
              disabled={aiBusy}
              onClick={() => {
                const base = parseCv(job.userProfile.parsedProfileJson);
                if (
                  base &&
                  window.confirm(
                    "Replace this tailored CV with your base profile? You can undo this.",
                  )
                ) {
                  commit(base, "Reset to base profile");
                }
              }}
            >
              <RestartAltIcon fontSize="small" />
            </IconButton>
          </span>
        </Tooltip>
      </Box>

      <Grid container sx={{ flexGrow: 1, minHeight: 0, overflow: { xs: "auto", md: "hidden" } }}>
        {/* Left Column: AI Chat */}
        <Grid
          size={{ xs: 12, md: 4, lg: 3 }}
          sx={{
            height: { xs: 520, md: "100%" },
            borderRight: { md: 1 },
            borderBottom: { xs: 1, md: 0 },
            borderColor: "divider",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <AIChatAssistant
            jobId={jobId}
            profileId={profileId}
            onCvUpdate={handleAiCvUpdate}
            beforeSend={flushSave}
            onBusyChange={setAiBusy}
            promptRequest={promptRequest}
            missingKeywords={ats?.missing}
          />
        </Grid>

        {/* Right Column: Previews & editors */}
        <Grid size={{ xs: 12, md: 8, lg: 9 }} sx={{ height: { xs: "85vh", md: "100%" } }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              bgcolor: "background.paper",
            }}
          >
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, minHeight: 40 }}>
              <Tabs
                value={tabValue}
                onChange={(_, v) => setTabValue(v)}
                variant="scrollable"
                scrollButtons="auto"
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
                  icon={<InsightsIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="Tailoring"
                />
                <Tab
                  icon={<EditNoteIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="Edit CV"
                />
                <Tab
                  icon={<WorkIcon sx={{ fontSize: "1rem" }} />}
                  iconPosition="start"
                  label="Job Details"
                />
              </Tabs>
            </Box>

            {showToolbar && (
              <Box
                sx={{
                  px: 2.5,
                  py: 1,
                  borderBottom: 1,
                  borderColor: "divider",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 1.5,
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    TEMPLATE
                  </Typography>
                  <FormControl size="small" sx={{ minWidth: 180 }}>
                    <Select
                      value={templateId}
                      disabled={aiBusy}
                      inputProps={{ "aria-label": "Template" }}
                      onChange={(e) =>
                        commit(
                          { ...localCvData, templateId: e.target.value as TemplateId },
                          "Template change",
                        )
                      }
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

                  <Box sx={{ width: "1px", height: 20, bgcolor: "divider", mx: 1 }} />
                  <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700 }}>
                    COLOR
                  </Typography>
                  <Box
                    role="radiogroup"
                    aria-label="Color theme"
                    sx={{ display: "flex", alignItems: "center", gap: 0.75 }}
                  >
                    {Object.entries(COLOR_THEMES).map(([id, palette]) => {
                      const name = id.charAt(0).toUpperCase() + id.slice(1);
                      return (
                        <Box
                          key={id}
                          component="button"
                          type="button"
                          role="radio"
                          aria-checked={themeId === id}
                          aria-label={name}
                          title={name}
                          disabled={aiBusy}
                          onClick={() => commit({ ...localCvData, themeId: id }, "Color change")}
                          sx={{
                            p: 0,
                            width: 20,
                            height: 20,
                            borderRadius: "50%",
                            bgcolor: palette.primary,
                            cursor: "pointer",
                            border: themeId === id ? "2px solid white" : "2px solid transparent",
                            boxShadow: themeId === id ? `0 0 0 2px ${palette.primary}` : "none",
                            transition: "all 0.15s",
                            "&:hover": { transform: "scale(1.15)" },
                            "&:disabled": { cursor: "not-allowed", opacity: 0.5 },
                          }}
                        />
                      );
                    })}
                  </Box>
                </Box>

                <PDFDownloadLink
                  document={tabValue === 0 ? cvDocument : letterDocument}
                  fileName={tabValue === 0 ? cvFileName : letterFileName}
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
                      {loading
                        ? "Preparing..."
                        : tabValue === 0
                          ? "Download CV"
                          : "Download Letter"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </Box>
            )}

            <Box
              sx={{
                flexGrow: 1,
                minHeight: 0,
                bgcolor: showToolbar ? "#1e1e24" : "transparent",
                display: "flex",
                justifyContent: "center",
                overflow: "auto",
              }}
            >
              {tabValue === 0 && (
                <PDFViewer width="100%" height="100%" style={{ border: "none", borderRadius: 0 }}>
                  {cvDocument}
                </PDFViewer>
              )}
              {tabValue === 1 && (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: { xs: "column", lg: "row" },
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Box
                    sx={{
                      width: { xs: "100%", lg: "40%" },
                      bgcolor: "background.paper",
                      borderRight: { lg: 1 },
                      borderColor: "divider",
                      overflow: "auto",
                    }}
                  >
                    <CoverLetterEditor
                      value={localCvData.coverLetter || ""}
                      onChange={onCoverLetterChange}
                      disabled={aiBusy}
                      onGenerate={() =>
                        askAi(
                          localCvData.coverLetter
                            ? "Improve my cover letter so it is more specific to this job description while keeping it concise."
                            : "Write a concise, tailored cover letter for this role based on my CV and the job description.",
                        )
                      }
                    />
                  </Box>
                  <Box sx={{ flexGrow: 1, minHeight: 500 }}>
                    <PDFViewer
                      width="100%"
                      height="100%"
                      style={{ border: "none", borderRadius: 0 }}
                    >
                      {letterDocument}
                    </PDFViewer>
                  </Box>
                </Box>
              )}
              {tabValue === 2 && (
                <TailoringPanel
                  cv={localCvData}
                  ats={ats}
                  disabled={aiBusy}
                  onAskAi={askAi}
                  onChange={(cv) => commit(cv, "Section layout change")}
                />
              )}
              {tabValue === 3 && wizardData && (
                <Box sx={{ width: "100%", p: { xs: 1, md: 2 } }}>
                  {aiBusy && (
                    <Alert severity="info" sx={{ mb: 2 }}>
                      The AI is editing your CV — wait for it to finish before saving here.
                    </Alert>
                  )}
                  <CVWizard
                    initialData={wizardData}
                    title="Edit tailored CV"
                    saving={saveStatus === "saving"}
                    onSave={async (data) => {
                      if (aiBusy) return;
                      const { profileName: _n, profileDescription: _d, ...rest } = data;
                      const cv = parseCv(rest);
                      if (cv) commit(cv, "Manual edit");
                    }}
                  />
                </Box>
              )}
              {tabValue === 4 && (
                <JobDetailsTab
                  job={job}
                  profileId={profileId}
                  jobId={jobId}
                  onUpdate={(j) => setJob((prev) => (prev ? { ...prev, ...j } : prev))}
                />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
