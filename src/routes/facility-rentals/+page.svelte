<script>
	import { Card } from '$components';

	const rooms = [
		{
			title: 'Auditorium',
			desc: 'Seating for 200-400',
			features: ['Full sound, lighting and video options', 'Hanging lights and pallet backdrop']
		},
		{
			title: 'The Workshop',
			desc: 'Multipurpose room with seating for up to 60 in rows or 45 at tables with room for a buffet, approximately',
			features: ['Mounted TV for presentations']
		},
		{
			title: 'The Café',
			desc: 'Seating for 150-200',
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
			title: 'Adult Classroom 1',
			desc: 'Conference table with seating for 10-12',
			features: ['White board for presentations', 'Optional TV on a cart']
		},
		{
			title: 'Adult Classroom 2',
			desc: 'Multipurpose room for seating or tables',
			features: ['Optional TV on a cart']
		}
	];
</script>

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
		max-width: 1200px;
		grid-area: content;
	}

	.facilityRentalsWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(390px, 1fr));
		gap: 20px;
		margin-top: 2rem;
		margin: 0 auto;
		grid-area: content;
	}

	.roomTitle {
		font-size: 1.5rem;
		font-weight: 600;
		margin-bottom: 1rem;
		color: var(--textColor);
	}

	.roomFeatures {
		list-style-type: none;
		padding: 0;
		margin: 0;
	}

	.roomFeatures li {
		margin-bottom: 0.5rem;
		padding-left: 1.5rem;
		position: relative;
	}

	.roomFeatures li:before {
		content: '•';
		position: absolute;
		left: 0;
		color: var(--accentColor);
	}
</style>
