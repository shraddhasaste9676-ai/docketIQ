from datetime import date
from typing import Annotated, Any

from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel, ConfigDict, Field, model_validator

from .predict import predict_disposition


router = APIRouter(prefix="/api/ml", tags=["ML predictions"])


class DispositionPredictionRequest(BaseModel):
    model_config = ConfigDict(extra="forbid", str_strip_whitespace=True)

    court_name: Annotated[str | None, Field(max_length=300)] = None
    case_type: Annotated[str | None, Field(max_length=100)] = None
    case_year: Annotated[int | None, Field(ge=1500, le=2100)] = None
    case_duration_days: Annotated[int | None, Field(ge=0, le=100_000)] = None
    registration_date: date | None = None
    case_reference: Annotated[str | None, Field(max_length=120)] = None
    case_title: Annotated[str | None, Field(max_length=500)] = None
    jurisdiction: Annotated[str | None, Field(max_length=200)] = None

    @model_validator(mode="after")
    def require_case_feature(self) -> "DispositionPredictionRequest":
        if not any(
            value is not None and value != ""
            for value in self.model_dump().values()
        ):
            raise ValueError("Provide at least one non-empty case feature.")
        return self


class DispositionPredictionResponse(BaseModel):
    predicted_disposition: str
    confidence: float
    recommended_action: str
    client_facing_update: str


@router.post("/predict-disposition")
def predict_case_disposition(
    case: DispositionPredictionRequest,
    request: Request,
) -> DispositionPredictionResponse:
    try:
        case_metadata = case.model_dump(
            exclude={
                "registration_date",
                "case_reference",
                "case_title",
                "jurisdiction",
            },
            exclude_none=True,
        )
        if case.case_year is None and case.registration_date is not None:
            case_metadata["case_year"] = case.registration_date.year
        prediction = predict_disposition(case_metadata)
        response = DispositionPredictionResponse(
            predicted_disposition=prediction["predicted_disposition"],
            confidence=prediction["confidence"],
            recommended_action=prediction["recommended_action"],
            client_facing_update=prediction["client_facing_update"],
        )
        if case.case_reference:
            _save_prediction(request, case, response)
        return response
    except FileNotFoundError as error:
        raise HTTPException(
            status_code=503,
            detail="Disposition model is unavailable. Train or install the model first.",
        ) from error
    except ValueError as error:
        raise HTTPException(status_code=422, detail=str(error)) from error


def _save_prediction(
    request: Request,
    case: DispositionPredictionRequest,
    prediction: DispositionPredictionResponse,
) -> None:
    db_connect = getattr(request.app.state, "db_connect", None)
    if not callable(db_connect):
        raise HTTPException(
            status_code=503,
            detail="Database persistence is unavailable in this backend configuration.",
        )
    if not case.case_title:
        raise HTTPException(
            status_code=422,
            detail="case_title is required when case_reference is provided.",
        )

    connection = None
    cursor = None
    try:
        connection = db_connect()
        cursor = connection.cursor()
        cursor.execute(
            """
            INSERT INTO cases (case_reference, title, jurisdiction, court_or_tribunal)
            VALUES (%s, %s, %s, %s)
            ON CONFLICT (case_reference) DO UPDATE SET
                title = EXCLUDED.title,
                jurisdiction = COALESCE(EXCLUDED.jurisdiction, cases.jurisdiction),
                court_or_tribunal = EXCLUDED.court_or_tribunal,
                updated_at = now()
            RETURNING case_id;
            """,
            (
                case.case_reference,
                case.case_title,
                case.jurisdiction,
                case.court_name,
            ),
        )
        case_id = cursor.fetchone()[0]
        cursor.execute(
            """
            INSERT INTO ml_prediction_history (
                case_id,
                predicted_disposition,
                confidence,
                recommended_action,
                client_facing_update
            )
            VALUES (%s, %s, %s, %s, %s);
            """,
            (
                case_id,
                prediction.predicted_disposition,
                prediction.confidence,
                prediction.recommended_action,
                prediction.client_facing_update,
            ),
        )
        connection.commit()
    except HTTPException:
        if connection is not None:
            connection.rollback()
        raise
    except Exception as error:
        if connection is not None:
            connection.rollback()
        raise HTTPException(
            status_code=503,
            detail=(
                "Prediction could not be saved. Apply "
                "demo/ml_prediction_history.sql and verify the database connection."
            ),
        ) from error
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()


@router.get("/cases/{case_reference}/history")
def get_prediction_history(case_reference: str, request: Request) -> dict[str, Any]:
    db_connect = getattr(request.app.state, "db_connect", None)
    if not callable(db_connect):
        raise HTTPException(
            status_code=503,
            detail="Database history is unavailable in this backend configuration.",
        )

    connection = None
    cursor = None
    try:
        connection = db_connect()
        cursor = connection.cursor()
        cursor.execute(
            """
            SELECT h.prediction_id, h.predicted_disposition, h.confidence,
                   h.recommended_action, h.client_facing_update, h.created_at
            FROM ml_prediction_history AS h
            JOIN cases AS c ON c.case_id = h.case_id
            WHERE c.case_reference = %s
            ORDER BY h.created_at DESC, h.prediction_id DESC;
            """,
            (case_reference,),
        )
        history = [
            {
                "prediction_id": row[0],
                "predicted_disposition": row[1],
                "confidence": row[2],
                "recommended_action": row[3],
                "client_facing_update": row[4],
                "created_at": row[5],
            }
            for row in cursor.fetchall()
        ]
        return {"case_reference": case_reference, "history": history}
    except Exception as error:
        raise HTTPException(
            status_code=503,
            detail="Could not load prediction history from the database.",
        ) from error
    finally:
        if cursor is not None:
            cursor.close()
        if connection is not None:
            connection.close()
