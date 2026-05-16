import { TextField, Typography, Box } from "@mui/material";
import { CVData } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function SummaryStep({ data, updateData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ summary: e.target.value });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Professional Summary
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Provide a concise overview of your professional background and key strengths. You can use
        HTML tags like &lt;strong&gt; for emphasis.
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Summary"
        multiline
        rows={6}
        value={data.summary}
        onChange={handleChange}
        variant="outlined"
      />
    </Box>
  );
}
