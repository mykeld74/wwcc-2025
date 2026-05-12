import client from '$lib/client';

export async function load() {
	const query = `*[_type == "event"] | order(eventDate asc){
      _id,
      title,    
      eventDate,
      time,
			location,
      body,
    }`;
	const events = await client.fetch(query);

	const formattedEvents = events.map((event) => ({
		...event,
		date: new Date(event.eventDate + 'T00:00:00').toLocaleDateString('en-US', {
			weekday: 'long',
			month: 'long',
			day: 'numeric'
		})
	}));

	return {
		Events: formattedEvents
	};
}
