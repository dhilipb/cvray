"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Alert,
  Grid,
} from "@mui/material";

/* --------- Interface & Props --------- */
interface NewJobDialogProps {
  open: boolean;
  profileId: string;
  onClose: (success?: boolean) => void;
}

/* --------- NewJobDialog Component --------- */
export function NewJobDialog({ open, profileId, onClose }: NewJobDialogProps) {
  const [creating, setCreating] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [newJobData, setNewJobData] = useState({
    company: "",
    role: "",
    jobDescription: "",
    url: "",
  });

  const handleCreateJob = async () => {
    try {
      setCreating(true);
      setDialogError(null);
      const res = await fetch(`/api/profiles/${profileId}/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newJobData),
      });
      const data = await res.json();
      if (data.success) {
        setNewJobData({ company: "", role: "", jobDescription: "", url: "" });
        onClose(true);
      } else {
        setDialogError(data.error || "Failed to create job");
      }
    } catch (err) {
      console.error(err);
      setDialogError("An error occurred");
    } finally {
      setCreating(false);
    }
  };

  const handleCancel = () => {
    setNewJobData({ company: "", role: "", jobDescription: "", url: "" });
    setDialogError(null);
    onClose(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="md"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "background.paper", backgroundImage: "none" } } }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
        Track & Tailor New Application
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {dialogError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {dialogError}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Company Name"
                variant="outlined"
                value={newJobData.company}
                onChange={(e) => setNewJobData({ ...newJobData, company: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField
                fullWidth
                label="Job Title"
                variant="outlined"
                value={newJobData.role}
                onChange={(e) => setNewJobData({ ...newJobData, role: e.target.value })}
              />
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Job Description"
            variant="outlined"
            multiline
            rows={6}
            placeholder="Paste the job description here so AI can analyze and tailor your CV..."
            value={newJobData.jobDescription}
            onChange={(e) => setNewJobData({ ...newJobData, jobDescription: e.target.value })}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={handleCancel} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={creating || !newJobData.company || !newJobData.role}
          onClick={handleCreateJob}
          sx={{
            background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {creating ? "Creating..." : "Tailor CV with AI"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
