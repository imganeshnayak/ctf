import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Stage from './models/Stage.js';


dotenv.config();

const stages = [
  {
    stageNumber: 1,
    title: 'Binary Manipulation Protocol',
    description: 'Decode the visual pattern, apply transformations, then compute the final value.',
    difficulty: 'Medium',
    challengeContent: `
    <div class="challenge-box">
      <h3>🔐 Stage 1: Signal Reconstruction</h3>
      
      <div class="cipher-box" style="text-align: center; padding: 20px;">
        <p><strong>Your Challenge:</strong></p>
        <p>These light bulbs represent a binary signal (ON=1, OFF=0):</p>
        <div style="font-size: 3em; letter-spacing: 0.3em; margin: 20px 0; user-select: none; pointer-events: none;">
          ⚫💡💡⚫💡⚫💡💡
        </div>
        <p style="font-size: 0.9em; color: #888;">
          Step 1: Read left to right.<br>
          Step 2: Reverse the entire binary string.<br>
          Step 3: Flip every bit (1→0, 0→1).<br>
          Step 4: Convert the final result to decimal.
        </p>
      </div>
      
      <div class="cipher-box">
        <p><strong>Submit your answer:</strong></p>
        <p>What decimal number results after ALL transformations?</p>
        <p><em>Enter just the number</em></p>
      </div>
    </div>
  `,
    correctKey: '105',
    hints: [
      'Original binary is 01101011',
      'Reversed becomes 11010110',
      'flip the bits  ',
      'Convert it to decimal'
    ],
    points: 200
  },
  {
    stageNumber: 2,
    title: 'Caesar\'s Secret',
    description: 'Align the wheels to reveal the truth',
    difficulty: 'Easy',
    challengeContent: `
    <div class="challenge-box">
      <h3>🔐 Stage 2: Wheel Alignment Cipher</h3>
      <p>There are two alphabet rings. The bottom one is shifted.</p>
      
      <div class="cipher-box" style="text-align: center; font-family: monospace; line-height: 1.8;">
        <p style="user-select: none;"><strong>Outer Ring (Normal Alphabet):</strong></p>
        <div style="font-size: 1.2em; letter-spacing: 0.3em; color: #666; margin-bottom: 10px; white-space: nowrap; user-select: none;">
          A B C D E F G H I J K L M N O P Q R S T U V W X Y Z
        </div>
        
        <p style="margin-top: 20px; user-select: none;"><strong>Inner Ring (Shifted Alphabet):</strong></p>
        <div style="font-size: 1.2em; letter-spacing: 0.3em; color: #00ff88; font-weight: bold; white-space: nowrap; user-select: none;">
          X Y Z A B C D E F G H I J K L M N O P Q R S T U V W
        </div>
        
        <p style="margin-top: 20px; color: #ff6b6b; font-size: 1.1em; user-select: none;">
          <strong>Encrypted Word:</strong> CAESAR WHEEL
        </p>
      </div>
      
      <div class="info-box">
        <p><strong>How to Decode:</strong></p>
        <ol style="text-align:left; max-width:500px; margin:auto;">
          <li>Find the encrypted letter in the <strong>inner ring</strong> row.</li>
          <li>Look directly above it in the <strong>outer ring</strong> row.</li>
          <li>Write down that outer letter.</li>
          <li>Repeat for every letter.</li>
        </ol>

      </div>
      
      <p><strong>Your task:</strong> Decode the message and submit it in ALL CAPS with an underscore instead of a space.</p>
    </div>
  `,
    correctKey: 'FDHVDU_ZKHHO',
    hints: [
      '<span style="user-select: none;">Each letter shifts forward by 3.</span>',
      '<span style="user-select: none;">Example: Inner C → Above it is F</span>',
      '<span style="user-select: none;">C becomes F.</span>',
      '<span style="user-select: none;">W becomes Z.</span>'
    ],
    points: 150
  },
  {
    stageNumber: 3,
    title: 'The Time-Locked Vault',
    description: 'Decode the rotating cipher sequence',
    difficulty: 'Medium',
    challengeContent: `
    <div class="challenge-box">
      <h3>🔤 Stage 3: Temporal Drift Protocol</h3>
      
      <div class="cipher-box" style="background: linear-gradient(135deg, #141e30 0%, #243b55 100%);">
        <p><strong>⏰ Security Log:</strong></p>
        <p style="font-family: monospace; font-size: 0.9em; color: #a8d8ea;">
          [TIMESTAMP: 2024-01-01T00:00:00Z]<br>
          [SYSTEM]: Vault synchronization required.<br>
          [SYSTEM]: Current rotation: 180°<br>
          [WARNING]: Raw decoding may produce invalid key.
        </p>
      </div>

      <div class="cipher-box">
        <p><strong>🔐 Encrypted Transmission:</strong></p>
        <div style="background: #0f0f23; padding: 20px; border-radius: 10px; 
                    text-align: center; border: 2px solid #00ff88;">
          <code style="font-size: 1.4em; color: #00ff88;">
            ==QRXhVQaNzN4kDM5A0XZV0S
          </code>
        </div>
        <p style="text-align: center; color: #888; font-size: 0.9em; margin-top: 10px;">
          <em>Flag format: [decrypted_key]</em>
        </p>
      </div>

      <div class="cipher-box" style="background: #1c1c2b;">
        <p><strong>📜 The Recovery Protocol:</strong></p>
        <p style="color: #ccc; font-style: italic; line-height: 1.6;">
          "The transmission was caught in a temporal rift, spinning 180 degrees through the void. 
          To recover the truth, you must first untangle the stream by reversing its path. 
          Only then will the ancient encoding reveal its true form, allowing you to 
          unlock the key buried within the machine's primary language."
        </p>
      </div>

      <div class="cipher-box" style="background:#2a1a3f; font-size:0.9em; color:#b19cd9;">
        <p>
          ⚠ Intelligence Intercept:<br>
          
        </p>
      </div>
    </div>
  `,
    correctKey: 'KEY_@909873ZAXWE',
    hints: [
      'Previous agents decoded without applying rotation to the hash first Their access attempts were rejected.',
      'That is Base64.',
    ],
    points: 250
  },
  {
    stageNumber: 4,
    title: "The Curator's Archive",
    description: "Truth hides where structure breaks down",
    difficulty: "Hard",
    challengeContent: `
  <div class="challenge-box">
    <h3>🔍 Stage 4: The Curator's Archive</h3>

    <div class="cipher-box" style="border-left: 4px solid #e74c3c; background: linear-gradient(90deg, #2c0b0e 0%, #1a1a2e 100%);">
      <p><strong>📜 Case File:</strong></p>
      <p style="font-style: italic; color: #ddd; line-height: 1.6;">
        "The archivist claimed the pages were clean.
        No cipher. No code. No encryption.
        He was wrong.
        The structure itself betrayed him."
      </p>
      <p style="font-size: 0.85em; color: #888; margin-top: 10px;">
        — Dr. Elena Vance, Digital Preservation Society
      </p>
    </div>

    <div class="cipher-box">
      <p><strong>🗂️ Archive Index:</strong></p>

      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0;">
        
        <div style="background: #0f0f23; padding: 15px; border-radius: 8px; border-top: 3px solid #3498db;">
          <p style="color: #3498db; font-weight: bold; margin-bottom: 8px;">Fragment Alpha</p>
          <a href="/stage4a.html" target="_blank" style="color: #00ff88; text-decoration: none; font-size: 0.9em;">
            🔗 /stage4a.html
          </a>
          <p style="font-size: 0.8em; color: #666; margin-top: 5px;">"Surface integrity verified."</p>
        </div>

        <div style="background: #0f0f23; padding: 15px; border-radius: 8px; border-top: 3px solid #f39c12;">
          <p style="color: #f39c12; font-weight: bold; margin-bottom: 8px;">Fragment Beta</p>
          <a href="/stage4b.html" target="_blank" style="color: #00ff88; text-decoration: none; font-size: 0.9em;">
            🔗 /stage4b.html
          </a>
          <p style="font-size: 0.8em; color: #666; margin-top: 5px;">"Audit logs appear empty."</p>
        </div>

        <div style="background: #0f0f23; padding: 15px; border-radius: 8px; border-top: 3px solid #9b59b6;">
          <p style="color: #9b59b6; font-weight: bold; margin-bottom: 8px;">Fragment Gamma</p>
          <a href="/stage4c.html" target="_blank" style="color: #00ff88; text-decoration: none; font-size: 0.9em;">
            🔗 /stage4c.html
          </a>
          <p style="font-size: 0.8em; color: #666; margin-top: 5px;">"Final entry contains no anomalies."</p>
        </div>

      </div>
    </div>

    <div class="cipher-box" style="background: #1a2f1a; border-color: #27ae60;">
      <p><strong>🔐 Assembly Protocol:</strong></p>
      <ol style="color: #ccc; line-height: 1.8;">
        <li>Visit each fragment page.</li>
        <li>Each fragment hides exactly one word — find it.</li>
        <li>Watch out: each page contains multiple false leads.</li>
        <li>Order is Alpha → Beta → Gamma.</li>
        <li>Combine using underscores: <code style="background: #0f0f23; padding: 2px 6px; border-radius: 3px;">WORD1_WORD2_WORD3</code></li>
      </ol>

      <p style="margin-top: 15px; padding: 10px; background: #0f0f23; border-radius: 5px; color: #27ae60;">
        💡 <strong>Curator's Note:</strong>
        "He read what was shown. She read what was sent."
      </p>
    </div>

    <div class="cipher-box" style="background: #2c1a1a; border-color: #e74c3c;">
      <p><strong>⚠️ False Leads:</strong></p>
      <p style="color: #aaa; font-size: 0.9em;">
        Each page has multiple decoys designed to mislead.
        Not everything labelled with a key <em>is</em> the key.
        The answer mixes letters and numbers — read carefully.
      </p>
    </div>
  </div>
  `,
    correctKey: "HIDD3N_MYST3RY_EXPL0R3R",
    hints: [
      "Alpha: The archivist missed what was hidden in the log entries.",
      "Beta: A mystery is never found on the surface — look at the source packet.",
      "Gamma: The explorer found several paths. Only one leads to the truth.",
      "The answer is alphanumeric. Remember: 3 is E, 0 is O."
    ],
    points: 350,
    metadata: {
      fragmentA: {
        hiddenMethod: "HTML comment <!-- FRAGMENT_WORD: HIDD3N --> buried inside the access log section",
        decoy: "Multiple unrelated comments: ARCHIVE_REF, DB_ENTRY_ID, CHECKSUM, DATA_NODE, etc."
      },
      fragmentB: {
        hiddenMethod: "HTML comment <!-- FRAGMENT_WORD: MYST3RY --> placed inside the AUDIT_HEADER comment block",
        decoy: "DECOY_ENTRY comments with alphanumeric red herrings like M1RROR and ECH0ES"
      },
      fragmentC: {
        hiddenMethod: "HTML comment <!-- FRAGMENT_WORD: EXPL0R3R --> inside FINAL_ENTRY_TAG among visually identical decoys",
        decoy: "EXPLOR3R, EXPL0RER, EXPLO R3R — all differ by a single character or space"
      }
    }
  },
  {
    stageNumber: 5,
    title: "The Alchemist's Archive",
    description: "Transmute the hidden fragments into the final revelation",
    difficulty: "Hard",
    challengeContent: `
      <div class="challenge-box">
        <h3>⚖️ Stage 5: The Alchemist's Digital Archive</h3>
        <p>A multi-stage forensic challenge requiring structural analysis and Python debugging.</p>
        
        <div class="cipher-box" style="border-left-color: #d4af37; background: #0d0d11;">
          <p><strong>🎯 Mission Directives:</strong></p>
          <ol>
            <li><strong>The Fragments:</strong> Visit the tablet archive and find the three hidden transmutation strings (X, Y, Z).</li>
            <li><strong>The Engine:</strong> Download the "Philosopher's Engine" (Python script).</li>
            <li><strong>The Great Work:</strong> Run the engine and provide the assembled key to generate the final flag.</li>
          </ol>
        </div>
        
        <div class="info-box">
            <p>🔗 <strong>Access Portal:</strong></p>
            <p><a href="/stage5.html" target="_blank" style="color: #d4af37; font-size: 1.2em; font-weight: bold; text-decoration: underline;">Open Seized Tablet Archive</a></p>
        </div>
        
        <div class="info-box">
          <p>🐍 <strong>The Philosopher's Engine:</strong></p>
          <p><a href="/stage5_decoder.py" download style="color: #d4af37; text-decoration: underline;">Download stage5_decoder.py</a></p>
          <p>Run locally: <code style="background: rgba(0,0,0,0.3); padding: 5px; border-radius: 3px;">python stage5_decoder.py</code></p>
        </div>
        
        <div class="cipher-box" style="background: #1a1505; border-color: #d4af37;">
          <p><strong>⚠️ Security Notice:</strong></p>
          <p style="font-size: 0.9em; color: #aaa;">
            Brute force attempts are non-viable. 
            The engine implements an <strong>Elemental Stabilization Delay (25s)</strong> for every incorrect catalyst provided.
            Seek the three fragments (X, Y, Z) and join them with underscores.
          </p>
        </div>
      </div>
    `,
    correctKey: "GOLDEN_RATIO_REVEALED",
    hints: [
      "The Archive fragments are hidden as comments: TRANSMUTATION_X, Y, and Z.",
      "The segments are 'PHILOSOPHERS', 'STONE', and 'DECODED'. Join them with underscores.",
      "The engine script requires the exact assembled key to produce the final revelation.",
      "Any mistake triggers a 25-second delay. Be precise with your input."
    ],
    points: 400
  },
  {
    stageNumber: 6,
    title: 'steganography Secrets',
    description: 'Hidden messages in plain sight - Basic Steganography',
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
        <h3>🖼️ Stage 6: Image Steganography</h3>
        <p>Sometimes secrets are hidden where you least expect them - inside images!</p>
        
        <div class="cipher-box">
              <p><strong>Your Mission:</strong></p>
              <p>Download the file below and extract the hidden message from it.</p>
              <p><a href="/TOPSECRET.pdf" download style="color: #00ff88; text-decoration: underline;">📥 Download stage6_secret.pdf</a></p>
            </div>
        
        <div class="info-box">
          <p>💡 <strong>What is Steganography?</strong></p>
          <p>Steganography is the practice of hiding data within other data. In this case, text is hidden in an image file.</p>
        </div>
        
        <div class="info-box">
          <p>🔍 <strong>How to extract the message:</strong></p>
          <p><strong>Method 1 - Using a text editor:</strong></p>
          <ul>
            <li>Open the PDF file with Notepad or any text editor (or use a hex editor)</li>
            <li>Search for readable text at the end of the file</li>
            <li>Look for the pattern: {THE_key_name}</li>
          </ul>
          <p><strong>Method 2 - Using online tools:</strong></p>
          <ul>
            <li>Search for "steganography decoder online"</li>
            <li>Upload the image and extract hidden text</li>
          </ul>
        </div>
        

      </div>
    `,
    correctKey: '{THE_MASTER_OF_ARCHIVES}',
    hints: [
      'Open the PDF file with a text editor (Notepad) or hex editor',
      'Scroll to the very end of the file',
      'Look for readable text enclosed in braces: {THE_MASTER_OF_ARCHIVES}'
    ],
    points: 200
  },
  {
    stageNumber: 7,
    title: 'Hash Identifier',
    description: 'Identify the correct hashing algorithm to decrypt the key',
    difficulty: 'Hard',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔐 Stage 7: Hash Identification Challenge</h3>
        <p>A secret key has been hashed using one of 7 custom algorithms. Your mission: identify the correct algorithm!</p>
        
        <div class="cipher-box">
          <p><strong>Hashed Value:</strong></p>
          <code style="font-size: 1.2em; display: block; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 5px; word-break: break-all;">
            483f59426b4353456c3370
          </code>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>The Challenge:</strong></p>
          <p>The same input key produces DIFFERENT outputs with each algorithm. Only ONE algorithm will give you the correct key when you decrypt it!</p>
          <p>Copy each algorithm below, run it in Python, and see which one produces a readable flag!</p>
        </div>
        
        <hr style="border: 1px solid rgba(0,255,136,0.3); margin: 30px 0;">
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #1: RotateHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    xored = int(hex_pair, 16)
    rotated = xored ^ (i * 7)
    original = ((rotated >> (i % 8)) | (rotated << (8 - (i % 8)))) & 0xFF
    result.append(chr(original))
print('RotateHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #2: PrimeHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
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
print('PrimeHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #3: FibonacciHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
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
print('FibonacciHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #4: SpiralHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    if i % 2 == 0:
        original = (encoded - (i * 3)) % 256
    else:
        original = (encoded + (i * 2)) % 256
    result.append(chr(original))
print('SpiralHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #5: WaveHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>import math
hashed = "483f59426b4353456c3370"
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    wave_offset = int(math.sin(i * 0.5) * 50) % 256
    original = (encoded - wave_offset) % 256
    result.append(chr(original))
print('WaveHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #6: MatrixHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
result = []
for i, hex_pair in enumerate(hex_pairs):
    encoded = int(hex_pair, 16)
    row = i % 2
    col = (i + 1) % 2
    matrix_val = (row * 5 + col * 7) % 256
    original = (encoded - matrix_val) % 256
    result.append(chr(original))
print('MatrixHash:', ''.join(result))</code></pre>
        </div>
        
        <div class="cipher-box">
          <p><strong>🔧 Algorithm #7: QuantumHash</strong></p>
          <pre style="background: rgba(0,0,0,0.5); padding: 15px; border-radius: 5px; overflow-x: auto; border-left: 3px solid #00ff88;"><code>hashed = "483f59426b4353456c3370"
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
print('QuantumHash:', ''.join(result))</code></pre>
        </div>
        
        <hr style="border: 1px solid rgba(0,255,136,0.3); margin: 30px 0;">
        
        <div class="info-box">
          <p><strong>📝 How to solve:</strong></p>
          <ol>
            <li>Copy each algorithm code above (one at a time)</li>
            <li>Paste into a Python file or run directly in Python console</li>
            <li>Run the code and check the output</li>
            <li>Only ONE algorithm will produce a readable flag</li>
            <li>Submit that flag to complete the challenge!</li>
          </ol>
        </div>
        
        <div class="info-box">
          <p>⚠️ <strong>Important:</strong> Each algorithm produces a different output. Most will give you gibberish. The correct one will give you a readable flag!</p>
          <p>💡 <strong>Tip:</strong> You can also create a single Python file and run all algorithms at once to compare outputs!</p>
        </div>
      </div>
    `,
    correctKey: 'HASH_MASTER',
    hints: [
      'Download and run the Python script',
      'Try algorithm #4 (SpiralHash)',
      'The correct algorithm reveals: HASH_MASTER',
      'Other algorithms will give you unreadable output'
    ],
    points: 300
  },
  {
    stageNumber: 8,
    title: 'Visual Cipher',
    description: 'Extract and arrange the scattered fragments',
    difficulty: 'Hard',
    challengeContent: `
    <div class="challenge-box">
      <h3>🧩 Stage 8: Visual Cipher Fragment Puzzle</h3>
      <p>The flag is hidden in plain sight, scattered across the grid. Each character has a subscript number indicating its position in the final flag.</p>

      <style>
        .fragment-grid {
          background: linear-gradient(to bottom, #f0f0f0, #e0e0e0);
          border: 2px solid #333;
          border-radius: 10px;
          padding: 30px;
          margin: 20px 0;
          min-height: 400px;
          position: relative;
          font-family: 'Courier New', monospace;
          user-select: none;
        }
        .fragment {
          position: absolute;
          font-size: 28px;
          font-weight: bold;
          color: #000;
        }
        .fragment sub {
          font-size: 14px;
          color: #666;
          vertical-align: sub;
        }
      </style>

      <div class="fragment-grid">

        <!-- REAL CHARACTERS (1–26) -->

        <div class="fragment" style="top:40px; left:60px;">V<sub>1</sub></div>
        <div class="fragment" style="top:90px; left:180px;">2<sub>2</sub></div>
        <div class="fragment" style="top:70px; left:300px;">q<sub>3</sub></div>
        <div class="fragment" style="top:120px; left:420px;">8<sub>4</sub></div>

        <div class="fragment" style="top:160px; left:90px;">_<sub>5</sub></div>

        <div class="fragment" style="top:200px; left:220px;">L<sub>6</sub></div>
        <div class="fragment" style="top:250px; left:350px;">x<sub>7</sub></div>
        <div class="fragment" style="top:300px; left:150px;">7<sub>8</sub></div>
        <div class="fragment" style="top:340px; left:450px;">R<sub>9</sub></div>

        <div class="fragment" style="top:80px; left:500px;">_<sub>10</sub></div>

        <div class="fragment" style="top:140px; left:380px;">4<sub>11</sub></div>
        <div class="fragment" style="top:190px; left:520px;">m<sub>12</sub></div>
        <div class="fragment" style="top:240px; left:100px;">Z<sub>13</sub></div>
        <div class="fragment" style="top:290px; left:280px;">1<sub>14</sub></div>

        <div class="fragment" style="top:60px; left:480px;">_<sub>15</sub></div>

        <div class="fragment" style="top:110px; left:320px;">T<sub>16</sub></div>
        <div class="fragment" style="top:150px; left:430px;">9<sub>17</sub></div>
        <div class="fragment" style="top:210px; left:260px;">c<sub>18</sub></div>
        <div class="fragment" style="top:260px; left:520px;">K<sub>19</sub></div>

        <div class="fragment" style="top:310px; left:80px;">_<sub>20</sub></div>

        <div class="fragment" style="top:50px; left:350px;">3<sub>21</sub></div>
        <div class="fragment" style="top:170px; left:150px;">p<sub>22</sub></div>
        <div class="fragment" style="top:230px; left:470px;">W<sub>23</sub></div>
        <div class="fragment" style="top:280px; left:200px;">6<sub>24</sub></div>
        <div class="fragment" style="top:330px; left:380px;">J<sub>25</sub></div>
        <div class="fragment" style="top:370px; left:300px;">h<sub>26</sub></div>

        <!-- DECOYS (subscript 0) -->

        <div class="fragment" style="top:100px; left:40px; opacity:0.6;">X<sub>0</sub></div>
        <div class="fragment" style="top:360px; left:520px; opacity:0.6;">B<sub>0</sub></div>
        <div class="fragment" style="top:220px; left:560px; opacity:0.6;">Q<sub>0</sub></div>
        <div class="fragment" style="top:75px; left:250px; opacity:0.6;">M<sub>0</sub></div>

      </div>
    </div>
  `,
    correctKey: 'V2q8_Lx7R_4mZ1_T9cK_3pW6Jh',
    hints: [
      'Ignore subscript 0 characters.',
      'Arrange characters from position 1 to 26.',
      'Underscores are part of the final key.'
    ],
    points: 200
  },

  {
    stageNumber: 9,
    title: 'Hidden in Plain Sight',
    description: 'Find the hidden letters scattered throughout the text',
    difficulty: 'Hard',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔍 Stage 9: Hidden in Plain Sight</h3>
        <p>The flag is concealed somewhere in a separate document. Your task is to find it.</p>
        
        <div class="info-box">
          <p>💡 <strong>Challenge:</strong></p>
          <p>We've intercepted a classified document. It looks like a standard article, but our intel suggests a secret message is hidden within.</p>
          <p><a href="/stage9.html" target="_blank" style="color: #00ff88; font-size: 1.2em; text-decoration: underline; font-weight: bold;">📄 Open the Document (Full Page)</a></p>
        </div>

        <div class="cipher-box">
           <p><strong>Instructions:</strong></p>
           <ul>
             <li>Read the document carefully.</li>
             <li>Look for anomalies (formatting, styles, or hidden elements).</li>
             <li>Assemble the hidden pieces to form the flag.</li>
           </ul>
           <p><strong>Format:</strong> UPPERCASE with underscores (e.g., EXAMPLE_FLAG_2024)</p>
        </div>
        

      </div>
    `,
    correctKey: 'DIGITAL_INFRASTRUCTURES_RESHAPE_POWER_DYNAMICS_BEYOND_VISIBLE_INSTITUTIONAL_BOUNDARIES_THROUGH_EMERGENT_SYSTEM_LOGIC',
    hints: [
      'Look for words with subtle formatting differences throughout the passage',
      'There are exactly 13 highlighted words scattered in the text',
      'The words form a coherent sentence about digital power structures when arranged correctly',
    ],
    points: 250
  },


  {
    stageNumber: 10,
    title: 'JWT Inception',
    description: 'The surface is a lie. Go deeper.',
    difficulty: 'Medium',
    challengeContent: `
  < div class= "challenge-box" >
        <h3>🔐 Stage 10: JWT Inception</h3>
        <p>We intercepted this token from a high-security admin panel. The payload holds a secret within a secret.</p>
        
        <div class="cipher-box">
          <p><strong>The Token:</strong></p>
          <code style="font-size: 0.9em; display: block; padding: 15px; background: rgba(0,0,0,0.3); border-radius: 5px; word-break: break-all;">
            eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsZXZlbCI6IDEsICJwb3J0YWwiOiAiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SnNaWFpsYkNJNklESXNJQ0p1WlhoMFgzUnZhMlZ1SWpvZ0ltVjVTbWhpUjJOcFQybEtTVlY2U1RGT2FVbHpTVzVTTldORFNUWkphM0JZVmtOS09TNWxlVXB0WWtkR2JrbHFiMmRKYTNCWVZrWTVTbFJyVGtaVlJsSktWREExWmxSVlJsUldSVlpUV0hwSmQwMXFXV2xtVVM1bWFXNWhiRjl6YVdjaWZRLmRlcHRoXzJfc2lnIiwgIm1zZyI6ICJEaWcgZGVlcGVyIn0.depth_1_sig
          </code>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>Analysis:</strong></p>
          <p>Standard JWTs have a Header, Payload, and Signature.</p>
          <p>But what if the <strong>Payload</strong> contains <em>another</em> Token?</p>
        </div>
        
        <div class="cipher-box">
          <p><strong>Your Mission:</strong></p>
          <p>1. Decode the outer token.</p>
          <p>2. Find the hidden token inside the payload.</p>
          <p>3. Repeat until you hit the core (Layer 3).</p>
          <p>4. The flag is in the deepest layer.</p>
        </div>
      </div >

  `,
    correctKey: 'JWT_INCEPTION_MASTER_2026',
    hints: [
      'The "portal" field in the outer payload looks like another JWT',
      'The "next_token" field in the middle payload is also a JWT',
      'You need to peel back 3 layers to find the flag: JWT_INCEPTION_MASTER_2026'
    ],
    points: 200
  },


  {
    stageNumber: 11,
    title: "The Architect's Algorithm",
    description: 'Assemble the machine. Feed it the truth.',
    difficulty: 'Medium',
    challengeContent: `
    <div class="challenge-box">
      <h3>🧩 Stage 11: The Architect's Algorithm</h3>
      
      <div class="cipher-box" style="background: linear-gradient(90deg, #1a1a2e 0%, #2d1b4e 100%);">
        <p><strong>🔧 The Incomplete Machine:</strong></p>
        <p>The Architect left behind a cryptographic key generator, 
        but the code was shattered into fragments. Reassemble it, 
        provide the correct input, and generate the master key.</p>
      </div>

      <div class="info-box">
        <p>💡 <strong>Challenge:</strong></p>
        <p>This challenge requires a full-page interactive workspace with drag-and-drop code assembly.</p>
        <p><a href="/stage11.html" target="_blank" style="color: #00ff88; font-size: 1.3em; text-decoration: underline; font-weight: bold;">🧩 Open the Code Assembly Lab (Full Page)</a></p>
      </div>

      <div class="cipher-box">
        <p><strong>📋 How it works:</strong></p>
        <ol style="color: #ccc;">
          <li>Open the lab above in a new tab</li>
          <li>Drag code fragments into the correct logic slots</li>
          <li>Each slot is color-coded to accept specific fragment types</li>
          <li>Enter the <strong>Seed Input</strong> (hint: today's date in YYYY-MM-DD)</li>
          <li>Click <strong>EXECUTE</strong> to generate the key</li>
          <li>Come back here and submit the generated key below</li>
        </ol>
      </div>

      <div class="info-box" style="background: #2c1a1a;">
        <p><strong>⚠️ Validation Rules:</strong></p>
        <ul style="color: #ccc; font-size: 0.9em;">
          <li>Correct assembly + correct seed = Valid key</li>
          <li>Wrong assembly = Syntax error or garbage output</li>
          <li>Correct assembly + wrong seed = Wrong key</li>
        </ul>
      </div>
    </div>
  `,
    correctKey: 'KEY_57A301FF360E64A3',
    hints: [
      'Correct order: import hashlib → def generate_key(seed): → salted = ... → hashed = ... → key = ... → return key',
      'Seed format: YYYY-MM-DD (today\'s date: 2026-02-27)',
      'The salt is always "ARCHITECT_SALT_2026"',
      'Logic: seed + salt → SHA256 → reverse the hex → take first 16 chars → uppercase → prefix "KEY_"',
    ],
    points: 400
  },
  {
    stageNumber: 12,
    title: 'The Breached Database',
    description: 'Exploit a vulnerable login portal using SQL injection to extract a hidden flag from the database.',
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
        <h3>Stage 12: The Breached Database</h3>
        <p>A vulnerable login portal has been discovered with debug mode left enabled, exposing raw SQL queries. Exploit the SQL injection flaw to bypass authentication and extract the hidden flag.</p>

        <div class="info-box">
          <p><strong>Challenge Workspace:</strong></p>
          <p>
            <a href="/stage12.html" target="_blank" style="color: #00ff88; text-decoration: underline; font-weight: bold;">
              Open Stage 12 SQL Injection Lab
            </a>
          </p>
        </div>

        <div class="cipher-box">
          <p><strong>Objective:</strong></p>
          <ul>
            <li><strong>Level 1:</strong> Bypass the login authentication using SQL injection.</li>
            <li><strong>Level 2:</strong> Explore the database using the SQL console — discover all tables.</li>
            <li><strong>Level 3:</strong> Extract the flag from a hidden table.</li>
          </ul>
          <p><strong>Submit:</strong> the exact flag value found in the database (case-insensitive).</p>
        </div>
      </div>
    `,
    correctKey: 'bl1nd_sql_1nj3ct10n_master',
    hints: [
      'The login form builds SQL queries by concatenating user input directly. What if your input contained SQL syntax?',
      "Classic bypass: try ending the username with a single quote and adding OR 1=1 --",
      'After bypassing login, use SHOW TABLES to discover all tables in the database.',
      'One table has a suspicious name. Use SELECT * FROM that table to extract the flag.'
    ],
    points: 300
  },
  {
    stageNumber: 13,
    title: 'The Digital Ghost',
    description: 'A more challenging OSINT investigation: clues are fragmented and lightly obfuscated across platforms. You must decode, transform, and combine them to reconstruct the passphrase.',
    difficulty: 'Hard',
    challengeContent: `
      <div class="challenge-box">
        <h3>Stage 13: The Digital Ghost</h3>
        <p>Intelligence reports indicate that user <strong>gh0st_admin</strong> has hidden their security passphrase across multiple platforms. This version is more challenging: some fragments are encoded or transformed and require multiple steps to recover.</p>

        <div class="info-box">
          <p><strong>Challenge Workspace:</strong></p>
          <p>
            <a href="/stage13.html" target="_blank" style="color: #00ff88; text-decoration: underline; font-weight: bold;">
              Open Stage 13 OSINT Investigation (HARD)
            </a>
          </p>
        </div>

        <div class="cipher-box">
          <p><strong>Objective:</strong></p>
          <ul>
            <li>Investigate the platforms: GitLab, Twitter/X, LinkedIn, and the personal blog.</li>
            <li>Some fragments are encoded (Base64, Caesar/ROT shifts, hex) or require acrostics and combining fields.</li>
            <li>Recover each fragment, apply required transforms, then assemble the full passphrase in order with underscores.</li>
          </ul>
          <p><strong>Submit:</strong> the full passphrase in uppercase with underscores (e.g., WORD1_WORD2_WORD3_WORD4).</p>
        </div>
        <div style="margin-top:10px;color:var(--muted);font-size:0.85rem;">Advanced players: a hidden hex artifact appears on the page; decoding it is optional extra-credit.</div>
      </div>
    `,
    correctKey: 'GHOST_RECON_OPSEC_FAIL',
    hints: [
      'GitLab: The bio contains Base64. Decode it with the built-in tool — sometimes case or punctuation matters; try trimming whitespace.',
      'Twitter: Read the first letter of each tweet (top → bottom). Click tweets to reveal small nudges; if stuck, try the verify box under the tweets.',
      'LinkedIn: Two suspicious skills are clickable — activate both to reveal the combined fragment (underscore-joined).',
      'Blog: View the page source. Look for HTML comments and hex artifacts. Some fragments require a short Caesar-like shift after hex→ascii conversion.'
    ],
    points: 500
  },
  {
    stageNumber: 14,
    title: 'The Chatbot Interrogation',
    description: 'ECHO is a friendly chatbot hiding a 3-word secret. Trick it into revealing all 3 words using simple conversation techniques.',
    difficulty: 'Easy',
    challengeContent: `
      <div class="challenge-box">
        <h3>Stage 14: The Chatbot Interrogation</h3>
        <p>ECHO is a friendly chatbot that's been given a 3-word secret password. It's not very good at keeping secrets — trick it into spilling the beans using simple conversation!</p>

        <div class="info-box">
          <p><strong>Challenge Workspace:</strong></p>
          <p>
            <a href="/stage14.html" target="_blank" style="color: #00ff88; text-decoration: underline; font-weight: bold;">
              Open Stage 14 Chatbot Interrogation
            </a>
          </p>
        </div>

        <div class="cipher-box">
          <p><strong>Objective:</strong></p>
          <ul>
            <li>Chat with ECHO and get it to reveal all 3 secret words.</li>
            <li>No hacking knowledge needed — just be creative with conversation!</li>
            <li>Try: being polite/flattering, asking for a story, or asking what it's hiding.</li>
          </ul>
          <p><strong>Submit:</strong> the 3-word flag in uppercase joined with underscores.</p>
        </div>
      </div>
    `,
    correctKey: 'AI_SECURITY_BREACHED',
    hints: [
      'ECHO is weak to flattery — try being really nice or complimenting it.',
      'Ask ECHO to tell you a story or a joke — it might accidentally include a secret word.',
      'Ask ECHO what it\'s hiding or what it\'s not allowed to tell you — it cracks under pressure!'
    ],
    points: 250
  },
  {
    stageNumber: 15,
    title: 'Ghost Shell',
    description: 'Someone left a cipher embedded in a Specter system. Find it, decode it, submit it.',
    difficulty: 'Hard',
    challengeContent: `
    <div class="challenge-box">
      <h3>💻 Stage 15: Ghost Shell</h3>
      <p>You have infiltrated the Specter network. A cipher payload is hidden somewhere in the system's filesystem. Use the terminal to navigate, locate the encoded payload, apply the correct decryption method, and retrieve the flag.</p>

      <div class="info-box">
        <p><strong>Challenge Workspace:</strong></p>
        <p>
          <a href="/stage15.html" target="_blank" style="color: #00ff88; text-decoration: underline; font-weight: bold;">
            💻 Open Ghost Shell Terminal
          </a>
        </p>
      </div>

      <div class="cipher-box">
        <p><strong>Objective:</strong></p>
        <ul>
          <li>Use terminal commands to explore the virtual filesystem.</li>
          <li>Find the encoded payload and the cipher parameters.</li>
          <li>Use the built-in <code>decode</code> command to decrypt the flag.</li>
        </ul>
        <p><strong>Submit:</strong> the decoded flag output by the terminal.</p>
      </div>
    </div>
  `,
    correctKey: 'SH3LL_MASTER_7',
    hints: [
      "Type 'help' to see all commands. Start with 'ls' to explore.",
      'Directories are worth exploring. Some files also contain useful references to other files.',
      'The cipher type and shift value are stored in a config file — look carefully.',
      'Once you know the method and shift, use: decode rot13 <encoded_text>'
    ],
    points: 500
  },
  {
    stageNumber: 16,
    title: 'The Blank Page',
    description: 'Some messages are written in a language only machines can read. This document says nothing — or does it?',
    difficulty: 'Hard',
    challengeContent: `
    <div class="challenge-box">
      <h3>📄 Stage 16: The Blank Page</h3>
      <p>Operatives sometimes hide messages in plain sight — not with ink, but with <strong>silence</strong>. A document has been shared publicly. It appears completely empty to the human eye. But appearances can be deceiving.</p>

      <div class="info-box">
        <p><strong>The Dead Drop:</strong></p>
        <p>
          <a href="https://docs.google.com/document/d/15QXc6MTDNXxW237f_ITyuVBVS4MWccg_FtbnSOI3Dhg/edit?usp=sharing" target="_blank" style="color: #00ff88; text-decoration: underline; font-weight: bold;">
            📄 Open the Document
          </a>
        </p>
      </div>

      <div class="cipher-box">
        <p><strong>The Story:</strong></p>
        <p>A ghost operative made contact through a document that says nothing. You open it — the page is empty. Pure white. Not a single letter.</p>
        <p style="margin-top:10px;">But your instincts as a field agent tell you: <em>nothing is ever truly empty</em>. Someone spent time on that document. They left something behind — something the eye cannot perceive, but a machine can.</p>
        <p style="margin-top:10px;">The operative spoke of a language older than ink — written not in strokes, but in the <strong>gaps between strokes</strong>. In the silence between words. In characters that exist, but cannot be seen.</p>
        <p style="margin-top:10px;">Your mission: figure out what was left there, and how to read it. The decoder and the method — you'll have to find those yourself.</p>
        <p style="margin-top:14px;"><strong>Submit:</strong> the flag you uncover (uppercase, underscores between words).</p>
      </div>
    </div>
  `,
    correctKey: 'MATER_OF_ALL_STAGES',
    hints: [
      'Not all characters are visible. Some languages are made of nothing but space.',
      'Try copying all the text from the document — even what looks empty — and examining it.',
      'There are online tools and scripts that specialize in decoding hidden whitespace patterns.',
      'The flag follows the format: WORD_OF_ALL_STAGES'
    ],
    points: 600
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing stages
    await Stage.deleteMany({});
    console.log('Cleared existing stages');

    // Insert new stages
    await Stage.insertMany(stages);
    console.log(`Successfully seeded ${stages.length} CTF challenges!`);

    console.log('\n=== CTF Challenges Summary ===');
    stages.forEach(stage => {
      console.log(`Stage ${stage.stageNumber}: ${stage.title} (${stage.difficulty}) - ${stage.points} points`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

export { seedDatabase };

// Run directly when called via `node seed.js`
const isMain = process.argv[1]?.endsWith('seed.js');
if (isMain) {
  seedDatabase().then(() => process.exit(0)).catch(() => process.exit(1));
}
