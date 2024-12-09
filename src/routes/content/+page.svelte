<script>
	let { data, Events } = $props();
	import { Card } from '$components';

	const events = data.Events;

	console.log(events);
</script>

{#snippet cardContent()}
	<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
	<p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
{/snippet}

<div class="content">
	<h1>Content</h1>

	<p>This is the content page.</p>

	<Card
		title="Card 1"
		description="This is a card"
		image="https://picsum.photos/200/300"
		{cardContent}
	>
		<p>this is a card</p>
	</Card>
</div>

<style>
	.content {
		grid-area: content;
	}
</style>
