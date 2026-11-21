import { TextField, Typography, Box, Button, Paper, Grid } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EntryHeader } from "./EntryHeader";
import { moveItem } from "./utils";
import { CVData, Education } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function EducationStep({ data, updateData }: Props) {
  const handleEducationChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    updateData({ education: newEducation });
  };

  const addEducation = () => {
    updateData({
      education: [...data.education, { degree: "", institution: "", location: "", details: "" }],
    });
  };

  const removeEducation = (index: number) => {
    const newEducation = data.education.filter((_, i) => i !== index);
    updateData({ education: newEducation });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Education
      </Typography>

      {data.education.map((edu, index) => (
        <Paper key={index} sx={{ p: 2, mb: 2, bgcolor: "background.default" }} variant="outlined">
          <EntryHeader
            title={`Education ${index + 1}`}
            index={index}
            count={data.education.length}
            onMove={(from, to) => updateData({ education: moveItem(data.education, from, to) })}
            onRemove={() => removeEducation(index)}
          />

          <Grid container spacing={1.5}>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Degree / Qualification"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                size="small"
                label="Location"
                value={edu.location}
                onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Additional Details (Optional)"
                multiline
                rows={2}
                value={edu.details}
                onChange={(e) => handleEducationChange(index, "details", e.target.value)}
                variant="outlined"
                sx={{ "& .MuiInputBase-root": { fontSize: "0.85rem" } }}
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button startIcon={<AddIcon />} size="small" onClick={addEducation} variant="outlined">
        Add Education
      </Button>
    </Box>
  );
}
