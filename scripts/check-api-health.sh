#!/bin/bash
echo "=> Running API Health Checks..."

# Load .env variables
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

if [ -z "$EXPO_PUBLIC_GEMINI_API_KEY" ]; then
  echo "⚠️  EXPO_PUBLIC_GEMINI_API_KEY is not set. Skipping Gemini API check."
else
  echo "Checking Gemini API reachability..."
  MODEL="gemini-2.5-flash"
  URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${EXPO_PUBLIC_GEMINI_API_KEY}"
  
  # Send a minimal ping request
  RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST -H "Content-Type: application/json" -d '{"contents":[{"parts":[{"text":"ping"}]}]}' "$URL")
  
  if [ "$RESPONSE" -eq 200 ]; then
    echo "✅ Gemini API is accessible."
  else
    echo "❌ Gemini API check failed with HTTP $RESPONSE."
    echo "Please verify your API key and the endpoint configuration."
    exit 1
  fi
fi

# Add Supabase health check using ANON key
if [ -z "$EXPO_PUBLIC_SUPABASE_URL" ] || [ -z "$EXPO_PUBLIC_SUPABASE_ANON_KEY" ]; then
  echo "⚠️  Supabase environment variables not fully set. Skipping."
else
  echo "Checking Supabase API reachability..."
  SB_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -H "apikey: ${EXPO_PUBLIC_SUPABASE_ANON_KEY}" "${EXPO_PUBLIC_SUPABASE_URL}/rest/v1/")
  
  if [ "$SB_RESPONSE" -eq 200 ] || [ "$SB_RESPONSE" -eq 400 ]; then
    echo "✅ Supabase API is accessible."
  else
    echo "❌ Supabase API check failed. HTTP $SB_RESPONSE"
    exit 1
  fi
fi

echo "=> All API Health Checks Passed."
exit 0
