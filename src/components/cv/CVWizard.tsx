"use client";

import { useState, useEffect } from "react";
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
} from "@mui/material";
import { CVData } from "@/lib/types";
import { PersonalInfoStep } from "./wizard/PersonalInfoStep";
import { SummaryStep } from "./wizard/SummaryStep";
import { SkillsStep } from "./wizard/SkillsStep";
import { ExperienceStep } from "./wizard/ExperienceStep";
import { EducationStep } from "./wizard/EducationStep";
import { CertificationsStep } from "./wizard/CertificationsStep";
import { CoverLetterStep } from "./wizard/CoverLetterStep";
import { OtherInfoStep } from "./wizard/OtherInfoStep";

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
}

/* --------- Metadata Step --------- */

function MetadataStep({
  data,
  updateData,
}: {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
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
            value={data.profileName || ""}
            onChange={(e) => updateData({ profileName: e.target.value })}
            helperText="Visible only to you in the dashboard"
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
}: Props) {
  const [activeStep, setActiveStep] = useState(0);
  const [data, setData] = useState<WizardData>(initialData);

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

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleNext = () => {
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const updateData = (updatedFields: Partial<WizardData>) => {
    setData((prev) => ({ ...prev, ...updatedFields }));
  };

  const handleSave = async () => {
    if (onSave) {
      await onSave(data);
    }
  };

  const renderStepContent = (stepIndex: number) => {
    // Adjust index based on showMetadataStep
    let currentStep = stepIndex;
    if (showMetadataStep) {
      if (stepIndex === 0) return <MetadataStep data={data} updateData={updateData} />;
      currentStep = stepIndex - 1;
    }

    switch (currentStep) {
      case 0:
        return <PersonalInfoStep data={data} updateData={updateData} />;
      case 1:
        return <SummaryStep data={data} updateData={updateData} />;
      case 2:
        return <SkillsStep data={data} updateData={updateData} />;
      case 3:
        return <ExperienceStep data={data} updateData={updateData} />;
      case 4:
        return <EducationStep data={data} updateData={updateData} />;
      case 5:
        return <CertificationsStep data={data} updateData={updateData} />;
      case 6:
        return <CoverLetterStep data={data} updateData={updateData} />;
      case 7:
        return <OtherInfoStep data={data} updateData={updateData} />;
      case 8:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview JSON
            </Typography>
            <Paper
              sx={{
                p: 2,
                bgcolor: "background.default",
                overflow: "auto",
                maxHeight: "400px",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <pre style={{ margin: 0, fontSize: "0.8rem", color: "#10b981" }}>
                {JSON.stringify(data, null, 2)}
              </pre>
            </Paper>
          </Box>
        );
      default:
        return <Typography>Unknown Step</Typography>;
    }
  };

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1.5 }}>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
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

      <Paper sx={{ p: { xs: 1.5, md: 3 }, mt: 1.5 }} elevation={3}>
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

        <Box sx={{ display: { xs: "block", md: "none" }, mb: 2, textAlign: "center" }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
            Step {activeStep + 1} of {steps.length}: {steps[activeStep]}
          </Typography>
        </Box>

        <Divider sx={{ mb: 2.5 }} />

        <Box sx={{ minHeight: "300px" }}>{renderStepContent(activeStep)}</Box>

        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
          <Button disabled={activeStep === 0} onClick={handleBack} variant="outlined" size="small">
            Back
          </Button>
          <Box>
            {activeStep === steps.length - 1 ? (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], {
                      type: "application/json",
                    });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement("a");
                    link.href = url;
                    link.download = "cv-data.json";
                    link.click();
                  }}
                >
                  Download JSON
                </Button>
                {onSave && (
                  <Button
                    variant="contained"
                    color="success"
                    size="small"
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? "Saving..." : "Save Profile"}
                  </Button>
                )}
              </Box>
            ) : (
              <Button variant="contained" color="primary" size="small" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
