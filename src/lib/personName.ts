export function formatPersonName(
	firstName?: string | null,
	lastName?: string | null,
	fallback = 'Anonymous'
) {
	const parts = [firstName?.trim(), lastName?.trim()].filter(Boolean);
	return parts.length > 0 ? parts.join(' ') : fallback;
}
