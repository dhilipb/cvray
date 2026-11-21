"use client";

import React, { useState } from "react";
import {
  Card,
  CardActionArea,
  Box,
  Typography,
  Select,
  MenuItem,
  IconButton,
  Menu,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import WorkIcon from "@mui/icons-material/Work";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import EditIcon from "@mui/icons-material/Edit";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutlined";
import { JOB_STATUSES, STATUS_COLORS, Job, isSafeUrl, relativeTime } from "./jobUtils";

/* --------- Interface & Props --------- */
interface JobItemRowProps {
  job: Job;
  onClick: (id: string) => void;
  onStatusChange: (job: Job, status: string) => void;
  onEdit: (job: Job) => void;
  onDuplicate: (job: Job) => void;
  onDelete: (job: Job) => void;
}

/* --------- JobItemRow Component --------- */
export function JobItemRow({
  job,
  onClick,
  onStatusChange,
  onEdit,
  onDuplicate,
  onDelete,
}: JobItemRowProps) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const color = STATUS_COLORS[job.status] ?? STATUS_COLORS.Saved;
  const closeMenu = () => setMenuAnchor(null);

  return (
    <Card
      sx={{
        bgcolor: "background.paper",
        border: "1px solid rgba(255,255,255,0.05)",
        borderLeft: `3px solid ${color}`,
        borderRadius: 2,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        alignItems: { xs: "stretch", sm: "center" },
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          borderColor: "rgba(16,185,129,0.4)",
          borderLeftColor: color,
        },
      }}
    >
      {/* Main clickable area opens the CV editor */}
      <CardActionArea
        onClick={() => onClick(job.id)}
        aria-label={`Open tailored CV for ${job.role} at ${job.company}`}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-start",
          px: 3,
          py: 2,
          minWidth: 0,
        }}
      >
        <Box
          sx={{
            p: 1.2,
            borderRadius: 1.5,
            bgcolor: "rgba(16, 185, 129, 0.1)",
            color: "#10b981",
            mr: { xs: 2, sm: 3 },
            display: "flex",
            flexShrink: 0,
          }}
        >
          <WorkIcon sx={{ fontSize: 20 }} />
        </Box>

        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            noWrap
            sx={{
              fontWeight: 700,
              fontFamily: '"Outfit", sans-serif',
              color: "#fff",
              fontSize: "1.05rem",
            }}
          >
            {job.role}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap>
            {job.company}
            <Box component="span" sx={{ mx: 1, opacity: 0.4 }}>
              •
            </Box>
            <Tooltip title={new Date(job.appliedAt).toLocaleString()}>
              <span>Added {relativeTime(job.appliedAt)}</span>
            </Tooltip>
            {job.updatedAt && job.updatedAt !== job.appliedAt && (
              <>
                <Box component="span" sx={{ mx: 1, opacity: 0.4 }}>
                  •
                </Box>
                Updated {relativeTime(job.updatedAt)}
              </>
            )}
          </Typography>
        </Box>
      </CardActionArea>

      {/* Actions */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.5,
          px: { xs: 2, sm: 2 },
          pb: { xs: 1.5, sm: 0 },
          flexShrink: 0,
          justifyContent: { xs: "flex-end", sm: "flex-start" },
        }}
      >
        <Select
          size="small"
          value={job.status}
          onChange={(e) => onStatusChange(job, e.target.value)}
          inputProps={{ "aria-label": `Status for ${job.role} at ${job.company}` }}
          sx={{
            minWidth: 140,
            color,
            fontWeight: 600,
            fontSize: "0.85rem",
            bgcolor: `${color}1a`,
            "& .MuiOutlinedInput-notchedOutline": { borderColor: `${color}40` },
            "& .MuiSvgIcon-root": { color },
          }}
        >
          {/* Keep unknown legacy statuses selectable so the Select stays controlled */}
          {(JOB_STATUSES as readonly string[]).includes(job.status) ? null : (
            <MenuItem value={job.status}>{job.status}</MenuItem>
          )}
          {JOB_STATUSES.map((s) => (
            <MenuItem key={s} value={s}>
              <Box
                component="span"
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  bgcolor: STATUS_COLORS[s],
                  mr: 1,
                  display: "inline-block",
                }}
              />
              {s}
            </MenuItem>
          ))}
        </Select>

        {isSafeUrl(job.url) && (
          <Tooltip title="Open job posting">
            <IconButton
              component="a"
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open job posting in new tab"
              sx={{ color: "text.secondary" }}
            >
              <OpenInNewIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}

        <IconButton
          aria-label="More actions"
          aria-haspopup="true"
          onClick={(e) => setMenuAnchor(e.currentTarget)}
          sx={{ color: "text.secondary" }}
        >
          <MoreVertIcon fontSize="small" />
        </IconButton>
        <Menu anchorEl={menuAnchor} open={!!menuAnchor} onClose={closeMenu}>
          <MenuItem
            onClick={() => {
              closeMenu();
              onEdit(job);
            }}
          >
            <ListItemIcon>
              <EditIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit details</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              onDuplicate(job);
            }}
          >
            <ListItemIcon>
              <ContentCopyIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Duplicate</ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => {
              closeMenu();
              onDelete(job);
            }}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon fontSize="small" sx={{ color: "error.main" }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Box>
    </Card>
  );
}
