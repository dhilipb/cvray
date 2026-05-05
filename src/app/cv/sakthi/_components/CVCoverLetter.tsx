import { Document, Page, Text, View } from '@react-pdf/renderer';
import { COLORS, styles } from '../_styles';
import type { CVData } from '../_types/cv';
import { renderText } from '../_utils/renderText';
import { CVHeader } from './CVHeader';

interface CVCoverLetterProps {
	data: CVData;
	isHeadhunterMode?: boolean;
}

export const CVCoverLetter = ({ data, isHeadhunterMode }: CVCoverLetterProps) => (
	<Document title={`Cover Letter - ${isHeadhunterMode ? 'Candidate' : data.name}`} author={isHeadhunterMode ? 'Candidate' : data.name} subject="Cover Letter">
		<Page size="A4" style={styles.page}>
			<CVHeader data={data} isHeadhunterMode={isHeadhunterMode} />
			<View style={{ marginTop: 24 }}>
				<Text style={{ fontSize: 10, lineHeight: 1.6, color: COLORS.body, fontFamily: 'Inter' }}>{renderText(data.coverLetter || '')}</Text>
			</View>
			<Text
				style={{
					position: 'absolute',
					bottom: 10,
					left: 42,
					right: 42,
					textAlign: 'center',
					fontSize: 7.5,
					color: COLORS.light,
					fontFamily: 'Inter',
				}}
				render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
				fixed
			/>
		</Page>
	</Document>
);
