import client from '$lib/client';
export const prerender = true;

export async function load() {
	const query = `*[_type == "event"] | order(order asc){
      _id,
      title,
      date,
      time,
			location,
      body,
		}`;
	const Events = await client.fetch(query);

	return { Events };
}
