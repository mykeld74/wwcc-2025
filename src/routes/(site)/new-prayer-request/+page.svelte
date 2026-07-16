<script lang="ts">
	import { enhance } from '$app/forms';
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
	{#if form?.success}
		<div class="successMessage">
			<h2>Thank you!</h2>
			<p>{form.message}</p>
		</div>
	{:else}
		<form
			method="POST"
			class="prayerForm"
			use:enhance={() => {
				return async ({ update }) => {
					await update({ reset: true });
				};
			}}
		>
			{#if form?.error}
				<div class="errorMessage">{form.error}</div>
			{/if}

			<div class="formGroup">
				<label for="request">Prayer Request <span class="required">(required)</span></label>
				<textarea
					id="request"
					name="request"
					required
					rows="6"
					maxlength="2000"
					value={form?.request ?? ''}
				></textarea>
			</div>

			<div class="formGroup">
				<label for="name">Name <span class="optional">(optional)</span></label>
				<input type="text" id="name" name="name" value={form?.name ?? ''} />
			</div>

			<div class="formGroup">
				<label for="email">Email <span class="optional">(optional)</span></label>
				<input type="email" id="email" name="email" value={form?.email ?? ''} />
			</div>

			<div class="formGroup checkboxGroup">
				<input
					type="checkbox"
					id="isStaffOnly"
					name="isStaffOnly"
					checked={form?.isStaffOnly ?? false}
				/>
				<label for="isStaffOnly">For Staff Only</label>
			</div>

			<button type="submit" class="submitButton">Submit Prayer Request</button>
		</form>
	{/if}
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

	.prayerForm {
		background: var(--cardBackground);
		padding: 2rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 20px var(--overlayColor);
		border: 1px solid var(--cardBorder);
	}

	.formGroup {
		margin-bottom: 1.5rem;
	}

	.formGroup label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--textColor);
		font-size: 1.1rem;
	}

	.required,
	.optional {
		font-weight: 400;
		font-size: 0.9rem;
		opacity: 0.7;
	}

	.formGroup input,
	.formGroup textarea {
		width: 100%;
		padding: 0.75rem 1rem;
		border: 1px solid var(--cardBorder);
		border-radius: 0.5rem;
		font-size: 1rem;
		font-family: inherit;
		background: var(--backgroundColor);
		color: var(--textColor);
		transition: border-color 0.3s ease;
	}

	.formGroup input:focus,
	.formGroup textarea:focus {
		outline: none;
		border-color: var(--primaryColor);
	}

	.formGroup textarea {
		resize: vertical;
		min-height: 120px;
	}

	.checkboxGroup {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.75rem;
	}

	.checkboxGroup input {
		width: auto;
		accent-color: var(--primaryColor);
	}

	.checkboxGroup label {
		margin-bottom: 0;
	}

	.submitButton {
		width: 100%;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		background: var(--titleColor);
		color: var(--backgroundColor);
		border: none;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 600;
		transition: all 0.3s ease-in-out;
		margin-top: 1rem;
	}

	.submitButton:hover {
		background: var(--accentColor);
		transform: scale(1.02);
	}

	.errorMessage {
		color: #d32f2f;
		background: rgba(211, 47, 47, 0.1);
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1.5rem;
		border: 1px solid #f44336;
		font-size: 0.9rem;
	}

	.successMessage {
		background: var(--cardBackground);
		padding: 2rem;
		border-radius: 0.5rem;
		text-align: center;
		border: 1px solid var(--primaryColor);
		box-shadow: 0 4px 20px var(--overlayColor);
	}

	.successMessage h2 {
		color: var(--titleColor);
		margin-bottom: 1rem;
		font-size: 1.5rem;
	}

	.successMessage p {
		color: var(--textColor);
		font-size: 1.1rem;
		margin: 0;
	}
</style>
