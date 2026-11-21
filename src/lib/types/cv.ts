/* --------- CV Related Types --------- */

export interface WorkExperience {
  role: string;
  company: string;
  client: string;
  dates: string;
  bulletPoints: string[];
  sectionHeader?: string;
  break?: boolean;
}

export interface SkillCategory {
  name: string;
  items: string;
}

export interface Education {
  degree: string;
  institution: string;
  location: string;
  details?: string;
}

export interface Certification {
  name: string;
  date: string;
}

export interface CustomSection {
  id: string;
  title: string;
  content?: string;
  bulletPoints?: string[];
}

export interface SectionLabels {
  summary?: string;
  skills?: string;
  experience?: string;
  education?: string;
  certifications?: string;
  other?: string;
}

export interface CVData {
  name: string;
  title: string;
  email: string;
  phone: string;
  location?: string;
  linkedin?: string;
  summary: string;
  skills: SkillCategory[];
  experience: WorkExperience[];
  education: Education[];
  certifications: Certification[];
  coverLetter?: string;
  other?: {
    label: string;
    value: string;
  };
  sectionsOrder?: string[];
  /** Section IDs (built-in or custom) excluded from rendering. */
  hiddenSections?: string[];
  customSections?: CustomSection[];
  sectionLabels?: SectionLabels;
  templateId?: string;
  themeId?: string;
}
