from typing import Any


ACTION_BY_DISPOSITION = {
    "BAIL GRANTED": "Review bail conditions and prepare compliance checklist",
    "DISMISSED": "Evaluate appeal options and limitation period",
    "ALLOWED": "Prepare execution or compliance follow-up",
    "WITHDRAWN": "Close matter and notify client",
    "DISPOSED": "Review final order and determine follow-up",
}


def build_recommendation(predicted_disposition: str, confidence: float) -> dict[str, Any]:
    action = ACTION_BY_DISPOSITION.get(
        predicted_disposition, "Manual legal review required"
    )
    update = (
        f"DocketIQ predicts the disposition may be {predicted_disposition} "
        f"({confidence:.0%} model confidence). This is an automated estimate. "
        "DocketIQ is not legal advice."
    )
    return {
        "predicted_disposition": predicted_disposition,
        "confidence": confidence,
        "recommended_action": action,
        "client_facing_update": update,
    }
