// Dynamic Stage 7 Generator
// Generates unique hash challenges for each user

/**
 * Generate a deterministic but unique hash challenge for each user
 * @param {string} userId - The user's ID
 * @returns {string} - HTML content for Stage 7
 */
export function generateDynamicStage7(userId) {
    // Use userId as seed for deterministic randomization
    const seed = hashCode(userId);

    // Determine encoding format (hex, binary, or decimal)
    const encodingFormats = ['hex', 'binary', 'decimal'];
    const encodingFormat = encodingFormats[seed % 3];

    // The correct answer is always HASH_MASTER
    const correctAnswer = "HASH_MASTER";

    // Generate the hash using SpiralHash algorithm
    const spiralHash = spiralHashEncode(correctAnswer);

    // Encode the hash in the selected format
    const encodedHash = encodeHash(spiralHash, encodingFormat);

    // Shuffle algorithm order for this user
    const algorithms = shuffleAlgorithms(seed);

    // Generate HTML content
    return generateStage7HTML(encodedHash, encodingFormat, algorithms);
}

/**
 * Simple hash function to convert string to number
 */
function hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

/**
 * SpiralHash encoding algorithm
 */
function spiralHashEncode(text) {
    const result = [];
    for (let i = 0; i < text.length; i++) {
        let encoded;
        if (i % 2 === 0) {
            encoded = (text.charCodeAt(i) + (i * 3)) % 256;
        } else {
            encoded = (text.charCodeAt(i) - (i * 2)) % 256;
        }
        result.push(encoded.toString(16).padStart(2, '0'));
    }
    return result.join('');
}

/**
 * Encode hash in different formats
 */
function encodeHash(hexHash, format) {
    switch (format) {
        case 'hex':
            return hexHash;
        case 'binary':
            return hexHash.split('').map(char =>
                parseInt(char, 16).toString(2).padStart(4, '0')
            ).join(' ');
        case 'decimal':
            const pairs = hexHash.match(/.{2}/g) || [];
            return pairs.map(pair => parseInt(pair, 16)).join(' ');
        default:
            return hexHash;
    }
}

/**
 * Shuffle algorithms based on seed
 */
function shuffleAlgorithms(seed) {
    const algorithms = [
        { name: 'RotateHash', code: 'rotate' },
        { name: 'PrimeHash', code: 'prime' },
        { name: 'FibonacciHash', code: 'fibonacci' },
        { name: 'SpiralHash', code: 'spiral' }, // Correct one
        { name: 'WaveHash', code: 'wave' },
        { name: 'MatrixHash', code: 'matrix' },
        { name: 'QuantumHash', code: 'quantum' }
    ];

    // Fisher-Yates shuffle with seed
    const shuffled = [...algorithms];
    let currentSeed = seed;

    for (let i = shuffled.length - 1; i > 0; i--) {
        currentSeed = (currentSeed * 1103515245 + 12345) & 0x7fffffff;
        const j = currentSeed % (i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    return shuffled;
}

/**
 * Get algorithm code based on type
 */
function getAlgorithmCode(algorithmType, encodingFormat) {
    const decodeStep = getDecodeStep(encodingFormat);

    const algorithms = {
        rotate: `${decodeStep}
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    xored = int(hex_pair, 16)
    rotated = xored ^ (i * 7)
    original = ((rotated >> (i % 8)) | (rotated << (8 - (i % 8)))) & 0xFF
    result.append(chr(original))
print('Result:', ''.join(result))`,

        prime: `${decodeStep}
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
print('Result:', ''.join(result))`,

        fibonacci: `${decodeStep}
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
print('Result:', ''.join(result))`,

        spiral: `${decodeStep}
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    if i % 2 == 0:
        original = (encoded - (i * 3)) % 256
    else:
        original = (encoded + (i * 2)) % 256
    result.append(chr(original))
print('Result:', ''.join(result))`,

        wave: `import math
${decodeStep}
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    wave_offset = int(math.sin(i * 0.5) * 50) % 256
    original = (encoded - wave_offset) % 256
    result.append(chr(original))
print('Result:', ''.join(result))`,

        matrix: `${decodeStep}
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    row = i % 2
    col = (i + 1) % 2
    matrix_val = (row * 5 + col * 7) % 256
    original = (encoded - matrix_val) % 256
    result.append(chr(original))
print('Result:', ''.join(result))`,

        quantum: `${decodeStep}
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
print('Result:', ''.join(result))`
    };

    return algorithms[algorithmType] || '';
}

/**
 * Get the decode step based on encoding format
 */
function getDecodeStep(encodingFormat) {
    switch (encodingFormat) {
        case 'hex':
            return `# Step 1: Already in hex format
encoded_value = input("Enter the encoded value: ").strip()
hashed = encoded_value  # Already hex

# Step 2: Apply hash algorithm`;

        case 'binary':
            return `# Step 1: Decode from binary to hex
encoded_value = input("Enter the encoded value: ").strip()
binary_groups = encoded_value.split()
hashed = ''.join([hex(int(group, 2))[2:].zfill(1) for group in binary_groups])

# Step 2: Apply hash algorithm`;

        case 'decimal':
            return `# Step 1: Decode from decimal to hex
encoded_value = input("Enter the encoded value: ").strip()
decimal_values = encoded_value.split()
hashed = ''.join([hex(int(val))[2:].zfill(2) for val in decimal_values])

# Step 2: Apply hash algorithm`;

        default:
            return `encoded_value = input("Enter the encoded value: ").strip()
hashed = encoded_value`;
    }
}

/**
 * Generate HTML content for Stage 7
 */
function generateStage7HTML(encodedHash, encodingFormat, algorithms) {
    const formatNames = {
        hex: 'Hexadecimal',
        binary: 'Binary',
        decimal: 'Decimal'
    };

    const formatName = formatNames[encodingFormat] || 'Hexadecimal';

    let html = `
      <div class="challenge-box">
        <h3>🔐 Stage 7: Hash Identification Challenge</h3>
        <p>A secret key has been hashed and encoded. Your mission: decode it and identify the correct algorithm!</p>
        
        <div class="cipher-box">
          <p><strong>Encoded Hash (${formatName}):</strong></p>
          <code style="font-size: 1.2em; display: block; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 5px; word-break: break-all;">
            ${encodedHash}
          </code>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>The Challenge (2 Steps):</strong></p>
          <ol>
            <li><strong>Step 1:</strong> Decode the ${formatName} value to get the hex hash</li>
            <li><strong>Step 2:</strong> Apply the correct hash algorithm to decrypt it</li>
          </ol>
          <p>Only ONE algorithm will give you the correct key when you decrypt it!</p>
        </div>
        
        <hr style="border: 1px solid rgba(0,255,136,0.3); margin: 30px 0;">
    `;

    // Add each algorithm
    algorithms.forEach((algo, index) => {
        const code = getAlgorithmCode(algo.code, encodingFormat);
        html += `
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #${index + 1}: ${algo.name}</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>${code}</code></pre>
        </div>
        `;
    });

    html += `
        <hr style="border: 1px solid rgba(0,255,136,0.3); margin: 30px 0;">
        
        <div class="info-box">
          <p><strong>📝 How to solve:</strong></p>
          <ol>
            <li>Copy each algorithm code above (one at a time)</li>
            <li>Paste into a Python file or run directly in Python console</li>
            <li>When prompted, enter the encoded value shown above</li>
            <li>The code will decode AND decrypt automatically</li>
            <li>Only ONE algorithm will produce a readable flag</li>
            <li>Submit that flag to complete the challenge!</li>
          </ol>
        </div>
        
        <div class="info-box">
          <p>⚠️ <strong>Important:</strong> Each algorithm produces a different output. Most will give you gibberish. The correct one will give you a readable flag!</p>
          <p>💡 <strong>Tip:</strong> The algorithms are in a random order - don't assume the first one is correct!</p>
        </div>
      </div>
    `;

    return html;
}
