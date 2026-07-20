import { pgTable, text, timestamp, boolean, serial, varchar, integer } from 'drizzle-orm/pg-core';

// ── Better Auth core tables ──

export const users = pgTable('users', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	emailVerified: boolean('email_verified').notNull().default(false),
	image: text('image'),
	role: text('role').default('prayer_team'),
	banned: boolean('banned').default(false),
	banReason: text('ban_reason'),
	banExpires: integer('ban_expires'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const sessions = pgTable('sessions', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	token: text('token').notNull().unique(),
	expiresAt: timestamp('expires_at').notNull(),
	ipAddress: text('ip_address'),
	userAgent: text('user_agent'),
	impersonatedBy: text('impersonated_by'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const accounts = pgTable('accounts', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => users.id, { onDelete: 'cascade' }),
	accountId: text('account_id').notNull(),
	providerId: text('provider_id').notNull(),
	accessToken: text('access_token'),
	refreshToken: text('refresh_token'),
	accessTokenExpiresAt: timestamp('access_token_expires_at'),
	refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
	scope: text('scope'),
	idToken: text('id_token'),
	password: text('password'),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

export const verifications = pgTable('verifications', {
	id: text('id').primaryKey(),
	identifier: text('identifier').notNull(),
	value: text('value').notNull(),
	expiresAt: timestamp('expires_at').notNull(),
	createdAt: timestamp('created_at').notNull().defaultNow(),
	updatedAt: timestamp('updated_at').notNull().defaultNow()
});

// ── Application tables ──

export const prayerRequests = pgTable('prayer_requests', {
	id: serial('id').primaryKey(),
	request: text('request').notNull(),
	firstName: varchar('first_name', { length: 255 }),
	lastName: varchar('last_name', { length: 255 }),
	email: varchar('email', { length: 255 }),
	isStaffOnly: boolean('is_staff_only').default(false).notNull(),
	submittedAt: timestamp('submitted_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const volunteerOpportunities = pgTable('volunteer_opportunities', {
	id: serial('id').primaryKey(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	team: text('team').notNull(),
	sendTo: varchar('send_to', { length: 255 }).notNull(),
	department: varchar('department', { length: 255 }).notNull(),
	message: text('message'),
	addressed: boolean('addressed').default(false).notNull(),
	submittedAt: timestamp('submitted_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const informationRequestTypes = pgTable('information_request_types', {
	id: serial('id').primaryKey(),
	label: varchar('label', { length: 255 }).notNull().unique(),
	isActive: boolean('is_active').default(true).notNull(),
	sortOrder: integer('sort_order').default(0).notNull(),
	createdAt: timestamp('created_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});

export const informationRequests = pgTable('information_requests', {
	id: serial('id').primaryKey(),
	requestTypeId: integer('request_type_id').references(() => informationRequestTypes.id, {
		onDelete: 'set null'
	}),
	requestTypeLabel: varchar('request_type_label', { length: 255 }).notNull(),
	name: varchar('name', { length: 255 }).notNull(),
	email: varchar('email', { length: 255 }).notNull(),
	phone: varchar('phone', { length: 20 }),
	message: text('message').notNull(),
	addressed: boolean('addressed').default(false).notNull(),
	submittedAt: timestamp('submitted_at').defaultNow().notNull(),
	updatedAt: timestamp('updated_at').defaultNow().notNull()
});
