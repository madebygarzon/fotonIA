from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from fastapi.responses import Response

from app.schemas.response_schemas import HealthResponse
from app.services.chat_service import ChatService
from app.services.data_service import DataService
from app.utils.file_loader import save_uploaded_csv

app = FastAPI(title="fotonIA API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

service = DataService()

class ChatRequest(BaseModel):
    question: str


SAMPLE_CSV_TEMPLATE = """region,month,generation_cost,distribution_cost,commercialization_cost,unit_cost,energy_consumption_kwh
North,2026-01,42.0,17.0,8.0,67.0,1200
South,2026-01,39.2,15.8,7.4,62.4,980
East,2026-02,47.0,18.8,8.2,74.0,1295
"""


@app.get("/health", response_model=HealthResponse)
def health() -> HealthResponse:
    return HealthResponse(status="ok", project="fotonIA")


@app.get("/api/sample-csv")
def download_sample_csv() -> Response:
    return Response(
        content=SAMPLE_CSV_TEMPLATE,
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=dataset_template.csv"},
    )


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


@app.post("/api/upload")
async def upload_dataset(file: UploadFile = File(...)) -> dict:
    try:
        if not file.filename or not file.filename.lower().endswith(".csv"):
            raise HTTPException(status_code=400, detail="Only CSV files are supported.")

        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")

        saved_info = save_uploaded_csv(content)
        service.refresh()
        return {
            "message": "Dataset uploaded and processed successfully.",
            "rows": saved_info["rows"],
            "columns": saved_info["columns"],
        }
    except HTTPException:
        raise
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=400, detail="CSV must be UTF-8 encoded.") from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to upload dataset: {exc}") from exc


@app.post("/api/chat")
def chat_with_dataset(payload: ChatRequest) -> dict:
    try:
        service.refresh()
        chat_service = ChatService(service.df)
        return chat_service.answer(payload.question)
    except Exception as exc:  # noqa: BLE001
        raise HTTPException(status_code=500, detail=f"Failed to answer chat question: {exc}") from exc
