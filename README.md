# fotonIA

fotonIA es un proyecto académico de Inteligencia Artificial (nivel explorador) orientado al análisis exploratorio de datos energéticos.

## Objetivo académico

Demostrar de forma local y simple las primeras fases del ciclo de vida de Machine Learning:
- Detección del problema
- Identificación de datos
- Carga, limpieza y evaluación de calidad
- Tratamiento de datos faltantes y duplicados
- Normalización
- Análisis exploratorio y visualización
- Conclusiones preliminares

## Stack usado

### Frontend
- Next.js
- React
- TypeScript
- Tailwind CSS
- Recharts

### Backend
- Python
- FastAPI
- Uvicorn
- pandas

### Análisis
- Jupyter Notebook
- pandas
- numpy
- matplotlib
- seaborn

### Datos
- Archivos CSV locales
- Sin base de datos

## Estructura del proyecto

```text
fotonIA/
├── README.md
├── data/
│   ├── raw/
│   └── processed/
├── notebooks/
│   └── 01_eda_fotonia.ipynb
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── services/
│   │   │   └── data_service.py
│   │   ├── schemas/
│   │   │   └── response_schemas.py
│   │   └── utils/
│   │       └── file_loader.py
│   ├── requirements.txt
│   └── README.md
└── frontend/
    ├── app/
    ├── components/
    ├── lib/
    ├── types/
    ├── package.json
    └── README.md
```

## Ejecución local

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## URLs

- Backend: `http://localhost:8000`
- Frontend: `http://localhost:3001`
- Swagger: `http://localhost:8000/docs`

## Flujo general de datos

1. El notebook consume `data/raw/dataset.csv` si existe, o genera datos de ejemplo.
2. El notebook limpia y transforma los datos.
3. El notebook exporta el dataset limpio a `data/processed/dataset_clean.csv`.
4. FastAPI lee `dataset_clean.csv` (o crea un dataset de ejemplo automáticamente).
5. Next.js consume los endpoints de FastAPI y renderiza el dashboard exploratorio.

---
## Autor

- Creado por **Carlos Garzón**
- Software Engineer, Fullstack Developer.
---

## Licencia

MIT