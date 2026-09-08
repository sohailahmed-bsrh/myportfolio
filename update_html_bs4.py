import os
from bs4 import BeautifulSoup

def update_html_files():
    html_files = [f for f in os.listdir('.') if f.endswith('.html')]
    
    # Mapping for social icons (by href or aria-label)
    soc_icons = {
        'github.com': '<i class="fa-brands fa-github" style="font-size: 18px;"></i>',
        'linkedin.com': '<i class="fa-brands fa-linkedin" style="font-size: 18px;"></i>',
        'kaggle.com': '<i class="fa-brands fa-kaggle" style="font-size: 18px;"></i>',
        'instagram.com': '<i class="fa-brands fa-instagram" style="font-size: 18px;"></i>',
        'x.com': '<i class="fa-brands fa-x-twitter" style="font-size: 18px;"></i>',
        'twitter.com': '<i class="fa-brands fa-x-twitter" style="font-size: 18px;"></i>'
    }

    # Mapping for services
    service_icons = {
        'AI Engineering': '<i class="fa-solid fa-microchip"></i>',
        'Machine Learning': '<i class="fa-solid fa-brain"></i>',
        'Deep Learning': '<i class="fa-solid fa-network-wired"></i>',
        'Computer Vision': '<i class="fa-solid fa-eye"></i>',
        'Generative AI': '<i class="fa-solid fa-wand-magic-sparkles"></i>',
        'LLMs': '<i class="fa-solid fa-language"></i>',
        'RAG': '<i class="fa-solid fa-database"></i>',
        'AI Agents': '<i class="fa-solid fa-robot"></i>',
        'Agentic AI': '<i class="fa-solid fa-people-arrows"></i>',
        'Automation': '<i class="fa-solid fa-gears"></i>',
        'FastAPI': '<i class="fa-solid fa-bolt"></i>',
        'Deployment & MLOps': '<i class="fa-solid fa-cloud-arrow-up"></i>',
        'Data Analytics': '<i class="fa-solid fa-chart-line"></i>',
        'Prompt Engineering': '<i class="fa-solid fa-terminal"></i>',
        'API Development': '<i class="fa-solid fa-plug"></i>'
    }

    # Mapping for generic buttons by text
    btn_icons = {
        'Download CV': '<i class="fa-solid fa-download" style="font-size: 17px;"></i>',
        'GitHub': '<i class="fa-brands fa-github" style="font-size: 17px;"></i>',
        'LinkedIn': '<i class="fa-brands fa-linkedin" style="font-size: 17px;"></i>',
        'Kaggle': '<i class="fa-brands fa-kaggle" style="font-size: 17px;"></i>',
        'Contact': '<i class="fa-regular fa-envelope" style="font-size: 17px;"></i>'
    }

    fa_cdn = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'

    for file in html_files:
        with open(file, 'r', encoding='utf-8') as f:
            soup = BeautifulSoup(f.read(), 'lxml')

        # Add FA CDN to head
        head = soup.find('head')
        if head and not soup.find('link', href=fa_cdn):
            new_link = soup.new_tag('link', rel='stylesheet', href=fa_cdn)
            head.append(new_link)

        # Replace socials in Footer
        for a in soup.find_all('a', class_='soc-btn'):
            href = a.get('href', '').lower()
            for key, icon_html in soc_icons.items():
                if key in href:
                    a.clear()
                    new_icon = BeautifulSoup(icon_html, 'html.parser')
                    a.append(new_icon)
                    break

        # Replace icons in Services
        for service_card in soup.find_all('div', class_='service-card'):
            h3 = service_card.find('h3')
            icon_div = service_card.find('div', class_='service-icon')
            if h3 and icon_div:
                title = h3.text.strip()
                if title in service_icons:
                    icon_div.clear()
                    new_icon = BeautifulSoup(service_icons[title], 'html.parser')
                    icon_div.append(new_icon)

        # Replace generic buttons
        for a in soup.find_all('a', class_=['btn', 'btn-outline', 'btn-primary', 'btn-cyan']):
            text = a.text.strip()
            if text in btn_icons:
                # Find the SVG and replace it
                svg = a.find('svg')
                if svg:
                    svg.extract()
                    new_icon = BeautifulSoup(btn_icons[text], 'html.parser')
                    a.insert(0, new_icon)

        # Replace back to top icon
        btt = soup.find('button', id='back-to-top')
        if btt:
            svg = btt.find('svg')
            if svg:
                svg.extract()
                btt.append(BeautifulSoup('<i class="fa-solid fa-chevron-up"></i>', 'html.parser'))

        # Special changes for about.html (Image replacement)
        if file == 'about.html':
            for img in soup.find_all('img'):
                if 'sohail' in img.get('src', '').lower() and 'sohail2' not in img.get('src', '').lower():
                    img['src'] = 'assets/images/sohail2.jpeg'

        with open(file, 'w', encoding='utf-8') as f:
            f.write(str(soup))

if __name__ == '__main__':
    update_html_files()
