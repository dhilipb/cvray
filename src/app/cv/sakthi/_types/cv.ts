export interface WorkExperience {
	role: string;
	company: string;
	client: string;
	dates: string;
	bulletPoints: string[];
	sectionHeader?: string;
	break?: boolean;
}

export interface SkillCategory {
	name: string;
	items: string;
}

export interface Education {
	degree: string;
	institution: string;
	location: string;
	details?: string;
}

export interface Certification {
	name: string;
	date: string;
}

export interface CVData {
	name: string;
	title: string;
	email: string;
	phone: string;
	location?: string;
	linkedin?: string;
	summary: string;
	skills: SkillCategory[];
	experience: WorkExperience[];
	education: Education[];
	certifications: Certification[];
	coverLetter?: string;
	other: {
		label: string;
		value: string;
	};
}
