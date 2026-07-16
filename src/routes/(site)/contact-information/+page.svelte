<script lang="ts">
	import ContactInformationForm from '$components/forms/ContactInformationForm.svelte';
	import type { ActionData } from './$types';

	let { form }: { form: ActionData } = $props();
</script>

<svelte:head>
	<meta
		name="description"
		content="Add or update your contact information with Westwoods Community Church."
	/>
</svelte:head>

<div class="titleContainer">
	<h1 class="pageTitle">Contact Information</h1>
	<p class="heroSubtitle">
		Add yourself as a new contact or update the information we already have on file.
	</p>
</div>

<div class="formContainer">
	<ContactInformationForm {form} idPrefix="page-contact" />
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
