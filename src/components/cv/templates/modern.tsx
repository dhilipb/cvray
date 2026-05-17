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

// EXECUTIVE THEME: Bold two-column layout with sophisticated color blocking
const baseStyles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: "#2d3748",
    flexDirection: "row",
  },
  leftColumn: {
    width: "38%",
    paddingTop: 40,
    paddingLeft: 40,
    paddingRight: 25,
    paddingBottom: 40,
  },
  rightColumn: {
    width: "62%",
    padding: 40,
    paddingLeft: 30,
  },
  name: {
    fontWeight: 700,
    fontSize: 32,
    color: "#1a202c",
    marginBottom: 6,
    letterSpacing: -1,
    lineHeight: 1.1,
  },
  title: {
    fontSize: 14,
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: 24,
    letterSpacing: 0.5,
    lineHeight: 1.3,
  },
  leftSectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 12,
    marginTop: 24,
    paddingBottom: 6,
    borderBottomWidth: 2,
  },
  contactItem: {
    fontSize: 9,
    marginBottom: 8,
    color: "#4a5568",
    lineHeight: 1.4,
  },
  link: {
    textDecoration: "none",
    color: "#4a5568",
  },
  summaryText: {
    fontSize: 9.5,
    lineHeight: 1.6,
    color: "#4a5568",
    textAlign: "justify",
  },
  skillGroup: {
    marginBottom: 14,
  },
  skillName: {
    fontSize: 9,
    fontWeight: 700,
    marginBottom: 6,
    color: "#2d3748",
  },
  skillItems: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#4a5568",
  },
  rightSectionTitle: {
    fontSize: 16,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 18,
    marginTop: 8,
    paddingBottom: 8,
    color: "#1a202c",
  },
  sectionTitleBar: {
    height: 3,
    marginBottom: 18,
  },
  expBlock: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  expRole: {
    fontWeight: 700,
    fontSize: 12,
    color: "#1a202c",
    flex: 1,
  },
  expDates: {
    fontSize: 9,
    fontWeight: 600,
    color: "#718096",
  },
  expCompany: {
    fontSize: 10.5,
    fontWeight: 600,
    color: "#4a5568",
    marginBottom: 8,
  },
  expClient: {
    fontSize: 9,
    fontStyle: "italic",
    color: "#718096",
    marginBottom: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: "#2d3748",
    marginTop: 14,
    marginBottom: 10,
    paddingLeft: 10,
    paddingVertical: 4,
    borderLeftWidth: 4,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 14,
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.2,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#4a5568",
    lineHeight: 1.6,
  },
  boldText: {
    fontWeight: 700,
    color: "#2d3748",
  },
  eduBlock: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  eduDegree: {
    fontWeight: 700,
    fontSize: 10.5,
    color: "#1a202c",
    marginBottom: 3,
  },
  eduInst: {
    fontSize: 9.5,
    color: "#4a5568",
    marginBottom: 2,
  },
  eduDetails: {
    fontSize: 9,
    color: "#718096",
  },
  certRow: {
    marginBottom: 8,
  },
  certName: {
    fontWeight: 600,
    fontSize: 9.5,
    color: "#2d3748",
  },
  certDate: {
    fontSize: 8.5,
    color: "#718096",
    marginTop: 2,
  },
  otherSection: {
    marginTop: 16,
  },
});

/* --------- Left Sidebar Component --------- */

const LeftSidebar = ({ data, colors }: { data: CVData; colors: ColorPalette }) => (
  <View style={baseStyles.leftColumn}>
    <Text style={baseStyles.name}>{data.name}</Text>
    <Text style={[baseStyles.title, { color: colors.primary }]}>{data.title}</Text>

    <Text
      style={[
        baseStyles.leftSectionTitle,
        { borderBottomColor: colors.primary, color: colors.primaryDark },
      ]}
    >
      Contact
    </Text>
    {data.email && <Text style={baseStyles.contactItem}>{data.email}</Text>}
    {data.phone && <Text style={baseStyles.contactItem}>{data.phone}</Text>}
    {data.location && <Text style={baseStyles.contactItem}>{data.location}</Text>}
    {data.linkedin && (
      <Link
        style={[baseStyles.link, baseStyles.contactItem, { color: colors.primary }]}
        src={formatLinkUrl(data.linkedin)}
      >
        {formatDisplayUrl(data.linkedin)}
      </Link>
    )}

    {data.summary && (
      <View>
        <Text
          style={[
            baseStyles.leftSectionTitle,
            { borderBottomColor: colors.primary, color: colors.primaryDark },
          ]}
        >
          {SECTION_LABELS.PROFILE}
        </Text>
        <Text style={baseStyles.summaryText}>{data.summary}</Text>
      </View>
    )}

    {data.skills && data.skills.length > 0 && (
      <View>
        <Text
          style={[
            baseStyles.leftSectionTitle,
            { borderBottomColor: colors.primary, color: colors.primaryDark },
          ]}
        >
          {SECTION_LABELS.SKILLS}
        </Text>
        {data.skills.map((skill, idx) => (
          <View key={idx} style={baseStyles.skillGroup} wrap={false}>
            <Text style={[baseStyles.skillName, { color: colors.primaryText }]}>{skill.name}</Text>
            <Text style={baseStyles.skillItems}>{skill.items}</Text>
          </View>
        ))}
      </View>
    )}

    {data.certifications && data.certifications.length > 0 && (
      <View>
        <Text
          style={[
            baseStyles.leftSectionTitle,
            { borderBottomColor: colors.primary, color: colors.primaryDark },
          ]}
        >
          {SECTION_LABELS.CERTIFICATIONS}
        </Text>
        {data.certifications.map((cert, idx) => (
          <View key={idx} style={baseStyles.certRow} wrap={false}>
            <Text style={baseStyles.certName}>{cert.name}</Text>
            {cert.date && <Text style={baseStyles.certDate}>{cert.date}</Text>}
          </View>
        ))}
      </View>
    )}
  </View>
);

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data, colors }: { data: CVData; colors: ColorPalette }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={baseStyles.rightSectionTitle}>{SECTION_LABELS.EXPERIENCE}</Text>
      <View style={[baseStyles.sectionTitleBar, { backgroundColor: colors.primary }]} />
      {data.experience.map((exp, idx) => {
        const showHeader = exp.sectionHeader && exp.sectionHeader !== currentHeader;
        if (showHeader) currentHeader = exp.sectionHeader!;

        return (
          <View key={idx}>
            {showHeader && (
              <Text
                style={[
                  baseStyles.sectionHeader,
                  { borderLeftColor: colors.primary, backgroundColor: colors.accentBg },
                ]}
              >
                {exp.sectionHeader}
              </Text>
            )}
            <View
              style={[
                baseStyles.expBlock,
                idx === data.experience!.length - 1 ? { borderBottomWidth: 0 } : {},
              ]}
              break={idx === 0 ? false : exp.break}
            >
              <View wrap={false}>
                <View style={baseStyles.expHeaderRow}>
                  <Text style={baseStyles.expRole}>{exp.role}</Text>
                  <Text style={[baseStyles.expDates, { color: colors.primary }]}>{exp.dates}</Text>
                </View>
                <Text style={[baseStyles.expCompany, { color: colors.primaryText }]}>
                  {exp.company}
                </Text>
                {exp.client && <Text style={baseStyles.expClient}>Client: {exp.client}</Text>}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={baseStyles.bulletRow}>
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>▸</Text>
                    <Text style={baseStyles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], baseStyles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={baseStyles.bulletRow}>
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>▸</Text>
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

/* --------- Executive CV (formerly Modern) --------- */

export const ModernCV = ({ data, colors }: { data: CVData; colors?: ColorPalette }) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cv">
      <Page size="A4" style={baseStyles.page}>
        <LeftSidebar data={data} colors={c} />

        <View style={baseStyles.rightColumn}>
          <ExperienceSection data={data} colors={c} />

          {data.education && data.education.length > 0 && (
            <View>
              <Text style={baseStyles.rightSectionTitle}>{SECTION_LABELS.EDUCATION}</Text>
              <View style={[baseStyles.sectionTitleBar, { backgroundColor: c.primary }]} />
              {data.education.map((edu, idx) => (
                <View key={idx} style={baseStyles.eduBlock} wrap={false}>
                  <Text style={baseStyles.eduDegree}>{edu.degree}</Text>
                  <Text style={baseStyles.eduInst}>{edu.institution}</Text>
                  <Text style={baseStyles.eduDetails}>
                    {edu.location}
                    {edu.location && edu.details ? ` • ` : ""}
                    {edu.details}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {data.other && (
            <View style={baseStyles.otherSection} wrap={false}>
              <Text style={baseStyles.rightSectionTitle}>{data.other.label}</Text>
              <View style={[baseStyles.sectionTitleBar, { backgroundColor: c.primary }]} />
              <Text style={baseStyles.summaryText}>{data.other.value}</Text>
            </View>
          )}
        </View>
      </Page>
    </Document>
  );
};

/* --------- Executive Cover Letter (formerly Modern) --------- */

export const ModernCoverLetter = ({
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
        <LeftSidebar data={data} colors={c} />
        <View style={baseStyles.rightColumn}>
          <Text style={baseStyles.rightSectionTitle}>Cover Letter</Text>
          <View style={[baseStyles.sectionTitleBar, { backgroundColor: c.primary }]} />
          <Text style={{ fontSize: 10, lineHeight: 1.8, color: "#4a5568" }}>
            {content || DEFAULT_COVER_LETTER(data.name)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
