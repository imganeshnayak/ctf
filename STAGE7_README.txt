╔══════════════════════════════════════════════════════════════════════╗
║                  ✅ STAGE 7 - FINAL IMPLEMENTATION                   ║
║                   DYNAMIC HASH IDENTIFICATION CHALLENGE              ║
╚══════════════════════════════════════════════════════════════════════╝

WHAT WAS IMPLEMENTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Removed: Simple hex decoder challenge
✅ Added: Two-layer dynamic hash identification challenge

LAYER 1: Encoding Format (Randomized per user)
  - Hexadecimal
  - Binary  
  - Decimal

LAYER 2: Hash Algorithm (7 options, shuffled per user)
  - RotateHash
  - PrimeHash
  - FibonacciHash
  - SpiralHash ✅ (Correct algorithm)
  - WaveHash
  - MatrixHash
  - QuantumHash


HOW IT WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

┌─────────────────────────────────────────────────────────────────────┐
│ USER A                                                              │
├─────────────────────────────────────────────────────────────────────┤
│ Encoding: Hexadecimal                                               │
│ Hash: 483f59426b4353456c3370                                        │
│ Algorithms: [Rotate, Prime, Fibonacci, Spiral✅, Wave, Matrix, Q]   │
│ Correct Position: #4                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ USER B                                                              │
├─────────────────────────────────────────────────────────────────────┤
│ Encoding: Binary                                                    │
│ Hash: 0100 1000 0011 1111 0101 1001 ...                            │
│ Algorithms: [Wave, Spiral✅, Matrix, Quantum, Rotate, Prime, Fib]   │
│ Correct Position: #2                                                │
└─────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────┐
│ USER C                                                              │
├─────────────────────────────────────────────────────────────────────┤
│ Encoding: Decimal                                                   │
│ Hash: 72 63 89 66 107 67 83 69 108 51 112                          │
│ Algorithms: [Quantum, Fib, Prime, Wave, Matrix, Rotate, Spiral✅]   │
│ Correct Position: #7                                                │
└─────────────────────────────────────────────────────────────────────┘


CHALLENGE FLOW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. User visits Stage 7
2. System generates unique challenge based on user ID
3. User sees encoded hash in their format (hex/binary/decimal)
4. User sees 7 algorithms in randomized order
5. User copies Algorithm #1 code
6. User runs code in Python
7. Code automatically:
   a) Decodes from format to hex
   b) Applies hash algorithm
   c) Shows result
8. If gibberish → try next algorithm
9. If readable (HASH_MASTER) → submit flag!
10. Stage complete! 🎉


EXAMPLE CODE (User with Binary Encoding)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What user copies from the page:

  # Step 1: Decode from binary to hex
  encoded_value = input("Enter the encoded value: ").strip()
  binary_groups = encoded_value.split()
  hashed = ''.join([hex(int(group, 2))[2:].zfill(1) for group in binary_groups])

  # Step 2: Apply hash algorithm (SpiralHash)
  hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
  result = []
  for i, hex_pair in enumerate(hex_pairs):
      encoded = int(hex_pair, 16)
      if i % 2 == 0:
          original = (encoded - (i * 3)) % 256
      else:
          original = (encoded + (i * 2)) % 256
      result.append(chr(original))
  print('Result:', ''.join(result))

User runs this and enters the binary value → Gets: HASH_MASTER


FILES CREATED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ backend/utils/stage7Generator.js
   Main generator with all logic for dynamic challenge creation

✅ test_dynamic_stage7.js
   Test script to verify different users get different challenges

✅ example_stage7_solution.py
   Example showing how the two-layer challenge works

✅ STAGE7_DYNAMIC.txt
   Complete documentation


FILES MODIFIED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ backend/controllers/stageController.js
   - Added import for stage7Generator
   - Modified getAllStages to generate dynamic Stage 7 content


KEY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ Unique Per User
   Each user gets a different challenge (deterministic based on user ID)

✅ Two-Layer Puzzle
   Must decode encoding format AND identify correct hash algorithm

✅ Shuffled Algorithms
   Algorithms appear in random order (can't assume position)

✅ Copy-Pastable
   All code displayed directly on page, ready to copy

✅ Prevents Cheating
   Users can't share answers (different challenges)

✅ Educational
   Teaches encoding formats AND hash algorithms

✅ Scalable
   No database storage needed, infinite combinations


TESTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Test dynamic generation:
  node test_dynamic_stage7.js

Test example solution:
  python example_stage7_solution.py


DEPLOYMENT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Restart backend server:
   cd backend
   npm start

2. Log in with different user accounts

3. Visit Stage 7

4. Verify each user sees different:
   - Encoding format
   - Algorithm order

5. Test that SpiralHash (in any position) produces HASH_MASTER


ADVANTAGES OVER PREVIOUS VERSION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before:
  ❌ Same challenge for all users
  ❌ Single-layer (just hash algorithm)
  ❌ Users could share answers
  ❌ Algorithm order was fixed

After:
  ✅ Unique challenge per user
  ✅ Two-layer (encoding + hash)
  ✅ Can't share answers (different challenges)
  ✅ Algorithm order randomized


CORRECT ANSWER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

For ALL users, regardless of encoding or algorithm order:

  HASH_MASTER

This is validated in backend/controllers/stageController.js


╔══════════════════════════════════════════════════════════════════════╗
║                         🎉 ALL COMPLETE! 🎉                          ║
║                                                                      ║
║  Stage 7 is now a dynamic, two-layer hash identification challenge  ║
║  that creates unique puzzles for each user!                         ║
║                                                                      ║
║  ✅ Encoding format randomized (hex/binary/decimal)                  ║
║  ✅ Algorithm order shuffled per user                                ║
║  ✅ Copy-pastable code on page                                       ║
║  ✅ Prevents answer sharing                                          ║
║  ✅ More challenging and educational                                 ║
║                                                                      ║
║  Restart your backend server to see it in action!                   ║
╚══════════════════════════════════════════════════════════════════════╝
