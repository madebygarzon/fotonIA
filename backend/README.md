# fotonIA Backend

FastAPI backend for local exploratory analytics.

## Run locally

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## API

- `GET /health`
- `GET /api/summary`
- `GET /api/data-quality`
- `GET /api/descriptive-stats`
- `GET /api/correlations`
- `GET /api/outliers`
- `GET /api/charts/distribution`
- `GET /api/charts/category-summary`
- `GET /api/sample-csv`
- `POST /api/upload`
- `POST /api/chat`

Swagger:
- `http://localhost:8000/docs`
