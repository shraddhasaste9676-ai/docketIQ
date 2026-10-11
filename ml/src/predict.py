import math
from pathlib import Path
from typing import Any

import joblib
import pandas as pd

if __package__:
    from .actions import build_recommendation
else:
    from actions import build_recommendation


ML_DIR = Path(__file__).resolve().parents[1]
MODEL_PATH = ML_DIR / "models" / "disposition_model.joblib"
SUPPORTED_FEATURES = ("court_name", "case_type", "case_year", "case_duration_days")
NUMERIC_FEATURES = ("case_year", "case_duration_days")


def _clean_input(case: dict[str, Any]) -> pd.DataFrame:
    if not isinstance(case, dict):
        raise ValueError("Case input must be a dictionary of structured metadata.")

    unknown_fields = set(case) - set(SUPPORTED_FEATURES)
    if unknown_fields:
        raise ValueError(
            f"Unsupported input fields: {', '.join(sorted(unknown_fields))}. "
            f"Supported fields are: {', '.join(SUPPORTED_FEATURES)}."
        )

    if not any(value is not None and value != "" for value in case.values()):
        raise ValueError("Provide at least one non-empty supported case feature.")

    cleaned: dict[str, Any] = {}
    for feature in SUPPORTED_FEATURES:
        value = case.get(feature)
        if value is None or (isinstance(value, str) and not value.strip()):
            cleaned[feature] = None
            continue
        if feature in NUMERIC_FEATURES:
            if isinstance(value, bool):
                raise ValueError(f"{feature} must be a finite number.")
            try:
                number = float(value)
            except (TypeError, ValueError) as error:
                raise ValueError(f"{feature} must be a finite number.") from error
            if not math.isfinite(number):
                raise ValueError(f"{feature} must be a finite number.")
            if feature == "case_duration_days" and number < 0:
                raise ValueError("case_duration_days cannot be negative.")
            cleaned[feature] = number
        elif not isinstance(value, str):
            raise ValueError(f"{feature} must be a string.")
        else:
            cleaned[feature] = value.strip()

    return pd.DataFrame([cleaned], columns=SUPPORTED_FEATURES)


def predict_disposition(case: dict[str, Any]) -> dict[str, Any]:
    if not MODEL_PATH.is_file():
        raise FileNotFoundError(
            f"Trained model not found at {MODEL_PATH}. Run src/train_model.py first."
        )

    features = _clean_input(case)
    pipeline = joblib.load(MODEL_PATH)
    model_features = pipeline.named_steps["preprocessor"].feature_names_in_
    prediction_input = features.loc[:, model_features]
    probabilities = pipeline.predict_proba(prediction_input)[0]
    classes = pipeline.named_steps["classifier"].classes_
    best_index = int(probabilities.argmax())
    predicted_disposition = str(classes[best_index])
    confidence = float(probabilities[best_index])

    result = build_recommendation(predicted_disposition, confidence)
    result["probabilities"] = {
        str(label): float(probability)
        for label, probability in sorted(
            zip(classes, probabilities), key=lambda item: item[1], reverse=True
        )
    }
    return result


if __name__ == "__main__":
    example = {
        "court_name": "Patna High Court",
        "case_type": "CR. MISC.",
        "case_year": 2020,
        "case_duration_days": 180,
    }
    print(predict_disposition(example))
