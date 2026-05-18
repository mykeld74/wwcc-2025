<script lang="ts">
	import type { CalendarUiEvent } from '$lib/calendarEventTypes';
	import {
		defaultCalendarEventHref,
		defaultCalendarSelectHint,
		defaultEmptyMonthMessage,
		type CalendarEventHref
	} from '$lib/calendarEventsView';
	import CalendarEventList from './CalendarEventList.svelte';
	import CalendarMonthView from './CalendarMonthView.svelte';

	type ViewMode = 'list' | 'calendar';

	let {
		events = [],
		eventHref = defaultCalendarEventHref,
		heading = 'Upcoming',
		emptyMonthMessage = defaultEmptyMonthMessage,
		calendarSelectHint = defaultCalendarSelectHint,
		viewToggleAriaLabel = 'Event display',
		defaultView = 'list'
	}: {
		events: CalendarUiEvent[];
		eventHref?: CalendarEventHref;
		heading?: string;
		emptyMonthMessage?: (monthYear: string) => string;
		calendarSelectHint?: string;
		viewToggleAriaLabel?: string;
		defaultView?: ViewMode;
	} = $props();

	let viewMode = $state<ViewMode>(defaultView);
	let currentMonth = $state(new Date());

	const sharedViewProps = $derived({
		events,
		eventHref,
		heading,
		emptyMonthMessage,
		calendarSelectHint
	});
</script>

<div class="eventsShell">
	<div class="viewBar">
		<div class="viewToggle" role="tablist" aria-label={viewToggleAriaLabel}>
			<button
				type="button"
				role="tab"
				class="viewBtn"
				class:active={viewMode === 'list'}
				aria-selected={viewMode === 'list'}
				onclick={() => (viewMode = 'list')}
			>
				List
			</button>
			<button
				type="button"
				role="tab"
				class="viewBtn"
				class:active={viewMode === 'calendar'}
				aria-selected={viewMode === 'calendar'}
				onclick={() => (viewMode = 'calendar')}
			>
				Calendar
			</button>
		</div>
	</div>

	{#if viewMode === 'list'}
		<CalendarEventList {...sharedViewProps} bind:currentMonth />
	{:else}
		<CalendarMonthView {...sharedViewProps} bind:currentMonth />
	{/if}
</div>

<style>
	.eventsShell {
		width: 100%;
		min-width: 0;
	}

	.viewBar {
		display: flex;
		justify-content: flex-end;
		margin-bottom: 1rem;
	}

	.viewToggle {
		display: inline-grid;
		grid-template-columns: 1fr 1fr;
		gap: 0;
		padding: 0.2rem;
		border-radius: 10px;
		border: 1px solid color-mix(in oklab, var(--textColor) 22%, transparent);
		background: color-mix(in oklab, var(--backgroundColor) 92%, transparent);
	}

	.viewBtn {
		padding: 0.45rem 1rem;
		border: none;
		border-radius: 8px;
		background: transparent;
		color: color-mix(in oklab, var(--textColor) 78%, transparent);
		font: inherit;
		font-size: 0.9rem;
		font-weight: 600;
		cursor: pointer;
	}

	.viewBtn.active {
		background: color-mix(in oklab, var(--contrastColor) 10%, transparent);
		color: var(--titleColor);
		box-shadow: 0 1px 2px color-mix(in oklab, var(--textColor) 12%, transparent);
	}

	.viewBtn:hover:not(.active) {
		color: var(--textColor);
	}
</style>
