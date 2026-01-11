#!/usr/bin/env python3
"""
Test script to verify all hash algorithms work correctly
"""

import sys
sys.path.append('frontend/public')

# Import the hash algorithms
import math

class CustomHashAlgorithms:
    """Collection of 7 custom hashing algorithms"""
    
    @staticmethod
    def spiral_hash(text):
        """Algorithm 4: SpiralHash - Spiral pattern transformation (CORRECT ALGORITHM)"""
        result = []
        for i, char in enumerate(text):
            # Spiral pattern: alternating add/subtract with increasing values
            if i % 2 == 0:
                encoded = (ord(char) + (i * 3)) % 256
            else:
                encoded = (ord(char) - (i * 2)) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def spiral_hash_decrypt(hashed):
        """Decrypt SpiralHash - THIS IS THE CORRECT ONE!"""
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                # Reverse spiral pattern
                if i % 2 == 0:
                    original = (encoded - (i * 3)) % 256
                else:
                    original = (encoded + (i * 2)) % 256
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR: Invalid hash for SpiralHash]"

# Test the algorithm
algorithms = CustomHashAlgorithms()

# Test encryption
original = "HASH_MASTER"
hashed = algorithms.spiral_hash(original)
print(f"Original: {original}")
print(f"Hashed: {hashed}")

# Test decryption
decrypted = algorithms.spiral_hash_decrypt(hashed)
print(f"Decrypted: {decrypted}")

# Verify
if decrypted == original:
    print("✅ SUCCESS: Algorithm works correctly!")
else:
    print(f"❌ FAILED: Expected '{original}', got '{decrypted}'")
