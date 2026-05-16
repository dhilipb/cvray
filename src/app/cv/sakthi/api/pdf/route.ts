import { renderToBuffer } from '@react-pdf/renderer';
import { NextRequest, NextResponse } from 'next/server';
import { CVCoverLetter } from '../../_components/CVCoverLetter';
import { CVResume } from '../../_components/CVResume';
import { cvData } from '../../_data/cvData';
import { registerFonts } from '../../_styles';
import React from 'react';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const type = searchParams.get('type') || 'cv';
	const isHeadhunterMode = searchParams.get('headhunter') === 'true';

	try {
		// Ensure fonts are registered on the server
		await registerFonts();

		let element;
		if (type === 'coverletter') {
			element = React.createElement(CVCoverLetter, { data: cvData, isHeadhunterMode });
		} else {
			element = React.createElement(CVResume, { data: cvData, isHeadhunterMode });
		}

		const buffer = await renderToBuffer(element as React.ReactElement);

		const fileNameSuffix = isHeadhunterMode ? 'Candidate' : 'Sakthi_Buddha';
		const fileName = type === 'coverletter' ? `Cover_Letter_${fileNameSuffix}.pdf` : `CV_${fileNameSuffix}.pdf`;

		return new NextResponse(buffer as BodyInit, {
			headers: {
				'Content-Type': 'application/pdf',
				'Content-Disposition': `attachment; filename="${fileName}"`,
			},
		});
	} catch (error: unknown) {
		console.error('PDF Generation Error:', error);
		return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
	}
}
