import { Text, View } from '@react-pdf/renderer';
import { styles } from '../_styles';
import { renderText } from '../_utils/renderText';

/* --------- CVSummary Component --------- */

interface CVSummaryProps {
	summary: string;
}

export const CVSummary = ({ summary }: CVSummaryProps) => (
	<View style={styles.summary}>
		<Text style={styles.summaryText}>{renderText(summary)}</Text>
	</View>
);
