from fastapi import FastAPI, HTTPException
import psycopg2
import os
from ml.src.api import router as ml_prediction_router

app = FastAPI(
    title="CaseCompass API",
    description=(
        "Organizes supplied legal-case records into a source-linked timeline. "
        "Does not provide legal advice or predict outcomes."
    )
)
app.include_router(ml_prediction_router)

DB = {
    "dbname": "casecompass_db",
    "user": "casecompass_user",
    "password": os.environ.get("DOCKETIQ_DB_PASSWORD"),
    "host": "localhost",
    "port": "5432"
}

def get_cursor():
    conn = psycopg2.connect(**DB)
    return conn, conn.cursor()

app.state.db_connect = lambda: psycopg2.connect(**DB)

@app.get("/")
def home():
    return {
        "product": "CaseCompass",
        "message": (
            "CaseCompass organizes supplied case records. "
            "It does not provide legal advice, predict outcomes, "
            "or calculate deadlines unless the user supplies a rule."
        )
    }

@app.get("/cases/{case_reference}/timeline")
def get_timeline(case_reference: str):
    conn, cur = get_cursor()

    cur.execute("""
        SELECT
            ce.title,
            ce.event_type,
            COALESCE(ce.event_date::TEXT, ce.event_date_raw) AS date_shown,
            ce.date_confidence,
            d.title AS source_document,
            ss.source_text AS evidence
        FROM case_events ce
        JOIN event_assertions ea
            ON ea.event_id = ce.event_id
           AND ea.review_status = 'confirmed'
        JOIN source_spans ss
            ON ss.source_span_id = ea.source_span_id
        JOIN documents d
            ON d.document_id = ss.document_id
        WHERE ce.case_id = (
            SELECT case_id FROM cases WHERE case_reference = %s
        )
        ORDER BY ce.event_date NULLS LAST;
    """, (case_reference,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No timeline events found")

    return {
        "case_reference": case_reference,
        "timeline": [
            {
                "event": row[0],
                "event_type": row[1],
                "date": row[2],
                "date_confidence": row[3],
                "source_document": row[4],
                "evidence": row[5]
            }
            for row in rows
        ]
    }

@app.get("/cases/{case_reference}/deadlines")
def get_deadlines(case_reference: str):
    conn, cur = get_cursor()

    cur.execute("""
        SELECT
            cd.title,
            cd.action_required,
            COALESCE(cd.due_date::TEXT, cd.due_date_raw) AS due_date_shown,
            cd.date_confidence,
            d.title AS source_document,
            ss.source_text AS exact_source_sentence
        FROM case_deadlines cd
        JOIN deadline_assertions da
            ON da.deadline_id = cd.deadline_id
           AND da.review_status = 'confirmed'
        JOIN source_spans ss
            ON ss.source_span_id = da.source_span_id
        JOIN documents d
            ON d.document_id = ss.document_id
        WHERE cd.case_id = (
            SELECT case_id FROM cases WHERE case_reference = %s
        )
        ORDER BY cd.due_date NULLS LAST;
    """, (case_reference,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    if not rows:
        raise HTTPException(status_code=404, detail="No explicit deadlines found")

    return {
        "case_reference": case_reference,
        "deadlines": [
            {
                "deadline": row[0],
                "action_required": row[1],
                "due_date": row[2],
                "date_confidence": row[3],
                "source_document": row[4],
                "exact_source_sentence": row[5]
            }
            for row in rows
        ]
    }

@app.get("/cases/{case_reference}/gaps")
def get_gaps(case_reference: str):
    conn, cur = get_cursor()

    cur.execute("""
        SELECT
            tg.gap_type,
            tg.gap_description,
            tg.severity,
            tg.status,
            d.title AS source_document
        FROM timeline_gaps tg
        JOIN cases c ON c.case_id = tg.case_id
        LEFT JOIN documents d
            ON d.document_id = tg.related_document_id
        WHERE c.case_reference = %s
        ORDER BY tg.created_at DESC;
    """, (case_reference,))

    rows = cur.fetchall()
    cur.close()
    conn.close()

    return {
        "case_reference": case_reference,
        "gaps": [
            {
                "gap_type": row[0],
                "description": row[1],
                "severity": row[2],
                "status": row[3],
                "source_document": row[4]
            }
            for row in rows
        ]
    }

from pydantic import BaseModel
from typing import Optional
from datetime import date

class AddRecordRequest(BaseModel):
    case_reference: str
    document_title: str
    document_date: Optional[date] = None
    document_date_raw: Optional[str] = None

    event_title: str
    event_type: str = "filing"
    event_date: Optional[date] = None
    event_date_raw: Optional[str] = None

    source_sentence: str

    deadline_title: Optional[str] = None
    action_required: Optional[str] = None
    due_date: Optional[date] = None
    due_date_raw: Optional[str] = None


@app.post("/demo/add-record")
def add_record(data: AddRecordRequest):
    conn, cur = get_cursor()

    try:
        cur.execute("""
            SELECT case_id
            FROM cases
            WHERE case_reference = %s;
        """, (data.case_reference,))

        case_row = cur.fetchone()

        if not case_row:
            raise HTTPException(
                status_code=404,
                detail="Case reference was not found."
            )

        case_id = case_row[0]

        cur.execute("""
            INSERT INTO documents (
                case_id, document_type, title,
                document_date_raw, document_date,
                date_confidence, status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            RETURNING document_id;
        """, (
            case_id,
            "user_supplied_record",
            data.document_title,
            data.document_date_raw,
            data.document_date,
            "high" if data.document_date else "unparsed",
            "processed"
        ))
        document_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO document_pages (
                document_id, page_number, page_text
            )
            VALUES (%s, %s, %s)
            RETURNING page_id;
        """, (
            document_id,
            1,
            data.source_sentence
        ))
        page_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO source_spans (
                document_id, page_id, start_offset,
                end_offset, source_text, extraction_method
            )
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING source_span_id;
        """, (
            document_id,
            page_id,
            0,
            len(data.source_sentence),
            data.source_sentence,
            "manual"
        ))
        source_span_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO case_events (
                case_id, event_type, title,
                event_date, event_date_raw,
                date_confidence, review_status, created_by
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING event_id;
        """, (
            case_id,
            data.event_type,
            data.event_title,
            data.event_date,
            data.event_date_raw,
            "high" if data.event_date else "unparsed",
            "confirmed",
            "user"
        ))
        event_id = cur.fetchone()[0]

        cur.execute("""
            INSERT INTO event_assertions (
                case_id, event_id, document_id, source_span_id,
                asserted_event, asserted_date_raw, asserted_date,
                date_confidence, assertion_role,
                ai_generated, review_status
            )
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s);
        """, (
            case_id,
            event_id,
            document_id,
            source_span_id,
            data.event_title,
            data.event_date_raw,
            data.event_date,
            "high" if data.event_date else "unparsed",
            "primary",
            False,
            "confirmed"
        ))

        deadline_id = None

        if (
            data.deadline_title
            and data.action_required
            and (data.due_date or data.due_date_raw)
        ):
            cur.execute("""
                INSERT INTO case_deadlines (
                    case_id, event_id, title, action_required,
                    due_date_raw, due_date, date_confidence,
                    deadline_basis, review_status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                RETURNING deadline_id;
            """, (
                case_id,
                event_id,
                data.deadline_title,
                data.action_required,
                data.due_date_raw,
                data.due_date,
                "high" if data.due_date else "unparsed",
                "explicit_in_record",
                "confirmed"
            ))
            deadline_id = cur.fetchone()[0]

            cur.execute("""
                INSERT INTO deadline_assertions (
                    deadline_id, document_id, source_span_id,
                    stated_due_date_raw, stated_due_date,
                    date_confidence, ai_generated, review_status
                )
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s);
            """, (
                deadline_id,
                document_id,
                source_span_id,
                data.due_date_raw or str(data.due_date),
                data.due_date,
                "high" if data.due_date else "unparsed",
                False,
                "confirmed"
            ))

        conn.commit()

        return {
            "message": "Record added with source-linked evidence.",
            "case_reference": data.case_reference,
            "document_id": str(document_id),
            "event_id": str(event_id),
            "deadline_id": str(deadline_id) if deadline_id else None,
            "notice": (
                "CaseCompass organized the supplied record. "
                "It did not infer a date or deadline that was not supplied."
            )
        }

    except HTTPException:
        conn.rollback()
        raise

    except Exception as error:
        conn.rollback()
        raise HTTPException(status_code=500, detail=str(error))

    finally:
        cur.close()
        conn.close()