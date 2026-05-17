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
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.6,
  },
  header: {
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 2,
    borderBottomColor: "#10b981",
    paddingBottom: 16,
  },
  headerLeft: {
    flex: 1,
    paddingRight: 16,
  },
  headerRight: {
    width: "40%",
    textAlign: "right",
    fontSize: 9,
    color: "#718096",
  },
  name: {
    fontFamily: "Inter",
    fontWeight: 700,
    fontSize: 28,
    color: "#1a202c",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 13,
    color: "#10b981",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactItem: {
    marginBottom: 3,
  },
  link: {
    textDecoration: "none",
    color: "#718096",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 700,
    color: "#1a202c",
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 12,
    marginTop: 20,
  },
  summaryText: {
    fontSize: 10,
    color: "#4a5568",
    lineHeight: 1.6,
  },
  skillsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  skillBadge: {
    backgroundColor: "#ecfdf5",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
    color: "#047857",
    fontSize: 9,
    fontWeight: 600,
    marginBottom: 6,
    marginRight: 6,
  },
  expBlock: {
    marginBottom: 16,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  expRole: {
    fontWeight: 700,
    color: "#1a202c",
    fontSize: 11,
  },
  expDates: {
    color: "#10b981",
    fontSize: 9,
    fontWeight: 600,
  },
  expCompany: {
    color: "#718096",
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 4,
  },
  expClient: {
    color: "#a0aec0",
    fontSize: 9,
    fontStyle: "italic",
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: 700,
    color: "#1a202c",
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 8,
    borderLeftWidth: 3,
    borderLeftColor: "#10b981",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 6,
    alignItems: "flex-start",
  },
  bulletPoint: {
    color: "#10b981",
    width: 12,
    fontSize: 14,
    lineHeight: 0.8,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#4a5568",
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 700,
    color: "#1a202c",
  },
  eduBlock: {
    marginBottom: 10,
  },
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eduDegree: {
    fontWeight: 700,
    color: "#1a202c",
    fontSize: 10,
    marginBottom: 2,
  },
  eduInst: {
    color: "#718096",
    fontSize: 9,
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  certName: {
    fontWeight: 600,
    color: "#1a202c",
  },
  certDate: {
    color: "#718096",
    fontSize: 9,
  },
  otherSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
    marginTop: 4,
    marginBottom: 4,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data }: { data: CVData }) => (
  <View style={styles.header}>
    <View style={styles.headerLeft}>
      <Text style={styles.name}>{data.name}</Text>
      <Text style={styles.title}>{data.title}</Text>
    </View>
    <View style={styles.headerRight}>
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
      {data.linkedin && (
        <Link style={styles.link} src={formatLinkUrl(data.linkedin)}>
          {formatDisplayUrl(data.linkedin)}
        </Link>
      )}
    </View>
  </View>
);

/* --------- Experience Renderer --------- */

const ExperienceSection = ({ data }: { data: CVData }) => {
  if (!data.experience || data.experience.length === 0) return null;

  let currentHeader: string | null = null;

  return (
    <View>
      <Text style={styles.sectionTitle}>{SECTION_LABELS.EXPERIENCE}</Text>
      {data.experience.map((exp, idx) => {
        const showHeader = exp.sectionHeader && exp.sectionHeader !== currentHeader;
        if (showHeader) currentHeader = exp.sectionHeader!;

        return (
          <View key={idx}>
            {showHeader && <Text style={styles.sectionHeader}>{exp.sectionHeader}</Text>}
            <View style={styles.expBlock} break={idx === 0 ? false : exp.break}>
              <View wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expDates}>{exp.dates}</Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.client && <Text style={styles.expClient}>Client: {exp.client}</Text>}
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], styles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
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

/* --------- Modern CV --------- */

export const ModernCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />

      {data.summary && (
        <View style={{ marginBottom: 16 }}>
          <Text style={styles.summaryText}>{data.summary}</Text>
          <View style={styles.divider} />
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.SKILLS}</Text>
          <View style={styles.skillsContainer}>
            {data.skills
              .flatMap((s) => s.items.split(",").map((i) => i.trim()))
              .map((skill, idx) => (
                <Text key={idx} style={styles.skillBadge}>
                  {skill}
                </Text>
              ))}
          </View>
          <View style={styles.divider} />
        </View>
      )}

      <ExperienceSection data={data} />
      <View style={styles.divider} />

      {data.education && data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.EDUCATION}</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.eduBlock} wrap={false}>
              <View style={styles.eduHeaderRow}>
                <Text style={styles.eduDegree}>{edu.degree}</Text>
              </View>
              <Text style={styles.eduInst}>
                {edu.institution} {edu.location ? `— ${edu.location}` : ""}
                {edu.details ? `  |  ${edu.details}` : ""}
              </Text>
            </View>
          ))}
          <View style={styles.divider} />
        </View>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.CERTIFICATIONS}</Text>
          {data.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certRow} wrap={false}>
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.certDate}>{cert.date}</Text>
            </View>
          ))}
          <View style={styles.divider} />
        </View>
      )}

      {data.other && (
        <View style={styles.otherSection} wrap={false}>
          <Text style={styles.sectionTitle}>{data.other.label}</Text>
          <Text style={styles.summaryText}>{data.other.value}</Text>
        </View>
      )}
    </Page>
  </Document>
);

/* --------- Modern Cover Letter --------- */

export const ModernCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 11, lineHeight: 1.8, color: "#4a5568" }}>
          {content || DEFAULT_COVER_LETTER(data.name)}
        </Text>
      </View>
    </Page>
  </Document>
);
