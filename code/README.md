# Code Directory Index

According to the Bennett University SCSE4041 Milestone 2 Guidelines, this `code/` folder indexes the project implementation. To maintain clean modular development and standard tooling without code duplication:

- **Backend (FastAPI, Python 3.12, SQLite, Pydantic, ReportLab)**: Located in [`../backend/`](../backend/)
  - Application entry: [`../backend/app/main.py`](../backend/app/main.py)
  - API Routes: [`../backend/app/api/routes.py`](../backend/app/api/routes.py)
  - Core Services & Evaluators: [`../backend/app/services/`](../backend/app/services/)
  - Prompt Templates & Schemas: [`../backend/app/prompts/`](../backend/app/prompts/)
- **Frontend (React 18, Vite, TypeScript, Tailwind CSS)**: Located in [`../frontend/`](../frontend/)
  - Source components & UI: [`../frontend/src/`](../frontend/src/)
- **Automated Tests (pytest)**: Located in [`../tests/`](../tests/)
- **Final & Versioned Prompts**: Located in [`../prompts/`](../prompts/)
- **Test Datasets & Output Logs**: Located in [`../test-data/`](../test-data/)
