<script>
	import { Image } from '$components';
	import { slide } from 'svelte/transition';
</script>

<svelte:head>
	<title>Sacred Marriage | Westwoods Community Church</title>
	<meta
		name="description"
		content="What if God designed marriage to make you holy instead of happy? What if your relationship isn't as much about you and your spouse as it is about you and God?"
	/>
</svelte:head>

<div class="contentWrapper">
	<div class="pageHero">
		<div class="imageWrapper">
			<Image source="SacredMarriage" alt="Sacred Marriage" />
		</div>
		<div class="pageHeroText">
			<h1 class="pageHeroTitle">Sacred Marriage</h1>
			<p class="pageHeroDescription">
				What if God designed marriage to make you holy instead of happy? What if your relationship
				isn't as much about you and your spouse as it is about you and God?
			</p>
		</div>
	</div>

	<a
		href="https://westwoods.churchcenter.com/people/forms/1122661"
		class="registerButton"
		target="_blank"
	>
		<p class="registerButtonText">Register Here</p>
	</a>

	<div class="cardWrapper event">
		<div class="contentCard">
			<h2 class="contentCardTitle">Marriage can be hard</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						Whether you've been married for 50 years or 10 days, marriage can be hard. You likely
						entered into marriage with a set of expectations that were not met, and so did your
						spouse. During this 8 week study, we will talk about what it means to be in a sacred
						marriage, and how to navigate the hard times. But more importantly, we will examine what
						God's design for marriage is, and how to live it out.
					</p>
					<p class="contentCardText">
						We will be using the book Sacred Marriage by Gary Thomas as our guide. But our goal is
						to have real conversations about our marriages, share the struggles, celebrate the
						triumphs, and learn how we can grow in our marriage together.
					</p>
				</div>
			</div>
		</div>

		<div class="contentCard">
			<h2 class="contentCardTitle">Study Details</h2>
			<div class="cardContentWrapper">
				<div class="cardContent">
					<p class="contentCardText">
						<span class="cardAccent">When:</span> Friday's, February 6th - March 27th
					</p>
					<p class="contentCardText">
						<span class="cardAccent">Time:</span> 6:30 PM - 8:00 PM
					</p>
					<p class="contentCardText">
						<span class="cardAccent">Location:</span> The Daugherty's Home
					</p>

					<p class="contentCardText">
						You can purchase the book here: <a
							href="https://www.amazon.com/Sacred-Marriage-What-Designed-Happy/dp/0310337372?sr=8-1"
							target="_blank">Sacred Marriage by Gary Thomas</a
						>
					</p>
					<a
						href="https://westwoods.churchcenter.com/people/forms/1122661"
						class="registerButton"
						target="_blank"
					>
						<p class="registerButtonText">Register Here</p>
					</a>
				</div>
			</div>
		</div>
	</div>
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
	.pageHero {
		display: grid;
		grid-template-columns: 1fr 2fr;
		gap: 2rem;
		padding-top: 5rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	.pageHeroText {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.pageHeroTitle {
		font-size: 4rem;
		font-weight: 700;
		color: var(--titleColor);
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
