<script>
	import { Card } from '$components';

	const rooms = [
		{
			title: 'Auditorium',
			desc: 'Seating for 250-300',
			features: ['Full sound, lighting and video options', 'Hanging lights']
		},
		{
			title: 'The Café',
			desc: 'Seating for 100-140',
			features: [
				'Mounted TV for presentations and sound system',
				'In good weather, option of outside courtyard',
				'Access to kitchen for food prep or storage'
			]
		},
		{
			title: 'The Coffeeshop',
			desc: 'Option of couches and high top tables and stools for casual seating, approximately 20 with space to move in more seating',
			features: ['Bar counter for easy serving']
		},
		{
			title: 'Welcome Area',
			desc: 'Options for seating and tables for up to 90 people',
			features: ['Can be combined with the coffee shop for larger events']
		}
	];
</script>

<svelte:head>
	<meta
		name="description"
		content="Host your next event at Westwoods Community Church. Explore our rental spaces including the auditorium, café, coffee shop, and welcome area for weddings, meetings, and more."
	/>
</svelte:head>

<div class="contentWrapper">
	<h1 class="pageTitle">Facility Rentals</h1>
	<div class="facilityRentalsContainer">
		<div class="facilityRentalsWrapper">
			{#each rooms as room}
				<Card cardContent={room} />
			{/each}
		</div>
	</div>
</div>

<style>
	.facilityRentalsContainer {
		width: calc(100% - 3rem);
		margin: 0 auto;
		max-width: 1000px;
		grid-area: content;
	}

	.facilityRentalsWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
		gap: 20px;
		margin-top: 2rem;
		margin: 0 auto;
		grid-area: content;
	}

	.contentWrapper {
		min-height: calc(100vh - 20rem);
	}
</style>
