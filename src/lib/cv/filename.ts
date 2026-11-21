/** Builds e.g. "Jane_Doe_Acme_Inc_Senior_Engineer_CV.pdf" from arbitrary user text. */
export function buildPdfFileName(parts: (string | undefined | null)[], suffix?: string): string {
  const clean = [...parts, suffix]
    .map((p) =>
      (p || "")
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .replace(/[^A-Za-z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .slice(0, 40),
    )
    .filter(Boolean);
  return `${clean.join("_") || "document"}.pdf`;
}
