import json
import os
import sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


DEMO_DIR = Path(__file__).resolve().parent
INPUT_PATH = DEMO_DIR / "demo_data.json"
OUTPUT_PATH = DEMO_DIR / "demo_results.json"
API_URL = os.getenv(
    "DOCKETIQ_API_URL",
    "http://127.0.0.1:8000/api/ml/predict-disposition",
)
TIMEOUT_SECONDS = 30


def request_prediction(case: dict[str, object]) -> dict[str, object]:
    request_body = {
        key: case[key]
        for key in (
            "case_reference",
            "case_title",
            "court_name",
            "case_type",
            "case_year",
            "registration_date",
            "jurisdiction",
        )
        if key in case
    }
    request = Request(
        API_URL,
        data=json.dumps(request_body).encode("utf-8"),
        headers={"Content-Type": "application/json", "Accept": "application/json"},
        method="POST",
    )

    try:
        with urlopen(request, timeout=TIMEOUT_SECONDS) as response:
            response_data = json.loads(response.read().decode("utf-8"))
    except HTTPError as error:
        detail = error.read().decode("utf-8", errors="replace")
        raise RuntimeError(
            f"Prediction API returned HTTP {error.code}: {detail}"
        ) from error
    except URLError as error:
        raise ConnectionError(
            f"Could not connect to {API_URL}. Start the backend and verify "
            "DOCKETIQ_API_URL. Details: {error.reason}"
        ) from error
    except TimeoutError as error:
        raise ConnectionError(
            f"Prediction API at {API_URL} did not respond within "
            f"{TIMEOUT_SECONDS} seconds."
        ) from error

    required_keys = {
        "predicted_disposition",
        "confidence",
        "recommended_action",
        "client_facing_update",
    }
    if not isinstance(response_data, dict) or not required_keys.issubset(response_data):
        raise RuntimeError(
            "Prediction API returned an unexpected response; expected fields: "
            + ", ".join(sorted(required_keys))
        )
    return response_data


def main() -> int:
    try:
        cases = json.loads(INPUT_PATH.read_text(encoding="utf-8"))
        if not isinstance(cases, list) or not cases:
            raise ValueError(f"{INPUT_PATH} must contain a non-empty JSON array.")

        results: list[dict[str, object]] = []
        for case in cases:
            if not isinstance(case, dict):
                raise ValueError("Every demo case must be a JSON object.")

            print(f"\nCase: {case.get('case_reference')} - {case.get('case_title')}")
            prediction = request_prediction(case)
            result = {
                "case_reference": case.get("case_reference"),
                "case_title": case.get("case_title"),
                "expected_disposition_demo_only": case.get("expected_disposition"),
                **prediction,
            }
            results.append(result)
            print(json.dumps(prediction, indent=2, ensure_ascii=False))

        OUTPUT_PATH.write_text(
            json.dumps(results, indent=2, ensure_ascii=False) + "\n",
            encoding="utf-8",
        )
        print(f"\nSaved predictions to {OUTPUT_PATH}")
        print("\nSummary")
        print(f"{'Case reference':<22} {'Prediction':<25} {'Confidence':>10}")
        print("-" * 61)
        for result in results:
            print(
                f"{str(result['case_reference']):<22} "
                f"{str(result['predicted_disposition']):<25} "
                f"{float(result['confidence']):>9.1%}"
            )
        print(
            "\nPredictions are experimental model estimates, not legal advice. "
            "Expected dispositions in the sample file are illustrative only."
        )
        return 0
    except (ConnectionError, RuntimeError, ValueError, json.JSONDecodeError) as error:
        print(f"Demo failed: {error}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
