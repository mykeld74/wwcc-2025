<script lang="ts">
	import type { WowConnectUiEvent } from '$lib/wowConnectCalendarTypes';

	const DISPLAY_TZ = 'America/Denver';

	let { events = [] }: { events: WowConnectUiEvent[] } = $props();

	type ParsedEvent = WowConnectUiEvent & { start: Date; end: Date | null };

	const parsedEvents = $derived(
		events.map((e) => ({
			...e,
			start: new Date(e.startDate),
			end: e.endDate ? new Date(e.endDate) : null
		}))
	);

	let currentMonth = $state(new Date());
	let selectedDate = $state<Date | null>(null);
	let selectedDateEvents = $state<ParsedEvent[]>([]);

	function getDaysInMonth(date: Date) {
		return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
	}

	function getFirstDayOfMonth(date: Date) {
		return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
	}

	function getCalendarDays(): (Date | null)[] {
		const days: (Date | null)[] = [];
		const firstDay = getFirstDayOfMonth(currentMonth);
		const daysInMonth = getDaysInMonth(currentMonth);
		for (let i = 0; i < firstDay; i++) {
			days.push(null);
		}
		for (let day = 1; day <= daysInMonth; day++) {
			days.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day));
		}
		return days;
	}

	function getDateKey(date: Date) {
		const formatter = new Intl.DateTimeFormat('en-US', {
			timeZone: DISPLAY_TZ,
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		});
		const parts = formatter.formatToParts(date);
		const y = parts.find((p) => p.type === 'year')?.value || '';
		const m = parts.find((p) => p.type === 'month')?.value || '';
		const d = parts.find((p) => p.type === 'day')?.value || '';
		return `${y}-${m}-${d}`;
	}

	function isSameLocalDay(a: Date, b: Date) {
		return getDateKey(a) === getDateKey(b);
	}

	let eventsByDateKeyCache = $state(new Map<string, ParsedEvent[]>());
	let eventsCacheKey = $state('');

	$effect(() => {
		const list = parsedEvents;
		const eventsKey = `${list.length}-${list[0]?.id || ''}-${list[list.length - 1]?.id || ''}`;
		if (eventsKey !== eventsCacheKey) {
			const dateMap = new Map<string, ParsedEvent[]>();
			for (const event of list) {
				if (!event.start || Number.isNaN(event.start.getTime())) continue;
				const startKey = getDateKey(event.start);
				if (!dateMap.has(startKey)) dateMap.set(startKey, []);
				dateMap.get(startKey)!.push(event);
			}
			eventsByDateKeyCache = dateMap;
			eventsCacheKey = eventsKey;
		}
	});

	const eventDateKeys = $derived(new Set(eventsByDateKeyCache.keys()));

	function dayHasEvents(date: Date | null) {
		if (!date) return false;
		return eventDateKeys.has(getDateKey(date));
	}

	function getEventsForDate(date: Date | null): ParsedEvent[] {
		if (!date) return [];
		return eventsByDateKeyCache.get(getDateKey(date)) || [];
	}

	function selectDate(date: Date) {
		selectedDate = date;
		selectedDateEvents = getEventsForDate(date);
	}

	function formatMonthYear(date: Date) {
		return new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: DISPLAY_TZ }).format(
			date
		);
	}

	function formatDay(date: Date) {
		return String(date.getDate());
	}

	function isToday(date: Date | null) {
		if (!date) return false;
		const t = new Date();
		return (
			date.getDate() === t.getDate() &&
			date.getMonth() === t.getMonth() &&
			date.getFullYear() === t.getFullYear()
		);
	}

	function formatDateLong(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			weekday: 'long',
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			timeZone: DISPLAY_TZ
		}).format(date);
	}

	function formatTime(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			hour: 'numeric',
			minute: '2-digit',
			timeZone: DISPLAY_TZ
		}).format(date);
	}

	function previousMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
	}

	function nextMonth() {
		currentMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1);
	}

	function goToToday() {
		currentMonth = new Date();
	}

	const calendarDays = $derived(getCalendarDays());
	const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
</script>

<div class="calendarSection">
	<div class="calendarHeader">
		<h2 class="calendarTitle">Upcoming</h2>
		<div class="calendarNav">
			<button type="button" class="navBtn" onclick={previousMonth}>←</button>
			<button type="button" class="navBtn" onclick={goToToday}>Today</button>
			<button type="button" class="navBtn" onclick={nextMonth}>→</button>
		</div>
	</div>
	<p class="monthLabel">{formatMonthYear(currentMonth)}</p>
	<div class="calendarLayout">
		<div class="calendarGrid">
			<div class="weekHeader">
				{#each weekDays as day}
					<div class="weekDay">{day}</div>
				{/each}
			</div>
			<div class="days">
				{#each calendarDays as day}
					<button
						type="button"
						class="day"
						class:empty={!day}
						class:today={day && isToday(day)}
						class:hasEvents={day && dayHasEvents(day)}
						class:selected={day && selectedDate && isSameLocalDay(day, selectedDate)}
						disabled={!day || !dayHasEvents(day)}
						onclick={() => {
							if (day && dayHasEvents(day)) selectDate(day);
						}}
					>
						{#if day}
							<span class="dayInner">
								<span class="dayNum">{formatDay(day)}</span>
								{#if dayHasEvents(day)}
									<span class="eventDot" aria-hidden="true"></span>
								{/if}
							</span>
						{/if}
					</button>
				{/each}
			</div>
		</div>
		<div class="eventsPanel">
			{#if selectedDate}
				<div class="panelHead">
					<h3>{formatDateLong(selectedDate)}</h3>
				</div>
				<div class="panelBody">
					{#if selectedDateEvents.length > 0}
						<ul class="eventList">
							{#each selectedDateEvents as event}
								<li class="eventItem">
									<h4 class="eventTitle">
										<a href="/women-of-westwoods/wow-connect/events/{event.eventId}">
											{event.title}
										</a>
									</h4>
									{#if event.allDay}
										<p class="meta">All day</p>
									{:else}
										<p class="meta">
											<time datetime={event.startDate}>{formatTime(event.start)}</time>
											{#if event.end}
												{' – '}
												<time datetime={event.endDate}>{formatTime(event.end)}</time>
											{/if}
										</p>
									{/if}
									{#if event.location}
										<p class="meta"><strong>Location:</strong> {event.location}</p>
									{/if}
									{#if event.descriptionHtml}
										<div class="descPreview">{@html event.descriptionHtml}</div>
									{/if}
									{#if event.registrationUrl}
										<p class="reg">
											<a href={event.registrationUrl} target="_blank" rel="noopener noreferrer"
												>Register →</a
											>
										</p>
									{/if}
								</li>
							{/each}
						</ul>
					{:else}
						<p class="emptyMsg">No events this day.</p>
					{/if}
				</div>
			{:else}
				<div class="panelEmpty">
					<p>Select a highlighted date to see WOW events.</p>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	.calendarSection {
		margin-top: 0;
		width: 100%;
		min-width: 0;
	}

	.calendarHeader {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		margin-bottom: 0.5rem;
	}

	.calendarTitle {
		margin: 0;
		font-size: clamp(1.5rem, 4vw, 2rem);
		color: var(--titleColor);
	}

	.calendarNav {
		display: flex;
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
		margin: 0 0 1.25rem;
		font-size: 1.25rem;
		font-weight: 600;
		color: var(--textColor);
	}

	.calendarLayout {
		display: grid;
		grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
		gap: 2rem;
		align-items: start;
	}

	@media (max-width: 960px) {
		.calendarLayout {
			grid-template-columns: 1fr;
		}
	}

	.calendarGrid {
		background: color-mix(in oklab, var(--backgroundColor) 97%, white 3%);
		border-radius: 10px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 16%, transparent);
		overflow: hidden;
	}

	.weekHeader {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		background: color-mix(in oklab, var(--contrastColor) 7%, transparent);
		border-bottom: 1px solid color-mix(in oklab, var(--contrastColor) 14%, transparent);
	}

	.weekDay {
		padding: 0.65rem 0.25rem;
		text-align: center;
		font-weight: 700;
		font-size: 0.72rem;
		color: color-mix(in oklab, var(--textColor) 68%, transparent);
		text-transform: uppercase;
		letter-spacing: 0.05em;
	}

	.days {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		gap: 1px;
		background: color-mix(in oklab, var(--contrastColor) 12%, transparent);
	}

	.day {
		min-height: 88px;
		background: color-mix(in oklab, var(--backgroundColor) 99%, white 1%);
		padding: 0.45rem 0.4rem 0.35rem;
		border: 1px solid transparent;
		cursor: pointer;
		text-align: left;
		font: inherit;
	}

	.day:disabled {
		cursor: default;
		opacity: 0.5;
	}

	.day.empty {
		background: color-mix(in oklab, var(--backgroundColor) 90%, black 10%);
		cursor: default;
	}

	.day.today:not(.empty) {
		border-color: color-mix(in oklab, var(--contrastColor) 42%, transparent);
	}

	.day.hasEvents:not(:disabled) {
		border-color: color-mix(in oklab, var(--contrastColor) 22%, transparent);
	}

	.day.selected:not(.empty) {
		border-color: color-mix(in oklab, var(--contrastColor) 48%, transparent);
		background: color-mix(in oklab, var(--contrastColor) 8%, transparent);
	}

	.dayInner {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.35rem;
		width: 100%;
		min-height: 2.25rem;
	}

	.dayNum {
		font-weight: 800;
		font-size: 1rem;
		line-height: 1.1;
		color: var(--textColor);
		letter-spacing: -0.02em;
	}

	.eventDot {
		flex-shrink: 0;
		width: 0.5rem;
		height: 0.5rem;
		border-radius: 50%;
		background: color-mix(in oklab, var(--textColor) 45%, var(--titleColor) 55%);
		box-shadow: 0 0 0 1px color-mix(in oklab, var(--backgroundColor) 60%, transparent);
	}

	.eventsPanel {
		background: color-mix(in oklab, var(--backgroundColor) 97%, white 3%);
		border-radius: 10px;
		border: 1px solid color-mix(in oklab, var(--contrastColor) 16%, transparent);
		min-height: 320px;
		max-height: 640px;
		display: flex;
		flex-direction: column;
	}

	@media (max-width: 960px) {
		.eventsPanel {
			max-height: none;
		}
	}

	.panelHead {
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid color-mix(in oklab, var(--contrastColor) 14%, transparent);
		background: color-mix(in oklab, var(--contrastColor) 5%, transparent);
	}

	.panelHead h3 {
		margin: 0;
		font-size: 1.25rem;
		color: var(--titleColor);
	}

	.panelBody {
		flex: 1;
		overflow-y: auto;
		padding: 1.25rem 1.5rem;
	}

	.panelEmpty {
		flex: 1;
		display: grid;
		place-items: center;
		padding: 2rem;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
		text-align: center;
	}

	.eventList {
		list-style: none;
		margin: 0;
		padding: 0;
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.eventTitle {
		margin: 0 0 0.5rem;
		font-size: 1.1rem;
	}

	.eventTitle a {
		color: var(--titleColor);
		text-decoration: none;
		font-weight: 700;
		border-bottom: 1px solid color-mix(in oklab, var(--textColor) 38%, transparent);
	}

	.eventTitle a:hover {
		border-bottom-color: color-mix(in oklab, var(--textColor) 62%, transparent);
	}

	.meta {
		margin: 0.25rem 0;
		font-size: 0.95rem;
		color: color-mix(in oklab, var(--textColor) 88%, transparent);
		line-height: 1.45;
	}

	.descPreview {
		font-size: 0.88rem;
		line-height: 1.5;
		color: color-mix(in oklab, var(--textColor) 90%, transparent);
		max-height: 8rem;
		overflow: hidden;
	}

	.descPreview :global(p) {
		margin: 0.35rem 0;
	}

	.reg a {
		font-weight: 600;
		color: var(--primaryColor);
		text-decoration: underline;
		text-underline-offset: 0.15em;
	}

	.emptyMsg {
		margin: 0;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
	}
</style>
