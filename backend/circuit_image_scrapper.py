import csv
import requests
from bs4 import BeautifulSoup
import tempfile
import shutil
import os

def get_wikimedia_image_url(map_link):
    try:
        # Fetch the Wikimedia file page
        response = requests.get(map_link, timeout=10)
        response.raise_for_status()
        soup = BeautifulSoup(response.text, 'html.parser')
        
        # Find the direct file link in the "fullImageLink" div
        full_image_div = soup.find('div', class_='fullImageLink')
        if full_image_div:
            file_link = full_image_div.find('a')['href']
            if file_link.startswith('//'):
                return 'https:' + file_link
            elif file_link.startswith('/'):
                return 'https://commons.wikimedia.org' + file_link
            return file_link
        
        # Fallback to the highest resolution thumbnail if direct link not found
        for img in soup.find_all('img'):
            src = img.get('src', '')
            if src and 'wikipedia/commons/thumb/' in src:
                if src.startswith('//'):
                    src = 'https:' + src
                return src
                
        return None
    
    except Exception as e:
        print(f"Error fetching image from {map_link}: {str(e)}")
        return None

# Input and output file paths
input_csv = './data/f1_circuits_beautifulsoup.csv'
output_csv = './data/circuits_simplified.csv'

# Create a temporary file for writing
with tempfile.NamedTemporaryFile(mode='w', delete=False, newline='', encoding='utf-8') as temp_file:
    with open(input_csv, 'r', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        
        # Define the columns we want to keep
        fieldnames = ['Circuit', 'Last length used', 'Turns', 'image_url']
        
        writer = csv.DictWriter(temp_file, fieldnames=fieldnames)
        writer.writeheader()

        for row in reader:
            # Get the image URL if Map_link exists
            image_url = None
            if row.get('Map_link') and row['Map_link'] != '\\N':
                image_url = get_wikimedia_image_url(row['Map_link'])
                print(f"Processed {row['Circuit']}: {image_url}")
            
            # Create a new row with only the desired columns
            new_row = {
                'Circuit': row['Circuit'],
                'Last length used': row['Last length used'],
                'Turns': row['Turns'],
                'image_url': image_url
            }
            
            writer.writerow(new_row)

# Replace the original file with the temporary file
shutil.move(temp_file.name, output_csv)
print(f"Processing complete. Simplified data saved to {output_csv}")