<script lang="ts">
	import type { CalendarUiEvent } from '$lib/calendarEventTypes';
	import {
		filterEventsByMonth,
		formatDateCompact,
		formatEventTime,
		formatMonthYear,
		parseCalendarEvents,
		shiftMonth
	} from '$lib/calendarEventDates';
	import {
		defaultCalendarEventHref,
		defaultEmptyMonthMessage,
		type CalendarEventHref
	} from '$lib/calendarEventsView';

	let {
		events = [],
		currentMonth = $bindable(new Date()),
		eventHref = defaultCalendarEventHref,
		heading = 'Upcoming',
		emptyMonthMessage = defaultEmptyMonthMessage
	}: {
		events: CalendarUiEvent[];
		currentMonth?: Date;
		eventHref?: CalendarEventHref;
		heading?: string;
		emptyMonthMessage?: (monthYear: string) => string;
	} = $props();

	const parsedEvents = $derived(parseCalendarEvents(events));
	const monthEvents = $derived(filterEventsByMonth(parsedEvents, currentMonth));
	const resolveEventHref = (event: CalendarUiEvent) => eventHref(event);

	function previousMonth() {
		currentMonth = shiftMonth(currentMonth, -1);
	}

	function nextMonth() {
		currentMonth = shiftMonth(currentMonth, 1);
	}

	function goToToday() {
		currentMonth = new Date();
	}
</script>

<div class="listSection">
	<div class="listHeader">
		<h2 class="listTitle">{heading}</h2>
		<div class="monthNav">
			<button type="button" class="navBtn" onclick={previousMonth} aria-label="Previous month">
				←
			</button>
			<button type="button" class="navBtn" onclick={goToToday}>Today</button>
			<button type="button" class="navBtn" onclick={nextMonth} aria-label="Next month">→</button>
		</div>
		</div>
	<p class="monthLabel">{formatMonthYear(currentMonth)}</p>

	{#if monthEvents.length > 0}
		<ul class="eventGrid">
			{#each monthEvents as event (event.id)}
				<li class="eventRow">
					<time class="dateCell" datetime={event.startDate}>
						{formatDateCompact(event.start)}
					</time>

					<div class="mainCell">
						<a class="eventLink" href={resolveEventHref(event)}>{event.title}</a>
						<span class="meta">
							{formatEventTime(event)}
							{#if event.location}
								<span class="sep">·</span>
								{event.location}
							{/if}
						</span>
					</div>

					<div class="actionCell">
						<a class="viewEventBtn" href={resolveEventHref(event)}>View</a>
						{#if event.registrationUrl}
							<a
								class="registerLink"
								href={event.registrationUrl}
								target="_blank"
								rel="noopener noreferrer"
							>
								Register
							</a>
						{/if}
					</div>
				</li>
			{/each}
		</ul>
	{:else}
		<p class="emptyMsg">{emptyMonthMessage(formatMonthYear(currentMonth))}</p>
	{/if}
</div>

<style>
	.listSection {
		width: 100%;
		min-width: 0;
	}

	.listHeader {
		display: grid;
		grid-template-columns: 1fr auto;
		align-items: center;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.listTitle {
		margin: 0;
		font-size: clamp(1.5rem, 4vw, 2rem);
		color: var(--titleColor);
	}

	.monthNav {
		display: grid;
		grid-auto-flow: column;
		gap: 0.5rem;
	}

	.navBtn {
		padding: 0.45rem 0.9rem;
		border: 1px solid color-mix(in oklab, var(--textColor) 22%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 92%, transparent);
		color: var(--textColor);
		border-radius: 8px;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
		font: inherit;
	}

	.navBtn:hover {
		border-color: color-mix(in oklab, var(--textColor) 38%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 96%, white 4%);
	}

	.monthLabel {
		margin: 0 0 0.65rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--textColor);
	}

	.eventGrid {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		grid-template-columns: minmax(7.25rem, max-content) minmax(0, 1fr) auto;
		column-gap: 0.65rem;
		row-gap: 0.35rem;
		align-items: center;
		font-size: 0.875rem;
		line-height: 1.3;
	}

	.eventRow {
		display: grid;
		grid-template-columns: subgrid;
		grid-column: 1 / -1;
		align-items: center;
		padding: 0.35rem 0.5rem;
		border-radius: 6px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 12%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 98%, white 2%);
	}

	.dateCell {
		margin: 0;
		font-size: 0.72rem;
		font-weight: 700;
		color: color-mix(in oklab, var(--textColor) 68%, transparent);
		text-transform: uppercase;
		letter-spacing: 0.02em;
		white-space: nowrap;
	}

	.mainCell {
		min-width: 0;
		display: grid;
		gap: 0.05rem;
	}

	.eventLink {
		color: var(--titleColor);
		font-weight: 700;
		text-decoration: none;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.eventLink:hover {
		text-decoration: underline;
		text-underline-offset: 0.12em;
	}

	.meta {
		color: color-mix(in oklab, var(--textColor) 76%, transparent);
		font-size: 0.78rem;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.sep {
		margin-inline: 0.2rem;
	}

	.actionCell {
		display: grid;
		grid-auto-flow: column;
		align-items: center;
		gap: 0.4rem;
		justify-content: end;
	}

	.viewEventBtn {
		display: inline-grid;
		place-items: center;
		padding: 0.25rem 0.5rem;
		border-radius: 5px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 24%, transparent);
		background: color-mix(in oklab, var(--contrastColor) 8%, transparent);
		color: var(--titleColor);
		font-size: 0.72rem;
		font-weight: 700;
		text-decoration: none;
		white-space: nowrap;
	}

	.viewEventBtn:hover {
		background: color-mix(in oklab, var(--contrastColor) 14%, transparent);
	}

	.registerLink {
		font-size: 0.72rem;
		font-weight: 600;
		color: var(--primaryColor);
		text-decoration: none;
		white-space: nowrap;
	}

	.registerLink:hover {
		text-decoration: underline;
		text-underline-offset: 0.1em;
	}

	@media (max-width: 540px) {
		.eventGrid {
			grid-template-columns: 1fr auto;
		}

		.dateCell {
			grid-column: 1 / -1;
			padding-bottom: 0.1rem;
		}

		.mainCell {
			grid-column: 1;
		}

		.actionCell {
			grid-column: 2;
			grid-row: 2;
		}

		.eventRow {
			row-gap: 0.25rem;
			padding: 0.45rem 0.5rem;
		}
	}

	.emptyMsg {
		margin: 0;
		padding: 1.5rem 1rem;
		text-align: center;
		font-size: 0.95rem;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 97%, white 3%);
		border-radius: 8px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 16%, transparent);
	}
</style>
