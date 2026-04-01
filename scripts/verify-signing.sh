#!/bin/bash

# Target SHA-1 fingerprint
EXPECTED_SHA1="5C:7A:69:9C:CC:C6:F1:6C:95:6A:D4:71:CF:B1:20:8F:56:D6:23:A5"

# Function to check fingerprint of a file
check_fingerprint() {
    local target=$1
    echo "Checking fingerprint for: $target"
    
    if [[ "$target" == *.aab ]] || [[ "$target" == *.apk ]]; then
        ACTUAL_SHA1=$(keytool -printcert -jarfile "$target" | grep "SHA1:" | head -n 1 | awk '{print $2}')
    else
        # Assume it's a keystore, need password and alias
        STORE_PASS=$(grep "MYAPP_RELEASE_STORE_PASSWORD" android/gradle.properties | cut -d'=' -f2)
        ALIAS=$(grep "MYAPP_RELEASE_KEY_ALIAS" android/gradle.properties | cut -d'=' -f2)
        if [ -z "$STORE_PASS" ] || [ -z "$ALIAS" ]; then
            echo "⚠️  Missing credentials in gradle.properties, skipping keystore check."
            return 0
        fi
        ACTUAL_SHA1=$(keytool -list -v -keystore "$target" -storepass "$STORE_PASS" -alias "$ALIAS" | grep "SHA1:" | awk '{print $2}')
    fi

    if [ "$ACTUAL_SHA1" != "$EXPECTED_SHA1" ]; then
        echo "❌ CRITICAL ERROR: Signing Key Mismatch!"
        echo "Expected: $EXPECTED_SHA1"
        echo "Found:    $ACTUAL_SHA1"
        return 1
    fi

    echo "✅ Signing key verified: $ACTUAL_SHA1"
    return 0
}

# If an argument is provided, check that file
if [ ! -z "$1" ]; then
    check_fingerprint "$1"
    exit $?
fi

# Default behavior: Check gradle.properties defined keystore
STORE_FILE=$(grep "MYAPP_RELEASE_STORE_FILE" android/gradle.properties | cut -d'=' -f2)

if [ -z "$STORE_FILE" ]; then
    echo "ℹ️  MYAPP_RELEASE_STORE_FILE not in gradle.properties. If this is an EAS build, it will be injected."
    exit 0
fi

# Determine the actual path
if [ -f "android/app/$STORE_FILE" ]; then
    ACTUAL_PATH="android/app/$STORE_FILE"
elif [ -f "$STORE_FILE" ]; then
    ACTUAL_PATH="$STORE_FILE"
else
    echo "❌ Error: Keystore file '$STORE_FILE' not found."
    exit 1
fi

check_fingerprint "$ACTUAL_PATH"
exit $?
