"use client";

import React, { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Card,
  CircularProgress,
  Chip,
  Alert,
  Button,
  Tooltip,
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlineOutlined";
import { useChat } from "@ai-sdk/react";
import type { UIMessage } from "@ai-sdk/react";
import { DefaultChatTransport, getToolName, isToolUIPart } from "ai";
import { CVData } from "@/lib/types";
import ReactMarkdown from "react-markdown";

/* --------- Types --------- */

export interface ChatPromptRequest {
  text: string;
  nonce: number;
}

interface AIChatAssistantProps {
  jobId: string;
  profileId: string;
  /** Called with the server-persisted CV after each successful AI tool call. */
  onCvUpdate: (data: CVData, actionLabel: string) => void;
  /** Awaited before each request so the server sees the latest saved CV. */
  beforeSend: () => Promise<void>;
  onBusyChange?: (busy: boolean) => void;
  /** Externally triggered prompt (e.g. "Generate with AI" buttons). */
  promptRequest?: ChatPromptRequest | null;
  missingKeywords?: string[];
}

const GREETING_ID = "greeting";

const TOOL_LABELS: Record<string, string> = {
  updatePersonalInfo: "Updated contact details",
  updateSummary: "Updated summary",
  addWorkExperience: "Added experience",
  updateWorkExperience: "Edited experience",
  deleteWorkExperience: "Deleted experience",
  updateSkills: "Updated skills",
  addEducation: "Added education",
  updateEducation: "Edited education",
  deleteEducation: "Deleted education",
  addCertification: "Added certification",
  deleteCertification: "Deleted certification",
  togglePageBreak: "Changed page break",
  updateSectionLabels: "Renamed sections",
  reorderSections: "Reordered sections",
  setSectionVisibility: "Changed section visibility",
  updateCustomSection: "Updated custom section",
  updateOtherSection: "Updated other section",
  updateCoverLetter: "Updated cover letter",
  updateTemplateOrTheme: "Changed template/theme",
  updateCV: "Rewrote entire CV",
};

const DESTRUCTIVE_TOOLS = new Set([
  "deleteWorkExperience",
  "deleteEducation",
  "deleteCertification",
  "updateCV",
]);

export const toolLabel = (name: string) => TOOL_LABELS[name] || name;

const QUICK_PROMPTS = [
  { label: "Tailor summary", text: "Tailor my professional summary to this job description." },
  {
    label: "Quantify achievements",
    text: "Rewrite my experience bullet points to be more results-oriented and quantified where my existing content supports it. Don't invent numbers; ask me if you need figures.",
  },
  {
    label: "Write cover letter",
    text: "Write a concise, tailored cover letter for this role based on my CV and the job description.",
  },
  {
    label: "Reorder skills",
    text: "Reorder and regroup my skills so the ones most relevant to this job come first.",
  },
  {
    label: "Tighten to 2 pages",
    text: "Tighten the wording across my CV so it fits comfortably in two pages without losing key achievements.",
  },
];

/** Strips the UI-only greeting and bulky CV snapshots from tool outputs before sending. */
const toRequestMessages = (messages: UIMessage[]) =>
  messages
    .filter((m) => m.id !== GREETING_ID)
    .map((m) => ({
      ...m,
      parts: m.parts.map((p) =>
        isToolUIPart(p) && p.state === "output-available" ? { ...p, output: { success: true } } : p,
      ),
    }));

/* --------- Component --------- */

export const AIChatAssistant = ({
  jobId,
  profileId,
  onCvUpdate,
  beforeSend,
  onBusyChange,
  promptRequest,
  missingKeywords,
}: AIChatAssistantProps) => {
  const [chatInput, setChatInput] = useState("");
  const [preparing, setPreparing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const processedToolCalls = useRef(new Set<string>());

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
        prepareSendMessagesRequest: ({ messages }) => ({
          body: { jobId, profileId, messages: toRequestMessages(messages).slice(-20) },
        }),
      }),
    [jobId, profileId],
  );

  const { messages, sendMessage, status, error, stop, regenerate, clearError } = useChat({
    transport,
    messages: [
      {
        id: GREETING_ID,
        role: "assistant",
        parts: [
          {
            type: "text",
            text: "Hi! I'm your AI CV assistant. I can tailor your CV and cover letter for this role. Every change I make shows up below and can be undone from the toolbar.",
          },
        ],
      },
    ] as UIMessage[],
  });

  const isLoading = preparing || status === "submitted" || status === "streaming";

  useEffect(() => {
    onBusyChange?.(isLoading);
  }, [isLoading, onBusyChange]);

  // Sync the preview from server-confirmed tool outputs (each applied exactly once, in order).
  useEffect(() => {
    for (const msg of messages) {
      for (const part of msg.parts) {
        if (!isToolUIPart(part) || part.state !== "output-available") continue;
        if (processedToolCalls.current.has(part.toolCallId)) continue;
        processedToolCalls.current.add(part.toolCallId);
        const cv = (part.output as { cv?: CVData } | undefined)?.cv;
        if (cv) onCvUpdate(cv, toolLabel(getToolName(part)));
      }
    }
  }, [messages, onCvUpdate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || isLoading) return;
      setPreparing(true);
      try {
        await beforeSend();
      } catch {
        // Saving failed; the server will use the last persisted CV. Still send.
      } finally {
        setPreparing(false);
      }
      clearError();
      sendMessage({ text: trimmed.slice(0, 4000) });
    },
    [beforeSend, clearError, isLoading, sendMessage],
  );

  const lastNonce = useRef<number | null>(null);
  useEffect(() => {
    if (promptRequest && promptRequest.nonce !== lastNonce.current) {
      lastNonce.current = promptRequest.nonce;
      void send(promptRequest.text);
    }
  }, [promptRequest, send]);

  const handleChatSubmit = (e?: React.SyntheticEvent) => {
    e?.preventDefault();
    if (!chatInput.trim() || isLoading) return;
    void send(chatInput);
    setChatInput("");
  };

  const quickPrompts = missingKeywords?.length
    ? [
        ...QUICK_PROMPTS,
        {
          label: "Add missing keywords",
          text: `Work these job keywords into my CV where they truthfully apply (don't claim skills I don't have): ${missingKeywords.slice(0, 15).join(", ")}.`,
        },
      ]
    : QUICK_PROMPTS;

  return (
    <Card
      sx={{
        flexGrow: 1,
        display: "flex",
        flexDirection: "column",
        bgcolor: "background.paper",
        borderRadius: 0,
        overflow: "hidden",
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: 1,
          borderColor: "divider",
          display: "flex",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            p: 0.75,
            borderRadius: 1,
            bgcolor: "rgba(16,185,129,0.1)",
            color: "#10b981",
            display: "flex",
          }}
        >
          <SmartToyIcon fontSize="small" />
        </Box>
        <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
          AI Assistant
        </Typography>
        {isLoading && <CircularProgress size={16} sx={{ color: "#10b981" }} />}
      </Box>

      <Box
        role="log"
        aria-live="polite"
        sx={{
          flexGrow: 1,
          minHeight: 0,
          p: 2,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg) => (
          <Box
            key={msg.id}
            sx={{
              alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
              maxWidth: "90%",
              bgcolor: msg.role === "user" ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.05)",
              p: 1.25,
              borderRadius: 2,
              display: "flex",
              flexDirection: "column",
              gap: 0.75,
              wordBreak: "break-word",
            }}
          >
            {msg.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <Typography
                    component="div"
                    key={i}
                    variant="body2"
                    sx={{
                      "& p": { m: 0, mb: 1, "&:last-child": { mb: 0 } },
                      "& ul, & ol": { m: 0, pl: 2.5 },
                      "& code": { fontSize: "0.8em" },
                    }}
                  >
                    <ReactMarkdown>{part.text}</ReactMarkdown>
                  </Typography>
                );
              }
              if (isToolUIPart(part)) {
                const name = getToolName(part);
                const done = part.state === "output-available";
                const failed = part.state === "output-error";
                return (
                  <Tooltip
                    key={part.toolCallId}
                    title={failed ? part.errorText || "Failed" : "AI change applied to your CV"}
                  >
                    <Chip
                      size="small"
                      variant="outlined"
                      color={failed ? "error" : DESTRUCTIVE_TOOLS.has(name) ? "warning" : "success"}
                      icon={
                        failed ? (
                          <ErrorOutlineIcon />
                        ) : done ? (
                          <CheckCircleOutlineIcon />
                        ) : (
                          <CircularProgress size={12} />
                        )
                      }
                      label={failed ? `${toolLabel(name)} (failed)` : toolLabel(name)}
                      sx={{ alignSelf: "flex-start", fontSize: "0.7rem" }}
                    />
                  </Tooltip>
                );
              }
              return null;
            })}
          </Box>
        ))}
        {status === "submitted" && (
          <Box sx={{ alignSelf: "flex-start", p: 1 }}>
            <CircularProgress size={18} sx={{ color: "#10b981" }} />
          </Box>
        )}
        {error && (
          <Alert
            severity="error"
            action={
              <Button color="inherit" size="small" onClick={() => regenerate()}>
                Retry
              </Button>
            }
          >
            Something went wrong. Please try again.
          </Alert>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <Box sx={{ px: 2, pt: 1, display: "flex", flexWrap: "wrap", gap: 0.75 }}>
        {quickPrompts.map((p) => (
          <Chip
            key={p.label}
            label={p.label}
            size="small"
            clickable
            disabled={isLoading}
            onClick={() => void send(p.text)}
            sx={{ fontSize: "0.7rem" }}
          />
        ))}
      </Box>

      <Box sx={{ p: 2, pt: 1 }}>
        <form onSubmit={handleChatSubmit}>
          <TextField
            fullWidth
            multiline
            maxRows={6}
            placeholder="Ask AI to tailor your CV… (Enter to send, Shift+Enter for newline)"
            variant="outlined"
            size="small"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                handleChatSubmit();
              }
            }}
            slotProps={{
              htmlInput: { maxLength: 4000, "aria-label": "Message the AI assistant" },
              input: {
                endAdornment: isLoading ? (
                  <IconButton aria-label="Stop" onClick={() => stop()} sx={{ color: "#f87171" }}>
                    <StopIcon fontSize="small" />
                  </IconButton>
                ) : (
                  <IconButton
                    type="submit"
                    aria-label="Send"
                    sx={{ color: "#10b981" }}
                    disabled={!chatInput.trim()}
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
