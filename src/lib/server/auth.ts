import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { admin } from 'better-auth/plugins';
import { createAccessControl } from 'better-auth/plugins/access';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { getRequestEvent } from '$app/server';
import { db } from './db';

const statement = {
	prayerRequest: ['create', 'read', 'update', 'delete', 'list'],
	volunteerOpportunity: ['create', 'read', 'update', 'delete', 'list'],
	informationRequest: ['create', 'read', 'update', 'delete', 'list'],
	contactInformationRequest: ['create', 'read', 'update', 'delete', 'list']
} as const;

const ac = createAccessControl(statement);

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: 'pg',
		usePlural: true
	}),
	emailAndPassword: {
		enabled: true,
		// No public sign-up UI exists; accounts are created by admins
		// (seed script / admin plugin). Without this flag, anyone could
		// self-register via POST /api/auth/sign-up/email.
		disableSignUp: true
	},
	plugins: [
		admin({
			ac,
			roles: {
				admin: ac.newRole({
					prayerRequest: ['create', 'read', 'update', 'delete', 'list'],
					volunteerOpportunity: ['create', 'read', 'update', 'delete', 'list'],
					informationRequest: ['create', 'read', 'update', 'delete', 'list'],
					contactInformationRequest: ['create', 'read', 'update', 'delete', 'list']
				}),
				staff: ac.newRole({
					prayerRequest: ['read', 'update', 'list'],
					volunteerOpportunity: ['read', 'update', 'list'],
					informationRequest: ['read', 'update', 'list'],
					contactInformationRequest: ['read', 'update', 'list']
				}),
				volunteer: ac.newRole({
					volunteerOpportunity: ['read', 'list']
				}),
				prayer_team: ac.newRole({
					prayerRequest: ['read', 'list']
				})
			},
			defaultRole: 'prayer_team'
		}),
		sveltekitCookies(getRequestEvent)
	]
});

export type Auth = typeof auth;
