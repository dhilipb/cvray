import React from "react";
import { Text } from "@react-pdf/renderer";

/* --------- Shared Constants --------- */

export const DEFAULT_COVER_LETTER = (name: string) =>
  `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${name}`;

export const SECTION_LABELS = {
  EXPERIENCE: "Experience",
  SKILLS: "Skills",
  EDUCATION: "Education",
  CERTIFICATIONS: "Certifications",
  SUMMARY: "Summary",
  PROFILE: "Profile",
  PROFESSIONAL_EXPERIENCE: "Professional Experience",
  CORE_COMPETENCIES: "Core Competencies",
};

/* --------- Shared Utilities --------- */

/**
 * Renders text with bold parts (wrapped in **) as Bold Text components
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const renderBulletHtml = (text: string, boldStyle: any) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={boldStyle}>
          {part.substring(2, part.length - 2)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

/**
 * Cleans up a URL for display (removes https://)
 */
export const formatDisplayUrl = (url: string) => {
  return url.replace(/^https?:\/\//, "");
};

/**
 * Ensures a URL starts with http/https for Link components
 */
export const formatLinkUrl = (url: string) => {
  return url.startsWith("http") ? url : `https://${url}`;
};
