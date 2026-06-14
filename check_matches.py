import os
import hashlib

folder_vitrales = 'Fotos vitrales'
folder_collection = 'assets/images/collection'

def get_hashes(folder):
    res = {}
    if not os.path.exists(folder):
        return res
    for f in os.listdir(folder):
        path = os.path.join(folder, f)
        if os.path.isdir(path):
            continue
        with open(path, 'rb') as file_to_hash:
            data = file_to_hash.read()
            md5 = hashlib.md5(data).hexdigest()
        res[md5] = f
    return res

hashes_vitrales = get_hashes(folder_vitrales)
hashes_collection = get_hashes(folder_collection)

matches = []
for md5, name_vitral in hashes_vitrales.items():
    if md5 in hashes_collection:
        matches.append((name_vitral, hashes_collection[md5]))

print(f"Matched {len(matches)} files between Fotos vitrales and collection:")
for m in matches:
    print(f" - {m[0]} is {m[1]}")
