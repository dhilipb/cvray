"use client";

import React from "react";
import {
  Box,
  Chip,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Tooltip,
  Typography,
} from "@mui/material";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { CVData } from "@/lib/types";
import type { AtsResult } from "@/lib/cv/ats";
import { getLayoutSections } from "@/lib/cv/sections";

const BUILT_IN_TITLES: Record<string, string> = {
  summary: "Summary",
  skills: "Skills",
  experience: "Experience",
  education: "Education",
  certifications: "Certifications",
  other: "Other",
};

interface Props {
  cv: CVData;
  ats: AtsResult | null;
  onChange: (cv: CVData) => void;
  onAskAi: (prompt: string) => void;
  disabled?: boolean;
}

export const TailoringPanel = ({ cv, ats, onChange, onAskAi, disabled }: Props) => {
  const sections = getLayoutSections(cv);

  const sectionTitle = (id: string) =>
    cv.sectionLabels?.[id as keyof NonNullable<CVData["sectionLabels"]>] ||
    cv.customSections?.find((s) => s.id === id)?.title ||
    (id === "other" ? cv.other?.label : undefined) ||
    BUILT_IN_TITLES[id] ||
    id;

  const isEmpty = (id: string) => {
    switch (id) {
      case "summary":
        return !cv.summary;
      case "other":
        return !cv.other;
      case "skills":
      case "experience":
      case "education":
      case "certifications":
        return !cv[id]?.length;
      default: {
        const s = cv.customSections?.find((c) => c.id === id);
        return !s?.content && !s?.bulletPoints?.length;
      }
    }
  };

  // Persist the full explicit order + hidden list so the layout is unambiguous.
  const save = (next: { id: string; hidden: boolean }[]) =>
    onChange({
      ...cv,
      sectionsOrder: next.map((s) => s.id),
      hiddenSections: next.filter((s) => s.hidden).map((s) => s.id),
    });

  const move = (i: number, dir: -1 | 1) => {
    const next = [...sections];
    [next[i], next[i + dir]] = [next[i + dir], next[i]];
    save(next);
  };

  const scoreColor = !ats
    ? "inherit"
    : ats.score >= 70
      ? "success"
      : ats.score >= 40
        ? "warning"
        : "error";

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        display: "grid",
        gap: 3,
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        width: "100%",
        alignContent: "start",
      }}
    >
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          ATS keyword match
        </Typography>
        {!ats ? (
          <Typography variant="body2" color="text.secondary">
            Add a job description in the Job Details tab to see how well your CV matches.
          </Typography>
        ) : (
          <>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, my: 1.5 }}>
              <Typography variant="h4" sx={{ fontWeight: 700 }} color={scoreColor}>
                {ats.score}%
              </Typography>
              <LinearProgress
                variant="determinate"
                value={ats.score}
                color={scoreColor === "inherit" ? "primary" : scoreColor}
                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                aria-label="ATS keyword match score"
              />
            </Box>
            <Typography variant="caption" color="text.secondary">
              Share of the job description&apos;s top keywords found in your CV. A rough guide, not
              a real ATS.
            </Typography>
            {ats.missing.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Missing ({ats.missing.length}) — click to ask AI to add it where true
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {ats.missing.map((k) => (
                    <Chip
                      key={k}
                      label={k}
                      size="small"
                      color="warning"
                      variant="outlined"
                      clickable
                      disabled={disabled}
                      onClick={() =>
                        onAskAi(
                          `If I genuinely have experience with "${k}", work it into my CV where it fits naturally. If unclear, ask me first.`,
                        )
                      }
                    />
                  ))}
                </Box>
              </>
            )}
            {ats.matched.length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Matched ({ats.matched.length})
                </Typography>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.75 }}>
                  {ats.matched.map((k) => (
                    <Chip key={k} label={k} size="small" color="success" variant="outlined" />
                  ))}
                </Box>
              </>
            )}
          </>
        )}
      </Paper>

      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 0.5 }}>
          Sections
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Reorder or hide sections. Hidden sections keep their content.
        </Typography>
        <List dense>
          {sections.map((s, i) => (
            <ListItem
              key={s.id}
              divider
              sx={{ opacity: s.hidden ? 0.5 : 1 }}
              secondaryAction={
                <Box>
                  <IconButton
                    size="small"
                    aria-label={`Move ${sectionTitle(s.id)} up`}
                    disabled={disabled || i === 0}
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUpwardIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    aria-label={`Move ${sectionTitle(s.id)} down`}
                    disabled={disabled || i === sections.length - 1}
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDownwardIcon fontSize="small" />
                  </IconButton>
                  <Tooltip title={s.hidden ? "Show section" : "Hide section"}>
                    <IconButton
                      size="small"
                      aria-label={`${s.hidden ? "Show" : "Hide"} ${sectionTitle(s.id)}`}
                      disabled={disabled}
                      onClick={() =>
                        save(sections.map((x) => (x.id === s.id ? { ...x, hidden: !x.hidden } : x)))
                      }
                    >
                      {s.hidden ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>
                </Box>
              }
            >
              <ListItemText
                primary={sectionTitle(s.id)}
                secondary={isEmpty(s.id) ? "Empty — won't appear" : s.hidden ? "Hidden" : null}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
