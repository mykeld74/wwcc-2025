<script>
	let { measurementId } = $props();

	// Initialize Google Analytics
	$effect(() => {
		if (typeof window !== 'undefined' && measurementId && measurementId !== 'G-XXXXXXXXXX') {
			console.log('Initializing Google Analytics with ID:', measurementId);

			// Load Google Analytics script
			const script = document.createElement('script');
			script.async = true;
			script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;

			// Wait for script to load before initializing
			script.onload = () => {
				// Initialize gtag
				window.dataLayer = window.dataLayer || [];
				function gtag(...args) {
					window.dataLayer.push(args);
				}
				gtag('js', new Date());
				gtag('config', measurementId, {
					page_title: document.title,
					page_location: window.location.href,
					debug_mode: import.meta.env.DEV,
					send_page_view: true
				});

				// Send a test pageview
				gtag('event', 'page_view', {
					page_title: document.title,
					page_location: window.location.href,
					page_referrer: document.referrer
				});

				// Make gtag available globally
				window.gtag = gtag;

				// Add test function for debugging
				window.testGA = () => {
					if (window.gtag) {
						window.gtag('event', 'test_event', {
							event_category: 'debug',
							event_label: 'manual_test',
							value: 1
						});
						console.log('Test event sent to Google Analytics');
						return true;
					} else {
						console.error('Google Analytics not available');
						return false;
					}
				};

				// Add detailed debugging function
				window.debugGA = () => {
					console.log('=== Google Analytics Debug Info ===');
					console.log('Measurement ID:', measurementId);
					console.log('Data Layer:', window.dataLayer);
					console.log('Gtag function:', typeof window.gtag);
					console.log('Current URL:', window.location.href);
					console.log('Page Title:', document.title);
					console.log('User Agent:', navigator.userAgent);

					// Check if GA script is loaded
					const gaScript = document.querySelector('script[src*="googletagmanager.com"]');
					console.log('GA Script loaded:', !!gaScript);
					if (gaScript) {
						console.log('GA Script src:', gaScript.src);
					}

					return {
						measurementId,
						dataLayer: window.dataLayer,
						gtagAvailable: typeof window.gtag === 'function',
						scriptLoaded: !!gaScript
					};
				};

				console.log('Google Analytics initialized successfully');
				console.log('You can test tracking by running: testGA() in the console');
				console.log('For detailed debugging, run: debugGA() in the console');
			};

			script.onerror = () => {
				console.error('Failed to load Google Analytics script');
			};

			document.head.appendChild(script);
		} else if (typeof window !== 'undefined') {
			console.warn('Google Analytics not initialized: Invalid or missing Measurement ID');
		}
	});

	console.log('GoogleAnalytics component loaded with ID:', measurementId);
</script>

<!-- Google Analytics tracking code will be injected here -->
