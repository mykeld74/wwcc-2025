<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let isReady = $state(false);

	onMount(() => {
		isReady = true;
	});
</script>

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
	</div>
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
</style>
