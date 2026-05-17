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

// ELEGANT THEME: Refined serif typography with sophisticated styling
const baseStyles = StyleSheet.create({
  page: {
    padding: 50,
    fontFamily: "Georgia",
    fontSize: 10.5,
    color: "#2a2a2a",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 32,
    paddingBottom: 20,
    borderBottomWidth: 1.5,
  },
  name: {
    fontFamily: "Georgia",
    fontSize: 32,
    marginBottom: 8,
    color: "#1a1a1a",
    letterSpacing: 1,
  },
  title: {
    fontFamily: "Inter",
    fontSize: 11,
    fontWeight: 400,
    marginBottom: 16,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9,
    color: "#666666",
    fontFamily: "Inter",
  },
  contactItem: {
    marginRight: 20,
    marginBottom: 4,
  },
  contactDivider: {
    marginRight: 20,
    color: "#cccccc",
  },
  link: {
    textDecoration: "none",
    color: "#666666",
  },
  sectionTitle: {
    fontFamily: "Georgia",
    fontSize: 14,
    marginBottom: 14,
    marginTop: 28,
    color: "#1a1a1a",
    fontStyle: "italic",
    letterSpacing: 0.5,
  },
  summaryText: {
    lineHeight: 1.7,
    textAlign: "justify",
    marginBottom: 12,
    color: "#3a3a3a",
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  skillName: {
    width: "26%",
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 9,
    color: "#1a1a1a",
    paddingRight: 12,
  },
  skillItems: {
    width: "74%",
    fontSize: 10,
    color: "#4a4a4a",
    lineHeight: 1.6,
  },
  expBlock: {
    marginBottom: 20,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 4,
  },
  expRole: {
    fontFamily: "Georgia",
    fontSize: 12,
    color: "#1a1a1a",
    flex: 1,
  },
  expDates: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: "#888888",
    fontStyle: "italic",
  },
  expCompany: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 600,
    color: "#4a4a4a",
    marginBottom: 10,
  },
  expClient: {
    fontFamily: "Inter",
    fontSize: 9,
    fontStyle: "italic",
    color: "#999999",
    marginBottom: 10,
  },
  sectionHeader: {
    fontFamily: "Inter",
    fontSize: 10,
    fontWeight: 600,
    color: "#1a1a1a",
    marginTop: 14,
    marginBottom: 10,
    paddingLeft: 12,
    paddingVertical: 2,
    borderLeftWidth: 2,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 18,
    fontSize: 10,
    fontFamily: "Georgia",
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: "#3a3a3a",
    lineHeight: 1.6,
    textAlign: "justify",
  },
  boldText: {
    fontFamily: "Inter",
    fontWeight: 700,
    color: "#1a1a1a",
  },
  eduBlock: {
    marginBottom: 14,
  },
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 3,
  },
  eduDegree: {
    fontFamily: "Georgia",
    fontSize: 11,
    color: "#1a1a1a",
    flex: 1,
  },
  eduLocation: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: "#999999",
    fontStyle: "italic",
  },
  eduInst: {
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#4a4a4a",
    marginBottom: 2,
  },
  eduDetails: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: "#888888",
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
    marginBottom: 8,
  },
  certName: {
    fontFamily: "Inter",
    fontWeight: 600,
    fontSize: 9.5,
    color: "#1a1a1a",
    flex: 1,
  },
  certDate: {
    fontFamily: "Inter",
    fontSize: 8.5,
    color: "#999999",
    fontStyle: "italic",
  },
  otherSection: {
    marginTop: 20,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data, colors }: { data: CVData; colors: ColorPalette }) => (
  <View style={[baseStyles.header, { borderBottomColor: colors.primary }]}>
    <Text style={baseStyles.name}>{data.name}</Text>
    <Text style={[baseStyles.title, { color: colors.primaryText }]}>{data.title}</Text>
    <View style={baseStyles.contactRow}>
      {data.email && <Text style={baseStyles.contactItem}>{data.email}</Text>}
      {data.email && (data.phone || data.location || data.linkedin) && (
        <Text style={baseStyles.contactDivider}>|</Text>
      )}
      {data.phone && <Text style={baseStyles.contactItem}>{data.phone}</Text>}
      {data.phone && (data.location || data.linkedin) && (
        <Text style={baseStyles.contactDivider}>|</Text>
      )}
      {data.location && <Text style={baseStyles.contactItem}>{data.location}</Text>}
      {data.location && data.linkedin && <Text style={baseStyles.contactDivider}>|</Text>}
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

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data, colors }: { data: CVData; colors: ColorPalette }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={[baseStyles.sectionTitle, { color: colors.primaryDark }]}>
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
            <View style={baseStyles.expBlock} break={idx === 0 ? false : exp.break}>
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
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>•</Text>
                    <Text style={baseStyles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], baseStyles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={baseStyles.bulletRow}>
                    <Text style={[baseStyles.bulletPoint, { color: colors.primary }]}>•</Text>
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

/* --------- Elegant CV (formerly Creative) --------- */

export const CreativeCV = ({ data, colors }: { data: CVData; colors?: ColorPalette }) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cv">
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader data={data} colors={c} />

        {data.summary && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>
              {SECTION_LABELS.PROFILE}
            </Text>
            <Text style={baseStyles.summaryText}>{data.summary}</Text>
          </View>
        )}

        <ExperienceSection data={data} colors={c} />

        {data.skills && data.skills.length > 0 && (
          <View style={baseStyles.skillsContainer}>
            <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>
              {SECTION_LABELS.SKILLS}
            </Text>
            {data.skills.map((skill, idx) => (
              <View key={idx} style={baseStyles.skillRow} wrap={false}>
                <Text style={[baseStyles.skillName, { color: c.primaryDark }]}>{skill.name}</Text>
                <Text style={baseStyles.skillItems}>{skill.items}</Text>
              </View>
            ))}
          </View>
        )}

        {data.education && data.education.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>
              {SECTION_LABELS.EDUCATION}
            </Text>
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
            <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>
              {SECTION_LABELS.CERTIFICATIONS}
            </Text>
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
            <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>
              {data.other.label}
            </Text>
            <Text style={baseStyles.summaryText}>{data.other.value}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

/* --------- Elegant Cover Letter (formerly Creative) --------- */

export const CreativeCoverLetter = ({
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
        <View style={{ marginTop: 32 }}>
          <Text style={[baseStyles.sectionTitle, { color: c.primaryDark }]}>Cover Letter</Text>
          <Text
            style={{
              fontSize: 10.5,
              lineHeight: 1.8,
              fontFamily: "Georgia",
              color: "#3a3a3a",
              textAlign: "justify",
            }}
          >
            {content || DEFAULT_COVER_LETTER(data.name)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
