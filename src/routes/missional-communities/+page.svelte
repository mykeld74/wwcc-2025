<script>
	import mcs from '$data/mcs';
	import { McCard } from '$components';
	import { Image } from '$components';
</script>

<svelte:head>
	<meta
		name="description"
		content="Join a Missional Community at Westwoods Community Church. Connect, serve, and grow in small groups that do life together through learning, serving, and celebrating."
	/>
</svelte:head>

<div class="outerMcWrapper">
	<div class="mcLogoWrapper">
		<Image source="mcLogo" altTag="Missional Communities Logo" />
	</div>
	<div class="mcsWrapper">
		<h1 class="pageTitle">Join a Missional Community!</h1>
		<p class="pageDescription">
			We think that the best learning and life change occurs in small groups of people doing life
			together and that's what our missional communities (MCs) are all about! Check out these
			communities currently meeting. Reach out and see when and where they are meeting next!
		</p>
		{#each mcs as mc}
			<McCard cardContent={mc} />
		{/each}
		<p class="pageDescription">
			Missional Communities (MCs) are groups serving together, praying together and sharing life
			together. Each group will rotate through learning, serving and celebrating during each month.
			Call to find out what this week's rotation will be and where to meet.
		</p>
	</div>
</div>

<style>
	.mcsWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
		gap: 1rem 3rem;
		max-width: 1000px;
		margin: 0 auto;
	}
	.outerMcWrapper {
		background: url('https://res.cloudinary.com/mykeld74/image/upload/f_auto,q_auto/WestwoodsCC/mcBackground')
			no-repeat 50% 50% / cover;
		background-attachment: fixed;
		min-height: calc(100vh - 50px);
		width: 100vw;
		grid-area: content;
		padding-inline: 1rem;
		padding-bottom: 100px;
		position: relative;
		z-index: 1;
		&:after {
			content: '';
			position: absolute;
			inset: 0;
			background: var(--cardBackground);
			z-index: -1;
		}
	}
	.mcLogoWrapper {
		width: calc(100% - 2rem);
		max-width: 400px;
		margin: 2rem auto;
	}
	.pageTitle,
	.pageDescription {
		grid-column: 1 / -1;
	}
</style>
