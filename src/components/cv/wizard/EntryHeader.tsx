import { Box, IconButton, Typography } from "@mui/material";
import {
  ArrowUpward as ArrowUpwardIcon,
  ArrowDownward as ArrowDownwardIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";

interface Props {
  title: string;
  index: number;
  count: number;
  onMove: (from: number, to: number) => void;
  onRemove: () => void;
}

/** Header row for a repeatable entry: title plus move up/down and remove actions. */
export function EntryHeader({ title, index, count, onMove, onRemove }: Props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 0.25, mb: 1.5 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600, flexGrow: 1 }}>
        {title}
      </Typography>
      <IconButton
        size="small"
        aria-label={`Move ${title} up`}
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
      >
        <ArrowUpwardIcon fontSize="small" />
      </IconButton>
      <IconButton
        size="small"
        aria-label={`Move ${title} down`}
        disabled={index === count - 1}
        onClick={() => onMove(index, index + 1)}
      >
        <ArrowDownwardIcon fontSize="small" />
      </IconButton>
      <IconButton size="small" color="error" aria-label={`Remove ${title}`} onClick={onRemove}>
        <DeleteIcon fontSize="small" />
      </IconButton>
    </Box>
  );
}
