<script>
	let { measurementId } = $props();

	// Initialize Google Analytics
	$effect(() => {
		if (typeof window !== 'undefined' && measurementId) {
			// Load Google Analytics script
			const script = document.createElement('script');
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
			document.head.appendChild(script);

			// Initialize gtag
			window.dataLayer = window.dataLayer || [];
			function gtag(...args) {
				window.dataLayer.push(args);
			}
			gtag('js', new Date());
			gtag('config', measurementId, {
				page_title: document.title,
				page_location: window.location.href
			});

			// Make gtag available globally
			window.gtag = gtag;
		}
	});

	console.log('GoogleAnalytics', measurementId);
</script>

<!-- Google Analytics tracking code will be injected here -->
