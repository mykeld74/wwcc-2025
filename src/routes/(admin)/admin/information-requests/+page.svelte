<script lang="ts">
	import { enhance } from '$app/forms';

	let { data, form } = $props();
	let statusFilter = $state('pending');
	let typeFilter = $state('all');

	const filtered = $derived(
		data.requests.filter((request) => {
			const statusMatches =
				statusFilter === 'all'
					? true
					: statusFilter === 'pending'
						? !request.addressed
						: request.addressed;
			const typeMatches =
				typeFilter === 'all' ? true : request.requestTypeLabel === typeFilter;
			return statusMatches && typeMatches;
		})
	);

	const typeOptions = $derived(
		[...new Set(data.requests.map((request) => request.requestTypeLabel))].sort()
	);

	function formatDate(date: string | Date) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}
</script>

<div class="page">
	<div class="pageHeader">
		<h1>Information Requests</h1>
		<div class="filters">
			<button
				class="filterBtn"
				class:active={statusFilter === 'pending'}
				onclick={() => (statusFilter = 'pending')}
			>
				Pending ({data.requests.filter((r) => !r.addressed).length})
			</button>
			<button
				class="filterBtn"
				class:active={statusFilter === 'addressed'}
				onclick={() => (statusFilter = 'addressed')}
			>
				Addressed ({data.requests.filter((r) => r.addressed).length})
			</button>
			<button
				class="filterBtn"
				class:active={statusFilter === 'all'}
				onclick={() => (statusFilter = 'all')}
			>
				All ({data.requests.length})
			</button>
			<label class="typeFilter">
				<span>Type</span>
				<select bind:value={typeFilter}>
					<option value="all">All types</option>
					{#each typeOptions as typeLabel}
						<option value={typeLabel}>{typeLabel}</option>
					{/each}
				</select>
			</label>
		</div>
	</div>

	<section class="typesPanel">
		<div class="panelHeader">
			<h2>Manage Types</h2>
			<p>These options appear in the public information request combobox.</p>
		</div>

		{#if form?.typeError}
			<p class="inlineError">{form.typeError}</p>
		{/if}

		<form method="POST" action="?/addType" class="addTypeForm" use:enhance>
			<input type="text" name="label" placeholder="New type label" required />
			<button type="submit" class="primaryBtn">Add Type</button>
		</form>

		<ul class="typesList">
			{#each data.types as type (type.id)}
				<li class="typeRow" class:inactive={!type.isActive}>
					<form method="POST" action="?/updateType" class="typeEditForm" use:enhance>
						<input type="hidden" name="id" value={type.id} />
						<input type="text" name="label" value={type.label} required />
						<button type="submit" class="chipBtn">Save</button>
					</form>
					<div class="typeActions">
						<form method="POST" action="?/moveType" use:enhance>
							<input type="hidden" name="id" value={type.id} />
							<input type="hidden" name="direction" value="up" />
							<button type="submit" class="chipBtn" aria-label="Move up">↑</button>
						</form>
						<form method="POST" action="?/moveType" use:enhance>
							<input type="hidden" name="id" value={type.id} />
							<input type="hidden" name="direction" value="down" />
							<button type="submit" class="chipBtn" aria-label="Move down">↓</button>
						</form>
						<form method="POST" action="?/toggleTypeActive" use:enhance>
							<input type="hidden" name="id" value={type.id} />
							<input type="hidden" name="isActive" value={String(!type.isActive)} />
							<button type="submit" class="chipBtn">
								{type.isActive ? 'Deactivate' : 'Activate'}
							</button>
						</form>
					</div>
				</li>
			{/each}
		</ul>
	</section>

	{#if filtered.length === 0}
		<div class="emptyState">
			<p>No information requests found.</p>
		</div>
	{:else}
		<div class="requestsList">
			{#each filtered as request (request.id)}
				<div class="requestCard">
					<div class="requestHeader">
						<div class="requestMeta">
							<span class="requestName">{request.name}</span>
							<a href="mailto:{request.email}" class="requestEmail">{request.email}</a>
							{#if request.phone}
								<a href="tel:{request.phone}" class="requestEmail">{request.phone}</a>
							{/if}
							<span class="requestDate">{formatDate(request.submittedAt)}</span>
						</div>
						<div class="requestBadges">
							<span class="badge type">{request.requestTypeLabel}</span>
							<span class="badge" class:addressed={request.addressed}>
								{request.addressed ? 'Addressed' : 'Pending'}
							</span>
						</div>
					</div>
					<p class="requestBody">{request.message}</p>
					<div class="cardActions">
						{#if request.addressed}
							<form method="POST" action="?/markPending" use:enhance>
								<input type="hidden" name="id" value={request.id} />
								<button type="submit" class="chipBtn">Mark Pending</button>
							</form>
						{:else}
							<form method="POST" action="?/markAddressed" use:enhance>
								<input type="hidden" name="id" value={request.id} />
								<button type="submit" class="primaryBtn">Mark Addressed</button>
							</form>
						{/if}
						{#if data.user?.role === 'admin'}
							<form
								method="POST"
								action="?/delete"
								use:enhance
								onsubmit={(e) => {
									if (!confirm('Delete this information request?')) e.preventDefault();
								}}
							>
								<input type="hidden" name="id" value={request.id} />
								<button type="submit" class="deleteBtn">Delete</button>
							</form>
						{/if}
					</div>
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
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--chipBg: #ffffff;
		--chipBorder: #d8dbe8;
		--chipText: #49506a;
		--chipActiveBg: #14162b;
		--chipActiveText: #ffffff;
		--cardShadow: 0 10px 26px rgba(20, 22, 43, 0.07);
		--addressedBadgeBg: #dcfce7;
		--addressedBadgeText: #166534;
		--addressedBadgeBorder: #86efac;
		--pendingBadgeBg: #fef3c7;
		--pendingBadgeText: #92400e;
		--pendingBadgeBorder: #fcd34d;
		--typeBadgeBg: #e0f2fe;
		--typeBadgeText: #075985;
		--typeBadgeBorder: #7dd3fc;
		--deleteBg: #fee2e2;
		--deleteText: #991b1b;
		--deleteBorder: #fca5a5;
		--linkColor: #0369a1;
		--errorColor: #b91c1c;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelAltBg: #111c33;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--chipBg: #17243e;
		--chipBorder: #334867;
		--chipText: #b6c2d8;
		--chipActiveBg: #e2e8f0;
		--chipActiveText: #0f172a;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--addressedBadgeBg: rgba(34, 197, 94, 0.34);
		--addressedBadgeText: #dcfce7;
		--addressedBadgeBorder: rgba(134, 239, 172, 0.72);
		--pendingBadgeBg: rgba(245, 158, 11, 0.28);
		--pendingBadgeText: #fde68a;
		--pendingBadgeBorder: rgba(252, 211, 77, 0.55);
		--typeBadgeBg: rgba(14, 165, 233, 0.28);
		--typeBadgeText: #bae6fd;
		--typeBadgeBorder: rgba(125, 211, 252, 0.55);
		--deleteBg: rgba(239, 68, 68, 0.2);
		--deleteText: #fecaca;
		--deleteBorder: rgba(252, 165, 165, 0.45);
		--linkColor: #93c5fd;
		--errorColor: #fca5a5;
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
	}

	.filterBtn,
	.chipBtn,
	.primaryBtn,
	.deleteBtn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		border-radius: 999px;
		font-size: 0.85rem;
		font-weight: 600;
		cursor: pointer;
		min-height: 2.2rem;
		border: 1px solid var(--chipBorder);
		background: var(--chipBg);
		color: var(--chipText);
		padding: 0.45rem 0.9rem;
		font: inherit;
	}

	.filterBtn.active,
	.primaryBtn {
		background: var(--chipActiveBg);
		color: var(--chipActiveText);
		border-color: var(--chipActiveBg);
	}

	.deleteBtn {
		background: var(--deleteBg);
		color: var(--deleteText);
		border-color: var(--deleteBorder);
	}

	.typeFilter {
		display: grid;
		gap: 0.3rem;
		font-size: 0.75rem;
		font-weight: 600;
		color: var(--textMuted);
	}

	.typeFilter select,
	.addTypeForm input,
	.typeEditForm input {
		padding: 0.45rem 0.55rem;
		border: 1px solid var(--chipBorder);
		border-radius: 0.55rem;
		background: var(--chipBg);
		color: var(--textPrimary);
		font: inherit;
		min-height: 2.2rem;
		box-sizing: border-box;
	}

	.typesPanel {
		background: var(--panelBg);
		border: 1px solid var(--panelBorder);
		border-radius: 1rem;
		padding: 1.25rem;
		margin-bottom: 1.5rem;
		box-shadow: var(--cardShadow);
	}

	.panelHeader h2 {
		margin: 0 0 0.25rem;
		color: var(--textPrimary);
		font-size: 1.15rem;
	}

	.panelHeader p {
		margin: 0 0 1rem;
		color: var(--textMuted);
		font-size: 0.9rem;
	}

	.inlineError {
		color: var(--errorColor);
		margin: 0 0 0.75rem;
	}

	.addTypeForm {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.75rem;
		margin-bottom: 1rem;
	}

	.typesList {
		list-style: none;
		margin: 0;
		padding: 0;
		display: grid;
		gap: 0.75rem;
	}

	.typeRow {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.75rem;
		align-items: center;
		padding: 0.75rem;
		border-radius: 0.75rem;
		background: var(--panelAltBg);
		border: 1px solid var(--panelBorder);
	}

	.typeRow.inactive {
		opacity: 0.65;
	}

	.typeEditForm {
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 0.5rem;
		min-width: 0;
	}

	.typeActions {
		display: flex;
		gap: 0.35rem;
		flex-wrap: wrap;
	}

	.emptyState {
		padding: 2rem;
		text-align: center;
		color: var(--textMuted);
		background: var(--panelBg);
		border: 1px dashed var(--panelBorder);
		border-radius: 1rem;
	}

	.requestsList {
		display: grid;
		gap: 1rem;
	}

	.requestCard {
		background: var(--panelBg);
		border: 1px solid var(--panelBorder);
		border-radius: 1rem;
		padding: 1.25rem;
		box-shadow: var(--cardShadow);
	}

	.requestHeader {
		display: flex;
		justify-content: space-between;
		gap: 1rem;
		flex-wrap: wrap;
		margin-bottom: 0.75rem;
	}

	.requestMeta {
		display: grid;
		gap: 0.25rem;
	}

	.requestName {
		font-weight: 700;
		color: var(--textPrimary);
	}

	.requestEmail {
		color: var(--linkColor);
		text-decoration: none;
		font-size: 0.95rem;
	}

	.requestDate {
		color: var(--textMuted);
		font-size: 0.85rem;
	}

	.requestBadges,
	.cardActions {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		align-items: center;
	}

	.badge {
		display: inline-flex;
		align-items: center;
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		font-size: 0.75rem;
		font-weight: 700;
		border: 1px solid var(--pendingBadgeBorder);
		background: var(--pendingBadgeBg);
		color: var(--pendingBadgeText);
	}

	.badge.addressed {
		border-color: var(--addressedBadgeBorder);
		background: var(--addressedBadgeBg);
		color: var(--addressedBadgeText);
	}

	.badge.type {
		border-color: var(--typeBadgeBorder);
		background: var(--typeBadgeBg);
		color: var(--typeBadgeText);
	}

	.requestBody {
		margin: 0 0 1rem;
		color: var(--textSecondary);
		line-height: 1.5;
		white-space: pre-wrap;
	}

	@media (max-width: 720px) {
		.addTypeForm,
		.typeRow,
		.typeEditForm {
			grid-template-columns: 1fr;
		}
	}
</style>
