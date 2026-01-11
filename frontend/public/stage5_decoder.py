#!/usr/bin/env python3
"""
Stage 5 - CTF Flag Decoder
This script generates the final flag when you provide the first part.
"""

import hashlib
import base64

def decode_flag(first_part):
    """
    Decodes and generates the complete flag.
    The first part should be found in the HTML page.
    """
    # Check if the first part is correct
    expected_hash = "99a9aa6b77293189b73ac7cea487fc641976646ef9d979791928cdaa29ed8e7124a2e07767734f43623f1ceb029fc8a131669947cfd547166734d12f29fb6350"
    
    # Hash the input to verify
    input_hash = hashlib.sha512(first_part.strip().upper().encode()).hexdigest()
    
    if input_hash != expected_hash:
        print("❌ Incorrect first part! Keep searching in the HTML...")
        return None
    
    # If correct, generate the second part
    print("✅ First part is correct!")
    print("\n🔓 Decoding the second part...\n")
    
    # The second part is encoded
    encoded_second = "X0NIQVVQSU9O"  # Base64 encoded "_CHAMPION"
    second_part = base64.b64decode(encoded_second).decode()
    
    # Combine to create the final flag
    final_flag = first_part.strip().upper() + second_part
    
    return final_flag


def main():
    print("=" * 60)
    print("🐍 STAGE 5 - PYTHON FLAG DECODER")
    print("=" * 60)
    print()
    print("Welcome! You've found the Python script.")
    print("To get the complete flag, you need the FIRST PART")
    print("which is hidden in the Stage 5 HTML page.")
    print()
    print("💡 Hint: Inspect the HTML source code carefully!")
    print("         Look for hidden elements or data attributes...")
    print()
    print("-" * 60)
    print()
    
    # Ask for the first part
    first_part = input("Enter the FIRST PART of the flag: ")
    
    print()
    print("🔍 Verifying your input...")
    print()
    
    # Decode the flag
    final_flag = decode_flag(first_part)
    
    if final_flag:
        print("=" * 60)
        print("🎉 SUCCESS! Here is your complete flag:")
        print()
        print(f"    🏆 {final_flag} 🏆")
        print()
        print("=" * 60)
        print()
        print("Congratulations! Submit this flag to complete Stage 5!")
        print()
    else:
        print()
        print("💭 Need help?")
        print("   - Make sure you're looking at the Stage 5 HTML page")
        print("   - Use browser DevTools to inspect elements")
        print("   - Look for elements with 'display: none'")
        print("   - Check data attributes on hidden elements")
        print()


if __name__ == "__main__":
    main()
