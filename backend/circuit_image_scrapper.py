import csv
import os
import requests
from bs4 import BeautifulSoup
from colorama import Fore, Style, init
import tempfile

# Initialize colorama
init()

# Create directory for images
os.makedirs('img/circuits', exist_ok=True)

# Temporary file to write updated CSV
temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, newline='', encoding='utf-8')

with open('./data/circuits.csv', 'r', encoding='utf-8') as csvfile, temp_file:
    reader = csv.DictReader(csvfile)
    
    # Add new field to fieldnames
    fieldnames = reader.fieldnames + ['image_path'] if 'image_path' not in reader.fieldnames else reader.fieldnames
    writer = csv.DictWriter(temp_file, fieldnames=fieldnames)
    writer.writeheader()

    for row in reader:
        image_path = None  # Default
        
        if not row['url'] or row['url'] == '\\N':
            print(f"{Fore.YELLOW}SKIPPED:{Style.RESET_ALL} {row.get('name', '')} - no URL")
            writer.writerow(row)
            continue

        try:
            print(f"Processing {row['name']}...")
            response = requests.get(row['url'], timeout=10)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, 'html.parser')
            infobox_image = soup.find('td', class_='infobox-image')
            img_tag = None

            # Method 1: Look inside span.mw-default-size > a.mw-file-description > img
            span_default = infobox_image.find('span', class_='mw-default-size') if infobox_image else None
            if span_default:
                file_link = span_default.find('a', class_='mw-file-description')
                if file_link:
                    img_tag = file_link.find('img')

            # Method 2: Look for img directly inside infobox
            if not img_tag and infobox_image:
                img_tag = infobox_image.find('img')

            if img_tag and 'src' in img_tag.attrs:
                img_url = 'https:' + img_tag['src'] if img_tag['src'].startswith('//') else img_tag['src']

                # Use highest resolution from srcset if available
                if 'srcset' in img_tag.attrs:
                    srcset = img_tag['srcset'].split(',')
                    if srcset:
                        highest_res = srcset[-1].strip().split(' ')[0]
                        img_url = 'https:' + highest_res if highest_res.startswith('//') else highest_res

                # Download image
                img_data = requests.get(img_url, timeout=10).content
                circuit_name = row['name'].strip().lower().replace(' ', '_').replace('/', '_')
                filename = f'./img/circuits/{circuit_name}.jpg'
                with open(filename, 'wb') as f:
                    f.write(img_data)

                image_path = filename
                print(f"{Fore.GREEN}SUCCESS:{Style.RESET_ALL} {row['name']}")
            else:
                print(f"{Fore.RED}FAILED:{Style.RESET_ALL} No image found for {row['name']}")
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Network error for {row['name']}: {str(e)}{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}Error processing {row['name']}: {str(e)}{Style.RESET_ALL}")

        row['image_path'] = image_path
        writer.writerow(row)

# Replace original with updated CSV
os.replace(temp_file.name, './data/circuits.csv')
print(f"{Fore.GREEN}CSV file updated with image paths{Style.RESET_ALL}")
