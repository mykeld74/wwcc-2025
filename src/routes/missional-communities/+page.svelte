<script>
	import mcs from '$data/mcs';
	import { McCard } from '$components';
</script>

<div class="outerMcWrapper">
	<h1 class="pageTitle">Missional Communities</h1>
	<div class="mcsWrapper">
		{#each mcs as mc}
			<McCard cardContent={mc} />
		{/each}
	</div>
</div>

<style>
	.mcsWrapper {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 3rem;
		max-width: 1200px;
		margin: 0 auto;
	}
	.outerMcWrapper {
		background: url('https://res.cloudinary.com/mykeld74/image/upload/f_auto,q_auto/WestwoodsCC/mcBackground')
			no-repeat 100% 100% / cover;
		background-attachment: fixed;
		min-height: calc(100vh - 50px);
		width: 100%;
		grid-area: content;
		padding-bottom: 100px;
	}
</style>
