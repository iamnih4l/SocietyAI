import urllib.request
import json

req = urllib.request.Request(
    'https://society-ai-green.vercel.app/api/simulate', 
    data=json.dumps({'content': 'test'}).encode(), 
    headers={'Content-Type': 'application/json'}
)

try: 
    res = urllib.request.urlopen(req)
    print(res.read().decode())
except Exception as e: 
    if hasattr(e, 'read'):
        print(e.read().decode())
    else:
        print(str(e))
