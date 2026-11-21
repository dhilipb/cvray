import { TextField, Typography, Box, Button, Stack, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EntryHeader } from "./EntryHeader";
import { moveItem } from "./utils";
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
        <Paper
          key={index}
          sx={{ p: 1.5, mb: 1.5, bgcolor: "background.default" }}
          variant="outlined"
        >
          <Stack spacing={1.5}>
            <EntryHeader
              title={`Category ${index + 1}`}
              index={index}
              count={data.skills.length}
              onMove={(from, to) => updateData({ skills: moveItem(data.skills, from, to) })}
              onRemove={() => removeSkill(index)}
            />
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

      <Button
        startIcon={<AddIcon />}
        size="small"
        onClick={addSkill}
        variant="outlined"
        sx={{ mt: 0.5 }}
      >
        Add Skill Category
      </Button>
    </Box>
  );
}
