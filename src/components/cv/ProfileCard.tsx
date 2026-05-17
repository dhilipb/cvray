"use client";

import React from "react";
import {
  Card,
  CardActionArea,
  CardActions,
  Box,
  Typography,
  Chip,
  Button,
  Divider,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import EditIcon from "@mui/icons-material/Edit";
import { Profile, CVData } from "@/lib/types";

/* --------- Interface & Props --------- */
interface ProfileCardProps {
  profile: Profile;
  onClick: (id: string) => void;
  onEdit: (id: string) => void;
}

/* --------- ProfileCard Component --------- */
export function ProfileCard({ profile, onClick, onEdit }: ProfileCardProps) {
  let cvData: CVData = {
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
  };

  try {
    if (profile.parsedProfileJson) {
      cvData = JSON.parse(profile.parsedProfileJson);
    }
  } catch (error) {
    console.error("Failed to parse profile JSON", error);
  }

  const role = cvData.title || "Professional Profile";
  const parts = profile.name.trim().split(/\s+/);
  const initials =
    parts.length === 0 || !parts[0]
      ? "P"
      : parts.length === 1
        ? parts[0].slice(0, 2).toUpperCase()
        : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();

  /* --------- Extract Skills --------- */
  const topSkills: string[] = [];
  if (cvData.skills) {
    for (const cat of cvData.skills) {
      if (cat.items) {
        const items = cat.items.split(/, |,/g).filter(Boolean);
        for (const item of items) {
          if (topSkills.length < 4) {
            topSkills.push(item.trim());
          }
        }
      }
    }
  }

  return (
    <Card
      sx={{
        bgcolor: "rgba(24, 24, 27, 0.45)",
        backdropFilter: "blur(12px)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        borderRadius: 3.5,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
        transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          bgcolor: "rgba(16, 24, 20, 0.55)",
          borderColor: "rgba(16, 185, 129, 0.45)",
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.7), 0 0 24px -4px rgba(16, 185, 129, 0.2)",
          "& .card-glow-bar": {
            opacity: 1,
            transform: "scaleX(1)",
          },
          "& .arrow-icon": {
            transform: "translateX(6px)",
            color: "#10b981",
          },
          "& .avatar-container": {
            borderColor: "rgba(16, 185, 129, 0.8)",
            boxShadow: "0 0 20px rgba(16, 185, 129, 0.25)",
            transform: "scale(1.05)",
          },
        },
      }}
    >
      {/* Glow Bar */}
      <Box
        className="card-glow-bar"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #10b981 0%, #34d399 50%, #d946ef 100%)",
          opacity: 0.7,
          transform: "scaleX(0.95)",
          transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <CardActionArea
        onClick={() => onClick(profile.id)}
        sx={{
          flexGrow: 1,
          p: 3,
          pt: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "flex-start",
          "&:hover": {
            bgcolor: "transparent",
          },
          "& .MuiCardActionArea-focusHighlight": {
            bgcolor: "transparent",
          },
        }}
      >
        {/* Header */}
        <Box sx={{ display: "flex", alignItems: "flex-start", width: "100%", mb: 2.5 }}>
          <Box
            className="avatar-container"
            sx={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              background:
                "linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(217, 70, 239, 0.05) 100%)",
              border: "2px solid rgba(16, 185, 129, 0.3)",
              color: "#10b981",
              boxShadow: "0 0 16px rgba(16, 185, 129, 0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 800,
              fontSize: "1.2rem",
              fontFamily: '"Outfit", sans-serif',
              mr: 2,
              flexShrink: 0,
              transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {initials}
          </Box>

          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 700,
                  fontFamily: '"Outfit", sans-serif',
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                  color: "#ffffff",
                  fontSize: "1.15rem",
                }}
              >
                {profile.name}
              </Typography>
              <ArrowForwardIcon
                className="arrow-icon"
                sx={{
                  fontSize: 18,
                  color: "rgba(255, 255, 255, 0.3)",
                  transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  flexShrink: 0,
                  mr: 0.5,
                }}
              />
            </Box>
            <Chip
              label={role}
              size="small"
              sx={{
                mt: 0.75,
                bgcolor: "rgba(16, 185, 129, 0.06)",
                color: "#10b981",
                border: "1px solid rgba(16, 185, 129, 0.15)",
                fontWeight: 600,
                fontSize: "0.75rem",
                borderRadius: 1.5,
              }}
            />
          </Box>
        </Box>

        {profile.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 3,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 40,
              fontSize: "0.875rem",
              lineHeight: 1.5,
            }}
          >
            {profile.description}
          </Typography>
        )}

        {/* Skills Preview */}
        {topSkills.length > 0 && (
          <Box sx={{ width: "100%", mt: "auto" }}>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, alignItems: "center" }}>
              {topSkills.map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  sx={{
                    bgcolor: "rgba(255, 255, 255, 0.03)",
                    color: "rgba(255, 255, 255, 0.5)",
                    fontSize: "0.7rem",
                    height: 22,
                    border: "1px solid rgba(255, 255, 255, 0.05)",
                    borderRadius: 1.5,
                    px: 0.5,
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </CardActionArea>

      <Divider sx={{ borderColor: "rgba(255, 255, 255, 0.05)" }} />

      {/* Footer */}
      <CardActions
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bgcolor: "rgba(9, 9, 11, 0.15)",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary", gap: 0.75 }}>
          <CalendarTodayIcon sx={{ fontSize: 12, color: "rgba(255, 255, 255, 0.3)" }} />
          <Typography
            variant="caption"
            sx={{ fontSize: "0.7rem", color: "rgba(255, 255, 255, 0.45)" }}
          >
            Updated {new Date(profile.updatedAt).toLocaleDateString()}
          </Typography>
        </Box>

        <Button
          size="small"
          variant="outlined"
          startIcon={<EditIcon sx={{ fontSize: 13 }} />}
          onClick={(e) => {
            e.stopPropagation();
            onEdit(profile.id);
          }}
          sx={{
            borderColor: "rgba(16, 185, 129, 0.25)",
            color: "#10b981",
            fontSize: "0.75rem",
            fontWeight: 600,
            px: 1.5,
            py: 0.5,
            borderRadius: 2,
            minWidth: 0,
            textTransform: "none",
            transition: "all 0.3s ease",
            "&:hover": {
              borderColor: "#10b981",
              bgcolor: "rgba(16, 185, 129, 0.05)",
              boxShadow: "0 2px 8px rgba(16, 185, 129, 0.15)",
            },
          }}
        >
          Edit
        </Button>
      </CardActions>
    </Card>
  );
}
