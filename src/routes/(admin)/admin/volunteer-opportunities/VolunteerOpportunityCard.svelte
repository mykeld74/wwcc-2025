<script lang="ts">
	import { enhance } from '$app/forms';

	type Opportunity = {
		id: number;
		name: string;
		email: string;
		phone: string | null;
		department: string;
		sendTo: string;
		message: string | null;
		addressed: boolean;
		submittedAt: string | Date;
	};

	let { opportunity, isAdmin, formatDate, compact = false, statusEnhance } = $props<{
		opportunity: Opportunity;
		isAdmin: boolean;
		formatDate: (date: string | Date) => string;
		compact?: boolean;
		statusEnhance: Parameters<typeof enhance>[0];
	}>();
</script>

<article class="opportunityCard" class:compact={compact} class:addressed={opportunity.addressed}>
	<div class="statusStrip" class:addressed={opportunity.addressed} aria-hidden="true"></div>
	<div class="cardHeader">
		<div>
			<h2>{opportunity.name}</h2>
			{#if compact}
				<p class="cardDepartment">{opportunity.department}</p>
			{:else}
				<p class="cardDate">{formatDate(opportunity.submittedAt)}</p>
			{/if}
		</div>
		<span class="badge" class:addressed={opportunity.addressed}>
			{opportunity.addressed ? 'Addressed' : 'Pending'}
		</span>
	</div>

	{#if !compact}
		<div class="cardDetails">
			<p class="detailRow">
				<span class="detailLabel">Email</span>
				<a class="emailLink" href="mailto:{opportunity.email}">{opportunity.email}</a>
			</p>
			<p class="detailRow">
				<span class="detailLabel">Phone</span>
				<span>{opportunity.phone || '—'}</span>
			</p>
			<p class="detailRow">
				<span class="detailLabel">Department</span>
				<span>{opportunity.department}</span>
			</p>
			<p class="detailRow">
				<span class="detailLabel">Sent To</span>
				<span>{opportunity.sendTo}</span>
			</p>
			{#if opportunity.message}
				<div class="messageText">
					<p class="messageLabel">Message</p>
					<p>{opportunity.message}</p>
				</div>
			{/if}
		</div>
	{/if}

	<div class="actionsCell">
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
		{#if isAdmin}
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
	</div>
</article>

<style>
	.opportunityCard {
		min-width: 0;
		background:
			radial-gradient(
				150% 115% at 100% 0%,
				var(--cardStatusGlow, var(--cardPendingGlow, rgba(0, 224, 255, 0.24))),
				transparent 55%
			),
			linear-gradient(145deg, var(--cardSurfaceTop, #1e243b), var(--cardSurfaceBottom, #111727));
		border: 1px solid var(--cardEdge, rgba(148, 163, 184, 0.28));
		border-radius: 1.15rem;
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.08),
			0 18px 36px rgba(3, 6, 18, 0.45);
		padding: 1.05rem 1rem 1rem;
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		gap: 0.85rem;
		height: 100%;
		overflow: hidden;
		position: relative;
		backdrop-filter: blur(4px);
		transition:
			transform 0.2s ease,
			box-shadow 0.2s ease,
			border-color 0.2s ease;
	}

	.opportunityCard::before {
		content: '';
		position: absolute;
		inset: auto -14% -45% auto;
		width: 180px;
		height: 180px;
		border-radius: 999px;
		background: var(--cardGlowSecondary, rgba(16, 185, 129, 0.16));
		filter: blur(34px);
		pointer-events: none;
	}

	.opportunityCard.addressed {
		--cardStatusGlow: var(--cardAddressedGlow, rgba(34, 197, 94, 0.2));
	}

	.opportunityCard:not(.addressed) {
		--cardStatusGlow: var(--cardPendingGlow, rgba(0, 224, 255, 0.24));
	}

	.opportunityCard:hover {
		transform: translateY(-2px);
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.1),
			0 24px 42px rgba(2, 6, 23, 0.55);
		border-color: color-mix(in oklch, var(--cardEdge, var(--panelBorder)), white 16%);
	}

	.opportunityCard.compact {
		gap: 0.7rem;
		padding-bottom: 0.85rem;
	}

	.statusStrip {
		position: absolute;
		inset: 0 0 auto 0;
		height: 3px;
		background: linear-gradient(
			90deg,
			var(--cardPendingStripStart, #38bdf8),
			var(--cardPendingStripEnd, #0ea5e9)
		);
	}

	.statusStrip.addressed {
		background: linear-gradient(
			90deg,
			var(--cardAddressedStripStart, #4ade80),
			var(--cardAddressedStripEnd, #22c55e)
		);
	}

	.cardHeader {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 0.8rem;
		padding-top: 0.15rem;
	}

	.cardHeader h2 {
		margin: 0;
		font-size: 1.08rem;
		color: var(--cardText, var(--textPrimary));
		line-height: 1.3;
		letter-spacing: 0.01em;
	}

	.cardDate {
		margin: 0.25rem 0 0;
		font-size: 0.8rem;
		color: var(--cardMuted, var(--textMuted));
	}

	.cardDepartment {
		margin: 0.25rem 0 0;
		font-size: 0.84rem;
		font-weight: 600;
		color: var(--cardSubtext, var(--textSecondary));
	}

	.cardDetails {
		display: grid;
		gap: 0.5rem;
		flex: 1;
		padding: 0.1rem 0;
		align-content: start;
	}

	.detailRow {
		display: grid;
		grid-template-columns: 6.5rem 1fr;
		align-items: baseline;
		gap: 0.55rem;
		margin: 0;
		color: var(--cardText, var(--textPrimary));
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.detailLabel {
		font-size: 0.76rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 700;
		color: var(--cardMuted, var(--textMuted));
	}

	.emailLink {
		color: var(--cardLink, #7dd3fc);
		font-weight: 600;
		text-decoration: none;
		overflow-wrap: anywhere;
	}

	.emailLink:hover {
		text-decoration: underline;
		text-decoration-thickness: 1.5px;
		text-underline-offset: 2px;
	}

	.messageText {
		background: var(--cardInset, rgba(15, 23, 42, 0.45));
		border: 1px solid var(--cardInsetEdge, rgba(148, 163, 184, 0.22));
		border-radius: 0.65rem;
		padding: 0.65rem 0.7rem;
	}

	.messageLabel {
		margin: 0 0 0.25rem;
		font-size: 0.74rem;
		text-transform: uppercase;
		letter-spacing: 0.04em;
		font-weight: 700;
		color: var(--cardMuted, var(--textMuted));
	}

	.messageText p {
		margin: 0;
		font-size: 0.88rem;
		line-height: 1.45;
		color: var(--cardSubtext, var(--textSecondary));
	}

	.badge {
		display: inline-block;
		padding: 0.27rem 0.62rem;
		border-radius: 9999px;
		font-size: 0.69rem;
		font-weight: 700;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		background: var(--pendingBadgeBg, rgba(14, 165, 233, 0.34));
		color: var(--pendingBadgeText, #e0f2fe);
		border: 1px solid var(--pendingBadgeBorder, rgba(125, 211, 252, 0.72));
		box-shadow: 0 0 0 1px rgba(2, 6, 23, 0.22) inset;
		white-space: nowrap;
	}

	.badge.addressed {
		background: var(--addressedBadgeBg, rgba(34, 197, 94, 0.34));
		color: var(--addressedBadgeText, #dcfce7);
		border: 1px solid var(--addressedBadgeBorder, rgba(134, 239, 172, 0.72));
	}

	.actionsCell {
		display: flex;
		gap: 0.45rem;
		flex-wrap: wrap;
		margin-top: auto;
		padding-top: 0.6rem;
		border-top: 1px solid var(--cardInsetEdge, rgba(148, 163, 184, 0.2));
	}

	.actionsCell :global(form) {
		display: flex;
	}

	.actionBtn {
		padding: 0.42rem 0.8rem;
		border: 1px solid transparent;
		border-radius: 999px;
		font-size: 0.74rem;
		letter-spacing: 0.02em;
		cursor: pointer;
		font-weight: 600;
		transition:
			opacity 0.2s,
			transform 0.2s ease,
			filter 0.2s,
			box-shadow 0.2s;
	}

	.actionBtn:focus-visible {
		outline: 2px solid color-mix(in oklch, var(--cardHoverBorderAccent), white 28%);
		outline-offset: 2px;
	}

	.actionBtn:hover {
		opacity: 1;
		transform: translateY(-1px);
		filter: saturate(1.08);
		box-shadow: var(--btnShadow, 0 8px 16px rgba(2, 6, 23, 0.28));
	}

	.actionBtn.address {
		background: var(--btnAddressBg, rgba(34, 197, 94, 0.2));
		color: var(--btnAddressText, #bbf7d0);
		border-color: var(--btnAddressBorder, rgba(134, 239, 172, 0.38));
	}

	.actionBtn.reopen {
		background: var(--btnReopenBg, rgba(6, 182, 212, 0.18));
		color: var(--btnReopenText, #bae6fd);
		border-color: var(--btnReopenBorder, rgba(125, 211, 252, 0.38));
	}

	.actionBtn.delete {
		background: var(--btnDeleteBg, rgba(239, 68, 68, 0.18));
		color: var(--btnDeleteText, #fecaca);
		border-color: var(--btnDeleteBorder, rgba(252, 165, 165, 0.35));
	}

	@media (max-width: 500px) {
		.detailRow {
			grid-template-columns: 1fr;
			gap: 0.2rem;
		}
	}
</style>
