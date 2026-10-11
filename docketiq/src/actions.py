def get_next_action(disposition):
    mapping = {
        "BAIL GRANTED": "Review bail conditions and prepare compliance checklist",
        "DISMISSED": "Evaluate appeal options and limitation period",
        "ALLOWED": "Prepare execution or compliance follow-up",
        "WITHDRAWN": "Close matter and notify client",
        "DISPOSED": "Review final order and determine follow-up"
    }

    return mapping.get(disposition, "Manual legal review required")

def add_actions(events):
    events["recommended_action"] = events["event_description"].apply(
        lambda x: get_next_action(x.split(" - ")[-1]) if " - " in x else "Manual legal review required"
    )

    events.to_parquet("data/processed/case_actions.parquet", index=False)
    return events