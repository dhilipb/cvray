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
      <Typography variant="h6" gutterBottom>
        Cover Letter
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Write your cover letter here. You can use HTML tags like &lt;strong&gt; for emphasis.
      </Typography>
      <TextField
        fullWidth
        label="Cover Letter"
        multiline
        rows={15}
        value={data.coverLetter}
        onChange={handleChange}
        variant="outlined"
      />
    </Box>
  );
}
