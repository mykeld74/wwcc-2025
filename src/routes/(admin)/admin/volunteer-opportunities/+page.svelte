<script>
	import { deserialize, enhance } from '$app/forms';
	import { crossfade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { cubicInOut } from 'svelte/easing';
	import VolunteerOpportunityCard from './VolunteerOpportunityCard.svelte';

	let { data } = $props();
	let filter = $state('all');
	let showAll = $state(Boolean(data.showAll));
	let viewMode = $state('cards');
	let sortBy = $state('date');
	let opportunities = $state(data.opportunities);

	$effect(() => {
		opportunities = data.opportunities;
	});

	const filtered = $derived(
		filter === 'all'
			? opportunities
			: filter === 'pending'
				? opportunities.filter((o) => !o.addressed)
				: opportunities.filter((o) => o.addressed)
	);
	const sorted = $derived(
		[...filtered].sort((a, b) => {
			if (sortBy === 'name') {
				return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
			}
			if (sortBy === 'department') {
				return a.department.localeCompare(b.department, undefined, { sensitivity: 'base' });
			}
			if (sortBy === 'date') {
				return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
			}
			return 0;
		})
	);
	const pendingCards = $derived(sorted.filter((o) => !o.addressed));
	const addressedCards = $derived(sorted.filter((o) => o.addressed));

	const [send, receive] = crossfade({
		duration: 400,
		easing: cubicInOut,
		fallback(node) {
			const style = getComputedStyle(node);
			const opacity = +style.opacity;
			return {
				duration: 300,
				easing: cubicInOut,
				css: (t) => `opacity: ${t * opacity}`
			};
		}
	});

	let draggingId = $state(null);
	let dropTarget = $state(null);

	function handleDragStart(e, id) {
		draggingId = id;
		e.dataTransfer.effectAllowed = 'move';
		e.dataTransfer.setData('text/plain', String(id));
	}

	function handleDragEnd() {
		draggingId = null;
		dropTarget = null;
	}

	function handleDragOver(e, section) {
		e.preventDefault();
		e.dataTransfer.dropEffect = 'move';
		dropTarget = section;
	}

	function handleDragLeave(e, sectionEl) {
		if (!sectionEl.contains(e.relatedTarget)) {
			dropTarget = null;
		}
	}

	async function handleDrop(e, targetSection) {
		e.preventDefault();
		dropTarget = null;
		const id = Number(e.dataTransfer.getData('text/plain'));
		draggingId = null;
		if (!id) return;

		const card = opportunities.find((o) => o.id === id);
		if (!card) return;

		const shouldAddress = targetSection === 'addressed' && !card.addressed;
		const shouldReopen = targetSection === 'pending' && card.addressed;
		if (!shouldAddress && !shouldReopen) return;

		const previous = opportunities;
		opportunities = opportunities.map((o) =>
			o.id === id ? { ...o, addressed: shouldAddress } : o
		);

		const action = shouldAddress ? 'markAddressed' : 'markPending';
		const body = new URLSearchParams();
		body.set('id', String(id));

		try {
			const response = await fetch(`?/${action}`, {
				method: 'POST',
				headers: {
					accept: 'application/json',
					'x-sveltekit-action': 'true',
					'content-type': 'application/x-www-form-urlencoded'
				},
				body: body.toString()
			});
			const result = deserialize(await response.text());
			if (result.type !== 'success') {
				opportunities = previous;
			}
		} catch {
			opportunities = previous;
		}
	}

	function formatDate(date) {
		return new Date(date).toLocaleDateString('en-US', {
			month: 'short',
			day: 'numeric',
			year: 'numeric'
		});
	}

	function updateScope() {
		const params = new URLSearchParams(window.location.search);
		if (showAll) {
			params.set('showAll', '1');
		} else {
			params.delete('showAll');
		}

		const query = params.toString();
		window.location.href = query
			? `${window.location.pathname}?${query}`
			: window.location.pathname;
	}

	function statusEnhance({ action, submitter, formData }) {
		const targetId = Number(formData.get('id'));
		const actionTarget = submitter?.formAction ?? action.toString();
		const movedToAddressed = actionTarget.includes('/markAddressed');
		const movedToPending = actionTarget.includes('/markPending');
		const hasStatusChange = movedToAddressed || movedToPending;
		const nextAddressed = movedToAddressed ? true : movedToPending ? false : null;

		if (!targetId || !hasStatusChange || nextAddressed === null) return;

		const previous = opportunities;

		opportunities = opportunities.map((opportunity) =>
			opportunity.id === targetId
				? {
						...opportunity,
						addressed: nextAddressed
					}
				: opportunity
		);

		return async ({ result }) => {
			if (result.type === 'failure' || result.type === 'error') {
				opportunities = previous;
			}
		};
	}
</script>

<div class="page">
	<div class="pageHeader">
		<div>
			<h1>Volunteer Opportunities</h1>
			<p class="scopeDescription">
				{#if data.showAll}
					Showing all submissions for admin review.
				{:else}
					Showing submissions sent to <strong>{data.infoInbox}</strong> and
					<strong>{data.userEmail || 'your inbox'}</strong>.
				{/if}
			</p>
		</div>
		<div class="headerControls">
			<div class="topToggles">
				<label class="scopeToggle">
					<input type="checkbox" bind:checked={showAll} onchange={updateScope} />
					<span>Show all</span>
				</label>
				<div class="viewToggle" role="group" aria-label="Choose view mode">
					<button
						class="toggleBtn"
						class:active={viewMode === 'cards'}
						onclick={() => (viewMode = 'cards')}
					>
						Cards
					</button>
					<button
						class="toggleBtn"
						class:active={viewMode === 'list'}
						onclick={() => (viewMode = 'list')}
					>
						List
					</button>
				</div>
			</div>
			<div class="filters">
				<button class="filterBtn" class:active={filter === 'all'} onclick={() => (filter = 'all')}>
					All ({opportunities.length})
				</button>
				<button
					class="filterBtn"
					class:active={filter === 'pending'}
					onclick={() => (filter = 'pending')}
				>
					Pending ({opportunities.filter((o) => !o.addressed).length})
				</button>
				<button
					class="filterBtn"
					class:active={filter === 'addressed'}
					onclick={() => (filter = 'addressed')}
				>
					Addressed ({opportunities.filter((o) => o.addressed).length})
				</button>
			</div>
			<div class="sortControls" role="group" aria-label="Sort volunteer opportunities">
				<span class="sortLabel">Sort</span>
				<button class="sortBtn" class:active={sortBy === 'date'} onclick={() => (sortBy = 'date')}>
					Date
				</button>
				<button class="sortBtn" class:active={sortBy === 'name'} onclick={() => (sortBy = 'name')}>
					Name
				</button>
				<button
					class="sortBtn"
					class:active={sortBy === 'department'}
					onclick={() => (sortBy = 'department')}
				>
					Department
				</button>
			</div>
		</div>
	</div>

	{#if sorted.length === 0}
		<div class="emptyState">
			<p>No volunteer requests found.</p>
		</div>
	{:else if viewMode === 'cards'}
		<div class="cardSections">
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<section
				class="cardSection dropZone"
				class:dropOver={dropTarget === 'pending' && draggingId !== null}
				ondragover={(e) => handleDragOver(e, 'pending')}
				ondragleave={(e) => handleDragLeave(e, e.currentTarget)}
				ondrop={(e) => handleDrop(e, 'pending')}
			>
				<header class="sectionHeader">
					<h2>Pending</h2>
					<p>{pendingCards.length}</p>
				</header>
				<div class="cardGrid">
					{#if pendingCards.length === 0}
						<p class="sectionEmpty">
							{draggingId !== null ? 'Drop here to reopen' : 'No pending requests.'}
						</p>
					{:else}
						{#each pendingCards as opportunity (opportunity.id)}
							<div
								class="cardWrapper"
								class:dragging={draggingId === opportunity.id}
								draggable="true"
								ondragstart={(e) => handleDragStart(e, opportunity.id)}
								ondragend={handleDragEnd}
								in:receive={{ key: opportunity.id }}
								out:send={{ key: opportunity.id }}
								animate:flip={{ duration: 400, easing: cubicInOut }}
							>
								<VolunteerOpportunityCard
									{opportunity}
									isAdmin={data.user?.role === 'admin'}
									{formatDate}
									{statusEnhance}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</section>
			<!-- svelte-ignore a11y_no_static_element_interactions -->
			<section
				class="cardSection dropZone"
				class:dropOver={dropTarget === 'addressed' && draggingId !== null}
				ondragover={(e) => handleDragOver(e, 'addressed')}
				ondragleave={(e) => handleDragLeave(e, e.currentTarget)}
				ondrop={(e) => handleDrop(e, 'addressed')}
			>
				<header class="sectionHeader">
					<h2>Addressed</h2>
					<p>{addressedCards.length}</p>
				</header>
				<div class="cardGrid addressedGrid">
					{#if addressedCards.length === 0}
						<p class="sectionEmpty">
							{draggingId !== null ? 'Drop here to mark addressed' : 'No addressed requests yet.'}
						</p>
					{:else}
						{#each addressedCards as opportunity (opportunity.id)}
							<div
								class="cardWrapper"
								class:dragging={draggingId === opportunity.id}
								draggable="true"
								ondragstart={(e) => handleDragStart(e, opportunity.id)}
								ondragend={handleDragEnd}
								in:receive={{ key: opportunity.id }}
								out:send={{ key: opportunity.id }}
								animate:flip={{ duration: 400, easing: cubicInOut }}
							>
								<VolunteerOpportunityCard
									{opportunity}
									compact={true}
									isAdmin={data.user?.role === 'admin'}
									{formatDate}
									{statusEnhance}
								/>
							</div>
						{/each}
					{/if}
				</div>
			</section>
		</div>
	{:else}
		<div class="tableWrapper">
			<table>
				<thead>
					<tr>
						<th>Status</th>
						<th>Name</th>
						<th>Email</th>
						<th>Phone</th>
						<th>Department</th>
						<th>Sent To</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each sorted as opportunity}
						<tr>
							<td>
								<span class="badge" class:addressed={opportunity.addressed}>
									{opportunity.addressed ? 'Addressed' : 'Pending'}
								</span>
							</td>
							<td class="nameCell">{opportunity.name}</td>
							<td><a href="mailto:{opportunity.email}">{opportunity.email}</a></td>
							<td>{opportunity.phone || '—'}</td>
							<td>{opportunity.department}</td>
							<td>{opportunity.sendTo}</td>
							<td class="dateCell">{formatDate(opportunity.submittedAt)}</td>
							<td class="actionsCell">
								{#if opportunity.addressed}
									<form method="POST" action="?/markPending" use:enhance={statusEnhance}>
										<input type="hidden" name="id" value={opportunity.id} />
										<button type="submit" class="actionBtn reopen">Reopen</button>
									</form>
								{:else}
									<form method="POST" action="?/markAddressed" use:enhance={statusEnhance}>
										<input type="hidden" name="id" value={opportunity.id} />
										<button type="submit" class="actionBtn address">Mark Addressed</button>
									</form>
								{/if}
								{#if data.user?.role === 'admin'}
									<form
										method="POST"
										action="?/delete"
										use:enhance
										onsubmit={(e) => {
											if (!confirm('Delete this entry?')) e.preventDefault();
										}}
									>
										<input type="hidden" name="id" value={opportunity.id} />
										<button type="submit" class="actionBtn delete">Delete</button>
									</form>
								{/if}
							</td>
						</tr>
						{#if opportunity.message}
							<tr class="messageRow">
								<td colspan="8">
									<strong>Message:</strong>
									{opportunity.message}
								</td>
							</tr>
						{/if}
					{/each}
				</tbody>
			</table>
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
		--inputBg: #ffffff;
		--inputBorder: #d8dbe8;
		--toggleTrack: #eef0f7;
		--buttonPrimary: #14162b;
		--buttonPrimaryText: #ffffff;
		--statusPendingBg: #fff2cf;
		--statusPendingText: #815400;
		--statusAddressedBg: #d6f8eb;
		--statusAddressedText: #005b3f;
		--dangerBg: #fff0f0;
		--dangerText: #c51f1f;
		--cardShadow: 0 10px 28px rgba(20, 22, 43, 0.07);
		--cardHoverShadow: 0 14px 34px rgba(20, 22, 43, 0.11);
		--cardHoverBorderAccent: var(--buttonPrimary);
		--cardSurfaceTop: #ffffff;
		--cardSurfaceBottom: #f4f7ff;
		--cardEdge: rgba(148, 163, 184, 0.34);
		--cardText: #0f172a;
		--cardSubtext: #334155;
		--cardMuted: #64748b;
		--cardInset: rgba(241, 245, 249, 0.9);
		--cardInsetEdge: rgba(148, 163, 184, 0.34);
		--cardGlow: rgba(14, 165, 233, 0.18);
		--cardGlowSecondary: rgba(34, 197, 94, 0.12);
		--cardPendingGlow: rgba(14, 165, 233, 0.2);
		--cardAddressedGlow: rgba(34, 197, 94, 0.18);
		--cardPendingStripStart: #38bdf8;
		--cardPendingStripEnd: #0ea5e9;
		--cardAddressedStripStart: #4ade80;
		--cardAddressedStripEnd: #22c55e;
		--pendingBadgeBg: #e0f2fe;
		--pendingBadgeText: #075985;
		--pendingBadgeBorder: #7dd3fc;
		--addressedBadgeBg: #dcfce7;
		--addressedBadgeText: #166534;
		--addressedBadgeBorder: #86efac;
		--btnAddressBg: #dcfce7;
		--btnAddressText: #166534;
		--btnAddressBorder: #86efac;
		--btnReopenBg: #e0f2fe;
		--btnReopenText: #075985;
		--btnReopenBorder: #7dd3fc;
		--btnDeleteBg: #fee2e2;
		--btnDeleteText: #991b1b;
		--btnDeleteBorder: #fca5a5;
		--btnShadow: 0 6px 14px rgba(15, 23, 42, 0.12);
		--cardLink: #0369a1;
	}

	:global(.adminLayout[data-theme='dark']) .page {
		--panelBg: #0f172a;
		--panelAltBg: #111c33;
		--panelBorder: #26324a;
		--textPrimary: #e2e8f0;
		--textSecondary: #b6c2d8;
		--textMuted: #94a3b8;
		--rowBorder: #253149;
		--inputBg: #17243e;
		--inputBorder: #334867;
		--toggleTrack: #1f2d4a;
		--buttonPrimary: #e2e8f0;
		--buttonPrimaryText: #0f172a;
		--statusPendingBg: #2b3566;
		--statusPendingText: #dbe6ff;
		--statusAddressedBg: #0e4d3b;
		--statusAddressedText: #b6ffe4;
		--dangerBg: #5a1e1e;
		--dangerText: #ffd2d2;
		--cardShadow: 0 10px 30px rgba(2, 6, 23, 0.45);
		--cardHoverShadow: 0 16px 38px rgba(2, 6, 23, 0.58);
		--cardHoverBorderAccent: #93c5fd;
		--cardSurfaceTop: #1c2442;
		--cardSurfaceBottom: #0d1324;
		--cardEdge: rgba(148, 163, 184, 0.28);
		--cardText: #f8fafc;
		--cardSubtext: #cbd5e1;
		--cardMuted: #94a3b8;
		--cardInset: rgba(15, 23, 42, 0.5);
		--cardInsetEdge: rgba(148, 163, 184, 0.26);
		--cardGlow: rgba(0, 224, 255, 0.22);
		--cardGlowSecondary: rgba(34, 197, 94, 0.15);
		--cardPendingGlow: rgba(56, 189, 248, 0.3);
		--cardAddressedGlow: rgba(74, 222, 128, 0.26);
		--cardPendingStripStart: #38bdf8;
		--cardPendingStripEnd: #0ea5e9;
		--cardAddressedStripStart: #4ade80;
		--cardAddressedStripEnd: #22c55e;
		--pendingBadgeBg: rgba(14, 165, 233, 0.34);
		--pendingBadgeText: #e0f2fe;
		--pendingBadgeBorder: rgba(125, 211, 252, 0.72);
		--addressedBadgeBg: rgba(34, 197, 94, 0.34);
		--addressedBadgeText: #dcfce7;
		--addressedBadgeBorder: rgba(134, 239, 172, 0.72);
		--btnAddressBg: rgba(34, 197, 94, 0.2);
		--btnAddressText: #bbf7d0;
		--btnAddressBorder: rgba(134, 239, 172, 0.38);
		--btnReopenBg: rgba(6, 182, 212, 0.18);
		--btnReopenText: #bae6fd;
		--btnReopenBorder: rgba(125, 211, 252, 0.38);
		--btnDeleteBg: rgba(239, 68, 68, 0.18);
		--btnDeleteText: #fecaca;
		--btnDeleteBorder: rgba(252, 165, 165, 0.35);
		--btnShadow: 0 8px 16px rgba(2, 6, 23, 0.28);
		--cardLink: #93c5fd;
	}

	.page h1 {
		margin: 0;
		color: var(--textPrimary);
		font-size: clamp(1.4rem, 2.8vw, 2rem);
	}

	.pageHeader {
		display: flex;
		justify-content: space-between;
		align-items: center;
		margin-bottom: 1.5rem;
		flex-wrap: wrap;
		gap: 1rem;
	}

	.scopeDescription {
		margin: 0.35rem 0 0;
		font-size: 0.9rem;
		color: var(--textSecondary);
	}

	.headerControls {
		display: grid;
		gap: 0.75rem;
		justify-items: end;
	}

	.topToggles {
		display: flex;
		gap: 0.6rem;
		align-items: center;
		flex-wrap: wrap;
	}

	.scopeToggle {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		font-size: 0.85rem;
		background: var(--inputBg);
		border: 1px solid var(--inputBorder);
		border-radius: 999px;
		padding: 0.35rem 0.75rem;
	}

	.scopeToggle input {
		accent-color: var(--buttonPrimary);
	}

	.viewToggle {
		display: inline-flex;
		background: var(--toggleTrack);
		border-radius: 999px;
		padding: 0.2rem;
		gap: 0.2rem;
	}

	.toggleBtn {
		border: none;
		border-radius: 999px;
		background: transparent;
		padding: 0.4rem 0.85rem;
		font-size: 0.82rem;
		cursor: pointer;
		color: var(--textSecondary);
	}

	.toggleBtn.active {
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
	}

	.filters {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.sortControls {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		flex-wrap: wrap;
		justify-content: flex-end;
	}

	.sortLabel {
		font-size: 0.8rem;
		font-weight: 700;
		color: var(--textMuted);
		text-transform: uppercase;
		letter-spacing: 0.04em;
	}

	.sortBtn {
		padding: 0.38rem 0.8rem;
		border: 1px solid var(--inputBorder);
		border-radius: 999px;
		background: var(--inputBg);
		font-size: 0.82rem;
		cursor: pointer;
		color: var(--textSecondary);
		transition: all 0.2s;
	}

	.sortBtn.active {
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
		border-color: var(--buttonPrimary);
	}

	.filterBtn {
		padding: 0.5rem 1rem;
		border: 1px solid var(--inputBorder);
		border-radius: 999px;
		background: var(--inputBg);
		font-size: 0.85rem;
		cursor: pointer;
		transition: all 0.2s;
		color: var(--textSecondary);
	}

	.filterBtn.active {
		background: var(--buttonPrimary);
		color: var(--buttonPrimaryText);
		border-color: var(--buttonPrimary);
	}

	.tableWrapper {
		background: var(--panelBg);
		border-radius: 0.9rem;
		border: 1px solid var(--panelBorder);
		box-shadow: 0 8px 24px rgba(20, 22, 43, 0.06);
		overflow-x: auto;
	}

	.cardGrid {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 310px), 1fr));
		grid-auto-flow: row;
		grid-auto-rows: 1fr;
		gap: 1.1rem;
		align-items: stretch;
		max-width: 1600px;
		width: 100%;
		min-width: 0;
	}

	.cardWrapper {
		height: 100%;
		min-width: 0;
		cursor: grab;
	}

	.cardWrapper:active {
		cursor: grabbing;
	}

	.cardWrapper.dragging {
		opacity: 0.4;
	}

	.cardSections {
		display: grid;
		gap: 1.3rem;
	}

	.cardSection {
		display: grid;
		gap: 0.8rem;
	}

	.dropZone {
		border-radius: 1rem;
		border: 2px dashed transparent;
		padding: 0.5rem;
		transition:
			border-color 0.2s,
			background-color 0.2s;
	}

	.dropZone.dropOver {
		border-color: var(--buttonPrimary);
		background-color: color-mix(in oklch, var(--buttonPrimary), transparent 92%);
	}

	.sectionHeader {
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		padding-bottom: 0.25rem;
		border-bottom: 1px solid var(--rowBorder);
	}

	.sectionHeader h2 {
		margin: 0;
		font-size: 1rem;
		color: var(--textPrimary);
	}

	.sectionHeader p {
		margin: 0;
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--textMuted);
	}

	.sectionEmpty {
		margin: 0;
		font-size: 0.9rem;
		color: var(--textMuted);
		grid-column: 1 / -1;
		min-height: 5rem;
		display: grid;
		place-items: center;
		text-align: center;
		border: 1px dashed var(--rowBorder);
		border-radius: 0.75rem;
		background: color-mix(in oklch, var(--panelAltBg), transparent 30%);
	}

	.addressedGrid {
		grid-template-columns: repeat(auto-fill, minmax(min(100%, 270px), 1fr));
	}

	@media (max-width: 520px) {
		.cardGrid,
		.addressedGrid {
			grid-template-columns: 1fr;
			grid-auto-rows: auto;
		}

		.dropZone {
			padding: 0.35rem;
			min-width: 0;
		}
	}

	table {
		width: 100%;
		border-collapse: collapse;
		font-size: 0.9rem;
	}

	th {
		text-align: left;
		padding: 0.75rem 1rem;
		background: var(--panelAltBg);
		font-weight: 600;
		color: var(--textSecondary);
		font-size: 0.8rem;
		text-transform: uppercase;
		letter-spacing: 0.025em;
		border-bottom: 1px solid var(--panelBorder);
	}

	td {
		padding: 0.75rem 1rem;
		border-bottom: 1px solid var(--rowBorder);
		color: var(--textPrimary);
	}

	td a {
		color: #3b82f6;
		text-decoration: none;
	}

	:global(.adminLayout[data-theme='dark']) td a {
		color: #93c5fd;
	}

	td a:hover {
		text-decoration: underline;
	}

	.nameCell {
		font-weight: 600;
	}

	.dateCell {
		white-space: nowrap;
	}

	.badge {
		display: inline-block;
		padding: 0.26rem 0.56rem;
		border-radius: 9999px;
		font-size: 0.72rem;
		font-weight: 700;
		letter-spacing: 0.03em;
		text-transform: uppercase;
		background: var(--pendingBadgeBg);
		color: var(--pendingBadgeText);
		border: 1px solid var(--pendingBadgeBorder);
		box-shadow: 0 0 0 1px rgba(2, 6, 23, 0.22) inset;
	}

	.badge.addressed {
		background: var(--addressedBadgeBg);
		color: var(--addressedBadgeText);
		border-color: var(--addressedBadgeBorder);
	}

	.actionsCell {
		display: flex;
		gap: 0.375rem;
		flex-wrap: wrap;
	}

	.actionBtn {
		padding: 0.375rem 0.625rem;
		border: none;
		border-radius: 0.25rem;
		font-size: 0.8rem;
		cursor: pointer;
		font-weight: 500;
		transition: opacity 0.2s;
	}

	.actionBtn:hover {
		opacity: 0.8;
	}

	.actionBtn.address {
		background: var(--statusAddressedBg);
		color: var(--statusAddressedText);
	}

	.actionBtn.reopen {
		background: var(--statusPendingBg);
		color: var(--statusPendingText);
	}

	.actionBtn.delete {
		background: var(--dangerBg);
		color: var(--dangerText);
	}

	.messageRow td {
		background: var(--panelAltBg);
		font-size: 0.85rem;
		color: var(--textSecondary);
		padding: 0.5rem 1rem;
	}

	.emptyState {
		text-align: center;
		padding: 3rem;
		color: var(--textMuted);
		background: var(--panelBg);
		border-radius: 0.9rem;
		border: 1px solid var(--panelBorder);
	}

	@media (max-width: 900px) {
		.headerControls {
			justify-items: start;
			width: 100%;
		}

		.filters {
			justify-content: flex-start;
		}

		.sortControls {
			justify-content: flex-start;
		}
	}

	@media (max-width: 640px) {
		.pageHeader {
			flex-direction: column;
			align-items: stretch;
			gap: 1.15rem;
			margin-bottom: 1.15rem;
		}

		.headerControls {
			gap: 1.05rem;
			justify-items: stretch;
		}

		.topToggles {
			justify-content: space-between;
			width: 100%;
			gap: 0.5rem;
		}

		.scopeToggle {
			flex: 1;
			min-width: 0;
			justify-content: center;
			padding: 0.45rem 0.65rem;
			min-height: 2.75rem;
			box-sizing: border-box;
		}

		.viewToggle {
			flex-shrink: 0;
		}

		.toggleBtn {
			padding: 0.45rem 0.75rem;
			min-height: 2.75rem;
			box-sizing: border-box;
		}

		.filters {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.5rem;
			width: 100%;
		}

		.filterBtn {
			min-height: 2.75rem;
			padding: 0.45rem 0.35rem;
			font-size: 0.76rem;
			line-height: 1.2;
			text-align: center;
			box-sizing: border-box;
		}

		.sortControls {
			display: grid;
			grid-template-columns: repeat(3, minmax(0, 1fr));
			gap: 0.5rem;
			width: 100%;
			align-items: stretch;
		}

		.sortLabel {
			grid-column: 1 / -1;
			margin: 0 0 0.1rem;
			font-size: 0.72rem;
		}

		.sortBtn {
			min-height: 2.75rem;
			padding: 0.45rem 0.35rem;
			font-size: 0.76rem;
			line-height: 1.2;
			text-align: center;
			box-sizing: border-box;
		}
	}
</style>
