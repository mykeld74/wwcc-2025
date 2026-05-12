<script lang="ts">
	import type { ActionData } from './$types';

	export let form: ActionData;

	// Reactive state to clear form on success
	$: if (form?.success) {
		clearForm();
	}

	function clearForm() {
		const formElement = document.querySelector('form');
		if (formElement) {
			formElement.reset();
		}
	}
</script>

<div class="contentWrapper">
	<h1 class="pageTitle">Submit a Prayer Request</h1>

	{#if form?.success}
		<p class="success-message">{form.message}</p>
	{/if}

	{#if form?.error}
		<p class="error-message">{form.error}</p>
	{/if}

	<form method="POST" class="prayer-form">
		<div class="form-group">
			<label for="request">Prayer Request (required)</label>
			<textarea id="request" name="request" required rows="6" maxlength="2000">{form?.request ?? ''}</textarea>
		</div>

		<div class="form-group">
			<label for="name">Name (optional)</label>
			<input type="text" id="name" name="name" value={form?.name ?? ''} />
		</div>

		<div class="form-group">
			<label for="email">Email (optional)</label>
			<input type="email" id="email" name="email" value={form?.email ?? ''} />
		</div>

		<div class="form-group checkbox-group">
			<input type="checkbox" id="isStaffOnly" name="isStaffOnly" checked={form?.isStaffOnly ?? false} />
			<label for="isStaffOnly">For Staff Only</label>
		</div>

		<button type="submit" class="submit-button">Submit Prayer Request</button>
	</form>
</div>

<style>
	.contentWrapper {
		max-width: 600px;
		margin: 2rem auto;
		padding: 2rem;
		background: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
	}

	.pageTitle {
		text-align: center;
		margin-bottom: 2rem;
		color: #333;
	}

	.prayer-form {
		display: flex;
		flex-direction: column;
		gap: 1.5rem;
	}

	.form-group {
		display: flex;
		flex-direction: column;
	}

	label {
		margin-bottom: 0.5rem;
		font-weight: 600;
		color: #555;
	}

	input,
	textarea {
		padding: 0.75rem;
		border: 1px solid #ccc;
		border-radius: 4px;
		font-size: 1rem;
		transition: border-color 0.2s;
	}

	input:focus,
	textarea:focus {
		border-color: #007bff;
		outline: none;
	}

	.checkbox-group {
		flex-direction: row;
		align-items: center;
		gap: 0.5rem;
	}

	.checkbox-group input {
		width: auto;
	}

	.submit-button {
		padding: 1rem;
		border: none;
		border-radius: 4px;
		background-color: #007bff;
		color: white;
		font-size: 1.1rem;
		font-weight: 600;
		cursor: pointer;
		transition: background-color 0.2s;
	}

	.submit-button:hover {
		background-color: #0056b3;
	}

	.success-message {
		background-color: #d4edda;
		color: #155724;
		padding: 1rem;
		border: 1px solid #c3e6cb;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}

	.error-message {
		background-color: #f8d7da;
		color: #721c24;
		padding: 1rem;
		border: 1px solid #f5c6cb;
		border-radius: 4px;
		margin-bottom: 1.5rem;
	}
</style>
