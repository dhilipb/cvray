import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font, Link } from '@react-pdf/renderer';
import { CVData } from '@/lib/types';

// Register fonts
Font.register({
  family: 'Inter',
  fonts: [
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjQ.ttf', fontWeight: 400 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuGKYAZ9hjQ.ttf', fontWeight: 600 },
    { src: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuFuYAZ9hjQ.ttf', fontWeight: 700 }
  ]
});

Font.register({
  family: 'Georgia',
  src: 'https://fonts.cdnfonts.com/s/16061/Georgia.woff' // You can replace with an actual standard serif TTF, but typically Georgia is well known or use another serif font. For @react-pdf/renderer, TTF is best. Let's use PT Serif or standard Times New Roman if Georgia fails.
});
// Alternatively, just use Times-Roman built-in font for serif.

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Inter',
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.5,
  },
  header: {
    marginBottom: 12,
  },
  name: {
    fontFamily: 'Times-Bold', // Using built-in PDF font for reliability
    fontSize: 24,
    color: '#1a1a2e',
    marginBottom: 4,
    lineHeight: 1,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 12,
    color: '#2f5597',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 8,
  },
  contactRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    fontSize: 9,
    color: '#666666',
    marginBottom: 12,
    alignItems: 'center',
  },
  contactItem: {
    marginRight: 8,
  },
  contactSeparator: {
    marginRight: 8,
    color: '#cccccc',
  },
  link: {
    textDecoration: 'none',
    color: '#333333',
  },
  divider: {
    borderBottomWidth: 1.5,
    borderBottomColor: '#2f5597',
    width: '100%',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: 700,
    color: '#2f5597',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 16,
  },
  summaryContainer: {
    borderLeftWidth: 3,
    borderLeftColor: '#2f5597',
    paddingLeft: 10,
    marginBottom: 16,
    marginTop: 10,
  },
  summaryText: {
    fontSize: 10,
    color: '#333333',
    lineHeight: 1.6,
  },
  skillsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#eeeeee',
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
    marginTop: 4,
  },
  skillRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  skillName: {
    width: '25%',
    fontWeight: 700,
    color: '#2f5597',
    fontSize: 9,
    paddingRight: 10,
  },
  skillItems: {
    width: '75%',
    color: '#444444',
    fontSize: 9,
  },
  expBlock: {
    marginBottom: 14,
  },
  expHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  expRole: {
    fontWeight: 700,
    color: '#222222',
    fontSize: 11,
  },
  expDates: {
    color: '#888888',
    fontSize: 9,
  },
  expCompany: {
    color: '#666666',
    fontWeight: 600,
    fontSize: 10,
    marginBottom: 6,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  bulletPoint: {
    color: '#2f5597',
    fontWeight: 700,
    marginRight: 6,
    fontSize: 12,
    lineHeight: 1,
  },
  bulletText: {
    flex: 1,
    fontSize: 9.5,
    color: '#333333',
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
    color: '#222222',
    fontSize: 10,
    marginBottom: 2,
  },
  eduInst: {
    color: '#555555',
    fontWeight: 600,
    fontSize: 9,
  },
  eduDetails: {
    color: '#666666',
    fontSize: 9,
    marginTop: 2,
  },
  certRow: {
    flexDirection: 'row',
    marginBottom: 4,
    alignItems: 'flex-start',
  },
  certName: {
    fontWeight: 600,
  },
  pageBreak: {
    marginTop: 10,
    marginBottom: 10,
  }
});

// Helper to render basic bold HTML formatting
const renderBulletHtml = (text: string) => {
  // A naive implementation to bold text between ** **
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <Text key={index} style={styles.boldText}>{part.substring(2, part.length - 2)}</Text>;
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
      {data.email && data.phone && <Text style={styles.contactSeparator}>•</Text>}
      {data.phone && <Text style={styles.contactItem}>{data.phone}</Text>}
      {data.phone && data.location && <Text style={styles.contactSeparator}>•</Text>}
      {data.location && <Text style={styles.contactItem}>{data.location}</Text>}
      {data.location && data.linkedin && <Text style={styles.contactSeparator}>•</Text>}
      {data.linkedin && (
        <Link style={styles.link} src={data.linkedin.startsWith('http') ? data.linkedin : `https://${data.linkedin}`}>
          {data.linkedin.replace(/^https?:\/\//, '')}
        </Link>
      )}
    </View>
    <View style={styles.divider} />
  </View>
);

export const CVPdfDocument = ({ data }: { data: CVData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />

      {data.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryText}>{data.summary}</Text>
        </View>
      )}

      {data.skills && data.skills.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>CORE COMPETENCIES</Text>
          <View style={styles.skillsContainer}>
            {data.skills.map((skill, idx) => (
              <View key={idx} style={[styles.skillRow, idx === data.skills!.length - 1 ? { borderBottomWidth: 0 } : {}]}>
                <Text style={styles.skillName}>{skill.name}</Text>
                <Text style={styles.skillItems}>{skill.items}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {data.experience && data.experience.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>PROFESSIONAL EXPERIENCE</Text>
          {data.experience.map((exp, idx) => (
            <View key={idx} style={styles.expBlock} break={exp.break}>
              {exp.bulletPoints && exp.bulletPoints.length > 0 ? (
                <>
                  <View wrap={false}>
                    <View style={styles.expHeaderRow}>
                      <Text style={styles.expRole}>{exp.role}</Text>
                      <Text style={styles.expDates}>{exp.dates}</Text>
                    </View>
                    <Text style={styles.expCompany}>{exp.company}</Text>
                    <View style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>›</Text>
                      <Text style={styles.bulletText}>{renderBulletHtml(exp.bulletPoints[0])}</Text>
                    </View>
                  </View>
                  {exp.bulletPoints.slice(1).map((bp, bidx) => (
                    <View key={bidx + 1} style={styles.bulletRow}>
                      <Text style={styles.bulletPoint}>›</Text>
                      <Text style={styles.bulletText}>{renderBulletHtml(bp)}</Text>
                    </View>
                  ))}
                </>
              ) : (
                <View wrap={false}>
                  <View style={styles.expHeaderRow}>
                    <Text style={styles.expRole}>{exp.role}</Text>
                    <Text style={styles.expDates}>{exp.dates}</Text>
                  </View>
                  <Text style={styles.expCompany}>{exp.company}</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {data.education && data.education.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>EDUCATION</Text>
          {data.education.map((edu, idx) => (
            <View key={idx} style={styles.eduBlock} wrap={false}>
              <Text style={styles.eduDegree}>{edu.degree}</Text>
              <Text style={styles.eduInst}>
                {edu.institution}{edu.location ? ` | ${edu.location}` : ''}
              </Text>
              {edu.details && <Text style={styles.eduDetails}>{edu.details}</Text>}
            </View>
          ))}
        </View>
      )}

      {data.certifications && data.certifications.length > 0 && (
        <View>
          <Text style={styles.sectionTitle}>CERTIFICATIONS</Text>
          {data.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certRow} wrap={false}>
              <Text style={styles.bulletPoint}>›</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.certName}>{cert.name}</Text>
                {cert.date ? ` — ${cert.date}` : ''}
              </Text>
            </View>
          ))}
        </View>
      )}

      {data.other && (
        <View wrap={false}>
          <Text style={styles.sectionTitle}>{data.other.label}</Text>
          <Text style={styles.summaryText}>{data.other.value}</Text>
        </View>
      )}
    </Page>
  </Document>
);

export const CoverLetterPdfDocument = ({ content, data }: { content?: string, data: CVData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <DocumentHeader data={data} />
      <View style={{ marginTop: 24 }}>
        <Text style={{ fontSize: 11, lineHeight: 1.8, color: '#333333' }}>
          {content || `Dear Hiring Manager,\n\nI am writing to express my interest in the position at your company. With my background in software engineering, I am confident that I would be a valuable asset to your team.\n\nBest regards,\n${data.name}`}
        </Text>
      </View>
    </Page>
  </Document>
);
