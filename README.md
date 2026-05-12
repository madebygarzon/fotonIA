# fotonIA

fotonIA es una plataforma académica de Inteligencia Artificial orientada al análisis exploratorio de datos energéticos.  
El proyecto integra un flujo completo de análisis de datos con visualización interactiva y consulta asistida por chat sobre la información cargada.

## Propósito académico

fotonIA está diseñado para demostrar, de forma práctica, las primeras fases del ciclo de vida de Machine Learning:
- Detección del problema
- Identificación de datos
- Carga, limpieza y evaluación de calidad
- Tratamiento de datos faltantes y duplicados
- Normalización
- Análisis exploratorio y visualización
- Generación de hallazgos y conclusiones preliminares

## Funcionalidades principales

- Dashboard analítico con métricas clave del dataset.
- Tablas de calidad de datos y estadísticas descriptivas.
- Visualizaciones estilizadas con Recharts (distribución, evolución, categorías y correlaciones).
- Detección de outliers mediante método IQR.
- Carga de archivos CSV y procesamiento automático de datos.
- Descarga de plantilla CSV para guiar la estructura esperada.
- Chatbot con recuperación de contexto del dataset para responder preguntas analíticas.

## Stack tecnológico

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
- Archivos CSV
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
- Repositorio: `https://github.com/madebygarzon/fotonIA`

## Flujo funcional del sistema

1. El usuario puede descargar una plantilla (`/api/sample-csv`) con columnas esperadas.
2. El usuario carga un CSV en la interfaz.
3. El backend guarda el archivo en `data/raw/dataset.csv`, aplica limpieza básica y genera `data/processed/dataset_clean.csv`.
4. La API expone métricas, calidad de datos, estadísticas, outliers y datos para gráficas.
5. El frontend renderiza el dashboard y permite interacción con chatbot para consultas sobre el dataset.
6. El notebook complementa el análisis con exploración detallada y exportación de resultados.

---
## Autor

- Creado por **Carlos Garzón**
- Software Engineer, Fullstack Developer.
---

## Licencia

MIT
