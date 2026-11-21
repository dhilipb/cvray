"use client";

import React, { useEffect, useState } from "react";
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
  MenuItem,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { JOB_STATUSES, Job } from "./jobUtils";

/* --------- Interface & Props --------- */
interface NewJobDialogProps {
  open: boolean;
  profileId: string;
  /** When set, the dialog edits this job instead of creating a new one. */
  job?: Job | null;
  onClose: (success?: boolean) => void;
}

const emptyForm = {
  company: "",
  role: "",
  jobDescription: "",
  url: "",
  status: "Saved",
  notes: "",
};

/* --------- NewJobDialog Component --------- */
export function NewJobDialog({ open, profileId, job, onClose }: NewJobDialogProps) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const isEdit = !!job;
  const [saving, setSaving] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  // Reset the form each time the dialog opens (prefilled in edit mode)
  useEffect(() => {
    if (!open) return;
    setDialogError(null);
    setForm(
      job
        ? {
            company: job.company,
            role: job.role,
            jobDescription: job.jobDescription ?? "",
            url: job.url ?? "",
            status: job.status,
            notes: job.notes ?? "",
          }
        : emptyForm,
    );
  }, [open, job]);

  const set = (key: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const urlInvalid = !!form.url && !/^https?:\/\//i.test(form.url.trim());

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setDialogError(null);
      const res = await fetch(
        isEdit ? `/api/profiles/${profileId}/jobs/${job.id}` : `/api/profiles/${profileId}/jobs`,
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        },
      );
      const data = await res.json();
      if (res.ok && data.success) {
        onClose(true);
      } else {
        setDialogError(data.error || `Failed to ${isEdit ? "update" : "create"} job`);
      }
    } catch (err) {
      console.error(err);
      setDialogError("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const willUseAi = !isEdit && !!form.jobDescription.trim();

  return (
    <Dialog
      open={open}
      onClose={saving ? undefined : () => onClose(false)}
      maxWidth="md"
      fullWidth
      fullScreen={fullScreen}
      aria-labelledby="job-dialog-title"
    >
      <DialogTitle
        id="job-dialog-title"
        sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}
      >
        {isEdit ? "Edit Application" : "Track & Tailor New Application"}
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {dialogError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {dialogError}
          </Alert>
        )}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                autoFocus
                label="Company Name"
                value={form.company}
                onChange={set("company")}
                slotProps={{ htmlInput: { maxLength: 200 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                required
                label="Job Title"
                value={form.role}
                onChange={set("role")}
                slotProps={{ htmlInput: { maxLength: 200 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                type="url"
                label="Job Posting URL"
                placeholder="https://..."
                value={form.url}
                onChange={set("url")}
                error={urlInvalid}
                helperText={urlInvalid ? "Must start with http:// or https://" : " "}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={form.status}
                onChange={set("status")}
              >
                {JOB_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
          </Grid>

          <TextField
            fullWidth
            label="Job Description"
            multiline
            minRows={isEdit ? 4 : 6}
            maxRows={14}
            placeholder="Paste the job description here so AI can analyze and tailor your CV..."
            value={form.jobDescription}
            onChange={set("jobDescription")}
            helperText={
              isEdit
                ? "Editing the description does not regenerate the tailored CV."
                : "Optional. With a description, AI drafts a tailored cover letter (takes a few seconds)."
            }
          />

          <TextField
            fullWidth
            label="Notes"
            multiline
            minRows={2}
            maxRows={8}
            placeholder="Recruiter contact, interview dates, salary range..."
            value={form.notes}
            onChange={set("notes")}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={() => onClose(false)} disabled={saving} sx={{ color: "text.secondary" }}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={saving || !form.company.trim() || !form.role.trim() || urlInvalid}
          onClick={handleSubmit}
          startIcon={saving ? <CircularProgress size={16} color="inherit" /> : undefined}
          sx={{
            background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          {saving
            ? willUseAi
              ? "Tailoring with AI..."
              : "Saving..."
            : isEdit
              ? "Save Changes"
              : willUseAi
                ? "Tailor CV with AI"
                : "Add Application"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
