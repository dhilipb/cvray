"use client";
import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Button, Grid, Card, CardContent, CardActionArea, CardActions, 
  Chip, CircularProgress, Alert, Dialog, DialogTitle, DialogContent, 
  DialogActions, TextField, IconButton 
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CloseIcon from "@mui/icons-material/Close";
import { useRouter } from "next/navigation";
import { Profile } from "@/lib/types";

import CVPreviewer from "@/components/cv/CVPreviewer";

export default function ProfilesPage() {
  const router = useRouter();
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedProfileData, setSelectedProfileData] = useState<any>(null);

  /* --------- Create Profile Dialog State --------- */
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

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

  const handlePreview = (e: React.MouseEvent, profile: Profile) => {
    e.stopPropagation(); // Prevent card click
    try {
      const parsedData = JSON.parse(profile.parsedProfileJson);
      setSelectedProfileData(parsedData);
      setPreviewOpen(true);
    } catch (err) {
      console.error("Failed to parse profile JSON", err);
    }
  };

  const handleCardClick = (id: string) => {
    router.push(`/profiles/${id}/jobs`);
  };

  const handleCreateProfile = () => {
    setCreateDialogOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("name", newName || "New Profile");
      formData.append("description", newDescription);

      const res = await fetch("/api/upload-cv", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        setCreateDialogOpen(false);
        setNewName("");
        setNewDescription("");
        setSelectedFile(null);
        // Redirect to the edit page for the new profile
        router.push(`/profiles/${data.profile.id}/edit`);
      } else {
        alert(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#10b981" }} />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
          Base Profiles
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateProfile}
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
        Manage your foundational profiles. Select a profile to start tracking and tailoring job applications for it.
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}

      {profiles.length === 0 && !error ? (
        <Box sx={{ textAlign: "center", py: 8, bgcolor: "background.paper", borderRadius: 2, border: "1px dashed rgba(255,255,255,0.1)" }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No profiles found
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Upload your first CV to create a base profile.
          </Typography>
          <Button variant="outlined" color="primary" onClick={handleCreateProfile} startIcon={<AddIcon />}>
            Upload CV
          </Button>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {profiles.map((profile) => {
            let role = "Profile";
            try {
              const parsed = JSON.parse(profile.parsedProfileJson);
              role = parsed.title || "User Profile";
            } catch (e) {}

            return (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={profile.id}>
                <Card
                  sx={{
                    bgcolor: "background.paper",
                    border: "1px solid rgba(255,255,255,0.05)",
                    borderRadius: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                      borderColor: "rgba(16,185,129,0.3)",
                    },
                  }}
                >
                  <CardActionArea onClick={() => handleCardClick(profile.id)} sx={{ flexGrow: 1 }}>
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "rgba(16,185,129,0.1)",
                            color: "#10b981",
                            mr: 2,
                          }}
                        >
                          <PersonIcon />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {profile.name}
                        </Typography>
                      </Box>
                      <Chip label={role} size="small" sx={{ mb: 2, bgcolor: "rgba(255,255,255,0.05)" }} />
                      {profile.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ 
                          mb: 2, 
                          display: "-webkit-box", 
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: "vertical", 
                          overflow: "hidden" 
                        }}>
                          {profile.description}
                        </Typography>
                      )}
                      <Typography variant="body2" color="text.secondary">
                        Last updated: {new Date(profile.updatedAt).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "space-between" }}>
                    <Button size="small" onClick={(e) => { e.stopPropagation(); router.push(`/profiles/${profile.id}/edit`); }} sx={{ color: "#10b981" }}>Edit Profile</Button>
                    <Button size="small" onClick={(e) => handlePreview(e, profile)} sx={{ color: "text.secondary" }}>Preview</Button>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {/* --------- Create Profile Dialog --------- */}
      <Dialog 
        open={createDialogOpen} 
        onClose={() => setCreateDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        slotProps={{ paper: { sx: { bgcolor: "background.paper", backgroundImage: "none" } } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Create New Profile</Typography>
          <IconButton onClick={() => setCreateDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              label="Profile Name"
              placeholder="e.g. Senior QA Engineer - Fintech"
              fullWidth
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              variant="outlined"
            />
            <TextField
              label="Overview / High-level Description"
              placeholder="What is this profile about? (e.g. Focus on automation, leadership, or specific industry experience)"
              fullWidth
              multiline
              rows={4}
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              variant="outlined"
            />
            
            <Box>
              <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>Base CV / Resume</Typography>
              {!selectedFile ? (
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  startIcon={<CloudUploadIcon />}
                  sx={{ 
                    py: 4, 
                    borderStyle: "dashed", 
                    borderColor: "rgba(255,255,255,0.2)",
                    bgcolor: "transparent",
                    "&:hover": { borderColor: "#10b981" }
                  }}
                >
                  Click to upload or drag and drop (PDF, DOCX, TXT)
                  <input
                    type="file"
                    hidden
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                  />
                </Button>
              ) : (
                <Box sx={{ 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  p: 2, 
                  border: "1px solid #10b981", 
                  borderRadius: 1,
                  bgcolor: "rgba(16,185,129,0.05)"
                }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <CloudUploadIcon sx={{ color: "#10b981", mr: 2 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                      {selectedFile.name}
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => setSelectedFile(null)} sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}>
                    <CloseIcon />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setCreateDialogOpen(false)} sx={{ color: "text.secondary" }}>
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={uploading}
            onClick={handleUpload}
            sx={{ 
              background: "linear-gradient(to right, #10b981 0%, #059669 100%)", 
              color: "#fff",
              px: 4,
              fontWeight: 600
            }}
          >
            {uploading ? "Parsing CV..." : "Create Profile"}
          </Button>
        </DialogActions>
      </Dialog>

      <CVPreviewer 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        // @ts-ignore - We need to update CVPreviewer to accept data directly or handle this
        cvData={selectedProfileData} 
      />
    </Box>
  );
}
