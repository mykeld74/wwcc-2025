<script>
	const navItems = [
		{ label: 'Home', href: '/' },
		{ label: 'Content', href: '/content' }
	];
</script>

<nav>
	<ul>
		{#each navItems as item}
			<li>
				<a href={item.href}>{item.label}</a>
			</li>
		{/each}
	</ul>
</nav>

<style>
	ul {
		display: flex;
		justify-content: flex-start;
		align-items: center;
		gap: 1rem;
		list-style: none;
		a {
			color: var(--textColor);
			text-decoration: none;
		}
	}
</style>
