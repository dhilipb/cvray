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

// TECHNICAL THEME: Grid-based layout with accent bars and structured feel, perfect for tech/engineering roles
const baseStyles = StyleSheet.create({
  page: {
    padding: 45,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#1a1a1a",
    lineHeight: 1.5,
    backgroundColor: "#fafafa",
  },
  header: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 3,
  },
  name: {
    fontWeight: 700,
    fontSize: 24,
    marginBottom: 4,
    color: "#0a0a0a",
    letterSpacing: -0.3,
  },
  title: {
    fontSize: 11,
    fontWeight: 500,
    marginBottom: 12,
    color: "#4a4a4a",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: "#666666",
    gap: 2,
  },
  contactItem: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: "#ffffff",
    marginRight: 4,
    marginBottom: 4,
    borderRadius: 2,
  },
  link: {
    textDecoration: "none",
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.8,
    marginBottom: 10,
    marginTop: 20,
    paddingLeft: 10,
    paddingVertical: 6,
    color: "#ffffff",
  },
  summaryContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  summaryText: {
    lineHeight: 1.6,
    color: "#2a2a2a",
  },
  skillsGrid: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  skillName: {
    width: "26%",
    fontWeight: 700,
    fontSize: 8.5,
    color: "#0a0a0a",
    paddingRight: 8,
  },
  skillItems: {
    width: "74%",
    color: "#4a4a4a",
    fontSize: 8.5,
    lineHeight: 1.5,
  },
  expContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "baseline",
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  expRole: {
    fontWeight: 700,
    fontSize: 10.5,
    color: "#0a0a0a",
    flex: 1,
  },
  expDates: {
    fontSize: 8,
    fontWeight: 600,
    color: "#666666",
    fontFamily: "Inter",
  },
  expCompany: {
    fontSize: 9.5,
    fontWeight: 600,
    color: "#4a4a4a",
    marginBottom: 8,
    marginTop: 6,
  },
  expClient: {
    fontSize: 8.5,
    color: "#888888",
    marginBottom: 8,
    fontStyle: "italic",
  },
  sectionHeader: {
    fontSize: 9.5,
    fontWeight: 700,
    color: "#0a0a0a",
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 8,
    paddingVertical: 3,
    borderLeftWidth: 3,
    backgroundColor: "#f0f0f0",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 5,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 14,
    fontSize: 9,
    fontWeight: 700,
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#2a2a2a",
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: 700,
    color: "#0a0a0a",
  },
  eduContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  eduBlock: {
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e5e5e5",
  },
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 3,
    alignItems: "baseline",
  },
  eduDegree: {
    fontWeight: 700,
    fontSize: 10,
    color: "#0a0a0a",
    flex: 1,
  },
  eduLocation: {
    fontSize: 8,
    color: "#888888",
  },
  eduInst: {
    fontSize: 9,
    color: "#4a4a4a",
    marginBottom: 2,
  },
  eduDetails: {
    fontSize: 8,
    color: "#888888",
  },
  certContainer: {
    backgroundColor: "#ffffff",
    padding: 12,
    marginBottom: 16,
    borderLeftWidth: 3,
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    alignItems: "baseline",
  },
  certName: {
    fontWeight: 600,
    fontSize: 9,
    color: "#0a0a0a",
    flex: 1,
  },
  certDate: {
    fontSize: 8,
    color: "#888888",
  },
  otherSection: {
    backgroundColor: "#ffffff",
    padding: 12,
    borderLeftWidth: 3,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data, colors }: { data: CVData; colors: ColorPalette }) => (
  <View style={[baseStyles.header, { borderBottomColor: colors.primary }]}>
    <Text style={baseStyles.name}>{data.name}</Text>
    {data.title && (
      <Text style={[baseStyles.title, { color: colors.primaryDark }]}>{data.title}</Text>
    )}
    <View style={baseStyles.contactRow}>
      {data.email && (
        <Text
          style={[
            baseStyles.contactItem,
            { backgroundColor: colors.accentBg, color: colors.primaryText },
          ]}
        >
          {data.email}
        </Text>
      )}
      {data.phone && (
        <Text
          style={[
            baseStyles.contactItem,
            { backgroundColor: colors.accentBg, color: colors.primaryText },
          ]}
        >
          {data.phone}
        </Text>
      )}
      {data.location && (
        <Text
          style={[
            baseStyles.contactItem,
            { backgroundColor: colors.accentBg, color: colors.primaryText },
          ]}
        >
          {data.location}
        </Text>
      )}
      {data.linkedin && (
        <Link
          style={[
            baseStyles.link,
            baseStyles.contactItem,
            { backgroundColor: colors.accentBg, color: colors.primary },
          ]}
          src={formatLinkUrl(data.linkedin)}
        >
          {formatDisplayUrl(data.linkedin)}
        </Link>
      )}
    </View>
  </View>
);

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data, colors }: { data: CVData; colors: ColorPalette }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={[baseStyles.sectionTitle, { backgroundColor: colors.primary }]}>
        {SECTION_LABELS.EXPERIENCE}
      </Text>
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
            <View
              style={[baseStyles.expContainer, { borderLeftColor: colors.primary }]}
              break={idx === 0 ? false : exp.break}
            >
              <View wrap={false}>
                <View style={baseStyles.expHeaderRow}>
                  <Text style={baseStyles.expRole}>{exp.role}</Text>
                  <Text style={baseStyles.expDates}>{exp.dates}</Text>
                </View>
                <Text style={[baseStyles.expCompany, { color: colors.primaryDark }]}>
                  {exp.company}
                </Text>
                {exp.client && <Text style={baseStyles.expClient}>Client: {exp.client}</Text>}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={baseStyles.bulletRow}>
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>▪</Text>
                    <Text style={baseStyles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], baseStyles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={baseStyles.bulletRow}>
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>▪</Text>
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

/* --------- Technical CV (formerly Professional) --------- */

export const ProfessionalCV = ({ data, colors }: { data: CVData; colors?: ColorPalette }) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cv">
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader data={data} colors={c} />

        {data.summary && (
          <View>
            <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
              {SECTION_LABELS.SUMMARY}
            </Text>
            <View style={[baseStyles.summaryContainer, { borderLeftColor: c.primary }]}>
              <Text style={baseStyles.summaryText}>{data.summary}</Text>
            </View>
          </View>
        )}

        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
              {SECTION_LABELS.SKILLS}
            </Text>
            <View style={[baseStyles.skillsGrid, { borderLeftColor: c.primary }]}>
              {data.skills.map((skill, idx) => (
                <View key={idx} style={baseStyles.skillRow} wrap={false}>
                  <Text style={[baseStyles.skillName, { color: c.primaryDark }]}>{skill.name}</Text>
                  <Text style={baseStyles.skillItems}>{skill.items}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <ExperienceSection data={data} colors={c} />

        {data.education && data.education.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
              {SECTION_LABELS.EDUCATION}
            </Text>
            <View style={[baseStyles.eduContainer, { borderLeftColor: c.primary }]}>
              {data.education.map((edu, idx) => (
                <View
                  key={idx}
                  style={[
                    baseStyles.eduBlock,
                    idx === data.education!.length - 1 ? { borderBottomWidth: 0 } : {},
                  ]}
                  wrap={false}
                >
                  <View style={baseStyles.eduHeaderRow}>
                    <Text style={baseStyles.eduDegree}>{edu.degree}</Text>
                    <Text style={baseStyles.eduLocation}>{edu.location}</Text>
                  </View>
                  <Text style={baseStyles.eduInst}>{edu.institution}</Text>
                  {edu.details && <Text style={baseStyles.eduDetails}>{edu.details}</Text>}
                </View>
              ))}
            </View>
          </View>
        )}

        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
              {SECTION_LABELS.CERTIFICATIONS}
            </Text>
            <View style={[baseStyles.certContainer, { borderLeftColor: c.primary }]}>
              {data.certifications.map((cert, idx) => (
                <View key={idx} style={baseStyles.certRow} wrap={false}>
                  <Text style={baseStyles.certName}>{cert.name}</Text>
                  <Text style={baseStyles.certDate}>{cert.date}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {data.other && (
          <View wrap={false}>
            <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
              {data.other.label}
            </Text>
            <View style={[baseStyles.otherSection, { borderLeftColor: c.primary }]}>
              <Text style={baseStyles.summaryText}>{data.other.value}</Text>
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
};

/* --------- Technical Cover Letter (formerly Professional) --------- */

export const ProfessionalCoverLetter = ({
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
        <View style={{ marginTop: 24 }}>
          <Text style={[baseStyles.sectionTitle, { backgroundColor: c.primary }]}>
            Cover Letter
          </Text>
          <View style={[baseStyles.summaryContainer, { borderLeftColor: c.primary }]}>
            <Text style={{ fontSize: 9.5, lineHeight: 1.7, color: "#2a2a2a" }}>
              {content || DEFAULT_COVER_LETTER(data.name)}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};
