#!/usr/bin/env python3
"""
Demo: Show how different algorithms produce different outputs
"""

import math

class CustomHashAlgorithms:
    @staticmethod
    def rotate_hash_decrypt(hashed):
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                xored = int(hex_pair, 16)
                rotated = xored ^ (i * 7)
                original = ((rotated >> (i % 8)) | (rotated << (8 - (i % 8)))) & 0xFF
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR]"
    
    @staticmethod
    def prime_hash_decrypt(hashed):
        try:
            primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
            inverses = {2: 129, 3: 171, 5: 205, 7: 183, 11: 233, 13: 197, 
                       17: 241, 19: 27, 23: 167, 29: 141, 31: 33, 37: 213}
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                prime = primes[i % len(primes)]
                original = (encoded * inverses[prime]) % 256
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR]"
    
    @staticmethod
    def fibonacci_hash_decrypt(hashed):
        try:
            fib = [1, 1]
            for _ in range(20):
                fib.append((fib[-1] + fib[-2]) % 256)
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                fib_val = fib[i % len(fib)]
                original = (encoded - fib_val) % 256
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR]"
    
    @staticmethod
    def spiral_hash_decrypt(hashed):
        try:
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
        except:
            return "[ERROR]"
    
    @staticmethod
    def wave_hash_decrypt(hashed):
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                wave_offset = int(math.sin(i * 0.5) * 50) % 256
                original = (encoded - wave_offset) % 256
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR]"
    
    @staticmethod
    def matrix_hash_decrypt(hashed):
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                row = i % 2
                col = (i + 1) % 2
                matrix_val = (row * 5 + col * 7) % 256
                original = (encoded - matrix_val) % 256
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR]"
    
    @staticmethod
    def quantum_hash_decrypt(hashed):
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                for possible in range(256):
                    state1 = (possible * 3) % 256
                    state2 = (possible * 5) % 256
                    if (state1 ^ state2) % 256 == encoded:
                        result.append(chr(possible))
                        break
                else:
                    result.append('?')
            return ''.join(result)
        except:
            return "[ERROR]"

# The hash value from the challenge
hashed_value = "483f59426b4353456c3370"

print("=" * 70)
print("  STAGE 7 HASH IDENTIFICATION - DEMO")
print("  Showing how each algorithm produces different outputs")
print("=" * 70)
print()
print(f"Hashed Value: {hashed_value}")
print()
print("-" * 70)

algorithms = CustomHashAlgorithms()

print("\n1. RotateHash Decrypt:")
result = algorithms.rotate_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print("\n2. PrimeHash Decrypt:")
result = algorithms.prime_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print("\n3. FibonacciHash Decrypt:")
result = algorithms.fibonacci_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print("\n4. SpiralHash Decrypt: ⭐ CORRECT ALGORITHM")
result = algorithms.spiral_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES - THIS IS THE FLAG!' if result == 'HASH_MASTER' else '❌ NO'}")

print("\n5. WaveHash Decrypt:")
result = algorithms.wave_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print("\n6. MatrixHash Decrypt:")
result = algorithms.matrix_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print("\n7. QuantumHash Decrypt:")
result = algorithms.quantum_hash_decrypt(hashed_value)
print(f"   Result: {repr(result)}")
print(f"   Readable? {'✅ YES' if result == 'HASH_MASTER' else '❌ NO (Gibberish)'}")

print()
print("-" * 70)
print("\n🎯 CONCLUSION:")
print("   Only Algorithm #4 (SpiralHash) produces the correct flag: HASH_MASTER")
print("   All other algorithms produce unreadable gibberish!")
print()
print("=" * 70)
