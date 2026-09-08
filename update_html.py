import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

# FontAwesome CDN
fa_cdn = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

# Three.js scripts
three_scripts = '''  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="./assets/js/three-bg.js"></script>'''

# SVG replacements (approximate matching based on surrounding context)
svg_replacements = [
    # Socials
    (r'<svg.*?>.*?github.*?</svg>|<svg[^>]*>.*?<path d="M12 0c-6\.626.*?</svg>', '<i class="fa-brands fa-github" style="font-size: 18px;"></i>'),
    (r'<svg.*?>.*?linkedin.*?</svg>|<svg[^>]*>.*?<path d="M20\.447 20\.452.*?</svg>', '<i class="fa-brands fa-linkedin" style="font-size: 18px;"></i>'),
    (r'<svg.*?>.*?kaggle.*?</svg>|<svg[^>]*>.*?<path d="M18\.825 23\.859.*?</svg>', '<i class="fa-brands fa-kaggle" style="font-size: 18px;"></i>'),
    (r'<svg.*?>.*?instagram.*?</svg>|<svg[^>]*>.*?<path d="M12 2\.163.*?</svg>', '<i class="fa-brands fa-instagram" style="font-size: 18px;"></i>'),
    (r'<svg.*?>.*?twitter.*?</svg>|<svg[^>]*>.*?<path d="M18\.244 2\.25.*?</svg>', '<i class="fa-brands fa-x-twitter" style="font-size: 18px;"></i>'),
    
    # Contact Buttons
    (r'<svg[^>]*>.*?<path d="m22 7-8\.97.*?</svg>', '<i class="fa-regular fa-envelope" style="font-size: 17px;"></i>'),
    (r'<svg[^>]*>.*?<path d="M21 15v4a2 2 0 0 1-2 2H5.*?</svg>', '<i class="fa-solid fa-download" style="font-size: 17px;"></i>'),
    
    # Services
    (r'<svg[^>]*>.*?<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9".*?</svg>', '<i class="fa-solid fa-microchip"></i>'),
    (r'<svg[^>]*>.*?<path d="M12 2a3 3 0 0 0-3 3v4.*?</svg>', '<i class="fa-solid fa-brain"></i>'),
    (r'<svg[^>]*>.*?<circle cx="12" cy="12" r="2"/><circle cx="5" cy="5".*?</svg>', '<i class="fa-solid fa-network-wired"></i>'),
    (r'<svg[^>]*>.*?<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z".*?</svg>', '<i class="fa-solid fa-eye"></i>'),
    (r'<svg[^>]*>.*?<path d="m12 3-1\.912 5\.813.*?</svg>', '<i class="fa-solid fa-wand-magic-sparkles"></i>'),
    (r'<svg[^>]*>.*?<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z".*?</svg>', '<i class="fa-solid fa-language"></i>'),
    (r'<svg[^>]*>.*?<ellipse cx="12" cy="5" rx="9" ry="3".*?</svg>', '<i class="fa-solid fa-database"></i>'),
    (r'<svg[^>]*>.*?<rect width="18" height="10" x="3" y="11".*?</svg>', '<i class="fa-solid fa-robot"></i>'),
    (r'<svg[^>]*>.*?<rect x="3" y="3" width="6" height="6" rx="1".*?</svg>', '<i class="fa-solid fa-people-arrows"></i>'),
    (r'<svg[^>]*>.*?<path d="M12 22V12M12 12 9 9m3 3 3-3M3\.8 14.*?</svg>', '<i class="fa-solid fa-gears"></i>'),
    (r'<svg[^>]*>.*?<path d="M13 10V3L4 14h7v7l9-11h-7z".*?</svg>', '<i class="fa-solid fa-bolt"></i>'),
    (r'<svg[^>]*>.*?<rect x="2" y="2" width="20" height="8" rx="2".*?</svg>', '<i class="fa-solid fa-cloud-arrow-up"></i>'),
    (r'<svg[^>]*>.*?<line x1="18" x2="18" y1="20" y2="10".*?</svg>', '<i class="fa-solid fa-chart-line"></i>'),
    (r'<svg[^>]*>.*?<polyline points="4 17 10 11 4 5".*?</svg>', '<i class="fa-solid fa-terminal"></i>'),
    (r'<svg[^>]*>.*?<path d="M12 22V12M12 12 9 9m3 3 3-3M3 7a2 2 0 0 1 2-2h14.*?</svg>', '<i class="fa-solid fa-plug"></i>'),
    
    # Back to Top
    (r'<svg[^>]*>.*?<polyline points="18 15 12 9 6 15".*?</svg>', '<i class="fa-solid fa-chevron-up"></i>')
]

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add FontAwesome if not present
    if 'font-awesome' not in content:
        content = content.replace('</head>', f'  {fa_cdn}\n</head>')

    # Add Three.js to index.html
    if file == 'index.html' and 'three.min.js' not in content:
        content = content.replace('</body>', f'{three_scripts}\n</body>')
        # Inject sohail1.jpeg
        content = re.sub(r'<img src="assets/images/[^"]+" alt="Sohail Ahmed – AI Engineer">', '<img src="assets/images/sohail1.jpeg" alt="Sohail Ahmed – AI Engineer">', content)
    
    # Inject sohail2.jpeg into about.html
    if file == 'about.html':
        content = re.sub(r'<img src="assets/images/[^"]+" alt="Sohail Ahmed">', '<img src="assets/images/sohail2.jpeg" alt="Sohail Ahmed">', content)

    # Replace SVGs
    for pattern, replacement in svg_replacements:
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated HTML files.")
