from pathlib import Path
from typing import Final
from io import StringIO

import pandas as pd

PROJECT_ROOT: Final[Path] = Path(__file__).resolve().parents[3]
RAW_DATASET_PATH: Final[Path] = PROJECT_ROOT / "data" / "raw" / "dataset.csv"
PROCESSED_DATASET_PATH: Final[Path] = PROJECT_ROOT / "data" / "processed" / "dataset_clean.csv"


SAMPLE_DATA = [
    {
        "region": "North",
        "month": "2026-01",
        "generation_cost": 42.0,
        "distribution_cost": 17.0,
        "commercialization_cost": 8.0,
        "unit_cost": 67.0,
        "energy_consumption_kwh": 1200,
    },
    {
        "region": "North",
        "month": "2026-02",
        "generation_cost": 43.5,
        "distribution_cost": 17.2,
        "commercialization_cost": 8.1,
        "unit_cost": 68.8,
        "energy_consumption_kwh": 1180,
    },
    {
        "region": "South",
        "month": "2026-01",
        "generation_cost": 39.2,
        "distribution_cost": 15.8,
        "commercialization_cost": 7.4,
        "unit_cost": 62.4,
        "energy_consumption_kwh": 980,
    },
    {
        "region": "South",
        "month": "2026-02",
        "generation_cost": 41.1,
        "distribution_cost": 16.4,
        "commercialization_cost": 7.9,
        "unit_cost": 65.4,
        "energy_consumption_kwh": 1010,
    },
    {
        "region": "East",
        "month": "2026-01",
        "generation_cost": 46.8,
        "distribution_cost": 18.6,
        "commercialization_cost": 8.4,
        "unit_cost": 73.8,
        "energy_consumption_kwh": 1320,
    },
    {
        "region": "East",
        "month": "2026-02",
        "generation_cost": 47.0,
        "distribution_cost": 18.8,
        "commercialization_cost": 8.2,
        "unit_cost": 74.0,
        "energy_consumption_kwh": 1295,
    },
    {
        "region": "West",
        "month": "2026-01",
        "generation_cost": 38.9,
        "distribution_cost": 15.1,
        "commercialization_cost": 7.0,
        "unit_cost": 61.0,
        "energy_consumption_kwh": 940,
    },
    {
        "region": "West",
        "month": "2026-02",
        "generation_cost": 39.6,
        "distribution_cost": 15.4,
        "commercialization_cost": 7.1,
        "unit_cost": 62.1,
        "energy_consumption_kwh": 955,
    },
]


def ensure_processed_dataset() -> Path:
    """Create a fallback processed dataset when no clean file is available."""
    PROCESSED_DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    if not PROCESSED_DATASET_PATH.exists():
        sample_df = pd.DataFrame(SAMPLE_DATA)
        sample_df.to_csv(PROCESSED_DATASET_PATH, index=False)
    return PROCESSED_DATASET_PATH


def load_dataset() -> pd.DataFrame:
    """Load the processed dataset, creating a sample file when needed."""
    dataset_path = ensure_processed_dataset()
    return pd.read_csv(dataset_path)


def _normalize_columns(df: pd.DataFrame) -> pd.DataFrame:
    """Normalize column names for consistent downstream analysis."""
    normalized = df.copy()
    normalized.columns = (
        normalized.columns.str.strip()
        .str.lower()
        .str.replace(" ", "_", regex=False)
        .str.replace("-", "_", regex=False)
    )
    return normalized


def _basic_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    """Apply minimal cleaning to keep the MVP robust and readable."""
    cleaned = _normalize_columns(df)
    cleaned = cleaned.drop_duplicates().reset_index(drop=True)

    numeric_columns = cleaned.select_dtypes(include=["number"]).columns
    for col in numeric_columns:
        cleaned[col] = cleaned[col].fillna(cleaned[col].median())

    categorical_columns = cleaned.select_dtypes(exclude=["number"]).columns
    for col in categorical_columns:
        if cleaned[col].isna().any():
            mode_values = cleaned[col].mode(dropna=True)
            if not mode_values.empty:
                cleaned[col] = cleaned[col].fillna(mode_values.iloc[0])

    return cleaned


def save_uploaded_csv(csv_bytes: bytes) -> dict[str, int]:
    """Save uploaded CSV into raw data and export a cleaned processed version."""
    raw_text = csv_bytes.decode("utf-8")
    raw_df = pd.read_csv(StringIO(raw_text))

    if raw_df.empty:
        raise ValueError("Uploaded CSV is empty.")

    RAW_DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)
    PROCESSED_DATASET_PATH.parent.mkdir(parents=True, exist_ok=True)

    raw_df.to_csv(RAW_DATASET_PATH, index=False)

    clean_df = _basic_cleaning(raw_df)
    clean_df.to_csv(PROCESSED_DATASET_PATH, index=False)

    return {"rows": int(clean_df.shape[0]), "columns": int(clean_df.shape[1])}
