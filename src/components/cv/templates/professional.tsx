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
    fontFamily: "Times-Roman",
    fontSize: 11,
    color: "#222222",
    lineHeight: 1.3,
  },
  header: {
    marginBottom: 16,
    textAlign: "center",
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 22,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  title: {
    fontFamily: "Times-Italic",
    fontSize: 12,
    color: "#555555",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    fontSize: 10,
    color: "#444444",
    flexWrap: "wrap",
  },
  contactItem: {
    marginHorizontal: 6,
    marginBottom: 4,
  },
  separator: {
    marginBottom: 4,
  },
  link: {
    textDecoration: "none",
    color: "#444444",
  },
  sectionTitle: {
    fontFamily: "Times-Bold",
    fontSize: 12,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 10,
    marginTop: 18,
    paddingBottom: 2,
  },
  summaryText: {
    textAlign: "justify",
    marginBottom: 8,
  },
  skillsContainer: {
    marginBottom: 8,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
    alignItems: "flex-start",
  },
  skillName: {
    fontFamily: "Times-Bold",
    width: "22%",
  },
  skillItems: {
    width: "78%",
  },
  expBlock: {
    marginBottom: 14,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    alignItems: "flex-start",
  },
  expRole: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    flex: 1,
  },
  expDates: {
    fontSize: 10,
  },
  expCompany: {
    fontFamily: "Times-Italic",
    fontSize: 10.5,
    marginBottom: 2,
  },
  expClient: {
    fontFamily: "Times-Italic",
    fontSize: 10,
    color: "#666666",
    marginBottom: 4,
  },
  sectionHeader: {
    fontFamily: "Times-Bold",
    fontSize: 11,
    color: "#333333",
    marginTop: 10,
    marginBottom: 6,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: "#000000",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 3,
    paddingLeft: 12,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 10,
  },
  bulletText: {
    flex: 1,
    textAlign: "justify",
  },
  boldText: {
    fontFamily: "Times-Bold",
  },
  eduBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    alignItems: "flex-start",
  },
  eduLeft: {
    flex: 1,
    paddingRight: 8,
  },
  eduDegree: {
    fontFamily: "Times-Bold",
  },
  eduInst: {
    fontFamily: "Times-Italic",
  },
  eduDetails: {
    fontSize: 10,
    color: "#555555",
    marginTop: 2,
  },
  eduRight: {
    textAlign: "right",
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  otherSection: {
    marginTop: 12,
    marginBottom: 8,
  },
  otherText: {
    textAlign: "justify",
    lineHeight: 1.4,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data }: { data: CVData }) => (
  <View style={styles.header}>
    <Text style={styles.name}>{data.name}</Text>
    {data.title && <Text style={styles.title}>{data.title}</Text>}
    <View style={styles.contactRow}>
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
      {data.location && (data.phone || data.email) && <Text style={styles.separator}>|</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.phone && data.email && <Text style={styles.separator}>|</Text>}
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.email && data.linkedin && <Text style={styles.separator}>|</Text>}
      {data.linkedin && (
        <Link style={[styles.link, styles.contactItem]} src={formatLinkUrl(data.linkedin)}>
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
      <Text style={styles.sectionTitle}>{SECTION_LABELS.PROFESSIONAL_EXPERIENCE}</Text>
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

/* --------- Professional CV --------- */

export const ProfessionalCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />

      {data.summary && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.SUMMARY}</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      <ExperienceSection data={data} />

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.CORE_COMPETENCIES}</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, idx) => (
              <View key={idx} style={styles.skillRow}>
                <Text style={styles.skillName}>{skill.name}:</Text>
                <Text style={styles.skillItems}>{skill.items}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {data.education && data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.EDUCATION}</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.eduBlock} wrap={false}>
              <View style={styles.eduLeft}>
                <Text style={styles.eduDegree}>{edu.degree}</Text>
                <Text style={styles.eduInst}>{edu.institution}</Text>
                {edu.details && <Text style={styles.eduDetails}>{edu.details}</Text>}
              </View>
              <View style={styles.eduRight}>
                <Text>{edu.location}</Text>
              </View>
            </View>
          ))}
        </View>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.CERTIFICATIONS}</Text>
          {data.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certRow} wrap={false}>
              <Text style={styles.boldText}>{cert.name}</Text>
              <Text>{cert.date}</Text>
            </View>
          ))}
        </View>
      )}

      {data.other && (
        <View style={styles.otherSection} wrap={false}>
          <Text style={styles.sectionTitle}>{data.other.label}</Text>
          <Text style={styles.otherText}>{data.other.value}</Text>
        </View>
      )}
    </Page>
  </Document>
);

/* --------- Professional Cover Letter --------- */

export const ProfessionalCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 24 }}>
        <Text style={{ lineHeight: 1.5 }}>{content || DEFAULT_COVER_LETTER(data.name)}</Text>
      </View>
    </Page>
  </Document>
);
