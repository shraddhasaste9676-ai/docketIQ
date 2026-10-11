import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  FileSpreadsheet, 
  Printer, 
  Scale
} from 'lucide-react';

export const ReportGenerator: React.FC = () => {
  const { 
    caseInfo, 
    timelineEvents, 
    contradictions, 
    missingLinks, 
    deadlines, 
    tasks 
  } = useCase();

  // Inclusions toggles
  const [includeTimeline, setIncludeTimeline] = useState(true);
  const [includeConflicts, setIncludeConflicts] = useState(true);
  const [includeMissingLinks, setIncludeMissingLinks] = useState(true);
  const [includeDeadlines, setIncludeDeadlines] = useState(true);
  const [includeTasks, setIncludeTasks] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header (Hidden in Print) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 no-print">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-50 text-[#0F2547] border border-blue-200">
              <FileSpreadsheet className="w-4 h-4 text-[#0F2547]" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Source-Linked Case Reports
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Generate an auditable, source-traceable case brief with verbatim record citations, flagged discrepancies, and missing document registries.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save as PDF</span>
          </button>
        </div>
      </div>

      {/* Report Customization Controls (Hidden in Print) */}
      <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs no-print">
        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2.5">
          Report Inclusions & Parameters
        </span>
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeTimeline} 
              onChange={(e) => setIncludeTimeline(e.target.checked)}
              className="rounded text-[#0F2547]"
            />
            <span className="text-slate-700 font-medium">Verified Case Timeline</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeConflicts} 
              onChange={(e) => setIncludeConflicts(e.target.checked)}
              className="rounded text-[#0F2547]"
            />
            <span className="text-slate-700 font-medium">Contradiction & Date Conflict Map</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeMissingLinks} 
              onChange={(e) => setIncludeMissingLinks(e.target.checked)}
              className="rounded text-[#0F2547]"
            />
            <span className="text-slate-700 font-medium">Missing Document Registry</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeDeadlines} 
              onChange={(e) => setIncludeDeadlines(e.target.checked)}
              className="rounded text-[#0F2547]"
            />
            <span className="text-slate-700 font-medium">Document-Derived Judicial Deadlines</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer">
            <input 
              type="checkbox" 
              checked={includeTasks} 
              onChange={(e) => setIncludeTasks(e.target.checked)}
              className="rounded text-[#0F2547]"
            />
            <span className="text-slate-700 font-medium">User Operational Tasks</span>
          </label>
        </div>
      </div>

      {/* THE OFFICIAL REPORT PREVIEW (Print-Friendly) */}
      <div className="bg-white rounded-lg border border-slate-300 p-8 sm:p-12 shadow-sm max-w-4xl mx-auto space-y-8 font-sans">
        {/* Formal Legal Header */}
        <div className="border-b-2 border-slate-900 pb-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500 mb-1">
                DocketIQ Verified Evidentiary Intelligence Report
              </div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                {caseInfo.caseTitle}
              </h1>
              <div className="text-xs text-slate-700 mt-1 font-medium">
                {caseInfo.forum} • {caseInfo.caseType}
              </div>
            </div>
            <div className="text-right text-xs space-y-1">
              <div className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded border border-slate-300">
                {caseInfo.internalReference}
              </div>
              <div className="text-slate-500 text-[11px]">
                Report Date: 11/10/2026
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-4 border-t border-slate-200 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Filing Date:</span>
              <span className="font-medium text-slate-900">{caseInfo.filingDate}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Petitioner / Client:</span>
              <span className="font-medium text-slate-900">{caseInfo.clientName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Counsel on Record:</span>
              <span className="font-medium text-slate-900">{caseInfo.lawyerName}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px] uppercase font-bold">Current Stage:</span>
              <span className="font-medium text-slate-900">{caseInfo.currentStage}</span>
            </div>
          </div>
        </div>

        {/* Section 1: Verified Timeline */}
        {includeTimeline && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-300 flex items-center justify-between">
              <span>1. Chronological Case Event Timeline</span>
              <span className="text-[11px] font-normal text-slate-500">Every event traceable to source</span>
            </h2>

            <div className="divide-y divide-slate-200 text-xs">
              {timelineEvents.filter(e => e.status !== 'rejected').map((ev) => (
                <div key={ev.id} className="py-3 space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 rounded">
                        {ev.displayDate}
                      </span>
                      <strong className="text-slate-900">{ev.title}</strong>
                    </div>
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">
                      {ev.category} • {ev.status}
                    </span>
                  </div>
                  <p className="text-slate-700 leading-relaxed">
                    {ev.description}
                  </p>
                  <div className="p-2 bg-slate-50 rounded border border-slate-200 text-[11px] font-mono italic text-slate-800">
                    "{ev.primaryCitation.exactPassage}" — {ev.primaryCitation.documentTitle} [p. {ev.primaryCitation.pageNumber || 'N/A'}]
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Contradictions */}
        {includeConflicts && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-300 flex items-center justify-between">
              <span>2. Contradiction & Record Discrepancy Log</span>
              <span className="text-[11px] font-normal text-rose-700 font-semibold">Dual source preservation</span>
            </h2>

            <div className="space-y-3 text-xs">
              {contradictions.map((c) => (
                <div key={c.id} className="p-4 rounded border border-slate-300 bg-slate-50/50 space-y-2">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span>{c.subject}</span>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-200 rounded">
                      Status: {c.status} {c.reviewerClassification ? `(${c.reviewerClassification})` : ''}
                    </span>
                  </div>
                  <p className="text-slate-600">
                    {c.explanation}
                  </p>
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-[11px]">
                      <strong>Source A ({c.sourceA.documentTitle} p. {c.sourceA.page}):</strong>
                      <div className="italic mt-0.5">"{c.sourceA.exactPassage}"</div>
                    </div>
                    <div className="p-2.5 bg-white rounded border border-slate-200 font-mono text-[11px]">
                      <strong>Source B ({c.sourceB.documentTitle} p. {c.sourceB.page}):</strong>
                      <div className="italic mt-0.5">"{c.sourceB.exactPassage}"</div>
                    </div>
                  </div>
                  {c.reviewerRationale && (
                    <div className="text-[11px] text-emerald-900 font-medium">
                      Counsel Rationale: {c.reviewerRationale}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Missing Documents */}
        {includeMissingLinks && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-300">
              3. Referenced But Missing Records
            </h2>

            <div className="divide-y divide-slate-200 text-xs">
              {missingLinks.map((ml) => (
                <div key={ml.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div>
                    <strong className="text-slate-900">{ml.documentTitle}</strong>
                    <div className="text-slate-600 mt-0.5">
                      Cited in {ml.referencedBy}: <span className="font-mono italic">"{ml.contextPassage}"</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-purple-900 uppercase">
                    {ml.urgency} Urgency
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 4: Document Deadlines */}
        {includeDeadlines && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-300">
              4. Document-Derived Judicial Deadlines
            </h2>

            <div className="space-y-2 text-xs">
              {deadlines.map((dl) => (
                <div key={dl.id} className="p-3 rounded bg-slate-50 border border-slate-200 flex items-start justify-between">
                  <div className="space-y-1">
                    <strong className="text-slate-900">{dl.title}</strong>
                    <p className="italic text-slate-700 font-mono text-[11px]">"{dl.exactSourceSentence}"</p>
                    <div className="text-[10px] text-slate-500">
                      Record: {dl.sourceDocTitle} [p. {dl.pageNumber}]
                    </div>
                  </div>
                  <span className="font-mono font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    {dl.dueDate}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 5: Optional Operational Tasks */}
        {includeTasks && (
          <div className="space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-900 pb-1.5 border-b border-slate-300">
              5. Operational User Tasks
            </h2>

            <div className="divide-y divide-slate-200 text-xs">
              {tasks.map((t) => (
                <div key={t.id} className="py-2 flex items-center justify-between">
                  <div>
                    <strong>{t.title}</strong>
                    <div className="text-[11px] text-slate-500">Assigned: {t.assignedToName}</div>
                  </div>
                  <span className="font-mono text-slate-700 font-semibold">{t.dueDate}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Disclaimer / Limitations */}
        <div className="border-t-2 border-slate-900 pt-6 space-y-2 text-[11px] text-slate-500 leading-relaxed">
          <div className="font-bold text-slate-900 flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-slate-700" />
            <span>Evidentiary Scope & Professional Limitations Notice</span>
          </div>
          <p>
            This report was compiled by DocketIQ from supplied electronic case records. It organizes dates and text passages into an auditable timeline. <strong>This report does not provide legal advice, does not estimate judicial outcomes, and does not replace the professional examination of original physical court rolls by an admitted legal practitioner.</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
