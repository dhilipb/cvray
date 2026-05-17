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

const styles = StyleSheet.create({
  page: {
    fontFamily: "Inter",
    fontSize: 10,
    color: "#333333",
    flexDirection: "row",
  },
  sidebarBg: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: "35%",
    backgroundColor: "#1e1e24",
  },
  leftColumn: {
    width: "35%",
    color: "#ffffff",
    padding: 30,
  },
  rightColumn: {
    width: "65%",
    padding: 30,
    backgroundColor: "#ffffff",
  },
  name: {
    fontWeight: 700,
    fontSize: 24,
    marginBottom: 4,
    color: "#10b981",
  },
  title: {
    fontSize: 11,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 20,
    color: "#a1a1aa",
  },
  contactItem: {
    fontSize: 9,
    marginBottom: 8,
    color: "#d4d4d8",
  },
  link: {
    textDecoration: "none",
    color: "#10b981",
  },
  sidebarTitle: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 24,
    marginBottom: 12,
    color: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#3f3f46",
    paddingBottom: 4,
  },
  sidebarText: {
    fontSize: 9,
    lineHeight: 1.5,
    color: "#d4d4d8",
  },
  skillCategory: {
    marginBottom: 12,
  },
  skillCategoryName: {
    fontWeight: 700,
    fontSize: 9,
    color: "#e4e4e7",
    marginBottom: 6,
  },
  skillBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 5,
    marginRight: 5,
    color: "#10b981",
    fontSize: 8,
  },
  skillsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  mainTitle: {
    fontSize: 14,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    color: "#18181b",
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
    paddingBottom: 4,
    marginBottom: 16,
    marginTop: 10,
  },
  summaryText: {
    lineHeight: 1.6,
    marginBottom: 16,
  },
  expBlock: {
    marginBottom: 16,
  },
  expRole: {
    fontWeight: 700,
    fontSize: 11,
    color: "#18181b",
  },
  expCompany: {
    color: "#10b981",
    fontWeight: 600,
    fontSize: 10,
  },
  expClient: {
    fontStyle: "italic",
    color: "#7c7c82",
    fontSize: 9,
    marginBottom: 4,
  },
  expDates: {
    color: "#71717a",
    fontSize: 8.5,
    marginBottom: 6,
  },
  sectionHeader: {
    fontWeight: 700,
    fontSize: 11,
    color: "#18181b",
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bulletPoint: {
    color: "#10b981",
    width: 12,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 700,
  },
  eduBlock: {
    marginBottom: 10,
  },
  eduDegree: {
    fontWeight: 700,
    color: "#18181b",
    fontSize: 10,
  },
  eduInst: {
    color: "#52525b",
    fontSize: 9,
  },
  eduDetails: {
    color: "#a1a1aa",
    fontSize: 8,
    marginTop: 2,
  },
  certRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  certBullet: {
    color: "#10b981",
    width: 10,
    fontSize: 10,
    marginRight: 4,
  },
  certText: {
    flex: 1,
    fontSize: 9,
    color: "#d4d4d8",
  },
  otherSection: {
    marginTop: 12,
    marginBottom: 8,
  },
});

/* --------- Sidebar Component --------- */

const Sidebar = ({ data }: { data: CVData }) => (
  <View style={styles.leftColumn}>
    <Text style={styles.name}>{data.name}</Text>
    <Text style={styles.title}>{data.title}</Text>

    <Text style={styles.sidebarTitle}>Contact</Text>
    {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
    {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
    {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
    {data.linkedin && (
      <Link style={styles.link} src={formatLinkUrl(data.linkedin)}>
        {formatDisplayUrl(data.linkedin)}
      </Link>
    )}

    {data.summary && (
      <View>
        <Text style={styles.sidebarTitle}>{SECTION_LABELS.PROFILE}</Text>
        <Text style={styles.sidebarText}>{data.summary}</Text>
      </View>
    )}

    {data.skills && data.skills.length > 0 && (
      <View>
        <Text style={styles.sidebarTitle}>{SECTION_LABELS.SKILLS}</Text>
        {data.skills.map((skill, idx) => (
          <View key={idx} style={styles.skillCategory} wrap={false}>
            <Text style={styles.skillCategoryName}>{skill.name}</Text>
            <View style={styles.skillsWrapper}>
              {skill.items
                .split(",")
                .map((i) => i.trim())
                .map((s, sidx) => (
                  <Text key={sidx} style={styles.skillBadge}>
                    {s}
                  </Text>
                ))}
            </View>
          </View>
        ))}
      </View>
    )}

    {data.education && data.education.length > 0 && (
      <View>
        <Text style={styles.sidebarTitle}>{SECTION_LABELS.EDUCATION}</Text>
        {data.education.map((edu, idx) => (
          <View key={idx} style={{ marginBottom: 12 }} wrap={false}>
            <Text style={{ fontWeight: 700, fontSize: 9 }}>{edu.degree}</Text>
            <Text style={{ fontSize: 8, color: "#a1a1aa", marginTop: 2 }}>
              {edu.institution}
              {edu.location ? ` — ${edu.location}` : ""}
            </Text>
            {edu.details && (
              <Text style={{ fontSize: 8, color: "#71717a", marginTop: 2 }}>{edu.details}</Text>
            )}
          </View>
        ))}
      </View>
    )}

    {data.certifications && data.certifications.length > 0 && (
      <View>
        <Text style={styles.sidebarTitle}>{SECTION_LABELS.CERTIFICATIONS}</Text>
        {data.certifications.map((cert, idx) => (
          <View key={idx} style={styles.certRow} wrap={false}>
            <Text style={styles.certBullet}>•</Text>
            <Text style={styles.certText}>
              {cert.name} {cert.date ? `(${cert.date})` : ""}
            </Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data }: { data: CVData }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={styles.mainTitle}>{SECTION_LABELS.EXPERIENCE}</Text>
      {data.experience.map((exp, idx) => {
        const showHeader = exp.sectionHeader && exp.sectionHeader !== currentHeader;
        if (showHeader) currentHeader = exp.sectionHeader!;

        return (
          <View key={idx}>
            {showHeader && <Text style={styles.sectionHeader}>{exp.sectionHeader}</Text>}
            <View style={styles.expBlock} break={idx === 0 ? false : exp.break}>
              <View wrap={false}>
                <Text style={styles.expRole}>{exp.role}</Text>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.client && <Text style={styles.expClient}>Client: {exp.client}</Text>}
                <Text style={styles.expDates}>{exp.dates}</Text>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>›</Text>
                    <Text style={styles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], styles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>›</Text>
                    <Text style={styles.bulletText}>{renderBulletHtml(bp, styles.boldText)}</Text>
                  </View>
                ))}
            </View>
          </View>
        );
      })}
    </View>
  );
};

/* --------- Creative CV --------- */

export const CreativeCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebarBg} fixed />
      <Sidebar data={data} />

      <View style={styles.rightColumn}>
        <ExperienceSection data={data} />

        {data.other && (
          <View style={styles.otherSection} wrap={false}>
            <Text style={styles.mainTitle}>{data.other.label}</Text>
            <Text style={styles.summaryText}>{data.other.value}</Text>
          </View>
        )}
      </View>
    </Page>
  </Document>
);

/* --------- Creative Cover Letter --------- */

export const CreativeCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebarBg} fixed />
      <Sidebar data={data} />
      <View style={styles.rightColumn}>
        <Text style={styles.mainTitle}>Cover Letter</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.8 }}>
          {content || DEFAULT_COVER_LETTER(data.name)}
        </Text>
      </View>
    </Page>
  </Document>
);
