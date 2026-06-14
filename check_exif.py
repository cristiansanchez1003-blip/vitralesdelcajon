import os
from PIL import Image
from PIL.ExifTags import TAGS

folder = 'Fotos vitrales'
files = os.listdir(folder)

exif_found = 0
for f in files:
    if not f.lower().endswith('.jpg') and not f.lower().endswith('.jpeg'):
        continue
    path = os.path.join(folder, f)
    try:
        img = Image.open(path)
        exif_data = img._getexif()
        if exif_data:
            exif_found += 1
            print(f"\n--- EXIF for {f} ---")
            for tag, value in exif_data.items():
                tag_name = TAGS.get(tag, tag)
                if tag_name in ['ImageDescription', 'UserComment', 'XPTitle', 'XPSubject', 'XPComment', 'XPKeywords']:
                    print(f"  {tag_name}: {value}")
            if exif_found >= 10:
                print("Showing first 10 EXIF results...")
                break
    except Exception as e:
        pass

if exif_found == 0:
    print("No EXIF metadata found in the first few images.")
