# DocketIQ end-to-end demo

This demo wires the existing React/Vite frontend, notebook-defined FastAPI
backend, trained disposition model, and PostgreSQL database together. The five
cases in `demo_data.json` are fictional. Their sample timeline events are
displayed locally and are **not** inserted as verified court events.

The model's estimates are experimental, not legal advice. The current model has
limited predictive quality and must not be used to make legal decisions.

## Prerequisites

- Windows PowerShell
- Node.js and npm
- Python 3.12 or newer
- Docker Desktop (or an equivalent local PostgreSQL 16 server)
- The trained artifact `ml/models/disposition_model.joblib`

Open PowerShell at the repository root for all commands below.

## Install dependencies

```powershell
python -m pip install -r ml/requirements.txt uvicorn psycopg2-binary
npm ci
```

## Start PostgreSQL

The notebook backend uses database `casecompass_db` as `casecompass_user` on
localhost port 5432. Choose a local password and set it in PowerShell:

```powershell
$env:DOCKETIQ_DB_PASSWORD = Read-Host "Choose a local PostgreSQL password"
docker run --name docketiq-postgres `
  -e POSTGRES_DB=casecompass_db `
  -e POSTGRES_USER=casecompass_user `
  -e "POSTGRES_PASSWORD=$env:DOCKETIQ_DB_PASSWORD" `
  -p 5432:5432 `
  -d postgres:16
```

Run the existing database schema/DDL setup cell in
`VORTEXAdatabase&backend.ipynb` against this database. Then install the
additive prediction-history table:

```powershell
Get-Content demo/ml_prediction_history.sql |
  docker exec -i docketiq-postgres psql -U casecompass_user -d casecompass_db
```

Do not run `docker run` again if the named container already exists. Start that
container instead:

```powershell
docker start docketiq-postgres
```

## Start the backend

Open `VORTEXAdatabase&backend.ipynb` in VS Code/Jupyter. Run the notebook's
backend setup cells, including the app-definition cell that writes `main.py`.
The ML router registration and `app.state.db_connect` assignment are included
in those app-definition cells. Do not also run the notebook's embedded Uvicorn
startup cell if you plan to start Uvicorn from the terminal.

In a new PowerShell window at the repository root:

```powershell
$env:DOCKETIQ_DB_PASSWORD = Read-Host "Enter the local PostgreSQL password"
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Keep this terminal open. Verify the API is running at
`http://127.0.0.1:8000/` and open API documentation at
`http://127.0.0.1:8000/docs`.

## Start the frontend

The Vite development server proxies `/api` to `http://127.0.0.1:8000`.

```powershell
npm run dev
```

Open `http://localhost:5173`. The dashboard's **AI Case Analysis** panel lets
you select one of the fictional cases, inspect its clearly marked sample
timeline, run the model, and view the saved analysis history. A case record is
upserted and a prediction-history row is saved only when a prediction request
includes the demo case reference. Prediction history is separate from
source-linked case events and is not presented as a verified timeline event.

## Run ML API tests

```powershell
python -m pytest ml/tests -q
```

## Run the command-line demo

With PostgreSQL, its schema/migration, the backend, and the trained model
available:

```powershell
python demo/run_demo.py
```

By default it calls `http://127.0.0.1:8000/api/ml/predict-disposition`,
prints each response and a summary, and writes
`demo/demo_results.json`. To use a different backend URL:

```powershell
$env:DOCKETIQ_API_URL = "http://127.0.0.1:8000/api/ml/predict-disposition"
python demo/run_demo.py
```

The frontend is at `http://localhost:5173`, backend at
`http://127.0.0.1:8000`, and FastAPI/OpenAPI docs at
`http://127.0.0.1:8000/docs`.

## Prediction API example

Request:

```json
{
  "case_reference": "DIQ-DEMO-BR-002",
  "case_title": "Fictional Bail Application",
  "court_name": "Patna High Court",
  "case_type": "CR. MISC./4828/2025",
  "case_year": 2025,
  "registration_date": "2025-01-23",
  "jurisdiction": "Bihar"
}
```

Response:

```json
{
  "predicted_disposition": "BAIL GRANTED",
  "confidence": 0.61,
  "recommended_action": "Review bail conditions and prepare compliance checklist",
  "client_facing_update": "DocketIQ predicts the disposition may be BAIL GRANTED (61% model confidence). This is an automated estimate. DocketIQ is not legal advice."
}
```

Prediction values are illustrative; actual output depends on the saved model.
The optional identity fields make the analysis persist to
`ml_prediction_history`. The history is available at
`GET /api/ml/cases/{case_reference}/history`. Existing API routes and the
frontend design system are left intact.
