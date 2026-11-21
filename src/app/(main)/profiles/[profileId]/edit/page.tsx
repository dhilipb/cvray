"use client";

import React, { useState, useEffect, use, useCallback, useRef } from "react";
import { Box, Typography, Alert, Stack, IconButton, Skeleton, Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { CVData } from "@/lib/types";
import CVWizard, { WizardData } from "@/components/cv/CVWizard";
import { Toast, ToastState } from "@/components/cv/Toast";

/* --------- Page Component --------- */

export default function ProfileEditPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [dirty, setDirty] = useState(false);
  // JSON of the last saved data; the wizard's first onChange (normalized initial data) seeds it
  const savedJson = useRef<string | null>(null);

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
        if (res.ok && data.success) {
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
          setLoadError(data.error || "Failed to fetch profile");
        }
      } catch (err) {
        setLoadError("An error occurred while loading the profile");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  const handleChange = useCallback((d: WizardData) => {
    const json = JSON.stringify(d);
    if (savedJson.current === null) savedJson.current = json;
    setDirty(json !== savedJson.current);
  }, []);

  // Warn before leaving the page with unsaved edits
  useEffect(() => {
    if (!dirty) return;
    const warn = (e: BeforeUnloadEvent) => e.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  const handleSave = async (updatedData: WizardData) => {
    try {
      setSaving(true);

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
      if (res.ok && data.success) {
        savedJson.current = JSON.stringify(updatedData);
        setDirty(false);
        setToast({ message: "Profile saved", severity: "success" });
      } else {
        setToast({ message: data.error || "Failed to save profile", severity: "error" });
      }
    } catch (err) {
      setToast({ message: "An error occurred during save", severity: "error" });
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const goBack = () => {
    if (dirty && !window.confirm("You have unsaved changes. Leave anyway?")) return;
    router.push(`/profiles/${profileId}/jobs`);
  };

  return (
    <Box sx={{ pb: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <IconButton
            onClick={goBack}
            aria-label="Back to applications"
            sx={{ color: "text.secondary", p: 0.5 }}
          >
            <ArrowBackIcon fontSize="small" />
          </IconButton>
          <Typography variant="h5" component="h1" sx={{ fontWeight: 800, color: "text.primary" }}>
            Edit Profile
          </Typography>
          {dirty && (
            <Typography variant="caption" color="warning.main">
              Unsaved changes
            </Typography>
          )}
        </Stack>
      </Box>

      {loading ? (
        <Stack spacing={2}>
          <Skeleton variant="rounded" height={56} />
          <Skeleton variant="rounded" height={360} />
        </Stack>
      ) : loadError ? (
        // Never render the wizard on load failure: saving blank data would overwrite the profile
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => router.push("/profiles")}>
              Back
            </Button>
          }
        >
          {loadError}
        </Alert>
      ) : (
        <CVWizard
          key={profileId}
          initialData={wizardData}
          onSave={handleSave}
          onChange={handleChange}
          saving={saving}
          showMetadataStep={true}
          title=""
        />
      )}

      <Toast toast={toast} onClose={() => setToast(null)} />
    </Box>
  );
}
