'use client';

import { useState, useEffect } from 'react';
import {
	Box,
	Container,
	Paper,
	Stepper,
	Step,
	StepLabel,
	Button,
	Typography,
	Divider,
} from '@mui/material';
import { CVData } from '@/lib/types';
import { PersonalInfoStep } from './_components/wizard/PersonalInfoStep';
import { SummaryStep } from './_components/wizard/SummaryStep';
import { SkillsStep } from './_components/wizard/SkillsStep';
import { ExperienceStep } from './_components/wizard/ExperienceStep';
import { EducationStep } from './_components/wizard/EducationStep';
import { CertificationsStep } from './_components/wizard/CertificationsStep';
import { CoverLetterStep } from './_components/wizard/CoverLetterStep';
import { OtherInfoStep } from './_components/wizard/OtherInfoStep';

const STEPS = [
	'Personal Info',
	'Summary',
	'Skills',
	'Experience',
	'Education',
	'Certifications',
	'Cover Letter',
	'Other Details',
	'Preview',
];

const SAMPLE_DATA: CVData = {
	name: 'Sakthi Buddha',
	title: 'Senior QA Engineer',
	email: 'sakthibuddha8@gmail.com',
	phone: '+44 7379 87 67 46',
	location: 'London, UK',
	linkedin: 'linkedin.com/in/sakthiuk',
	summary:
		'Senior <strong>Software Quality Assurance</strong> professional with over <strong>9 years</strong> of expertise in driving <strong>product quality, delivery speed, and operational excellence</strong> across complex enterprise environments. Specialized in <strong>Early Involvement</strong> strategies, <strong>risk-based testing</strong>, and <strong>cross-functional leadership</strong> within high-stakes sectors like Insurance, Banking, and Retail. Proven track record of <strong>coordinating cross-functional teams</strong>, defining <strong>long-term QA strategies</strong>, and ensuring high-performance <strong>user experiences</strong> across web, mobile, and legacy systems.',
	skills: [
		{ name: 'Leadership', items: 'Quality Point of Contact, QA Strategy Definition, Cross-Functional Leadership, Risk Management' },
		{ name: 'Management', items: 'Azure DevOps (ADO), JIRA, HP ALM, Zephyr, Confluence, Agile/Scrum, Kanban' },
		{ name: 'Technical', items: 'Postman (API), SQL (Querying & Data Manipulation), Kibana (Log Analysis), Selenium, GitHub, Java' },
		{ name: 'Systems', items: 'Microsoft Dynamics 365 F&O, Guidewire (Policy/Claim/Billing), IBM iSeries, Legacy Mainframe' },
		{ name: 'Testing Expertise', items: 'UAT Strategy, E2E Testing, API Validation, Mobile (iOS/Android), Cross-Browser, Regression, UX Testing' },
		{ name: 'Methodologies', items: 'Early Quality Involvement, Shift-Left Strategy, Continuous Improvement, Release Management' },
	],
	experience: [
		{
			role: 'Senior Test Engineer',
			company: 'Qualitest - UK',
			client: 'The White Company',
			dates: 'March 2025 - Present',
			bulletPoints: [
				'Drive <strong>measurable improvements in quality and velocity</strong> for major retail releases, acting as the primary <strong>Quality Point of Contact</strong> for multi-disciplinary squads.',
				'Define and execute <strong>end-to-end testing strategies</strong> for critical business journeys, ensuring 100% alignment between technical delivery and user expectations.',
				'Advocate for <strong>Early Involvement</strong> by collaborating with Engineering, Product, and Design teams during the <strong>discovery and refinement phases</strong> to identify risks early.',
				'Coordinate <strong>API validation</strong> efforts using <strong>Postman</strong> and troubleshoot complex production issues by performing deep-dive log analysis in <strong>Kibana</strong>.',
				'Optimize <strong>requirement traceability</strong> within Azure DevOps, ensuring comprehensive coverage from initial user stories to final deployment.',
				'Executed comprehensive <strong>functional and regression testing</strong> within the <strong>D365 Finance & Operations (FinOps)</strong> ecosystem, ensuring seamless integration between core financial modules and third-party applications.',
				'Facilitate <strong>sprint ceremonies</strong> and provide critical <strong>risk assessments</strong> to stakeholders, influencing go/no-go decisions based on empirical quality data.',
			],
		},
	],
	education: [
		{
			degree: 'B.E Electrical, Electronics & Communications Engineering',
			institution: 'Anna University',
			location: 'Chennai, India',
			details: 'First Class Honors - Provides strong foundation for hardware and wearable technology products.',
		},
	],
	certifications: [
		{ name: 'Vskills DevOps', date: 'June 2020' },
		{ name: 'Vskills Selenium', date: 'February 2019' },
		{ name: 'Agile Extension, ISTQB', date: 'July 2018' },
		{ name: 'ISTQB Foundation', date: 'March 2016' },
	],
	coverLetter: `Dear Hiring Team,

I am writing to express my strong interest in the <strong>Senior Quality Assurance Engineer</strong> position within <strong>Hudl</strong>. With over <strong>9 years of experience</strong> in software quality assurance, I have a proven track record of driving <strong>product quality and delivery speed</strong> by implementing <strong>risk-based strategies</strong> and fostering a culture of <strong>Early Involvement</strong>.`,
	other: {
		label: '<strong>Right to Work</strong>',
		value: 'No sponsorship required - Spouse visa with full working rights',
	},
};

const INITIAL_DATA: CVData = {
	name: '',
	title: '',
	email: '',
	phone: '',
	location: '',
	linkedin: '',
	summary: '',
	skills: [{ name: '', items: '' }],
	experience: [
		{
			role: '',
			company: '',
			client: '',
			dates: '',
			bulletPoints: [''],
		},
	],
	education: [
		{
			degree: '',
			institution: '',
			location: '',
			details: '',
		},
	],
	certifications: [{ name: '', date: '' }],
	coverLetter: '',
	other: {
		label: '',
		value: '',
	},
};

export default function CVWizardPage() {
	const [activeStep, setActiveStep] = useState(0);
	const [cvData, setCvData] = useState<CVData>(INITIAL_DATA);

	useEffect(() => {
		const storedData = localStorage.getItem('cvWizardData');
		if (storedData) {
			try {
				const parsed = JSON.parse(storedData);
				// Ensure that the structure is fully populated with defaults for any missing nested arrays to prevent errors
				const mergedData = {
					...INITIAL_DATA,
					...parsed,
					skills: parsed.skills?.length ? parsed.skills : INITIAL_DATA.skills,
					experience: parsed.experience?.length ? parsed.experience : INITIAL_DATA.experience,
					education: parsed.education?.length ? parsed.education : INITIAL_DATA.education,
					certifications: parsed.certifications?.length ? parsed.certifications : INITIAL_DATA.certifications,
					other: { ...INITIAL_DATA.other, ...(parsed.other || {}) }
				};
				setCvData(mergedData);
			} catch (e) {
				console.error("Failed to parse stored CV data", e);
			}
		}
	}, []);

	const handleNext = () => {
		setActiveStep((prevStep) => prevStep + 1);
	};

	const handleBack = () => {
		setActiveStep((prevStep) => prevStep - 1);
	};

	const updateData = (data: Partial<CVData>) => {
		setCvData((prev) => ({ ...prev, ...data }));
	};

	const loadSampleData = () => {
		setCvData(SAMPLE_DATA);
	};

	const renderStepContent = (step: number) => {
		switch (step) {
			case 0:
				return <PersonalInfoStep data={cvData} updateData={updateData} />;
			case 1:
				return <SummaryStep data={cvData} updateData={updateData} />;
			case 2:
				return <SkillsStep data={cvData} updateData={updateData} />;
			case 3:
				return <ExperienceStep data={cvData} updateData={updateData} />;
			case 4:
				return <EducationStep data={cvData} updateData={updateData} />;
			case 5:
				return <CertificationsStep data={cvData} updateData={updateData} />;
			case 6:
				return <CoverLetterStep data={cvData} updateData={updateData} />;
			case 7:
				return <OtherInfoStep data={cvData} updateData={updateData} />;
			case 8:
				return (
					<Box>
						<Typography variant="h6" gutterBottom>Preview JSON</Typography>
						<Paper sx={{ p: 2, bgcolor: '#f5f5f5', overflow: 'auto', maxHeight: '400px' }}>
							<pre>{JSON.stringify(cvData, null, 2)}</pre>
						</Paper>
					</Box>
				);
			default:
				return <Typography>Unknown Step</Typography>;
		}
	};

	return (
		<Container maxWidth="md" sx={{ py: 4 }}>
			<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
				<Typography variant="h4" component="h1" sx={{ fontWeight: 700 }}>
					CV Wizard
				</Typography>
				<Button variant="outlined" size="small" onClick={loadSampleData}>
					Load Sample Data
				</Button>
			</Box>
			
			<Paper sx={{ p: { xs: 2, md: 4 }, mt: 2 }} elevation={3}>
				<Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4, display: { xs: 'none', md: 'flex' } }}>
					{STEPS.map((label) => (
						<Step key={label}>
							<StepLabel>{label}</StepLabel>
						</Step>
					))}
				</Stepper>

				<Box sx={{ display: { xs: 'block', md: 'none' }, mb: 4, textAlign: 'center' }}>
					<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
						Step {activeStep + 1} of {STEPS.length}: {STEPS[activeStep]}
					</Typography>
				</Box>

				<Divider sx={{ mb: 4 }} />

				<Box sx={{ minHeight: '400px' }}>
					{renderStepContent(activeStep)}
				</Box>

				<Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
					<Button
						disabled={activeStep === 0}
						onClick={handleBack}
						variant="outlined"
					>
						Back
					</Button>
					<Box>
						{activeStep === STEPS.length - 1 ? (
							<Button
								variant="contained"
								color="success"
								onClick={() => {
									const blob = new Blob([JSON.stringify(cvData, null, 2)], { type: 'application/json' });
									const url = URL.createObjectURL(blob);
									const link = document.createElement('a');
									link.href = url;
									link.download = 'cv-data.json';
									link.click();
								}}
							>
								Download JSON
							</Button>
						) : (
							<Button
								variant="contained"
								color="primary"
								onClick={handleNext}
							>
								Next
							</Button>
						)}
					</Box>
				</Box>
			</Paper>
		</Container>
	);
}
