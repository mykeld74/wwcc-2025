<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isReady = $state(false);

	let showVolunteerKickoff = $state(true);

	// show volunteer kickoff dialog on page load

	onMount(() => {
		isReady = true;
		showVolunteerKickoff = true;
	});

	// Show the volunteer kickoff dialog after the component renders
	$effect(() => {
		if (isReady && showVolunteerKickoff) {
			// Use a small delay to ensure the DOM is fully rendered
			setTimeout(() => {
				const dialog = document.getElementById('wwKidsVolunteerKickoff');
				console.log(dialog);
				if (dialog) {
					dialog.showModal();

					// Add click event listener to backdrop to close dialog
					dialog.addEventListener('click', (event) => {
						if (event.target === dialog) {
							dialog.close();
						}
					});
				}
			}, 100);
		}
	});
</script>

<svelte:head>
	<meta
		name="description"
		content="Westwoods Kids provides a safe, fun, and loving environment for children to learn about Jesus. Discover our core values and how we serve families every Sunday."
	/>
</svelte:head>

{#if isReady}
	<div class="titleContainer">
		<h1 class="heroTitle">Welcome to Westwoods Kids</h1>
		<p class="heroSubtitle">
			Transforming our Next Generation with the Love of Jesus One Friend at a Time
		</p>
	</div>

	<div class="wwKidsCoreValues">
		<h2 class="coreValuesTitle">Westwoods Kids core values are:</h2>

		<div class="wwKidsCoreValue cv1" transition:fade={{ duration: 500 }}>
			<p class="valueTitle">We will know and love your child well.</p>
			<p class="valueDescription">
				Our amazing volunteers will provide a safe and exciting place for kids to learn and have
				fun. Please let us know if you have any concerns that will help us serve your family best.
			</p>
		</div>

		<div class="wwKidsCoreValue cv2" transition:fade={{ duration: 500, delay: 250 }}>
			<p class="valueTitle">We will teach your child about the love of Jesus.</p>
			<p class="valueDescription">
				We want kids to leave each Sunday learning something new about Jesus’ amazing love for them.
			</p>
		</div>

		<div class="wwKidsCoreValue cv3" transition:fade={{ duration: 500, delay: 500 }}>
			<p class="valueTitle">We will value your child’s safety.</p>
			<p class="valueDescription">
				When you check in, you’ll receive a security tag to bring with you to pick up your child. If
				we need to contact you during service, we’ll text you at the number you provide.
			</p>
		</div>
		<div class="wwKidsCoreValue cv4" transition:fade={{ duration: 500, delay: 500 }}>
			<p class="valueTitle">We Believe</p>
			<p class="valueDescription">
				We believe real life change happens in relationships and our classes are set up to foster
				peer to peer friendships and volunteer connection for children to be known and connected.
			</p>
			<p class="valueDescription">
				We further believe that what we are doing in Westwoods Kids is as much church as people
				attending our main service in the auditorium. It is more than kid care and those serving are
				not "missing out on church," but truly we are getting to engage church with the next
				generation as we all learn together the invitations to life found in the way of Jesus.
			</p>
		</div>
	</div>
	<div class="applicationButtons">
		<button class="applicationButton" popovertarget="wwKidsApplication"
			>Apply to volunteer with Westwoods Kids</button
		>
		<a
			href="https://westwoods.churchcenter.com/registrations/events/3071040"
			target="_blank"
			class="applicationButton">Register for Volunteer Kickoff</a
		>
	</div>
	<dialog id="wwKidsApplication" class="contactModal wwKidsApplication" popover>
		<h2 class="applicationTitle">Westwoods Kids Application</h2>
		<iframe
			src="https://docs.google.com/forms/d/e/1FAIpQLScE5b6Y2hYFq0ytvY9o4jhZ_NQovJJXHdIqaMwLT1oSt5Fe1w/viewform?embedded=true"
			style="min-height: 70vh; width: 100%;"
			frameborder="0"
			marginheight="0"
			marginwidth="0">Loading…</iframe
		>
	</dialog>

	<!-- <dialog id="wwKidsVolunteerKickoff" class=" wwKidsVolunteerKickoffmodal">
		<div class="wwKidsVolunteerKickoffContent">
			<button
				class="closeButton"
				on:click={() => document.getElementById('wwKidsVolunteerKickoff')?.close()}
				aria-label="Close dialog"
			>
				×
			</button>
			<h2 class="pageTitle">Westwoods Kids Volunteer Kickoff</h2>
			<p class="wwKidsVolunteerKickoffDescription">
				Please join us for our Westwoods Kids Volunteer Kickoff. We will provide lunch and
				childcare.
			</p>
			<p class="wwKidsVolunteerKickoffDescription">
				Date: Sunday, September 7th Time: 11:00 AM - 2:30 PM Location: Westwoods Community Church
			</p>
			<p class="wwKidsVolunteerKickoffDescription">
				This is our yearly mandatory training for all Westwoods’ Kids volunteers. Please contact
				your room leader and Kayla as soon as possible if you are unable to attend.
			</p>
			<p class="wwKidsVolunteerKickoffDescription">
				Please fill out the form below to get started.
			</p>
			<a
				href="https://westwoods.churchcenter.com/registrations/events/3071040"
				target="_blank"
				class="wwKidsVolunteerKickoffButton"
				on:click={() => document.getElementById('wwKidsVolunteerKickoff')?.close()}>Register Here</a
			>
		</div>
	</dialog> -->
{/if}

<style>
	@keyframes fadeIn {
		from {
			opacity: 0;
			scale: 0.7;
		}
		to {
			opacity: 1;
			scale: 1;
		}
	}
	.wwKidsCoreValues {
		margin: 0 auto;
		max-width: 1200px;
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(min(450px, 100%), 1fr));
		gap: 1.5rem;
	}
	.wwKidsCoreValue {
		padding: 1rem;

		border-radius: 0.5rem;
	}
	.cv1 {
		background: #40619d;
		will-change: transform, opacity, scale;
		animation: fadeIn 1s ease-in-out forwards;
		opacity: 0;
	}
	.cv2 {
		background: #4d1434;
		will-change: transform, opacity, scale;
		animation: fadeIn 1s ease-in-out forwards;
		animation-delay: 0.25s;
		opacity: 0;
	}
	.cv3 {
		background: #b2324b;
		will-change: transform, opacity, scale;
		animation: fadeIn 1s ease-in-out forwards;
		animation-delay: 0.5s;
		opacity: 0;
		grid-column: 1 / -1;
	}
	.cv4 {
		background: #66b1ce;
		will-change: transform, opacity, scale;
		animation: fadeIn 1s ease-in-out forwards;
		animation-delay: 0.75s;
		opacity: 0;
		grid-column: 1 / -1;
	}

	.coreValuesTitle {
		grid-column: 1 / -1;
	}
	.valueTitle {
		font-size: 1.75rem;
		line-height: 1.25;
		font-weight: 600;
		color: #fff;
	}
	.valueDescription {
		font-size: 1.25rem;
		line-height: 1.5;
		color: #fff;
	}
	.titleContainer {
		text-align: center;
	}
	.heroTitle {
		font-size: clamp(2rem, 5vw, 4rem);
		margin: 2rem 0 0;
	}
	.heroSubtitle,
	.coreValuesTitle {
		font-size: clamp(1.25rem, 2.5vw, 2rem);
		text-wrap: balance;
		margin: 0 0 2rem;
	}
	.coreValuesTitle {
		margin: 0;
	}
	.wwKidsApplication {
		min-height: 80vh;
	}
	.applicationButton {
		margin: 2rem auto;
		display: block;
		padding: 1rem 2rem;
		border-radius: 0.5rem;
		background: #40619d;
		color: #fff;
		border: none;
		cursor: pointer;
		font-size: 1.25rem;
		font-weight: 600;
		transition: all 0.3s ease-in-out;
		width: 100%;
		text-align: center;
		&:hover {
			background: #4d1434;
			scale: 1.05;
		}
	}
	.applicationButtons {
		display: flex;

		gap: 3rem;
	}

	/* Westwoods Kids Volunteer Kickoff Modal Styles */
	.wwKidsVolunteerKickoffmodal {
		opacity: 0;
		scale: 0.5;
		background: var(--backgroundColor);
		color: var(--textColor);
		width: calc(100vw - 2rem);
		height: fit-content;
		max-height: 80svh;
		max-width: 800px;
		border-radius: 1rem;
		padding: 2rem;
		border: 2px solid var(--accentColor);
		box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
		transition: all 0.5s ease-in-out;
		transition-behavior: allow-discrete;
	}

	.wwKidsVolunteerKickoffmodal::backdrop {
		opacity: 0;
		background: oklch(0 0 0 / 0.5);
		backdrop-filter: blur(5px);
		transition: opacity 0.25s ease-in-out;
		transition-behavior: allow-discrete;
	}

	.wwKidsVolunteerKickoffmodal[open] {
		opacity: 1;
		scale: 1;
	}

	.wwKidsVolunteerKickoffmodal[open]::backdrop {
		opacity: 1;
	}

	.wwKidsVolunteerKickoffContent {
		text-align: center;
		position: relative;
	}

	.closeButton {
		position: absolute;
		top: -10px;
		right: -10px;
		width: 30px;
		height: 30px;
		border-radius: 50%;
		background: var(--accentColor);
		color: #fff;
		border: none;
		cursor: pointer;
		font-size: 20px;
		font-weight: bold;
		display: flex;
		align-items: center;
		justify-content: center;
		transition: all 0.3s ease-in-out;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
	}

	.closeButton:hover {
		background: var(--contrastColor);
		transform: scale(1.1);
		box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
	}

	.wwKidsVolunteerKickoffContent .pageTitle {
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		color: var(--accentColor);
		margin: 0 0 1.5rem;
		font-weight: 600;
	}

	.wwKidsVolunteerKickoffDescription {
		font-size: 1.1rem;
		line-height: 1.6;
		margin: 0 0 1rem;
		color: var(--textColor);
	}

	.wwKidsVolunteerKickoffButton {
		display: inline-block;
		margin: 1.5rem 0 0;
		padding: 1rem 2rem;
		background: var(--accentColor);
		color: #fff;
		text-decoration: none;
		border-radius: 0.5rem;
		font-size: 1.1rem;
		font-weight: 600;
		transition: all 0.3s ease-in-out;
		border: 2px solid transparent;
	}

	.wwKidsVolunteerKickoffButton:hover {
		background: var(--contrastColor);
		transform: translateY(-2px);
		box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
	}
</style>
