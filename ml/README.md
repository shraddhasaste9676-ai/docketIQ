# DocketIQ disposition model

This directory contains an offline ML training and inference layer. It does not
change the frontend, backend APIs, or database.

## Setup

From the repository root, install the open-source Python dependencies:

```powershell
python -m pip install -r ml/requirements.txt
```

## Data and training

Run each stage from the repository root:

```powershell
python ml/src/load_data.py
python ml/src/preprocess.py
python ml/src/train_model.py
python ml/src/evaluate_model.py
```

The loader streams only the first 10,000 rows of the Hugging Face training
split, avoiding a download of the full dataset. It writes
`ml/data/raw/cases_sample.parquet`. Preprocessing writes
`ml/data/processed/cases_clean.parquet`; training persists the held-out test
rows at `ml/data/processed/test_set.parquet` so evaluation uses the exact same
split. The fitted sklearn pipeline and JSON metadata/metrics are written under
`ml/models/`.

Structured model features are `court_name`, `case_type`, `case_year`, and
`case_duration_days`, restricted to columns available in the sampled data.
Duration is derived from registration and decision dates. Since a completed
case's duration is not known before its decision, this feature can leak outcome-
time information into training and must not be used for pre-decision predictions.
Predictions without it are imputed by the pipeline; evaluate a pre-decision
model separately before relying on it in that setting.
Model predictions are estimates, not legal advice.

## Prediction

With a trained model, call `predict_disposition` from `ml/src/predict.py` with a
dictionary containing one or more supported features:

```python
from predict import predict_disposition

result = predict_disposition(
    {
        "court_name": "Patna High Court",
        "case_type": "CR. MISC.",
        "case_year": 2020,
    }
)
```

The result contains the predicted disposition, confidence, class probabilities,
recommended action, and a neutral client-facing update stating that the result
is not legal advice. The prediction module validates inputs and reports a
specific error if the model has not been trained.

## Backend integration

The repository's FastAPI/PostgreSQL backend is defined in
`VORTEXAdatabase&backend.ipynb`; its case table does not store all model
features. The ML endpoint predicts from the supplied metadata. If
`case_reference` and `case_title` are also supplied, the backend upserts the
case identity and saves the prediction to the additive
`ml_prediction_history` table. Apply `demo/ml_prediction_history.sql` before
using this persistence option. Predictions are kept separate from
source-verified case timeline events.

The notebook includes ML-router registration cells in its generated `main.py`
app definitions, along with the database connection callback used by optional
prediction-history persistence. Run the relevant notebook cells with the
repository root as the working directory and the trained model at
`ml/models/disposition_model.joblib`.
The route is:

```text
POST /api/ml/predict-disposition
```

Example request:

```json
{
  "case_reference": "DIQ-DEMO-BR-002",
  "case_title": "Fictional Bail Application",
  "court_name": "Patna High Court",
  "case_type": "CR. MISC.",
  "case_year": 2025,
  "jurisdiction": "Bihar"
}
```

Example response:

```json
{
  "predicted_disposition": "DISPOSED",
  "confidence": 0.6766666666666666,
  "recommended_action": "Review final order and determine follow-up",
  "client_facing_update": "DocketIQ predicts the disposition may be DISPOSED (68% model confidence). This is an automated estimate. DocketIQ is not legal advice."
}
```

Saved history is available from
`GET /api/ml/cases/{case_reference}/history` after applying the history-table
migration. Prediction history is not represented as verified timeline evidence.

The response above is an observed example; confidence and prediction vary with
the supplied metadata. `case_duration_days` is optional, but it is decision-time
information and should be omitted when predicting an unresolved case. The API
rejects unknown fields and invalid numeric ranges, returns 503 if the model
file is missing, and returns 422 for invalid input. No existing route, database
table, or frontend code is changed.

Run the prediction API tests from the repository root:

```powershell
python -m pytest ml/tests -q
```
