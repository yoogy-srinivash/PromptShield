import os
import sys
import urllib.parse

# Ensure project root is in sys.path so 'backend' package imports work cleanly on Vercel
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from backend.app.main import app as _fastapi_app

async def app(scope, receive, send):
    if scope.get("type") == "http":
        raw_qs = scope.get("query_string", b"").decode("utf-8", "ignore")
        if raw_qs:
            params = urllib.parse.parse_qs(raw_qs)
            subroute = None
            if "__subroute" in params and params["__subroute"]:
                subroute = urllib.parse.unquote(params["__subroute"][0])
            elif "match" in params and params["match"]:
                subroute = "/" + urllib.parse.unquote(params["match"][0])
            
            if subroute:
                subroute_clean = "/" + subroute.strip("/")
                scope["path"] = "/api" + subroute_clean
                
                cleaned_params = {
                    k: v for k, v in params.items() 
                    if k not in ("__subroute", "match", "path")
                }
                scope["query_string"] = urllib.parse.urlencode(cleaned_params, doseq=True).encode("utf-8")
    
    await _fastapi_app(scope, receive, send)
