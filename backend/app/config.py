import os
from pydantic import BaseModel
from typing import Optional

_default_db = "/tmp/promptshield.db" if (os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")) else "promptshield.db"

class Settings(BaseModel):
    DEFAULT_PROVIDER: str = os.getenv("DEFAULT_PROVIDER", "fixture")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    OLLAMA_BASE_URL: str = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
    
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:latest")
    
    HOST: str = os.getenv("HOST", "127.0.0.1")
    PORT: int = int(os.getenv("PORT", "8000"))
    DATABASE_PATH: str = os.getenv("DATABASE_PATH", _default_db)
    LOG_LEVEL: str = os.getenv("LOG_LEVEL", "INFO")

settings = Settings()
