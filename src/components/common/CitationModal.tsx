import React from 'react';
import { useCase } from '../../context/CaseContext';
import { FileText, ExternalLink, X, ShieldCheck, AlertCircle } from 'lucide-react';

export const CitationModal: React.FC = () => {
  const { activeCitationModal, closeCitationModal, setActiveScreen } = useCase();

  if (!activeCitationModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden flex flex-col"
        role="dialog"
        aria-labelledby="citation-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-blue-50 text-[#0F2547] border border-blue-100">
              <FileText className="w-5 h-5 text-[#0F2547]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Traceable Source Record
                </span>
                {activeCitationModal.isUnsupported ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    <AlertCircle className="w-3 h-3" /> Unsupported
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    <ShieldCheck className="w-3 h-3" /> Source Verified
                  </span>
                )}
              </div>
              <h3 id="citation-title" className="text-base font-bold text-slate-900">
                {activeCitationModal.documentTitle}
              </h3>
            </div>
          </div>
          <button
            onClick={closeCitationModal}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3.5 bg-slate-50 rounded border border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block mb-0.5 font-medium">Document ID:</span>
              <span className="font-mono font-medium text-slate-900">{activeCitationModal.documentId}</span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 font-medium">Page Reference:</span>
              <span className="font-medium text-slate-900">
                {activeCitationModal.pageNumber ? `Page ${activeCitationModal.pageNumber}` : 'General / Header'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block mb-0.5 font-medium">Paragraph / Section:</span>
              <span className="font-medium text-slate-900">
                {activeCitationModal.paragraphNumber || 'Referenced Text'}
              </span>
            </div>
          </div>

          {/* Verbatim Passage Box */}
          <div>
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
              Exact Verbatim Source Passage
            </label>
            <div className={`p-4 rounded border font-mono text-sm leading-relaxed ${
              activeCitationModal.isUnsupported 
                ? 'bg-rose-50/50 border-rose-200 text-rose-900' 
                : 'bg-amber-50/30 border-amber-200/70 text-slate-900'
            }`}>
              <blockquote className="border-l-4 border-[#0F2547] pl-3.5 italic">
                "{activeCitationModal.exactPassage}"
              </blockquote>
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5 flex items-center gap-1">
              <span>Verified against supplied electronic file bundle. Unedited citation record.</span>
            </p>
          </div>

          {activeCitationModal.annotatedDate && (
            <div className="p-3 bg-blue-50/50 border border-blue-200 rounded text-xs text-blue-900">
              <span className="font-semibold">Extracted Date Parameter: </span>
              <span className="font-mono font-bold">{activeCitationModal.annotatedDate}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={() => {
              closeCitationModal();
              setActiveScreen('documents');
            }}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2547] hover:underline"
          >
            <ExternalLink className="w-3.5 h-3.5" /> Open in Document Manager
          </button>
          <button
            onClick={closeCitationModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors"
          >
            Close Citation
          </button>
        </div>
      </div>
    </div>
  );
};
