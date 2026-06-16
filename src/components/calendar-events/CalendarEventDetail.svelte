<script lang="ts">
	import type { CalendarEventDetailPayload } from '$lib/calendarEventTypes';

	let {
		detail,
		backHref,
		backLabel,
		titleSuffix = 'Events'
	}: {
		detail: CalendarEventDetailPayload;
		backHref: string;
		backLabel: string;
		titleSuffix?: string;
	} = $props();

	const DISPLAY_TZ = 'America/Denver';

	function hasDescriptionContent(description: string | undefined | null): boolean {
		if (!description) return false;
		const textContent = description.replace(/<[^>]*>/g, '').trim();
		return textContent.length > 0;
	}

	const showDescription = $derived(hasDescriptionContent(detail.event.description));

	function formatDate(date: Date) {
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

	function formatDateTime(startDate: Date, endDate: Date | null) {
		const dateStr = formatDate(startDate);
		if (endDate) {
			return `${dateStr}, ${formatTime(startDate)} – ${formatTime(endDate)}`;
		}
		return `${dateStr}, ${formatTime(startDate)}`;
	}

	function isMultiDay(startDate: Date, endDate: Date | null) {
		if (!endDate) return false;
		const start = new Date(startDate);
		start.setHours(0, 0, 0, 0);
		const end = new Date(endDate);
		end.setHours(0, 0, 0, 0);
		return start.getTime() !== end.getTime();
	}
</script>

<svelte:head>
	<title>{detail.event.name} — {titleSuffix}</title>
	<meta
		name="description"
		content={detail.event.description
			? detail.event.description.replace(/<[^>]*>/g, '').slice(0, 160)
			: `Event details for ${detail.event.name}`}
	/>
</svelte:head>

<div class="contentWrapper">
	<p class="back">
		<a href={backHref}>{backLabel}</a>
	</p>

	<section class="hero">
		<h1>{detail.event.name}</h1>
		{#if detail.event.kind}
			<p class="kind">{detail.event.kind}</p>
		{/if}
	</section>

	<section class="section">
		{#if detail.event.imageUrl}
			<div class="eventImage">
				<img src={detail.event.imageUrl} alt="" loading="eager" />
			</div>
		{/if}

		{#if detail.instance}
			<div class="timeBlock">
				<h2 class="sectionTitle">When</h2>
				<div class="timeCard">
					{#if isMultiDay(new Date(detail.instance.startsAt), detail.instance.endsAt ? new Date(detail.instance.endsAt) : null)}
						<div class="stack">
							<div>
								<strong class="label">From</strong>
								<time datetime={detail.instance.startsAt}>
									{#if detail.instance.allDay}
										{formatDate(new Date(detail.instance.startsAt))}
										<span class="muted"> (all day)</span>
									{:else}
										{formatDateTime(
											new Date(detail.instance.startsAt),
											detail.instance.endsAt ? new Date(detail.instance.endsAt) : null
										)}
									{/if}
								</time>
							</div>
							{#if detail.instance.endsAt}
								<div>
									<strong class="label">To</strong>
									<time datetime={detail.instance.endsAt}>
										{#if detail.instance.allDay}
											{formatDate(new Date(detail.instance.endsAt))}
											<span class="muted"> (all day)</span>
										{:else}
											{formatDate(new Date(detail.instance.endsAt))}, {formatTime(
												new Date(detail.instance.endsAt)
											)}
										{/if}
									</time>
								</div>
							{/if}
						</div>
					{:else}
						<time datetime={detail.instance.startsAt}>
							{#if detail.instance.allDay}
								{formatDate(new Date(detail.instance.startsAt))}
								{#if detail.instance.endsAt}
									{@const s = new Date(detail.instance.startsAt).setHours(0, 0, 0, 0)}
									{@const e = new Date(detail.instance.endsAt).setHours(0, 0, 0, 0)}
									{#if s !== e}
										{' – '}
										{formatDate(new Date(detail.instance.endsAt))}
									{/if}
								{/if}
								<span class="muted"> (all day)</span>
							{:else}
								{formatDateTime(
									new Date(detail.instance.startsAt),
									detail.instance.endsAt ? new Date(detail.instance.endsAt) : null
								)}
							{/if}
						</time>
					{/if}
					{#if detail.instance.location}
						<p class="location"><strong>Location:</strong> {detail.instance.location}</p>
					{/if}
				</div>
			</div>
		{/if}

		{#if showDescription}
			<div class="about">
				<h2 class="sectionTitle">About</h2>
				<div class="htmlBody">{@html detail.event.description}</div>
			</div>
		{/if}

		<div class="actions">
			{#if detail.event.registrationUrl}
				<a
					href={detail.event.registrationUrl}
					target="_blank"
					rel="noopener noreferrer"
					class="btn btnPrimary"
				>
					Register →
				</a>
			{/if}
			{#if detail.event.publicUrl}
				<a href={detail.event.publicUrl} target="_blank" rel="noopener noreferrer" class="btn">
					View on Church Center →
				</a>
			{/if}
		</div>
	</section>
</div>

<style>
	.contentWrapper {
		grid-area: content;
		width: 100%;
		max-width: 52rem;
		margin-inline: auto;
		box-sizing: border-box;
		text-align: center;
	}

	.back {
		margin: 0;
		padding: 2rem 0 0;
		text-align: left;
	}

	.back a {
		color: var(--primaryColor);
		font-weight: 600;
		text-decoration: none;
	}

	.back a:hover {
		text-decoration: underline;
	}

	.hero h1 {
		margin: 0;
		font-size: clamp(1.75rem, 5vw, 2.5rem);
	}

	.kind {
		margin: 0;
		color: color-mix(in oklab, var(--textColor) 78%, transparent);
		font-size: 1.05rem;
	}

	.section {
		width: 100%;
	}

	.timeBlock,
	.about {
		text-align: left;
	}

	.sectionTitle {
		margin: 0 0 0.75rem;
		font-size: 1.35rem;
		color: var(--titleColor);
	}

	.eventImage {
		margin-bottom: 2rem;
		border-radius: 12px;
		overflow: hidden;
	}

	.eventImage img {
		width: 100%;
		height: auto;
		display: block;
	}

	.timeBlock {
		margin-bottom: 2rem;
	}

	.timeCard {
		padding: 1.25rem 1.5rem;
		background: color-mix(in oklab, var(--backgroundColor) 94%, black 6%);
		border-radius: 12px;
		border: 8px solid var(--pageCardBorder);
	}

	.timeCard time {
		display: block;
		font-size: 1.1rem;
		font-weight: 600;
		color: var(--textColor);
	}

	.muted {
		font-weight: 500;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
	}

	.stack {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}

	.label {
		display: block;
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.06em;
		color: color-mix(in oklab, var(--textColor) 72%, transparent);
		margin-bottom: 0.25rem;
	}

	.location {
		margin: 1rem 0 0;
		padding-top: 1rem;
		border-top: 1px solid color-mix(in oklab, var(--primaryColor) 18%, transparent);
		line-height: 1.5;
		color: var(--textColor);
	}

	.about {
		margin-bottom: 2rem;
	}

	.htmlBody {
		line-height: 1.7;
		color: var(--textColor);
	}

	.htmlBody :global(p) {
		margin: 1rem 0;
	}

	.htmlBody :global(a) {
		color: var(--primaryColor);
	}

	.actions {
		display: flex;
		flex-wrap: wrap;
		gap: 1rem;
		padding-top: 1.5rem;
		border-top: 1px solid color-mix(in oklab, var(--primaryColor) 22%, transparent);
		justify-content: center;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem 1.35rem;
		border-radius: 10px;
		font-weight: 600;
		text-decoration: none;
		border: 2px solid color-mix(in oklab, var(--primaryColor) 35%, transparent);
		color: var(--textColor);
		background: color-mix(in oklab, var(--backgroundColor) 92%, transparent);
	}

	.btn:hover {
		border-color: var(--primaryColor);
	}

	.btnPrimary {
		background: var(--primaryColor);
		border-color: var(--primaryColor);
		color: #fff;
	}

	.btnPrimary:hover {
		filter: brightness(0.95);
	}
</style>
