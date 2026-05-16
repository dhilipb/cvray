import { Text, View } from '@react-pdf/renderer';
import { styles } from '../_styles';
import type { SkillCategory } from '@/lib/types';
import { renderText } from '../_utils/renderText';

/* --------- CVSkills Component --------- */

interface CVSkillsProps {
	skills: SkillCategory[];
}

export const CVSkills = ({ skills }: CVSkillsProps) => (
	<>
		<Text style={styles.sectionHeader}>Core Competencies</Text>
		<View style={styles.skillsTable}>
			{skills.map((skill, index) => {
				const isLast = index === skills.length - 1;
				const isEven = index % 2 === 0;
				return (
					<View key={index} style={[styles.skillsRow, isEven ? styles.skillsRowEven : {}, isLast ? { borderBottomWidth: 0 } : {}]}>
						<Text style={styles.skillsLabel}>{skill.name}</Text>
						<Text style={styles.skillsContent}>{renderText(skill.items)}</Text>
					</View>
				);
			})}
		</View>
	</>
);
