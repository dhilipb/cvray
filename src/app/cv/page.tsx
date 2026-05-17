"use client";

import { useState, useEffect } from "react";
import { Container, Button, Box } from "@mui/material";
import { CVData } from "@/lib/types";
import CVWizard from "@/components/cv/CVWizard";

const SAMPLE_DATA: CVData = {
  name: "Sakthi Buddha",
  title: "Senior QA Engineer",
  email: "sakthibuddha8@gmail.com",
  phone: "+44 7379 87 67 46",
  location: "London, UK",
  linkedin: "linkedin.com/in/sakthiuk",
  summary:
    "Senior <strong>Software Quality Assurance</strong> professional with over <strong>9 years</strong> of expertise in driving <strong>product quality, delivery speed, and operational excellence</strong> across complex enterprise environments. Specialized in <strong>Early Involvement</strong> strategies, <strong>risk-based testing</strong>, and <strong>cross-functional leadership</strong> within high-stakes sectors like Insurance, Banking, and Retail. Proven track record of <strong>coordinating cross-functional teams</strong>, defining <strong>long-term QA strategies</strong>, and ensuring high-performance <strong>user experiences</strong> across web, mobile, and legacy systems.",
  skills: [
    {
      name: "Leadership",
      items:
        "Quality Point of Contact, QA Strategy Definition, Cross-Functional Leadership, Risk Management",
    },
    {
      name: "Management",
      items: "Azure DevOps (ADO), JIRA, HP ALM, Zephyr, Confluence, Agile/Scrum, Kanban",
    },
    {
      name: "Technical",
      items:
        "Postman (API), SQL (Querying & Data Manipulation), Kibana (Log Analysis), Selenium, GitHub, Java",
    },
    {
      name: "Systems",
      items:
        "Microsoft Dynamics 365 F&O, Guidewire (Policy/Claim/Billing), IBM iSeries, Legacy Mainframe",
    },
    {
      name: "Testing Expertise",
      items:
        "UAT Strategy, E2E Testing, API Validation, Mobile (iOS/Android), Cross-Browser, Regression, UX Testing",
    },
    {
      name: "Methodologies",
      items:
        "Early Quality Involvement, Shift-Left Strategy, Continuous Improvement, Release Management",
    },
  ],
  experience: [
    {
      role: "Senior Test Engineer",
      company: "Qualitest - UK",
      client: "The White Company",
      dates: "March 2025 - Present",
      bulletPoints: [
        "Drive <strong>measurable improvements in quality and velocity</strong> for major retail releases, acting as the primary <strong>Quality Point of Contact</strong> for multi-disciplinary squads.",
        "Define and execute <strong>end-to-end testing strategies</strong> for critical business journeys, ensuring 100% alignment between technical delivery and user expectations.",
        "Advocate for <strong>Early Involvement</strong> by collaborating with Engineering, Product, and Design teams during the <strong>discovery and refinement phases</strong> to identify risks early.",
        "Coordinate <strong>API validation</strong> efforts using <strong>Postman</strong> and troubleshoot complex production issues by performing deep-dive log analysis in <strong>Kibana</strong>.",
        "Optimize <strong>requirement traceability</strong> within Azure DevOps, ensuring comprehensive coverage from initial user stories to final deployment.",
        "Executed comprehensive <strong>functional and regression testing</strong> within the <strong>D365 Finance & Operations (FinOps)</strong> ecosystem, ensuring seamless integration between core financial modules and third-party applications.",
        "Facilitate <strong>sprint ceremonies</strong> and provide critical <strong>risk assessments</strong> to stakeholders, influencing go/no-go decisions based on empirical quality data.",
      ],
    },
  ],
  education: [
    {
      degree: "B.E Electrical, Electronics & Communications Engineering",
      institution: "Anna University",
      location: "Chennai, India",
      details:
        "First Class Honors - Provides strong foundation for hardware and wearable technology products.",
    },
  ],
  certifications: [
    { name: "Vskills DevOps", date: "June 2020" },
    { name: "Vskills Selenium", date: "February 2019" },
    { name: "Agile Extension, ISTQB", date: "July 2018" },
    { name: "ISTQB Foundation", date: "March 2016" },
  ],
  coverLetter: `Dear Hiring Team,

I am writing to express my strong interest in the <strong>Senior Quality Assurance Engineer</strong> position within <strong>Hudl</strong>. With over <strong>9 years of experience</strong> in software quality assurance, I have a proven track record of driving <strong>product quality and delivery speed</strong> by implementing <strong>risk-based strategies</strong> and fostering a culture of <strong>Early Involvement</strong>.`,
  other: {
    label: "<strong>Right to Work</strong>",
    value: "No sponsorship required - Spouse visa with full working rights",
  },
};

const INITIAL_DATA: CVData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  location: "",
  linkedin: "",
  summary: "",
  skills: [{ name: "", items: "" }],
  experience: [
    {
      role: "",
      company: "",
      client: "",
      dates: "",
      bulletPoints: [""],
    },
  ],
  education: [
    {
      degree: "",
      institution: "",
      location: "",
      details: "",
    },
  ],
  certifications: [{ name: "", date: "" }],
  coverLetter: "",
  other: {
    label: "",
    value: "",
  },
};

export default function CVWizardPage() {
  const [cvData, setCvData] = useState<CVData>(INITIAL_DATA);

  useEffect(() => {
    const storedData = localStorage.getItem("cvWizardData");
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        const mergedData = {
          ...INITIAL_DATA,
          ...parsed,
          skills: parsed.skills?.length ? parsed.skills : INITIAL_DATA.skills,
          experience: parsed.experience?.length ? parsed.experience : INITIAL_DATA.experience,
          education: parsed.education?.length ? parsed.education : INITIAL_DATA.education,
          certifications: parsed.certifications?.length
            ? parsed.certifications
            : INITIAL_DATA.certifications,
          other: { ...INITIAL_DATA.other, ...(parsed.other || {}) },
        };
        setCvData(mergedData);
      } catch (e) {
        console.error("Failed to parse stored CV data", e);
      }
    }
  }, []);

  const loadSampleData = () => {
    setCvData(SAMPLE_DATA);
  };

  return (
    <Container maxWidth="md" sx={{ py: 2 }}>
      <Box sx={{ mb: 2, display: "flex", justifyContent: "flex-end" }}>
        <Button variant="outlined" size="small" onClick={loadSampleData}>
          Load Sample Data
        </Button>
      </Box>
      <CVWizard initialData={cvData} />
    </Container>
  );
}
