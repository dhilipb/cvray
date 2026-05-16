import React from "react";
import { Box } from "@mui/material";

/**
 * Parses a string containing <strong> tags and returns React components for the web.
 * This avoids using dangerouslySetInnerHTML while still supporting basic bolding.
 */
export const renderWebText = (text: string): React.ReactNode => {
  if (!text) return "";

  // Split by <strong> and </strong> tags
  const parts = text.split(/(<strong>.*?<\/strong>)/gi);

  return parts.map((part, i) => {
    if (part.toLowerCase().startsWith("<strong>") && part.toLowerCase().endsWith("</strong>")) {
      const content = part.substring(8, part.length - 9);
      return (
        <Box component="span" key={i} sx={{ fontWeight: 700 }}>
          {content}
        </Box>
      );
    }
    return part;
  });
};
