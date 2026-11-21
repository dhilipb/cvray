// Run: npx tsx src/app/api/profiles/_schemas.selfcheck.ts
import assert from "node:assert/strict";
import { jobCreateSchema, jobUpdateSchema, profileUpdateSchema } from "./_schemas";

const cv = {
  name: "Jane",
  title: "Eng",
  email: "",
  phone: "",
  summary: "",
  skills: [],
  experience: [],
  education: [],
  certifications: [],
  extraKey: 1,
};

// Create: required fields, http(s)-only URLs, empty URL -> null
assert.equal(jobCreateSchema.safeParse({ company: "", role: "x" }).success, false);
assert.equal(
  jobCreateSchema.safeParse({ company: "a", role: "b", url: "javascript:alert(1)" }).success,
  false,
);
assert.equal(jobCreateSchema.parse({ company: "a", role: "b", url: "" }).url, null);
assert.equal(
  jobCreateSchema.safeParse({ company: "a", role: "b", status: "Hacked" }).success,
  false,
);

// Update: mass-assignment fields are stripped
const upd = jobUpdateSchema.parse({ status: "Offer", userProfileId: "other", id: "x" });
assert.deepEqual(upd, { status: "Offer" });

// tweakedCvJson must be a valid CV JSON string; unknown keys kept
assert.equal(jobUpdateSchema.safeParse({ tweakedCvJson: "not json" }).success, false);
assert.equal(jobUpdateSchema.safeParse({ tweakedCvJson: '{"name":1}' }).success, false);
const ok = jobUpdateSchema.parse({ tweakedCvJson: JSON.stringify(cv) });
assert.equal(JSON.parse(ok.tweakedCvJson!).extraKey, 1);
assert.equal(jobUpdateSchema.parse({ tweakedCvJson: null }).tweakedCvJson, null);

// Profile update
assert.equal(profileUpdateSchema.safeParse({ parsedProfileJson: { name: 1 } }).success, false);
assert.equal(profileUpdateSchema.safeParse({ name: "P", parsedProfileJson: cv }).success, true);

console.log("profiles schemas selfcheck OK");
