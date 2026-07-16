<script lang="ts">
	import FieldError from '$components/forms/FieldError.svelte';
	import PhoneInput from '$components/forms/PhoneInput.svelte';
	import {
		validateEmail,
		validateMinLength,
		validateRequired
	} from '$lib/formValidation';

	let formData = $state({
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	let status = $state({
		sending: false,
		success: false,
		error: null as string | null
	});

	let errors = $state({
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	let phoneInput = $state<{ validate: () => boolean } | null>(null);

	function clearError(field: keyof typeof errors) {
		if (errors[field]) {
			errors[field] = '';
		}
	}

	function validateName() {
		errors.name = validateRequired(formData.name, 'your name');
		return !errors.name;
	}

	function validateEmailField() {
		errors.email = validateEmail(formData.email);
		return !errors.email;
	}

	function validateMessage() {
		errors.message = validateMinLength(
			formData.message,
			3,
			'Please provide a message'
		);
		return !errors.message;
	}

	function validatePhoneField() {
		return phoneInput?.validate() ?? false;
	}

	async function handleSubmit(e: SubmitEvent) {
		e.preventDefault();

		const nameValid = validateName();
		const emailValid = validateEmailField();
		const messageValid = validateMessage();
		const phoneValid = validatePhoneField();

		if (!nameValid || !emailValid || !messageValid || !phoneValid) {
			return;
		}

		status.sending = true;
		status.error = null;

		try {
			const response = await fetch('/contact-us', {
				method: 'POST',
				body: JSON.stringify(formData),
				headers: {
					'Content-Type': 'application/json'
				}
			});

			const result = await response.json();

			if (result.success) {
				status.success = true;
				formData = { name: '', email: '', phone: '', message: '' };
			} else {
				status.error = result.error || 'Failed to send message';
			}
		} catch (error) {
			status.error = 'Failed to send message';
		} finally {
			status.sending = false;
		}
	}
</script>

<svelte:head>
	<meta
		name="description"
		content="Contact Westwoods Community Church for questions, prayer requests, or to learn more about our ministries and events. We’re here to help!"
	/>
</svelte:head>

<div class="titleContainer">
	<h1 class="pageTitle">Contact Us</h1>
	<p class="heroSubtitle">
		We'd love to hear from you! Fill out the form below and we'll get back to you soon.
	</p>
</div>

<div class="contactContainer">
	{#if status.success}
		<div class="successMessage">
			<h2>Thank you!</h2>
			<p>Your message has been sent. We'll be in touch soon.</p>
		</div>
	{:else}
		<form class="contactForm" novalidate onsubmit={handleSubmit}>
			<div class="formGroup">
				<label for="name">Name</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					onblur={validateName}
					oninput={() => clearError('name')}
					required
					aria-invalid={errors.name ? 'true' : undefined}
					aria-describedby={errors.name ? 'name-error' : undefined}
				/>
				<FieldError id="name-error" message={errors.name} />
			</div>

			<div class="formGroup">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					onblur={validateEmailField}
					oninput={() => clearError('email')}
					required
					aria-invalid={errors.email ? 'true' : undefined}
					aria-describedby={errors.email ? 'email-error' : undefined}
				/>
				<FieldError id="email-error" message={errors.email} />
			</div>

			<div class="formGroup">
				<label for="phone">Phone</label>
				<PhoneInput
					id="phone"
					required
					bind:this={phoneInput}
					bind:value={formData.phone}
					oninput={() => clearError('phone')}
				/>
			</div>

			<div class="formGroup">
				<label for="message">Message</label>
				<textarea
					id="message"
					bind:value={formData.message}
					onblur={validateMessage}
					oninput={() => clearError('message')}
					rows="6"
					required
					aria-invalid={errors.message ? 'true' : undefined}
					aria-describedby={errors.message ? 'message-error' : undefined}
				></textarea>
				<FieldError id="message-error" message={errors.message} />
			</div>

			<button class="submitButton" type="submit" disabled={status.sending}>
				{status.sending ? 'Sending...' : 'Send Message'}
			</button>

			<FieldError message={status.error ?? ''} />
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

	.contactContainer {
		width: calc(100% - 3rem);
		max-width: 600px;
		margin: 0 auto 11rem;
		padding: 0 1rem;
		grid-area: content / content;
	}

	.contactForm {
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

	.submitButton {
		width: 100%;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		background: var(--titleColor);

		border: none;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 600;
		transition: all 0.3s ease-in-out;
		margin-top: 1rem;
	}

	.submitButton:hover:not(:disabled) {
		background: var(--accentColor);
		transform: scale(1.02);
	}

	.submitButton:disabled {
		background: var(--secondaryColor);
		color: var(--textColor);
		cursor: not-allowed;
		transform: none;
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
