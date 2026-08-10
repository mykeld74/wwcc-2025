<script>
	let { children } = $props();
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@300..800&display=swap"
		rel="stylesheet"
	/>
	<title>Account | Westwoods Community Church</title>
</svelte:head>

{@render children?.()}

<style>
	:global(body) {
		margin: 0;
		font-family: 'Open Sans', sans-serif;
	}
</style>
