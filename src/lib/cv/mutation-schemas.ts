import { z } from "zod";
import {
  workExperienceSchema,
  skillCategorySchema,
  educationSchema,
  certificationSchema,
  sectionLabelsSchema,
  cvSchema,
} from "@/lib/schemas/cv";

const indexSchema = z.number().int().min(0);

/* --------- Contact Info / Personal Details --------- */
export const updatePersonalInfoSchema = z.object({
  name: z.string().optional(),
  title: z.string().optional(),
  email: z.string().optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  linkedin: z.string().optional(),
});

/* --------- Summary --------- */
export const updateSummarySchema = z.object({
  summary: z.string().describe("The updated professional summary text"),
});

/* --------- Work Experience --------- */
export const addWorkExperienceSchema = z.object({
  experience: workExperienceSchema,
});

export const updateWorkExperienceSchema = z.object({
  index: indexSchema.describe("0-based index of the experience item to edit"),
  // Override `client` so its `.default("")` doesn't wipe the existing client on partial updates.
  experience: workExperienceSchema.extend({ client: z.string().optional() }).partial(),
});

export const deleteWorkExperienceSchema = z.object({
  index: indexSchema.describe("0-based index of the experience item to delete"),
});

/* --------- Skills --------- */
export const updateSkillsSchema = z.object({
  skills: z
    .array(skillCategorySchema)
    .describe("The entire updated skills list containing categories and their items"),
});

/* --------- Education --------- */
export const addEducationSchema = z.object({
  education: educationSchema,
});

export const updateEducationSchema = z.object({
  index: indexSchema.describe("0-based index of the education item to edit"),
  education: educationSchema.partial(),
});

export const deleteEducationSchema = z.object({
  index: indexSchema.describe("0-based index of the education item to delete"),
});

/* --------- Certifications --------- */
export const addCertificationSchema = z.object({
  certification: certificationSchema,
});

export const deleteCertificationSchema = z.object({
  index: indexSchema.describe("0-based index of the certification item to delete"),
});

/* --------- Page Layout and Ordering --------- */
export const togglePageBreakSchema = z.object({
  index: indexSchema.describe("0-based index of the experience item"),
  break: z
    .boolean()
    .describe("true to insert a page break before this experience item, false to remove it"),
});

export const updateSectionLabelsSchema = z.object({
  sectionLabels: sectionLabelsSchema,
});

export const reorderSectionsSchema = z.object({
  sectionsOrder: z
    .array(z.string())
    .describe("The ordered list of section IDs (e.g. ['summary', 'skills', 'experience', ...])"),
});

export const setSectionVisibilitySchema = z.object({
  sectionId: z
    .string()
    .describe("Section ID to show/hide (e.g. 'certifications' or a custom section id)"),
  hidden: z.boolean().describe("true to hide the section from the CV, false to show it"),
});

/* --------- Custom & Other Sections --------- */
export const updateCustomSectionSchema = z.object({
  id: z.string().describe("Unique identifier of the custom section (e.g., 'projects')"),
  title: z.string().optional().describe("Title of the custom section (e.g., 'Selected Projects')"),
  content: z.string().optional().describe("Text content of the custom section"),
  bulletPoints: z.array(z.string()).optional().describe("Bullet points of the custom section"),
  delete: z.boolean().optional().describe("Set to true to delete this custom section"),
});

export const updateOtherSectionSchema = z.object({
  label: z.string().describe("Label of the other section"),
  value: z.string().describe("Content of the other section"),
  delete: z.boolean().optional().describe("Set to true to delete the other section"),
});

/* --------- Cover Letter --------- */
export const updateCoverLetterSchema = z.object({
  content: z.string().describe("The updated cover letter text"),
});

/* --------- Layout & Color Theme --------- */
export const updateTemplateOrThemeSchema = z.object({
  templateId: z
    .enum(["modern", "minimalist", "professional", "creative"])
    .optional()
    .describe("The PDF template design layout to switch to"),
  themeId: z
    .enum(["emerald", "blue", "violet", "amber", "rose", "slate"])
    .optional()
    .describe("The color palette theme to switch to"),
});

/* --------- Full Update Fallback --------- */
export const updateCVSchema = cvSchema;
