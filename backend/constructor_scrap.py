import csv
import os
import requests
from bs4 import BeautifulSoup
from colorama import Fore, Style, init
import tempfile

# Initialize colorama
init()

def process_constructors():
    # Create directory for constructor logos
    os.makedirs('img/constructors', exist_ok=True)

    # Temporary file for writing updated CSV
    temp_file = tempfile.NamedTemporaryFile(mode='w', delete=False, newline='', encoding='utf-8')

    with open('./data/constructors.csv', 'r', encoding='utf-8') as csvfile, temp_file:
        reader = csv.DictReader(csvfile)
        
        # Add new field to fieldnames
        fieldnames = reader.fieldnames + ['logo_path'] if 'logo_path' not in reader.fieldnames else reader.fieldnames
        
        writer = csv.DictWriter(temp_file, fieldnames=fieldnames)
        writer.writeheader()
        
        for row in reader:
            logo_path = None  # Default to null if no logo
            
            if not row['url'] or row['url'] == '\\N':  # Skip if no URL
                print(f"{Fore.YELLOW}SKIPPED:{Style.RESET_ALL} {row.get('name', '')} - no URL")
                writer.writerow(row)
                continue
                
            try:
                print(f"Processing {row['name']}...")
                
                # Get the Wikipedia page
                response = requests.get(row['url'], timeout=10)
                response.raise_for_status()
                
                # Parse the HTML
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Find the infobox image - flexible approach
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
                    
                    # Method 2: Look for img inside span[typeof*=mw:File] > a
                    if not img_tag:
                        span_file = infobox_image.find('span', typeof=lambda x: x and 'mw:File' in x)
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
                        
                        # Create a filename from the constructor name
                        constructor_name = row['constructorRef'].strip().lower().replace(' ', '_')
                        filename = f"./img/constructors/{constructor_name}.png"
                        logo_path = filename
                        
                        # Save the image
                        with open(filename, 'wb') as f:
                            f.write(img_data)
                            
                        print(f"{Fore.GREEN}SUCCESS:{Style.RESET_ALL} {row['name']}")
                    else:
                        print(f"{Fore.RED}FAILED:{Style.RESET_ALL} {row['name']} (no logo found)")
                else:
                    print(f"{Fore.RED}FAILED:{Style.RESET_ALL} No infobox found for {row['name']}")
                    
            except requests.exceptions.RequestException as e:
                print(f"{Fore.RED}Network error for {row.get('name', '')}: {str(e)}{Style.RESET_ALL}")
            except Exception as e:
                print(f"{Fore.RED}Error processing {row.get('name', '')}: {str(e)}{Style.RESET_ALL}")
            
            # Update the row with logo_path
            row['logo_path'] = logo_path
            writer.writerow(row)

    # Replace original file with the temporary file
    os.replace(temp_file.name, './data/constructors.csv')

    print(f"{Fore.GREEN}Constructors CSV file updated with logo paths{Style.RESET_ALL}")

# Run the function
process_constructors()