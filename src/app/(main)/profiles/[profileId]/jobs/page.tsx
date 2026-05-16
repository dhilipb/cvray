"use client";

import React, { useState, useEffect, use, useCallback } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import WorkIcon from "@mui/icons-material/Work";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";

interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedAt: string;
  tweakedCvJson?: string;
}

export default function JobsPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);

  const [jobs, setJobs] = useState<Job[]>([]);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [openNewJob, setOpenNewJob] = useState(false);
  const [newJobData, setNewJobData] = useState({
    company: "",
    role: "",
    jobDescription: "",
    url: "",
  });
  const [creating, setCreating] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const fetchJobs = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/profiles/${profileId}/jobs`);
      const data = await res.json();
      if (data.success) {
        setJobs(data.jobs);
        setProfileName(data.profileName || "");
      } else {
        setError(data.error || "Failed to fetch jobs");
      }
    } catch (err) {
      setError("An error occurred while fetching jobs");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

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
        setOpenNewJob(false);
        setNewJobData({ company: "", role: "", jobDescription: "", url: "" });
        setDialogError(null);
        fetchJobs(); // Refresh list
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

  if (loading) {
    return (
      <Box
        sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}
      >
        <CircularProgress sx={{ color: "#10b981" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/profiles")}
        sx={{
          color: "text.secondary",
          mb: 2,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
            color: "text.primary",
          },
        }}
      >
        Back to Profiles
      </Button>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
          {profileName ? `${profileName} Applications` : "Job Tracking"}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => {
            setDialogError(null);
            setOpenNewJob(true);
          }}
          sx={{
            background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Track New Job
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Keep track of all your applications for this profile. Create a new job to instantly tailor a
        CV against the job description using AI.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {jobs.length === 0 && !error ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No job applications tracked yet
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setDialogError(null);
              setOpenNewJob(true);
            }}
            startIcon={<AddIcon />}
          >
            Track your first job
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {jobs.map((job) => (
            <Grid size={{ xs: 12 }} key={job.id}>
              <Card
                onClick={() => router.push(`/profiles/${profileId}/jobs/${job.id}/cv`)}
                sx={{
                  bgcolor: "background.paper",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: 2,
                  display: "flex",
                  alignItems: "center",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "&:hover": {
                    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                    borderColor: "rgba(16,185,129,0.4)",
                    transform: "translateY(-2px)",
                    bgcolor: "rgba(255,255,255,0.02)",
                  },
                }}
              >
                <CardContent
                  sx={{ display: "flex", flexGrow: 1, alignItems: "center", py: "16px !important" }}
                >
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: 1,
                      bgcolor: "rgba(16,185,129,0.1)",
                      color: "#10b981",
                      mr: 3,
                    }}
                  >
                    <WorkIcon />
                  </Box>
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {job.role}{" "}
                      <Typography component="span" variant="body1" color="text.secondary">
                        at {job.company}
                      </Typography>
                    </Typography>
                    <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Typography variant="body2" color="text.secondary">
                        Applied: {new Date(job.appliedAt).toLocaleDateString()}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Chip
                      label={job.status}
                      size="small"
                      sx={{
                        bgcolor:
                          job.status === "Interviewing"
                            ? "rgba(245, 158, 11, 0.1)"
                            : "rgba(16, 185, 129, 0.1)",
                        color: job.status === "Interviewing" ? "#f59e0b" : "#10b981",
                        fontWeight: 500,
                      }}
                    />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* New Job Dialog */}
      <Dialog
        open={openNewJob}
        onClose={() => setOpenNewJob(false)}
        maxWidth="md"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: "background.paper", backgroundImage: "none" } } }}
      >
        <DialogTitle sx={{ fontWeight: 600 }}>Track & Tailor New Application</DialogTitle>
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
          <Button onClick={() => setOpenNewJob(false)} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={creating || !newJobData.company || !newJobData.role}
            onClick={handleCreateJob}
            sx={{
              background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
              color: "#fff",
            }}
          >
            {creating ? "Creating..." : "Tailor CV with AI"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
