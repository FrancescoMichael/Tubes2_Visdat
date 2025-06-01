import csv
import os
import requests
from bs4 import BeautifulSoup
from colorama import Fore, Style, init
import tempfile

# Initialize colorama
init()

# Create directory for images
os.makedirs('img/drivers', exist_ok=True)

# Temporary file for writing updated CSV
temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, newline='', encoding='utf-8')

with open('./data/drivers.csv', 'r', encoding='utf-8') as csvfile, temp_file:
    reader = csv.DictReader(csvfile)
    
    # Add new field to fieldnames
    fieldnames = reader.fieldnames + ['image_path'] if 'image_path' not in reader.fieldnames else reader.fieldnames
    
    writer = csv.DictWriter(temp_file, fieldnames=fieldnames)
    writer.writeheader()
    
    for row in reader:
        image_path = None  # Default to null if no image
        
        if not row['url'] or row['url'] == '\\N':  # Skip if no URL
            print(f"{Fore.YELLOW}SKIPPED:{Style.RESET_ALL} {row.get('forename', '')} {row.get('surname', '')} - no URL")
            writer.writerow(row)
            continue
            
        try:
            print(f"Processing {row['forename']} {row['surname']}...")
            
            # Get the Wikipedia page
            response = requests.get(row['url'], timeout=10)
            response.raise_for_status()
            
            # Parse the HTML
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Find the infobox image - more flexible approach
            infobox_image = soup.find('td', class_='infobox-image')
            
            if infobox_image:
                # Try multiple ways to find the image tag
                img_tag = None
                
                # Method 1: Look for img inside span.mw-default-size > a.mw-file-description
                span_default = infobox_image.find('span', class_='mw-default-size')
                if span_default:
                    file_link = span_default.find('a', class_='mw-file-description')
                    if file_link:
                        img_tag = file_link.find('img')
                
                # Method 2: Look for img directly inside span[typeof=mw:File] > a
                if not img_tag:
                    span_file = infobox_image.find('span', typeof='mw:File')
                    if span_file:
                        file_link = span_file.find('a')
                        if file_link:
                            img_tag = file_link.find('img')
                
                # Method 3: Look for any img tag in the infobox-image
                if not img_tag:
                    img_tag = infobox_image.find('img')
                
                if img_tag and 'src' in img_tag.attrs:
                    # Construct the full image URL
                    img_url = 'https:' + img_tag['src'] if img_tag['src'].startswith('//') else img_tag['src']
                    
                    # Try to get higher resolution image if available
                    if 'srcset' in img_tag.attrs:
                        srcset = img_tag['srcset'].split(',')
                        if srcset:
                            highest_res = srcset[-1].strip().split(' ')[0]
                            img_url = 'https:' + highest_res if highest_res.startswith('//') else highest_res
                    
                    # Download the image
                    img_data = requests.get(img_url, timeout=10).content
                    
                    # Create a filename from the driver's name
                    first_name = row['forename'].strip().lower().replace(' ', '_')
                    last_name = row['surname'].strip().lower().replace(' ', '_')
                    filename = f"./img/drivers/{first_name}_{last_name}.jpg"
                    image_path = filename
                    
                    # Save the image
                    with open(filename, 'wb') as f:
                        f.write(img_data)
                        
                    print(f"{Fore.GREEN}SUCCESS:{Style.RESET_ALL} {row['forename']} {row['surname']}")
                else:
                    print(f"{Fore.RED}FAILED:{Style.RESET_ALL} {row['forename']} {row['surname']} (no image found)")
            else:
                print(f"{Fore.RED}FAILED:{Style.RESET_ALL} No infobox found for {row['forename']} {row['surname']}")
                
        except requests.exceptions.RequestException as e:
            print(f"{Fore.RED}Network error for {row.get('forename', '')} {row.get('surname', '')}: {str(e)}{Style.RESET_ALL}")
        except Exception as e:
            print(f"{Fore.RED}Error processing {row.get('forename', '')} {row.get('surname', '')}: {str(e)}{Style.RESET_ALL}")
        
        # Update the row with image_path
        row['image_path'] = image_path
        writer.writerow(row)

# Replace original file with the temporary file
os.replace(temp_file.name, './data/drivers.csv')

print(f"{Fore.GREEN}CSV file updated with image paths{Style.RESET_ALL}")