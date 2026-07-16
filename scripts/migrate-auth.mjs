import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];
if (!DATABASE_URL) {
	console.error('DATABASE_URL required');
	process.exit(1);
}

const sql = neon(DATABASE_URL);

const statements = [
	'DROP TABLE IF EXISTS sessions CASCADE',
	'DROP TABLE IF EXISTS users CASCADE',
	`CREATE TABLE users (
		id TEXT PRIMARY KEY,
		name TEXT NOT NULL,
		email TEXT NOT NULL UNIQUE,
		email_verified BOOLEAN NOT NULL DEFAULT false,
		image TEXT,
		role TEXT DEFAULT 'prayer_team',
		banned BOOLEAN DEFAULT false,
		ban_reason TEXT,
		ban_expires INTEGER,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE sessions (
		id TEXT PRIMARY KEY,
		user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		token TEXT NOT NULL UNIQUE,
		expires_at TIMESTAMP NOT NULL,
		ip_address TEXT,
		user_agent TEXT,
		impersonated_by TEXT,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE accounts (
		id TEXT PRIMARY KEY,
		user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
		account_id TEXT NOT NULL,
		provider_id TEXT NOT NULL,
		access_token TEXT,
		refresh_token TEXT,
		access_token_expires_at TIMESTAMP,
		refresh_token_expires_at TIMESTAMP,
		scope TEXT,
		id_token TEXT,
		password TEXT,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`,
	`CREATE TABLE verifications (
		id TEXT PRIMARY KEY,
		identifier TEXT NOT NULL,
		value TEXT NOT NULL,
		expires_at TIMESTAMP NOT NULL,
		created_at TIMESTAMP NOT NULL DEFAULT NOW(),
		updated_at TIMESTAMP NOT NULL DEFAULT NOW()
	)`
];

for (const stmt of statements) {
	console.log(`Running: ${stmt.substring(0, 50)}...`);
	await sql(stmt);
}

console.log('Migration complete!');
