<script lang="ts">
	import { CalendarEvents } from '$components/calendar-events';
	import type { CalendarUiEvent } from '$lib/calendarEventTypes';
	import { wowConnectEventHref } from '$lib/wowConnectPaths';

	let { data } = $props();

	const wowEmptyMonthMessage = (monthYear: string) =>
		`No WOW events in ${monthYear}. Try another month.`;

	function stripHtml(html: string) {
		return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
	}

	function truncateText(text: string, maxLength = 160) {
		if (text.length <= maxLength) return text;
		return `${text.slice(0, maxLength - 1).trimEnd()}…`;
	}

	function featuredRegistrationFromEvent(event: CalendarUiEvent) {
		const href = event.registrationUrl || event.publicUrl || wowConnectEventHref(event);
		const isExternal = Boolean(event.registrationUrl || event.publicUrl);
		const description = truncateText(stripHtml(event.descriptionHtml));

		return {
			eventId: event.eventId,
			label: event.kind.trim(),
			title: event.title,
			description,
			href,
			buttonText: event.registrationUrl ? 'Register' : 'View details',
			isExternal
		};
	}

	/** Unique featured WOW events with a registration or Church Center link. */
	const featuredRegistrations = $derived.by(() => {
		const seen = new Set<string>();
		const featured = [];

		for (const event of data.events) {
			if (event.featured !== true) continue;
			if (!event.registrationUrl && !event.publicUrl) continue;
			if (seen.has(event.eventId)) continue;
			seen.add(event.eventId);
			featured.push(featuredRegistrationFromEvent(event));
		}

		return featured;
	});
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
			The women of Westwoods have many opportunities to connect with each other. Browse this month's
			events or switch to the calendar view. Open an event for full details, registration, and
			Church Center links.
		</p>
	</div>

	{#if featuredRegistrations.length > 0}
		<section class="featuredRegistrations" aria-labelledby="featuredRegistrationsHeading">
			<div class="featuredHeader">
				<h2 id="featuredRegistrationsHeading">Open registrations</h2>
				<p>Sign up for these upcoming gatherings.</p>
			</div>

			<div class="registrationGrid">
				{#each featuredRegistrations as event (event.eventId)}
					<article class="registrationCard">
						{#if event.label}
							<p class="cardLabel">{event.label}</p>
						{/if}
						<h3>{event.title}</h3>
						{#if event.description}
							<p class="cardDescription">{event.description}</p>
						{/if}
						<a
							class="registerBtn"
							href={event.href}
							target={event.isExternal ? '_blank' : undefined}
							rel={event.isExternal ? 'noopener noreferrer' : undefined}
						>
							{event.buttonText}
							<span aria-hidden="true">→</span>
						</a>
					</article>
				{/each}
			</div>
		</section>
	{/if}

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
		color: var(--titleColor);
		margin: 0 0 0.65rem;
		font-size: clamp(1.85rem, 4.5vw, 2.35rem);
		font-weight: 800;
		width: 100%;
		max-width: none;
	}

	.connectIntro p {
		line-height: 1.65;
		color: var(--textColor);
		margin: 0;
		width: 100%;
		max-width: none;
		font-size: clamp(1rem, 2.2vw, 1.1rem);
	}

	.featuredRegistrations {
		grid-column: 1 / -1;
		display: grid;
		gap: 1rem;
		padding: clamp(0.75rem, 2vw, 1.25rem) clamp(0.75rem, 2vw, 1.25rem) 0;
		box-sizing: border-box;
	}

	.featuredHeader {
		display: grid;
		gap: 0.25rem;
	}

	.featuredHeader h2 {
		margin: 0;
		font-size: clamp(1.35rem, 3.5vw, 1.75rem);
		font-weight: 700;
		color: var(--titleColor);
	}

	.featuredHeader p {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.45;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
	}

	.registrationGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: clamp(0.75rem, 2vw, 1.25rem);
	}

	.registrationCard {
		display: grid;
		grid-template-rows: auto auto 1fr auto;
		gap: 0.55rem;
		min-height: 100%;
		padding: clamp(1.1rem, 2.5vw, 1.5rem);
		border-radius: 10px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 22%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 88%, var(--contrastColor) 12%);
		box-sizing: border-box;
	}

	.cardLabel {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: color-mix(in oklab, var(--textColor) 62%, transparent);
	}

	.registrationCard h3 {
		margin: 0;
		font-size: clamp(1.2rem, 2.8vw, 1.45rem);
		font-weight: 800;
		line-height: 1.25;
		color: var(--titleColor);
	}

	.cardDescription {
		margin: 0;
		font-size: 0.95rem;
		line-height: 1.5;
		color: color-mix(in oklab, var(--textColor) 82%, transparent);
	}

	.registerBtn {
		display: inline-grid;
		grid-auto-flow: column;
		align-items: center;
		justify-content: center;
		gap: 0.45rem;
		width: fit-content;
		margin-top: 0.65rem;
		padding: 0.65rem 1.25rem;
		border-radius: 8px;
		border: none;
		background: var(--primaryColor);
		color: #fff;
		font-size: 0.92rem;
		font-weight: 700;
		text-decoration: none;
		transition:
			filter var(--animHoverTime, 400ms) var(--animHoverEase, ease),
			transform var(--animHoverTime, 400ms) var(--animHoverEase, ease);
	}

	.registerBtn:hover {
		filter: brightness(1.1);
		transform: translateY(-1px);
	}

	.registerBtn:focus-visible {
		outline: 2px solid var(--primaryColor);
		outline-offset: 3px;
	}

	.calendarSlot {
		grid-column: 1 / -1;
		width: 100%;
		min-width: 0;
		padding: clamp(1.25rem, 3vw, 2rem) clamp(0.75rem, 2vw, 1.25rem) clamp(2rem, 4vw, 3rem);
		box-sizing: border-box;
	}

	@media (max-width: 640px) {
		.registrationGrid {
			grid-template-columns: 1fr;
		}
	}
</style>
