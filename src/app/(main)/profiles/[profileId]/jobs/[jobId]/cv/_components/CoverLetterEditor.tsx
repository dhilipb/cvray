"use client";

import React, { useEffect, useRef, useState } from "react";
import { Box, Button, TextField, Typography } from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";

interface Props {
  value: string;
  onChange: (value: string) => void;
  onGenerate: () => void;
  disabled?: boolean;
}

/** Plain-text cover letter editor; commits to the CV after a short pause in typing. */
export const CoverLetterEditor = ({ value, onChange, onGenerate, disabled }: Props) => {
  const [draft, setDraft] = useState(value);
  const committed = useRef(value);

  // Adopt external changes (AI edits, undo) when they differ from what we last committed.
  useEffect(() => {
    if (value !== committed.current) {
      committed.current = value;
      setDraft(value);
    }
  }, [value]);

  useEffect(() => {
    if (draft === committed.current) return;
    const t = setTimeout(() => {
      committed.current = draft;
      onChange(draft);
    }, 700);
    return () => clearTimeout(t);
  }, [draft, onChange]);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, p: 2, height: "100%" }}>
      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Cover letter text
        </Typography>
        <Button
          size="small"
          startIcon={<AutoAwesomeIcon />}
          onClick={onGenerate}
          disabled={disabled}
          sx={{ color: "#10b981" }}
        >
          {value ? "Rewrite with AI" : "Generate with AI"}
        </Button>
      </Box>
      <TextField
        multiline
        fullWidth
        minRows={12}
        value={draft}
        disabled={disabled}
        placeholder="Write your cover letter here, or generate one with AI."
        onChange={(e) => setDraft(e.target.value)}
        onBlur={() => {
          if (draft !== committed.current) {
            committed.current = draft;
            onChange(draft);
          }
        }}
        slotProps={{ htmlInput: { maxLength: 20000, "aria-label": "Cover letter text" } }}
        sx={{
          flexGrow: 1,
          "& .MuiInputBase-root": { alignItems: "flex-start", fontSize: "0.85rem" },
        }}
      />
      <Typography variant="caption" color="text.secondary">
        {draft.trim()
          ? `${draft.trim().split(/\s+/).length} words`
          : "Empty — a placeholder letter is shown in the PDF."}
      </Typography>
    </Box>
  );
};
