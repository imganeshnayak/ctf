#!/usr/bin/env python3
"""
Stage 7 - Hash Identifier Challenge
Run all 7 algorithms and compare outputs

Copy this entire file and run it to see all algorithm outputs at once!
"""

import math

print("=" * 70)
print("  STAGE 7: HASH IDENTIFICATION CHALLENGE")
print("  Running all 7 algorithms...")
print("=" * 70)
print()

hashed = "483f59426b4353456c3370"

# Algorithm #1: RotateHash
print("Algorithm #1: RotateHash")
print("-" * 70)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    xored = int(hex_pair, 16)
    rotated = xored ^ (i * 7)
    original = ((rotated >> (i % 8)) | (rotated << (8 - (i % 8)))) & 0xFF
    result.append(chr(original))
print('RotateHash:', ''.join(result))
print()

# Algorithm #2: PrimeHash
print("Algorithm #2: PrimeHash")
print("-" * 70)
primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
inverses = {2: 129, 3: 171, 5: 205, 7: 183, 11: 233, 13: 197, 
           17: 241, 19: 27, 23: 167, 29: 141, 31: 33, 37: 213}
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    prime = primes[i % len(primes)]
    original = (encoded * inverses[prime]) % 256
    result.append(chr(original))
print('PrimeHash:', ''.join(result))
print()

# Algorithm #3: FibonacciHash
print("Algorithm #3: FibonacciHash")
print("-" * 70)
fib = [1, 1]
for _ in range(20):
    fib.append((fib[-1] + fib[-2]) % 256)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    fib_val = fib[i % len(fib)]
    original = (encoded - fib_val) % 256
    result.append(chr(original))
print('FibonacciHash:', ''.join(result))
print()

# Algorithm #4: SpiralHash
print("Algorithm #4: SpiralHash")
print("-" * 70)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    if i % 2 == 0:
        original = (encoded - (i * 3)) % 256
    else:
        original = (encoded + (i * 2)) % 256
    result.append(chr(original))
print('SpiralHash:', ''.join(result), '✅ <-- THIS IS THE FLAG!')
print()

# Algorithm #5: WaveHash
print("Algorithm #5: WaveHash")
print("-" * 70)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    wave_offset = int(math.sin(i * 0.5) * 50) % 256
    original = (encoded - wave_offset) % 256
    result.append(chr(original))
print('WaveHash:', ''.join(result))
print()

# Algorithm #6: MatrixHash
print("Algorithm #6: MatrixHash")
print("-" * 70)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    row = i % 2
    col = (i + 1) % 2
    matrix_val = (row * 5 + col * 7) % 256
    original = (encoded - matrix_val) % 256
    result.append(chr(original))
print('MatrixHash:', ''.join(result))
print()

# Algorithm #7: QuantumHash
print("Algorithm #7: QuantumHash")
print("-" * 70)
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
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
print('QuantumHash:', ''.join(result))
print()

print("=" * 70)
print("  Only ONE algorithm produces a readable flag!")
print("  Find it and submit it to complete Stage 7!")
print("=" * 70)
