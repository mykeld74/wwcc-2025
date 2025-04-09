import client from '$lib/client';

export async function load() {
	const query = `*[_type == "currentseries"] | order(_createdAt desc)[0..4]{
      linkid,
			title,
			description,		
			createdAt,
			seriesImage
		}`;
	const currentSeriesID = await client.fetch(query);
	return { currentSeriesID };
}
