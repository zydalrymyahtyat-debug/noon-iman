import urllib.request
import json
import re

req = urllib.request.Request('https://html.duckduckgo.com/html/?q=islamic+quran', headers={'User-Agent': 'Mozilla/5.0'})
try:
    html = urllib.request.urlopen(req).read().decode('utf-8')
    urls = re.findall(r'src="//(external-content[^"]+)"', html)
    for u in urls[:5]: print("https://" + u)
except Exception as e:
    print(e)
