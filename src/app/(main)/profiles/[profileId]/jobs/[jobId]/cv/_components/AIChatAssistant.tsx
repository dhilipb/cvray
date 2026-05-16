"use client";

import React, { useState, useMemo } from "react";
import { Box, Typography, TextField, IconButton, Card, CircularProgress } from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { CVData } from "@/lib/types";

/* --------- Types --------- */

interface AIChatAssistantProps {
  jobId: string;
  profileId: string;
  localCvData: CVData | null;
  jobDescription?: string;
  onCvUpdate: (data: CVData) => void;
  onCoverLetterUpdate: (content: string) => void;
}

/* --------- Component --------- */

export const AIChatAssistant = ({
  jobId,
  profileId,
  localCvData,
  jobDescription,
  onCvUpdate,
  onCoverLetterUpdate,
}: AIChatAssistantProps) => {
  const [chatInput, setChatInput] = useState("");

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        body: () => ({
          jobId,
          profileId,
          cvData: localCvData,
          jobDescription,
        }),
      }),
    [jobId, profileId, localCvData, jobDescription],
  );

  const { messages, sendMessage, status } = useChat({
    transport,
    onToolCall: async ({ toolCall }) => {
      if (toolCall.toolName === "updateCV") {
        const newCvData = toolCall.input as CVData;
        onCvUpdate(newCvData);
      }
      if (toolCall.toolName === "updateCoverLetter") {
        const { content } = toolCall.input as { content: string };
        onCoverLetterUpdate(content);
      }
    },
    messages: [
      {
        id: "1",
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi! I'm your AI CV assistant. I can help you tailor your CV and cover letter for this specific role. What would you like to change?",
          },
        ],
      },
    ] as UIMessage[],
  });

  const handleChatSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;
    sendMessage({ text: chatInput });
    setChatInput("");
  };

  const isLoading = status === "submitted" || status === "streaming";

  return (
    <Card
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 2,
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          p: 2,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 1,
            borderRadius: 1,
            bgcolor: "rgba(16,185,129,0.1)",
            color: "#10b981",
            display: "flex",
          }}
        >
          <SmartToyIcon />
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          AI Assistant
        </Typography>
      </Box>

      <Box
        sx={{
          flexGrow: 1,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 2,
        }}
      >
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
            {msg.parts.map((part, i) =>
              part.type === "text" ? (
                <Typography key={i} variant="body2">
                  {part.text}
                </Typography>
              ) : null,
            )}
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
                  <IconButton
                    type="submit"
                    sx={{ color: "#10b981" }}
                    disabled={isLoading || !chatInput.trim()}
                  >
                    <SendIcon fontSize="small" />
                  </IconButton>
                ),
              },
            }}
          />
        </form>
      </Box>
    </Card>
  );
};
