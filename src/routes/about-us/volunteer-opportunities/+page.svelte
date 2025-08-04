<script>
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';
	import Opportunities from '$data/volunteerOpportunies.js';
	import { enhance } from '$app/forms';
	import IMask from 'imask';
	import { Card } from '$components';
	const maskConfig = { mask: '(000) 000-0000' };
	let Team = '';
	let Title = '';
	let isPopoverOpen = false;

	let formData = {
		name: '',
		email: '',
		phone: '',
		team: `Please contact me about volunteering for ${Title}.`,
		sendTo: '',
		department: Title,
		message: ''
	};

	let status = {
		submitting: false,
		message: '',
		success: false
	};

	function handleSubmit() {
		status.submitting = true;
		return async ({ result }) => {
			status.submitting = false;
			if (result.type === 'success') {
				status.success = true;
				status.message =
					'Thank you! Your message has been sent successfully. We will contact you soon.';
				// Reset form on success
				formData = {
					name: '',
					email: '',
					phone: '',
					team: `Please contact me about volunteering for ${Title}.`,
					sendTo: Team,
					department: Title,
					message: ''
				};
				setTimeout(() => {
					status.success = false;
					status.message = '';
					document.getElementById('ContactModal').hidePopover();
				}, 3500);
			} else {
				status.success = false;
				status.message = 'There was an error sending your message. Please try again.';
				setTimeout(() => {
					status.message = '';
				}, 2500);
			}
		};
	}

	onMount(() => {
		const cardButtons = document.querySelectorAll('.cardButton');
		const contactModal = document.getElementById('ContactModal');

		cardButtons.forEach((button) => {
			button.addEventListener('click', () => {
				Team = button.dataset.team;
				Title = button.dataset.title;
				contactModal.showPopover();
				isPopoverOpen = true;
			});
		});

		contactModal.addEventListener('toggle', (event) => {
			isPopoverOpen = event.newState === 'open';
			document.body.style.overflow = isPopoverOpen ? 'hidden' : '';
		});
	});
</script>

<div class="contentWrapper" class:blurred={isPopoverOpen}>
	<h1 class="pageTitle">Volunteer Opportunities</h1>
	<div class="volunteerOpportunitiesContainer">
		<div class="volunteerOpportunitiesWrapper">
			{#each Opportunities as opportunity}
				<Card cardContent={opportunity} />
			{/each}
		</div>
	</div>
</div>

<dialog id="ContactModal" class="contactModal" popover>
	<div class="contactModalContent">
		<h2 class="contactModalTitle">{Title}</h2>
		<p class="contactModalDisclaimer">
			Please fill out the form below to express your interest in volunteering for {Title} and you will
			be contacted by a member of the {Title} team. This is not a commitment to volunteer, but an opportunity
			to express your interest.
		</p>
		{#if status.message}
			<div
				class="alert"
				class:success={status.success}
				class:error={!status.success}
				transition:fade
			>
				{status.message}
			</div>
		{:else}
			<form method="POST" use:enhance={handleSubmit}>
				<div class="formGroup">
					<label for="name">Name</label>
					<input type="text" id="name" name="name" bind:value={formData.name} required />
				</div>

				<div class="formGroup">
					<label for="email">Email</label>
					<input type="email" id="email" name="email" bind:value={formData.email} required />
				</div>

				<div class="formGroup">
					<label for="phone">Phone</label>
					<input
						type="tel"
						id="phone"
						name="phone"
						required
						use:IMask={maskConfig}
						bind:value={formData.phone}
					/>
				</div>

				<div class="formGroup">
					<label for="message">Message (optional)</label>
					<textarea id="message" name="message" bind:value={formData.message} rows="5"></textarea>
				</div>

				<input
					type="hidden"
					name="team"
					value={`Please contact me about volunteering for ${Title}.`}
				/>
				<input type="hidden" name="sendTo" value={Team} />
				<input type="hidden" name="department" value={Title} />

				<button type="submit" class="submitButton" disabled={status.submitting}>
					{status.submitting ? 'Sending...' : 'Send Message'}
				</button>
			</form>
		{/if}
	</div>
</dialog>

<style>
	.volunteerOpportunitiesContainer {
		width: calc(100% - 3rem);
		margin: 0 auto;
		max-width: 1100px;
		grid-area: content;
	}
	.volunteerOpportunitiesWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
		gap: 3rem;
		margin-top: 2rem;

		margin: 0 auto;
		grid-area: content;
	}
	.formGroup {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin-bottom: 1rem;
	}
	input,
	textarea {
		padding: 0.75rem;
		border-radius: 0.25rem;
		border: 1px solid var(--borderColor);
		font-size: 1rem;
	}
	.submitButton {
		width: 100%;
		background: var(--accentColor);
		color: var(--textColor);
		padding: 0.75rem 1.5rem;
		border-radius: 0.25rem;
		border: none;
		font-size: 2rem;
		font-weight: 600;
		cursor: pointer;
		transition: all 0.3s ease-in-out;
		margin-top: 1.5rem;
		&:hover {
			background: var(--accentColor);
			color: var(--backgroundColor);
		}
	}
	label {
		font-size: 1.25rem;
		font-weight: 600;
	}
	.blurred {
		filter: blur(2px);
		pointer-events: none;
		user-select: none;
	}
	.contactModalTitle {
		text-align: center;
		text-decoration: underline;
		margin-bottom: 1rem;
		font-size: 2.5rem;
	}
	.contactModalDisclaimer {
		font-size: 1.25rem;
	}

	.alert {
		padding: 1rem;
		border-radius: 0.5rem;
		margin-bottom: 1rem;
		font-size: 1.1rem;
		font-weight: 500;
		text-align: center;
	}

	.alert.success {
		background: rgba(34, 197, 94, 0.1);
		color: #16a34a;
		border: 1px solid #16a34a;
	}

	.alert.error {
		background: rgba(239, 68, 68, 0.1);
		color: #dc2626;
		border: 1px solid #dc2626;
	}
</style>
