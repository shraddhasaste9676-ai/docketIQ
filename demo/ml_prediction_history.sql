CREATE TABLE IF NOT EXISTS ml_prediction_history (
    prediction_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    case_id UUID NOT NULL REFERENCES cases(case_id) ON DELETE CASCADE,
    predicted_disposition TEXT NOT NULL,
    confidence DOUBLE PRECISION NOT NULL
        CHECK (confidence >= 0.0 AND confidence <= 1.0),
    recommended_action TEXT NOT NULL,
    client_facing_update TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ml_prediction_history_case_created
    ON ml_prediction_history (case_id, created_at DESC);
