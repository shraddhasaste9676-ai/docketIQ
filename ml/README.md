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

No backend framework or API routes were present in the inspected workspace.
Integrate this module only after the backend is available; this ML layer does
not add or modify API endpoints.
