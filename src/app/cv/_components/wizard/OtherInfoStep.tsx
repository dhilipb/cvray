import { TextField, Typography, Box, Grid } from "@mui/material";
import { CVData } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function OtherInfoStep({ data, updateData }: Props) {
  const handleOtherChange = (field: "label" | "value", value: string) => {
    updateData({
      other: {
        label: data.other?.label || "",
        value: data.other?.value || "",
        [field]: value,
      },
    });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
        Other Details
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ mb: 1.5, display: "block" }}>
        Any additional information (e.g., Right to Work, Languages).
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <TextField
            fullWidth
            size="small"
            label="Label (e.g., Right to Work)"
            value={data.other?.label || ""}
            onChange={(e) => handleOtherChange("label", e.target.value)}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 8 }}>
          <TextField
            fullWidth
            size="small"
            label="Value (e.g., No sponsorship required)"
            value={data.other?.value || ""}
            onChange={(e) => handleOtherChange("value", e.target.value)}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
