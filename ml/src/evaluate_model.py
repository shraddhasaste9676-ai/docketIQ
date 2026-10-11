import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    f1_score,
)


ML_DIR = Path(__file__).resolve().parents[1]
TEST_DATA_PATH = ML_DIR / "data" / "processed" / "test_set.parquet"
MODEL_PATH = ML_DIR / "models" / "disposition_model.joblib"
METRICS_PATH = ML_DIR / "models" / "evaluation_metrics.json"
TARGET = "disposition_text"


def main() -> None:
    for path in (MODEL_PATH, TEST_DATA_PATH):
        if not path.is_file():
            raise FileNotFoundError(
                f"Required evaluation file not found: {path}. Run "
                "src/train_model.py first."
            )

    pipeline = joblib.load(MODEL_PATH)
    test_data = pd.read_parquet(TEST_DATA_PATH)
    if TARGET not in test_data.columns:
        raise ValueError(f"Test data is missing target column {TARGET!r}.")

    y_test = test_data[TARGET].astype(str)
    x_test = test_data.drop(columns=[TARGET])
    expected_features = pipeline.named_steps["preprocessor"].feature_names_in_
    missing_features = [name for name in expected_features if name not in x_test]
    if missing_features:
        raise ValueError(f"Test data is missing model features: {missing_features}")
    x_test = x_test.loc[:, expected_features]
    predictions = pipeline.predict(x_test)
    label_classes = pipeline.named_steps["classifier"].classes_.tolist()

    report = classification_report(
        y_test,
        predictions,
        labels=label_classes,
        zero_division=0,
        output_dict=True,
    )
    class_scores = {
        label: report[label]["f1-score"]
        for label in label_classes
        if label in report
    }
    metrics = {
        "accuracy": float(accuracy_score(y_test, predictions)),
        "macro_f1": float(f1_score(y_test, predictions, average="macro", zero_division=0)),
        "weighted_f1": float(
            f1_score(y_test, predictions, average="weighted", zero_division=0)
        ),
        "classification_report": report,
        "confusion_matrix": confusion_matrix(
            y_test, predictions, labels=label_classes
        ).tolist(),
        "confusion_matrix_labels": label_classes,
        "best_performing_disposition": max(class_scores, key=class_scores.get),
        "best_performing_f1": max(class_scores.values()),
        "worst_performing_disposition": min(class_scores, key=class_scores.get),
        "worst_performing_f1": min(class_scores.values()),
        "test_rows": int(len(y_test)),
    }

    print(f"Accuracy: {metrics['accuracy']:.4f}")
    print(f"Macro F1: {metrics['macro_f1']:.4f}")
    print(f"Weighted F1: {metrics['weighted_f1']:.4f}")
    print("\nClassification report:")
    print(classification_report(y_test, predictions, labels=label_classes, zero_division=0))
    print("Confusion matrix (class order: " + ", ".join(label_classes) + ")")
    print(metrics["confusion_matrix"])
    print(
        "Best-performing disposition: "
        f"{metrics['best_performing_disposition']} "
        f"(F1={metrics['best_performing_f1']:.4f})"
    )
    print(
        "Worst-performing disposition: "
        f"{metrics['worst_performing_disposition']} "
        f"(F1={metrics['worst_performing_f1']:.4f})"
    )

    METRICS_PATH.parent.mkdir(parents=True, exist_ok=True)
    METRICS_PATH.write_text(json.dumps(metrics, indent=2), encoding="utf-8")
    print(f"Saved evaluation metrics to {METRICS_PATH}")


if __name__ == "__main__":
    main()
