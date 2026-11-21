// Run: npx tsx src/lib/cv/cv.selfcheck.ts
import assert from "node:assert/strict";
import type { CVData } from "@/lib/types";
import { applyCvMutation, parseCv } from "./mutations";
import { updateWorkExperienceSchema } from "./mutation-schemas";
import { getLayoutSections, getOrderedSectionIds } from "./sections";
import { computeAtsMatch, extractKeywords } from "./ats";
import { buildPdfFileName } from "./filename";

const base: CVData = {
  name: "Jane Doe",
  title: "Engineer",
  email: "j@x.io",
  phone: "1",
  summary: "Builds things",
  skills: [{ name: "Lang", items: "TypeScript, React" }],
  experience: [
    { role: "Dev", company: "A", client: "BigBank", dates: "2020", bulletPoints: ["x"] },
    { role: "Jr", company: "B", client: "", dates: "2018", bulletPoints: [] },
  ],
  education: [{ degree: "BSc", institution: "U", location: "L" }],
  certifications: [{ name: "AWS", date: "2021" }],
  coverLetter: "Dear",
  templateId: "creative",
};

// Partial experience update must not wipe `client` via schema default.
const args = updateWorkExperienceSchema.parse({ index: 0, experience: { role: "Senior Dev" } });
let cv = applyCvMutation(base, "updateWorkExperience", args);
assert.equal(cv.experience[0].role, "Senior Dev");
assert.equal(cv.experience[0].client, "BigBank");
assert.equal(base.experience[0].role, "Dev", "input must not be mutated");

// Out-of-range / fractional indices are no-ops.
assert.deepEqual(
  applyCvMutation(base, "deleteWorkExperience", { index: 5 }).experience,
  base.experience,
);
assert.deepEqual(
  applyCvMutation(base, "deleteWorkExperience", { index: 0.5 }).experience,
  base.experience,
);
assert.equal(applyCvMutation(base, "deleteWorkExperience", { index: 1 }).experience.length, 1);

// updateCV receives the CV itself (cvSchema), and keeps fields the model omitted.
const { coverLetter: _c, templateId: _t, ...withoutExtras } = base;
cv = applyCvMutation(base, "updateCV", { ...withoutExtras, summary: "New" } as never);
assert.equal(cv.summary, "New");
assert.equal(cv.coverLetter, "Dear");
assert.equal(cv.templateId, "creative");
assert.deepEqual(applyCvMutation(base, "updateCV", {}), base);

// Custom section without explicit order must not hide default sections.
cv = applyCvMutation(base, "updateCustomSection", {
  id: "projects",
  title: "Projects",
  content: "P",
});
assert.equal(cv.sectionsOrder, undefined);
assert.deepEqual(getOrderedSectionIds(cv), [
  "summary",
  "skills",
  "experience",
  "education",
  "certifications",
  "other",
  "projects",
]);
cv = applyCvMutation(cv, "updateCustomSection", { id: "projects", delete: true });
assert.equal(cv.customSections?.length, 0);

// Reorder drops unknown/duplicate ids; hide/show round-trips.
cv = applyCvMutation(base, "reorderSections", {
  sectionsOrder: ["skills", "bogus", "skills", "summary"],
});
assert.deepEqual(cv.sectionsOrder, ["skills", "summary"]);
assert.deepEqual(getOrderedSectionIds(cv), ["skills", "summary"]);
assert.equal(getLayoutSections(cv).find((s) => s.id === "experience")?.hidden, true);
cv = applyCvMutation(cv, "setSectionVisibility", { sectionId: "experience", hidden: false });
assert.deepEqual(getOrderedSectionIds(cv), ["skills", "summary", "experience"]);
cv = applyCvMutation(cv, "setSectionVisibility", { sectionId: "skills", hidden: true });
assert.deepEqual(getOrderedSectionIds(cv), ["summary", "experience"]);

// Cover letter without content is a no-op; other-section delete works.
assert.equal(applyCvMutation(base, "updateCoverLetter", {}).coverLetter, "Dear");
assert.equal(
  applyCvMutation({ ...base, other: { label: "a", value: "b" } }, "updateOtherSection", {
    delete: true,
    label: "",
    value: "",
  }).other,
  undefined,
);

// parseCv: legacy/partial data gets defaults; garbage and oversized data rejected.
assert.deepEqual(parseCv('{"name":"X","skills":null}')?.skills, []);
assert.equal(parseCv("not json"), null);
assert.equal(parseCv([]), null);
assert.equal(parseCv({ ...base, summary: "x".repeat(200_000) }), null);

// ATS
const jd =
  "We need React and TypeScript. Machine learning experience. Machine learning in production. Kubernetes a plus.";
const kws = extractKeywords(jd);
assert.ok(kws.includes("machine learning"), kws.join());
assert.ok(kws.includes("react") && kws.includes("kubernetes"));
assert.ok(!kws.includes("and") && !kws.includes("we"));
const ats = computeAtsMatch(base, jd);
assert.ok(ats.matched.includes("react") && ats.missing.includes("kubernetes"));
assert.ok(ats.score > 0 && ats.score < 100);
assert.equal(computeAtsMatch(base, "").score, 0);

// Filenames
assert.equal(
  buildPdfFileName(["José Pérez", "Acme, Inc.", "Sr. Engineer"], "CV"),
  "Jose_Perez_Acme_Inc_Sr_Engineer_CV.pdf",
);
assert.equal(buildPdfFileName(["", "../../etc"], undefined), "etc.pdf");
assert.equal(buildPdfFileName([]), "document.pdf");

console.log("cv self-check: all assertions passed");
