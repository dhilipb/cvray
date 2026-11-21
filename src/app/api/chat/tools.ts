import { tool, type JSONValue } from "ai";
import type { z } from "zod";
import { applyCvMutation } from "@/lib/cv/mutations";
import { CVData } from "@/lib/types";
import {
  updatePersonalInfoSchema,
  updateSummarySchema,
  addWorkExperienceSchema,
  updateWorkExperienceSchema,
  deleteWorkExperienceSchema,
  updateSkillsSchema,
  addEducationSchema,
  updateEducationSchema,
  deleteEducationSchema,
  addCertificationSchema,
  deleteCertificationSchema,
  togglePageBreakSchema,
  updateSectionLabelsSchema,
  reorderSectionsSchema,
  setSectionVisibilitySchema,
  updateCustomSectionSchema,
  updateOtherSectionSchema,
  updateCoverLetterSchema,
  updateTemplateOrThemeSchema,
  updateCVSchema,
} from "@/lib/cv/mutation-schemas";

/* --------- Tools Factory --------- */

/** Output streamed to the UI; the client syncs its preview from `cv`. */
export interface CvToolOutput {
  success: boolean;
  cv?: CVData;
}

export function getChatTools(
  getCurrentCv: () => CVData,
  saveCv: (updated: CVData) => Promise<CVData>,
) {
  const cvTool = <INPUT>(name: string, description: string, inputSchema: z.ZodType<INPUT>) =>
    tool({
      description,
      inputSchema,
      execute: async (args: INPUT): Promise<CvToolOutput> => {
        const updated = applyCvMutation(
          getCurrentCv(),
          name,
          args as Parameters<typeof applyCvMutation>[2],
        );
        return { success: true, cv: await saveCv(updated) };
      },
      // The model sees the updated CV (indices can shift after add/delete); history sent back
      // from the client has `cv` stripped, so fall back to a short confirmation.
      toModelOutput: ({ output }) =>
        output?.cv
          ? { type: "json", value: { success: true, updatedCv: output.cv as unknown as JSONValue } }
          : { type: "text", value: `${name} applied.` },
    });

  return {
    updatePersonalInfo: cvTool(
      "updatePersonalInfo",
      "Update personal contact details such as name, title, email, phone, location, and linkedin.",
      updatePersonalInfoSchema,
    ),
    updateSummary: cvTool(
      "updateSummary",
      "Update the professional summary of the CV.",
      updateSummarySchema,
    ),
    addWorkExperience: cvTool(
      "addWorkExperience",
      "Add a new work experience entry.",
      addWorkExperienceSchema,
    ),
    updateWorkExperience: cvTool(
      "updateWorkExperience",
      "Update an existing work experience entry at a specific index. Only the provided fields change.",
      updateWorkExperienceSchema,
    ),
    deleteWorkExperience: cvTool(
      "deleteWorkExperience",
      "Delete an existing work experience entry at a specific index. Only use when the user explicitly asks to remove it.",
      deleteWorkExperienceSchema,
    ),
    updateSkills: cvTool(
      "updateSkills",
      "Replace the entire list of skills and categories.",
      updateSkillsSchema,
    ),
    addEducation: cvTool("addEducation", "Add a new education entry.", addEducationSchema),
    updateEducation: cvTool(
      "updateEducation",
      "Update an existing education entry at a specific index. Only the provided fields change.",
      updateEducationSchema,
    ),
    deleteEducation: cvTool(
      "deleteEducation",
      "Delete an existing education entry at a specific index. Only use when the user explicitly asks to remove it.",
      deleteEducationSchema,
    ),
    addCertification: cvTool(
      "addCertification",
      "Add a new certification.",
      addCertificationSchema,
    ),
    deleteCertification: cvTool(
      "deleteCertification",
      "Delete an existing certification at a specific index. Only use when the user explicitly asks to remove it.",
      deleteCertificationSchema,
    ),
    togglePageBreak: cvTool(
      "togglePageBreak",
      "Add or remove a page break before a specific work experience item.",
      togglePageBreakSchema,
    ),
    updateSectionLabels: cvTool(
      "updateSectionLabels",
      "Rename section titles (e.g. rename 'Experience' to 'Employment History').",
      updateSectionLabelsSchema,
    ),
    reorderSections: cvTool(
      "reorderSections",
      "Change the ordering of CV sections. Include every section that should stay visible.",
      reorderSectionsSchema,
    ),
    setSectionVisibility: cvTool(
      "setSectionVisibility",
      "Hide or show a CV section without deleting its content.",
      setSectionVisibilitySchema,
    ),
    updateCustomSection: cvTool(
      "updateCustomSection",
      "Create, edit, or delete a custom section (e.g. 'projects', 'languages', etc.).",
      updateCustomSectionSchema,
    ),
    updateOtherSection: cvTool(
      "updateOtherSection",
      "Update the label and value of the Other section.",
      updateOtherSectionSchema,
    ),
    updateCoverLetter: cvTool(
      "updateCoverLetter",
      "Replace the full cover letter text (plain text, paragraphs separated by blank lines).",
      updateCoverLetterSchema,
    ),
    updateTemplateOrTheme: cvTool(
      "updateTemplateOrTheme",
      "Switch the PDF template layout or the color palette theme.",
      updateTemplateOrThemeSchema,
    ),
    updateCV: cvTool(
      "updateCV",
      "Full fallback tool to replace the entire CV data at once. Use only when making massive overall changes the user asked for.",
      updateCVSchema,
    ),
  };
}
