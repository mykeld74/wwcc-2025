<script lang="ts">
	import { enhance } from '$app/forms';

	interface FormState {
		success?: boolean;
		message?: string;
		error?: string;
		request?: string;
		name?: string;
		email?: string;
		isStaffOnly?: boolean;
	}

	interface Props {
		form?: FormState | null;
		action?: string;
		idPrefix?: string;
		compact?: boolean;
		onsuccess?: () => void;
	}

	let {
		form = null,
		action = '/new-prayer-request',
		idPrefix = 'prayer',
		compact = false,
		onsuccess
	}: Props = $props();

	let localForm = $state<FormState | null>(form);

	$effect(() => {
		localForm = form;
	});
</script>

{#if localForm?.success}
	<div class="successMessage">
		<h3>Thank you!</h3>
		<p>{localForm.message}</p>
	</div>
{:else}
	<form
		method="POST"
		{action}
		class="requestForm"
		class:compact
		use:enhance={() => {
			return async ({ result }) => {
				if (result.type === 'success') {
					localForm = (result.data as FormState) ?? { success: true };
					onsuccess?.();
				} else if (result.type === 'failure') {
					localForm = (result.data as FormState) ?? { error: 'Something went wrong' };
				}
			};
		}}
	>
		{#if localForm?.error}
			<div class="errorMessage">{localForm.error}</div>
		{/if}

		<div class="formGroup">
			<label for="{idPrefix}-request"
				>Prayer Request <span class="required">(required)</span></label
			>
			<textarea
				id="{idPrefix}-request"
				name="request"
				required
				rows="5"
				maxlength="2000"
				value={localForm?.request ?? ''}
			></textarea>
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-name">Name <span class="optional">(optional)</span></label>
			<input type="text" id="{idPrefix}-name" name="name" value={localForm?.name ?? ''} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-email">Email <span class="optional">(optional)</span></label>
			<input type="email" id="{idPrefix}-email" name="email" value={localForm?.email ?? ''} />
		</div>

		<div class="formGroup checkboxGroup">
			<input
				type="checkbox"
				id="{idPrefix}-isStaffOnly"
				name="isStaffOnly"
				checked={localForm?.isStaffOnly ?? false}
			/>
			<label for="{idPrefix}-isStaffOnly">For Staff Only</label>
		</div>

		<button type="submit" class="submitButton">Submit Prayer Request</button>
	</form>
{/if}

<style>
	.requestForm {
		background: var(--cardBackground);
		padding: 1.5rem;
		border-radius: 0.5rem;
		box-shadow: 0 4px 20px var(--overlayColor);
		border: 1px solid var(--cardBorder);
	}

	.requestForm.compact {
		padding: 0;
		background: transparent;
		border: none;
		box-shadow: none;
	}

	.formGroup {
		margin-bottom: 1.25rem;
	}

	.formGroup label {
		display: block;
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: var(--textColor);
		font-size: 1.05rem;
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
	}

	.formGroup input:focus,
	.formGroup textarea:focus {
		outline: none;
		border-color: var(--primaryColor);
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
		padding: 1rem 1.5rem;
		border-radius: 0.5rem;
		background: var(--titleColor);
		color: var(--backgroundColor);
		border: none;
		cursor: pointer;
		font-size: 1.15rem;
		font-weight: 600;
	}

	.submitButton:hover {
		background: var(--accentColor);
	}

	.errorMessage {
		color: #d32f2f;
		background: rgba(211, 47, 47, 0.1);
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-bottom: 1.25rem;
		border: 1px solid #f44336;
		font-size: 0.9rem;
	}

	.successMessage {
		text-align: center;
		padding: 1.5rem 0.5rem;
	}

	.successMessage h3 {
		color: var(--titleColor);
		margin: 0 0 0.75rem;
	}

	.successMessage p {
		margin: 0;
		color: var(--textColor);
	}
</style>
