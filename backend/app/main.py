from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from app.schemas.response_schemas import HealthResponse
from app.services.data_service import DataService

app = FastAPI(title="fotonIA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = DataService()


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", project="fotonIA")


@app.get("/api/summary")
def get_summary() -> dict:
    try:
        service.refresh()
        return service.summary()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to generate summary: {exc}") from exc


@app.get("/api/data-quality")
def get_data_quality() -> dict:
    try:
        service.refresh()
        return service.data_quality()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to evaluate data quality: {exc}") from exc


@app.get("/api/descriptive-stats")
def get_descriptive_stats() -> dict:
    try:
        service.refresh()
        return service.descriptive_stats()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to compute descriptive stats: {exc}") from exc


@app.get("/api/correlations")
def get_correlations() -> dict:
    try:
        service.refresh()
        return service.correlations()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to compute correlations: {exc}") from exc


@app.get("/api/outliers")
def get_outliers() -> dict:
    try:
        service.refresh()
        return service.outliers()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to detect outliers: {exc}") from exc


@app.get("/api/charts/distribution")
def get_distribution_chart() -> dict:
    try:
        service.refresh()
        return service.distribution_chart()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to build distribution chart data: {exc}") from exc


@app.get("/api/charts/category-summary")
def get_category_summary_chart() -> dict:
    try:
        service.refresh()
        return service.category_summary_chart()
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to build category summary data: {exc}") from exc
