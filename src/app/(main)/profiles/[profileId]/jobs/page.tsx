"use client";

import React, { useState, useEffect, use, useCallback, useMemo } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  CircularProgress,
  Alert,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import SortIcon from "@mui/icons-material/Sort";
import { useRouter } from "next/navigation";
import { JobItemRow } from "@/components/cv/JobItemRow";
import { NewJobDialog } from "@/components/cv/NewJobDialog";

/* --------- Interface & Types --------- */
interface Job {
  id: string;
  company: string;
  role: string;
  status: string;
  appliedAt: string;
  tweakedCvJson?: string;
}

/* --------- Page Component --------- */
export default function JobsPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [profileName, setProfileName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openNewJob, setOpenNewJob] = useState(false);

  /* --------- Search, Filter, Sort State --------- */
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

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

  /* --------- Filter & Sort Logic --------- */
  const filteredJobs = useMemo(() => {
    let result = [...jobs];
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (j) => j.role.toLowerCase().includes(q) || j.company.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "All") {
      result = result.filter((j) => j.status === statusFilter);
    }
    result.sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.appliedAt).getTime() - new Date(a.appliedAt).getTime();
      if (sortBy === "oldest")
        return new Date(a.appliedAt).getTime() - new Date(b.appliedAt).getTime();
      if (sortBy === "company") return a.company.localeCompare(b.company);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      return 0;
    });
    return result;
  }, [jobs, searchQuery, statusFilter, sortBy]);

  const statuses = useMemo(
    () => ["All", ...Array.from(new Set(jobs.map((j) => j.status)))],
    [jobs],
  );

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
          "&:hover": { color: "text.primary" },
        }}
      >
        Back to Profiles
      </Button>

      {/* Header with Edit Profile and Track New Job Actions */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "text.primary" }}
        >
          {profileName ? `${profileName} Applications` : "Job Tracking"}
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => router.push(`/profiles/${profileId}/edit`)}
            sx={{
              borderColor: "rgba(16, 185, 129, 0.4)",
              color: "#10b981",
              fontWeight: 600,
              "&:hover": { borderColor: "#10b981", bgcolor: "rgba(16, 185, 129, 0.05)" },
            }}
          >
            Edit Profile
          </Button>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setOpenNewJob(true)}
            sx={{
              background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            Track New Job
          </Button>
        </Stack>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Keep track of all your applications for this profile. Create a new job to instantly tailor a
        CV against the job description using AI.
      </Typography>

      {/* Filter and Sort Bar */}
      {jobs.length > 0 && (
        <Box
          sx={{
            mb: 4,
            p: 2,
            bgcolor: "rgba(255,255,255,0.02)",
            borderRadius: 2,
            border: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search by role or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                slotProps={{
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
            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
              <FormControl fullWidth size="small">
                <InputLabel id="status-filter-label">Status</InputLabel>
                <Select
                  labelId="status-filter-label"
                  id="status-filter"
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                  startAdornment={
                    <InputAdornment position="start">
                      <FilterListIcon sx={{ color: "text.secondary", fontSize: 20, mr: 1 }} />
                    </InputAdornment>
                  }
                  sx={{ bgcolor: "background.paper" }}
                >
                  {statuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3.5 }}>
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
                  <MenuItem value="newest">Date Applied (Newest)</MenuItem>
                  <MenuItem value="oldest">Date Applied (Oldest)</MenuItem>
                  <MenuItem value="company">Company (A-Z)</MenuItem>
                  <MenuItem value="role">Role (A-Z)</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {/* Jobs List Grid */}
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
            onClick={() => setOpenNewJob(true)}
            startIcon={<AddIcon />}
          >
            Track your first job
          </Button>
        </Box>
      ) : filteredJobs.length === 0 ? (
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
            No applications match your current filters
          </Typography>
          <Button
            variant="text"
            color="primary"
            onClick={() => {
              setSearchQuery("");
              setStatusFilter("All");
              setSortBy("newest");
            }}
          >
            Clear all filters
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {filteredJobs.map((job) => (
            <Grid size={{ xs: 12 }} key={job.id}>
              <JobItemRow
                job={job}
                onClick={(jobId) => router.push(`/profiles/${profileId}/jobs/${jobId}/cv`)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      <NewJobDialog
        open={openNewJob}
        profileId={profileId}
        onClose={(success) => {
          setOpenNewJob(false);
          if (success) fetchJobs();
        }}
      />
    </Box>
  );
}
