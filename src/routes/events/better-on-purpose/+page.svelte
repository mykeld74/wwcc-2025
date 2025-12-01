<script>
	import { Image } from '$components';
	import { slide } from 'svelte/transition';

	const faqs = [
		{
			question: 'Is it just for married couples or can engaged couples come as well?',
			answer: 'It is focused toward married couples but would be good for engaged couples as well!'
		},
		{
			question: "Is there an online option if we can't make it to Denver?",
			answer: "Sorry due to the conversational nature of the event - streaming isn't possible"
		},
		{
			question: 'Is there childcare available?',
			answer: 'Sorry, childcare is not available for this event'
		}
	];

	let openIndex = $state(null);

	function toggleFaq(index) {
		openIndex = openIndex === index ? null : index;
	}
</script>

<svelte:head>
	<title>Better On Purpose - A Day For Marriage | Westwoods Community Church</title>
	<meta
		name="description"
		content="Better On Purpose: A one-day marriage event at Westwoods Community Church. Join couples from across the country for great teaching, honest conversations, and time to reconnect."
	/>
</svelte:head>

<div class="contentWrapper">
	<div class="imageWrapper">
		<Image source="marriage" alt="Better On Purpose - A Day For Marriage" />
	</div>

	<a
		href="https://westwoods.churchcenter.com/registrations/events/3306711"
		class="registerButton"
		target="_blank"
	>
		<p class="registerButtonText">Register Here</p>
	</a>

	<div class="cardWrapper event">
		<div class="contentCard">
			<h2 class="contentCardTitle">Your marriage is worth 1 day!</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						Put the health of your marriage on the calendar! A one day investment that will pay off
						the rest of your lives!
					</p>
					<p class="contentCardText">
						It is doable, it is safe, it is casual, it is practical and it is hopeful!
					</p>
					<p class="contentCardText">
						Join couples from across the country for a one-day reset for your marriage—great
						teaching, honest conversations, and time to look back, look forward and reconnect.
					</p>
				</div>
			</div>
		</div>

		<div class="contentCard">
			<h2 class="contentCardTitle">Event Details</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						<span class="cardAccent">Date:</span> Saturday, January 31, 2025
					</p>
					<p class="contentCardText">
						<span class="cardAccent">Time:</span> 9:00 AM - 5:30 PM
					</p>
					<p class="contentCardText">
						<span class="cardAccent">Location:</span> Westwoods Community Church
					</p>
					<p class="contentCardText">
						After the event, go on a dinner date with your spouse (we will give you some tips)!
					</p>
				</div>
			</div>
		</div>

		<div class="contentCard">
			<h2 class="contentCardTitle">Schedule</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<ul class="scheduleList">
						<li>
							<span class="scheduleTime">8:30 AM</span> – Arrival / Breakfast / Coffee
						</li>
						<li>
							<span class="scheduleTime">9:00 AM</span> – Session 1: Where are we?
						</li>
						<li>
							<span class="scheduleTime">10:45 AM</span> – Session 2: Where are we going?
						</li>
						<li>
							<span class="scheduleTime">12:00 PM</span> – Catered Lunch and sharing
						</li>
						<li>
							<span class="scheduleTime">1:00 PM</span> – Session 3: How do we get there?
						</li>
						<li>
							<span class="scheduleTime">3:00 PM</span> – Session 4: How deeply can we be connected on
							the journey?
						</li>
						<li>
							<span class="scheduleTime">4:30 PM</span> – Couples Celebration / Encouragement
						</li>
						<li>
							<span class="scheduleTime">5:30 PM</span> – Closing Prayer / Sending - Dinner Date Night
							(on your own)
						</li>
					</ul>
				</div>
			</div>
		</div>

		<div class="contentCard">
			<h2 class="contentCardTitle">Cost & Registration</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						<span class="cardAccent">Cost: $60</span>
					</p>
					<p class="contentCardText">
						Includes conference, snacks, lunch and all conference materials
					</p>
				</div>
			</div>
		</div>

		<div class="contentCard">
			<h2 class="contentCardTitle">Your Leaders</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						<span class="cardAccent">Rick and Shanna Schmitz</span> have been married over 40 years and
						bring lots of experience in what to do and even more in what not to do.
					</p>
					<p class="contentCardText">
						They will be joined by other couples in various stages of life to add a great relational
						environment.
					</p>
				</div>
			</div>
		</div>
	</div>

	<div class="faqSection">
		<h2 class="faqTitle">Frequently Asked Questions</h2>
		<div class="faqContainer">
			{#each faqs as faq, index}
				<div class="faqItem">
					<button class="faqQuestion" onclick={() => toggleFaq(index)}>
						<span class="faqQuestionText">{faq.question}</span>
						<span class="faqIcon" class:open={openIndex === index}>+</span>
					</button>
					{#if openIndex === index}
						<div class="faqAnswer" transition:slide>
							<p>{faq.answer}</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>
	</div>

	<a
		href="https://westwoods.churchcenter.com/registrations/events/3306711"
		class="registerButton"
		target="_blank"
	>
		<p class="registerButtonText">Register Here</p>
	</a>
</div>

<style>
	.registerButton {
		background-color: var(--accentColor);
		color: #fff;
		padding: 0.75rem 2.5rem;
		border-radius: 0.25rem;
		margin-block: 2rem;
		width: fit-content;
		display: grid;
		place-items: center;
		margin-inline: auto;
		cursor: pointer;
		transition: all 0.3s ease;
		border-radius: 10px;
		&:hover {
			transform: scale(1.05);
		}
	}
	.registerButtonText {
		font-size: 2.25rem;
		font-weight: 600;
		color: #fff;
		margin: 0;
	}
	.imageWrapper {
		width: 100%;
		max-width: 1200px;
		margin: 0 auto 3rem;
		object-fit: cover;
	}
	.scheduleList {
		list-style: none;
		padding: 0;
		margin: 0;
	}
	.scheduleList li {
		margin-bottom: 1rem;
		font-size: clamp(1.1rem, 2vw, 1.25rem);
		line-height: 1.6;
	}
	.scheduleTime {
		font-weight: 700;
		color: var(--accentColor);
		margin-right: 0.5rem;
	}

	.cardWrapper.event .contentCard {
		width: 100%;
		max-width: 100%;
	}
	.cardWrapper.event .cardContentWrapper {
		grid-template-columns: 1fr;
		padding: 0 3vw;
	}
	.faqSection {
		width: 100%;
		max-width: 1200px;
		margin: 4rem auto 2rem;
		padding: 0 1rem;
	}
	.faqTitle {
		font-size: clamp(2rem, 4vw, 3rem);
		color: var(--titleColor);
		text-align: center;
		margin-bottom: 2rem;
	}
	.faqContainer {
		display: flex;
		flex-direction: column;
		gap: 1rem;
	}
	.faqItem {
		border: 2px solid var(--pageCardBorder);
		border-radius: 0.5rem;
		overflow: hidden;
		background: var(--cardBackground);
	}
	.faqQuestion {
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 1.5rem;
		background: transparent;
		border: none;
		cursor: pointer;
		text-align: left;
		color: var(--textColor);
		transition: background-color 0.3s ease;
		&:hover {
			background-color: oklch(0 0 0 / 0.1);
		}
	}
	.faqQuestionText {
		font-size: clamp(1.1rem, 2vw, 1.25rem);
		font-weight: 600;
		flex: 1;
		padding-right: 1rem;
	}
	.faqIcon {
		font-size: 2rem;
		font-weight: 300;
		line-height: 1;
		color: var(--accentColor);
		transition: transform 0.3s ease;
		flex-shrink: 0;
		&.open {
			transform: rotate(45deg);
		}
	}
	.faqAnswer {
		padding: 0 1.5rem 1.5rem;
		color: var(--textColor);
		p {
			font-size: clamp(1rem, 2vw, 1.15rem);
			line-height: 1.6;
			margin: 0;
		}
	}
</style>
