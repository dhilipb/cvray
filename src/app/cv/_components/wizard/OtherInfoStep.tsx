import { TextField, Typography, Box, Grid } from '@mui/material';
import { CVData } from '@/lib/types';

interface Props {
	data: CVData;
	updateData: (data: Partial<CVData>) => void;
}

export function OtherInfoStep({ data, updateData }: Props) {
	const handleOtherChange = (field: 'label' | 'value', value: string) => {
		updateData({
			other: {
				...data.other,
				[field]: value,
			},
		});
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Other Details
			</Typography>
			<Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
				Any additional information (e.g., Right to Work, Languages).
			</Typography>
			<Grid container spacing={3}>
				<Grid size={{ xs: 12, sm: 4 }}>
					<TextField
						fullWidth
						label="Label (e.g., Right to Work)"
						value={data.other.label}
						onChange={(e) => handleOtherChange('label', e.target.value)}
						variant="outlined"
					/>
				</Grid>
				<Grid size={{ xs: 12, sm: 8 }}>
					<TextField
						fullWidth
						label="Value (e.g., No sponsorship required)"
						value={data.other.value}
						onChange={(e) => handleOtherChange('value', e.target.value)}
						variant="outlined"
					/>
				</Grid>
			</Grid>
		</Box>
	);
}
