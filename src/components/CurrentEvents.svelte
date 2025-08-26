<script>
	import fallEvents from '$data/fallEvents.js';

	const currentDate = new Date();
	const currentYear = currentDate.getFullYear();

	const currentEvents = fallEvents.filter((event) => {
		const [month, day] = event.date.split('.');
		const eventDate = new Date(currentYear, parseInt(month) - 1, parseInt(day));

		return eventDate >= currentDate;
	});
</script>

<div class="modalContent">
	<div class="modalHeader">
		<h2>Current Events</h2>
	</div>

	<div class="currentEvents">
		{#each currentEvents as event}
			<div class="eventItem">
				<h3>{event.date}</h3>
				<hr />
				<p>{event.description}</p>
			</div>
		{/each}
	</div>
</div>

<style>
	/* .modalContent {
		padding: 1.5rem;
		max-width: 800px;
		width: 90vw;
	}

	.modalHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		border-bottom: 2px solid var(--contrastColor);
		padding-bottom: 1rem;
	}*/

	.modalHeader h2 {
		margin: 0;
		color: var(--contrastColor);
		font-size: clamp(1.5rem, 4vw, 2rem);
		font-weight: 700;
		padding-bottom: 1rem;
	}

	.currentEvents {
		display: grid;
		grid-template-columns: 1fr;
		gap: 1rem;
	}

	.eventItem {
		display: flex;
		flex-direction: column;
		border: 1px solid var(--contrastColor);
		padding: 1rem;
		border-radius: 0.5rem;
		gap: 0.5rem;
		h3 {
			color: var(--contrastColor);
			font-size: clamp(1.125rem, 2.5vw, 1.5rem);
			font-weight: 600;
			margin: 0;
		}
		p {
			margin: 0;
		}
		hr {
			width: 100%;
		}
	}
</style>
