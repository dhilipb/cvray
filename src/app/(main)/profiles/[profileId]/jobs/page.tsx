"use client";

import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
  Chip,
  Skeleton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import SortIcon from "@mui/icons-material/Sort";
import WorkOutlineIcon from "@mui/icons-material/WorkOutlined";
import { useRouter } from "next/navigation";
import { JobItemRow } from "@/components/cv/JobItemRow";
import { NewJobDialog } from "@/components/cv/NewJobDialog";
import { ConfirmDialog } from "@/components/cv/ConfirmDialog";
import { Toast, ToastState } from "@/components/cv/Toast";
import { JOB_STATUSES, STATUS_COLORS, Job } from "@/components/cv/jobUtils";

const emptyStateSx = {
  textAlign: "center",
  py: 8,
  px: 2,
  bgcolor: "background.paper",
  borderRadius: 2,
  border: "1px dashed rgba(255,255,255,0.1)",
} as const;

const time = (d?: string) => (d ? new Date(d).getTime() : 0);

/* --------- Page Component --------- */
export default function JobsPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);

  /* --------- Dialog State --------- */
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [deletingJob, setDeletingJob] = useState<Job | null>(null);
  const [deleting, setDeleting] = useState(false);

  /* --------- Search, Filter, Sort State --------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const fetchJobs = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch(`/api/profiles/${profileId}/jobs`);
      const data = await res.json();
      if (res.ok && data.success) {
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

  /* --------- Mutations --------- */
  const jobUrl = (id: string) => `/api/profiles/${profileId}/jobs/${id}`;

  const handleStatusChange = async (job: Job, status: string) => {
    const previous = jobs;
    setJobs((list) => list.map((j) => (j.id === job.id ? { ...j, status } : j))); // optimistic
    try {
      const res = await fetch(jobUrl(job.id), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setJobs((list) => list.map((j) => (j.id === job.id ? data.job : j)));
      setToast({ message: `Moved to ${status}`, severity: "success" });
    } catch {
      setJobs(previous);
      setToast({ message: "Failed to update status", severity: "error" });
    }
  };

  const handleDuplicate = async (job: Job) => {
    try {
      const res = await fetch(`${jobUrl(job.id)}/duplicate`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error);
      setJobs((list) => [data.job, ...list]);
      setToast({ message: "Application duplicated", severity: "success" });
    } catch {
      setToast({ message: "Failed to duplicate application", severity: "error" });
    }
  };

  const handleDelete = async () => {
    if (!deletingJob) return;
    setDeleting(true);
    try {
      const res = await fetch(jobUrl(deletingJob.id), { method: "DELETE" });
      if (!res.ok) throw new Error();
      setJobs((list) => list.filter((j) => j.id !== deletingJob.id));
      setToast({ message: "Application deleted", severity: "success" });
      setDeletingJob(null);
    } catch {
      setToast({ message: "Failed to delete application", severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  /* --------- Filter & Sort Logic --------- */
  const counts = useMemo(() => {
    const c: Record<string, number> = { All: jobs.length };
    for (const j of jobs) c[j.status] = (c[j.status] ?? 0) + 1;
    return c;
  }, [jobs]);

  const filteredJobs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const result = jobs.filter(
      (j) =>
        (statusFilter === "All" || j.status === statusFilter) &&
        (!q ||
          j.role.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          (j.notes ?? "").toLowerCase().includes(q)),
    );
    result.sort((a, b) => {
      if (sortBy === "oldest") return time(a.appliedAt) - time(b.appliedAt);
      if (sortBy === "updated") return time(b.updatedAt) - time(a.updatedAt);
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      return time(b.appliedAt) - time(a.appliedAt);
    });
    return result;
  }, [jobs, searchQuery, statusFilter, sortBy]);

  // Include any legacy status not in the pipeline so its jobs stay filterable
  const statusChips = [
    "All",
    ...JOB_STATUSES,
    ...Object.keys(counts).filter(
      (s) => s !== "All" && !(JOB_STATUSES as readonly string[]).includes(s),
    ),
  ];

  const openCreate = () => {
    setEditingJob(null);
    setDialogOpen(true);
  };

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => router.push("/profiles")}
        sx={{
          color: "text.secondary",
          mb: 2,
          "&:hover": { color: "text.primary", boxShadow: "none" },
        }}
      >
        Back to Profiles
      </Button>

      {/* Header with Edit Profile and Track New Job Actions */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "center" }, mb: 2 }}
      >
        <Typography
          variant="h4"
          component="h1"
          sx={{
            fontWeight: 800,
            fontFamily: '"Outfit", sans-serif',
            color: "text.primary",
            fontSize: { xs: "1.75rem", sm: "2.125rem" },
            wordBreak: "break-word",
          }}
        >
          {loading ? (
            <Skeleton width={280} />
          ) : profileName ? (
            `${profileName} Applications`
          ) : (
            "Job Tracking"
          )}
        </Typography>
        <Stack direction="row" spacing={1.5}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/profiles/${profileId}/edit`)}
            sx={{
              flex: { xs: 1, sm: "none" },
              borderColor: "rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              "&:hover": { borderColor: "#10b981", bgcolor: "rgba(16, 185, 129, 0.05)" },
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{
              flex: { xs: 1, sm: "none" },
              background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
              color: "#fff",
            }}
          >
            Track New Job
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Keep track of all your applications for this profile. Add a job description to instantly
        tailor a CV and cover letter using AI.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={() => router.push("/profiles")}>
              Back
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Status pipeline chips + search/sort */}
      {!loading && jobs.length > 0 && (
        <Box
          sx={{
            mb: 3,
            p: 2,
            bgcolor: "rgba(255,255,255,0.02)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Stack
            direction="row"
            role="group"
            aria-label="Filter by status"
            sx={{ flexWrap: "wrap", gap: 1, mb: 2 }}
          >
            {statusChips.map((s) => {
              const selected = statusFilter === s;
              const color = STATUS_COLORS[s] ?? "#10b981";
              return (
                <Chip
                  key={s}
                  label={`${s} · ${counts[s] ?? 0}`}
                  onClick={() => setStatusFilter(s)}
                  aria-pressed={selected}
                  variant={selected ? "filled" : "outlined"}
                  sx={{
                    fontWeight: 600,
                    borderColor: `${color}55`,
                    color: selected ? "#fff" : color,
                    bgcolor: selected ? `${color}cc` : "transparent",
                    "&:hover": { bgcolor: selected ? color : `${color}1a` },
                  }}
                />
              );
            })}
          </Stack>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by role, company or notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
                  htmlInput: { "aria-label": "Search applications" },
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{ "& .MuiOutlinedInput-root": { bgcolor: "background.paper" } }}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="sort-by-label">Sort By</InputLabel>
                <Select
                  labelId="sort-by-label"
                  id="sort-by"
                  value={sortBy}
                  label="Sort By"
                  onChange={(e) => setSortBy(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <SortIcon sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: "background.paper" }}
                >
                  <MenuItem value="newest">Date Added (Newest)</MenuItem>
                  <MenuItem value="oldest">Date Added (Oldest)</MenuItem>
                  <MenuItem value="updated">Recently Updated</MenuItem>
                  <MenuItem value="company">Company (A-Z)</MenuItem>
                  <MenuItem value="role">Role (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Jobs List */}
      {loading ? (
        <Stack spacing={2}>
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} variant="rounded" height={76} />
          ))}
        </Stack>
      ) : error ? null : jobs.length === 0 ? (
        <Box sx={emptyStateSx}>
          <WorkOutlineIcon sx={{ fontSize: 48, color: "rgba(16,185,129,0.6)", mb: 1 }} />
          <Typography variant="h6" color="text.primary" gutterBottom>
            No job applications tracked yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Add a role you&apos;re interested in and let AI tailor your CV for it.
          </Typography>
          <Button variant="outlined" onClick={openCreate} startIcon={<AddIcon />}>
            Track your first job
          </Button>
        </Box>
      ) : filteredJobs.length === 0 ? (
        <Box sx={emptyStateSx}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications match your current filters
          </Typography>
          <Button
            variant="text"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
            }}
          >
            Clear filters
          </Button>
        </Box>
      ) : (
        <Stack spacing={2}>
          {filteredJobs.map((job) => (
            <JobItemRow
              key={job.id}
              job={job}
              onClick={(jobId) => router.push(`/profiles/${profileId}/jobs/${jobId}/cv`)}
              onStatusChange={handleStatusChange}
              onEdit={(j) => {
                setEditingJob(j);
                setDialogOpen(true);
              }}
              onDuplicate={handleDuplicate}
              onDelete={setDeletingJob}
            />
          ))}
        </Stack>
      )}

      <NewJobDialog
        open={dialogOpen}
        profileId={profileId}
        job={editingJob}
        onClose={(success) => {
          setDialogOpen(false);
          if (success) {
            setToast({
              message: editingJob ? "Application updated" : "Application added",
              severity: "success",
            });
            fetchJobs();
          }
        }}
      />

      <ConfirmDialog
        open={!!deletingJob}
        title="Delete application?"
        message={
          deletingJob && (
            <>
              <strong>{deletingJob.role}</strong> at <strong>{deletingJob.company}</strong> and its
              tailored CV will be permanently deleted.
            </>
          )
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingJob(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Box>
  );
}
