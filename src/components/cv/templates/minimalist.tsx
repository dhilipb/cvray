import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";
import {
  renderBulletHtml,
  formatDisplayUrl,
  formatLinkUrl,
  SECTION_LABELS,
  DEFAULT_COVER_LETTER,
} from "./constants";
import { ColorPalette, COLOR_THEMES, DEFAULT_THEME } from "./themes";

// SWISS MINIMALIST THEME: Ultra-clean design with generous whitespace and perfect grid alignment
const baseStyles = StyleSheet.create({
  page: {
    padding: 60,
    fontFamily: "Inter",
    fontSize: 9,
    color: "#1a1a1a",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 48,
  },
  name: {
    fontWeight: 300,
    fontSize: 28,
    letterSpacing: -0.5,
    marginBottom: 6,
    color: "#000000",
  },
  title: {
    fontSize: 11,
    fontWeight: 400,
    color: "#666666",
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: "#666666",
    gap: 4,
  },
  contactItem: {
    marginRight: 16,
  },
  contactDot: {
    marginRight: 16,
    color: "#cccccc",
  },
  link: {
    textDecoration: "none",
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 16,
    marginTop: 36,
    color: "#000000",
  },
  summaryText: {
    lineHeight: 1.7,
    marginBottom: 12,
    color: "#333333",
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  skillName: {
    width: "28%",
    fontWeight: 500,
    fontSize: 8.5,
    color: "#000000",
  },
  skillItems: {
    width: "72%",
    color: "#555555",
    fontSize: 8.5,
    lineHeight: 1.6,
  },
  expBlock: {
    marginBottom: 24,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
    alignItems: "baseline",
  },
  expRole: {
    fontWeight: 500,
    fontSize: 10,
    color: "#000000",
    flex: 1,
  },
  expDates: {
    fontSize: 8,
    color: "#999999",
    fontWeight: 400,
  },
  expCompany: {
    fontSize: 9,
    color: "#555555",
    marginBottom: 10,
  },
  expClient: {
    fontSize: 8,
    color: "#999999",
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 9,
    fontWeight: 600,
    color: "#000000",
    marginTop: 16,
    marginBottom: 10,
    paddingLeft: 12,
    borderLeftWidth: 1.5,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 16,
    fontSize: 8,
    color: "#999999",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#333333",
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: 600,
    color: "#000000",
  },
  eduBlock: {
    marginBottom: 16,
  },
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "baseline",
  },
  eduDegree: {
    fontWeight: 500,
    fontSize: 9.5,
    color: "#000000",
    flex: 1,
  },
  eduLocation: {
    fontSize: 8,
    color: "#999999",
  },
  eduInst: {
    color: "#555555",
    fontSize: 9,
    marginBottom: 2,
  },
  eduDetails: {
    color: "#999999",
    fontSize: 8,
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "baseline",
  },
  certName: {
    fontWeight: 500,
    fontSize: 9,
    color: "#000000",
    flex: 1,
  },
  certDate: {
    color: "#999999",
    fontSize: 8,
  },
  otherSection: {
    marginTop: 24,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data, colors }: { data: CVData; colors: ColorPalette }) => {
  const _contacts = [
    data.email,
    data.phone,
    data.location,
    data.linkedin ? formatDisplayUrl(data.linkedin) : null,
  ].filter(Boolean);

  return (
    <View style={baseStyles.header}>
      <Text style={baseStyles.name}>{data.name}</Text>
      <Text style={[baseStyles.title, { color: colors.primaryText }]}>{data.title}</Text>
      <View style={baseStyles.contactRow}>
        {data.email && <Text style={baseStyles.contactItem}>{data.email}</Text>}
        {data.email && data.phone && <Text style={baseStyles.contactDot}>·</Text>}
        {data.phone && <Text style={baseStyles.contactItem}>{data.phone}</Text>}
        {data.phone && data.location && <Text style={baseStyles.contactDot}>·</Text>}
        {data.location && <Text style={baseStyles.contactItem}>{data.location}</Text>}
        {data.location && data.linkedin && <Text style={baseStyles.contactDot}>·</Text>}
        {data.linkedin && (
          <Link
            style={[baseStyles.link, baseStyles.contactItem, { color: colors.primary }]}
            src={formatLinkUrl(data.linkedin)}
          >
            {formatDisplayUrl(data.linkedin)}
          </Link>
        )}
      </View>
    </View>
  );
};

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data, colors }: { data: CVData; colors: ColorPalette }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={baseStyles.sectionTitle}>{SECTION_LABELS.EXPERIENCE}</Text>
      {data.experience.map((exp, idx) => {
        const showHeader = exp.sectionHeader && exp.sectionHeader !== currentHeader;
        if (showHeader) currentHeader = exp.sectionHeader!;

        return (
          <View key={idx}>
            {showHeader && (
              <Text style={[baseStyles.sectionHeader, { borderLeftColor: colors.primary }]}>
                {exp.sectionHeader}
              </Text>
            )}
            <View style={baseStyles.expBlock} break={idx === 0 ? false : exp.break}>
              <View wrap={false}>
                <View style={baseStyles.expHeaderRow}>
                  <Text style={baseStyles.expRole}>{exp.role}</Text>
                  <Text style={baseStyles.expDates}>{exp.dates}</Text>
                </View>
                <Text style={baseStyles.expCompany}>{exp.company}</Text>
                {exp.client && <Text style={baseStyles.expClient}>Client: {exp.client}</Text>}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={baseStyles.bulletRow}>
                    <Text style={baseStyles.bulletPoint}>—</Text>
                    <Text style={baseStyles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], baseStyles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={baseStyles.bulletRow}>
                    <Text style={baseStyles.bulletPoint}>—</Text>
                    <Text style={baseStyles.bulletText}>
                      {renderBulletHtml(bp, baseStyles.boldText)}
                    </Text>
                  </View>
                ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

/* --------- Swiss Minimalist CV (formerly Minimalist) --------- */

export const MinimalistCV = ({ data, colors }: { data: CVData; colors?: ColorPalette }) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cv">
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader data={data} colors={c} />

        {data.summary && (
          <View>
            <Text style={baseStyles.sectionTitle}>{SECTION_LABELS.PROFILE}</Text>
            <Text style={baseStyles.summaryText}>{data.summary}</Text>
          </View>
        )}

        <ExperienceSection data={data} colors={c} />

        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>{SECTION_LABELS.SKILLS}</Text>
            {data.skills.map((skill, idx) => (
              <View key={idx} style={baseStyles.skillRow} wrap={false}>
                <Text style={baseStyles.skillName}>{skill.name}</Text>
                <Text style={baseStyles.skillItems}>{skill.items}</Text>
              </View>
            ))}
          </View>
        )}

        {data.education && data.education.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>{SECTION_LABELS.EDUCATION}</Text>
            {data.education.map((edu, idx) => (
              <View key={idx} style={baseStyles.eduBlock} wrap={false}>
                <View style={baseStyles.eduHeaderRow}>
                  <Text style={baseStyles.eduDegree}>{edu.degree}</Text>
                  <Text style={baseStyles.eduLocation}>{edu.location}</Text>
                </View>
                <Text style={baseStyles.eduInst}>{edu.institution}</Text>
                {edu.details && <Text style={baseStyles.eduDetails}>{edu.details}</Text>}
              </View>
            ))}
          </View>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={baseStyles.sectionTitle}>{SECTION_LABELS.CERTIFICATIONS}</Text>
            {data.certifications.map((cert, idx) => (
              <View key={idx} style={baseStyles.certRow} wrap={false}>
                <Text style={baseStyles.certName}>{cert.name}</Text>
                <Text style={baseStyles.certDate}>{cert.date}</Text>
              </View>
            ))}
          </View>
        )}

        {data.other && (
          <View style={baseStyles.otherSection} wrap={false}>
            <Text style={baseStyles.sectionTitle}>{data.other.label}</Text>
            <Text style={baseStyles.summaryText}>{data.other.value}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

/* --------- Swiss Minimalist Cover Letter (formerly Minimalist) --------- */

export const MinimalistCoverLetter = ({
  content,
  data,
  colors,
}: {
  content?: string;
  data: CVData;
  colors?: ColorPalette;
}) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cover-letter">
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader data={data} colors={c} />
        <View style={{ marginTop: 40 }}>
          <Text style={baseStyles.sectionTitle}>Cover Letter</Text>
          <Text style={{ fontSize: 9.5, lineHeight: 1.8, color: "#333333" }}>
            {content || DEFAULT_COVER_LETTER(data.name)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
