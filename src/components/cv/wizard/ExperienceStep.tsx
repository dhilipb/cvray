import {
  TextField,
  Typography,
  Box,
  Button,
  IconButton,
  Stack,
  Paper,
  Grid,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { EntryHeader } from "./EntryHeader";
import { moveItem, splitBullets } from "./utils";
import { CVData, WorkExperience } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function ExperienceStep({ data, updateData }: Props) {
  const handleExperienceChange = <K extends keyof WorkExperience>(
    index: number,
    field: K,
    value: WorkExperience[K],
  ) => {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    updateData({ experience: newExperience });
  };

  // Replace bullets immutably (the old code mutated the shared experience object).
  const setBullets = (expIndex: number, bullets: string[]) =>
    handleExperienceChange(expIndex, "bulletPoints", bullets);

  const handleBulletPointChange = (expIndex: number, bulletIndex: number, value: string) =>
    setBullets(
      expIndex,
      data.experience[expIndex].bulletPoints.map((b, i) => (i === bulletIndex ? value : b)),
    );

  // Pasting several lines into a bullet splits them into separate bullets.
  const handleBulletPaste = (e: React.ClipboardEvent, expIndex: number, bulletIndex: number) => {
    const lines = splitBullets(e.clipboardData.getData("text"));
    if (lines.length < 2) return;
    e.preventDefault();
    const bullets = [...data.experience[expIndex].bulletPoints];
    const current = bullets[bulletIndex].trim();
    bullets.splice(bulletIndex, 1, ...(current ? [current, ...lines] : lines));
    setBullets(expIndex, bullets);
  };

  const addBulletPoint = (expIndex: number) =>
    setBullets(expIndex, [...data.experience[expIndex].bulletPoints, ""]);

  const removeBulletPoint = (expIndex: number, bulletIndex: number) =>
    setBullets(
      expIndex,
      data.experience[expIndex].bulletPoints.filter((_, i) => i !== bulletIndex),
    );

  const addExperience = () => {
    updateData({
      experience: [
        ...data.experience,
        { role: "", company: "", client: "", dates: "", bulletPoints: [""] },
      ],
    });
  };

  const removeExperience = (index: number) => {
    const newExperience = data.experience.filter((_, i) => i !== index);
    updateData({ experience: newExperience });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Work Experience
      </Typography>

      {data.experience.map((exp, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: "background.default" }} variant="outlined">
          <EntryHeader
            title={`Experience ${index + 1}`}
            index={index}
            count={data.experience.length}
            onMove={(from, to) => updateData({ experience: moveItem(data.experience, from, to) })}
            onRemove={() => removeExperience(index)}
          />

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Role / Position"
                value={exp.role}
                onChange={(e) => handleExperienceChange(index, "role", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Company"
                value={exp.company}
                onChange={(e) => handleExperienceChange(index, "company", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Client (Optional)"
                value={exp.client}
                onChange={(e) => handleExperienceChange(index, "client", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Dates (e.g., March 2025 - Present)"
                value={exp.dates}
                onChange={(e) => handleExperienceChange(index, "dates", e.target.value)}
                variant="outlined"
              />
            </Grid>

            <Grid size={12}>
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Switch
                    size="small"
                    checked={!!exp.break}
                    onChange={(e) => handleExperienceChange(index, "break", e.target.checked)}
                    color="primary"
                  />
                }
                label={
                  <Typography variant="caption" sx={{ fontSize: "0.7rem" }}>
                    Force Page Break Before This Role
                  </Typography>
                }
              />
            </Grid>

            <Grid size={12}>
              <Typography
                variant="caption"
                sx={{ mt: 1, mb: 0.5, display: "block", fontWeight: 600, color: "text.secondary" }}
              >
                Responsibilities & Achievements
              </Typography>
              <Stack spacing={0.5}>
                {exp.bulletPoints.map((bullet, bIndex) => (
                  <Box key={bIndex} sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                    <TextField
                      fullWidth
                      size="small"
                      multiline
                      value={bullet}
                      onChange={(e) => handleBulletPointChange(index, bIndex, e.target.value)}
                      onPaste={(e) => handleBulletPaste(e, index, bIndex)}
                      placeholder="Enter achievement (paste several lines to split)..."
                      slotProps={{
                        htmlInput: { "aria-label": `Experience ${index + 1} bullet ${bIndex + 1}` },
                      }}
                      sx={{ "& .MuiInputBase-root": { fontSize: "0.8rem" } }}
                    />
                    <IconButton
                      onClick={() => removeBulletPoint(index, bIndex)}
                      disabled={exp.bulletPoints.length === 1}
                      aria-label={`Remove bullet ${bIndex + 1}`}
                      size="small"
                      sx={{ p: 0.5 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
                <Button
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={() => addBulletPoint(index)}
                  sx={{ alignSelf: "flex-start", fontSize: "0.7rem", py: 0 }}
                >
                  Add Bullet Point
                </Button>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button startIcon={<AddIcon />} size="small" onClick={addExperience} variant="outlined">
        Add Work Experience
      </Button>
    </Box>
  );
}
