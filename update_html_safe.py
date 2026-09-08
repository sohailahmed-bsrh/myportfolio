import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

fa_cdn = '<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">'

for file in html_files:
    with open(file, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Add FontAwesome CDN
    if fa_cdn not in content:
        content = content.replace('</head>', f'  {fa_cdn}\n</head>')
        
    # 2. Add Three.js to index.html only
    if file == 'index.html':
        if 'three.min.js' not in content:
            content = content.replace('</body>', '  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n  <script src="./assets/js/three-bg.js"></script>\n</body>')
        content = content.replace('assets/images/sohailahmed26.png.jpeg', 'assets/images/sohail1.jpeg')

    # 3. Add sohail2 to about.html
    if file == 'about.html':
        content = re.sub(r'<img src="assets/images/[^"]+" alt="Sohail Ahmed">', '<img src="assets/images/sohail2.jpeg" alt="Sohail Ahmed">', content)

    # 4. Safe replace social icons in footer
    content = re.sub(r'(href="https://github\.com[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-brands fa-github" style="font-size: 18px;"></i>', content, flags=re.DOTALL)
    content = re.sub(r'(href="https://www\.linkedin\.com[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-brands fa-linkedin" style="font-size: 18px;"></i>', content, flags=re.DOTALL)
    content = re.sub(r'(href="https://www\.kaggle\.com[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-brands fa-kaggle" style="font-size: 18px;"></i>', content, flags=re.DOTALL)
    content = re.sub(r'(href="https://www\.instagram\.com[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-brands fa-instagram" style="font-size: 18px;"></i>', content, flags=re.DOTALL)
    content = re.sub(r'(href="https://x\.com[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-brands fa-x-twitter" style="font-size: 18px;"></i>', content, flags=re.DOTALL)

    # 5. Services icons
    services = {
        'AI Engineering': 'fa-microchip',
        'Machine Learning': 'fa-brain',
        'Deep Learning': 'fa-network-wired',
        'Computer Vision': 'fa-eye',
        'Generative AI': 'fa-wand-magic-sparkles',
        'LLMs': 'fa-language',
        'RAG': 'fa-database',
        'AI Agents': 'fa-robot',
        'Agentic AI': 'fa-people-arrows',
        'Automation': 'fa-gears',
        'FastAPI': 'fa-bolt',
        'Deployment & MLOps': 'fa-cloud-arrow-up',
        'Data Analytics': 'fa-chart-line',
        'Prompt Engineering': 'fa-terminal',
        'API Development': 'fa-plug'
    }
    for title, icon in services.items():
        pattern = r'(<div class="service-icon">\s*)<svg.*?</svg>(\s*</div>\s*<h3>' + re.escape(title) + r'</h3>)'
        content = re.sub(pattern, r'\1<i class="fa-solid ' + icon + r'"></i>\2', content, flags=re.DOTALL)

    # 6. Button icons
    content = re.sub(r'<svg.*?</svg>(\s*Download CV)', r'<i class="fa-solid fa-download" style="font-size: 17px;"></i>\1', content, flags=re.DOTALL)
    content = re.sub(r'<svg.*?</svg>(\s*GitHub)', r'<i class="fa-brands fa-github" style="font-size: 17px;"></i>\1', content, flags=re.DOTALL)
    content = re.sub(r'<svg.*?</svg>(\s*LinkedIn)', r'<i class="fa-brands fa-linkedin" style="font-size: 17px;"></i>\1', content, flags=re.DOTALL)
    content = re.sub(r'<svg.*?</svg>(\s*Kaggle)', r'<i class="fa-brands fa-kaggle" style="font-size: 17px;"></i>\1', content, flags=re.DOTALL)
    content = re.sub(r'<svg.*?</svg>(\s*Contact)', r'<i class="fa-regular fa-envelope" style="font-size: 17px;"></i>\1', content, flags=re.DOTALL)

    # 7. Back to top
    content = re.sub(r'(<button id="back-to-top"[^>]+>\s*)<svg.*?</svg>', r'\1<i class="fa-solid fa-chevron-up"></i>', content, flags=re.DOTALL)

    with open(file, 'w', encoding='utf-8') as f:
        f.write(content)

print("Updated HTML files safely without bs4.")
