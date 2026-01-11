import hashlib
import base64

# Test the hash
first_part = "PYTHON"
expected_hash = "99a9aa6b77293189b73ac7cea487fc641976646ef9d979791928cdaa29ed8e7124a2e07767734f43623f1ceb029fc8a131669947cfd547166734d12f29fb6350"
input_hash = hashlib.sha512(first_part.strip().upper().encode()).hexdigest()

print(f"Input: {first_part}")
print(f"Expected hash: {expected_hash}")
print(f"Actual hash:   {input_hash}")
print(f"Match: {input_hash == expected_hash}")

if input_hash == expected_hash:
    print("\n✅ Hash matches!")
    encoded_second = "X0NIQVVQSU9O"
    second_part = base64.b64decode(encoded_second).decode()
    final_flag = first_part.strip().upper() + second_part
    print(f"\n🏆 Final Flag: {final_flag}")
else:
    print("\n❌ Hash does not match!")
