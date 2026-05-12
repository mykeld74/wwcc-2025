import { neon } from '@neondatabase/serverless';

const DATABASE_URL = process.env.DATABASE_URL || process.argv[2];
const ADMIN_EMAIL = process.argv[3] || 'admin@westwoodscc.org';
const ADMIN_PASSWORD = process.argv[4];
const ADMIN_NAME = process.argv[5] || 'Admin';

if (!DATABASE_URL) {
	console.error('Usage: node scripts/seed-admin.mjs <DATABASE_URL> <email> <password> [name]');
	process.exit(1);
}

if (!ADMIN_PASSWORD) {
	console.error('Password is required as the 4th argument');
	process.exit(1);
}

// Better Auth uses bcrypt-style hashing internally, but for seeding
// we'll create the user via the Better Auth API instead of direct DB insert.
// First, let's do a direct signup using the Better Auth server.

const BETTER_AUTH_URL = process.env.BETTER_AUTH_URL || 'http://localhost:5173';

console.log(`Creating admin user: ${ADMIN_EMAIL}`);
console.log(`Using Better Auth at: ${BETTER_AUTH_URL}`);

try {
	// Sign up via Better Auth API
	const signupResponse = await fetch(`${BETTER_AUTH_URL}/api/auth/sign-up/email`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Origin: BETTER_AUTH_URL
		},
		body: JSON.stringify({
			email: ADMIN_EMAIL,
			password: ADMIN_PASSWORD,
			name: ADMIN_NAME
		})
	});

	const result = await signupResponse.json();

	if (!signupResponse.ok) {
		console.error('Signup failed:', result);
		process.exit(1);
	}

	console.log('User created successfully. Setting role to admin...');

	// Update role directly in the database
	const sql = neon(DATABASE_URL);
	await sql`UPDATE users SET role = 'admin' WHERE email = ${ADMIN_EMAIL}`;

	console.log(`Admin user "${ADMIN_NAME}" (${ADMIN_EMAIL}) created with admin role.`);
} catch (err) {
	console.error('Error:', err.message);
	process.exit(1);
}
