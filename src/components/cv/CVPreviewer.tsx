"use client";

import React, { useState } from "react";
import { 
  Box, Typography, Paper, IconButton, TextField, Button, Divider, Drawer, useTheme, useMediaQuery
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import EditIcon from "@mui/icons-material/Edit";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

interface CVPreviewerProps {
  open: boolean;
  onClose: () => void;
  cvData?: any; // To be typed properly later based on actual CV interface
  jobContext?: string;
}

export default function CVPreviewer({ open, onClose, cvData, jobContext }: CVPreviewerProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [chatMessage, setChatMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hi! I'm your AI CV assistant. How would you like to tweak this CV today?" }
  ]);

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: chatMessage }]);
    setChatMessage("");
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "ai", text: "I've noted that! I'll update the relevant sections of your CV to better align with these requirements." }]);
    }, 1000);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width: fullScreen ? "100%" : "85vw",
            maxWidth: "1400px",
            bgcolor: "background.default",
            display: "flex",
            flexDirection: "row"
          }
        }
      }}
    >
      {/* Main CV Preview Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
        {/* Header */}
        <Box sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "space-between", bgcolor: "background.paper" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>CV Preview</Typography>
            {jobContext && (
              <Typography variant="body2" color="text.secondary">Tailoring for: {jobContext}</Typography>
            )}
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button startIcon={<EditIcon />} variant="outlined" size="small" sx={{ borderColor: "rgba(255,255,255,0.1)" }}>
              Manual Edit
            </Button>
            <Button startIcon={<FileDownloadIcon />} variant="contained" size="small" sx={{ bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}>
              Export PDF
            </Button>
            <IconButton onClick={onClose} sx={{ ml: 1 }}>
              <CloseIcon />
            </IconButton>
          </Box>
        </Box>

        {/* CV Document Container */}
        <Box sx={{ flexGrow: 1, p: 4, overflowY: "auto", bgcolor: "#1e1e24", display: "flex", justifyContent: "center" }}>
          <Paper 
            elevation={6}
            sx={{ 
              width: "100%", 
              maxWidth: "800px", 
              minHeight: "1000px", 
              bgcolor: "#ffffff", 
              color: "#000000",
              p: 6,
              borderRadius: 1
            }}
          >
            {/* Render dynamic CV data if available */}
            {cvData ? (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#111" }}>{cvData.name}</Typography>
                <Typography variant="h6" sx={{ color: "#444", mb: 3 }}>{cvData.title}</Typography>
                <Divider sx={{ mb: 3, borderColor: "#ccc" }} />
                
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 1 }}>Summary</Typography>
                <Typography variant="body2" sx={{ mb: 4, color: "#333", lineHeight: 1.6 }}>
                  {cvData.summary}
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 1 }}>Experience</Typography>
                {cvData.experience?.map((exp: any, idx: number) => (
                  <Box key={idx} sx={{ mb: 3 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#222" }}>{exp.role} - {exp.company}</Typography>
                    <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>{exp.dates}</Typography>
                    <Typography component="ul" sx={{ m: 0, pl: 3, color: "#333", "& li": { mb: 0.5 } }}>
                      {exp.bulletPoints?.map((bp: string, bidx: number) => (
                        <li key={bidx}>{bp}</li>
                      ))}
                    </Typography>
                  </Box>
                ))}
              </Box>
            ) : (
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: "#111" }}>Sakthi Buddha</Typography>
                <Typography variant="h6" sx={{ color: "#444", mb: 3 }}>Senior QA Engineer</Typography>
                <Divider sx={{ mb: 3, borderColor: "#ccc" }} />
                
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 1 }}>Summary</Typography>
                <Typography variant="body2" sx={{ mb: 4, color: "#333", lineHeight: 1.6 }}>
                  Senior Software Quality Assurance professional with over 9 years of expertise in driving product quality, delivery speed, and operational excellence across complex enterprise environments.
                </Typography>

                <Typography variant="h6" sx={{ fontWeight: 600, color: "#222", mb: 1 }}>Experience</Typography>
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, color: "#222" }}>Senior Test Engineer - Qualitest</Typography>
                  <Typography variant="body2" sx={{ color: "#555", mb: 1 }}>March 2025 - Present</Typography>
                  <Typography component="ul" sx={{ m: 0, pl: 3, color: "#333", "& li": { mb: 0.5 } }}>
                    <li>Drive measurable improvements in quality and velocity for major retail releases.</li>
                    <li>Define and execute end-to-end testing strategies for critical business journeys.</li>
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>
        </Box>
      </Box>

      {/* AI Assistant Sidebar */}
      <Box 
        sx={{ 
          width: "380px", 
          borderLeft: "1px solid rgba(255,255,255,0.05)", 
          display: "flex", 
          flexDirection: "column",
          bgcolor: "background.paper"
        }}
      >
        <Box sx={{ p: 2, borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box sx={{ p: 1, borderRadius: 1, bgcolor: "rgba(16,185,129,0.1)", color: "#10b981", display: "flex" }}>
            <SmartToyIcon />
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>AI Tailoring Assistant</Typography>
        </Box>

        {/* Chat Messages */}
        <Box sx={{ flexGrow: 1, p: 2, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
          {messages.map((msg, idx) => (
            <Box 
              key={idx} 
              sx={{ 
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                maxWidth: "85%",
                bgcolor: msg.role === "user" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
                p: 1.5,
                borderRadius: 2,
                borderBottomRightRadius: msg.role === "user" ? 4 : 8,
                borderBottomLeftRadius: msg.role === "ai" ? 4 : 8,
              }}
            >
              <Typography variant="body2" sx={{ color: msg.role === "user" ? "text.primary" : "text.secondary" }}>
                {msg.text}
              </Typography>
            </Box>
          ))}
        </Box>

        {/* Chat Input */}
        <Box sx={{ p: 2, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <TextField
            fullWidth
            placeholder="Ask AI to change something..."
            variant="outlined"
            size="small"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            slotProps={{
              input: {
                sx: { borderRadius: 3, pr: 0.5 },
                endAdornment: (
                  <IconButton onClick={handleSendMessage} color="primary" sx={{ color: "#10b981" }}>
                    <SendIcon fontSize="small" />
                  </IconButton>
                )
              }
            }}
          />
          <Box sx={{ display: "flex", gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Button size="small" variant="outlined" sx={{ borderRadius: 4, fontSize: "0.7rem", py: 0.2, borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}>
              Make it more formal
            </Button>
            <Button size="small" variant="outlined" sx={{ borderRadius: 4, fontSize: "0.7rem", py: 0.2, borderColor: "rgba(255,255,255,0.1)", color: "text.secondary" }}>
              Highlight leadership
            </Button>
          </Box>
        </Box>
      </Box>
    </Drawer>
  );
}
