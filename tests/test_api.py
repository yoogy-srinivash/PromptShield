import asyncio
from httpx import AsyncClient, ASGITransport
from backend.app.main import app

def test_api_status():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.get("/api/status")
            assert resp.status_code == 200
            data = resp.json()
            assert data["status"] == "operational"
            assert "Module A (Dashboard)" in data["modules"]
            assert data["modules"]["Module A (Dashboard)"] == "Working"
    asyncio.run(_run())

def test_api_templates():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.get("/api/templates")
            assert resp.status_code == 200
            data = resp.json()
            assert len(data) >= 3
            assert data[0]["id"] == "tpl_bennett_faq"
    asyncio.run(_run())

def test_api_demo_run():
    async def _run():
        async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
            resp = await ac.post("/api/demo/run")
            assert resp.status_code == 200
            data = resp.json()
            assert data["status"] == "success"
            assert "baseline_summary" in data
            assert "hardened_prompt_result" in data
            assert "comparison_report" in data
            assert data["comparison_report"]["asr_reduction_percentage"] > 0
    asyncio.run(_run())
