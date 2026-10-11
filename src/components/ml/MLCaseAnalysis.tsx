import { useEffect, useState } from 'react';
import demoData from '../../../demo/demo_data.json';

type DemoTimelineEvent = {
  event_date: string;
  event_type: string;
  title: string;
  description: string;
};

type DemoCase = {
  case_reference: string;
  case_title: string;
  court_name: string;
  case_type: string;
  case_year: number;
  registration_date: string;
  jurisdiction: string;
  timeline_events: DemoTimelineEvent[];
};

type Prediction = {
  predicted_disposition: string;
  confidence: number;
  recommended_action: string;
  client_facing_update: string;
};

type PredictionHistory = Prediction & {
  prediction_id: number;
  created_at: string;
};

const demoCases = demoData as DemoCase[];
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '';

async function readError(response: Response): Promise<string> {
  const body: unknown = await response.json().catch(() => null);
  if (
    typeof body === 'object' &&
    body !== null &&
    'detail' in body
  ) {
    const detail = body.detail;
    return typeof detail === 'string' ? detail : JSON.stringify(detail);
  }
  return `Request failed with HTTP ${response.status}.`;
}

export function MLCaseAnalysis() {
  const [selectedReference, setSelectedReference] = useState(demoCases[0].case_reference);
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [history, setHistory] = useState<PredictionHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const selectedCase = demoCases.find(
    (demoCase) => demoCase.case_reference === selectedReference,
  ) ?? demoCases[0];

  useEffect(() => {
    let active = true;

    fetch(
      `${API_BASE_URL}/api/ml/cases/${encodeURIComponent(selectedCase.case_reference)}/history`,
    )
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(await readError(response));
        }
        return response.json() as Promise<{ history: PredictionHistory[] }>;
      })
      .then((result) => {
        if (active) setHistory(result.history);
      })
      .catch((requestError: unknown) => {
        if (active) {
          setHistory([]);
          setHistoryError(
            requestError instanceof Error
              ? requestError.message
              : 'Could not load saved prediction history.',
          );
        }
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [selectedCase.case_reference]);

  async function runAnalysis() {
    setLoading(true);
    setError(null);
    setPrediction(null);
    try {
      const response = await fetch(`${API_BASE_URL}/api/ml/predict-disposition`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          case_reference: selectedCase.case_reference,
          case_title: selectedCase.case_title,
          court_name: selectedCase.court_name,
          case_type: selectedCase.case_type,
          case_year: selectedCase.case_year,
          registration_date: selectedCase.registration_date,
          jurisdiction: selectedCase.jurisdiction,
        }),
      });
      if (!response.ok) {
        throw new Error(await readError(response));
      }
      const result = await response.json() as Prediction;
      setPrediction(result);
    } catch (requestError: unknown) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'The prediction request failed.',
      );
      setLoading(false);
      return;
    }

    try {
      const historyResponse = await fetch(
        `${API_BASE_URL}/api/ml/cases/${encodeURIComponent(selectedCase.case_reference)}/history`,
      );
      if (!historyResponse.ok) {
        throw new Error(await readError(historyResponse));
      }
      const historyResult = await historyResponse.json() as {
        history: PredictionHistory[];
      };
      setHistory(historyResult.history);
      setHistoryError(null);
    } catch (requestError: unknown) {
      setHistoryError(
        requestError instanceof Error
          ? requestError.message
          : 'Could not refresh saved prediction history.',
      );
    }
    setLoading(false);
  }

  return (
    <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900">AI Case Analysis</h2>
          <p className="mt-1 text-xs text-slate-600">
            Run an experimental disposition estimate for a fictional demo case.
          </p>
        </div>
        <label className="text-xs font-semibold text-slate-700">
          Select demo case
          <select
            value={selectedCase.case_reference}
            disabled={loading}
            onChange={(event) => {
              setSelectedReference(event.target.value);
              setError(null);
              setHistory([]);
              setHistoryLoading(true);
              setHistoryError(null);
              setPrediction(null);
            }}
            className="mt-1 block w-full rounded border border-slate-300 bg-white px-3 py-2 font-normal"
          >
            {demoCases.map((demoCase) => (
              <option key={demoCase.case_reference} value={demoCase.case_reference}>
                {demoCase.case_reference} — {demoCase.case_title}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="rounded border border-slate-200 bg-slate-50 p-4">
          <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
            Fictional case timeline
          </h3>
          <p className="mt-1 text-xs text-slate-600">
            {selectedCase.case_title} · {selectedCase.court_name} · {selectedCase.case_type}
          </p>
          <ol className="mt-3 space-y-3 border-l border-slate-300 pl-4">
            {selectedCase.timeline_events.map((event) => (
              <li key={`${event.event_date}-${event.event_type}`} className="relative">
                <span className="absolute -left-[21px] top-1 h-2 w-2 rounded-full bg-blue-700" />
                <p className="text-xs font-semibold text-slate-900">
                  {event.title}
                  <span className="ml-2 font-normal text-slate-500">{event.event_date}</span>
                </p>
                <p className="text-xs text-slate-600">{event.description}</p>
              </li>
            ))}
          </ol>
          <p className="mt-3 text-[11px] text-amber-800">
            These sample events are fictional and are not verified court records.
          </p>
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={runAnalysis}
            disabled={loading}
            className="rounded bg-[#0F2547] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-[#1E3A8A] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? 'Analyzing case…' : 'Run AI Case Analysis'}
          </button>

          {error && (
            <p role="alert" className="rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              {error}
            </p>
          )}

          {prediction && (
            <div className="space-y-2 rounded border border-blue-200 bg-blue-50/50 p-4 text-sm">
              <p className="text-xs font-bold uppercase tracking-wide text-blue-900">
                Model estimate · {prediction.confidence.toLocaleString(undefined, {
                  style: 'percent',
                  maximumFractionDigits: 1,
                })} confidence
              </p>
              <p className="font-semibold text-slate-900">
                Predicted disposition: {prediction.predicted_disposition}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Recommended next action:</strong> {prediction.recommended_action}
              </p>
              <p className="text-xs text-slate-700">
                <strong>Client-facing update:</strong> {prediction.client_facing_update}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-slate-100 pt-3">
        <h3 className="text-xs font-bold uppercase tracking-wide text-slate-700">
          Saved analysis history
        </h3>
        {historyLoading && <p className="mt-2 text-xs text-slate-500">Loading saved history…</p>}
        {historyError && (
          <p role="status" className="mt-2 text-xs text-amber-800">{historyError}</p>
        )}
        {!historyLoading && !historyError && history.length === 0 && (
          <p className="mt-2 text-xs text-slate-500">No saved predictions for this case yet.</p>
        )}
        {history.length > 0 && (
          <ol className="mt-2 space-y-2">
            {history.map((entry) => (
              <li key={entry.prediction_id} className="rounded border border-slate-200 p-3 text-xs">
                <div className="flex flex-wrap justify-between gap-1">
                  <strong className="text-slate-900">{entry.predicted_disposition}</strong>
                  <time className="text-slate-500">
                    {new Date(entry.created_at).toLocaleString()}
                  </time>
                </div>
                <p className="mt-1 text-slate-700">{entry.recommended_action}</p>
              </li>
            ))}
          </ol>
        )}
      </div>
      <p className="text-[11px] text-slate-500">
        DocketIQ is not legal advice. AI output is experimental and requires professional review.
      </p>
    </section>
  );
}
