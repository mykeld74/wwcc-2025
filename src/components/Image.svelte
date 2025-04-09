<script>
	let { source, altTag, width = 'auto', class: className = '' } = $props();

	let src = `https://res.cloudinary.com/mykeld74/image/upload/f_auto,q_auto,w_${width}/WestwoodsCC/${source}`;
</script>

<img {src} alt={altTag} class="{source} {className}" loading="lazy" />

<style>
	img {
		width: 100%;
	}
</style>
