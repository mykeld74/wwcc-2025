// Environment configuration
export const config = {
	// Google Analytics Measurement ID (GA4)
	// Replace with your actual GA4 measurement ID
	googleAnalyticsId: import.meta.env.VITE_GOOGLE_ANALYTICS_ID || 'G-XXXXXXXXXX',

	// Other environment variables can be added here
	environment: import.meta.env.MODE,
	isProduction: import.meta.env.PROD
};

// Log configuration in development
if (import.meta.env.DEV) {
	console.log('Environment config:', {
		googleAnalyticsId: config.googleAnalyticsId,
		environment: config.environment,
		isProduction: config.isProduction
	});
}
