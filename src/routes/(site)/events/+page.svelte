<script lang="ts">
	import { CalendarEvents } from '$components/calendar-events';
	import { churchEventHref } from '$lib/calendarEventPaths';

	let { data } = $props();
</script>

<svelte:head>
	<title>Events — Westwoods Community Church</title>
	<meta
		name="description"
		content="Browse upcoming events at Westwoods Community Church. View the calendar or list and open an event for details and registration."
	/>
</svelte:head>

<div class="eventsIntro">
	<h1>Events</h1>
	<p>
		See what's coming up at Westwoods. Browse this month's events or switch to the list view. Open an
		event for full details, registration, and Church Center links.
	</p>
</div>

<div class="eventsSlot">
	<CalendarEvents events={data.events} eventHref={churchEventHref} defaultView="calendar" />
</div>

<style>
	.eventsIntro {
		grid-area: hero / content;
		width: 100%;
		max-width: 1200px;
		margin-inline: auto;
		box-sizing: border-box;
		padding: clamp(1.25rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.25rem) clamp(0.5rem, 1.5vw, 1rem);
	}

	.eventsIntro h1 {
		color: #121212;
		margin: 0 0 0.65rem;
		font-size: clamp(1.85rem, 4.5vw, 2.35rem);
		font-weight: 800;
		width: 100%;
		max-width: none;
	}

	.eventsIntro p {
		line-height: 1.65;
		color: #121212;
		margin: 0;
		width: 100%;
		max-width: none;
		font-size: clamp(1rem, 2.2vw, 1.1rem);
	}

	:global(body.dark) .eventsIntro h1,
	:global(body.dark) .eventsIntro p {
		color: #fff;
	}

	.eventsSlot {
		grid-area: content;
		width: 100%;
		max-width: 1200px;
		margin-inline: auto;
		min-width: 0;
		padding: clamp(0.5rem, 1.5vw, 1rem) clamp(0.75rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
		box-sizing: border-box;
	}
</style>
