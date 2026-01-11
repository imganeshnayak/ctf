# Stage 7 Hash Identification Challenge - Summary

## Changes Made

### 1. Updated Stage 7 in seed.js
- **Removed**: Hex Decoder challenge
- **Added**: Hash Identification challenge with 7 custom hashing algorithms
- **Difficulty**: Changed from Easy to Hard
- **Points**: Increased from 100 to 300
- **Correct Key**: Changed from 'HEX_EXPERT' to 'HASH_MASTER'

### 2. Created Python Hash Analyzer Tool
**File**: `frontend/public/stage7_hash_analyzer.py`

This tool implements 7 custom hashing algorithms:

1. **RotateHash** - Rotates bits and XORs with position
2. **PrimeHash** - Multiplies by prime numbers  
3. **FibonacciHash** - Uses Fibonacci sequence mixing
4. **SpiralHash** - Spiral pattern transformation ✅ **CORRECT ALGORITHM**
5. **WaveHash** - Sine wave based encoding
6. **MatrixHash** - Matrix multiplication cipher
7. **QuantumHash** - Quantum-inspired superposition

### 3. How It Works

**The Challenge:**
- Users are given a hashed value: `483f59426b4353456c3370`
- This hash was created using the **SpiralHash** algorithm (Algorithm #4)
- Each algorithm produces a DIFFERENT output for the same input
- Only the correct algorithm (SpiralHash) will decrypt to reveal: `HASH_MASTER`

**The Solution:**
1. Download `stage7_hash_analyzer.py`
2. Run: `python stage7_hash_analyzer.py`
3. Enter the hashed value: `483f59426b4353456c3370`
4. Try different algorithms (1-7)
5. Algorithm #4 (SpiralHash) reveals: `HASH_MASTER`
6. Submit `HASH_MASTER` as the flag

### 4. Algorithm Details

**SpiralHash Encryption (Correct Algorithm):**
```python
for i, char in enumerate(text):
    if i % 2 == 0:
        encoded = (ord(char) + (i * 3)) % 256
    else:
        encoded = (ord(char) - (i * 2)) % 256
```

**SpiralHash Decryption:**
```python
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    if i % 2 == 0:
        original = (encoded - (i * 3)) % 256
    else:
        original = (encoded + (i * 2)) % 256
```

### 5. Testing

**Verification:**
- Original text: `HASH_MASTER`
- Encrypted with SpiralHash: `483f59426b4353456c3370`
- Decrypted with SpiralHash: `HASH_MASTER` ✅

**Other algorithms will produce gibberish:**
- RotateHash decrypt: Random characters
- PrimeHash decrypt: Invalid output
- FibonacciHash decrypt: Unreadable text
- WaveHash decrypt: Garbage
- MatrixHash decrypt: Nonsense
- QuantumHash decrypt: Question marks and errors

### 6. Files Modified/Created

1. **Modified**: `backend/seed.js` (Stage 7 definition)
2. **Created**: `frontend/public/stage7_hash_analyzer.py` (Hash analyzer tool)

### 7. Next Steps

To apply these changes to the database:

1. Make sure MongoDB is running:
   ```bash
   # Start MongoDB service (if not running)
   ```

2. Seed the database:
   ```bash
   cd backend
   node seed.js
   ```

3. Test the challenge:
   ```bash
   cd ../frontend/public
   python stage7_hash_analyzer.py
   ```

### 8. Challenge Flow

```
User visits Stage 7
    ↓
Sees hashed value: 483f59426b4353456c3370
    ↓
Downloads stage7_hash_analyzer.py
    ↓
Runs the Python script
    ↓
Enters the hashed value
    ↓
Tries Algorithm #1 → Gibberish output
Tries Algorithm #2 → Gibberish output
Tries Algorithm #3 → Gibberish output
Tries Algorithm #4 → "HASH_MASTER" ✅
    ↓
Submits "HASH_MASTER" as the flag
    ↓
Stage 7 Complete! 🎉
```

### 9. Educational Value

This challenge teaches:
- Hash function concepts
- Different hashing algorithms produce different outputs
- Importance of algorithm selection in cryptography
- Reverse engineering and trial-and-error problem solving
- Python programming and command-line tools
