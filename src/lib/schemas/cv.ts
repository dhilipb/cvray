import { z } from "zod";

export const workExperienceSchema = z.object({
  role: z.string(),
  company: z.string(),
  client: z.string().optional().default(""),
  dates: z.string(),
  bulletPoints: z.array(z.string()),
  sectionHeader: z.string().optional(),
  break: z.boolean().optional(),
});

export const skillCategorySchema = z.object({
  name: z.string(),
  items: z.string(),
});

export const educationSchema = z.object({
  degree: z.string(),
  institution: z.string(),
  location: z.string(),
  details: z.string().optional(),
});

export const certificationSchema = z.object({
  name: z.string(),
  date: z.string(),
});

export const customSectionSchema = z.object({
  id: z
    .string()
    .describe("A unique identifier for the custom section, e.g., 'projects', 'languages'"),
  title: z
    .string()
    .describe("The display title of the custom section, e.g., 'Projects', 'Languages'"),
  content: z.string().optional().describe("Text content for the custom section"),
  bulletPoints: z.array(z.string()).optional().describe("Bullet points for the custom section"),
});

export const sectionLabelsSchema = z
  .object({
    summary: z.string().optional().describe("Custom label for the Summary/Profile section"),
    skills: z.string().optional().describe("Custom label for the Skills/Core Competencies section"),
    experience: z
      .string()
      .optional()
      .describe("Custom label for the Experience/Professional Experience section"),
    education: z.string().optional().describe("Custom label for the Education section"),
    certifications: z.string().optional().describe("Custom label for the Certifications section"),
    other: z.string().optional().describe("Custom label for the Other section"),
  })
  .optional();

export const cvSchema = z.object({
  name: z.string(),
  title: z.string(),
  email: z.string(),
  phone: z.string(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
  summary: z.string(),
  skills: z.array(skillCategorySchema),
  experience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  certifications: z.array(certificationSchema),
  coverLetter: z.string().optional(),
  other: z
    .object({
      label: z.string(),
      value: z.string(),
    })
    .optional(),
  fullText: z.string().optional().describe("The full extracted text from the CV"),
  sectionsOrder: z
    .array(z.string())
    .optional()
    .describe(
      "Specify the ordered list of section IDs to display (e.g. ['summary', 'skills', 'experience', 'education', 'certifications', 'projects', 'other'])",
    ),
  hiddenSections: z
    .array(z.string())
    .optional()
    .describe("Section IDs that should be hidden from the rendered CV"),
  customSections: z
    .array(customSectionSchema)
    .optional()
    .describe("Add any custom/new sections to the CV"),
  sectionLabels: sectionLabelsSchema.describe(
    "Customize the headings/labels of existing default sections",
  ),
  templateId: z
    .string()
    .optional()
    .describe(
      "The active PDF template layout. Options: 'modern', 'minimalist', 'professional', 'creative'",
    ),
  themeId: z
    .string()
    .optional()
    .describe(
      "The active color theme. Options: 'emerald', 'blue', 'violet', 'amber', 'rose', 'slate'",
    ),
});

export type CVDataSchema = z.infer<typeof cvSchema>;
