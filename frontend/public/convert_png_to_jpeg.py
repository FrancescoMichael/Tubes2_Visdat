from PIL import Image
import os

def convert_png_to_jpeg(folder_path, delete_original=False, quality=85):
    for filename in os.listdir(folder_path):
        if filename.lower().endswith('.png'):
            png_path = os.path.join(folder_path, filename)
            jpeg_filename = os.path.splitext(filename)[0] + '.jpeg'
            jpeg_path = os.path.join(folder_path, jpeg_filename)

            try:
                with Image.open(png_path) as img:
                    rgb_img = img.convert('RGB')
                    rgb_img.save(jpeg_path, 'JPEG', quality=quality)
                    print(f"Converted: {filename} → {jpeg_filename}")

                if delete_original:
                    os.remove(png_path)
                    print(f"Deleted original: {filename}")

            except Exception as e:
                print(f"Failed to convert {filename}: {e}")

folder = "./circuit_images"  
convert_png_to_jpeg(folder, delete_original=False, quality=85)
