import os
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from backend.app.config import settings
from backend.app.db import init_db
from backend.app.api.routes import router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure SQLite database and directories are initialized
    try:
        init_db()
    except Exception as e:
        print(f"Warning: init_db failed: {e}")
    try:
        report_dir = "/tmp/docs/reports" if (os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")) else "docs/reports"
        output_dir = "/tmp/test-data/outputs" if (os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")) else "test-data/outputs"
        os.makedirs(report_dir, exist_ok=True)
        os.makedirs(output_dir, exist_ok=True)
    except Exception:
        pass
    yield
    # Shutdown logic if any

app = FastAPI(
    title="PromptShield — AI Prompt Safety Tester",
    description="Test your AI prompts. Find weaknesses. Make them safer.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api")
app.include_router(router)

# Serve frontend build (both locally and on Vercel)
_base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
_frontend_dist = os.path.join(_base_dir, "frontend", "dist")
if not os.path.exists(_frontend_dist):
    _frontend_dist = os.path.abspath("frontend/dist")

if os.path.exists(_frontend_dist):
    _assets_path = os.path.join(_frontend_dist, "assets")
    if os.path.exists(_assets_path):
        app.mount("/assets", StaticFiles(directory=_assets_path), name="static_assets")

    @app.get("/shield.svg")
    async def shield_icon():
        svg_file = os.path.join(_frontend_dist, "shield.svg")
        if os.path.exists(svg_file):
            return FileResponse(svg_file, media_type="image/svg+xml")
        raise HTTPException(status_code=404)

    @app.get("/")
    @app.get("/index.html")
    async def serve_index():
        index_file = os.path.join(_frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="index.html not found")

    @app.get("/{catchall:path}")
    async def spa_fallback(catchall: str):
        if catchall.startswith("api"):
            raise HTTPException(status_code=404, detail="Not Found")
        file_candidate = os.path.join(_frontend_dist, catchall)
        if os.path.isfile(file_candidate):
            return FileResponse(file_candidate)
        index_file = os.path.join(_frontend_dist, "index.html")
        if os.path.exists(index_file):
            return FileResponse(index_file)
        raise HTTPException(status_code=404, detail="Not Found")
else:
    @app.get("/")
    async def root():
        return {
            "name": "PromptShield",
            "tagline": "Test your AI prompts. Find weaknesses. Make them safer.",
            "status": "online",
            "docs": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
