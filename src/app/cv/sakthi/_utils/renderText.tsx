import { Text } from "@react-pdf/renderer";
import React from "react";
import { styles } from "../_styles";

/* --------- Text Highlight Helper --------- */

/**
 * Parses a string containing <strong> tags and returns React components for react-pdf.
 */
export const renderText = (text: string): React.ReactNode => {
  if (!text) return "";

  // Split by <strong> and </strong> tags
  const parts = text.split(/(<strong>.*?<\/strong>)/gi);

  return parts.map((part, i) => {
    if (part.toLowerCase().startsWith("<strong>") && part.toLowerCase().endsWith("</strong>")) {
      const content = part.substring(8, part.length - 9);
      return (
        <Text key={i} style={styles.bold}>
          {content}
        </Text>
      );
    }
    return part;
  });
};
