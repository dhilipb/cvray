import { Link, Text, View } from '@react-pdf/renderer';
import { styles } from '../_styles';
import type { CVData } from '../_types/cv';

/* --------- CVHeader Component --------- */

interface CVHeaderProps {
	data: Pick<CVData, 'name' | 'title' | 'email' | 'phone' | 'location' | 'linkedin'>;
	isHeadhunterMode?: boolean;
}

export const CVHeader = ({ data, isHeadhunterMode }: CVHeaderProps) => (
	<View style={styles.header}>
		<View>
			<Text style={styles.name}>{isHeadhunterMode ? 'Candidate' : data.name}</Text>
			<Text style={styles.title}>{data.title}</Text>
		</View>

		<View style={styles.contactRow}>
			<View style={styles.contactItem}>
				{isHeadhunterMode ? (
					<Text style={styles.contactText}>[Email Hidden]</Text>
				) : (
					<Link href={`mailto:${data.email}`} style={styles.contactText}>
						{data.email}
					</Link>
				)}
			</View>
			<Text style={styles.contactSep}>•</Text>
			<View style={styles.contactItem}>
				{isHeadhunterMode ? (
					<Text style={styles.contactText}>[Phone Hidden]</Text>
				) : (
					<Link href={`tel:${data.phone}`} style={styles.contactText}>
						{data.phone}
					</Link>
				)}
			</View>
			{data.location && (
				<>
					<Text style={styles.contactSep}>•</Text>
					<View style={styles.contactItem}>
						<Text style={styles.contactText}>{data.location}</Text>
					</View>
				</>
			)}
			{data.linkedin && (
				<>
					<Text style={styles.contactSep}>•</Text>
					<View style={styles.contactItem}>
						{isHeadhunterMode ? (
							<Text style={styles.contactText}>[LinkedIn Hidden]</Text>
						) : (
							<Link href={`https://${data.linkedin}`} style={styles.contactText}>
								{data.linkedin}
							</Link>
						)}
					</View>
				</>
			)}
		</View>
	</View>
);
