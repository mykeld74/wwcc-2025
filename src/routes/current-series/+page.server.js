import client from '$lib/client';

export async function load() {
	try {
		const query = `*[_type == "currentseries"] | order(_createdAt desc)[0..4]{
			linkid,
			title,
			description,		
			createdAt,
			seriesImage
		}`;
		const currentSeriesID = await client.fetch(query);

		if (!currentSeriesID || currentSeriesID.length === 0) {
			return {
				currentSeriesID: [
					{
						linkid: '',
						title: 'No Current Series',
						description: ['Check back soon for our next series!'],
						createdAt: new Date().toISOString(),
						seriesImage: {
							asset: {
								_ref: 'image-1234567890-1000x1000-jpg'
							}
						}
					}
				]
			};
		}

		return { currentSeriesID };
	} catch (error) {
		console.error('Error fetching current series:', error);
		return {
			currentSeriesID: [
				{
					linkid: '',
					title: 'Error Loading Series',
					description: ["We're having trouble loading the current series. Please try again later."],
					createdAt: new Date().toISOString(),
					seriesImage: {
						asset: {
							_ref: 'image-1234567890-1000x1000-jpg'
						}
					}
				}
			]
		};
	}
}
