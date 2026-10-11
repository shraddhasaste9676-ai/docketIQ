from pathlib import Path
import re

import pandas as pd


ML_DIR = Path(__file__).resolve().parents[1]
RAW_PATH = ML_DIR / "data" / "raw" / "cases_sample.parquet"
PROCESSED_PATH = ML_DIR / "data" / "processed" / "cases_clean.parquet"
EARLIEST_DATE = pd.Timestamp("1950-01-01")
LATEST_DATE = pd.Timestamp("2026-12-31")
MIN_LABEL_COUNT = 100

TEXT_COLUMNS = (
    "court_name",
    "party_petitioner",
    "party_respondent",
    "party_caption",
)
DATE_COLUMNS = ("registration_date", "decision_date")
DOCKET_PATTERN = re.compile(
    r"^\s*(?P<case_type>[A-Z][A-Z.\s&-]*?)/\s*"
    r"(?P<case_serial>\d+)/\s*(?P<case_year>\d{4})\s*$"
)


def clean_text(series: pd.Series, *, uppercase: bool = False) -> pd.Series:
    cleaned = series.astype("string").str.replace(r"\s+", " ", regex=True).str.strip()
    cleaned = cleaned.mask(cleaned.eq(""))
    return cleaned.str.upper() if uppercase else cleaned


def preprocess() -> pd.DataFrame:
    if not RAW_PATH.is_file():
        raise FileNotFoundError(
            f"Raw sample not found at {RAW_PATH}. Run src/load_data.py first."
        )

    cases = pd.read_parquet(RAW_PATH)
    print(f"Input Parquet: {RAW_PATH}")
    print(f"Actual schema:\n{cases.dtypes.to_string()}")
    sample_columns = [
        column
        for column in (
            "case_metadata_id",
            "court_name",
            "party_petitioner",
            "party_respondent",
            "docket_number",
            "registration_date",
            "decision_date",
            "disposition_text",
        )
        if column in cases.columns
    ]
    print(f"\nSample rows:\n{cases[sample_columns].head().to_string(index=False)}")

    original_rows = len(cases)

    for column in TEXT_COLUMNS:
        if column in cases.columns:
            cases[column] = clean_text(cases[column])

    if "docket_number" in cases.columns:
        cases["docket_number"] = clean_text(cases["docket_number"], uppercase=True)
        docket_parts = cases["docket_number"].str.extract(DOCKET_PATTERN)
        cases["case_type"] = clean_text(docket_parts["case_type"], uppercase=True)
        cases["case_serial"] = pd.to_numeric(
            docket_parts["case_serial"], errors="coerce"
        ).astype("Int64")
        cases["case_year"] = pd.to_numeric(
            docket_parts["case_year"], errors="coerce"
        ).astype("Int64")

    invalid_date_counts: dict[str, int] = {}
    parsed_dates: dict[str, pd.Series] = {}
    for column in DATE_COLUMNS:
        if column not in cases.columns:
            continue

        raw_dates = cases[column]
        parsed = pd.to_datetime(raw_dates, errors="coerce")
        out_of_range = parsed.notna() & (
            parsed.lt(EARLIEST_DATE) | parsed.gt(LATEST_DATE)
        )
        parse_failed = raw_dates.notna() & parsed.isna()
        invalid = out_of_range | parse_failed
        cases[f"invalid_{column}"] = invalid
        invalid_date_counts[column] = int(invalid.sum())
        parsed_dates[column] = parsed.mask(out_of_range)
        cases[column] = parsed_dates[column]

    if "registration_date" in cases.columns:
        cases = cases.rename(columns={"registration_date": "registration_date_clean"})
    if "decision_date" in cases.columns:
        cases = cases.rename(columns={"decision_date": "decision_date_clean"})

    if {"registration_date_clean", "decision_date_clean"}.issubset(cases.columns):
        duration = (
            cases["decision_date_clean"] - cases["registration_date_clean"]
        ).dt.days
        negative_duration = duration.lt(0).fillna(False)
        cases["negative_case_duration"] = negative_duration
        cases["case_duration_days"] = duration.mask(negative_duration).astype("Int64")

    if "disposition_text" not in cases.columns:
        raise ValueError(
            "Required target column 'disposition_text' is missing from the sample."
        )

    cases["disposition_text"] = clean_text(
        cases["disposition_text"], uppercase=True
    )
    label_counts = cases["disposition_text"].value_counts()
    retained_labels = label_counts[label_counts >= MIN_LABEL_COUNT].index
    before_label_filter = len(cases)
    cases = cases.loc[cases["disposition_text"].isin(retained_labels)].copy()
    dropped_for_label_count = before_label_filter - len(cases)

    PROCESSED_PATH.parent.mkdir(parents=True, exist_ok=True)
    cases.to_parquet(PROCESSED_PATH, index=False)

    print("\nData-quality report")
    print(f"Rows read: {original_rows:,}")
    print(f"Rows retained: {len(cases):,}")
    print(f"Rows dropped (missing or infrequent disposition): {dropped_for_label_count:,}")
    print(f"Distinct disposition labels retained: {cases['disposition_text'].nunique():,}")
    if "case_type" in cases.columns:
        print(f"Docket numbers parsed into case_type: {int(cases['case_type'].notna().sum()):,}")
        print(f"Docket numbers parsed into case_year: {int(cases['case_year'].notna().sum()):,}")
    print(f"Invalid or unparseable dates by column: {invalid_date_counts}")
    if "negative_case_duration" in cases.columns:
        print(
            "Negative registration-to-decision durations: "
            f"{int(cases['negative_case_duration'].sum()):,}"
        )
    print(f"Missing values in retained data:\n{cases.isna().sum().to_string()}")
    print(f"Retained disposition counts:\n{cases['disposition_text'].value_counts().to_string()}")
    print(f"Saved cleaned data to {PROCESSED_PATH}")
    return cases


if __name__ == "__main__":
    preprocess()
