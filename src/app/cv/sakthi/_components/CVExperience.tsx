import { Text, View } from '@react-pdf/renderer';
import { styles } from '../_styles';
import type { WorkExperience } from '@/lib/types';
import { renderText } from '../_utils/renderText';

/* --------- ExperienceItem Component --------- */

interface ExperienceItemProps {
	item: WorkExperience;
	index: number;
}

const ExperienceItem = ({ item, index }: ExperienceItemProps) => (
	<View key={index} style={styles.experienceItem} wrap={true} break={item.break}>
		{!item.role ? (
			<View style={styles.roleRow}>
				<View style={styles.companyClientRow}>
					<Text style={styles.companyName}>{item.company}</Text>
					<Text style={styles.clientLabel}>for </Text>
					<Text style={styles.clientName}>{item.client}</Text>
				</View>
				<Text style={styles.dates}>{item.dates}</Text>
			</View>
		) : (
			<>
				<View style={styles.roleRow}>
					<Text style={styles.role}>{item.role}</Text>
					<Text style={styles.dates}>{item.dates}</Text>
				</View>

				<View style={styles.companyClientRow}>
					<Text style={styles.companyName}>{item.company}</Text>
					<Text style={styles.clientLabel}>for </Text>
					<Text style={styles.clientName}>{item.client}</Text>
				</View>
			</>
		)}

		<View style={{ marginTop: 2 }}>
			{item.bulletPoints.map((bp: string, i: number) => (
				<View key={i} style={styles.bulletPoint}>
					<Text style={styles.bullet}>›</Text>
					<Text style={styles.bulletContent}>{renderText(bp)}</Text>
				</View>
			))}
		</View>
	</View>
);

/* --------- CVExperience Component --------- */

interface CVExperienceProps {
	experience: WorkExperience[];
}

export const CVExperience = ({ experience }: CVExperienceProps) => (
	<>
		<Text style={styles.sectionHeader}>Professional Experience</Text>
		{experience.map((item, index) => (
			<ExperienceItem key={index} item={item} index={index} />
		))}
	</>
);
