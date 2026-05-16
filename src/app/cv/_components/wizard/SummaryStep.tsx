import { TextField, Typography, Box } from '@mui/material';
import { CVData } from '../../_types/cv';

interface Props {
	data: CVData;
	updateData: (data: Partial<CVData>) => void;
}

export function SummaryStep({ data, updateData }: Props) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		updateData({ summary: e.target.value });
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Professional Summary
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Provide a concise overview of your professional background and key strengths. 
				You can use HTML tags like &lt;strong&gt; for emphasis.
			</Typography>
			<TextField
				fullWidth
				label="Summary"
				multiline
				rows={8}
				value={data.summary}
				onChange={handleChange}
				variant="outlined"
			/>
		</Box>
	);
}
