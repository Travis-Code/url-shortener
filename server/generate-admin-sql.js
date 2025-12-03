const bcrypt = require('bcryptjs');

const email = 'hiptrav9@gmail.com';
const password = 'Admin!2024$SecureP@ssw0rd#XyZ9';

bcrypt.hash(password, 10).then(hash => {
  console.log('\n=== RAILWAY POSTGRES SQL QUERY ===\n');
  console.log('Go to: https://railway.app → Your Project → Postgres → Query\n');
  console.log('Run this SQL:\n');
  console.log(`INSERT INTO users (email, username, password_hash, is_admin)`);
  console.log(`VALUES ('${email}', 'hiptrav9', '${hash}', TRUE)`);
  console.log(`ON CONFLICT (email) DO UPDATE`);
  console.log(`  SET password_hash = EXCLUDED.password_hash,`);
  console.log(`      is_admin = TRUE;`);
  console.log('\n=== ADMIN CREDENTIALS ===\n');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log('\n⚠️  Save these credentials securely!\n');
});
