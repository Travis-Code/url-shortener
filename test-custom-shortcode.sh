#!/usr/bin/env bash

echo "Testing custom short code feature..."
echo ""

# Login and get token
echo "1. Logging in..."
RESPONSE=$(curl -s -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}')

TOKEN=$(echo $RESPONSE | jq -r '.token')

if [ "$TOKEN" == "null" ] || [ -z "$TOKEN" ]; then
  echo "❌ Login failed"
  echo $RESPONSE | jq '.'
  exit 1
fi

echo "✅ Login successful"
echo ""

# Test 1: Create URL with custom short code
echo "2. Creating URL with custom short code 'github'..."
RESULT=$(curl -s -X POST http://localhost:5001/api/urls/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"originalUrl":"https://github.com","customShortCode":"github","title":"GitHub Homepage"}')

echo $RESULT | jq '.'
SHORT_CODE=$(echo $RESULT | jq -r '.shortCode')

if [ "$SHORT_CODE" == "github" ]; then
  echo "✅ Custom short code works!"
else
  echo "❌ Expected 'github' but got '$SHORT_CODE'"
fi
echo ""

# Test 2: Try to create with same custom code (should fail)
echo "3. Trying to use same short code 'github' again (should fail)..."
RESULT2=$(curl -s -X POST http://localhost:5001/api/urls/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"originalUrl":"https://google.com","customShortCode":"github","title":"Google"}')

echo $RESULT2 | jq '.'
ERROR=$(echo $RESULT2 | jq -r '.error')

if [[ "$ERROR" == *"already taken"* ]]; then
  echo "✅ Duplicate check works!"
else
  echo "❌ Expected 'already taken' error"
fi
echo ""

# Test 3: Create URL without custom code (random generation)
echo "4. Creating URL without custom short code (random)..."
RESULT3=$(curl -s -X POST http://localhost:5001/api/urls/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"originalUrl":"https://example.com","title":"Example Site"}')

echo $RESULT3 | jq '.'
SHORT_CODE3=$(echo $RESULT3 | jq -r '.shortCode')

if [ ${#SHORT_CODE3} -eq 7 ]; then
  echo "✅ Random generation works!"
else
  echo "❌ Expected 7-character code, got '$SHORT_CODE3'"
fi
echo ""

# Test 4: Test the redirect
echo "5. Testing redirect for custom short code 'github'..."
REDIRECT=$(curl -s -o /dev/null -w "%{http_code}" -L http://localhost:5001/github)

if [ "$REDIRECT" == "200" ]; then
  echo "✅ Redirect works!"
else
  echo "❌ Expected 200, got $REDIRECT"
fi
echo ""

echo "All tests complete!"
