import { TextField, Typography, Box, Button, IconButton, Paper, Grid } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
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
      <Typography variant="h6" gutterBottom>
        Education
      </Typography>

      {data.education.map((edu, index) => (
        <Paper key={index} sx={{ p: 3, mb: 3, bgcolor: "background.default" }} variant="outlined">
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Education {index + 1}
            </Typography>
            {data.education.length > 1 && (
              <IconButton onClick={() => removeEducation(index)} color="error" size="small">
                <DeleteIcon />
              </IconButton>
            )}
          </Box>

          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Degree / Qualification"
                value={edu.degree}
                onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Institution"
                value={edu.institution}
                onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Location"
                value={edu.location}
                onChange={(e) => handleEducationChange(index, "location", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Additional Details (Optional)"
                multiline
                rows={2}
                value={edu.details}
                onChange={(e) => handleEducationChange(index, "details", e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button startIcon={<AddIcon />} onClick={addEducation} variant="outlined">
        Add Education
      </Button>
    </Box>
  );
}
