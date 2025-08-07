import { json } from '@sveltejs/kit';

export async function GET() {
	// Return empty JSON for Chrome DevTools
	return json({});
}
