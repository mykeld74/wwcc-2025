<script lang="ts">
	import { enhance } from '$app/forms';

	interface FormState {
		success?: boolean;
		message?: string;
		error?: string;
		submissionType?: string;
		name?: string;
		email?: string;
		phone?: string;
		street?: string;
		city?: string;
		state?: string;
		zip?: string;
		notes?: string;
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
		action = '/contact-information',
		idPrefix = 'contact',
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

		<fieldset class="formGroup radioGroup">
			<legend>I want to <span class="required">(required)</span></legend>
			<label class="radioOption">
				<input
					type="radio"
					name="submissionType"
					value="new"
					required
					checked={localForm?.submissionType === 'new' || !localForm?.submissionType}
				/>
				Add new contact information
			</label>
			<label class="radioOption">
				<input
					type="radio"
					name="submissionType"
					value="update"
					checked={localForm?.submissionType === 'update'}
				/>
				Update existing contact information
			</label>
		</fieldset>

		<div class="formGroup">
			<label for="{idPrefix}-name">Full Name <span class="required">(required)</span></label>
			<input
				type="text"
				id="{idPrefix}-name"
				name="name"
				required
				value={localForm?.name ?? ''}
			/>
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-email">Email <span class="required">(required)</span></label>
			<input
				type="email"
				id="{idPrefix}-email"
				name="email"
				required
				value={localForm?.email ?? ''}
			/>
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-phone">Phone <span class="optional">(optional)</span></label>
			<input type="tel" id="{idPrefix}-phone" name="phone" value={localForm?.phone ?? ''} />
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-street"
				>Street Address <span class="optional">(optional)</span></label
			>
			<input type="text" id="{idPrefix}-street" name="street" value={localForm?.street ?? ''} />
		</div>

		<div class="addressRow">
			<div class="formGroup">
				<label for="{idPrefix}-city">City</label>
				<input type="text" id="{idPrefix}-city" name="city" value={localForm?.city ?? ''} />
			</div>
			<div class="formGroup">
				<label for="{idPrefix}-state">State</label>
				<input type="text" id="{idPrefix}-state" name="state" value={localForm?.state ?? ''} />
			</div>
			<div class="formGroup">
				<label for="{idPrefix}-zip">ZIP</label>
				<input type="text" id="{idPrefix}-zip" name="zip" value={localForm?.zip ?? ''} />
			</div>
		</div>

		<div class="formGroup">
			<label for="{idPrefix}-notes">Notes <span class="optional">(optional)</span></label>
			<textarea
				id="{idPrefix}-notes"
				name="notes"
				rows="4"
				maxlength="2000"
				value={localForm?.notes ?? ''}
			></textarea>
		</div>

		<button type="submit" class="submitButton">Submit Contact Information</button>
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

	.formGroup label,
	.formGroup legend {
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

	.radioGroup {
		border: none;
		padding: 0;
		margin: 0 0 1.25rem;
	}

	.radioOption {
		display: grid;
		grid-template-columns: auto 1fr;
		align-items: center;
		gap: 0.75rem;
		font-weight: 400;
		margin-bottom: 0.75rem;
		cursor: pointer;
	}

	.radioOption input {
		width: auto;
		accent-color: var(--primaryColor);
	}

	.addressRow {
		display: grid;
		grid-template-columns: 2fr 1fr 1fr;
		gap: 0.75rem;
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

	@media (max-width: 640px) {
		.addressRow {
			grid-template-columns: 1fr;
		}
	}
</style>
