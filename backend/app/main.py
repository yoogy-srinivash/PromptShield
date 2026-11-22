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
    init_db()
    os.makedirs("docs/reports", exist_ok=True)
    os.makedirs("test-data/outputs", exist_ok=True)
    yield
    # Shutdown logic if any

app = FastAPI(
    title="PromptShield — Prompt Safety Tester (Red-Team Kit)",
    description="Authorized defensive prompt security testing and guardrail hardening platform for SCSE4041 Prompt Engineering.",
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
            "project": "PromptShield — Prompt Safety Tester (Red-Team Kit)",
            "course": "SCSE4041 Prompt Engineering",
            "institution": "Bennett University",
            "problem_bank_id": "C23",
            "team_id": "C23",
            "status": "online",
            "docs": "/docs"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host=settings.HOST, port=settings.PORT, reload=False)
