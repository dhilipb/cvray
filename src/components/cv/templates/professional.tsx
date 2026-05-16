import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";

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
    marginBottom: 8,
    marginTop: 16,
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
    marginBottom: 2,
    alignItems: "flex-start",
  },
  skillName: {
    fontFamily: "Times-Bold",
    width: "20%",
  },
  skillItems: {
    width: "80%",
  },
  expBlock: {
    marginBottom: 12,
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
    fontSize: 11,
    marginBottom: 4,
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
    marginBottom: 6,
    alignItems: "flex-start",
  },
  eduDegree: {
    fontFamily: "Times-Bold",
  },
  eduInst: {
    fontFamily: "Times-Italic",
  },
});

const renderBulletHtml = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <Text key={index} style={styles.boldText}>
          {part.substring(2, part.length - 2)}
        </Text>
      );
    }
    return <Text key={index}>{part}</Text>;
  });
};

const DocumentHeader = ({ data }: { data: CVData }) => (
  <View style={styles.header}>
    <Text style={styles.name}>{data.name}</Text>
    <View style={styles.contactRow}>
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
      {data.location && (data.phone || data.email) && <Text style={styles.separator}>|</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.phone && data.email && <Text style={styles.separator}>|</Text>}
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.email && data.linkedin && <Text style={styles.separator}>|</Text>}
      {data.linkedin && (
        <Link
          style={[styles.link, styles.contactItem]}
          src={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
        >
          {data.linkedin.replace(/^https?:\/\//, "")}
        </Link>
      )}
    </View>
  </View>
);

export const ProfessionalCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      
      {data.summary && (
        <View>
          <Text style={styles.sectionTitle}>Summary</Text>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {data.experience && data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Professional Experience</Text>
          {data.experience.map((exp, idx) => (
            <View key={idx} style={styles.expBlock} break={exp.break}>
              <View wrap={false}>
                <View style={styles.expHeaderRow}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expDates}>{exp.dates}</Text>
                </View>
                <Text style={styles.expCompany}>{exp.company}</Text>
                {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                  <View style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>•</Text>
                    <Text style={styles.bulletText}>{renderBulletHtml(exp.bulletPoints[0])}</Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints && exp.bulletPoints.slice(1).map((bp, bidx) => (
                <View key={bidx + 1} style={styles.bulletRow}>
                  <Text style={styles.bulletPoint}>•</Text>
                  <Text style={styles.bulletText}>{renderBulletHtml(bp)}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Core Competencies</Text>
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
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.eduBlock} wrap={false}>
              <View>
                <Text style={styles.eduDegree}>{edu.degree}</Text>
                <Text style={styles.eduInst}>{edu.institution}</Text>
              </View>
              <Text>{edu.location}</Text>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const ProfessionalCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 24 }}>
        <Text style={{ lineHeight: 1.5 }}>
          {content ||
            `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${data.name}`}
        </Text>
      </View>
    </Page>
  </Document>
);
