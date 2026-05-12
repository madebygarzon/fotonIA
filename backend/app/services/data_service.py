from __future__ import annotations

from typing import Any

import pandas as pd

from app.utils.file_loader import load_dataset


class DataService:
    def __init__(self) -> None:
        self.df = load_dataset()

    def refresh(self) -> None:
        self.df = load_dataset()

    def _numeric_columns(self) -> list[str]:
        return self.df.select_dtypes(include=["number"]).columns.tolist()

    def _categorical_columns(self) -> list[str]:
        return self.df.select_dtypes(exclude=["number"]).columns.tolist()

    def summary(self) -> dict[str, Any]:
        return {
            "dataset_name": "dataset_clean.csv",
            "rows": int(self.df.shape[0]),
            "columns": int(self.df.shape[1]),
            "numeric_columns": self._numeric_columns(),
            "categorical_columns": self._categorical_columns(),
            "missing_values_total": int(self.df.isna().sum().sum()),
            "duplicated_rows": int(self.df.duplicated().sum()),
        }

    def data_quality(self) -> dict[str, Any]:
        missing_by_column = [
            {"column": column, "missing": int(value)}
            for column, value in self.df.isna().sum().items()
        ]

        dtypes = [
            {"column": column, "dtype": str(dtype)}
            for column, dtype in self.df.dtypes.items()
        ]

        return {
            "missing_values_by_column": missing_by_column,
            "duplicated_rows": int(self.df.duplicated().sum()),
            "data_types": dtypes,
            "columns": self.df.columns.tolist(),
        }

    def descriptive_stats(self) -> dict[str, Any]:
        numeric_df = self.df[self._numeric_columns()]
        if numeric_df.empty:
            return {"stats": []}

        stats = []
        for col in numeric_df.columns:
            series = numeric_df[col].dropna()
            stats.append(
                {
                    "variable": col,
                    "mean": float(series.mean()),
                    "median": float(series.median()),
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "std": float(series.std(ddof=0)),
                }
            )
        return {"stats": stats}

    def correlations(self) -> dict[str, Any]:
        numeric_df = self.df[self._numeric_columns()]
        if numeric_df.shape[1] < 2:
            return {"correlations": []}

        corr_df = numeric_df.corr(numeric_only=True).fillna(0)
        correlation_rows = []
        for row_name, values in corr_df.iterrows():
            for col_name, value in values.items():
                correlation_rows.append(
                    {
                        "x": row_name,
                        "y": col_name,
                        "value": float(value),
                    }
                )

        return {"correlations": correlation_rows}

    def outliers(self) -> dict[str, Any]:
        results = []
        for column in self._numeric_columns():
            series = self.df[column].dropna()
            if series.empty:
                continue

            q1 = series.quantile(0.25)
            q3 = series.quantile(0.75)
            iqr = q3 - q1
            lower_bound = q1 - 1.5 * iqr
            upper_bound = q3 + 1.5 * iqr
            outlier_count = int(((series < lower_bound) | (series > upper_bound)).sum())

            results.append(
                {
                    "variable": column,
                    "q1": float(q1),
                    "q3": float(q3),
                    "iqr": float(iqr),
                    "lower_bound": float(lower_bound),
                    "upper_bound": float(upper_bound),
                    "outlier_count": outlier_count,
                }
            )

        return {"outliers": results}

    def distribution_chart(self) -> dict[str, Any]:
        numeric_columns = self._numeric_columns()
        if not numeric_columns:
            return {"distributions": []}

        target_column = numeric_columns[0]
        series = self.df[target_column].dropna()
        if series.empty:
            return {"variable": target_column, "distributions": []}

        # Handle constant or near-constant series to avoid invalid bins.
        if series.nunique() <= 1:
            only_value = float(series.iloc[0])
            return {
                "variable": target_column,
                "distributions": [{"range": f"{only_value}", "count": int(series.shape[0])}],
            }

        bins = pd.cut(series, bins=6, duplicates="drop")
        distribution_series = bins.value_counts(sort=False)
        distribution = distribution_series.rename_axis("range").reset_index(name="count")
        distribution["range"] = distribution["range"].map(str)
        distribution["count"] = distribution["count"].astype(int)

        return {
            "variable": target_column,
            "distributions": distribution.to_dict(orient="records"),
        }

    def category_summary_chart(self) -> dict[str, Any]:
        categorical_columns = self._categorical_columns()
        numeric_columns = self._numeric_columns()

        if not categorical_columns:
            return {"category": None, "summary": []}

        category_col = categorical_columns[0]
        target_numeric = "unit_cost" if "unit_cost" in numeric_columns else (numeric_columns[0] if numeric_columns else None)

        if target_numeric is None:
            grouped = self.df.groupby(category_col).size().reset_index(name="count")
            return {
                "category": category_col,
                "metric": "count",
                "summary": grouped.to_dict(orient="records"),
            }

        grouped = (
            self.df.groupby(category_col)[target_numeric]
            .mean()
            .reset_index(name="average_value")
        )

        return {
            "category": category_col,
            "metric": target_numeric,
            "summary": grouped.to_dict(orient="records"),
        }
