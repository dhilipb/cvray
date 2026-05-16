"use client";

import React, { useState, useEffect, use, useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CVData } from "@/lib/types";

/* --------- Components --------- */

const DocumentHeader = ({ data }: { data: CVData }) => (
  <Box sx={{ mb: 4 }}>
    <Typography variant="h3" sx={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontWeight: 700, color: "#1a1a2e", mb: 0.5, letterSpacing: "-0.5px" }}>
      {data.name}
    </Typography>
    <Typography variant="h6" sx={{ color: "#2f5597", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", mb: 1, fontSize: "1.1rem" }}>
      {data.title}
    </Typography>
    
    <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", fontSize: "0.85rem", color: "#666", mb: 1.5 }}>
      {data.email && <Box component="span" sx={{ mr: 1.5 }}>{data.email}</Box>}
      {data.email && data.phone && <Box component="span" sx={{ mr: 1.5, color: "#ccc" }}>•</Box>}
      {data.phone && <Box component="span" sx={{ mr: 1.5 }}>{data.phone}</Box>}
      {data.phone && data.location && <Box component="span" sx={{ mr: 1.5, color: "#ccc" }}>•</Box>}
      {data.location && <Box component="span" sx={{ mr: 1.5 }}>{data.location}</Box>}
      {data.location && data.linkedin && <Box component="span" sx={{ mr: 1.5, color: "#ccc" }}>•</Box>}
      {data.linkedin && <Box component="span" sx={{ textDecoration: "underline" }}>{data.linkedin}</Box>}
    </Box>

    <Divider sx={{ borderWidth: 1.5, borderColor: "#2f5597" }} />
  </Box>
);

const CVDisplay = ({ data }: { data: CVData }) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: "100%", 
        maxWidth: "210mm",
        minHeight: "297mm", 
        bgcolor: "#ffffff", 
        color: "#000000",
        p: { xs: 4, md: "20mm" },
        borderRadius: 0,
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        // Page break indicators
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(to bottom, transparent 296.5mm, #e5e7eb 296.5mm, #e5e7eb 297mm, transparent 297mm)`,
          backgroundSize: "100% 297mm",
          zIndex: 10
        }
      }}
    >
      {/* Page Break Label Overlay */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 11 }}>
        {[1, 2, 3, 4].map((page) => (
          <Box 
            key={page} 
            sx={{ 
              position: "absolute", 
              top: `${page * 297}mm`, 
              right: "10mm", 
              transform: "translateY(-100%)",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 500, bgcolor: "white", px: 1 }}>
              PAGE {page} END
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ position: "relative", zIndex: 1 }}>
        <DocumentHeader data={data} />

        {data.summary && (
          <Box sx={{ borderLeft: "3px solid #2f5597", pl: 2, mb: 4 }}>
            <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.6, fontSize: "0.9rem" }}>
              {data.summary}
            </Typography>
          </Box>
        )}

        {data.skills && data.skills.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2f5597", mb: 1.5, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.95rem" }}>
              CORE COMPETENCIES
            </Typography>
            <Box sx={{ borderTop: "1px solid #eee", borderBottom: "1px solid #eee" }}>
              {data.skills.map((skill, idx) => (
                <Box key={idx} sx={{ display: "flex", py: 1.5, borderBottom: idx === data.skills!.length - 1 ? "none" : "1px solid #eee" }}>
                  <Box sx={{ width: "25%", pr: 2 }}>
                    <Typography variant="body2" sx={{ fontWeight: 700, color: "#2f5597", fontSize: "0.85rem" }}>{skill.name}</Typography>
                  </Box>
                  <Box sx={{ width: "75%" }}>
                    <Typography variant="body2" sx={{ color: "#444", fontSize: "0.85rem", lineHeight: 1.5 }}>{skill.items}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {data.experience && data.experience.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2f5597", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.95rem" }}>
              PROFESSIONAL EXPERIENCE
            </Typography>
            {data.experience.map((exp, idx) => (
              <Box key={idx} sx={{ mb: 3.5, position: "relative" }}>
                {exp.break && (
                  <Box sx={{ 
                    my: 4, 
                    borderTop: "2px dashed #2f5597", 
                    position: "relative",
                    "&::after": {
                      content: '"Manual Page Break"',
                      position: "absolute",
                      top: -10,
                      left: "50%",
                      transform: "translateX(-50%)",
                      bgcolor: "white",
                      px: 2,
                      color: "#2f5597",
                      fontSize: "10px",
                      fontWeight: 700,
                      textTransform: "uppercase"
                    }
                  }} />
                )}
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#222", fontSize: "1rem" }}>{exp.role}</Typography>
                  <Typography variant="body2" sx={{ color: "#888", fontSize: "0.85rem", whiteSpace: "nowrap", ml: 2 }}>{exp.dates}</Typography>
                </Box>
                <Typography variant="body2" sx={{ mb: 1.5, fontSize: "0.9rem" }}>
                  <Box component="span" sx={{ color: "#666", fontWeight: 600 }}>{exp.company}</Box>
                </Typography>
                <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none", color: "#333", "& li": { mb: 0.8, display: "flex", alignItems: "flex-start", fontSize: "0.88rem", lineHeight: 1.5 } }}>
                  {exp.bulletPoints?.map((bp, bidx) => (
                    <Box component="li" key={bidx}>
                      <Box component="span" sx={{ color: "#2f5597", mr: 1, fontWeight: "bold", fontSize: "1.1rem", lineHeight: 1 }}>›</Box>
                      <Box component="span" dangerouslySetInnerHTML={{ __html: bp.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        {data.education && data.education.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2f5597", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.95rem" }}>
              EDUCATION
            </Typography>
            {data.education.map((edu, idx) => (
              <Box key={idx} sx={{ mb: 2 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 0.5 }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "#222", fontSize: "0.95rem" }}>{edu.degree}</Typography>
                </Box>
                <Typography variant="body2" sx={{ color: "#555", fontWeight: 600, fontSize: "0.85rem" }}>{edu.institution}{edu.location ? ` | ${edu.location}` : ""}</Typography>
                {edu.details && <Typography variant="body2" sx={{ color: "#666", mt: 0.5, fontSize: "0.85rem" }}>{edu.details}</Typography>}
              </Box>
            ))}
          </Box>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2f5597", mb: 2, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.95rem" }}>
              CERTIFICATIONS
            </Typography>
            <Box component="ul" sx={{ m: 0, pl: 0, listStyle: "none", color: "#333", "& li": { mb: 0.8, display: "flex", alignItems: "flex-start", fontSize: "0.88rem" } }}>
              {data.certifications.map((cert, idx) => (
                <Box component="li" key={idx}>
                  <Box component="span" sx={{ color: "#2f5597", mr: 1, fontWeight: "bold", fontSize: "1.1rem", lineHeight: 1 }}>›</Box>
                  <Box component="span"><Box component="span" sx={{ fontWeight: 600 }}>{cert.name}</Box>{cert.date ? ` — ${cert.date}` : ""}</Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}

        {data.other && (
          <Box sx={{ mb: 4 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "#2f5597", mb: 1.5, textTransform: "uppercase", letterSpacing: 1.2, fontSize: "0.95rem" }}>
              {data.other.label}
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", lineHeight: 1.6, fontSize: "0.85rem" }}>
              {data.other.value}
            </Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

const CoverLetterDisplay = ({ content, data }: { content?: string, data: CVData }) => {
  return (
    <Paper 
      elevation={3}
      sx={{ 
        width: "100%", 
        maxWidth: "210mm",
        minHeight: "297mm", 
        bgcolor: "#ffffff", 
        color: "#000000",
        p: { xs: 4, md: "20mm" },
        borderRadius: 0,
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        // Page break indicators
        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          pointerEvents: "none",
          backgroundImage: `linear-gradient(to bottom, transparent 296.5mm, #e5e7eb 296.5mm, #e5e7eb 297mm, transparent 297mm)`,
          backgroundSize: "100% 297mm",
          zIndex: 10
        }
      }}
    >
      {/* Page Break Label Overlay */}
      <Box sx={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, pointerEvents: "none", zIndex: 11 }}>
        {[1, 2].map((page) => (
          <Box 
            key={page} 
            sx={{ 
              position: "absolute", 
              top: `${page * 297}mm`, 
              right: "10mm", 
              transform: "translateY(-100%)",
              display: "flex",
              alignItems: "center",
              gap: 1
            }}
          >
            <Typography variant="caption" sx={{ color: "#9ca3af", fontWeight: 500, bgcolor: "white", px: 1 }}>
              PAGE {page} END
            </Typography>
          </Box>
        ))}
      </Box>
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <DocumentHeader data={data} />
        <Box sx={{ mt: 6 }}>
          <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", color: "#333", lineHeight: 1.9, fontSize: "0.95rem" }}>
            {content || `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${data.name}`}
          </Typography>
        </Box>
      </Box>
    </Paper>
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
                <CoverLetterDisplay content={localCvData.coverLetter} data={localCvData} />
              )}
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
