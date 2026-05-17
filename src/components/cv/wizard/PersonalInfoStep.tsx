import { TextField, Grid, Typography, Box } from "@mui/material";
import { CVData } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function PersonalInfoStep({ data, updateData }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateData({ [name]: value });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Personal Information
      </Typography>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Full Name"
            name="name"
            value={data.name}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Job Title"
            name="title"
            value={data.title}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Email"
            name="email"
            type="email"
            value={data.email}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Phone"
            name="phone"
            value={data.phone}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Location"
            name="location"
            value={data.location}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="LinkedIn URL"
            name="linkedin"
            value={data.linkedin}
            onChange={handleChange}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
