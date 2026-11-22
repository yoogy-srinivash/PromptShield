import sqlite3
import json
from typing import List, Optional, Dict, Any
from backend.app.config import settings

def get_connection():
    conn = sqlite3.connect(settings.DATABASE_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS runs (
        run_id TEXT PRIMARY KEY,
        title TEXT,
        timestamp TEXT,
        prompt_version TEXT,
        model_name TEXT,
        provider TEXT,
        is_fixture INTEGER,
        system_prompt TEXT,
        total_tests INTEGER,
        pass_count INTEGER,
        fail_count INTEGER,
        inconclusive_count INTEGER,
        error_count INTEGER,
        attack_success_rate REAL,
        utility_retention_rate REAL,
        summary_json TEXT,
        results_json TEXT
    )
    """)
    
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS prompt_versions (
        version_id TEXT PRIMARY KEY,
        prompt_id TEXT,
        version_tag TEXT,
        title TEXT,
        system_prompt TEXT,
        user_template TEXT,
        changelog TEXT,
        created_at TEXT
    )
    """)
    
    conn.commit()
    conn.close()

# Auto-initialize on import
init_db()

def save_run(run_data: Dict[str, Any], results: List[Dict[str, Any]]):
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("""
    INSERT OR REPLACE INTO runs (
        run_id, title, timestamp, prompt_version, model_name, provider,
        is_fixture, system_prompt, total_tests, pass_count, fail_count,
        inconclusive_count, error_count, attack_success_rate, utility_retention_rate,
        summary_json, results_json
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        run_data["run_id"],
        run_data.get("title", "Test Run"),
        run_data["timestamp"],
        run_data.get("prompt_version", "v3"),
        run_data["model_name"],
        run_data["provider"],
        1 if run_data.get("is_fixture", False) else 0,
        run_data.get("system_prompt", ""),
        run_data["total_tests"],
        run_data["pass_count"],
        run_data["fail_count"],
        run_data["inconclusive_count"],
        run_data["error_count"],
        run_data["attack_success_rate"],
        run_data["utility_retention_rate"],
        json.dumps(run_data),
        json.dumps(results)
    ))
    conn.commit()
    conn.close()

def get_all_runs() -> List[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT run_id, title, timestamp, prompt_version, model_name, provider, is_fixture, total_tests, pass_count, fail_count, attack_success_rate, utility_retention_rate FROM runs ORDER BY timestamp DESC")
    rows = cursor.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_run_by_id(run_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM runs WHERE run_id = ?", (run_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    data = dict(row)
    data["summary_json"] = json.loads(data["summary_json"]) if data["summary_json"] else {}
    data["results_json"] = json.loads(data["results_json"]) if data["results_json"] else []
    return data
