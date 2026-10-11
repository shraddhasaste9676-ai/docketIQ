from pathlib import Path

import pandas as pd
from datasets import load_dataset


DATASET_NAME = "KanoonGPT/indian-case-laws"
SPLIT = "train"
ROW_LIMIT = 10_000
OUTPUT_PATH = (
    Path(__file__).resolve().parents[1]
    / "data"
    / "raw"
    / "cases_sample.parquet"
)


def main() -> None:
    dataset = load_dataset(DATASET_NAME, split=SPLIT, streaming=True)
    cases = pd.DataFrame(list(dataset.take(ROW_LIMIT)))

    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    cases.to_parquet(OUTPUT_PATH, index=False)

    print(f"Loaded up to {ROW_LIMIT:,} rows from {SPLIT} (streaming)")
    print(f"Saved Parquet file: {OUTPUT_PATH}")
    print(f"\nShape:\n{cases.shape}")
    print(f"\nColumn names:\n{cases.columns.tolist()}")
    print(f"\nData types:\n{cases.dtypes.to_string()}")
    print(f"\nMissing values:\n{cases.isna().sum().to_string()}")
    print(f"\nFive sample rows:\n{cases.head().to_string(index=False)}")


if __name__ == "__main__":
    main()
