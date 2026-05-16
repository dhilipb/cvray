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
});

export type CVDataSchema = z.infer<typeof cvSchema>;
