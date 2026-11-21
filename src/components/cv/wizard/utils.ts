import { CVData } from "@/lib/types";
import { cvSchema } from "@/lib/schemas/cv";

export type StepErrors = Record<string, string>;

/** Fill missing fields so every input stays controlled and every list is an array. */
export function normalizeCV<T extends Partial<CVData>>(d: T): T & CVData {
  return {
    ...d,
    name: d.name ?? "",
    title: d.title ?? "",
    email: d.email ?? "",
    phone: d.phone ?? "",
    location: d.location ?? "",
    linkedin: d.linkedin ?? "",
    summary: d.summary ?? "",
    coverLetter: d.coverLetter ?? "",
    other: { label: d.other?.label ?? "", value: d.other?.value ?? "" },
    // Data may come from the DB, an LLM parse or a file, so fields can be missing at runtime.
    skills: (d.skills ?? []).map((s) => ({ ...s, name: s.name ?? "", items: s.items ?? "" })),
    experience: (d.experience ?? []).map((e) => ({
      ...e,
      role: e.role ?? "",
      company: e.company ?? "",
      client: e.client ?? "",
      dates: e.dates ?? "",
      bulletPoints: e.bulletPoints?.length ? e.bulletPoints : [""],
    })),
    education: (d.education ?? []).map((e) => ({
      ...e,
      degree: e.degree ?? "",
      institution: e.institution ?? "",
      location: e.location ?? "",
      details: e.details ?? "",
    })),
    certifications: (d.certifications ?? []).map((c) => ({
      ...c,
      name: c.name ?? "",
      date: c.date ?? "",
    })),
  };
}

/** Parse untrusted JSON (file import / localStorage draft) into CVData, or throw. */
export function parseCV(text: string): CVData {
  const raw: unknown = JSON.parse(text);
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) throw new Error("Not a CV object");
  const result = cvSchema.safeParse(normalizeCV(raw as Partial<CVData>));
  if (!result.success) throw new Error(result.error.issues[0]?.message ?? "Invalid CV data");
  return normalizeCV(result.data as CVData);
}

export function moveItem<T>(arr: T[], from: number, to: number): T[] {
  if (to < 0 || to >= arr.length) return arr;
  const next = [...arr];
  const [item] = next.splice(from, 1);
  next.splice(to, 0, item);
  return next;
}

/** Split pasted multi-line text into bullets, stripping list markers like "•", "-", "*", "1.". */
export function splitBullets(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((l) => l.replace(/^\s*(?:[•\-*–]|\d+[.)])\s*/, "").trim())
    .filter(Boolean);
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateStep(step: string, d: CVData & { profileName?: string }): StepErrors {
  const e: StepErrors = {};
  if (step === "Metadata" && !d.profileName?.trim()) e.profileName = "Profile name is required";
  if (step === "Personal Info") {
    if (!d.name.trim()) e.name = "Full name is required";
    if (d.email.trim() && !EMAIL_RE.test(d.email.trim())) e.email = "Enter a valid email address";
  }
  return e;
}
