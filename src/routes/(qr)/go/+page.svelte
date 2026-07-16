<script lang="ts">
	import { getTheme } from '$lib/theme.svelte.js';
	import FormModal from '$components/forms/FormModal.svelte';
	import PrayerRequestForm from '$components/forms/PrayerRequestForm.svelte';
	import InformationRequestForm from '$components/forms/InformationRequestForm.svelte';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	type ModalId = 'prayer' | 'info' | null;

	let activeModal = $state<ModalId>(null);
	let prayerKey = $state(0);
	let infoKey = $state(0);

	const theme = $derived(getTheme());

	const profileUrl = $derived(
		`https://westwoods.churchcenter.com/me/profile-and-household?theme=${theme}`
	);

	const givingUrl = $derived(
		`https://westwoods.churchcenter.com/giving?open-in-church-center-modal=true&theme=${theme}`
	);

	const modalActions = [
		{
			id: 'prayer' as const,
			label: 'Submit a Prayer Request',
			description: 'Share a request with our prayer team'
		},
		{
			id: 'info' as const,
			label: 'Request Information',
			description: 'Ask about Connect Lunch, Partnership, Family Promise, and more'
		}
	];

	function openModal(id: ModalId) {
		if (id === 'prayer') prayerKey += 1;
		if (id === 'info') infoKey += 1;
		activeModal = id;
	}

	function closeModal() {
		activeModal = null;
	}
</script>

<svelte:head>
	<title>Welcome | Westwoods Community Church</title>
	<meta
		name="description"
		content="Quick links to pray, request information, update your contact details, or give at Westwoods Community Church."
	/>
</svelte:head>

<main class="landing">
	<h1 class="brandTitle">Westwoods</h1>
	<p class="intro">How can we help you today?</p>

	<nav class="actionList" aria-label="Quick actions">
		{#each modalActions as action, index (action.id)}
			<button
				type="button"
				class="actionLink"
				style="--delay: {index * 60}ms"
				onclick={() => openModal(action.id)}
			>
				<span class="actionLabel">{action.label}</span>
				<span class="actionDescription">{action.description}</span>
			</button>
		{/each}

		<a
			class="actionLink"
			href={profileUrl}
			style="--delay: {modalActions.length * 60}ms"
		>
			<span class="actionLabel">Update Personal Info</span>
			<span class="actionDescription">Add or update your contact details</span>
		</a>

		<a
			class="actionLink"
			href={givingUrl}
			data-open-in-church-center-modal="true"
			style="--delay: {(modalActions.length + 1) * 60}ms"
		>
			<span class="actionLabel">Give</span>
			<span class="actionDescription">Support the ministry of Westwoods</span>
		</a>
	</nav>
</main>

<FormModal open={activeModal === 'prayer'} title="Submit a Prayer Request" onClose={closeModal}>
	{#key prayerKey}
		<PrayerRequestForm compact idPrefix="modal-prayer" />
	{/key}
</FormModal>

<FormModal open={activeModal === 'info'} title="Information Request" onClose={closeModal}>
	{#key infoKey}
		<InformationRequestForm types={data.types} compact idPrefix="modal-info" />
	{/key}
</FormModal>

<style>
	.landing {
		display: grid;
		align-content: start;
		gap: 1.25rem;
		padding-bottom: 1rem;
	}

	.brandTitle {
		margin: 0;
		text-align: center;
		font-size: clamp(2rem, 8vw, 2.75rem);
		font-weight: 700;
		color: var(--titleColor);
		letter-spacing: -0.02em;
	}

	.intro {
		margin: 0;
		text-align: center;
		font-size: clamp(1.1rem, 4vw, 1.35rem);
		color: var(--textColor);
		text-wrap: balance;
	}

	.actionList {
		display: grid;
		gap: 0.85rem;
		margin-top: 0.75rem;
	}

	.actionLink {
		display: grid;
		gap: 0.35rem;
		padding: 1.15rem 1.25rem;
		border-radius: 0.85rem;
		border: 1px solid var(--cardBorder);
		background: var(--cardBackground);
		color: var(--textColor);
		text-decoration: none;
		text-align: left;
		font: inherit;
		cursor: pointer;
		box-shadow: 0 4px 18px var(--overlayColor);
		min-height: 4.5rem;
		align-content: center;
		opacity: 0;
		translate: 0 0.75rem;
		animation: riseIn 450ms var(--animHoverEase) forwards;
		animation-delay: var(--delay, 0ms);
		transition:
			transform var(--animHoverTime) var(--animHoverEase),
			border-color var(--animHoverTime) var(--animHoverEase),
			background-color var(--animHoverTime) var(--animHoverEase);
	}

	.actionLink:hover,
	.actionLink:focus-visible {
		transform: scale(1.02);
		border-color: var(--primaryColor);
		outline: none;
	}

	.actionLabel {
		font-size: 1.2rem;
		font-weight: 700;
		color: var(--titleColor);
	}

	.actionDescription {
		font-size: 0.95rem;
		line-height: 1.35;
		opacity: 0.85;
	}

	@keyframes riseIn {
		to {
			opacity: 1;
			translate: 0 0;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.actionLink {
			animation: none;
			opacity: 1;
			translate: none;
		}
	}
</style>
