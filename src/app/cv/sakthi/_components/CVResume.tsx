import { Document, Page, Text, View } from "@react-pdf/renderer";
import { COLORS, styles } from "../_styles";
import type { CVData } from "@/lib/types";
import { renderText } from "../_utils/renderText";
import { CVCertifications, CVEducation } from "./CVEducation";
import { CVExperience } from "./CVExperience";
import { CVHeader } from "./CVHeader";
import { CVSkills } from "./CVSkills";
import { CVSummary } from "./CVSummary";

interface CVResumeProps {
  data: CVData;
  isHeadhunterMode?: boolean;
}

export const CVResume = ({ data, isHeadhunterMode }: CVResumeProps) => (
  <Document
    title={`CV - ${isHeadhunterMode ? "Candidate" : data.name}`}
    author={isHeadhunterMode ? "Candidate" : data.name}
    subject="Senior Software Quality Assurance Resume"
  >
    <Page size="A4" style={styles.page}>
      <CVHeader data={data} isHeadhunterMode={isHeadhunterMode} />
      <CVSummary summary={data.summary} />
      <CVSkills skills={data.skills} />
      <CVExperience experience={data.experience} />

      <View style={{ flexDirection: "row", gap: 24, marginTop: 6 }}>
        <CVEducation education={data.education} />
        <CVCertifications certifications={data.certifications} />
      </View>

      {data.other && (
        <View style={{ marginTop: 8 }}>
          <Text style={{ fontSize: 9, fontFamily: "Inter" }}>
            {renderText(data.other.label)}: {data.other.value}
          </Text>
        </View>
      )}

      <Text
        style={{
          position: "absolute",
          bottom: 10,
          left: 42,
          right: 42,
          textAlign: "center",
          fontSize: 7.5,
          color: COLORS.light,
          fontFamily: "Inter",
        }}
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
        fixed
      />
    </Page>
  </Document>
);
