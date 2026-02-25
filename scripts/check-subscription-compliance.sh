#!/bin/bash

# Files to check
FILES=(
  "src/features/profile/SubscriptionScreen.tsx"
  "src/features/onboarding/OnboardingScreen.tsx"
)

# Component to check for
COMPONENT="SubscriptionLegal"

MISSING=0

for FILE in "${FILES[@]}"; do
  if [ ! -f "$FILE" ]; then
    echo "⚠️ Warning: File $FILE not found, skipping..."
    continue
  fi

  if ! grep -q "$COMPONENT" "$FILE"; then
    echo "❌ Error: $COMPONENT is missing in $FILE. This is required for Apple App Store compliance (Guideline 3.1.2)."
    MISSING=1
  fi
done

if [ $MISSING -eq 1 ]; then
  echo "Please add the <$COMPONENT /> component to the paywall and ensure it is imported."
  exit 1
fi

echo "✅ Subscription compliance check passed."
exit 0
