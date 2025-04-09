import client from '$lib/client';

export async function load() {
	const query = `*[_type == "currentseries"] | order(_createdAt desc)[0..4] {
      seriesImage
		}`;
	const currentSeriesImg = await client.fetch(query);
	return { currentSeriesImg };
}
