"use client";

import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Grid, CircularProgress, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";

import { ProfileCard } from "@/components/cv/ProfileCard";
import { CreateProfileDialog } from "@/components/cv/CreateProfileDialog";

/* --------- Page Component --------- */

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/profiles");
      const data = await res.json();
      if (data.success) {
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
  };

  const handleCardClick = (id: string) => {
    router.push(`/profiles/${id}/jobs`);
  };

  const handleEditClick = (id: string) => {
    router.push(`/profiles/${id}/edit`);
  };

  const handleDialogClose = () => {
    setCreateDialogOpen(false);
    fetchProfiles(); // Refresh profiles on close in case one was created
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
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: 800, fontFamily: '"Outfit", sans-serif', color: "text.primary" }}
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
            fontWeight: 600,
          }}
        >
          Create Profile
        </Button>
      </Box>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Manage your foundational profiles. Select a profile to start tracking and tailoring job
        applications for it.
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {profiles.length === 0 && !error ? (
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
            No profiles found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first CV to create a base profile.
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
              <ProfileCard profile={profile} onClick={handleCardClick} onEdit={handleEditClick} />
            </Grid>
          ))}
        </Grid>
      )}

      <CreateProfileDialog open={createDialogOpen} onClose={handleDialogClose} />
    </Box>
  );
}
