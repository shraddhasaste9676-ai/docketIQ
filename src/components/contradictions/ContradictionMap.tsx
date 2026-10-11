import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Split, 
  AlertTriangle, 
  CheckCircle2, 
  ExternalLink, 
  FileText, 
  Info
} from 'lucide-react';
import { ContradictionItem } from '../../types';

export const ContradictionMap: React.FC = () => {
  const { contradictions, resolveContradiction, openCitationModal } = useCase();

  const [activeReviewId, setActiveReviewId] = useState<string | null>(null);
  const [classification, setClassification] = useState<'Drafting Discrepancy' | 'Subsequent Amendment' | 'Unresolved Disputed Claim'>('Drafting Discrepancy');
  const [rationale, setRationale] = useState('');

  const startReview = (c: ContradictionItem) => {
    setActiveReviewId(c.id);
    setClassification(c.reviewerClassification || 'Drafting Discrepancy');
    setRationale(c.reviewerRationale || '');
  };

  const handleSaveResolution = (id: string) => {
    if (!rationale.trim()) {
      alert('Please provide a brief reviewer rationale to record in the audit trail.');
      return;
    }
    resolveContradiction(id, classification, rationale);
    setActiveReviewId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-rose-50 text-rose-800 border border-rose-200">
              <Split className="w-4 h-4 text-rose-700" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Contradiction & Record Discrepancy Map
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Side-by-side reconciliation of divergent claims, dates, and statements. Original source citations are permanently retained.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-rose-50 text-rose-800 font-semibold border border-rose-200">
            {contradictions.filter(c => c.status === 'unresolved').length} Unresolved
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
            {contradictions.filter(c => c.status === 'reviewed').length} Classified by Counsel
          </span>
        </div>
      </div>

      {/* Legal Tech Safety Principle Notice */}
      <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900">
            Human Classification Safeguard
          </p>
          <p className="text-amber-800 leading-relaxed">
            DocketIQ never presumes that two divergent statements constitute an irreconcilable legal falsehood. Discrepancies may arise from subsequent court adjournments, drafting typos, or bona fide evidentiary disputes. Both original source texts remain preserved.
          </p>
        </div>
      </div>

      {/* Contradiction Cards */}
      <div className="space-y-6">
        {contradictions.map((c) => {
          const isResolved = c.status === 'reviewed';

          return (
            <div 
              key={c.id}
              className={`rounded-lg border shadow-xs overflow-hidden ${
                isResolved 
                  ? 'bg-white border-slate-200' 
                  : 'bg-white border-rose-200 ring-1 ring-rose-200/50'
              }`}
            >
              {/* Card Header */}
              <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Discrepancy ID: {c.id}
                    </span>
                    {isResolved ? (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Classified: {c.reviewerClassification}
                      </span>
                    ) : (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-rose-600" />
                        Unresolved Divergence
                      </span>
                    )}
                  </div>
                  <h2 className="text-base font-bold text-slate-900 mt-1">
                    {c.subject}
                  </h2>
                </div>

                {!isResolved && (
                  <button
                    onClick={() => startReview(c)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors self-start sm:self-auto shadow-xs"
                  >
                    Classify Discrepancy
                  </button>
                )}
              </div>

              {/* Reason Flagged & Explanation */}
              <div className="p-5 border-b border-slate-100 space-y-2">
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>System Analysis: </strong> {c.explanation}
                </div>
                <div className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded border border-slate-200">
                  <strong>Trigger Criteria: </strong> {c.flaggedReason}
                </div>
              </div>

              {/* Side-by-Side Comparison Columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
                {/* Source A Column */}
                <div className="p-5 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F2547] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F2547]" />
                      <span>Source A: {c.sourceA.documentTitle} [p. {c.sourceA.page}]</span>
                    </span>
                    <button
                      onClick={() => openCitationModal({
                        documentId: c.sourceA.documentId,
                        documentTitle: c.sourceA.documentTitle,
                        pageNumber: c.sourceA.page,
                        exactPassage: c.sourceA.exactPassage
                      })}
                      className="text-[11px] text-[#0F2547] hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-blue-50/40 rounded border border-blue-200/70 text-xs text-blue-950">
                    <strong className="block text-[11px] text-blue-900 mb-0.5">Asserted Claim / Date:</strong>
                    {c.sourceA.claim}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Exact Verbatim Passage
                    </span>
                    <blockquote className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed italic">
                      "{c.sourceA.exactPassage}"
                    </blockquote>
                  </div>
                </div>

                {/* Source B Column */}
                <div className="p-5 space-y-3 bg-white">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-[#0F2547] flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-[#0F2547]" />
                      <span>Source B: {c.sourceB.documentTitle} [p. {c.sourceB.page}]</span>
                    </span>
                    <button
                      onClick={() => openCitationModal({
                        documentId: c.sourceB.documentId,
                        documentTitle: c.sourceB.documentTitle,
                        pageNumber: c.sourceB.page,
                        exactPassage: c.sourceB.exactPassage
                      })}
                      className="text-[11px] text-[#0F2547] hover:underline flex items-center gap-0.5 font-medium"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>

                  <div className="p-3 bg-purple-50/40 rounded border border-purple-200/70 text-xs text-purple-950">
                    <strong className="block text-[11px] text-purple-900 mb-0.5">Asserted Claim / Date:</strong>
                    {c.sourceB.claim}
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
                      Exact Verbatim Passage
                    </span>
                    <blockquote className="p-3 rounded bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 leading-relaxed italic">
                      "{c.sourceB.exactPassage}"
                    </blockquote>
                  </div>
                </div>
              </div>

              {/* Reviewer Resolution Details */}
              {isResolved && (
                <div className="p-4 bg-emerald-50/40 border-t border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-bold text-emerald-900">
                      Counsel Audit Note: {c.reviewerClassification}
                    </span>
                    <p className="text-slate-700 mt-0.5 italic">
                      "{c.reviewerRationale}"
                    </p>
                  </div>
                  <div className="text-[10px] text-slate-500 whitespace-nowrap">
                    Reviewed by {c.reviewedBy} on {new Date(c.reviewedAt!).toLocaleDateString()}
                  </div>
                </div>
              )}

              {/* Review Form Drawer */}
              {activeReviewId === c.id && (
                <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-4">
                  <div className="font-bold text-xs text-slate-900 uppercase tracking-wide">
                    Human Reviewer Classification Form
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Select Classification Type
                      </label>
                      <select
                        value={classification}
                        onChange={(e) => setClassification(e.target.value as any)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                      >
                        <option value="Drafting Discrepancy">Drafting Discrepancy (Typo / Registry variance)</option>
                        <option value="Subsequent Amendment">Subsequent Amendment (Bench order superseded summons)</option>
                        <option value="Unresolved Disputed Claim">Unresolved Disputed Claim (Substantive contested fact)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Reviewer Rationale (Recorded in Audit Trail)
                      </label>
                      <input
                        type="text"
                        value={rationale}
                        onChange={(e) => setRationale(e.target.value)}
                        placeholder="E.g., Order sheet dated 22 Dec adjourned matter from 18 Jan to 25 Jan."
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      onClick={() => setActiveReviewId(null)}
                      className="px-3.5 py-1.5 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSaveResolution(c.id)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors"
                    >
                      Save Resolution
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
