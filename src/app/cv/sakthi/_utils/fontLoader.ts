import fonts from 'google-fonts-complete';

/**
 * Retrieves the direct TTF URL for a given Google Font using the google-fonts-complete library.
 * This library contains a comprehensive list of Google Fonts and their sources.
 *
 * @param family The font family name (e.g., 'Inter', 'Lora')
 * @param weight The font weight (e.g., 400, 700)
 * @param italic Whether to get the italic version
 * @returns The direct TTF URL from Google's static servers
 */
export async function getGoogleFontUrl(family: string, weight: number = 400, italic: boolean = false): Promise<string> {
	try {
		// The library exports a single object where keys are font family names
		const allFonts = fonts as Record<string, any>;
		const font = allFonts[family];

		if (!font) {
			throw new Error(`Font ${family} not found in google-fonts-complete library`);
		}

		const style = italic ? 'italic' : 'normal';
		const variant = font.variants?.[style]?.[weight.toString()];

		if (!variant || !variant.url || !variant.url.ttf) {
			// Fallback to normal 400 if specific weight/style is missing
			const fallback = font.variants?.normal?.['400'];
			if (fallback && fallback.url && fallback.url.ttf) {
				return fallback.url.ttf;
			}
			throw new Error(`TTF URL not found for ${family} ${weight} ${style}`);
		}

		return variant.url.ttf;
	} catch (error) {
		console.error(`Error loading font ${family}:`, error);

		// Final static fallback for robustness
		const id = family.toLowerCase().replace(/\s+/g, '');
		return `https://fonts.gstatic.com/s/${id}/v1/regular.ttf`;
	}
}
