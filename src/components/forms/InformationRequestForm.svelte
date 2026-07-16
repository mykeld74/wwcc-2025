<script lang="ts">
	import { enhance } from '$app/forms';
	import FieldError from './FieldError.svelte';
	import PhoneInput from './PhoneInput.svelte';
	import Turnstile from './Turnstile.svelte';
	import { validateEmail, validateRequired } from '$lib/formValidation';

	interface TypeOption {
		id: number;
		label: string;
	}

	interface FormState {
		success?: boolean;
		message?: string;
		error?: string;
		requestType?: string;
		name?: string;
		email?: string;
		phone?: string;
	}

	interface Props {
		types: TypeOption[];
		form?: FormState | null;
		action?: string;
		idPrefix?: string;
		compact?: boolean;
		onsuccess?: () => void;
	}

	let {
		types,
		form = null,
		action = '/go?/informationRequest',
		idPrefix = 'info',
		compact = false,
		onsuccess
	}: Props = $props();

	let localForm = $state<FormState | null>(null);
	let requestType = $state('');
	let name = $state('');
	let email = $state('');
	let phone = $state('');
	let message = $state('');
	let fieldErrors = $state({
		requestType: '',
		name: '',
		email: ''
	});
	let phoneInput = $state<{ validate: () => boolean } | null>(null);

	$effect(() => {
		localForm = form;
		requestType = form?.requestType ?? '';
		name = form?.name ?? '';
		email = form?.email ?? '';
		phone = form?.phone ?? '';
		if (!form?.success) {
			message = form?.message ?? '';
		}
	});

	function clearError(field: keyof typeof fieldErrors) {
		if (fieldErrors[field]) {
			fieldErrors[field] = '';
		}
	}

	function validateRequestType() {
		fieldErrors.requestType = validateRequired(requestType, 'a request type');
		return !fieldErrors.requestType;
	}

	function validateName() {
		fieldErrors.name = validateRequired(name, 'your name');
		return !fieldErrors.name;
	}

	function validateEmailField() {
		fieldErrors.email = validateEmail(email);
		return !fieldErrors.email;
	}

	function validateAll() {
		const requestTypeValid = validateRequestType();
		const nameValid = validateName();
		const emailValid = validateEmailField();
		const phoneValid = phoneInput?.validate() ?? true;
		return requestTypeValid && nameValid && emailValid && phoneValid;
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
			<label for="{idPrefix}-requestType"
				>Request Type <span class="required">(required)</span></label
			>
			<input
				type="text"
				id="{idPrefix}-requestType"
				name="requestType"
				list="{idPrefix}-requestTypeOptions"
				required
				maxlength="255"
				placeholder="Select or type a topic…"
				autocomplete="off"
				bind:value={requestType}
				onblur={validateRequestType}
				oninput={() => clearError('requestType')}
				aria-invalid={fieldErrors.requestType ? 'true' : undefined}
				aria-describedby={fieldErrors.requestType ? `${idPrefix}-requestType-error` : undefined}
			/>
			<datalist id="{idPrefix}-requestTypeOptions">
				{#each types as type (type.id)}
					<option value={type.label}></option>
				{/each}
			</datalist>
			<p class="fieldHint">Choose from the list or type your own if it isn’t listed.</p>
			<FieldError id="{idPrefix}-requestType-error" message={fieldErrors.requestType} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-name">Name <span class="required">(required)</span></label>
			<input
				type="text"
				id="{idPrefix}-name"
				name="name"
				required
				bind:value={name}
				onblur={validateName}
				oninput={() => clearError('name')}
				aria-invalid={fieldErrors.name ? 'true' : undefined}
				aria-describedby={fieldErrors.name ? `${idPrefix}-name-error` : undefined}
			/>
			<FieldError id="{idPrefix}-name-error" message={fieldErrors.name} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-email">Email <span class="required">(required)</span></label>
			<input
				type="email"
				id="{idPrefix}-email"
				name="email"
				required
				bind:value={email}
				onblur={validateEmailField}
				oninput={() => clearError('email')}
				aria-invalid={fieldErrors.email ? 'true' : undefined}
				aria-describedby={fieldErrors.email ? `${idPrefix}-email-error` : undefined}
			/>
			<FieldError id="{idPrefix}-email-error" message={fieldErrors.email} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-phone">Phone <span class="optional">(optional)</span></label>
			<PhoneInput id="{idPrefix}-phone" bind:this={phoneInput} bind:value={phone} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-message">Message <span class="optional">(optional)</span></label>
			<textarea
				id="{idPrefix}-message"
				name="message"
				rows="5"
				maxlength="2000"
				bind:value={message}
			></textarea>
		</div>

		<Turnstile />

		<button type="submit" class="submitButton">Submit Request</button>
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

	.fieldHint {
		margin: 0.4rem 0 0;
		font-size: 0.9rem;
		opacity: 0.7;
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
</style>
