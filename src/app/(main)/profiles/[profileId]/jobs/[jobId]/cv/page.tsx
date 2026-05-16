"use client";

import React, { useState, useEffect, use, useMemo } from "react";
import { 
  Box, Typography, Grid, Button,
  CircularProgress, Alert, Tabs, Tab, TextField, IconButton,
  Card
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CVData } from "@/lib/types";
import dynamic from "next/dynamic";
import { CVPdfDocument, CoverLetterPdfDocument } from "@/components/cv/CVPdfDocument";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then(mod => mod.PDFViewer),
  { ssr: false, loading: () => <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "800px", width: "100%", bgcolor: "#1e1e24" }}><CircularProgress sx={{ color: "#10b981" }} /></Box> }
);

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then(mod => mod.PDFDownloadLink),
  { ssr: false, loading: () => <Button variant="outlined" size="small" disabled>Loading...</Button> }
);



const JobDetailsTab = ({ job, profileId, jobId, onUpdate }: { job: JobWithProfile, profileId: string, jobId: string, onUpdate: (job: JobWithProfile) => void }) => {
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
        body: JSON.stringify({ role, company, jobDescription: description })
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
      <Typography variant="h5" sx={{ mb: 4, fontWeight: 600 }}>Edit Job Details</Typography>
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
        {saveSuccess && <Alert severity="success" sx={{ py: 0 }}>Saved successfully!</Alert>}
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

export default function JobCVPage({ params }: { params: Promise<{ profileId: string, jobId: string }> }) {
  const router = useRouter();
  const { profileId, jobId } = use(params);

  const [job, setJob] = useState<JobWithProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [chatInput, setChatInput] = useState("");
  const [localCvData, setLocalCvData] = useState<CVData | null>(null);

  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat",
    body: () => ({
      jobId,
      profileId,
      cvData: localCvData,
      jobDescription: job?.jobDescription
    })
  }), [jobId, profileId, localCvData, job?.jobDescription]);

  const { messages, sendMessage, status } = useChat({
    transport,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'updateCV') {
        const newCvData = toolCall.input as CVData;
        setLocalCvData(newCvData);
      }
      if (toolCall.toolName === 'updateCoverLetter') {
        const { content } = toolCall.input as { content: string };
        setLocalCvData(prev => prev ? ({ ...prev, coverLetter: content }) : null);
      }
    },
    messages: [
      { 
        id: "1", 
        role: "assistant", 
        parts: [{ type: "text", text: "Hi! I'm your AI CV assistant. I can help you tailor your CV and cover letter for this specific role. What would you like to change?" }] 
      }
    ] as UIMessage[]
  });

  const handleChatSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage({ text: chatInput });
    setChatInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await fetch(`/api/profiles/${profileId}/jobs/${jobId}`);
        const data = await res.json();
        if (data.success) {
          setJob(data.job);
          setLocalCvData(JSON.parse(data.job.tweakedCvJson || data.job.userProfile.parsedProfileJson));
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

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

  if (!localCvData || !job) return null;

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => router.push(`/profiles/${profileId}/jobs`)}
          sx={{
            color: "text.secondary",
            boxShadow: "none",
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
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "calc(100vh - 180px)", position: "sticky", top: 20 }}>
            {/* AI Chat Card */}
            <Card sx={{ flexGrow: 1, display: "flex", flexDirection: "column", bgcolor: "background.paper", borderRadius: 2, overflow: "hidden" }}>
              <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 1.5 }}>
                <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex" }}>
                  <SmartToyIcon />
                </Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>AI Assistant</Typography>
              </Box>

              <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
                {messages.map((msg) => (
                  <Box 
                    key={msg.id} 
                    sx={{ 
                      alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                      maxWidth: "85%",
                      bgcolor: msg.role === "user" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                      p: 1.5,
                      borderRadius: 2,
                    }}
                  >
                    {msg.parts.map((part, i) => (
                      part.type === "text" ? (
                        <Typography key={i} variant="body2">{part.text}</Typography>
                      ) : null
                    ))}
                  </Box>
                ))}
                {isLoading && (
                  <Box sx={{ alignSelf: "flex-start", p: 1 }}>
                    <CircularProgress size={20} sx={{ color: "#10b981" }} />
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <form onSubmit={handleChatSubmit}>
                  <TextField
                    fullWidth
                    placeholder="Ask AI to tailor your CV..."
                    variant="outlined"
                    size="small"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton type="submit" sx={{ color: "#10b981" }} disabled={isLoading || !chatInput.trim()}>
                            <SendIcon fontSize="small" />
                          </IconButton>
                        )
                      }
                    }}
                  />
                </form>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Right Column: Previews */}
        <Grid size={{ xs: 12, md: 9 }}>
          <Box sx={{ bgcolor: "background.paper", borderRadius: 2, overflow: "hidden", minHeight: "calc(100vh - 180px)" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ "& .MuiTab-root": { py: 2 } }}>
                <Tab icon={<DescriptionIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Curriculum Vitae" />
                <Tab icon={<EditIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Cover Letter" />
                <Tab icon={<WorkIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Job Details" />
              </Tabs>
              <Box sx={{ display: "flex", gap: 1 }}>
                <PDFDownloadLink document={<CVPdfDocument data={localCvData} />} fileName={`CV_${localCvData.name.replace(/\s+/g, '_')}.pdf`} style={{ textDecoration: 'none' }}>
                  {({ loading }: { loading: boolean }) => (
                    <Button component="span" variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#10b981" }} disabled={loading}>
                      {loading ? "Preparing CV..." : "Download CV"}
                    </Button>
                  )}
                </PDFDownloadLink>
                <PDFDownloadLink document={<CoverLetterPdfDocument content={localCvData.coverLetter} data={localCvData} />} fileName={`Cover_Letter_${localCvData.name.replace(/\s+/g, '_')}.pdf`} style={{ textDecoration: 'none' }}>
                  {({ loading }: { loading: boolean }) => (
                    <Button component="span" variant="outlined" size="small" startIcon={<FileDownloadIcon />} sx={{ color: "#10b981", borderColor: "#10b981" }} disabled={loading}>
                      {loading ? "Preparing Cover Letter..." : "Download Cover Letter"}
                    </Button>
                  )}
                </PDFDownloadLink>
              </Box>
            </Box>

            <Box sx={{ p: 4, bgcolor: tabValue === 2 ? "transparent" : "#1e1e24", display: "flex", justifyContent: "center", minHeight: "800px" }}>
              {tabValue === 0 ? (
                <PDFViewer width="100%" height="800px" style={{ border: "none", borderRadius: "8px" }}>
                  <CVPdfDocument data={localCvData} />
                </PDFViewer>
              ) : tabValue === 1 ? (
                <PDFViewer width="100%" height="800px" style={{ border: "none", borderRadius: "8px" }}>
                  <CoverLetterPdfDocument content={localCvData.coverLetter} data={localCvData} />
                </PDFViewer>
              ) : (
                <JobDetailsTab job={job} profileId={profileId} jobId={jobId} onUpdate={(j) => setJob(prev => prev ? { ...prev, ...j } : j)} />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
