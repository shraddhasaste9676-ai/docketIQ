import pandas as pd

def build_events(df):
    events = []

    for _, row in df.iterrows():
        case_id = row.get("case_metadata_id")

        if pd.notna(row.get("registration_date_clean")):
            events.append({
                "case_id": case_id,
                "event_date": row["registration_date_clean"],
                "event_type": "case_registered",
                "event_description": "Case registered",
                "source": "KanoonGPT case metadata"
            })

        if pd.notna(row.get("decision_date_clean")):
            events.append({
                "case_id": case_id,
                "event_date": row["decision_date_clean"],
                "event_type": "judgment",
                "event_description": f"Judgment delivered - {row.get('disposition_text', 'Unknown outcome')}",
                "source": "KanoonGPT case metadata"
            })

    return pd.DataFrame(events)

def build_timeline(df):
    events = build_events(df)
    events = events.sort_values(["case_id", "event_date"])
    events.to_parquet("data/processed/case_events.parquet", index=False)
    print(f"Saved {len(events)} timeline events")
    return events