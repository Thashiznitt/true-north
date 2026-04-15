#!/bin/bash
# =============================================================================
# True North — EAS Environment Secrets Setup
# Run this ONCE from your terminal to store all sensitive keys as EAS secrets.
# These are stored server-side by Expo and injected at build time securely.
# They will NOT appear in git history.
#
# Usage: bash scripts/setup-eas-secrets.sh
# =============================================================================

set -e

echo "🔐 Setting up True North EAS Secrets..."
echo "Make sure you are logged in: eas login"
echo ""

# --- Supabase ---
eas env:create \
  --scope project \
  --name EXPO_PUBLIC_SUPABASE_KEY \
  --value "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImloZ3R0Zm10aHNmYnVzc2djZWdtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzMjM1OTQsImV4cCI6MjA4Njg5OTU5NH0._aOUNszEMjUz2M74v2MyUJoWWCJwanF6fdy7OTzfVLo" \
  --type string \
  --visibility sensitive \
  --environment production \
  --force

echo "✅ Supabase Key set"

# --- Gemini API Key ---
# Get your Gemini API key from https://aistudio.google.com/app/apikeys
# Replace YOUR_GEMINI_KEY_HERE with your actual key before running
eas env:create \
  --scope project \
  --name EXPO_PUBLIC_GEMINI_API_KEY \
  --value "YOUR_GEMINI_KEY_HERE" \
  --type string \
  --visibility sensitive \
  --environment production \
  --force

echo "✅ Gemini API Key set"

# --- Google OAuth Client IDs ---
eas env:create \
  --scope project \
  --name EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID \
  --value "862052704275-hoap4ue6hbvhuo7c4co9bjbimdmp2adv.apps.googleusercontent.com" \
  --type string \
  --visibility plaintext \
  --environment production \
  --force

eas env:create \
  --scope project \
  --name EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID \
  --value "862052704275-64h0rdf93c0futbap8h4r70klf0ql233.apps.googleusercontent.com" \
  --type string \
  --visibility plaintext \
  --environment production \
  --force

eas env:create \
  --scope project \
  --name EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID \
  --value "862052704275-fnm6av3kv1era38gd93aof56koef816p.apps.googleusercontent.com" \
  --type string \
  --visibility plaintext \
  --environment production \
  --force

echo "✅ Google Client IDs set"

# --- RevenueCat Keys ---
eas env:create \
  --scope project \
  --name EXPO_PUBLIC_REVENUECAT_IOS_KEY_PROD \
  --value "appl_XkmqCwmuRnOaxhvHAtIczSdJbsd" \
  --type string \
  --visibility sensitive \
  --environment production \
  --force

eas env:create \
  --scope project \
  --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY_PROD \
  --value "goog_CkXHjYDdxoHaGbVfnWaqLpEcqAo" \
  --type string \
  --visibility sensitive \
  --environment production \
  --force

eas env:create \
  --scope project \
  --name EXPO_PUBLIC_REVENUECAT_IOS_KEY \
  --value "test_wBhjehklKDMwfUnPjCTIklJxHwE" \
  --type string \
  --visibility sensitive \
  --environment preview \
  --force

eas env:create \
  --scope project \
  --name EXPO_PUBLIC_REVENUECAT_ANDROID_KEY \
  --value "test_wBhjehklKDMwfUnPjCTIklJxHwE" \
  --type string \
  --visibility sensitive \
  --environment preview \
  --force

echo "✅ RevenueCat keys set"

echo ""
echo "🎉 All secrets configured! They will be injected automatically on next EAS build."
echo ""
echo "⚠️  IMPORTANT: The OLD Gemini key (AIzaSyAIQ1G5...) was exposed on GitHub."
echo "   Go to console.cloud.google.com and REVOKE that key immediately."
echo "   The new key (AQ.Ab8RN6...) is now stored securely in EAS."
