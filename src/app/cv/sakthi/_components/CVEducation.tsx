import { Text, View } from '@react-pdf/renderer';
import { COLORS, styles } from '../_styles';
import type { Certification, Education } from '@/lib/types';

/* --------- CVEducation Component --------- */

interface CVEducationProps {
	education: Education[];
}

export const CVEducation = ({ education }: CVEducationProps) => (
	<View style={{ flex: 1 }} wrap={false}>
		<Text style={styles.sectionHeader}>Education</Text>
		{education.map((edu, index) => (
			<View key={index} style={styles.educationItem}>
				<Text style={styles.bold}>{edu.degree}</Text>
				<Text style={{ fontSize: 9, color: COLORS.body, lineHeight: 1.4 }}>
					{edu.institution}, {edu.location}
				</Text>
				{edu.details && <Text style={[styles.italic, styles.small]}>{edu.details}</Text>}
			</View>
		))}
	</View>
);

/* --------- CVCertifications Component --------- */

interface CVCertificationsProps {
	certifications: Certification[];
}

export const CVCertifications = ({ certifications }: CVCertificationsProps) => (
	<View style={{ flex: 1 }} wrap={false}>
		<Text style={styles.sectionHeader}>Certifications</Text>
		{certifications.map((cert, index) => (
			<View key={index} style={styles.certificationItem}>
				<Text style={styles.bullet}>›</Text>
				<Text style={styles.bulletContent}>
					<Text style={styles.bold}>{cert.name}</Text>
					<Text style={[styles.italic, { color: COLORS.muted }]}> · {cert.date}</Text>
				</Text>
			</View>
		))}
	</View>
);
