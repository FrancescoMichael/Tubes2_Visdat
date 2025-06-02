import os
import csv
import requests
from urllib.parse import unquote
from pathlib import Path

# Configuration
CSV_FILE = './data/merged_circuits.csv'
IMAGE_FOLDER = 'circuit_images'
IMAGE_COLUMN = 'image_url'
CIRCUIT_ID_COLUMN = 'circuitId'

# Set a proper User-Agent header
HEADERS = {
    'User-Agent': 'CircuitImageDownloader/1.0 (https://example.com; contact@example.com)'
}

# Create image folder if it doesn't exist
os.makedirs(IMAGE_FOLDER, exist_ok=True)

def download_image(url, circuit_id):
    """Download image from URL and save with circuit ID and original extension"""
    if not url or not isinstance(url, str) or url.lower() == 'nan':
        return None
    
    try:
        # Get the file extension from URL
        filename = unquote(url.split('/')[-1])
        ext = Path(filename).suffix  # Preserves original extension (.svg, .png, etc.)
        
        # Create local filename with circuit ID and original extension
        local_path = os.path.join(IMAGE_FOLDER, f"circuit_{circuit_id}{ext}")
        
        # Skip if file already exists
        if os.path.exists(local_path):
            return local_path
        
        # Download the image with proper headers
        response = requests.get(url, headers=HEADERS, stream=True, timeout=30)
        response.raise_for_status()
        
        # Check content type
        content_type = response.headers.get('content-type', '')
        if 'image' not in content_type:
            print(f"URL doesn't point to an image: {url}")
            return None
        
        with open(local_path, 'wb') as f:
            for chunk in response.iter_content(chunk_size=8192):
                if chunk:  # filter out keep-alive chunks
                    f.write(chunk)
        
        return local_path
    
    except requests.exceptions.RequestException as e:
        print(f"Failed to download {url}: {str(e)}")
        return None
    except Exception as e:
        print(f"Error processing {url}: {str(e)}")
        return None

# Read the CSV file and get fieldnames
with open(CSV_FILE, mode='r', encoding='utf-8') as f:
    reader = csv.DictReader(f)
    original_fieldnames = reader.fieldnames
    rows = list(reader)

# Add 'local_image_path' to fieldnames if it doesn't exist
fieldnames = list(original_fieldnames)
if 'local_image_path' not in fieldnames:
    fieldnames.append('local_image_path')

# Process each row and download images
for row in rows:
    # Ensure all rows have the same keys
    row = {k: row.get(k, '') for k in fieldnames}
    if row.get(IMAGE_COLUMN) and row.get(CIRCUIT_ID_COLUMN):
        local_path = download_image(row[IMAGE_COLUMN], row[CIRCUIT_ID_COLUMN])
        row['local_image_path'] = local_path or ''
    else:
        row['local_image_path'] = ''

# Write updated CSV back
with open(CSV_FILE, mode='w', encoding='utf-8', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=fieldnames)
    writer.writeheader()
    writer.writerows(rows)

print(f"\nDownload summary:")
print(f"- Total circuits processed: {len(rows)}")
print(f"- Images downloaded to: {IMAGE_FOLDER}")
print(f"- Image naming format: circuit_<circuitId>.<original_extension>")
print(f"- CSV updated with local paths in 'local_image_path' column")