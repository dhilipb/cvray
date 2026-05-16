"use client";

import React, { useState, useEffect, use } from "react";
import { 
  Box, Typography, Button, TextField, Grid, Card, CardContent, 
  IconButton, Stack, CircularProgress, Alert,
  Fab, Tooltip, FormControlLabel, Switch
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useRouter } from "next/navigation";
import { CVData, WorkExperience, SkillCategory } from "@/lib/types";
import CVPreviewer from "@/components/cv/CVPreviewer";

/* --------- Page Component --------- */

export default function ProfileEditPage({ params }: { params: Promise<{ profileId: string }> }) {
  const router = useRouter();
  const { profileId } = use(params);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const [profileName, setProfileName] = useState("");
  const [profileDescription, setProfileDescription] = useState("");
  const [cvData, setCvData] = useState<CVData>({
    name: "",
    title: "",
    email: "",
    phone: "",
    summary: "",
    skills: [],
    experience: [],
    education: [],
    certifications: [],
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/profiles/${profileId}`);
        const data = await res.json();
        if (data.success) {
          setProfileName(data.profile.name);
          setProfileDescription(data.profile.description || "");
          if (data.profile.parsedProfileJson) {
            setCvData(JSON.parse(data.profile.parsedProfileJson));
          }
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

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);
      
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

  /* --------- Change Handlers --------- */

  const handlePersonalChange = (field: keyof CVData, value: string) => {
    setCvData(prev => ({ ...prev, [field]: value }));
  };

  const handleExperienceChange = (index: number, field: keyof WorkExperience, value: string | string[] | boolean | undefined) => {
    const newExperience = [...cvData.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    setCvData(prev => ({ ...prev, experience: newExperience }));
  };

  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...prev.experience,
        { role: "", company: "", client: "", dates: "", bulletPoints: [""] }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    const newExperience = cvData.experience.filter((_, i) => i !== index);
    setCvData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleBulletPointChange = (expIndex: number, bpIndex: number, value: string) => {
    const newExperience = [...cvData.experience];
    const newBulletPoints = [...newExperience[expIndex].bulletPoints];
    newBulletPoints[bpIndex] = value;
    newExperience[expIndex].bulletPoints = newBulletPoints;
    setCvData(prev => ({ ...prev, experience: newExperience }));
  };

  const addBulletPoint = (expIndex: number) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].bulletPoints.push("");
    setCvData(prev => ({ ...prev, experience: newExperience }));
  };

  const removeBulletPoint = (expIndex: number, bpIndex: number) => {
    const newExperience = [...cvData.experience];
    newExperience[expIndex].bulletPoints = newExperience[expIndex].bulletPoints.filter((_, i) => i !== bpIndex);
    setCvData(prev => ({ ...prev, experience: newExperience }));
  };

  const handleSkillChange = (index: number, field: keyof SkillCategory, value: string) => {
    const newSkills = [...cvData.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setCvData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkillCategory = () => {
    setCvData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: "", items: "" }]
    }));
  };

  const removeSkillCategory = (index: number) => {
    const newSkills = cvData.skills.filter((_, i) => i !== index);
    setCvData(prev => ({ ...prev, skills: newSkills }));
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "50vh" }}>
        <CircularProgress sx={{ color: "#10b981" }} />
      </Box>
    );
  }

  return (
    <Box sx={{ pb: 10 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <IconButton onClick={() => router.push("/profiles")} sx={{ color: "text.secondary" }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
            Edit Profile
          </Typography>
        </Stack>
        <Button 
          variant="outlined" 
          startIcon={<VisibilityIcon />} 
          onClick={() => setPreviewOpen(true)}
          sx={{ borderColor: "rgba(255,255,255,0.2)", color: "text.primary" }}
        >
          Preview CV
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 4 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mb: 4 }}>Profile saved successfully!</Alert>}

      <Grid container spacing={4}>
        {/* Left Column - Meta & Info */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack spacing={4}>
            <Card sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Profile Identity</Typography>
                <Stack spacing={3}>
                  <TextField 
                    label="Internal Profile Name" 
                    fullWidth 
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    helperText="Visible only to you in the dashboard"
                  />
                  <TextField 
                    label="Profile Overview" 
                    fullWidth 
                    multiline 
                    rows={4}
                    value={profileDescription}
                    onChange={(e) => setProfileDescription(e.target.value)}
                    helperText="High-level description of this professional persona"
                  />
                </Stack>
              </CardContent>
            </Card>

            <Card sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Contact Information</Typography>
                <Stack spacing={3}>
                  <TextField 
                    label="Full Name (on CV)" 
                    fullWidth 
                    value={cvData.name}
                    onChange={(e) => handlePersonalChange("name", e.target.value)}
                  />
                  <TextField 
                    label="Professional Title" 
                    fullWidth 
                    value={cvData.title}
                    onChange={(e) => handlePersonalChange("title", e.target.value)}
                  />
                  <TextField 
                    label="Email" 
                    fullWidth 
                    value={cvData.email}
                    onChange={(e) => handlePersonalChange("email", e.target.value)}
                  />
                  <TextField 
                    label="Phone" 
                    fullWidth 
                    value={cvData.phone}
                    onChange={(e) => handlePersonalChange("phone", e.target.value)}
                  />
                  <TextField 
                    label="Location" 
                    fullWidth 
                    value={cvData.location || ""}
                    onChange={(e) => handlePersonalChange("location", e.target.value)}
                  />
                </Stack>
              </CardContent>
            </Card>
          </Stack>
        </Grid>

        {/* Right Column - Experience & Skills */}
        <Grid size={{ xs: 12, md: 8 }}>
          <Stack spacing={4}>
            {/* Professional Summary */}
            <Card sx={{ bgcolor: "background.paper", borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Professional Summary</Typography>
                <TextField 
                  fullWidth 
                  multiline 
                  rows={6}
                  value={cvData.summary}
                  onChange={(e) => handlePersonalChange("summary", e.target.value)}
                />
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Work Experience</Typography>
                <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addExperience} sx={{ color: "#10b981", borderColor: "rgba(16,185,129,0.5)" }}>
                  Add Role
                </Button>
              </Box>
              <Stack spacing={3}>
                {cvData.experience.map((exp, expIdx) => (
                  <Card key={expIdx} sx={{ bgcolor: "background.paper", borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                        <Grid container spacing={2} sx={{ flexGrow: 1 }}>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              label="Role / Title" 
                              fullWidth 
                              size="small"
                              value={exp.role}
                              onChange={(e) => handleExperienceChange(expIdx, "role", e.target.value)}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              label="Company" 
                              fullWidth 
                              size="small"
                              value={exp.company}
                              onChange={(e) => handleExperienceChange(expIdx, "company", e.target.value)}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              label="Dates" 
                              fullWidth 
                              size="small"
                              placeholder="Jan 2020 - Present"
                              value={exp.dates}
                              onChange={(e) => handleExperienceChange(expIdx, "dates", e.target.value)}
                            />
                          </Grid>
                          <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField 
                              label="Client (Optional)" 
                              fullWidth 
                              size="small"
                              value={exp.client}
                              onChange={(e) => handleExperienceChange(expIdx, "client", e.target.value)}
                            />
                          </Grid>
                          <Grid size={{ xs: 12 }}>
                            <FormControlLabel
                              control={
                                <Switch 
                                  size="small"
                                  checked={!!exp.break} 
                                  onChange={(e) => handleExperienceChange(expIdx, "break", e.target.checked)} 
                                  color="success"
                                />
                              }
                              label={<Typography variant="caption">Force Page Break Before This Role</Typography>}
                            />
                          </Grid>
                        </Grid>
                        <IconButton color="error" size="small" onClick={() => removeExperience(expIdx)} sx={{ ml: 2 }}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                      
                      <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: "text.secondary" }}>Responsibilities & Achievements</Typography>
                      <Stack spacing={1}>
                        {exp.bulletPoints.map((bp, bpIdx) => (
                          <Box key={bpIdx} sx={{ display: "flex", gap: 1 }}>
                            <TextField 
                              fullWidth 
                              multiline
                              size="small"
                              value={bp}
                              onChange={(e) => handleBulletPointChange(expIdx, bpIdx, e.target.value)}
                              variant="standard"
                              sx={{ 
                                "& .MuiInput-root": { fontSize: "0.875rem" },
                                "& .MuiInput-root:before": { borderColor: "rgba(255,255,255,0.1)" }
                              }}
                            />
                            <IconButton size="small" onClick={() => removeBulletPoint(expIdx, bpIdx)}>
                              <DeleteIcon fontSize="inherit" />
                            </IconButton>
                          </Box>
                        ))}
                        <Button size="small" startIcon={<AddIcon />} onClick={() => addBulletPoint(expIdx)} sx={{ alignSelf: "flex-start", mt: 1, color: "text.secondary" }}>
                          Add Point
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Box>

            {/* Skills */}
            <Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>Skills & Expertise</Typography>
                <Button startIcon={<AddIcon />} variant="outlined" size="small" onClick={addSkillCategory} sx={{ color: "#10b981", borderColor: "rgba(16,185,129,0.5)" }}>
                  Add Category
                </Button>
              </Box>
              <Grid container spacing={3}>
                {cvData.skills.map((skill, skillIdx) => (
                  <Grid size={{ xs: 12, sm: 6 }} key={skillIdx}>
                    <Card sx={{ bgcolor: "background.paper", borderRadius: 2, border: "1px solid rgba(255,255,255,0.05)" }}>
                      <CardContent>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                          <TextField 
                            label="Category" 
                            fullWidth 
                            size="small"
                            value={skill.name}
                            onChange={(e) => handleSkillChange(skillIdx, "name", e.target.value)}
                            variant="standard"
                          />
                          <IconButton color="error" size="small" onClick={() => removeSkillCategory(skillIdx)}>
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <TextField 
                          label="Skills (comma separated)" 
                          fullWidth 
                          multiline
                          rows={3}
                          size="small"
                          value={skill.items}
                          onChange={(e) => handleSkillChange(skillIdx, "items", e.target.value)}
                          placeholder="Java, Python, AWS, Docker..."
                        />
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Grid>
      </Grid>

      {/* Floating Save Button */}
      <Tooltip title="Save Changes">
        <Fab 
          color="primary" 
          aria-label="save" 
          onClick={handleSave}
          disabled={saving}
          sx={{ 
            position: "fixed", 
            bottom: 32, 
            right: 32,
            background: "linear-gradient(to right, #10b981 0%, #059669 100%)",
            color: "#fff",
            "&:hover": {
              background: "linear-gradient(to right, #059669 0%, #047857 100%)",
            }
          }}
        >
          {saving ? <CircularProgress size={24} color="inherit" /> : <SaveIcon />}
        </Fab>
      </Tooltip>

      <CVPreviewer 
        open={previewOpen} 
        onClose={() => setPreviewOpen(false)} 
        cvData={cvData} 
      />
    </Box>
  );
}
