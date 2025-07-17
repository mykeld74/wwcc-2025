<script lang="ts">
	import IMask from 'imask';
	import { fade } from 'svelte/transition';
	const maskConfig = { mask: '(000) 000-0000' };

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

	let formIsValid = $state(false);
	let errors = $state({
		name: '',
		email: '',
		phone: '',
		message: ''
	});

	async function handleSubmit(e: SubmitEvent) {
		const emailTest = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{1,6}$/;

		if (formData.name.length < 2) {
			formIsValid = false;
			errors.name = 'Please enter your name.';
		} else {
			errors.name = '';
		}

		if (emailTest.test(formData.email) === false) {
			formIsValid = false;
			errors.email = 'Please enter a valid email address.';
		} else {
			errors.email = '';
		}

		if (formData.message.length < 3) {
			formIsValid = false;
			errors.message = 'Please tell us how we can help you.';
		} else {
			errors.message = '';
		}

		if (formData.phone.length < 10) {
			formIsValid = false;
			errors.phone = 'Please enter a valid phone number.';
		} else {
			errors.phone = '';
		}

		e.preventDefault();

		if (!formIsValid) {
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

	function handleInput(field: keyof typeof formData) {
		errors[field] = '';
		formIsValid = true;
	}
</script>

<svelte:head>
	<meta
		name="description"
		content="Contact our mobile phlebotomy team for questions or to learn more about our services. We're here to help with your blood drawing needs."
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
		<form class="contactForm" onsubmit={handleSubmit}>
			<div class="formGroup">
				<label for="name">Name</label>
				<input
					type="text"
					id="name"
					bind:value={formData.name}
					oninput={() => handleInput('name')}
					required
				/>
				{#if errors.name}
					<div class="errorMessage" transition:fade>{errors.name}</div>
				{/if}
			</div>

			<div class="formGroup">
				<label for="email">Email</label>
				<input
					type="email"
					id="email"
					bind:value={formData.email}
					oninput={() => handleInput('email')}
					required
				/>
				{#if errors.email}
					<div class="errorMessage" transition:fade>{errors.email}</div>
				{/if}
			</div>

			<div class="formGroup">
				<label for="phone">Phone</label>
				<input
					use:IMask={maskConfig}
					type="tel"
					id="phone"
					bind:value={formData.phone}
					oninput={() => handleInput('phone')}
					required
				/>
				{#if errors.phone}
					<div class="errorMessage" transition:fade>{errors.phone}</div>
				{/if}
			</div>

			<div class="formGroup">
				<label for="message">Message</label>
				<textarea
					id="message"
					bind:value={formData.message}
					oninput={() => handleInput('message')}
					rows="6"
					required
				></textarea>
				{#if errors.message}
					<div class="errorMessage" transition:fade>{errors.message}</div>
				{/if}
			</div>

			<button class="submitButton" type="submit" disabled={status.sending}>
				{status.sending ? 'Sending...' : 'Send Message'}
			</button>

			{#if status.error}
				<div class="errorMessage" transition:fade>{status.error}</div>
			{/if}
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

	.errorMessage {
		color: #d32f2f;
		background: rgba(211, 47, 47, 0.1);
		padding: 0.75rem;
		border-radius: 0.5rem;
		margin-top: 0.5rem;
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
