import { TextField, Typography, Box, Button, Paper, Grid } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { EntryHeader } from "./EntryHeader";
import { moveItem } from "./utils";
import { CVData, Certification } from "@/lib/types";

interface Props {
  data: CVData;
  updateData: (data: Partial<CVData>) => void;
}

export function CertificationsStep({ data, updateData }: Props) {
  const handleCertChange = (index: number, field: keyof Certification, value: string) => {
    const newCerts = [...data.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    updateData({ certifications: newCerts });
  };

  const addCert = () => {
    updateData({
      certifications: [...data.certifications, { name: "", date: "" }],
    });
  };

  const removeCert = (index: number) => {
    const newCerts = data.certifications.filter((_, i) => i !== index);
    updateData({ certifications: newCerts });
  };

  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1.5 }}>
        Certifications
      </Typography>

      {data.certifications.map((cert, index) => (
        <Paper
          key={index}
          sx={{ p: 1.5, mb: 1.5, bgcolor: "background.default" }}
          variant="outlined"
        >
          <EntryHeader
            title={`Certification ${index + 1}`}
            index={index}
            count={data.certifications.length}
            onMove={(from, to) =>
              updateData({ certifications: moveItem(data.certifications, from, to) })
            }
            onRemove={() => removeCert(index)}
          />

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 12, sm: 8 }}>
              <TextField
                fullWidth
                size="small"
                label="Certification Name"
                value={cert.name}
                onChange={(e) => handleCertChange(index, "name", e.target.value)}
                variant="outlined"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                size="small"
                label="Date"
                value={cert.date}
                onChange={(e) => handleCertChange(index, "date", e.target.value)}
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Button startIcon={<AddIcon />} size="small" onClick={addCert} variant="outlined">
        Add Certification
      </Button>
    </Box>
  );
}
