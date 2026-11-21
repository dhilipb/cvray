import type { CVData } from "@/lib/types";

// shortcut: hand-rolled stopword list + unigram/bigram frequency; upgrade to an LLM/NLP extractor if scores feel noisy.
const STOPWORDS = new Set(
  `a about above across after again against all also am an and any are as at be because been before being
below between both but by can could did do does doing down during each either else etc ever every few for
from further get gets had has have having he her here hers him his how however i if in into is it its itself
just least less let like ll made make many may me might more most much must my need needs new no nor not now
of off on once one only or other our ours out over own per please plus re role same she should so some such
than that the their them then there these they this those through to too under until up upon us use used
using very via was way we well were what when where whether which while who whom whose why will with within
without would yet you your yours able ability across work working works team teams company candidate
candidates experience experienced years year strong excellent good great including include includes join
looking opportunity responsibilities requirements required preferred skills skill knowledge understanding
environment ensure help support day days based level related relevant within across etc e g ie eg job position
apply applicants benefits salary location remote hybrid office time full part equal employer`.split(
    /\s+/,
  ),
);

const tokenize = (text: string): string[] =>
  (text.toLowerCase().match(/[a-z0-9][a-z0-9+#./-]*[a-z0-9+#]|[a-z0-9]/g) || []).map((t) =>
    t.replace(/[./-]+$/, ""),
  );

const isKeyword = (t: string) => t.length > 1 && !STOPWORDS.has(t) && !/^\d+$/.test(t);

/** Top keywords/phrases from a job description, most frequent first. */
export function extractKeywords(jobDescription: string, limit = 25): string[] {
  const tokens = tokenize(jobDescription);
  const counts = new Map<string, number>();
  const bump = (k: string, n = 1) => counts.set(k, (counts.get(k) || 0) + n);
  tokens.forEach((t, i) => {
    if (!isKeyword(t)) return;
    bump(t);
    const next = tokens[i + 1];
    // Repeated two-word phrases ("machine learning") are stronger signals than either word.
    if (next && isKeyword(next)) bump(`${t} ${next}`, 0.5);
  });
  const ranked = [...counts.entries()]
    .filter(([k, c]) => !k.includes(" ") || c >= 1) // phrases must repeat
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const result: string[] = [];
  for (const [k] of ranked) {
    // Skip single words already covered by a chosen phrase.
    if (result.some((r) => r.includes(" ") && r.split(" ").includes(k))) continue;
    result.push(k);
    if (result.length >= limit) break;
  }
  return result;
}

export function cvToPlainText(cv: CVData): string {
  return [
    cv.title,
    cv.summary,
    ...(cv.skills || []).flatMap((s) => [s.name, s.items]),
    ...(cv.experience || []).flatMap((e) => [e.role, e.company, ...(e.bulletPoints || [])]),
    ...(cv.education || []).flatMap((e) => [e.degree, e.institution, e.details]),
    ...(cv.certifications || []).map((c) => c.name),
    ...(cv.customSections || []).flatMap((s) => [s.title, s.content, ...(s.bulletPoints || [])]),
    cv.other?.value,
  ]
    .filter(Boolean)
    .join("\n");
}

export interface AtsResult {
  score: number;
  matched: string[];
  missing: string[];
}

export function computeAtsMatch(cv: CVData, jobDescription: string): AtsResult {
  const keywords = extractKeywords(jobDescription);
  const cvTokens = tokenize(cvToPlainText(cv));
  const cvSet = new Set(cvTokens);
  const cvJoined = ` ${cvTokens.join(" ")} `;
  const matched: string[] = [];
  const missing: string[] = [];
  for (const k of keywords) {
    const hit = k.includes(" ") ? cvJoined.includes(` ${k} `) : cvSet.has(k);
    (hit ? matched : missing).push(k);
  }
  const score = keywords.length ? Math.round((matched.length / keywords.length) * 100) : 0;
  return { score, matched, missing };
}
