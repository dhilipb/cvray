import { z } from "zod";
import { cvSchema } from "@/lib/schemas/cv";
import { JOB_STATUSES } from "@/components/cv/jobUtils";

/* --------- Schemas --------- */

const MAX_JSON = 2_000_000;

const urlField = z
  .string()
  .trim()
  .max(2048)
  .refine((v) => v === "" || /^https?:\/\//i.test(v), "must start with http:// or https://")
  .transform((v) => v || null)
  .nullable()
  .optional();

// loose(): validate known CV fields but keep extra keys the editor may add.
const cvObject = cvSchema.loose();

// CV stored as a JSON string: must parse and match the CV schema; re-serialized from parsed data.
const cvJsonString = z
  .string()
  .max(MAX_JSON)
  .transform((v, ctx) => {
    try {
      return JSON.parse(v) as unknown;
    } catch {
      ctx.addIssue({ code: "custom", message: "must be valid JSON" });
      return z.NEVER;
    }
  })
  .pipe(cvObject)
  .transform((v) => JSON.stringify(v));

const jobFields = {
  company: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  status: z.enum(JOB_STATUSES),
  url: urlField,
  jobDescription: z.string().max(50_000).nullable().optional(),
  notes: z.string().max(10_000).nullable().optional(),
};

export const jobCreateSchema = z.object({
  ...jobFields,
  status: jobFields.status.optional(),
});

// Whitelist of updatable fields: userProfileId / id / appliedAt can never be set by clients.
export const jobUpdateSchema = z
  .object({
    ...jobFields,
    tweakedCvJson: cvJsonString.nullable(),
  })
  .partial();

export const profileUpdateSchema = z
  .object({
    name: z.string().trim().min(1).max(200),
    description: z.string().max(5000).nullable(),
    parsedProfileJson: cvObject,
  })
  .partial();
