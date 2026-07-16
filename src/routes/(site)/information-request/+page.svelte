<script lang="ts">
	import InformationRequestForm from '$components/forms/InformationRequestForm.svelte';
	import type { ActionData, PageData } from './$types';

	let { data, form }: { data: PageData; form: ActionData } = $props();
</script>

<svelte:head>
	<meta
		name="description"
		content="Request information about Connect Lunch, Family Promise, and other ministries at Westwoods Community Church."
	/>
</svelte:head>

<div class="titleContainer">
	<h1 class="pageTitle">Information Request</h1>
	<p class="heroSubtitle">
		Tell us what you'd like to learn more about and we'll follow up with you.
	</p>
</div>

<div class="formContainer">
	<InformationRequestForm types={data.types} {form} idPrefix="page-info" />
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

	.formContainer {
		width: calc(100% - 3rem);
		max-width: 600px;
		margin: 0 auto 11rem;
		padding: 0 1rem;
		grid-area: content / content;
	}
</style>
