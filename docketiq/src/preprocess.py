import re
import pandas as pd
from datasets import load_dataset

def load_sample(limit=50000):
    ds = load_dataset("KanoonGPT/indian-case-laws", split=f"train[:{limit}]")
    return ds.to_pandas()

def clean_dates(df):
    for col in ["registration_date", "decision_date"]:
        if col in df.columns:
            df[col] = pd.to_datetime(df[col], errors="coerce")

    valid_registration = df["registration_date"].between("1950-01-01", "2026-12-31")
    valid_decision = df["decision_date"].between("1950-01-01", "2026-12-31")

    df["registration_date_clean"] = df["registration_date"].where(valid_registration)
    df["decision_date_clean"] = df["decision_date"].where(valid_decision)
    df["date_quality_flag"] = ~(valid_registration & valid_decision)

    return df

def normalize_text(df):
    text_cols = [
        "case_title", "court_name", "party_petitioner",
        "party_respondent", "disposition_text", "docket_number"
    ]

    for col in text_cols:
        if col in df.columns:
            df[col] = (
                df[col]
                .astype(str)
                .str.replace(r"\s+", " ", regex=True)
                .str.strip()
            )

    if "disposition_text" in df.columns:
        df["disposition_text"] = df["disposition_text"].str.upper()

    return df

def parse_docket(df):
    pattern = r"(?P<case_type>[A-Z.\s&/]+?)/(?P<case_serial>\d+)/(?P<case_year>\d{4})"
    extracted = df["docket_number"].str.extract(pattern)

    df["case_type"] = extracted["case_type"].str.strip()
    df["case_serial"] = pd.to_numeric(extracted["case_serial"], errors="coerce")
    df["case_year"] = pd.to_numeric(extracted["case_year"], errors="coerce")

    return df

def preprocess(limit=50000):
    df = load_sample(limit)
    df = clean_dates(df)
    df = normalize_text(df)
    df = parse_docket(df)

    df.to_parquet("data/processed/cases_clean.parquet", index=False)
    print(f"Saved {len(df)} cleaned cases")
    return df

if __name__ == "__main__":
    preprocess()