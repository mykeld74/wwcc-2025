<script>
	let { data } = $props();

	function formatDate(value) {
		return new Date(value).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric'
		});
	}

	function trendLabel(current, previous) {
		if (previous === 0 && current === 0) {
			return 'No change from previous 7 days';
		}
		if (previous === 0) {
			return `Up from 0 to ${current} this week`;
		}

		const diff = current - previous;
		const direction = diff > 0 ? 'up' : diff < 0 ? 'down' : 'flat';
		const pct = Math.round((Math.abs(diff) / previous) * 100);

		if (direction === 'flat') {
			return 'Flat vs previous 7 days';
		}

		return `${direction === 'up' ? 'Up' : 'Down'} ${pct}% vs previous 7 days`;
	}
</script>

<div class="dashboard">
	<header class="pageHeader">
		<h1>Dashboard</h1>
		<p>Quick snapshot of volunteer, prayer, and information activity.</p>
	</header>

	<div class="statsGrid">
		<a href="/admin/volunteer-opportunities" class="statCard">
			<div class="cardTop">
				<h3>Volunteer Requests</h3>
				<span class="cardBadge">Action Queue</span>
			</div>
			<p class="statNumber">{data.stats.volunteerTotal}</p>
			<p class="statDetail">{data.stats.volunteerPending} pending</p>
		</a>

		<a href="/admin/prayer-requests" class="statCard">
			<div class="cardTop">
				<h3>Prayer Requests</h3>
				<span class="cardBadge">Pastoral Care</span>
			</div>
			<p class="statNumber">{data.stats.prayerTotal}</p>
			<p class="statDetail">View and manage submitted requests</p>
		</a>

		<a href="/admin/information-requests" class="statCard">
			<div class="cardTop">
				<h3>Info Requests</h3>
				<span class="cardBadge">Follow-up</span>
			</div>
			<p class="statNumber">{data.stats.infoTotal}</p>
			<p class="statDetail">{data.stats.infoPending} pending</p>
		</a>
	</div>

	<div class="contentGrid">
		<section class="panel">
			<div class="panelHeader">
				<h2>Needs Attention</h2>
				<span>Prioritize these first</span>
			</div>
			<ul class="metricList">
				<li>
					<span class="metricLabel">Prayer requests in last 24 hours</span>
					<strong>{data.stats.prayerLast24Hours}</strong>
				</li>
				<li>
					<span class="metricLabel">Staff-only prayer requests</span>
					<strong>{data.stats.staffOnlyPrayerTotal}</strong>
				</li>
				<li>
					<span class="metricLabel">Volunteers pending over 3 days</span>
					<strong>{data.stats.volunteerPendingOver3Days}</strong>
				</li>
				<li>
					<span class="metricLabel">Volunteers pending over 7 days</span>
					<strong>{data.stats.volunteerPendingOver7Days}</strong>
				</li>
				<li>
					<span class="metricLabel">Information requests pending</span>
					<strong>{data.stats.infoPending}</strong>
				</li>
			</ul>
		</section>

		<section class="panel">
			<div class="panelHeader">
				<h2>7-Day Trends</h2>
				<span>Compared to previous 7 days</span>
			</div>
			<ul class="trendList">
				<li>
					<div>
						<p class="trendTitle">Prayer submissions</p>
						<p class="trendMeta">
							{data.stats.prayerCurrentWeek} this week / {data.stats.prayerPreviousWeek} previous
						</p>
					</div>
					<span class="trendPill">
						{trendLabel(data.stats.prayerCurrentWeek, data.stats.prayerPreviousWeek)}
					</span>
				</li>
				<li>
					<div>
						<p class="trendTitle">Volunteer submissions</p>
						<p class="trendMeta">
							{data.stats.volunteerCurrentWeek} this week / {data.stats.volunteerPreviousWeek} previous
						</p>
					</div>
					<span class="trendPill">
						{trendLabel(data.stats.volunteerCurrentWeek, data.stats.volunteerPreviousWeek)}
					</span>
				</li>
			</ul>
		</section>

		<section class="panel">
			<div class="panelHeader">
				<h2>Recent Activity</h2>
				<span>Latest submissions across forms</span>
			</div>
			{#if data.recentActivity.length === 0}
				<p class="emptyText">No activity yet.</p>
			{:else}
				<ul class="activityList">
					{#each data.recentActivity as item}
						<li>
							<div>
								<p class="activityTitle">
									{#if item.kind === 'prayer'}
										Prayer Request
									{:else if item.kind === 'volunteer'}
										Volunteer Request
									{:else}
										Info Request
									{/if}
									- {item.name}
								</p>
								<p class="activityMeta">{formatDate(item.submittedAt)} - {item.status}</p>
							</div>
							<a href={item.href} class="viewLink">View</a>
						</li>
					{/each}
				</ul>
			{/if}
		</section>

		<section class="panel">
			<div class="panelHeader">
				<h2>Quick Actions</h2>
				<span>Common admin tasks</span>
			</div>
			<div class="actionGrid">
				<a href="/admin/volunteer-opportunities" class="quickAction">Review volunteer queue</a>
				<a href="/admin/prayer-requests" class="quickAction">Open prayer requests</a>
				<a href="/admin/information-requests" class="quickAction">Review info requests</a>
			</div>
		</section>
	</div>
</div>

<style>
	.dashboard {
		--panelBg: #ffffff;
		--panelAltBg: #f8f9fc;
		--panelBorder: #eceef5;
		--textPrimary: #14162b;
		--textSecondary: #49506a;
		--textMuted: #6f7692;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--cardHoverShadow: 0 14px 34px rgba(20, 22, 43, 0.14);
		--cardAccent: #14162b;
	}

	:global(.adminLayout[data-theme='dark']) .dashboard {
		--panelBg: #0f172a;
		--panelAltBg: #111c33;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--cardHoverShadow: 0 16px 38px rgba(2, 6, 23, 0.58);
		--cardAccent: #e2e8f0;
	}

	.pageHeader {
		margin-bottom: 1.5rem;
	}

	.pageHeader h1 {
		margin: 0;
		color: var(--textPrimary);
		font-size: clamp(1.4rem, 2.8vw, 2rem);
	}

	.pageHeader p {
		margin: 0.35rem 0 0;
		color: var(--textSecondary);
		font-size: 0.92rem;
	}

	.statsGrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 280px), 1fr));
		gap: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.contentGrid {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(min(100%, 340px), 1fr));
		gap: 1.2rem;
	}

	.panel {
		background: linear-gradient(180deg, var(--panelBg), var(--panelAltBg));
		border: 1px solid var(--panelBorder);
		border-radius: 0.9rem;
		padding: 1rem;
		box-shadow: var(--cardShadow);
	}

	.panelHeader {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 0.75rem;
		margin-bottom: 0.8rem;
	}

	.panelHeader h2 {
		margin: 0;
		font-size: 1rem;
		color: var(--textPrimary);
	}

	.panelHeader span {
		color: var(--textMuted);
		font-size: 0.75rem;
	}

	.metricList,
	.trendList,
	.activityList {
		list-style: none;
		padding: 0;
		margin: 0;
		display: grid;
		gap: 0.5rem;
	}

	.metricList li,
	.trendList li,
	.activityList li {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.6rem;
		padding: 0.55rem 0.6rem;
		border: 1px solid var(--panelBorder);
		border-radius: 0.6rem;
		background: color-mix(in oklch, var(--panelBg), var(--panelAltBg) 35%);
	}

	.metricLabel,
	.trendMeta,
	.activityMeta {
		color: var(--textMuted);
		font-size: 0.8rem;
		margin: 0;
	}

	.metricList strong,
	.trendTitle,
	.activityTitle {
		color: var(--textPrimary);
		font-size: 0.88rem;
		margin: 0;
	}

	.trendPill {
		display: inline-flex;
		align-items: center;
		padding: 0.2rem 0.5rem;
		border: 1px solid var(--panelBorder);
		border-radius: 999px;
		font-size: 0.72rem;
		color: var(--textSecondary);
		white-space: nowrap;
	}

	.actionGrid {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 0.6rem;
	}

	.quickAction {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.65rem 0.75rem;
		border: 1px solid var(--panelBorder);
		border-radius: 0.6rem;
		text-decoration: none;
		color: var(--textSecondary);
		font-size: 0.82rem;
		font-weight: 600;
		background: color-mix(in oklch, var(--panelBg), var(--panelAltBg) 35%);
	}

	.quickAction:hover,
	.viewLink:hover {
		border-color: color-mix(in oklch, var(--cardAccent), transparent 65%);
		color: var(--textPrimary);
	}

	.viewLink {
		padding: 0.2rem 0.45rem;
		font-size: 0.75rem;
		color: var(--textSecondary);
		border: 1px solid var(--panelBorder);
		border-radius: 999px;
		text-decoration: none;
		white-space: nowrap;
	}

	.emptyText {
		margin: 0;
		font-size: 0.85rem;
		color: var(--textMuted);
	}

	.statCard {
		background: linear-gradient(180deg, var(--panelBg), var(--panelAltBg));
		padding: 1.5rem;
		border-radius: 0.9rem;
		border: 1px solid var(--panelBorder);
		box-shadow: var(--cardShadow);
		text-decoration: none;
		color: inherit;
		display: grid;
		gap: 0.65rem;
		transition:
			box-shadow 0.2s,
			transform 0.2s,
			border-color 0.2s;
	}

	.statCard:hover {
		box-shadow: var(--cardHoverShadow);
		transform: translateY(-2px);
		border-color: color-mix(in oklch, var(--cardAccent), transparent 75%);
	}

	.statCard:focus-visible {
		outline: 2px solid color-mix(in oklch, var(--cardAccent), transparent 30%);
		outline-offset: 2px;
	}

	.cardTop {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.75rem;
	}

	.statCard h3 {
		margin: 0;
		font-size: 0.9rem;
		color: var(--textSecondary);
		font-weight: 600;
		text-transform: uppercase;
		letter-spacing: 0.025em;
	}

	.cardBadge {
		padding: 0.22rem 0.5rem;
		border-radius: 999px;
		font-size: 0.68rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		background: color-mix(in oklch, var(--cardAccent), transparent 86%);
		color: var(--textPrimary);
		border: 1px solid color-mix(in oklch, var(--cardAccent), transparent 76%);
	}

	.statNumber {
		margin: 0.5rem 0 0;
		font-size: 2.5rem;
		font-weight: 700;
		color: var(--textPrimary);
		line-height: 1;
	}

	.statDetail {
		margin: 0.25rem 0 0;
		font-size: 0.85rem;
		color: var(--textMuted);
	}

	@media (max-width: 640px) {
		.statsGrid {
			gap: 1rem;
		}

		.statCard {
			padding: 1.1rem;
		}

		.statNumber {
			font-size: 2rem;
		}

		.actionGrid {
			grid-template-columns: 1fr;
		}
	}
</style>
