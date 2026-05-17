"use client";

import React from "react";
import { Card, CardContent, Box, Typography, Chip } from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";

/* --------- Interface & Props --------- */
interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedAt: string;
  tweakedCvJson?: string;
}

interface JobItemRowProps {
  job: Job;
  onClick: (id: string) => void;
}

/* --------- JobItemRow Component --------- */
export function JobItemRow({ job, onClick }: JobItemRowProps) {
  const isInterviewing = job.status === "Interviewing";

  return (
    <Card
      onClick={() => onClick(job.id)}
      sx={{
        bgcolor: "background.paper",
        border: "1px solid rgba(255,255,255,0.05)",
        borderRadius: 2,
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          borderColor: "rgba(16,185,129,0.4)",
          transform: "translateY(-2px)",
          bgcolor: "rgba(255, 255, 255, 0.02)",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          width: "100%",
          alignItems: "center",
          py: "16px !important",
          px: 3,
        }}
      >
        {/* Work Icon with emerald background */}
        <Box
          sx={{
            p: 1.2,
            borderRadius: 1.5,
            bgcolor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            mr: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <WorkIcon sx={{ fontSize: 20 }} />
        </Box>

        {/* Company & Role Details */}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              fontFamily: '"Outfit", sans-serif',
              mb: 0.5,
              color: "#fff",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {job.role}{" "}
            <Typography
              component="span"
              variant="body1"
              sx={{ color: "text.secondary", fontWeight: 400 }}
            >
              at {job.company}
            </Typography>
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem" }}>
            Applied: {new Date(job.appliedAt).toLocaleDateString()}
          </Typography>
        </Box>

        {/* Status Badge */}
        <Box sx={{ flexShrink: 0, ml: 2 }}>
          <Chip
            label={job.status}
            size="small"
            sx={{
              bgcolor: isInterviewing ? "rgba(245, 158, 11, 0.1)" : "rgba(16, 185, 129, 0.1)",
              color: isInterviewing ? "#f59e0b" : "#10b981",
              fontWeight: 600,
              fontSize: "0.75rem",
              borderRadius: 1.5,
              border: isInterviewing
                ? "1px solid rgba(245, 158, 11, 0.2)"
                : "1px solid rgba(16, 185, 129, 0.2)",
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
