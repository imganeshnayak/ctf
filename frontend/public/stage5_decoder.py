#!/usr/bin/env python3
"""
THE PHILOSOPHER'S ENGINE - STAGE 5 DECODER
Auth: Digital Alchemy Society
"""

import hashlib
import time
import sys

def progress_bar(seconds, message="Stabilizing Elemental Matrix"):
    """Displays a thematic progress bar for the requested duration."""
    width = 40
    for i in range(width + 1):
        percent = int((i / width) * 100)
        bar = "█" * i + "░" * (width - i)
        sys.stdout.write(f"\r{message: <30} [{bar}] {percent}%")
        sys.stdout.flush()
        time.sleep(seconds / width)
    print()

def transmute(input_key):
    """
    Verifies the input key and transmutes it into the final flag.
    Input: Intermediate Key from HTML.
    Output: Final Flag.
    """
    # SHA-512 of 'PHILOSOPHERS_STONE_DECODED'
    EXPECTED_HASH = "bf0f45050f8c5ad9efe0e8b109c0d66f3cb9f8d3df50b2f83ea879be567aed01a0b1010a211861df8457b3e1cf9072816aba386da5bfdd909230b5c90dd40a97"
    
    # Hash the input
    input_hash = hashlib.sha512(input_key.strip().upper().encode()).hexdigest()
    
    if input_hash != EXPECTED_HASH:
        print("\n\033[91m[!] ERROR: IMPURE CATALYST DETECTED\033[0m")
        print("[*] The fragments do not align. Transmutation failed.")
        print("[*] Entering 25s Elemental Stabilization Delay to prevent data corruption...")
        progress_bar(25, "Elemental Stabilization")
        print("\n[!] Access Denied. Return to the Archive and seek the Three Pillars.")
        return None

    # Successful verification
    print("\n\033[93m[+] CATALYST ACCEPTED: Intermediate Key Verified.\033[0m")
    progress_bar(3, "Commencing Great Work")
    
    # The final flag is generated here
    # In a real challenge, this could be complex XOR, but for this CTF:
    final_flag = "GOLDEN_RATIO_REVEALED"
    
    return final_flag

def main():
    print("""
    \033[93m
     .      .
     |\\____/|
    (\033[0m\033[91m  o  o  \033[0m\033[93m)
     {  \033[91m^^\033[0m\033[93m  }
      \\____/
       |  |  \033[0m
    \033[93m============================================================
    ||             THE PHILOSOPHER'S ENGINE v1.0.4            ||
    ||           (Digital Alchemy Security Protocol)           ||
    ============================================================\033[0m
    """)
    
    print("Welcome, Alchemist.")
    print("Provide the intermediate key found within the Archive fragments.")
    print("Warning: Only the pure of intent shall pass.")
    print("-" * 60)
    
    try:
        user_input = input("\n[#] ENTER TRANSMUTATION KEY: ").strip()
        
        print("\n[*] Validating catalytic properties...")
        time.sleep(1)
        
        flag = transmute(user_input)
        
        if flag:
            print("\n" + "="*60)
            print("\033[92m🎉 TRANSMUTATION COMPLETE! THE TRUE REVELATION IS ACHIEVED: \033[0m")
            print(f"\n      \033[96m>>> {flag} <<<\033[0m")
            print("\n" + "="*60)
            print("Submit this revelation to the Council to complete Stage 5.")
            print()
            
    except KeyboardInterrupt:
        print("\n\n[!] Process interrupted. The Archive remains sealed.")
        sys.exit(1)

if __name__ == "__main__":
    main()
