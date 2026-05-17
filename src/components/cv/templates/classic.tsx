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

const baseStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: "Inter",
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontFamily: "Times-Bold",
    fontSize: 24,
    color: "#1a1a2e",
    marginBottom: 4,
    lineHeight: 1,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    fontSize: 9,
    color: "#666666",
    marginBottom: 12,
    alignItems: "center",
  },
  contactItem: {
    marginRight: 8,
  },
  contactSeparator: {
    marginRight: 8,
    color: "#cccccc",
  },
  link: {
    textDecoration: "none",
    color: "#333333",
  },
  divider: {
    borderBottomWidth: 1.5,
    width: "100%",
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 16,
  },
  summaryContainer: {
    borderLeftWidth: 3,
    paddingLeft: 10,
    marginBottom: 16,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 10,
    color: "#333333",
    lineHeight: 1.6,
  },
  skillsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#eeeeee",
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
    marginTop: 4,
  },
  skillRow: {
    flexDirection: "row",
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: "#eeeeee",
  },
  skillName: {
    width: "25%",
    fontWeight: 700,
    fontSize: 9,
    paddingRight: 10,
  },
  skillItems: {
    width: "75%",
    color: "#444444",
    fontSize: 9,
  },
  expBlock: {
    marginBottom: 14,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 2,
  },
  expRole: {
    fontWeight: 700,
    color: "#222222",
    fontSize: 11,
  },
  expDates: {
    color: "#888888",
    fontSize: 9,
  },
  expCompany: {
    color: "#666666",
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  bulletPoint: {
    fontWeight: 700,
    marginRight: 6,
    fontSize: 12,
    lineHeight: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: "#333333",
    lineHeight: 1.5,
  },
  boldText: {
    fontWeight: 700,
  },
  eduBlock: {
    marginBottom: 8,
  },
  eduDegree: {
    fontWeight: 700,
    color: "#222222",
    fontSize: 10,
    marginBottom: 2,
  },
  eduInst: {
    color: "#555555",
    fontWeight: 600,
    fontSize: 9,
  },
  eduDetails: {
    color: "#666666",
    fontSize: 9,
    marginTop: 2,
  },
  certRow: {
    flexDirection: "row",
    marginBottom: 4,
    alignItems: "flex-start",
  },
  certName: {
    fontWeight: 600,
  },
});

/* --------- Document Header --------- */

const DocumentHeader = ({ data, colors }: { data: CVData; colors: ColorPalette }) => (
  <View style={baseStyles.header}>
    <Text style={baseStyles.name}>{data.name}</Text>
    <Text style={[baseStyles.title, { color: colors.primary }]}>{data.title}</Text>
    <View style={baseStyles.contactRow}>
      {data.email && <Text style={baseStyles.contactItem}>{data.email}</Text>}
      {data.email && data.phone && <Text style={baseStyles.contactSeparator}>•</Text>}
      {data.phone && <Text style={baseStyles.contactItem}>{data.phone}</Text>}
      {data.phone && data.location && <Text style={baseStyles.contactSeparator}>•</Text>}
      {data.location && <Text style={baseStyles.contactItem}>{data.location}</Text>}
      {data.location && data.linkedin && <Text style={baseStyles.contactSeparator}>•</Text>}
      {data.linkedin && (
        <Link style={baseStyles.link} src={formatLinkUrl(data.linkedin)}>
          {formatDisplayUrl(data.linkedin)}
        </Link>
      )}
    </View>
    <View style={[baseStyles.divider, { borderBottomColor: colors.primary }]} />
  </View>
);

/* --------- Classic CV --------- */

export const ClassicCV = ({ data, colors }: { data: CVData; colors?: ColorPalette }) => {
  const c = colors || COLOR_THEMES[DEFAULT_THEME];
  return (
    <Document title="cv">
      <Page size="A4" style={baseStyles.page}>
        <DocumentHeader data={data} colors={c} />
        {data.summary && (
          <View style={[baseStyles.summaryContainer, { borderLeftColor: c.primary }]}>
            <Text style={baseStyles.summaryText}>{data.summary}</Text>
          </View>
        )}
        {data.skills && data.skills.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primary }]}>
              {SECTION_LABELS.CORE_COMPETENCIES}
            </Text>
            <View style={baseStyles.skillsContainer}>
              {data.skills.map((skill, idx) => (
                <View
                  key={idx}
                  style={[
                    baseStyles.skillRow,
                    idx === data.skills!.length - 1 ? { borderBottomWidth: 0 } : {},
                  ]}
                >
                  <Text style={[baseStyles.skillName, { color: c.primary }]}>{skill.name}</Text>
                  <Text style={baseStyles.skillItems}>{skill.items}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
        {data.experience && data.experience.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primary }]}>
              {SECTION_LABELS.PROFESSIONAL_EXPERIENCE}
            </Text>
            {data.experience.map((exp, idx) => (
              <View key={idx} style={baseStyles.expBlock} break={idx === 0 ? false : exp.break}>
                {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                  <>
                    <View wrap={false}>
                      <View style={baseStyles.expHeaderRow}>
                        <Text style={baseStyles.expRole}>{exp.role}</Text>
                        <Text style={baseStyles.expDates}>{exp.dates}</Text>
                      </View>
                      <Text style={baseStyles.expCompany}>{exp.company}</Text>
                      <View style={baseStyles.bulletRow}>
                        <Text style={[baseStyles.bulletPoint, { color: c.primary }]}>›</Text>
                        <Text style={baseStyles.bulletText}>
                          {renderBulletHtml(exp.bulletPoints[0], baseStyles.boldText)}
                        </Text>
                      </View>
                    </View>
                    {exp.bulletPoints.slice(1).map((bp, bidx) => (
                      <View key={bidx + 1} style={baseStyles.bulletRow}>
                        <Text style={[baseStyles.bulletPoint, { color: c.primary }]}>›</Text>
                        <Text style={baseStyles.bulletText}>
                          {renderBulletHtml(bp, baseStyles.boldText)}
                        </Text>
                      </View>
                    ))}
                  </>
                ) : (
                  <View wrap={false}>
                    <View style={baseStyles.expHeaderRow}>
                      <Text style={baseStyles.expRole}>{exp.role}</Text>
                      <Text style={baseStyles.expDates}>{exp.dates}</Text>
                    </View>
                    <Text style={baseStyles.expCompany}>{exp.company}</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        )}
        {data.education && data.education.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primary }]}>
              {SECTION_LABELS.EDUCATION}
            </Text>
            {data.education.map((edu, idx) => (
              <View key={idx} style={baseStyles.eduBlock} wrap={false}>
                <Text style={baseStyles.eduDegree}>{edu.degree}</Text>
                <Text style={baseStyles.eduInst}>
                  {edu.institution}
                  {edu.location ? ` | ${edu.location}` : ""}
                </Text>
                {edu.details && <Text style={baseStyles.eduDetails}>{edu.details}</Text>}
              </View>
            ))}
          </View>
        )}
        {data.certifications && data.certifications.length > 0 && (
          <View>
            <Text style={[baseStyles.sectionTitle, { color: c.primary }]}>
              {SECTION_LABELS.CERTIFICATIONS}
            </Text>
            {data.certifications.map((cert, idx) => (
              <View key={idx} style={baseStyles.certRow} wrap={false}>
                <Text style={[baseStyles.bulletPoint, { color: c.primary }]}>›</Text>
                <Text style={baseStyles.bulletText}>
                  <Text style={baseStyles.certName}>{cert.name}</Text>
                  {cert.date ? ` — ${cert.date}` : ""}
                </Text>
              </View>
            ))}
          </View>
        )}
        {data.other && (
          <View wrap={false}>
            <Text style={[baseStyles.sectionTitle, { color: c.primary }]}>{data.other.label}</Text>
            <Text style={baseStyles.summaryText}>{data.other.value}</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

/* --------- Classic Cover Letter --------- */

export const ClassicCoverLetter = ({
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
          <Text style={{ fontSize: 11, lineHeight: 1.8, color: "#333333" }}>
            {content || DEFAULT_COVER_LETTER(data.name)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};
