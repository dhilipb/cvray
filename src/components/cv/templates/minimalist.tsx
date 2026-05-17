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
    padding: 50,
    fontFamily: "Inter",
    fontSize: 9.5,
    color: "#000000",
    lineHeight: 1.4,
  },
  header: {
    marginBottom: 24,
    alignItems: "center",
  },
  name: {
    fontWeight: 700,
    fontSize: 20,
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  title: {
    fontSize: 10,
    color: "#666666",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    fontSize: 8.5,
    color: "#666666",
  },
  contactItem: {
    marginRight: 10,
    marginBottom: 4,
  },
  link: {
    textDecoration: "none",
    color: "#666666",
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: 2,
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    marginBottom: 12,
    marginTop: 20,
  },
  summaryText: {
    lineHeight: 1.6,
    marginBottom: 8,
  },
  skillRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  skillName: {
    width: "30%",
    fontWeight: 600,
  },
  skillItems: {
    width: "70%",
    color: "#444444",
  },
  expBlock: {
    marginBottom: 18,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
    alignItems: "flex-start",
  },
  expRole: {
    fontWeight: 600,
    fontSize: 10.5,
    flex: 1,
  },
  expDates: {
    color: "#666666",
    fontSize: 8.5,
  },
  expCompany: {
    fontStyle: "italic",
    color: "#444444",
    marginBottom: 2,
  },
  expClient: {
    fontStyle: "italic",
    color: "#777777",
    fontSize: 8.5,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontWeight: 700,
    color: "#333333",
    marginTop: 12,
    marginBottom: 8,
    paddingLeft: 10,
    borderLeftWidth: 2,
    borderLeftColor: "#000000",
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    paddingLeft: 8,
    alignItems: "flex-start",
  },
  bulletPoint: {
    width: 10,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    color: "#333333",
  },
  boldText: {
    fontWeight: 700,
  },
  eduBlock: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    alignItems: "flex-start",
  },
  eduLeft: {
    width: "70%",
  },
  eduRight: {
    width: "30%",
    textAlign: "right",
    color: "#666666",
    fontSize: 8.5,
  },
  eduDegree: {
    fontWeight: 600,
  },
  eduInst: {
    color: "#444444",
  },
  eduDetails: {
    color: "#777777",
    fontSize: 8.5,
    marginTop: 2,
  },
  certRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  certName: {
    fontWeight: 600,
  },
  certDate: {
    color: "#666666",
    fontSize: 8.5,
  },
  otherSection: {
    marginTop: 12,
    marginBottom: 8,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data }: { data: CVData }) => (
  <View style={styles.header}>
    <Text style={styles.name}>{data.name}</Text>
    <Text style={styles.title}>{data.title}</Text>
    <View style={styles.contactRow}>
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
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
                    <Text style={styles.bulletPoint}>-</Text>
                    <Text style={styles.bulletText}>
                      {renderBulletHtml(exp.bulletPoints[0], styles.boldText)}
                    </Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>-</Text>
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

/* --------- Minimalist CV --------- */

export const MinimalistCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />

      {data.summary && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      <ExperienceSection data={data} />

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>{SECTION_LABELS.SKILLS}</Text>
          {data.skills.map((skill, idx) => (
            <View key={idx} style={styles.skillRow}>
              <Text style={styles.skillName}>{skill.name}</Text>
              <Text style={styles.skillItems}>{skill.items}</Text>
            </View>
          ))}
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
              <Text style={styles.certName}>{cert.name}</Text>
              <Text style={styles.certDate}>{cert.date}</Text>
            </View>
          ))}
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

/* --------- Minimalist Cover Letter --------- */

export const MinimalistCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 32 }}>
        <Text style={{ fontSize: 10, lineHeight: 1.8 }}>
          {content || DEFAULT_COVER_LETTER(data.name)}
        </Text>
      </View>
    </Page>
  </Document>
);
