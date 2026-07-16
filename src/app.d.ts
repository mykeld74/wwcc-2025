declare global {
	interface Window {
		turnstile?: {
			render: (
				container: HTMLElement,
				options: {
					sitekey: string;
					theme?: 'auto' | 'light' | 'dark';
				}
			) => string;
			reset: () => void;
			remove: (widgetId: string) => void;
		};
	}

	namespace App {
		interface Locals {
			session: {
				id: string;
				userId: string;
				token: string;
				expiresAt: Date;
			} | null;
			user: {
				id: string;
				name: string;
				email: string;
				emailVerified: boolean;
				image: string | null;
				role: string | null;
				banned: boolean | null;
				createdAt: Date;
				updatedAt: Date;
			} | null;
		}
	}
}

export {};
