<script lang="ts">
	import { CalendarEvents } from '$components/calendar-events';
	import { wowConnectEventHref } from '$lib/wowConnectPaths';

	let { data } = $props();

	const wowEmptyMonthMessage = (monthYear: string) =>
		`No WOW events in ${monthYear}. Try another month.`;
</script>

<svelte:head>
	<title>WOW Connect — Westwoods Women</title>
	<meta
		name="description"
		content="Connect with other women at Westwoods through WOW events and gatherings."
	/>
</svelte:head>

<div class="contentWrapper">
	<div class="connectIntro">
		<h1>WOW Connect</h1>
		<p>
			The women of Westwoods have many opportunities to connect with each other. Browse this
			month's events or switch to the calendar view. Open an event for full details,
			registration, and Church Center links.
		</p>
	</div>
	<div class="calendarSlot">
		<CalendarEvents
			events={data.events}
			eventHref={wowConnectEventHref}
			emptyMonthMessage={wowEmptyMonthMessage}
			calendarSelectHint="Select a highlighted date to see WOW events."
		/>
	</div>
</div>

<style>
	.contentWrapper {
		grid-area: content;
		width: 100%;
		max-width: 1200px;
		margin-inline: auto;
		display: grid;
		grid-template-columns: minmax(0, 1fr);
		min-width: 0;
	}

	.connectIntro {
		grid-column: 1 / -1;
		width: 100%;
		box-sizing: border-box;
		padding: clamp(1.25rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 1.5vw, 1rem);
	}

	.connectIntro h1 {
		color: #121212;
		margin: 0 0 0.65rem;
		font-size: clamp(1.85rem, 4.5vw, 2.35rem);
		font-weight: 800;
		width: 100%;
		max-width: none;
	}

	.connectIntro p {
		line-height: 1.65;
		color: #121212;
		margin: 0;
		width: 100%;
		max-width: none;
		font-size: clamp(1rem, 2.2vw, 1.1rem);
	}

	:global(body.dark) .connectIntro h1,
	:global(body.dark) .connectIntro p {
		color: #fff;
	}

	.calendarSlot {
		grid-column: 1 / -1;
		width: 100%;
		min-width: 0;
		padding: clamp(1.25rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
		box-sizing: border-box;
	}
</style>
