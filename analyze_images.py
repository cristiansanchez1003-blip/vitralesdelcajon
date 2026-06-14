import os
import hashlib

folder = 'Fotos vitrales'
files = os.listdir(folder)

hashes = {}
duplicates = []
unique_files = []

for f in files:
    if not f.lower().endswith('.jpg') and not f.lower().endswith('.jpeg'):
        continue
    path = os.path.join(folder, f)
    with open(path, 'rb') as file_to_hash:
        data = file_to_hash.read()
        md5 = hashlib.md5(data).hexdigest()
    if md5 in hashes:
        duplicates.append((f, hashes[md5]))
    else:
        hashes[md5] = f
        unique_files.append((f, len(data)))

print(f"Total files: {len(files)}")
print(f"Unique files: {len(unique_files)}")
print(f"Duplicate files count: {len(duplicates)}")
print("\nUnique files list (first 20):")
for f, size in unique_files[:20]:
    print(f" - {f} ({size} bytes)")
