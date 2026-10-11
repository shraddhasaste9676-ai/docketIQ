import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Network, 
  FileText, 
  FileQuestion, 
  ShieldCheck, 
  CalendarClock, 
  X
} from 'lucide-react';

export const MissingLinkGraph: React.FC = () => {
  const { documents, timelineEvents, missingLinks } = useCase();

  const [selectedNode, setSelectedNode] = useState<{
    type: 'document' | 'event' | 'missing';
    id: string;
    title: string;
    details: any;
  } | null>(null);

  const verifiedDocs = documents.filter(d => d.status === 'verified');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
              <Network className="w-4 h-4 text-purple-700" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Missing-Link Graph & Connected Records
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Topological map of supplied case files, extracted timeline events, and referenced records that are absent from the case archive.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-purple-100 text-purple-900 font-bold border border-purple-300 flex items-center gap-1">
            <FileQuestion className="w-3.5 h-3.5" />
            <span>{missingLinks.length} Missing Referenced Records</span>
          </span>
        </div>
      </div>

      {/* Visual Topological Graph Grid */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 flex items-center justify-between">
          <span>Record Dependency Architecture</span>
          <span className="text-[11px] font-normal text-slate-400">Click any record node to inspect connected evidentiary dependencies</span>
        </div>

        {/* 3-Column Visual Flow: Uploaded Docs -> Verified Events -> Missing Cited Docs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
          {/* Column 1: Supplied Records */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
              <FileText className="w-4 h-4 text-[#0F2547]" />
              <span>1. Supplied Documents ({verifiedDocs.length})</span>
            </div>

            <div className="space-y-2.5">
              {verifiedDocs.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedNode({
                    type: 'document',
                    id: doc.id,
                    title: doc.fileName,
                    details: doc
                  })}
                  className="w-full text-left p-3.5 rounded border border-slate-200 bg-slate-50/70 hover:bg-slate-100/90 hover:border-slate-300 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="truncate">{doc.fileName}</span>
                    <span className="text-[10px] font-mono text-slate-500">{doc.fileSize}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-1">{doc.title}</div>
                  <div className="mt-2 flex items-center justify-between text-[10px] text-emerald-800 font-semibold">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" /> Source Verified
                    </span>
                    <span className="text-slate-400 group-hover:text-slate-700">Inspect →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 2: Extracted Timeline Events */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-slate-800 flex items-center gap-2 pb-2 border-b border-slate-200">
              <CalendarClock className="w-4 h-4 text-blue-700" />
              <span>2. Extracted Case Events ({timelineEvents.length})</span>
            </div>

            <div className="space-y-2.5">
              {timelineEvents.slice(0, 4).map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedNode({
                    type: 'event',
                    id: ev.id,
                    title: ev.title,
                    details: ev
                  })}
                  className={`w-full text-left p-3.5 rounded border transition-all text-xs group ${
                    ev.isConflict 
                      ? 'bg-rose-50/30 border-rose-200 hover:border-rose-300' 
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded">
                      {ev.displayDate}
                    </span>
                    <span className="text-[10px] text-slate-500 uppercase">{ev.category}</span>
                  </div>
                  <div className="font-bold text-slate-900 mt-1 truncate">{ev.title}</div>
                  <div className="text-[10px] text-slate-500 mt-1">
                    Cites: {ev.primaryCitation.documentTitle}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Column 3: Referenced BUT Missing Records */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-purple-900 flex items-center gap-2 pb-2 border-b border-purple-200">
              <FileQuestion className="w-4 h-4 text-purple-700" />
              <span>3. Referenced but MISSING ({missingLinks.length})</span>
            </div>

            <div className="space-y-2.5">
              {missingLinks.map((ml) => (
                <button
                  key={ml.id}
                  onClick={() => setSelectedNode({
                    type: 'missing',
                    id: ml.id,
                    title: ml.documentTitle,
                    details: ml
                  })}
                  className="w-full text-left p-3.5 rounded border-2 border-dashed border-purple-300 bg-purple-50/40 hover:bg-purple-100/60 transition-all text-xs group"
                >
                  <div className="flex items-center justify-between font-bold text-purple-950">
                    <span className="truncate">{ml.documentTitle}</span>
                    <span className="text-[10px] uppercase font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {ml.urgency} Urgency
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-800 mt-1 line-clamp-1">
                    Cited in: {ml.referencedBy}
                  </div>
                  <div className="mt-2 text-[10px] font-semibold text-purple-900 flex items-center justify-between">
                    <span>Status: {ml.currentStatus.replace(/_/g, ' ')}</span>
                    <span className="text-purple-600 group-hover:text-purple-900">Details →</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Missing Records Detailed Inventory Table */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
          Missing Evidentiary Records Action Registry
        </h2>

        <div className="divide-y divide-slate-100 text-xs">
          {missingLinks.map((ml) => (
            <div key={ml.id} className="py-4 flex flex-col md:flex-row md:items-start justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded bg-purple-100 text-purple-800 border border-purple-200">
                    <FileQuestion className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">
                      {ml.documentTitle}
                    </h3>
                    <div className="text-[11px] text-slate-500">
                      Reference Tag: <span className="font-mono text-slate-700">{ml.documentRef}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-purple-50/50 rounded border border-purple-200 text-xs text-purple-950">
                  <div className="font-semibold text-purple-900 text-[11px] mb-0.5">
                    Citation Context ({ml.referencedBy}):
                  </div>
                  <blockquote className="italic font-mono text-[11px]">
                    "{ml.contextPassage}"
                  </blockquote>
                </div>

                <div className="text-slate-600 text-[11px] leading-relaxed">
                  <strong>Impact on Case: </strong> {ml.impactOnCase}
                </div>
              </div>

              <div className="shrink-0 flex flex-col items-end gap-2 text-right">
                <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${
                  ml.currentStatus === 'procurement_in_progress'
                    ? 'bg-amber-50 text-amber-900 border-amber-200'
                    : ml.currentStatus === 'requested_from_client'
                      ? 'bg-blue-50 text-blue-900 border-blue-200'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}>
                  {ml.currentStatus.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] text-slate-400">
                  Urgency: <strong className="uppercase text-rose-700">{ml.urgency}</strong>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Node Detail Drawer / Modal */}
      {selectedNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  {selectedNode.type} Node Details
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedNode.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-3 text-xs text-slate-700">
              {selectedNode.type === 'document' && (
                <div className="space-y-2">
                  <p><strong>File Size:</strong> {selectedNode.details.fileSize}</p>
                  <p><strong>Pages:</strong> {selectedNode.details.pageCount}</p>
                  <p><strong>Source Authority:</strong> {selectedNode.details.authoritativeSource}</p>
                  <p className="p-3 bg-slate-50 rounded border border-slate-200 text-slate-800">
                    {selectedNode.details.summary}
                  </p>
                </div>
              )}

              {selectedNode.type === 'event' && (
                <div className="space-y-2">
                  <p><strong>Date:</strong> {selectedNode.details.displayDate}</p>
                  <p><strong>Category:</strong> {selectedNode.details.category}</p>
                  <p><strong>Primary Citation:</strong> {selectedNode.details.primaryCitation.documentTitle}</p>
                  <blockquote className="p-3 bg-slate-50 rounded border border-slate-200 font-mono italic">
                    "{selectedNode.details.primaryCitation.exactPassage}"
                  </blockquote>
                </div>
              )}

              {selectedNode.type === 'missing' && (
                <div className="space-y-2">
                  <p><strong>Referenced By:</strong> {selectedNode.details.referencedBy}</p>
                  <p><strong>Status:</strong> {selectedNode.details.currentStatus}</p>
                  <p><strong>Legal Impact:</strong> {selectedNode.details.impactOnCase}</p>
                </div>
              )}
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button
                onClick={() => setSelectedNode(null)}
                className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F2547] rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
