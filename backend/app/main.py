import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
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

# Serve frontend build if available
if os.path.exists("frontend/dist"):
    app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="static")
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
