<script>
	import { enhance } from '$app/forms';
	import { fly } from 'svelte/transition';

	let { data } = $props();
	let filter = $state('all');
	let datePreset = $state('showAll');
	let startDate = $state('');
	let endDate = $state('');

	const filtered = $derived(
		data.requests.filter((request) => {
			const scopeMatches =
				filter === 'all' ? true : filter === 'staff' ? request.isStaffOnly : !request.isStaffOnly;

			if (!scopeMatches) {
				return false;
			}

			const requestDate = new Date(request.submittedAt);
			const now = new Date();
			const rangeEnd = new Date(now);
			rangeEnd.setHours(23, 59, 59, 999);

			let rangeStart = null;

			if (datePreset === 'showAll') {
				return true;
			}

			if (datePreset === 'custom') {
				rangeStart = startDate ? new Date(`${startDate}T00:00:00`) : null;
				if (endDate) {
					rangeEnd.setTime(new Date(`${endDate}T23:59:59`).getTime());
				}
			} else {
				rangeStart = new Date(now);
				rangeStart.setHours(0, 0, 0, 0);

				if (datePreset === 'last7Days') {
					rangeStart.setDate(rangeStart.getDate() - 6);
				} else if (datePreset === 'last10Days') {
					rangeStart.setDate(rangeStart.getDate() - 9);
				} else if (datePreset === 'last2Weeks') {
					rangeStart.setDate(rangeStart.getDate() - 13);
				} else if (datePreset === 'lastMonth') {
					rangeStart.setMonth(rangeStart.getMonth() - 1);
				} else if (datePreset === 'last3Months') {
					rangeStart.setMonth(rangeStart.getMonth() - 3);
				} else if (datePreset === 'last6Months') {
					rangeStart.setMonth(rangeStart.getMonth() - 6);
				} else if (datePreset === 'pastYear') {
					rangeStart.setFullYear(rangeStart.getFullYear() - 1);
				}
			}

			const startMatches = rangeStart ? requestDate >= rangeStart : true;
			const endMatches = requestDate <= rangeEnd;

			return startMatches && endMatches;
		})
	);

	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="page">
	<div class="pageHeader">
		<h1>Prayer Requests</h1>
		<div class="filters">
			<button class="filterBtn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
				All ({data.requests.length})
			</button>
			<button
				class="filterBtn"
				class:active={filter === 'public'}
				onclick={() => (filter = 'public')}
			>
				Public ({data.requests.filter((r) => !r.isStaffOnly).length})
			</button>
			<button
				class="filterBtn"
				class:active={filter === 'staff'}
				onclick={() => (filter = 'staff')}
			>
				Staff Only ({data.requests.filter((r) => r.isStaffOnly).length})
			</button>
			<div class="dateRange">
				<label class="presetField">
					<span>Date Range</span>
					<select bind:value={datePreset}>
						<option value="showAll">Show All</option>
						<option value="last7Days">Last 7 Days</option>
						<option value="last10Days">Last 10 Days</option>
						<option value="last2Weeks">Last 2 Weeks</option>
						<option value="lastMonth">Last Month</option>
						<option value="last3Months">Last 3 Months</option>
						<option value="last6Months">Last 6 Months</option>
						<option value="pastYear">Last Year</option>
						<option value="custom">Custom</option>
					</select>
				</label>
				{#if datePreset === 'custom'}
					<div
						class="customRange"
						in:fly={{ x: 16, duration: 220 }}
						out:fly={{ x: 10, duration: 180 }}
					>
						<label class="dateField">
							<span>From</span>
							<input type="date" bind:value={startDate} max={endDate || undefined} />
						</label>
						<label class="dateField">
							<span>To</span>
							<input type="date" bind:value={endDate} min={startDate || undefined} />
						</label>
						<button
							class="clearDateBtn"
							type="button"
							onclick={() => {
								startDate = '';
								endDate = '';
							}}
							disabled={!startDate && !endDate}
						>
							Clear
						</button>
					</div>
				{/if}
			</div>
		</div>
	</div>

	{#if filtered.length === 0}
		<div class="emptyState">
			<p>No prayer requests found.</p>
		</div>
	{:else}
		<div class="requestsList">
			{#each filtered as request}
				<div class="requestCard">
					<div class="requestHeader">
						<div class="requestMeta">
							<span class="requestName">{request.name || 'Anonymous'}</span>
							{#if request.email}
								<a href="mailto:{request.email}" class="requestEmail">{request.email}</a>
							{/if}
							<span class="requestDate">{formatDate(request.submittedAt)}</span>
						</div>
						<div class="requestBadges">
							{#if request.isStaffOnly}
								<span class="badge staffOnly">Staff Only</span>
							{/if}
							{#if data.user?.role === 'admin'}
								<form
									method="POST"
									action="?/delete"
									use:enhance
									onsubmit={(e) => {
										if (!confirm('Delete this prayer request?')) e.preventDefault();
									}}
								>
									<input type="hidden" name="id" value={request.id} />
									<button type="submit" class="deleteBtn">Delete</button>
								</form>
							{/if}
						</div>
					</div>
					<p class="requestBody">{request.request}</p>
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.page {
		--panelBg: #ffffff;
		--panelAltBg: #f8f9fc;
		--panelBorder: #eceef5;
		--textPrimary: #14162b;
		--textSecondary: #49506a;
		--textMuted: #6f7692;
		--rowBorder: #f1f2f8;
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--chipBg: #ffffff;
		--chipBorder: #d8dbe8;
		--chipText: #49506a;
		--chipActiveBg: #14162b;
		--chipActiveText: #ffffff;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--cardShadowHover: 0 14px 34px rgba(20, 22, 43, 0.12);
		--staffBadgeBg: #ede9fe;
		--staffBadgeText: #5b21b6;
		--staffBadgeBorder: #c4b5fd;
		--deleteBg: #fee2e2;
		--deleteText: #991b1b;
		--deleteBorder: #fca5a5;
		--linkColor: #0369a1;
		--controlHeight: 2.2rem;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelAltBg: #111c33;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--rowBorder: #253149;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--chipBg: #17243e;
		--chipBorder: #334867;
		--chipText: #b6c2d8;
		--chipActiveBg: #e2e8f0;
		--chipActiveText: #0f172a;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--cardShadowHover: 0 16px 38px rgba(2, 6, 23, 0.58);
		--staffBadgeBg: rgba(139, 92, 246, 0.3);
		--staffBadgeText: #ede9fe;
		--staffBadgeBorder: rgba(196, 181, 253, 0.65);
		--deleteBg: rgba(239, 68, 68, 0.2);
		--deleteText: #fecaca;
		--deleteBorder: rgba(252, 165, 165, 0.45);
		--linkColor: #93c5fd;
	}

	.page h1 {
		margin: 0;
		color: var(--textPrimary);
		font-size: clamp(1.4rem, 2.8vw, 2rem);
	}

	.pageHeader {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: flex-end;
		justify-content: flex-end;
	}

	.dateRange {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.customRange {
		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
		flex-wrap: wrap;
	}

	.presetField {
		display: grid;
		gap: 0.3rem;
		align-items: end;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
		align-self: end;
	}

	.presetField span {
		line-height: 1.1;
	}

	.presetField select {
		padding: 0.45rem 0.55rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.55rem;
		background: var(--chipBg);
		color: var(--textPrimary);
		font: inherit;
		height: var(--controlHeight);
		box-sizing: border-box;
		min-width: 11.5rem;
	}

	.dateField {
		display: grid;
		gap: 0.3rem;
		align-items: end;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
		align-self: end;
	}

	.dateField span {
		line-height: 1.1;
	}

	.dateField input {
		padding: 0.45rem 0.55rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.55rem;
		background: var(--chipBg);
		color: var(--textPrimary);
		font: inherit;
		height: var(--controlHeight);
		box-sizing: border-box;
	}

	.clearDateBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.45rem 0.7rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.55rem;
		background: var(--chipBg);
		color: var(--chipText);
		font-size: 0.8rem;
		font-weight: 600;
		cursor: pointer;
		min-height: 2.2rem;
	}

	.clearDateBtn:disabled {
		opacity: 0.5;
		cursor: not-allowed;
	}

	.filterBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.5rem 1rem;
		border: 1px solid var(--chipBorder);
		border-radius: 999px;
		background: var(--chipBg);
		color: var(--chipText);
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		transition:
			background-color 0.2s,
			border-color 0.2s,
			color 0.2s,
			transform 0.2s;
		min-height: 2.2rem;
	}

	.filterBtn.active {
		background: var(--chipActiveBg);
		color: var(--chipActiveText);
		border-color: var(--chipActiveBg);
	}

	.filterBtn:hover {
		transform: translateY(-1px);
	}

	.requestsList {
		display: grid;
		gap: 1rem;
	}

	.requestCard {
		background: linear-gradient(180deg, var(--panelBg), var(--panelAltBg));
		padding: 1.25rem;
		border-radius: 0.9rem;
		border: 1px solid var(--panelBorder);
		box-shadow: var(--cardShadow);
		transition:
			transform 0.2s,
			box-shadow 0.2s,
			border-color 0.2s;
	}

	.requestCard:hover {
		transform: translateY(-2px);
		box-shadow: var(--cardShadowHover);
	}

	.requestHeader {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		margin-bottom: 0.75rem;
		gap: 1rem;
	}

	.requestMeta {
		display: flex;
		align-items: center;
		gap: 0.75rem;
		flex-wrap: wrap;
	}

	.requestName {
		font-weight: 600;
		color: var(--textPrimary);
	}

	.requestEmail {
		color: var(--linkColor);
		text-decoration: none;
		font-size: 0.85rem;
	}

	.requestEmail:hover {
		text-decoration: underline;
	}

	.requestDate {
		color: var(--textMuted);
		font-size: 0.85rem;
	}

	.requestBadges {
		display: flex;
		align-items: center;
		gap: 0.5rem;
	}

	.badge {
		display: inline-block;
		padding: 0.28rem 0.58rem;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.02em;
		border: 1px solid transparent;
	}

	.badge.staffOnly {
		background: var(--staffBadgeBg);
		color: var(--staffBadgeText);
		border-color: var(--staffBadgeBorder);
	}

	.requestBody {
		margin: 0;
		color: var(--textSecondary);
		line-height: 1.6;
		white-space: pre-wrap;
		padding-top: 0.25rem;
		border-top: 1px solid var(--rowBorder);
	}

	.deleteBtn {
		padding: 0.375rem 0.625rem;
		background: var(--deleteBg);
		color: var(--deleteText);
		border: 1px solid var(--deleteBorder);
		border-radius: 0.25rem;
		font-size: 0.8rem;
		cursor: pointer;
		font-weight: 600;
		transition:
			opacity 0.2s,
			transform 0.2s;
	}

	.deleteBtn:hover {
		opacity: 0.9;
		transform: translateY(-1px);
	}

	.emptyState {
		text-align: center;
		padding: 3rem;
		color: var(--textMuted);
		background: var(--panelBg);
		border-radius: 0.9rem;
		border: 1px solid var(--panelBorder);
	}

	@media (max-width: 760px) {
		.pageHeader {
			flex-direction: column;
			align-items: stretch;
		}

		.filters {
			display: flex;
			justify-content: center;
			width: 100%;
		}

		.dateRange {
			display: grid;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			align-items: stretch;
			justify-content: center;
			width: 100%;
		}

		.customRange {
			display: grid;
			grid-column: 1 / -1;
			grid-template-columns: repeat(2, minmax(0, 1fr));
			gap: 0.5rem;
		}

		.presetField {
			grid-column: 1 / -1;
			justify-items: stretch;
		}

		.presetField select {
			min-width: 0;
			width: 100%;
		}

		.customRange .clearDateBtn {
			grid-column: 1 / -1;
		}

		.filterBtn {
			min-height: 2.65rem;
			padding: 0.45rem 0.3rem;
			font-size: 0.78rem;
		}

		.requestHeader {
			flex-direction: column;
			align-items: stretch;
			gap: 0.8rem;
		}

		.requestBadges {
			justify-content: space-between;
		}
	}
</style>
