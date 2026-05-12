from __future__ import annotations

import re
from typing import Any

import pandas as pd


class ChatService:
    """Simple local RAG-like service grounded on the loaded dataframe."""

    def __init__(self, df: pd.DataFrame) -> None:
        self.df = df

    def answer(self, question: str) -> dict[str, Any]:
        normalized_question = question.strip().lower()
        if not normalized_question:
            return {
                "answer": (
                    "No recibí una pregunta. Puedes intentar con: "
                    + " | ".join(self._suggested_questions())
                ),
                "sources": [],
            }

        # Intent: dataset size
        if any(token in normalized_question for token in ["cuantas filas", "cuántas filas", "registros", "rows"]):
            return {
                "answer": f"El dataset tiene {self.df.shape[0]} filas y {self.df.shape[1]} columnas.",
                "sources": ["dataset summary"],
            }

        # Intent: missing values
        if any(token in normalized_question for token in ["faltantes", "missing", "nulos", "null"]):
            missing_total = int(self.df.isna().sum().sum())
            top_missing = self.df.isna().sum().sort_values(ascending=False).head(5)
            missing_text = ", ".join([f"{col}: {int(val)}" for col, val in top_missing.items() if int(val) > 0])
            if not missing_text:
                missing_text = "No hay valores faltantes detectados."
            return {
                "answer": f"Valores faltantes totales: {missing_total}. Detalle principal: {missing_text}",
                "sources": ["data quality"],
            }

        # Intent: average by column
        avg_match = re.search(r"(promedio|media|average)\s+de\s+([a-zA-Z0-9_]+)", normalized_question)
        if avg_match:
            col = avg_match.group(2)
            if col in self.df.columns and pd.api.types.is_numeric_dtype(self.df[col]):
                mean_value = float(self.df[col].mean())
                return {
                    "answer": f"El promedio de {col} es {mean_value:.2f}.",
                    "sources": [f"column:{col}"],
                }
            return {
                "answer": (
                    f"No pude calcular el promedio para '{col}'. Verifica que exista y sea numérica. "
                    f"Preguntas sugeridas: {' | '.join(self._suggested_questions())}"
                ),
                "sources": [],
            }

        # Intent: max or min by column
        extrema_match = re.search(r"(maximo|max|máximo|minimo|min|mínimo)\s+de\s+([a-zA-Z0-9_]+)", normalized_question)
        if extrema_match:
            op = extrema_match.group(1)
            col = extrema_match.group(2)
            if col in self.df.columns and pd.api.types.is_numeric_dtype(self.df[col]):
                value = float(self.df[col].max()) if "max" in op else float(self.df[col].min())
                label = "máximo" if "max" in op else "mínimo"
                return {
                    "answer": f"El valor {label} de {col} es {value:.2f}.",
                    "sources": [f"column:{col}"],
                }
            return {
                "answer": (
                    f"No pude calcular ese valor para '{col}'. Verifica que exista y sea numérica. "
                    f"Preguntas sugeridas: {' | '.join(self._suggested_questions())}"
                ),
                "sources": [],
            }

        # Generic retrieval: rank rows by token overlap.
        ranked_rows = self._retrieve_rows(normalized_question)
        if ranked_rows.empty:
            return {
                "answer": (
                    "No encontré evidencia suficiente en el dataset para responder con precisión. "
                    f"Prueba con preguntas como: {' | '.join(self._suggested_questions())}"
                ),
                "sources": [],
            }

        sample_rows = ranked_rows.head(3).to_dict(orient="records")
        evidence_lines = [self._compact_row(row) for row in sample_rows]

        return {
            "answer": (
                "No detecté una intención analítica exacta, pero encontré estas filas relevantes: "
                + " | ".join(evidence_lines)
            ),
            "sources": [f"row_index:{idx}" for idx in ranked_rows.head(3).index.tolist()],
        }

    def _retrieve_rows(self, question: str) -> pd.DataFrame:
        question_tokens = set(re.findall(r"[a-zA-Z0-9_]+", question))
        if not question_tokens:
            return pd.DataFrame(columns=self.df.columns)

        scored: list[tuple[int, float]] = []
        for idx, row in self.df.iterrows():
            row_text = " ".join(str(value).lower() for value in row.values)
            row_tokens = set(re.findall(r"[a-zA-Z0-9_]+", row_text))
            overlap = question_tokens.intersection(row_tokens)
            score = float(len(overlap))
            if score > 0:
                scored.append((idx, score))

        if not scored:
            return pd.DataFrame(columns=self.df.columns)

        top_idx = [idx for idx, _ in sorted(scored, key=lambda x: x[1], reverse=True)[:10]]
        return self.df.loc[top_idx]

    @staticmethod
    def _compact_row(row: dict[str, Any]) -> str:
        preview_keys = list(row.keys())[:4]
        return ", ".join(f"{key}={row[key]}" for key in preview_keys)

    def _suggested_questions(self) -> list[str]:
        numeric_cols = [
            col for col in self.df.columns if pd.api.types.is_numeric_dtype(self.df[col])
        ]
        first_numeric = numeric_cols[0] if numeric_cols else "unit_cost"

        suggestions = [
            "cuantas filas tiene el dataset",
            "faltantes",
            f"promedio de {first_numeric}",
            f"maximo de {first_numeric}",
        ]
        return suggestions
