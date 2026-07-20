<script lang="ts">
	import { enhance } from '$app/forms';
	import FieldError from './FieldError.svelte';
	import Turnstile from './Turnstile.svelte';
	import { validateEmail, validateRequired } from '$lib/formValidation';

	interface FormState {
		success?: boolean;
		message?: string;
		error?: string;
		request?: string;
		firstName?: string;
		lastName?: string;
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

	let localForm = $state<FormState | null>(null);
	let request = $state('');
	let firstName = $state('');
	let lastName = $state('');
	let email = $state('');
	let isStaffOnly = $state(false);
	let fieldErrors = $state({
		request: '',
		email: ''
	});

	$effect(() => {
		localForm = form;
		request = form?.request ?? '';
		firstName = form?.firstName ?? '';
		lastName = form?.lastName ?? '';
		email = form?.email ?? '';
		isStaffOnly = form?.isStaffOnly ?? false;
	});

	function clearError(field: keyof typeof fieldErrors) {
		if (fieldErrors[field]) {
			fieldErrors[field] = '';
		}
	}

	function validateRequest() {
		fieldErrors.request = validateRequired(request, 'a prayer request');
		return !fieldErrors.request;
	}

	function validateEmailField() {
		fieldErrors.email = validateEmail(email, { required: false });
		return !fieldErrors.email;
	}

	function validateAll() {
		const requestValid = validateRequest();
		const emailValid = validateEmailField();
		return requestValid && emailValid;
	}
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
		novalidate
		use:enhance={({ cancel }) => {
			if (!validateAll()) {
				cancel();
				return;
			}

			return async ({ result }) => {
				if (result.type === 'success') {
					localForm = (result.data as FormState) ?? { success: true };
					onsuccess?.();
				} else if (result.type === 'failure') {
					localForm = (result.data as FormState) ?? { error: 'Something went wrong' };
					window.turnstile?.reset();
				}
			};
		}}
	>
		{#if localForm?.error}
			<FieldError message={localForm.error} />
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
				bind:value={request}
				onblur={validateRequest}
				oninput={() => clearError('request')}
				aria-invalid={fieldErrors.request ? 'true' : undefined}
				aria-describedby={fieldErrors.request ? `${idPrefix}-request-error` : undefined}
			></textarea>
			<FieldError id="{idPrefix}-request-error" message={fieldErrors.request} />
		</div>

		<div class="nameRow">
			<div class="formGroup">
				<label for="{idPrefix}-firstName"
					>First Name <span class="optional">(optional)</span></label
				>
				<input type="text" id="{idPrefix}-firstName" name="firstName" bind:value={firstName} />
			</div>

			<div class="formGroup">
				<label for="{idPrefix}-lastName"
					>Last Name <span class="optional">(optional)</span></label
				>
				<input type="text" id="{idPrefix}-lastName" name="lastName" bind:value={lastName} />
			</div>
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-email">Email <span class="optional">(optional)</span></label>
			<input
				type="email"
				id="{idPrefix}-email"
				name="email"
				bind:value={email}
				onblur={validateEmailField}
				oninput={() => clearError('email')}
				aria-invalid={fieldErrors.email ? 'true' : undefined}
				aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
			/>
			<FieldError id="{idPrefix}-email-error" message={fieldErrors.email} />
		</div>

		<div class="formGroup checkboxGroup">
			<input
				type="checkbox"
				id="{idPrefix}-isStaffOnly"
				name="isStaffOnly"
				bind:checked={isStaffOnly}
			/>
			<label for="{idPrefix}-isStaffOnly">For Staff Only</label>
		</div>

		<Turnstile />

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

	.nameRow {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 1rem;
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

	@media (max-width: 520px) {
		.nameRow {
			grid-template-columns: 1fr;
			gap: 0;
		}
	}
</style>
