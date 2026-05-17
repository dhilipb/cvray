"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useRouter } from "next/navigation";

/* --------- Interface & Props --------- */
interface CreateProfileDialogProps {
  open: boolean;
  onClose: () => void;
}

/* --------- CreateProfileDialog Component --------- */
export function CreateProfileDialog({ open, onClose }: CreateProfileDialogProps) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [dialogError, setDialogError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    try {
      setUploading(true);
      setDialogError(null);
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
        onClose();
        setNewName("");
        setNewDescription("");
        setSelectedFile(null);
        router.push(`/profiles/${data.profile.id}/edit`);
      } else {
        setDialogError(data.error || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      setDialogError("An error occurred during upload");
    } finally {
      setUploading(false);
    }
  };

  const handleCancel = () => {
    setNewName("");
    setNewDescription("");
    setSelectedFile(null);
    setDialogError(null);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleCancel}
      maxWidth="sm"
      fullWidth
      slotProps={{ paper: { sx: { bgcolor: "background.paper", backgroundImage: "none" } } }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6" sx={{ fontWeight: 700, fontFamily: '"Outfit", sans-serif' }}>
          Create New Profile
        </Typography>
        <IconButton onClick={handleCancel} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ borderColor: "rgba(255,255,255,0.05)" }}>
        {dialogError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {dialogError}
          </Alert>
        )}
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
            placeholder="What is this profile about? (e.g. Focus on automation, leadership, or specific experience)"
            fullWidth
            multiline
            rows={4}
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            variant="outlined"
          />

          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Base CV / Resume
            </Typography>
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
                  "&:hover": { borderColor: "#10b981" },
                }}
              >
                Click to upload or drag and drop (PDF, DOCX, TXT)
                <input type="file" hidden accept=".pdf,.docx,.txt" onChange={handleFileChange} />
              </Button>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 2,
                  border: "1px solid #10b981",
                  borderRadius: 1,
                  bgcolor: "rgba(16,185,129,0.05)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <CloudUploadIcon sx={{ color: "#10b981", mr: 2 }} />
                  <Typography variant="body2" sx={{ fontWeight: 500, color: "text.primary" }}>
                    {selectedFile.name}
                  </Typography>
                </Box>
                <IconButton
                  size="small"
                  onClick={() => setSelectedFile(null)}
                  sx={{ color: "text.secondary", "&:hover": { color: "error.main" } }}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}
          </Box>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleCancel} sx={{ color: "text.secondary" }}>
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
            fontWeight: 600,
          }}
        >
          {uploading ? "Parsing CV..." : "Create Profile"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
