import { TextField, Typography, Box, Button, IconButton, Stack, Paper } from "@mui/material";
import { Delete as DeleteIcon, Add as AddIcon } from "@mui/icons-material";
import { CVData, SkillCategory } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function SkillsStep({ data, updateData }: Props) {
  const handleSkillChange = (index: number, field: keyof SkillCategory, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    updateData({ skills: newSkills });
  };

  const addSkill = () => {
    updateData({ skills: [...data.skills, { name: "", items: "" }] });
  };

  const removeSkill = (index: number) => {
    const newSkills = data.skills.filter((_, i) => i !== index);
    updateData({ skills: newSkills });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Skills & Expertise
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Group your skills into categories (e.g., Technical, Management).
      </Typography>

      {data.skills.map((skill, index) => (
        <Paper key={index} sx={{ p: 1.5, mb: 1.5, bgcolor: "background.default" }} variant="outlined">
          <Stack spacing={1.5}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                Category {index + 1}
              </Typography>
              {data.skills.length > 1 && (
                <IconButton onClick={() => removeSkill(index)} color="error" size="small" sx={{ p: 0.5 }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
            <TextField
              fullWidth
              size="small"
              label="Category Name (e.g., Leadership)"
              value={skill.name}
              onChange={(e) => handleSkillChange(index, "name", e.target.value)}
              variant="outlined"
            />
            <TextField
              fullWidth
              size="small"
              label="Skills (comma separated)"
              multiline
              rows={2}
              value={skill.items}
              onChange={(e) => handleSkillChange(index, "items", e.target.value)}
              variant="outlined"
            />
          </Stack>
        </Paper>
      ))}

      <Button startIcon={<AddIcon />} size="small" onClick={addSkill} variant="outlined" sx={{ mt: 0.5 }}>
        Add Skill Category
      </Button>
    </Box>
  );
}
