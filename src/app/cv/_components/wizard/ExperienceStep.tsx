import { TextField, Typography, Box, Button, IconButton, Stack, Paper, Grid } from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon, Remove as RemoveIcon } from '@mui/icons-material';
import { CVData, WorkExperience } from '../../_types/cv';

interface Props {
	data: CVData;
	updateData: (data: Partial<CVData>) => void;
}

export function ExperienceStep({ data, updateData }: Props) {
	const handleExperienceChange = (index: number, field: keyof WorkExperience, value: any) => {
		const newExperience = [...data.experience];
		newExperience[index] = { ...newExperience[index], [field]: value };
		updateData({ experience: newExperience });
	};

	const handleBulletPointChange = (expIndex: number, bulletIndex: number, value: string) => {
		const newExperience = [...data.experience];
		const newBullets = [...newExperience[expIndex].bulletPoints];
		newBullets[bulletIndex] = value;
		newExperience[expIndex].bulletPoints = newBullets;
		updateData({ experience: newExperience });
	};

	const addBulletPoint = (expIndex: number) => {
		const newExperience = [...data.experience];
		newExperience[expIndex].bulletPoints = [...newExperience[expIndex].bulletPoints, ''];
		updateData({ experience: newExperience });
	};

	const removeBulletPoint = (expIndex: number, bulletIndex: number) => {
		const newExperience = [...data.experience];
		newExperience[expIndex].bulletPoints = newExperience[expIndex].bulletPoints.filter((_, i) => i !== bulletIndex);
		updateData({ experience: newExperience });
	};

	const addExperience = () => {
		updateData({
			experience: [
				...data.experience,
				{ role: '', company: '', client: '', dates: '', bulletPoints: [''] },
			],
		});
	};

	const removeExperience = (index: number) => {
		const newExperience = data.experience.filter((_, i) => i !== index);
		updateData({ experience: newExperience });
	};

	return (
		<Box>
			<Typography variant="h6" gutterBottom>
				Work Experience
			</Typography>

			{data.experience.map((exp, index) => (
				<Paper key={index} sx={{ p: 3, mb: 3, bgcolor: 'background.default' }} variant="outlined">
					<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
						<Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
							Experience {index + 1}
						</Typography>
						{data.experience.length > 1 && (
							<IconButton onClick={() => removeExperience(index)} color="error" size="small">
								<DeleteIcon />
							</IconButton>
						)}
					</Box>

					<Grid container spacing={2}>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Role / Position"
								value={exp.role}
								onChange={(e) => handleExperienceChange(index, 'role', e.target.value)}
								variant="outlined"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Company"
								value={exp.company}
								onChange={(e) => handleExperienceChange(index, 'company', e.target.value)}
								variant="outlined"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Client (Optional)"
								value={exp.client}
								onChange={(e) => handleExperienceChange(index, 'client', e.target.value)}
								variant="outlined"
							/>
						</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								label="Dates (e.g., March 2025 - Present)"
								value={exp.dates}
								onChange={(e) => handleExperienceChange(index, 'dates', e.target.value)}
								variant="outlined"
							/>
						</Grid>

						<Grid size={12}>
							<Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
								Bullet Points (Achievements & Responsibilities)
							</Typography>
							<Stack spacing={1}>
								{exp.bulletPoints.map((bullet, bIndex) => (
									<Box key={bIndex} sx={{ display: 'flex', gap: 1 }}>
										<TextField
											fullWidth
											size="small"
											multiline
											value={bullet}
											onChange={(e) => handleBulletPointChange(index, bIndex, e.target.value)}
											placeholder="Enter achievement..."
										/>
										<IconButton 
											onClick={() => removeBulletPoint(index, bIndex)} 
											disabled={exp.bulletPoints.length === 1}
											size="small"
										>
											<RemoveIcon fontSize="small" />
										</IconButton>
									</Box>
								))}
								<Button 
									size="small" 
									startIcon={<AddIcon />} 
									onClick={() => addBulletPoint(index)}
									sx={{ alignSelf: 'flex-start' }}
								>
									Add Bullet Point
								</Button>
							</Stack>
						</Grid>
					</Grid>
				</Paper>
			))}

			<Button startIcon={<AddIcon />} onClick={addExperience} variant="outlined">
				Add Work Experience
			</Button>
		</Box>
	);
}
