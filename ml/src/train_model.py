import json
import re
from datetime import datetime, timezone
from pathlib import Path

import joblib
import numpy as np
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.impute import SimpleImputer
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)
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
DOCKET_PATTERN = re.compile(
    r"^\s*(?P<case_type>[A-Z][A-Z.\s&-]*?)/\s*"
    r"(?P<case_serial>\d+)/\s*(?P<case_year>\d{4})\s*$",
    re.IGNORECASE,
)


def prepare_features(cases: pd.DataFrame) -> tuple[pd.DataFrame, list[str], list[str]]:
    cases = cases.copy()

    if "case_duration_days" not in cases.columns:
        registration_column = next(
            (
                name
                for name in ("registration_date_clean", "registration_date")
                if name in cases.columns
            ),
            None,
        )
        decision_column = next(
            (
                name
                for name in ("decision_date_clean", "decision_date")
                if name in cases.columns
            ),
            None,
        )
        if registration_column and decision_column:
            registration = pd.to_datetime(
                cases[registration_column], errors="coerce"
            )
            decision = pd.to_datetime(cases[decision_column], errors="coerce")
            duration = (decision - registration).dt.days
            cases["case_duration_days"] = duration.where(duration.ge(0))
            print(
                "Created case_duration_days from "
                f"{registration_column} and {decision_column}; negative or invalid "
                "durations are treated as missing."
            )
        else:
            print(
                "Excluded case_duration_days: the processed data does not contain "
                "both registration and decision date columns."
            )

    if "case_type" not in cases.columns:
        if "docket_number" not in cases.columns:
            print(
                "Excluded case_type: neither a case_type column nor docket_number "
                "is available."
            )
        else:
            docket_parts = cases["docket_number"].astype("string").str.extract(
                DOCKET_PATTERN
            )
            parsed_case_type = docket_parts["case_type"].str.strip()
            if parsed_case_type.notna().any():
                cases["case_type"] = parsed_case_type
                print(
                    "Parsed case_type from docket_number for "
                    f"{int(parsed_case_type.notna().sum()):,} rows."
                )
            else:
                print(
                    "Excluded case_type: docket_number is present, but no values "
                    "match the supported case-type/serial/year format."
                )

    categorical_features = [
        column
        for column in ("court_name", "case_type")
        if column in cases.columns and cases[column].notna().any()
    ]
    numeric_features = [
        column
        for column in ("case_year", "case_duration_days")
        if column in cases.columns
        and pd.to_numeric(cases[column], errors="coerce").notna().any()
    ]
    feature_names = categorical_features + numeric_features
    if not feature_names:
        raise ValueError("No supported structured features are available to train on.")

    features = cases.loc[:, feature_names].copy()
    for column in categorical_features:
        features[column] = features[column].astype(object).where(
            features[column].notna(), np.nan
        )
    for column in numeric_features:
        features[column] = pd.to_numeric(features[column], errors="coerce").astype(
            float
        )
    return features, categorical_features, numeric_features


def build_pipeline(categorical_features: list[str], numeric_features: list[str]) -> Pipeline:
    transformers = []
    if categorical_features:
        categorical_pipeline = Pipeline(
            steps=[
                (
                    "imputer",
                    SimpleImputer(
                        strategy="constant", fill_value="Unknown"
                    ),
                ),
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
                (
                    "imputer",
                    SimpleImputer(strategy="median", keep_empty_features=True),
                ),
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

    labels = cases[TARGET].astype("string").str.strip().str.upper()
    valid_target = labels.notna() & labels.ne("")
    labels = labels.loc[valid_target]
    features, categorical_features, numeric_features = prepare_features(
        cases.loc[valid_target]
    )
    feature_names = features.columns.tolist()
    if labels.nunique() < 2 or labels.value_counts().min() < 2:
        raise ValueError(
            "At least two disposition classes with two or more rows each are "
            "required for a stratified train-test split."
        )

    class_distribution = labels.value_counts().sort_index()
    print("Class distribution before training:")
    print(class_distribution.to_string())

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
    label_classes = pipeline.named_steps["classifier"].classes_.tolist()

    metrics = {
        "accuracy": float(accuracy_score(y_test, predictions)),
        "macro_f1": float(f1_score(y_test, predictions, average="macro", zero_division=0)),
        "weighted_f1": float(
            f1_score(y_test, predictions, average="weighted", zero_division=0)
        ),
        "classification_report": classification_report(
            y_test,
            predictions,
            labels=label_classes,
            zero_division=0,
            output_dict=True,
        ),
        "confusion_matrix": confusion_matrix(
            y_test, predictions, labels=label_classes
        ).tolist(),
        "confusion_matrix_labels": label_classes,
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
        "label_classes": label_classes,
        "class_distribution": {
            str(label): int(count) for label, count in class_distribution.items()
        },
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
    print("Confusion matrix (class order: " + ", ".join(metadata["label_classes"]) + ")")
    print(metrics["confusion_matrix"])
    print(f"Saved pipeline to {MODEL_PATH}")
    print(f"Saved metadata to {METADATA_PATH}")
    print(f"Saved held-out test data to {TEST_DATA_PATH}")


if __name__ == "__main__":
    main()
