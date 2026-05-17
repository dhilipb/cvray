"use client";

import React, { useState, useEffect, use } from "react";
import { Box, Typography, CircularProgress, Alert, Stack, IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { CVData } from "@/lib/types";
import CVWizard, { WizardData } from "@/components/cv/CVWizard";

/* --------- Page Component --------- */

export default function ProfileEditPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [wizardData, setWizardData] = useState<WizardData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
    profileName: "",
    profileDescription: "",
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/profiles/${profileId}`);
        const data = await res.json();
        if (data.success) {
          const profile = data.profile;
          let cvData: CVData = {
            name: "",
            title: "",
            email: "",
            phone: "",
            summary: "",
            skills: [],
            experience: [],
            education: [],
            certifications: [],
          };

          if (profile.parsedProfileJson) {
            try {
              cvData = JSON.parse(profile.parsedProfileJson);
            } catch (e) {
              console.error("Failed to parse profile JSON", e);
            }
          }

          setWizardData({
            ...cvData,
            profileName: profile.name,
            profileDescription: profile.description || "",
          });
        } else {
          setError(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        setError("An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleSave = async (updatedData: WizardData) => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const { profileName, profileDescription, ...cvData } = updatedData;

      const res = await fetch(`/api/profiles/${profileId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profileName,
          description: profileDescription,
          parsedProfileJson: cvData,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setWizardData(updatedData);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(data.error || "Failed to save profile");
      }
    } catch (err) {
      setError("An error occurred during save");
      console.error(err);
    } finally {
      setSaving(false);
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
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <IconButton
            onClick={() => router.push(`/profiles/${profileId}/jobs`)}
            sx={{ color: "text.secondary", p: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" sx={{ fontWeight: 800, color: "text.primary" }}>
            Edit Profile
          </Typography>
        </Stack>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2, py: 0 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" sx={{ mb: 2, py: 0 }}>
          Profile saved successfully!
        </Alert>
      )}

      <CVWizard
        initialData={wizardData}
        onSave={handleSave}
        saving={saving}
        showMetadataStep={true}
        title=""
      />
    </Box>
  );
}
