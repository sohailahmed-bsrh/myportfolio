import re

with open('projects.html', 'r', encoding='utf-8') as f:
    content = f.read()

filter_bar_old = '''<div class="project-filter-bar" id="project-filter-bar">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="computer-vision">Computer Vision</button>
          <button class="filter-btn" data-filter="machine-learning">Machine Learning</button>
          <button class="filter-btn" data-filter="deep-learning">Deep Learning</button>
          <button class="filter-btn" data-filter="data-analysis">Data Analysis</button>
          <button class="filter-btn" data-filter="generative-ai">Generative AI</button>
          <button class="filter-btn" data-filter="ai-automation">AI Automation</button>
          <button class="filter-btn" data-filter="ai-agents">Agentic AI <span class="coming-soon">Soon</span></button>
        </div>'''
filter_bar_new = '''<div class="project-filter-bar" id="project-filter-bar">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="data-analysis">Data Analysis</button>
          <button class="filter-btn" data-filter="machine-learning">Machine Learning</button>
          <button class="filter-btn" data-filter="computer-vision">Computer Vision</button>
          <button class="filter-btn" data-filter="generative-ai">Generative AI</button>
          <button class="filter-btn" data-filter="ai-automation">AI Automation</button>
        </div>'''
content = content.replace(filter_bar_old, filter_bar_new)

mapping = {
    "Smart Attendance System": "computer-vision",
    "Pothole Detection App": "computer-vision",
    "ASL Recognition Project": "computer-vision",
    "Documents Scanner": "computer-vision",
    "Customer Churn Analysis": "machine-learning",
    "Heart Disease Prediction": "machine-learning",
    "Social Media Engagement Prediction": "machine-learning",
    "Healthcare Cost Prediction & Segmentation": "machine-learning",
    "Unsupervised ML & Deep Learning": "machine-learning",
    "Deep Learning: CNN (Vision) & LSTM (NLP)": "machine-learning",
    "Time Series Forecasting & Transfer Learning": "machine-learning",
    "Sales Data Analysis": "data-analysis",
    "Employee Attrition Analysis": "data-analysis",
    "Hospital Emergency Room Analysis": "data-analysis",
    "AI Ads Maker": "generative-ai",
    "Job Analyzer": "generative-ai",
    "Social Media Content Rewriter": "generative-ai",
    "Full Stack AI Application": "ai-automation"
}

parts = content.split('<div class=\"proj-card glass-card\"')
new_parts = [parts[0]]

for part in parts[1:]:
    title_match = re.search(r'<h3 class=\"proj-title\">([^<]+)</h3>', part)
    if title_match:
        title = title_match.group(1).strip()
        if title in mapping:
            part = re.sub(r'data-category=\"[^\"]+\"', f'data-category=\"{mapping[title]}\"', part, count=1)
    new_parts.append(part)

content = '<div class=\"proj-card glass-card\"'.join(new_parts)

with open('projects.html', 'w', encoding='utf-8') as f:
    f.write(content)
