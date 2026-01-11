#!/usr/bin/env python3
"""
Quick verification that Stage 7 challenge works correctly
"""

print("=" * 70)
print("  STAGE 7 HASH IDENTIFICATION - VERIFICATION TEST")
print("=" * 70)
print()

# The hash value from the challenge
hashed_value = "483f59426b4353456c3370"
expected_result = "HASH_MASTER"

print(f"Hash Value: {hashed_value}")
print(f"Expected Result: {expected_result}")
print()

# SpiralHash decrypt algorithm
def spiral_hash_decrypt(hashed):
    result = []
    hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
    for i, hex_pair in enumerate(hex_pairs):
        encoded = int(hex_pair, 16)
        if i % 2 == 0:
            original = (encoded - (i * 3)) % 256
        else:
            original = (encoded + (i * 2)) % 256
        result.append(chr(original))
    return ''.join(result)

# Test decryption
actual_result = spiral_hash_decrypt(hashed_value)

print(f"Actual Result: {actual_result}")
print()

if actual_result == expected_result:
    print("✅ SUCCESS! The hash decrypts correctly to HASH_MASTER")
    print()
    print("Stage 7 is ready to use!")
else:
    print(f"❌ FAILED! Expected '{expected_result}', got '{actual_result}'")

print()
print("=" * 70)
