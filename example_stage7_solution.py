#!/usr/bin/env python3
"""
Example: How Stage 7 works for a user with BINARY encoding

This demonstrates the two-layer challenge:
1. Decode from binary to hex
2. Apply SpiralHash algorithm to decrypt
"""

print("=" * 70)
print("  STAGE 7 EXAMPLE: USER WITH BINARY ENCODING")
print("=" * 70)
print()

# What the user sees on the page
encoded_binary = "0100 1000 0011 1111 0101 1001 0100 0010 0110 1011 0100 0011 0101 0011 0100 0101 0110 1100 0011 0011 0111 0000"

print("🔐 Encoded Hash (Binary):")
print(encoded_binary)
print()

# Step 1: Decode from binary to hex
print("=" * 70)
print("STEP 1: DECODE FROM BINARY TO HEX")
print("=" * 70)
print()

binary_groups = encoded_binary.split()
hex_chars = []

for group in binary_groups:
    decimal_value = int(group, 2)
    hex_char = hex(decimal_value)[2:].zfill(2)
    hex_chars.append(hex_char)
    print(f"Binary: {group} → Decimal: {decimal_value:3d} → Hex: {hex_char}")

hashed = ''.join(hex_chars)
print()
print(f"✅ Decoded Hex Hash: {hashed}")
print()

# Step 2: Apply SpiralHash algorithm
print("=" * 70)
print("STEP 2: APPLY SPIRALHASH ALGORITHM")
print("=" * 70)
print()

hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []

for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    
    if i % 2 == 0:
        original = (encoded - (i * 3)) % 256
    else:
        original = (encoded + (i * 2)) % 256
    
    char = chr(original)
    result.append(char)
    
    print(f"Position {i}: {hex_pair} → {encoded:3d} → {original:3d} → '{char}'")

final_result = ''.join(result)
print()
print(f"✅ Final Result: {final_result}")
print()

# Verification
print("=" * 70)
print("VERIFICATION")
print("=" * 70)
print()

if final_result == "HASH_MASTER":
    print("✅ SUCCESS! This is the correct algorithm!")
    print("   Submit 'HASH_MASTER' to complete Stage 7!")
else:
    print(f"❌ Wrong algorithm. Got: {final_result}")
    print("   Try a different algorithm!")

print()
print("=" * 70)
print()
print("💡 KEY POINTS:")
print("   - Each user gets a different encoding format (hex/binary/decimal)")
print("   - Algorithms are in random order for each user")
print("   - Only SpiralHash produces the correct flag")
print("   - Users must try each algorithm until finding the right one")
print()
print("=" * 70)
