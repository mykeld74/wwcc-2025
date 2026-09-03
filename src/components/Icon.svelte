<script lang="ts">
	/**
	 * Small stroked icon set for the invite pages. Kept in one file so every
	 * icon shares the same weight and corner treatment - mismatched icons are
	 * the fastest way to make a page feel thrown together.
	 */
	const paths: Record<string, string> = {
		message:
			'M21 15.5a2 2 0 0 1-2 2H8l-4 3.5v-15a2 2 0 0 1 2-2h13a2 2 0 0 1 2 2Z M8.5 9.5h7 M8.5 13h4.5',
		mail: 'M3.5 6.5h17a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-17a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z M3 7l9 6.5L21 7',
		share:
			'M18 8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M6 15a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M18 21a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z M8.2 11.3l7.6-4.1 M8.2 13.7l7.6 4.1',
		copy: 'M9.5 9.5h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1Z M15.5 6.5v-2a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h2',
		check: 'M5 12.5l4.5 4.5L19 7.5',
		calendar:
			'M4.5 6.5h15a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1h-15a1 1 0 0 1-1-1v-12a1 1 0 0 1 1-1Z M3.5 10.5h17 M8 3.5v4 M16 3.5v4',
		heart:
			'M12 20s-7.5-4.6-7.5-9.5a4.2 4.2 0 0 1 7.5-2.6 4.2 4.2 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z',
		users:
			'M15.5 20v-1.5a4 4 0 0 0-4-4h-4a4 4 0 0 0-4 4V20 M9.5 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7 M20.5 20v-1.5a4 4 0 0 0-3-3.87 M16 4.13a4 4 0 0 1 0 7.75',
		clock: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z M12 7.5V12l3 2',
		pin: 'M12 21s7-5.686 7-11a7 7 0 1 0-14 0c0 5.314 7 11 7 11Z M12 10.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
		child:
			'M12 7.5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z M12 9.5c-2.2 0-3.5 1.2-3.5 3v2.5h1.2l.5 5h3.6l.5-5h1.2V12.5c0-1.8-1.3-3-3.5-3Z',
		cup: 'M6 4.5h10v6a5 5 0 0 1-10 0v-6Z M16 6h1.75a2.25 2.25 0 0 1 0 4.5H16 M4.5 20.5h13',
		shirt: 'M8.5 3.5 12 6l3.5-2.5 4 2.2-2 4-1.5-.8V20h-8V8.9l-1.5.8-2-4Z',
		car: 'M5 17h14 M6.5 17v1.5a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V17 M21 17v1.5a1 1 0 0 1-1 1h-1.5a1 1 0 0 1-1-1V17 M3.5 17v-4.2a2 2 0 0 1 .15-.76l1.72-4.13A2 2 0 0 1 7.22 6.7h9.56a2 2 0 0 1 1.85 1.23l1.72 4.12a2 2 0 0 1 .15.76V17 M4 12.5h16 M6.75 14.75h1 M16.25 14.75h1',
		sparkle: 'M12 3.5l2 5.5 5.5 2-5.5 2-2 5.5-2-5.5L4.5 11l5.5-2Z',
		arrow: 'M4.5 12h15 M13.5 6l6 6-6 6'
	};

	let {
		name,
		size = 20,
		stroke = 1.6,
		class: className = ''
	}: {
		name: keyof typeof paths | string;
		size?: number;
		stroke?: number;
		class?: string;
	} = $props();

	const d = $derived(paths[name] ?? paths.sparkle);
</script>

<svg
	width={size}
	height={size}
	viewBox="0 0 24 24"
	fill="none"
	stroke="currentColor"
	stroke-width={stroke}
	stroke-linecap="round"
	stroke-linejoin="round"
	aria-hidden="true"
	class={className}
>
	{#each d.split(' M') as segment, i (i)}
		<path d={i === 0 ? segment : `M${segment}`} />
	{/each}
</svg>
