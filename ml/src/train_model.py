import json
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import accuracy_score, classification_report, f1_score
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import OneHotEncoder, StandardScaler


ML_DIR = Path(__file__).resolve().parents[1]
DATA_PATH = ML_DIR / "data" / "processed" / "cases_clean.parquet"
TEST_DATA_PATH = ML_DIR / "data" / "processed" / "test_set.parquet"
MODEL_PATH = ML_DIR / "models" / "disposition_model.joblib"
METADATA_PATH = ML_DIR / "models" / "model_metadata.json"
TARGET = "disposition_text"
RANDOM_STATE = 42


def build_pipeline(categorical_features: list[str], numeric_features: list[str]) -> Pipeline:
    transformers = []
    if categorical_features:
        categorical_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="most_frequent")),
                (
                    "onehot",
                    OneHotEncoder(handle_unknown="ignore", sparse_output=True),
                ),
            ]
        )
        transformers.append(("categorical", categorical_pipeline, categorical_features))
    if numeric_features:
        numeric_pipeline = Pipeline(
            steps=[
                ("imputer", SimpleImputer(strategy="median")),
                ("scaler", StandardScaler()),
            ]
        )
        transformers.append(("numeric", numeric_pipeline, numeric_features))

    preprocessor = ColumnTransformer(transformers=transformers)
    classifier = RandomForestClassifier(
        n_estimators=300,
        class_weight="balanced",
        random_state=RANDOM_STATE,
        n_jobs=-1,
    )
    return Pipeline(
        steps=[("preprocessor", preprocessor), ("classifier", classifier)]
    )


def main() -> None:
    if not DATA_PATH.is_file():
        raise FileNotFoundError(
            f"Processed data not found at {DATA_PATH}. Run src/preprocess.py first."
        )

    cases = pd.read_parquet(DATA_PATH)
    if TARGET not in cases.columns:
        raise ValueError(f"Training data is missing target column {TARGET!r}.")

    categorical_candidates = ("court_name", "case_type")
    numeric_candidates = ("case_year", "case_duration_days")
    categorical_features = [
        column for column in categorical_candidates if column in cases.columns
    ]
    numeric_features = [
        column for column in numeric_candidates if column in cases.columns
    ]
    feature_names = categorical_features + numeric_features
    if not feature_names:
        raise ValueError("No supported structured features are present in the data.")

    labels = cases[TARGET].astype("string").str.strip().str.upper()
    valid_target = labels.notna() & labels.ne("")
    features = cases.loc[valid_target, feature_names].copy()
    labels = labels.loc[valid_target]
    for column in categorical_features:
        features[column] = features[column].astype(object).where(
            features[column].notna(), np.nan
        )
    for column in numeric_features:
        features[column] = pd.to_numeric(features[column], errors="coerce").astype(
            float
        )
    if labels.nunique() < 2 or labels.value_counts().min() < 2:
        raise ValueError(
            "At least two disposition classes with two or more rows each are "
            "required for a stratified train-test split."
        )

    x_train, x_test, y_train, y_test = train_test_split(
        features,
        labels,
        test_size=0.2,
        random_state=RANDOM_STATE,
        stratify=labels,
    )
    pipeline = build_pipeline(categorical_features, numeric_features)
    pipeline.fit(x_train, y_train)
    predictions = pipeline.predict(x_test)

    metrics = {
        "accuracy": float(accuracy_score(y_test, predictions)),
        "macro_f1": float(f1_score(y_test, predictions, average="macro", zero_division=0)),
        "weighted_f1": float(
            f1_score(y_test, predictions, average="weighted", zero_division=0)
        ),
        "classification_report": classification_report(
            y_test, predictions, zero_division=0, output_dict=True
        ),
    }
    transformed_feature_names = (
        pipeline.named_steps["preprocessor"].get_feature_names_out().tolist()
    )

    ML_DIR.joinpath("models").mkdir(parents=True, exist_ok=True)
    TEST_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, MODEL_PATH)
    pd.concat(
        [
            x_test.reset_index(drop=True),
            y_test.rename(TARGET).reset_index(drop=True),
        ],
        axis=1,
    ).to_parquet(TEST_DATA_PATH, index=False)

    metadata = {
        "feature_names": feature_names,
        "transformed_feature_names": transformed_feature_names,
        "label_classes": pipeline.named_steps["classifier"].classes_.tolist(),
        "training_date": datetime.now(timezone.utc).isoformat(),
        "training_rows": int(len(x_train)),
        "test_rows": int(len(x_test)),
        "random_state": RANDOM_STATE,
        "metrics": metrics,
    }
    METADATA_PATH.write_text(json.dumps(metadata, indent=2), encoding="utf-8")

    print(f"Training rows: {len(x_train):,}; test rows: {len(x_test):,}")
    print(f"Features: {feature_names}")
    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Macro F1: {metrics['macro_f1']:.4f}")
    print(f"Weighted F1: {metrics['weighted_f1']:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, predictions, zero_division=0))
    from sklearn.metrics import confusion_matrix

    print("Confusion matrix (class order: " + ", ".join(metadata["label_classes"]) + ")")
    print(confusion_matrix(y_test, predictions, labels=metadata["label_classes"]))
    print(f"Saved pipeline to {MODEL_PATH}")
    print(f"Saved metadata to {METADATA_PATH}")
    print(f"Saved held-out test data to {TEST_DATA_PATH}")


if __name__ == "__main__":
    main()
