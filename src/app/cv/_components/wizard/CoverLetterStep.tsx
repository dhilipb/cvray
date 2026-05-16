import { TextField, Typography, Box } from "@mui/material";
import { CVData } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function CoverLetterStep({ data, updateData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateData({ coverLetter: e.target.value });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Cover Letter
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Write your cover letter here. You can use HTML tags like &lt;strong&gt; for emphasis.
      </Typography>
      <TextField
        fullWidth
        size="small"
        label="Cover Letter"
        multiline
        rows={10}
        value={data.coverLetter}
        onChange={handleChange}
        variant="outlined"
      />
    </Box>
  );
}
