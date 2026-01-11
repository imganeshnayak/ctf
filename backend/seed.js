import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import Stage from './models/Stage.js';

dotenv.config();

const stages = [
  {
    stageNumber: 1,
    title: 'Binary Basics',
    description: 'Convert decimal to binary - the foundation of computing!',
    difficulty: 'Easy',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔢 Stage 1: Number to Binary Conversion</h3>
        
        <div class="cipher-box">
          <p><strong>Your Challenge:</strong></p>
          <p>Convert the decimal number <code style="font-size: 1.5em; color: #00ff88;">42</code> to binary.</p>
        </div>
        
        <div class="cipher-box">
          <p><strong>Submit your answer:</strong></p>
          <p>Enter the binary representation of 42 (without spaces or prefixes like "0b")</p>
          <p><em>Example format: If the answer was 13, you'd enter: 1101</em></p>
        </div>
      </div>
    `,
    correctKey: '101010',
    hints: [
      'Powers of 2: 32, 16, 8, 4, 2, 1. Which ones add up to 42?',
      '42 = 32 + 8 + 2. Mark those positions as 1!',
      'The answer is 6 digits long and starts with 1'
    ],
    points: 100
  },
  {
    stageNumber: 2,
    title: 'Caesar\'s Secret',
    description: 'Decode the ancient cipher',
    difficulty: 'Easy',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔐 Stage 2: Caesar Cipher</h3>
        <p>Julius Caesar used a simple cipher to protect his messages. Can you crack it?</p>
        
        <div class="cipher-box">
          <p><strong>Encrypted Message:</strong></p>
          <code>FDHVDU FLSKHU</code>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>About Caesar Cipher:</strong> Each letter is shifted by a fixed number of positions in the alphabet.</p>
          <p>For example, with a shift of 1: A becomes B, B becomes C, and so on.</p>
          <p><strong>Hint:</strong> Try different shift values from 1 to 25. The most common shift is 3!</p>
        </div>
        
        <p><strong>Your task:</strong> Decode the message and submit it as the flag (use underscores instead of spaces).</p>
      </div>
    `,
    correctKey: 'CAESAR_CIPHER',
    hints: [
      'The shift value is 3 positions',
      'F shifted back by 3 becomes C',
      'Replace spaces with underscores in your answer'
    ],
    points: 150
  },
  {
    stageNumber: 3,
    title: 'Base64 Mystery',
    description: 'Decode the encoded message',
    difficulty: 'Easy',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔤 Stage 3: Base64 Encoding</h3>
        <p>Base64 is a common encoding scheme used to represent binary data in ASCII format.</p>
        
        <div class="cipher-box">
          <p><strong>Encoded String:</strong></p>
          <code>REVDT0RFX01BU1RFUg==</code>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>What is Base64?</strong> It's not encryption, just encoding! Anyone can decode it.</p>
          <p><strong>How to decode:</strong></p>
          <ul>
            <li>Use online tools: Search for "base64 decode" in your browser</li>
            <li>Use browser console: <code>atob("your_string_here")</code></li>
            <li>Use command line: <code>echo "string" | base64 -d</code></li>
          </ul>
          <p><strong>Tip:</strong> The "==" at the end is padding - it's a telltale sign of Base64!</p>
        </div>
        
        <p><strong>Your task:</strong> Decode the string and submit the result as your flag.</p>
      </div>
    `,
    correctKey: 'DECODE_MASTER',
    hints: [
      'Use an online Base64 decoder',
      'Or try atob() in your browser console',
      'The decoded text is your flag'
    ],
    points: 150
  },
  {
    stageNumber: 4,
    title: 'HTML Detective',
    description: 'Find the hidden flag in the HTML page',
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
        <h3>🔍 Stage 4: HTML Detective</h3>
        
        <div class="cipher-box">
          <p><strong>Your Mission:</strong></p>
          <p>A special HTML page has been created for this challenge. Visit it and find the hidden flag!</p>
          <p><a href="/stage4.html" target="_blank" style="color: #00ff88; font-size: 1.2em; text-decoration: underline;">🔗 Click here to open Stage 4 HTML page</a></p>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>Tips:</strong></p>
          <ul>
            <li>The flag is hidden somewhere in the HTML source code</li>
            <li>Try inspecting the page elements</li>
            <li>Look for hidden attributes or encoded data</li>
            <li>You might need to decode something...</li>
          </ul>
        </div>
        
        <div class="cipher-box">
          <p><strong>Submit your answer:</strong></p>
          <p>Once you find and decode the flag, enter it below.</p>
        </div>
      </div>
    `,
    correctKey: 'HTML_MASTER',
    hints: [
      'Inspect elements with class "secret-data"',
      'Look for data attributes (data-flag)',
      'The flag is encoded in Base64 - decode it!'
    ],
    points: 200
  },
  {
    stageNumber: 5,
    title: 'Python Debugger',
    description: 'Find the hidden key and run the Python script',
    difficulty: 'Hard',
    challengeContent: `
      <div class="challenge-box">
        <h3>🐍 Stage 5: Python Debugger Challenge</h3>
        <p>Welcome to the final challenge! This is a multi-step challenge that combines HTML inspection and Python programming.</p>
        
        <div class="cipher-box">
          <p><strong>🎯 Your Mission (3 Parts):</strong></p>
          <ol>
            <li><strong>Part 1:</strong> Visit the special HTML page and find the first part of the flag</li>
            <li><strong>Part 2:</strong> Download and run the Python script</li>
            <li><strong>Part 3:</strong> Enter the first part into the script to get the complete flag</li>
          </ol>
        </div>
        
        <div class="info-box">
          <p>🔗 <strong>Step 1: Visit the Challenge Page</strong></p>
          <p><a href="/stage5.html" target="_blank" style="color: #00ff88; font-size: 1.2em; text-decoration: underline;">Click here to open Stage 5 HTML page</a></p>
          <p>The first part of the flag is hidden in this page. Inspect it carefully!</p>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>Hints for finding the first part:</strong></p>
          <ul>
            <li>Use browser DevTools to inspect the HTML</li>
            <li>Look for hidden elements (display: none)</li>
            <li>Check data attributes on elements</li>
            <li>Search for elements with class names containing "secret" or "key"</li>
          </ul>
        </div>
        
        <div class="info-box">
          <p>🐍 <strong>Step 2: Download and Run the Python Script</strong></p>
          <p><a href="/stage5_decoder.py" download style="color: #00ff88; text-decoration: underline;">Download stage5_decoder.py</a></p>
          <p>Run it with: <code style="background: rgba(0,0,0,0.3); padding: 5px; border-radius: 3px;">python stage5_decoder.py</code></p>
        </div>
        
        <div class="cipher-box">
          <p><strong>📝 What the script does:</strong></p>
          <ul>
            <li>Asks you for the first part of the flag (from the HTML)</li>
            <li>Validates your input using cryptographic hashing</li>
            <li>If correct, decodes and reveals the second part</li>
            <li>Combines both parts to give you the complete flag!</li>
          </ul>
        </div>
        
        <div class="cipher-box">
          <p><strong>Submit your answer:</strong></p>
          <p>Once you run the script successfully, it will display the complete flag. Submit that flag below!</p>
        </div>
      </div>
    `,
    correctKey: 'PYTHON_CHAMPION',
    hints: [
      'Inspect the HTML page - look for elements with class "secret-key"',
      'The first part is in a data-first-part attribute: "PYTHON"',
      'Run the Python script and enter "PYTHON" when asked',
      'The script will output: PYTHON_CHAMPION'
    ],
    points: 250
  },
  {
    stageNumber: 6,
    title: 'Image Secrets',
    description: 'Hidden messages in plain sight - Basic Steganography',
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
        <h3>🖼️ Stage 6: Image Steganography</h3>
        <p>Sometimes secrets are hidden where you least expect them - inside images!</p>
        
        <div class="cipher-box">
          <p><strong>Your Mission:</strong></p>
          <p>Download the image below and extract the hidden message from it.</p>
          <p><a href="/stage6_secret.png" download style="color: #00ff88; text-decoration: underline;">📥 Download stage6_secret.png</a></p>
        </div>
        
        <div class="info-box">
          <p>💡 <strong>What is Steganography?</strong></p>
          <p>Steganography is the practice of hiding data within other data. In this case, text is hidden in an image file.</p>
        </div>
        
        <div class="info-box">
          <p>🔍 <strong>How to extract the message:</strong></p>
          <p><strong>Method 1 - Using strings command (Linux/Mac):</strong></p>
          <pre style="background: rgba(0,0,0,0.3); padding: 10px; border-radius: 5px;">strings stage6_secret.png | grep FLAG</pre>
          <p><strong>Method 2 - Using a text editor:</strong></p>
          <ul>
            <li>Open the PNG file with Notepad or any text editor</li>
            <li>Search for readable text at the end of the file</li>
            <li>Look for the pattern: FLAG{...}</li>
          </ul>
          <p><strong>Method 3 - Using online tools:</strong></p>
          <ul>
            <li>Search for "steganography decoder online"</li>
            <li>Upload the image and extract hidden text</li>
          </ul>
        </div>
        
        <div class="cipher-box">
          <p><strong>Hint:</strong> The flag is appended at the end of the PNG file as plain text!</p>
        </div>
      </div>
    `,
    correctKey: 'STEGO_MASTER',
    hints: [
      'Open the PNG file with a text editor (Notepad)',
      'Scroll to the very end of the file',
      'Look for readable text: STEGO_MASTER'
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
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
        <h3>� Stage 8: Visual Cipher Fragment Puzzle</h3>
        <p>The flag is hidden in plain sight, but scattered across the grid below. Each character has a subscript number indicating its position in the final flag.</p>
        
        <div class="info-box">
          <p>💡 <strong>Your Mission:</strong></p>
          <p>Extract all characters and arrange them by their subscript numbers (₁, ₂, ₃, etc.) to reveal the flag.</p>
          <p><strong>Note:</strong> This challenge requires manual visual extraction. Copy-paste won't help you here!</p>
        </div>
        
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
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
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
        
        <div class="fragment-grid" oncontextmenu="return false;" oncopy="return false;">
          <!-- VISUAL_CIPHER_DECODER_2K26 -->
          <div class="fragment" style="top: 70px; left: 60px;">V<sub>1</sub></div>
          <div class="fragment" style="top: 80px; left: 180px;">I<sub>2</sub></div>
          <div class="fragment" style="top: 60px; left: 150px;">S<sub>3</sub></div>
          <div class="fragment" style="top: 40px; left: 250px;">U<sub>4</sub></div>
          <div class="fragment" style="top: 50px; left: 320px;">A<sub>5</sub></div>
          <div class="fragment" style="top: 90px; left: 390px;">L<sub>6</sub></div>
          
          <div class="fragment" style="top: 160px; left: 90px;">_<sub>7</sub></div>
          
          <div class="fragment" style="top: 130px; left: 220px;">C<sub>8</sub></div>
          <div class="fragment" style="top: 170px; left: 550px;">I<sub>9</sub></div>
          <div class="fragment" style="top: 120px; left: 350px;">P<sub>10</sub></div>
          <div class="fragment" style="top: 100px; left: 520px;">H<sub>11</sub></div>
          <div class="fragment" style="top: 140px; left: 450px;">E<sub>12</sub></div>
          <div class="fragment" style="top: 180px; left: 310px;">R<sub>13</sub></div>
          
          <div class="fragment" style="top: 220px; left: 140px;">_<sub>14</sub></div>
          
          <div class="fragment" style="top: 200px; left: 480px;">D<sub>15</sub></div>
          <div class="fragment" style="top: 210px; left: 420px;">E<sub>16</sub></div>
          <div class="fragment" style="top: 240px; left: 200px;">C<sub>17</sub></div>
          <div class="fragment" style="top: 280px; left: 380px;">O<sub>18</sub></div>
          <div class="fragment" style="top: 260px; left: 520px;">D<sub>19</sub></div>
          <div class="fragment" style="top: 50px; left: 420px;">E<sub>20</sub></div>
          <div class="fragment" style="top: 300px; left: 90px;">R<sub>21</sub></div>
          
          <div class="fragment" style="top: 250px; left: 280px;">_<sub>22</sub></div>
          
          <div class="fragment" style="top: 290px; left: 160px;">2<sub>23</sub></div>
          <div class="fragment" style="top: 320px; left: 450px;">K<sub>24</sub></div>
          <div class="fragment" style="top: 110px; left: 510px;">2<sub>25</sub></div>
          <div class="fragment" style="top: 340px; left: 350px;">6<sub>26</sub></div>
          
          <div class="fragment" style="top: 40px; left: 480px; opacity: 0.7;">X<sub>0</sub></div>
          <div class="fragment" style="top: 350px; left: 240px; opacity: 0.7;">Q<sub>0</sub></div>
          <div class="fragment" style="top: 150px; left: 20px; opacity: 0.7;">B<sub>0</sub></div>
          <div class="fragment" style="top: 280px; left: 550px; opacity: 0.7;">M<sub>0</sub></div>
          <div class="fragment" style="top: 90px; left: 290px; opacity: 0.7;">J<sub>0</sub></div>
          <div class="fragment" style="top: 230px; left: 460px; opacity: 0.7;">Y<sub>0</sub></div>
          <div class="fragment" style="top: 190px; left: 70px; opacity: 0.7;">W<sub>0</sub></div>
        </div>
        
        <div class="cipher-box">
          <p><strong>Instructions:</strong></p>
          <ol>
            <li>Carefully examine the grid above</li>
            <li>Write down each character with its subscript number</li>
            <li><strong>Ignore any characters with subscript 0</strong> (decoys!)</li>
            <li>Arrange the rest in numerical order (1 through 26)</li>
            <li>The arranged characters form the flag</li>
          </ol>
          <p><em>Hint: There are 26 characters total. Use underscores (_) where you see them!</em></p>
        </div>
        
        <div class="info-box">
          <p>⚠️ <strong>Important:</strong></p>
          <p>This is a visual puzzle that requires manual work. Take your time to extract all 26 characters correctly!</p>
        </div>
      </div>
    `,
    correctKey: 'VISUAL_CIPHER_DECODER_2K26',
    hints: [
      'Look for characters with subscript numbers from ₁ to ₂₆',
      'Write them down in order: character at position 1, then 2, then 3, etc.',
      'The flag format includes underscores (_) as separators between words'
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
        <p>The flag is concealed somewhere in this document. Your task is to find it.</p>
        
        <div class="info-box">
          <p>💡 <strong>Challenge:</strong></p>
          <p>Read through the cybersecurity document below carefully. The flag is hidden within the text.</p>
          <p><strong>Before Submitting ensure that Flag has Capital letters and if not convert it to uppercase and submit:</strong> Uppercase letters, numbers, and underscores (e.g., EXAMPLE_FLAG_2024)</p>
        </div>
        
        
        <style>
          .no-select {
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
            -webkit-touch-callout: none;
          }
        </style>
        
        <div class="cipher-box no-select" style="max-height: 500px; overflow-y: auto; padding: 20px; line-height: 1.8; text-align: justify; border: 1px solid #ddd;" oncontextmenu="return false;" oncopy="return false;" oncut="return false;">
          <p>
            In today's rapidly evolving digital landscape, the role of innovation has never been more critical to our collective progress. 
            We find ourselves at the intersection of unprecedented technological advancement and human creativity, where every breakthrough 
            opens new possibilities for solving complex global challenges. The transformation we're witnessing isn't just about faster 
            computers or smarter algorithms; it's fundamentally about reimagining how we interact with information, with each other, 
            and with the world around us.
          </p>
          
          <p>
            Consider how <strong style="font-weight: bold;  font-size: 0.7em;">TECHNOLOGY</strong> has permeated 
            every aspect of our daily existence. From the moment we wake up to the sound of a smart alarm that has analyzed our sleep 
            patterns, to the instant we check our phones for messages from loved ones across the globe, we are constantly engaging with 
            systems designed to enhance our capabilities. These tools have become so seamlessly integrated into our routines that we 
            often forget they represent the culmination of decades of research, development, and iterative improvement by countless 
            engineers and scientists working tirelessly to push the boundaries of what's possible.
          </p>
          
          <p>
            The infrastructure supporting our digital lives operates on a scale that would have been unimaginable just a generation ago. 
            Data centers spanning entire warehouses process billions of transactions every second, while undersea cables stretching 
            thousands of miles carry information at the speed of light between continents. This global network enables real-time 
            collaboration between individuals who have never met in person, facilitates international commerce worth trillions of 
            dollars annually, and provides access to the sum of human knowledge with just a few keystrokes or voice commands.
          </p>
          
          <p>
            Yet with all these advancements comes a profound responsibility to ensure that our <u style="text-decoration: underline;  font-size: 1em;">MODERN</u> 
            systems serve humanity's best interests. We must grapple with questions of privacy, security, and equity as we build 
            the digital future. How do we protect individual rights while enabling the data sharing necessary for innovation? How do 
            we prevent malicious actors from exploiting vulnerabilities in our interconnected systems? How do we ensure that the 
            benefits of technological progress are distributed fairly rather than concentrating wealth and power in the hands of a few?
          </p>
          
          <p>
            These aren't merely theoretical concerns—they have real-world implications that affect billions of people every day. When 
            a social media platform's algorithm determines what news stories appear in our feeds, it <strong><u style="font-weight: bold; text-decoration: underline; font-size: 1.3em;">IS</u></strong> 
            shaping public discourse and potentially influencing democratic processes. When an artificial intelligence system makes 
            decisions about loan applications or job candidates, it can perpetuate historical biases if not carefully designed and 
            monitored. When a cybersecurity breach exposes sensitive personal information, it can have devastating consequences for 
            the individuals affected, from identity theft to financial ruin.
          </p>
          
          <p>
            The pace of change shows no signs of slowing. Emerging technologies like quantum computing promise to revolutionize fields 
            from cryptography to drug discovery. Advances in biotechnology are enabling us to edit genes with unprecedented precision, 
            raising both hopes for curing genetic diseases and concerns about unintended consequences. The Internet of Things is 
            connecting everyday objects to the internet, creating smart homes and cities but also expanding the attack surface for 
            potential security threats. Understanding <strong style="font-weight: bold; text-decoration: underline; font-size: 1.25em;">HOW</strong> 
            these technologies work and their potential impacts is becoming essential knowledge for informed citizenship in the 21st century.
          </p>
          
          <p>
            Education systems worldwide are struggling to keep pace with these rapid changes. The skills that were valuable in the 
            job market a decade ago may be obsolete today, while entirely new career paths are emerging that didn't exist when today's 
            students were born. We need to rethink not just what we teach, but how we teach it, fostering adaptability, critical 
            thinking, and lifelong learning rather than rote memorization of facts that can be instantly retrieved from the internet. 
            The ability to collaborate across disciplines, to communicate complex ideas clearly, and to navigate ambiguity will be 
            increasingly important as automation handles more routine tasks.
          </p>
          
          <p>
            Meanwhile, the environmental impact of our digital infrastructure demands urgent attention. The energy consumption of data 
            centers and cryptocurrency mining operations rivals that of entire countries. Electronic waste from discarded devices contains 
            toxic materials that can harm ecosystems if not properly recycled. As we continue <u style="text-decoration: underline; font-weight: bold; font-size: 1.3em;">SHAPING</u> 
            our technological future, we must prioritize sustainability, seeking renewable energy sources for our digital infrastructure 
            and designing products with their entire lifecycle in mind, from manufacturing to eventual disposal or recycling.
          </p>
          
          <p>
            The COVID-19 pandemic dramatically accelerated many digital trends that were already underway. Remote work became the norm 
            for millions of knowledge workers virtually overnight. Telemedicine expanded rapidly as patients sought to avoid in-person 
            visits. Online education scaled to unprecedented levels as schools and universities closed their physical campuses. These 
            shifts revealed both the tremendous potential and the significant limitations of our current technologies. Video conferencing 
            tools enabled business continuity but couldn't fully replicate the spontaneous interactions and relationship-building that 
            happen in physical offices. Digital learning platforms provided access to education but highlighted the digital divide 
            affecting students without reliable internet access or appropriate devices.
          </p>
          
          <p>
            Looking ahead, the integration of artificial intelligence into more aspects of our lives seems inevitable. AI assistants 
            are becoming more sophisticated, capable of understanding context and nuance in ways that seemed like science fiction just 
            years ago. Autonomous vehicles are being tested on roads around the <strong><u style="font-weight: bold; text-decoration: underline; font-size: 1.25em;">WORLD</u></strong>, 
            promising to reduce traffic accidents and transform urban planning. Machine learning algorithms are discovering new drugs, 
            predicting weather patterns with greater accuracy, and even creating art and music that challenges our understanding of 
            creativity itself.
          </p>
          
          <p>
            However, as these systems become more powerful and pervasive, questions about transparency and accountability become more 
            pressing. When an AI makes a decision that affects someone's life, they deserve to understand why that decision was made. 
            Yet many modern AI systems operate as "black boxes," with decision-making processes so complex that even their creators 
            can't fully explain them. Developing interpretable AI that can justify its conclusions while maintaining high performance 
            is one of <strong style="font-weight: bold; text-decoration: underline; font-size: 1.3em;">THE</strong> great challenges 
            facing researchers today.
          </p>
          
          <p>
            The democratization of technology creation tools is empowering individuals and small teams to build solutions that once 
            would have required massive corporate resources. Open-source software enables developers worldwide to collaborate on projects 
            that benefit everyone. Cloud computing platforms provide access to powerful infrastructure on a pay-as-you-go basis, lowering 
            barriers to entry for startups. No-code and low-code platforms are enabling people without traditional programming skills 
            to create functional applications. This democratization has the potential to unleash a wave of innovation from diverse 
            perspectives and backgrounds.
          </p>
          
          <p>
            Yet <u style="text-decoration: underline; font-weight: bold; font-size: 1.25em;">WE</u> must remain vigilant about the 
            concentration of power in the hands of a few large technology companies. These platforms have become essential infrastructure 
            for modern life, yet they're controlled by private entities accountable primarily to their shareholders rather than the 
            public interest. Debates about content moderation, data ownership, and market competition are fundamentally about who gets 
            to set the rules for our digital public spaces and how those rules are enforced.
          </p>
          
          <p>
            The future of work is being reshaped by automation and AI, with predictions ranging from utopian visions of abundance and 
            leisure to dystopian scenarios of mass unemployment and inequality. The reality will likely fall somewhere in between, 
            with some jobs disappearing while new ones emerge, and many roles being transformed rather than eliminated entirely. 
            Preparing for this transition requires not just technical solutions but also social policies that ensure economic security 
            and opportunity for all members of society.
          </p>
          
          <p>
            Blockchain technology and cryptocurrencies represent another frontier of innovation, promising to <strong style="font-weight: bold; text-decoration: underline; font-size: 1.3em;">CONNECT</strong> 
            people in new ways through decentralized systems that don't require traditional intermediaries. While the technology has 
            shown promise in areas like supply chain transparency and digital identity, it has also been associated with speculation, 
            fraud, and environmental concerns due to energy-intensive mining processes. Finding the right applications and governance 
            models for blockchain will be crucial to realizing its potential benefits while mitigating its risks.
          </p>
          
          <p>
            As we navigate these complex challenges and opportunities, it's essential to maintain a human-centered perspective. Technology 
            should serve people, not the other way around. The most successful innovations are those that genuinely improve people's 
            <u style=" font-weight: bold; font-size: 1em;">Lives</u> rather than simply being technically 
            impressive. This means involving diverse stakeholders in the design process, considering the needs of vulnerable populations, 
            and being willing to acknowledge when a technology isn't working as intended and needs to be redesigned or even abandoned.
          </p>
          
          <p>
            In conclusion, we stand at a pivotal moment in human history. The decisions we make today about how to develop, deploy, 
            and govern technology will shape the world for generations to come. By approaching these challenges with wisdom, empathy, 
            and a commitment to the common good, we can harness the incredible power of innovation to create a future that is more 
            prosperous, sustainable, and just for all. The path forward requires ongoing dialogue between technologists, policymakers, 
            ethicists, and citizens from all walks of life, working together to ensure that our technological capabilities are matched 
            by our moral wisdom and social responsibility.
          </p>
        </div>
        
        <script>
          // Prevent keyboard shortcuts for copying in cipher-box
          document.addEventListener('DOMContentLoaded', function() {
            const cipherBox = document.querySelector('.cipher-box.no-select');
            if (cipherBox) {
              cipherBox.addEventListener('keydown', function(e) {
                // Prevent Ctrl+C, Ctrl+A, Ctrl+X
                if ((e.ctrlKey || e.metaKey) && (e.key === 'c' || e.key === 'a' || e.key === 'x' || e.key === 'C' || e.key === 'A' || e.key === 'X')) {
                  e.preventDefault();
                  return false;
                }
              });
            }
          });
        </script>
        
        <div class="info-box" style="margin-top: 20px;">
          <p>⚠️ <strong>Hint Available (Penalty: -150 points)</strong></p>
          <p>Stuck? You can reveal a hint, but it will cost you 150 points from your score.</p>
          <button id="revealHintBtn" onclick="revealHint()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; font-size: 1em; margin-top: 10px;">
            💡 Reveal Hint (-150 points)
          </button>
          <div id="hintContent" style="display: none; margin-top: 15px; padding: 15px; background: rgba(255,107,107,0.1); border-left: 4px solid #ff6b6b; border-radius: 5px;">
            <p><strong>Hint:</strong> Look for text that stands out - different colors, bold formatting, shadows, borders, or backgrounds and changes in the text size. Arrange the words in the meaning full sentence. Count carefully - there should be exactly 10 words  total!</p>
          </div>
        </div>
        
        <script>
          function revealHint() {
            const hintContent = document.getElementById('hintContent');
            const hintBtn = document.getElementById('revealHintBtn');
            
            if (hintContent.style.display === 'none') {
              if (confirm('Revealing this hint will deduct 150 points from your score. Continue?')) {
                hintContent.style.display = 'block';
                hintBtn.disabled = true;
                hintBtn.style.opacity = '0.5';
                hintBtn.style.cursor = 'not-allowed';
                hintBtn.textContent = '💡 Hint Revealed (-150 points)';
                
                // Store hint usage in localStorage to persist across page reloads
                localStorage.setItem('stage9_hint_used', 'true');
                
                // Notify parent component about hint usage
                window.dispatchEvent(new CustomEvent('hintUsed', { 
                  detail: { stage: 9, penalty: 150 } 
                }));
              }
            }
          }
          
          // Check if hint was already revealed
          window.addEventListener('DOMContentLoaded', function() {
            if (localStorage.getItem('stage9_hint_used') === 'true') {
              const hintContent = document.getElementById('hintContent');
              const hintBtn = document.getElementById('revealHintBtn');
              hintContent.style.display = 'block';
              hintBtn.disabled = true;
              hintBtn.style.opacity = '0.5';
              hintBtn.style.cursor = 'not-allowed';
              hintBtn.textContent = '💡 Hint Already Revealed';
            }
          });
        </script>
      </div>
    `,
    correctKey: 'MODERN_TECHNOLOGY_IS_SHAPING_THE_WORLD_AND_HOW_WE_CONNECT_LIVES',
    hints: [
      'Look for words with subtle background highlighting throughout the passage',
      'There are exactly 11 highlighted words scattered in the text',
      'The words are jumbled - you need to arrange them in the correct order to form a logical sentence',
    ],
    points: 250
  },
  {
    stageNumber: 10,
    title: 'JWT Inception',
    description: 'The surface is a lie. Go deeper.',
    difficulty: 'Medium',
    challengeContent: `
      <div class="challenge-box">
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
      </div>

    `,
    correctKey: 'JWT_INCEPTION_MASTER_2026',
    hints: [
      'The "portal" field in the outer payload looks like another JWT',
      'The "next_token" field in the middle payload is also a JWT',
      'You need to peel back 3 layers to find the flag: JWT_INCEPTION_MASTER_2026'
    ],
    points: 200
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
    console.log('Successfully seeded 10 CTF challenges!');

    console.log('\n=== CTF Challenges Summary ===');
    stages.forEach(stage => {
      console.log(`Stage ${stage.stageNumber}: ${stage.title} (${stage.difficulty}) - ${stage.points} points`);
    });

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
