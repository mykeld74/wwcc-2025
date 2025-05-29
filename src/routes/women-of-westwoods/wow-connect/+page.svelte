<script>
	import { EventCard } from '$components';
	let { data } = $props();
</script>

<div class="contentWrapper">
	<div class="connectIntro">
		<h1>WOW Connect</h1>
		<p>
			The women of Westwoods have many opportunities to connect with each other. Here are the
			upcoming events.
		</p>
	</div>
	<div class="connectEvents">
		<EventCard data={data.Events} />
	</div>
</div>

<style>
	.connectEvents {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 2rem;
	}
</style>
