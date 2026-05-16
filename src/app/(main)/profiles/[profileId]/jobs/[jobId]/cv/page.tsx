"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Box, Typography, Grid, Paper, Button, Divider, 
  CircularProgress, Alert, Tabs, Tab, TextField, IconButton,
  Card, CardContent
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import WorkIcon from "@mui/icons-material/Work";
import DescriptionIcon from "@mui/icons-material/Description";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SchoolIcon from "@mui/icons-material/School";
import BadgeIcon from "@mui/icons-material/Badge";
import { useRouter } from "next/navigation";
import { useChat } from "ai/react";
import { CVData } from "@/lib/types";

/* --------- Components --------- */

const CVDisplay = ({ data }: { data: CVData }) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: "100%", 
        minHeight: "1000px", 
        bgcolor: "#ffffff", 
        color: "#000000",
        p: 6,
        borderRadius: 1,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#111" }}>{data.name}</Typography>
      <Typography variant="h6" sx={{ color: "#444", mb: 2 }}>{data.title}</Typography>
      
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap", fontSize: "0.85rem", color: "#555" }}>
        {data.email && <Typography variant="body2">{data.email}</Typography>}
        {data.phone && <Typography variant="body2">{data.phone}</Typography>}
        {data.location && <Typography variant="body2">{data.location}</Typography>}
        {data.linkedin && <Typography variant="body2">{data.linkedin}</Typography>}
      </Box>

      <Divider sx={{ mb: 3, borderColor: "#eee" }} />
      
      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mb: 1.5, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
        Professional Summary
      </Typography>
      <Typography variant="body2" sx={{ mb: 4, color: "#333", lineHeight: 1.7 }}>
        {data.summary}
      </Typography>

      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
        Work Experience
      </Typography>
      {data.experience?.map((exp, idx) => (
        <Box key={idx} sx={{ mb: 3.5 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", mb: 0.5 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222" }}>{exp.role}</Typography>
            <Typography variant="body2" sx={{ color: "#666", fontWeight: 600 }}>{exp.dates}</Typography>
          </Box>
          <Typography variant="body2" sx={{ color: "#444", fontWeight: 700, mb: 1.5 }}>{exp.company}</Typography>
          <Typography component="ul" sx={{ m: 0, pl: 2.5, color: "#333", "& li": { mb: 1, lineHeight: 1.6, fontSize: "0.88rem" } }}>
            {exp.bulletPoints?.map((bp, bidx) => (
              <li key={bidx}>{bp}</li>
            ))}
          </Typography>
        </Box>
      ))}

      <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
        Skills & Expertise
      </Typography>
      <Grid container spacing={2} sx={{ mb: 4 }}>
        {data.skills?.map((skill, idx) => (
          <Grid size={{ xs: 6 }} key={idx}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "#333", mb: 0.5 }}>{skill.name}</Typography>
            <Typography variant="body2" sx={{ color: "#555", fontSize: "0.85rem" }}>{skill.items}</Typography>
          </Grid>
        ))}
      </Grid>

      {data.education && data.education.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
            Education
          </Typography>
          {data.education.map((edu, idx) => (
            <Box key={idx} sx={{ mb: 2.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#222" }}>{edu.degree}</Typography>
              <Typography variant="body2" sx={{ color: "#444", fontWeight: 500 }}>{edu.institution} | {edu.location}</Typography>
              {edu.details && <Typography variant="body2" sx={{ color: "#666", mt: 0.5, fontSize: "0.85rem" }}>{edu.details}</Typography>}
            </Box>
          ))}
        </>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mt: 2, mb: 2, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
            Certifications
          </Typography>
          <Box component="ul" sx={{ m: 0, pl: 2.5, color: "#333", "& li": { mb: 0.8, fontSize: "0.88rem" } }}>
            {data.certifications.map((cert, idx) => (
              <li key={idx}>
                <Box component="span" sx={{ fontWeight: 700 }}>{cert.name}</Box> — {cert.date}
              </li>
            ))}
          </Box>
        </>
      )}

      {data.other && (
        <>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#111", mt: 4, mb: 1.5, textTransform: "uppercase", letterSpacing: 1.2, borderLeft: "4px solid #10b981", pl: 1.5 }}>
            {data.other.label}
          </Typography>
          <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.6 }}>
            {data.other.value}
          </Typography>
        </>
      )}
    </Paper>
  );
};

const CoverLetterDisplay = ({ content, name }: { content?: string, name: string }) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: "100%", 
        minHeight: "1000px", 
        bgcolor: "#ffffff", 
        color: "#000000",
        p: 8,
        borderRadius: 1,
        fontFamily: "'Inter', sans-serif"
      }}
    >
      <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "#333", lineHeight: 1.9, fontSize: "0.95rem" }}>
        {content || `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${name}`}
      </Typography>
    </Paper>
  );
};

/* --------- Main Page --------- */

export default function JobCVPage({ params }: { params: Promise<{ profileId: string, jobId: string }> }) {
  const router = useRouter();
  const { profileId, jobId } = use(params);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabValue, setTabValue] = useState(0);
  
  const [localCvData, setLocalCvData] = useState<CVData | null>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
    body: {
      jobId,
      profileId,
      cvData: localCvData,
      jobDescription: job?.jobDescription
    },
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === 'updateCV') {
        const newCvData = toolCall.args as CVData;
        setLocalCvData(newCvData);
        return "CV updated successfully!";
      }
      if (toolCall.toolName === 'updateCoverLetter') {
        const { content } = toolCall.args as { content: string };
        setLocalCvData(prev => prev ? ({ ...prev, coverLetter: content }) : null);
        return "Cover letter updated successfully!";
      }
    },
    initialMessages: [
      { id: "1", role: "assistant", content: "Hi! I'm your AI CV assistant. I can help you tailor your CV and cover letter for this specific role. What would you like to change?" }
    ]
  });

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
      } catch (err) {
        setError("An error occurred");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [profileId, jobId]);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Box sx={{ p: 4 }}><Alert severity="error">{error}</Alert></Box>;

  if (!localCvData) return null;

  return (
    <Box sx={{ pb: 8 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 3, gap: 2 }}>
        <Button startIcon={<ArrowBackIcon />} onClick={() => router.push(`/profiles/${profileId}/jobs`)} sx={{ color: "text.secondary" }}>
          Back to Applications
        </Button>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>
          Tailoring CV for {job.role} @ {job.company}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        {/* Left Column: Job Details & AI Chat */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "calc(100vh - 180px)", position: "sticky", top: 20 }}>
            {/* Job Details Card */}
            <Card sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
              <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                  <WorkIcon sx={{ color: "#10b981" }} />
                  <Typography variant="h6" sx={{ fontWeight: 600 }}>Job Details</Typography>
                </Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Role</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>{job.role}</Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Company</Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 2 }}>{job.company}</Typography>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>Description</Typography>
                <Box sx={{ 
                  maxHeight: "200px", 
                  overflowY: "auto", 
                  bgcolor: "rgba(255,255,255,0.03)", 
                  p: 1.5, 
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  color: "text.secondary",
                  whiteSpace: "pre-wrap"
                }}>
                  {job.jobDescription || "No description provided."}
                </Box>
              </CardContent>
            </Card>

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
                    <Typography variant="body2">{msg.content}</Typography>
                  </Box>
                ))}
                {isLoading && (
                  <Box sx={{ alignSelf: "flex-start", p: 1 }}>
                    <CircularProgress size={20} sx={{ color: "#10b981" }} />
                  </Box>
                )}
              </Box>

              <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                <form onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    placeholder="Ask AI to tailor your CV..."
                    variant="outlined"
                    size="small"
                    value={input}
                    onChange={handleInputChange}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <IconButton type="submit" sx={{ color: "#10b981" }} disabled={isLoading || !input.trim()}>
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
        <Grid size={{ xs: 12, md: 8 }}>
          <Box sx={{ bgcolor: "background.paper", borderRadius: 2, overflow: "hidden" }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider", px: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)} sx={{ "& .MuiTab-root": { py: 2 } }}>
                <Tab icon={<DescriptionIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Curriculum Vitae" />
                <Tab icon={<EditIcon sx={{ fontSize: "1.1rem" }} />} iconPosition="start" label="Cover Letter" />
              </Tabs>
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button variant="contained" size="small" startIcon={<FileDownloadIcon />} sx={{ bgcolor: "#10b981" }}>
                  Export PDF
                </Button>
              </Box>
            </Box>

            <Box sx={{ p: 4, bgcolor: "#1e1e24", display: "flex", justifyContent: "center", minHeight: "800px" }}>
              {tabValue === 0 ? (
                <CVDisplay data={localCvData} />
              ) : (
                <CoverLetterDisplay content={localCvData.coverLetter} name={localCvData.name} />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
