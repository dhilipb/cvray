import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";

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
    marginBottom: 16,
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
    marginBottom: 6,
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
    marginBottom: 8,
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
    <Text style={styles.title}>{data.title}</Text>
    <View style={styles.contactRow}>
      {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
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

export const MinimalistCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />

      {data.summary && (
        <View style={{ marginBottom: 12 }}>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {data.experience && data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Experience</Text>
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
                    <Text style={styles.bulletPoint}>-</Text>
                    <Text style={styles.bulletText}>{renderBulletHtml(exp.bulletPoints[0])}</Text>
                  </View>
                )}
              </View>
              {exp.bulletPoints &&
                exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>-</Text>
                    <Text style={styles.bulletText}>{renderBulletHtml(bp)}</Text>
                  </View>
                ))}
            </View>
          ))}
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>Skills</Text>
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
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.eduBlock} wrap={false}>
              <View style={styles.eduLeft}>
                <Text style={styles.eduDegree}>{edu.degree}</Text>
                <Text style={styles.eduInst}>{edu.institution}</Text>
              </View>
              <View style={styles.eduRight}>
                <Text>{edu.location}</Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </Page>
  </Document>
);

export const MinimalistCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 32 }}>
        <Text style={{ fontSize: 10, lineHeight: 1.8 }}>
          {content ||
            `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${data.name}`}
        </Text>
      </View>
    </Page>
  </Document>
);
