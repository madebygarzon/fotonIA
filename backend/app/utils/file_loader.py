from pathlib import Path
from typing import Final

import pandas as pd

PROJECT_ROOT: Final[Path] = Path(__file__).resolve().parents[3]
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
