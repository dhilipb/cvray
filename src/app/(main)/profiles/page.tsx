"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Box, Typography, Button, Grid, Alert, Skeleton, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/navigation";

import { ProfileCard, ProfileWithCount } from "@/components/cv/ProfileCard";
import { CreateProfileDialog } from "@/components/cv/CreateProfileDialog";
import { ConfirmDialog } from "@/components/cv/ConfirmDialog";
import { Toast, ToastState } from "@/components/cv/Toast";

/* --------- Page Component --------- */

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<ProfileWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [deletingProfile, setDeletingProfile] = useState<ProfileWithCount | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const fetchProfiles = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (res.ok && data.success) {
        setProfiles(data.profiles);
      } else {
        setError(data.error || "Failed to fetch profiles");
      }
    } catch (err) {
      setError("An error occurred while fetching profiles");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfiles();
  }, [fetchProfiles]);

  const handleDelete = async () => {
    if (!deletingProfile) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/profiles/${deletingProfile.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setProfiles((list) => list.filter((p) => p.id !== deletingProfile.id));
      setToast({ message: "Profile deleted", severity: "success" });
      setDeletingProfile(null);
    } catch {
      setToast({ message: "Failed to delete profile", severity: "error" });
    } finally {
      setDeleting(false);
    }
  };

  const jobCount = deletingProfile?._count?.JobApplications ?? 0;

  return (
    <Box>
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
          }}
        >
          Base Profiles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setCreateDialogOpen(true)}
          sx={{
            background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
            color: "#fff",
          }}
        >
          Create Profile
        </Button>
      </Stack>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your foundational profiles. Select a profile to start tracking and tailoring job
        applications for it.
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 4 }}
          action={
            <Button color="inherit" size="small" onClick={fetchProfiles}>
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {loading ? (
        <Grid container spacing={3}>
          {[0, 1, 2].map((i) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={i}>
              <Skeleton variant="rounded" height={240} sx={{ borderRadius: 3.5 }} />
            </Grid>
          ))}
        </Grid>
      ) : profiles.length === 0 && !error ? (
        <Box
          sx={{
            textAlign: "center",
            py: 8,
            px: 2,
            bgcolor: "background.paper",
            borderRadius: 2,
            border: "1px dashed rgba(255,255,255,0.1)",
          }}
        >
          <CloudUploadIcon sx={{ fontSize: 48, color: "rgba(16,185,129,0.6)", mb: 1 }} />
          <Typography variant="h6" color="text.primary" gutterBottom>
            No profiles yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your CV and AI will turn it into an editable base profile.
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setCreateDialogOpen(true)}
            startIcon={<AddIcon />}
          >
            Upload CV
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={profile.id}>
              <ProfileCard
                profile={profile}
                onClick={(id) => router.push(`/profiles/${id}/jobs`)}
                onEdit={(id) => router.push(`/profiles/${id}/edit`)}
                onDelete={setDeletingProfile}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Dialog navigates to the new profile on success, so no refetch is needed on close */}
      <CreateProfileDialog open={createDialogOpen} onClose={() => setCreateDialogOpen(false)} />

      <ConfirmDialog
        open={!!deletingProfile}
        title="Delete profile?"
        message={
          deletingProfile && (
            <>
              <strong>{deletingProfile.name}</strong>
              {jobCount > 0
                ? ` and its ${jobCount} job application${jobCount === 1 ? "" : "s"} will be permanently deleted.`
                : " will be permanently deleted."}
            </>
          )
        }
        loading={deleting}
        onConfirm={handleDelete}
        onClose={() => setDeletingProfile(null)}
      />

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Box>
  );
}
