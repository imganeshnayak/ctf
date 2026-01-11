#!/usr/bin/env python3
"""
Stage 7: Hash Identification Challenge
CTF Hash Analyzer Tool

This tool implements 7 custom hashing algorithms.
Each algorithm produces a DIFFERENT output for the same input.
Only ONE algorithm will correctly decrypt the hash to reveal the flag!
"""

import hashlib
import math


class CustomHashAlgorithms:
    """Collection of 7 custom hashing algorithms"""
    
    @staticmethod
    def rotate_hash(text):
        """Algorithm 1: RotateHash - Rotates bits and XORs with position"""
        result = []
        for i, char in enumerate(text):
            # Rotate bits left by position and XOR with position
            rotated = ((ord(char) << (i % 8)) | (ord(char) >> (8 - (i % 8)))) & 0xFF
            xored = rotated ^ (i * 7)
            result.append(format(xored, '02x'))
        return ''.join(result)
    
    @staticmethod
    def rotate_hash_decrypt(hashed):
        """Decrypt RotateHash"""
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                xored = int(hex_pair, 16)
                # Reverse XOR
                rotated = xored ^ (i * 7)
                # Reverse rotation
                original = ((rotated >> (i % 8)) | (rotated << (8 - (i % 8)))) & 0xFF
                result.append(chr(original))
            return ''.join(result)
        except:
            return "[ERROR: Invalid hash for RotateHash]"
    
    @staticmethod
    def prime_hash(text):
        """Algorithm 2: PrimeHash - Multiplies by prime numbers"""
        primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
        result = []
        for i, char in enumerate(text):
            prime = primes[i % len(primes)]
            encoded = (ord(char) * prime) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def prime_hash_decrypt(hashed):
        """Decrypt PrimeHash"""
        try:
            primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37]
            # Modular multiplicative inverses of primes mod 256
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
            return "[ERROR: Invalid hash for PrimeHash]"
    
    @staticmethod
    def fibonacci_hash(text):
        """Algorithm 3: FibonacciHash - Uses Fibonacci sequence mixing"""
        fib = [1, 1]
        for _ in range(20):
            fib.append((fib[-1] + fib[-2]) % 256)
        
        result = []
        for i, char in enumerate(text):
            fib_val = fib[i % len(fib)]
            encoded = (ord(char) + fib_val) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def fibonacci_hash_decrypt(hashed):
        """Decrypt FibonacciHash"""
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
            return "[ERROR: Invalid hash for FibonacciHash]"
    
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
    
    @staticmethod
    def wave_hash(text):
        """Algorithm 5: WaveHash - Sine wave based encoding"""
        result = []
        for i, char in enumerate(text):
            # Use sine wave to create varying offset
            wave_offset = int(math.sin(i * 0.5) * 50) % 256
            encoded = (ord(char) + wave_offset) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def wave_hash_decrypt(hashed):
        """Decrypt WaveHash"""
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
            return "[ERROR: Invalid hash for WaveHash]"
    
    @staticmethod
    def matrix_hash(text):
        """Algorithm 6: MatrixHash - Matrix multiplication cipher"""
        result = []
        for i, char in enumerate(text):
            # Simple 2x2 matrix transformation
            row = i % 2
            col = (i + 1) % 2
            matrix_val = (row * 5 + col * 7) % 256
            encoded = (ord(char) + matrix_val) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def matrix_hash_decrypt(hashed):
        """Decrypt MatrixHash"""
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
            return "[ERROR: Invalid hash for MatrixHash]"
    
    @staticmethod
    def quantum_hash(text):
        """Algorithm 7: QuantumHash - Quantum-inspired superposition"""
        result = []
        for i, char in enumerate(text):
            # Simulate quantum superposition with multiple states
            state1 = (ord(char) * 3) % 256
            state2 = (ord(char) * 5) % 256
            # Collapse to single state
            encoded = (state1 ^ state2) % 256
            result.append(format(encoded, '02x'))
        return ''.join(result)
    
    @staticmethod
    def quantum_hash_decrypt(hashed):
        """Decrypt QuantumHash"""
        try:
            result = []
            hex_pairs = [hashed[i:i+2] for i in range(0, len(hashed), 2)]
            for i, hex_pair in enumerate(hex_pairs):
                encoded = int(hex_pair, 16)
                # Try to reverse (this is intentionally difficult/impossible for most inputs)
                # This will produce garbage for most cases
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
            return "[ERROR: Invalid hash for QuantumHash]"


def print_banner():
    """Print the tool banner"""
    print("=" * 70)
    print("  🔐 CTF STAGE 7: HASH IDENTIFICATION CHALLENGE")
    print("  Hash Analyzer Tool v1.0")
    print("=" * 70)
    print()


def print_algorithms():
    """Print available algorithms"""
    print("Available Hash Algorithms:")
    print("  1. RotateHash      - Rotates bits and XORs with position")
    print("  2. PrimeHash       - Multiplies by prime numbers")
    print("  3. FibonacciHash   - Uses Fibonacci sequence mixing")
    print("  4. SpiralHash      - Spiral pattern transformation")
    print("  5. WaveHash        - Sine wave based encoding")
    print("  6. MatrixHash      - Matrix multiplication cipher")
    print("  7. QuantumHash     - Quantum-inspired superposition")
    print()


def decrypt_with_algorithm(hashed_value, algorithm_num):
    """Decrypt hash using specified algorithm"""
    algorithms = CustomHashAlgorithms()
    
    decrypt_funcs = {
        1: algorithms.rotate_hash_decrypt,
        2: algorithms.prime_hash_decrypt,
        3: algorithms.fibonacci_hash_decrypt,
        4: algorithms.spiral_hash_decrypt,  # CORRECT ONE
        5: algorithms.wave_hash_decrypt,
        6: algorithms.matrix_hash_decrypt,
        7: algorithms.quantum_hash_decrypt
    }
    
    if algorithm_num in decrypt_funcs:
        return decrypt_funcs[algorithm_num](hashed_value)
    else:
        return "[ERROR: Invalid algorithm number]"


def main():
    """Main function"""
    print_banner()
    
    print("📝 Instructions:")
    print("  1. Enter the hashed value from the challenge")
    print("  2. Try different algorithms (1-7) to decrypt it")
    print("  3. Only ONE algorithm will produce a readable flag!")
    print("  4. Submit that flag to complete the challenge")
    print()
    print("-" * 70)
    print()
    
    # Get hashed value
    hashed_value = input("Enter the hashed value: ").strip()
    
    if not hashed_value:
        print("❌ Error: No hash value provided!")
        return
    
    print()
    print_algorithms()
    print("-" * 70)
    print()
    
    while True:
        try:
            choice = input("Select algorithm to try (1-7, or 'q' to quit): ").strip().lower()
            
            if choice == 'q':
                print("\n👋 Goodbye! Good luck with the challenge!")
                break
            
            algorithm_num = int(choice)
            
            if algorithm_num < 1 or algorithm_num > 7:
                print("❌ Invalid choice! Please select 1-7.")
                continue
            
            print()
            print(f"🔄 Decrypting with Algorithm #{algorithm_num}...")
            print("-" * 70)
            
            result = decrypt_with_algorithm(hashed_value, algorithm_num)
            
            print(f"📤 Result: {result}")
            print()
            
            # Check if result looks like a valid flag
            if result.isupper() and '_' in result and not result.startswith('[ERROR'):
                print("✅ This looks like a valid flag! Try submitting it!")
            elif result.startswith('[ERROR'):
                print("❌ Decryption failed with this algorithm.")
            else:
                print("⚠️  This doesn't look like a valid flag. Try another algorithm!")
            
            print("-" * 70)
            print()
            
        except ValueError:
            print("❌ Invalid input! Please enter a number 1-7 or 'q' to quit.")
            print()
        except KeyboardInterrupt:
            print("\n\n👋 Goodbye! Good luck with the challenge!")
            break
        except Exception as e:
            print(f"❌ An error occurred: {e}")
            print()


if __name__ == "__main__":
    main()
