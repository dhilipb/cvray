"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import {
  Box,
  Paper,
  Stepper,
  Step,
  StepButton,
  Button,
  Typography,
  Divider,
  CircularProgress,
  TextField,
  Grid,
  LinearProgress,
  Alert,
} from "@mui/material";
import {
  FileDownload as FileDownloadIcon,
  FileUpload as FileUploadIcon,
} from "@mui/icons-material";
import { CVData } from "@/lib/types";
import { PersonalInfoStep } from "./wizard/PersonalInfoStep";
import { SummaryStep } from "./wizard/SummaryStep";
import { SkillsStep } from "./wizard/SkillsStep";
import { ExperienceStep } from "./wizard/ExperienceStep";
import { EducationStep } from "./wizard/EducationStep";
import { CertificationsStep } from "./wizard/CertificationsStep";
import { CoverLetterStep } from "./wizard/CoverLetterStep";
import { OtherInfoStep } from "./wizard/OtherInfoStep";
import { normalizeCV, parseCV, validateStep, StepErrors } from "./wizard/utils";

const PreviewStep = dynamic(() => import("./wizard/PreviewStep"), {
  ssr: false,
  loading: () => (
    <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
      <CircularProgress />
    </Box>
  ),
});

/* --------- Types --------- */

export interface WizardData extends CVData {
  profileName?: string;
  profileDescription?: string;
}

interface Props {
  initialData: WizardData;
  onSave?: (data: WizardData) => Promise<void>;
  saving?: boolean;
  title?: string;
  showMetadataStep?: boolean;
  /** Called with the latest data after every change (e.g. to persist a draft). */
  onChange?: (data: WizardData) => void;
}

/* --------- Metadata Step --------- */

function MetadataStep({
  data,
  updateData,
  errors,
}: {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  errors: StepErrors;
}) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Profile Metadata
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Internal Profile Name"
            fullWidth
            size="small"
            required
            value={data.profileName || ""}
            onChange={(e) => updateData({ profileName: e.target.value })}
            error={!!errors.profileName}
            helperText={errors.profileName || "Visible only to you in the dashboard"}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            label="Profile Overview"
            fullWidth
            size="small"
            multiline
            rows={3}
            value={data.profileDescription || ""}
            onChange={(e) => updateData({ profileDescription: e.target.value })}
            helperText="High-level description of this professional persona"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

/* --------- Main Component --------- */

export default function CVWizard({
  initialData,
  onSave,
  saving = false,
  title = "CV Wizard",
  showMetadataStep = false,
  onChange,
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  // Parents remount (via `key`) to replace data. The old initialData->state sync effect
  // reverted any edits typed while a save was in flight.
  const [data, setData] = useState<WizardData>(() => normalizeCV(initialData));
  const [showErrors, setShowErrors] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const prevStep = useRef(activeStep);

  const steps = [
    ...(showMetadataStep ? ["Metadata"] : []),
    "Personal Info",
    "Summary",
    "Skills",
    "Experience",
    "Education",
    "Certifications",
    "Cover Letter",
    "Other Details",
    "Preview",
  ];
  const isLastStep = activeStep === steps.length - 1;
  const errors = showErrors ? validateStep(steps[activeStep], data) : {};

  useEffect(() => {
    onChange?.(data);
  }, [data, onChange]);

  // Move focus to the new step so keyboard/screen-reader users land on its content.
  useEffect(() => {
    if (prevStep.current !== activeStep) contentRef.current?.focus();
    prevStep.current = activeStep;
  }, [activeStep]);

  const hasErrors = (step: string) => Object.keys(validateStep(step, data)).length > 0;

  const handleNext = () => {
    if (hasErrors(steps[activeStep])) return setShowErrors(true);
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateData = (updatedFields: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleSave = async () => {
    if (!onSave) return;
    const invalid = steps.findIndex(hasErrors);
    if (invalid >= 0) {
      setShowErrors(true);
      setActiveStep(invalid);
      return;
    }
    await onSave(data);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${(data.name || "cv").trim().replace(/\s+/g, "-").toLowerCase()}-data.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // allow re-importing the same file
    if (!file) return;
    try {
      const imported = parseCV(await file.text());
      // Keep profile metadata; replace CV content.
      setData((prev) => ({
        ...imported,
        profileName: prev.profileName,
        profileDescription: prev.profileDescription,
      }));
      setImportError(null);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "Could not read file");
    }
  };

  const renderStepContent = () => {
    const props = { data, updateData };
    switch (steps[activeStep]) {
      case "Metadata":
        return <MetadataStep {...props} errors={errors} />;
      case "Personal Info":
        return <PersonalInfoStep {...props} errors={errors} />;
      case "Summary":
        return <SummaryStep {...props} />;
      case "Skills":
        return <SkillsStep {...props} />;
      case "Experience":
        return <ExperienceStep {...props} />;
      case "Education":
        return <EducationStep {...props} />;
      case "Certifications":
        return <CertificationsStep {...props} />;
      case "Cover Letter":
        return <CoverLetterStep {...props} />;
      case "Other Details":
        return <OtherInfoStep {...props} />;
      case "Preview":
        return <PreviewStep data={data} />;
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          gap: 1,
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1.5,
        }}
      >
        {title && (
          <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
        )}
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, ml: "auto" }}>
          <Button
            size="small"
            startIcon={<FileUploadIcon />}
            onClick={() => fileRef.current?.click()}
          >
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImport}
          />
          <Button size="small" startIcon={<FileDownloadIcon />} onClick={handleExport}>
            Export JSON
          </Button>
          {onSave && (
            <Button
              variant="contained"
              color="success"
              onClick={handleSave}
              disabled={saving}
              startIcon={saving ? <CircularProgress size={20} color="inherit" /> : null}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          )}
        </Box>
      </Box>

      {importError && (
        <Alert severity="error" onClose={() => setImportError(null)} sx={{ mb: 1.5 }}>
          Import failed: {importError}
        </Alert>
      )}

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
        <Stepper
          nonLinear
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 2.5,
            display: { xs: "none", md: "flex" },
            "& .MuiStepLabel-label": { fontSize: "0.75rem" },
          }}
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepButton color="inherit" onClick={() => setActiveStep(index)}>
                {label}
              </StepButton>
            </Step>
          ))}
        </Stepper>

        <Box sx={{ display: { xs: "block", md: "none" }, mb: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={((activeStep + 1) / steps.length) * 100}
            aria-label="Wizard progress"
            sx={{ borderRadius: 1 }}
          />
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        <Box
          ref={contentRef}
          tabIndex={-1}
          role="region"
          aria-label={steps[activeStep]}
          sx={{ minHeight: 300, outline: "none" }}
        >
          {renderStepContent()}
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" size="small">
            Back
          </Button>
          {!isLastStep ? (
            <Button variant="contained" color="primary" size="small" onClick={handleNext}>
              Next
            </Button>
          ) : (
            onSave && (
              <Button
                variant="contained"
                color="success"
                size="small"
                onClick={handleSave}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            )
          )}
        </Box>
      </Paper>
    </Box>
  );
}
