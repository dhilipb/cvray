import React from "react";
import { Document, Page, Text, View, StyleSheet, Link } from "@react-pdf/renderer";
import { CVData } from "@/lib/types";

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
  skillBadge: {
    backgroundColor: "rgba(16, 185, 129, 0.2)",
    paddingVertical: 3,
    paddingHorizontal: 6,
    borderRadius: 4,
    marginBottom: 6,
    marginRight: 6,
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
  expDates: {
    color: "#71717a",
    fontSize: 8.5,
    marginBottom: 6,
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

const Sidebar = ({ data }: { data: CVData }) => (
  <View style={styles.leftColumn}>
    <Text style={styles.name}>{data.name}</Text>
    <Text style={styles.title}>{data.title}</Text>

    <Text style={styles.sidebarTitle}>Contact</Text>
    {data.email && <Text style={styles.contactItem}>{data.email}</Text>}
    {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
    {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
    {data.linkedin && (
      <Link
        style={styles.link}
        src={data.linkedin.startsWith("http") ? data.linkedin : `https://${data.linkedin}`}
      >
        {data.linkedin.replace(/^https?:\/\//, "")}
      </Link>
    )}

    {data.skills && data.skills.length > 0 && (
      <View>
        <Text style={styles.sidebarTitle}>Skills</Text>
        <View style={styles.skillsWrapper}>
          {data.skills.flatMap(s => s.items.split(',').map(i => i.trim())).map((skill, idx) => (
            <Text key={idx} style={styles.skillBadge}>{skill}</Text>
          ))}
        </View>
      </View>
    )}

    {data.education && data.education.length > 0 && (
      <View>
        <Text style={styles.sidebarTitle}>Education</Text>
        {data.education.map((edu, idx) => (
          <View key={idx} style={{ marginBottom: 12 }}>
            <Text style={{ fontWeight: 700, fontSize: 9 }}>{edu.degree}</Text>
            <Text style={{ fontSize: 8, color: "#a1a1aa", marginTop: 2 }}>{edu.institution}</Text>
          </View>
        ))}
      </View>
    )}
  </View>
);

export const CreativeCV = ({ data }: { data: CVData }) => (
  <Document title="cv">
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebarBg} fixed />
      <Sidebar data={data} />
      
      <View style={styles.rightColumn}>
        {data.summary && (
          <View>
            <Text style={styles.mainTitle}>Profile</Text>
            <Text style={styles.summaryText}>{data.summary}</Text>
          </View>
        )}

        {data.experience && data.experience.length > 0 && (
          <View>
            <Text style={styles.mainTitle}>Experience</Text>
            {data.experience.map((exp, idx) => (
              <View key={idx} style={styles.expBlock} break={exp.break}>
                <View wrap={false}>
                  <Text style={styles.expRole}>{exp.role}</Text>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                  <Text style={styles.expDates}>{exp.dates}</Text>
                  {exp.bulletPoints && exp.bulletPoints.length > 0 && (
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>›</Text>
                      <Text style={styles.bulletText}>{renderBulletHtml(exp.bulletPoints[0])}</Text>
                    </View>
                  )}
                </View>
                {exp.bulletPoints && exp.bulletPoints.slice(1).map((bp, bidx) => (
                  <View key={bidx + 1} style={styles.bulletRow}>
                    <Text style={styles.bulletPoint}>›</Text>
                    <Text style={styles.bulletText}>{renderBulletHtml(bp)}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>
    </Page>
  </Document>
);

export const CreativeCoverLetter = ({ content, data }: { content?: string; data: CVData }) => (
  <Document title="cover-letter">
    <Page size="A4" style={styles.page}>
      <View style={styles.sidebarBg} fixed />
      <Sidebar data={data} />
      <View style={styles.rightColumn}>
        <Text style={styles.mainTitle}>Cover Letter</Text>
        <Text style={{ fontSize: 10, lineHeight: 1.8 }}>
          {content ||
            `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${data.name}`}
        </Text>
      </View>
    </Page>
  </Document>
);
