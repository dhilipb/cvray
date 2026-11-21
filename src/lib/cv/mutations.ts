import type {
  CVData,
  WorkExperience,
  SkillCategory,
  Education,
  Certification,
  SectionLabels,
} from "@/lib/types";
import { DEFAULT_SECTIONS_ORDER } from "./sections";
import { cvSchema } from "@/lib/schemas/cv";

/** Upper bound on persisted CV JSON, so runaway model output can't bloat the DB. */
export const MAX_CV_JSON_LENGTH = 150_000;

const EMPTY_CV: CVData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
};

/**
 * Parses untrusted/legacy CV data (string or object) into a valid CVData, filling missing
 * required fields. Returns null if it can't be made valid or is too large.
 */
export function parseCv(raw: unknown): CVData | null {
  let value = raw;
  if (typeof raw === "string") {
    try {
      value = JSON.parse(raw);
    } catch {
      return null;
    }
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  // Drop nulls (common in LLM-extracted JSON) so defaults apply instead of failing validation.
  const defined = Object.fromEntries(Object.entries(value).filter(([, v]) => v != null));
  const result = cvSchema.safeParse({ ...EMPTY_CV, ...defined });
  if (!result.success) return null;
  if (JSON.stringify(result.data).length > MAX_CV_JSON_LENGTH) return null;
  return result.data as CVData;
}

/* --------- Types --------- */

interface MutationArgs {
  name?: string;
  title?: string;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  experience?: Partial<WorkExperience>;
  index?: number;
  skills?: SkillCategory[];
  education?: Partial<Education>;
  certification?: Certification;
  break?: boolean;
  sectionLabels?: SectionLabels;
  sectionsOrder?: string[];
  id?: string;
  content?: string;
  bulletPoints?: string[];
  delete?: boolean;
  label?: string;
  value?: string;
  cvData?: CVData;
  templateId?: string;
  themeId?: string;
  sectionId?: string;
  hidden?: boolean;
}

const isValidIndex = (index: number | undefined, length: number): index is number =>
  index !== undefined && Number.isInteger(index) && index >= 0 && index < length;

/* --------- CV Mutation Application Helper --------- */

export function applyCvMutation(currentCv: CVData, toolName: string, args: MutationArgs): CVData {
  if (!args || typeof args !== "object") return currentCv;
  const cv = { ...currentCv };

  switch (toolName) {
    case "updateTemplateOrTheme": {
      return {
        ...cv,
        templateId: args.templateId ?? cv.templateId,
        themeId: args.themeId ?? cv.themeId,
      };
    }
    case "updatePersonalInfo": {
      return {
        ...cv,
        name: args.name ?? cv.name,
        title: args.title ?? cv.title,
        email: args.email ?? cv.email,
        phone: args.phone ?? cv.phone,
        location: args.location ?? cv.location,
        linkedin: args.linkedin ?? cv.linkedin,
      };
    }
    case "updateSummary": {
      return {
        ...cv,
        summary: args.summary ?? cv.summary,
      };
    }
    case "addWorkExperience": {
      const experience = [...(cv.experience || [])];
      if (args.experience) {
        experience.push(args.experience as WorkExperience);
      }
      return {
        ...cv,
        experience,
      };
    }
    case "updateWorkExperience": {
      const experience = [...(cv.experience || [])];
      if (isValidIndex(args.index, experience.length) && args.experience) {
        experience[args.index] = {
          ...experience[args.index],
          ...args.experience,
        };
      }
      return {
        ...cv,
        experience,
      };
    }
    case "deleteWorkExperience": {
      const experience = [...(cv.experience || [])];
      if (isValidIndex(args.index, experience.length)) {
        experience.splice(args.index, 1);
      }
      return {
        ...cv,
        experience,
      };
    }
    case "updateSkills": {
      return {
        ...cv,
        skills: args.skills ?? cv.skills,
      };
    }
    case "addEducation": {
      const education = [...(cv.education || [])];
      if (args.education) {
        education.push(args.education as Education);
      }
      return {
        ...cv,
        education,
      };
    }
    case "updateEducation": {
      const education = [...(cv.education || [])];
      if (isValidIndex(args.index, education.length) && args.education) {
        education[args.index] = {
          ...education[args.index],
          ...args.education,
        };
      }
      return {
        ...cv,
        education,
      };
    }
    case "deleteEducation": {
      const education = [...(cv.education || [])];
      if (isValidIndex(args.index, education.length)) {
        education.splice(args.index, 1);
      }
      return {
        ...cv,
        education,
      };
    }
    case "addCertification": {
      const certifications = [...(cv.certifications || [])];
      if (args.certification) {
        certifications.push(args.certification);
      }
      return {
        ...cv,
        certifications,
      };
    }
    case "deleteCertification": {
      const certifications = [...(cv.certifications || [])];
      if (isValidIndex(args.index, certifications.length)) {
        certifications.splice(args.index, 1);
      }
      return {
        ...cv,
        certifications,
      };
    }
    case "togglePageBreak": {
      const experience = [...(cv.experience || [])];
      if (isValidIndex(args.index, experience.length) && args.break !== undefined) {
        experience[args.index] = {
          ...experience[args.index],
          break: args.break,
        };
      }
      return {
        ...cv,
        experience,
      };
    }
    case "updateSectionLabels": {
      return {
        ...cv,
        sectionLabels: {
          ...(cv.sectionLabels || {}),
          ...args.sectionLabels,
        },
      };
    }
    case "reorderSections": {
      if (!args.sectionsOrder) return cv;
      // Drop unknown/duplicate IDs so a bad model call can't add phantom sections.
      const known = new Set([
        ...DEFAULT_SECTIONS_ORDER,
        ...(cv.customSections || []).map((s) => s.id),
      ]);
      return {
        ...cv,
        sectionsOrder: [...new Set(args.sectionsOrder)].filter((id) => known.has(id)),
      };
    }
    case "setSectionVisibility": {
      if (!args.sectionId || args.hidden === undefined) return cv;
      const hidden = new Set(cv.hiddenSections || []);
      if (args.hidden) hidden.add(args.sectionId);
      else hidden.delete(args.sectionId);
      // Un-hiding a section that's missing from an explicit order must also list it.
      const sectionsOrder =
        !args.hidden && cv.sectionsOrder && !cv.sectionsOrder.includes(args.sectionId)
          ? [...cv.sectionsOrder, args.sectionId]
          : cv.sectionsOrder;
      return { ...cv, hiddenSections: [...hidden], sectionsOrder };
    }
    case "updateCustomSection": {
      if (!args.id) return cv;
      const customSections = [...(cv.customSections || [])];
      const existingIdx = customSections.findIndex((s) => s.id === args.id);

      if (args.delete) {
        if (existingIdx !== -1) {
          customSections.splice(existingIdx, 1);
        }
        const sectionsOrder = cv.sectionsOrder?.filter((id) => id !== args.id);
        const hiddenSections = cv.hiddenSections?.filter((id) => id !== args.id);
        return {
          ...cv,
          customSections,
          sectionsOrder,
          hiddenSections,
        };
      }

      const updatedSection = {
        id: args.id,
        title: args.title ?? (existingIdx !== -1 ? customSections[existingIdx].title : args.id),
        content:
          args.content ?? (existingIdx !== -1 ? customSections[existingIdx].content : undefined),
        bulletPoints:
          args.bulletPoints ??
          (existingIdx !== -1 ? customSections[existingIdx].bulletPoints : undefined),
      };

      if (existingIdx !== -1) {
        customSections[existingIdx] = updatedSection;
      } else {
        customSections.push(updatedSection);
      }

      // Without an explicit order, templates use the defaults and append custom sections.
      const sectionsOrder = cv.sectionsOrder ? [...cv.sectionsOrder] : undefined;
      if (sectionsOrder && !sectionsOrder.includes(args.id)) {
        sectionsOrder.push(args.id);
      }

      return {
        ...cv,
        customSections,
        sectionsOrder,
      };
    }
    case "updateOtherSection": {
      if (args.delete) {
        const { other: _, ...rest } = cv;
        return rest;
      }
      if (args.label && args.value) {
        return {
          ...cv,
          other: {
            label: args.label,
            value: args.value,
          },
        };
      }
      return cv;
    }
    case "updateCoverLetter": {
      if (args.content === undefined) return cv;
      return {
        ...cv,
        coverLetter: args.content,
      };
    }
    case "updateCV": {
      // The tool's input *is* the CV (cvSchema), not `{ cvData }`. Merge so fields the
      // model omits (cover letter, layout, theme) aren't silently wiped.
      const { cvData, ...full } = args as MutationArgs & Partial<CVData>;
      const next = cvData ?? (full as Partial<CVData>);
      if (!next.name && !next.experience) return cv;
      return { ...cv, ...next };
    }
    default:
      return cv;
  }
}
