#!/bin/bash

# Generate strong password hash
HASH=$(node -e "const bcrypt = require('bcryptjs'); bcrypt.hash('Admin!2024\$SecureP@ssw0rd#XyZ9', 10).then(h => console.log(h));")

echo "Creating admin user via Railway SQL query..."
echo ""
echo "Run this SQL in Railway dashboard > Postgres > Query tab:"
echo ""
echo "-- Check if user exists first:"
echo "SELECT * FROM users WHERE email = 'hiptrav9@gmail.com';"
echo ""
echo "-- If user doesn't exist, create admin:"
echo "INSERT INTO users (email, username, password_hash, is_admin)"
echo "VALUES ('hiptrav9@gmail.com', 'hiptrav9', '$HASH', TRUE)"
echo "ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, is_admin = TRUE;"
echo ""
echo "Credentials:"
echo "  Email: hiptrav9@gmail.com"
echo "  Password: Admin!2024\$SecureP@ssw0rd#XyZ9"
