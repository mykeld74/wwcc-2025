declare global {
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
