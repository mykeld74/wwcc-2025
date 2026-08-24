<script lang="ts">
	import PrayerRequestForm from '$components/forms/PrayerRequestForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<meta
		name="description"
		content="Submit a prayer request to Westwoods Community Church. Our team is here to pray with you."
	/>
</svelte:head>

<div class="titleContainer">
	<h1 class="pageTitle">Submit a Prayer Request</h1>
	<p class="heroSubtitle">
		Share your prayer request below. Our team will lift it up in prayer.
	</p>
</div>

<div class="prayerContainer">
	<PrayerRequestForm {form} idPrefix="page-prayer" />
</div>

<style>
	.titleContainer {
		text-align: center;
		margin-bottom: 3rem;
		grid-area: hero / content;
	}

	.heroSubtitle {
		font-size: clamp(1.25rem, 2.5vw, 2rem);
		margin: 0 0 2rem;
		color: var(--textColor);
		text-wrap: balance;
	}

	.prayerContainer {
		width: calc(100% - 3rem);
		max-width: 600px;
		margin: 0 auto 11rem;
		padding: 0 1rem;
		grid-area: content / content;
	}
</style>
