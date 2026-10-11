from fastapi import FastAPI
from fastapi.testclient import TestClient
import pytest
from datetime import datetime, timezone

from ml.src.api import router


class FakeCursor:
    def __init__(self) -> None:
        self.executed: list[tuple[str, tuple[object, ...] | None]] = []

    def execute(
        self, query: str, parameters: tuple[object, ...] | None = None
    ) -> None:
        self.executed.append((query, parameters))

    def fetchone(self) -> tuple[str]:
        return ("case-id",)

    def fetchall(self) -> list[tuple[object, ...]]:
        return [
            (
                7,
                "DISPOSED",
                0.75,
                "Review final order and determine follow-up",
                "DocketIQ is not legal advice.",
                datetime(2025, 1, 1, tzinfo=timezone.utc),
            )
        ]

    def close(self) -> None:
        pass


class FakeConnection:
    def __init__(self) -> None:
        self.fake_cursor = FakeCursor()
        self.committed = False
        self.rolled_back = False
        self.closed = False

    def cursor(self) -> FakeCursor:
        return self.fake_cursor

    def commit(self) -> None:
        self.committed = True

    def rollback(self) -> None:
        self.rolled_back = True

    def close(self) -> None:
        self.closed = True


@pytest.fixture
def client() -> TestClient:
    app = FastAPI()
    app.include_router(router)
    return TestClient(app)


def test_successful_prediction_returns_expected_response(client: TestClient) -> None:
    response = client.post(
        "/api/ml/predict-disposition",
        json={
            "court_name": "Patna High Court",
            "case_type": "CR. MISC.",
            "registration_date": "2020-01-13",
        },
    )

    assert response.status_code == 200
    result = response.json()
    assert set(result) == {
        "predicted_disposition",
        "confidence",
        "recommended_action",
        "client_facing_update",
    }
    assert isinstance(result["predicted_disposition"], str)
    assert 0 <= result["confidence"] <= 1
    assert isinstance(result["recommended_action"], str)
    assert "DocketIQ is not legal advice." in result["client_facing_update"]


def test_missing_case_metadata_returns_validation_error(client: TestClient) -> None:
    response = client.post("/api/ml/predict-disposition", json={})

    assert response.status_code == 422
    assert response.json()["detail"]


@pytest.mark.parametrize(
    "invalid_date",
    ["not-a-date", "2020-02-30", "13/01/2020"],
)
def test_invalid_registration_date_is_rejected(
    client: TestClient, invalid_date: str
) -> None:
    response = client.post(
        "/api/ml/predict-disposition",
        json={"registration_date": invalid_date},
    )

    assert response.status_code == 422
    assert any(
        error["loc"][-1] == "registration_date"
        for error in response.json()["detail"]
    )


def test_unknown_category_values_are_accepted(client: TestClient) -> None:
    response = client.post(
        "/api/ml/predict-disposition",
        json={
            "court_name": "Unseen Example Court",
            "case_type": "UNSEEN/99/2026",
            "case_year": 2026,
        },
    )

    assert response.status_code == 200, response.text


def test_invalid_input_returns_structured_error(client: TestClient) -> None:
    response = client.post(
        "/api/ml/predict-disposition",
        json={"court_name": "Patna High Court", "unexpected_field": "not allowed"},
    )

    assert response.status_code == 422
    assert isinstance(response.json()["detail"], list)


def test_prediction_with_case_identity_is_saved(client: TestClient) -> None:
    connection = FakeConnection()
    client.app.state.db_connect = lambda: connection

    response = client.post(
        "/api/ml/predict-disposition",
        json={
            "case_reference": "DIQ-DEMO-001",
            "case_title": "Fictional demo case",
            "court_name": "Patna High Court",
            "case_type": "CR. MISC.",
            "case_year": 2025,
            "jurisdiction": "Bihar",
        },
    )

    assert response.status_code == 200, response.text
    assert connection.committed
    assert not connection.rolled_back
    assert connection.closed
    assert len(connection.fake_cursor.executed) == 2
    assert "INSERT INTO ml_prediction_history" in connection.fake_cursor.executed[1][0]


def test_prediction_history_is_returned(client: TestClient) -> None:
    connection = FakeConnection()
    client.app.state.db_connect = lambda: connection

    response = client.get("/api/ml/cases/DIQ-DEMO-001/history")

    assert response.status_code == 200, response.text
    body = response.json()
    assert body["case_reference"] == "DIQ-DEMO-001"
    assert body["history"][0]["predicted_disposition"] == "DISPOSED"
    assert body["history"][0]["prediction_id"] == 7
