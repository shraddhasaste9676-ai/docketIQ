import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { TimelineEvent } from '../../types';
import { 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  X, 
  Edit3, 
  FileText, 
  AlertTriangle, 
  Lock,
  Info
} from 'lucide-react';

export const EvidenceIntegrityGate: React.FC = () => {
  const { 
    timelineEvents, 
    approveCandidateEvent, 
    rejectCandidateEvent, 
    editCandidateEvent, 
    openCitationModal
  } = useCase();

  const [editingEventId, setEditingEventId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  
  const [rejectingEventId, setRejectingEventId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const reviewQueue = timelineEvents.filter(e => e.status !== 'rejected');

  const startEdit = (ev: TimelineEvent) => {
    setEditingEventId(ev.id);
    setEditTitle(ev.title);
    setEditDate(ev.date || '');
  };

  const saveEdit = (evId: string) => {
    editCandidateEvent(evId, editTitle, editDate || null);
    setEditingEventId(null);
  };

  const handleReject = (evId: string) => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejecting this candidate event.');
      return;
    }
    rejectCandidateEvent(evId, rejectReason);
    setRejectingEventId(null);
    setRejectReason('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Evidence Integrity Gate
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Mandatory human verification layer. Events extracted from supplied records cannot be entered into the verified case timeline without an audited verbatim source citation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {reviewQueue.filter(e => e.status === 'verified').length} Verified
          </span>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
            {reviewQueue.filter(e => e.status === 'unsupported' || e.status === 'pending').length} Action Required
          </span>
        </div>
      </div>

      {/* Core Principle Callout */}
      <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 text-xs text-blue-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-blue-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-blue-900">
            Evidence Gate Operational Safeguard
          </p>
          <p className="text-blue-800 leading-relaxed">
            Every candidate event must link directly to an identifiable, verbatim passage in an uploaded case record. If an event has no verifiable source text, it is flagged as <strong>Unsupported</strong> and the system strictly prevents it from being verified.
          </p>
        </div>
      </div>

      {/* Review Queue Items */}
      <div className="space-y-4">
        {reviewQueue.map((ev) => {
          const isUnsupported = ev.primaryCitation.isUnsupported || ev.status === 'unsupported';
          const isVerified = ev.status === 'verified';
          const isConflicting = ev.status === 'conflicting';

          return (
            <div 
              key={ev.id}
              className={`rounded-lg border p-5 transition-all shadow-xs ${
                isUnsupported 
                  ? 'bg-rose-50/20 border-rose-200' 
                  : isConflicting
                    ? 'bg-amber-50/20 border-amber-300'
                    : isVerified
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50 border-slate-300'
              }`}
            >
              {/* Event Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`p-1.5 rounded text-xs ${
                    isUnsupported 
                      ? 'bg-rose-100 text-rose-800' 
                      : isVerified 
                        ? 'bg-emerald-100 text-emerald-800' 
                        : 'bg-amber-100 text-amber-800'
                  }`}>
                    {isVerified ? <ShieldCheck className="w-4 h-4" /> : <ShieldAlert className="w-4 h-4" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      {ev.title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Date: <strong className="text-slate-800 font-mono">{ev.displayDate}</strong></span>
                      <span>•</span>
                      <span>Category: <strong className="text-slate-700 capitalize">{ev.category}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2">
                  {isUnsupported ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Unsupported: Verification Blocked
                    </span>
                  ) : isConflicting ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                      Conflicting Records
                    </span>
                  ) : isVerified ? (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
                      Source Verified
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                      Pending Counsel Review
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                {ev.description}
              </p>

              {/* Exact Verbatim Passage Display */}
              <div className="mb-4">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-600 mb-1">
                  <span>Verbatim Source Record Extract</span>
                  <span>{ev.primaryCitation.documentTitle} [p. {ev.primaryCitation.pageNumber || 'N/A'}]</span>
                </div>
                <div className={`p-3.5 rounded border text-xs font-mono leading-relaxed ${
                  isUnsupported
                    ? 'bg-rose-50 border-rose-200 text-rose-900 italic'
                    : 'bg-slate-50 border-slate-200 text-slate-800'
                }`}>
                  <blockquote className="border-l-3 border-[#0F2547] pl-3 italic">
                    "{ev.primaryCitation.exactPassage}"
                  </blockquote>
                </div>
              </div>

              {/* Disputed / Uncertainty Note */}
              {ev.disputedNote && (
                <div className="p-3 bg-amber-50/60 border border-amber-200 rounded text-xs text-amber-900 mb-3 flex items-start gap-2">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span>{ev.disputedNote}</span>
                </div>
              )}

              {/* Action Buttons / Human Review */}
              <div className="pt-3 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-2.5">
                <button
                  onClick={() => openCitationModal(ev.primaryCitation)}
                  className="text-xs font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Inspect Full Citation</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => startEdit(ev)}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 rounded border border-slate-200 transition-colors inline-flex items-center gap-1"
                  >
                    <Edit3 className="w-3 h-3" />
                    <span>Edit Entry</span>
                  </button>

                  <button
                    onClick={() => setRejectingEventId(ev.id)}
                    className="px-3 py-1.5 text-xs font-semibold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded border border-rose-200 transition-colors inline-flex items-center gap-1"
                  >
                    <X className="w-3 h-3" />
                    <span>Reject</span>
                  </button>

                  <button
                    onClick={() => approveCandidateEvent(ev.id)}
                    disabled={isUnsupported || isVerified}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded inline-flex items-center gap-1.5 transition-colors ${
                      isUnsupported 
                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300'
                        : isVerified
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 cursor-default'
                          : 'bg-[#0F2547] hover:bg-[#1E3A8A] text-white shadow-xs'
                    }`}
                    title={isUnsupported ? 'Verification blocked because no verbatim source passage exists' : ''}
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>{isVerified ? 'Verified' : 'Approve & Verify'}</span>
                  </button>
                </div>
              </div>

              {/* Inline Edit Form */}
              {editingEventId === ev.id && (
                <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded text-xs space-y-3">
                  <div className="font-bold text-slate-800">
                    Edit Extracted Event Parameters
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Event Title
                      </label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                        Date (YYYY-MM-DD or leave blank if uncertain)
                      </label>
                      <input
                        type="text"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        placeholder="YYYY-MM-DD"
                        className="w-full p-2 bg-white border border-slate-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                      />
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setEditingEventId(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => saveEdit(ev.id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-[#0F2547] rounded"
                    >
                      Save & Verify
                    </button>
                  </div>
                </div>
              )}

              {/* Inline Reject Form */}
              {rejectingEventId === ev.id && (
                <div className="mt-4 p-4 bg-rose-50/70 border border-rose-200 rounded text-xs space-y-3">
                  <div className="font-bold text-rose-900">
                    Provide Rejection Rationale for Audit Log
                  </div>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="E.g., Text passage misattributed or event not supported by formal court record."
                    className="w-full p-2 bg-white border border-rose-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-rose-500"
                    rows={2}
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setRejectingEventId(null)}
                      className="px-3 py-1 text-xs text-slate-600 hover:text-slate-900"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleReject(ev.id)}
                      className="px-3 py-1 text-xs font-semibold text-white bg-rose-700 hover:bg-rose-800 rounded"
                    >
                      Confirm Rejection
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
