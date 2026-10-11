import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  CalendarClock, 
  Search, 
  ArrowUpDown, 
  FileText, 
  ShieldCheck, 
  AlertTriangle, 
  Split, 
  HelpCircle, 
  ExternalLink
} from 'lucide-react';

export const CaseTimeline: React.FC = () => {
  const { timelineEvents, openCitationModal, setActiveScreen } = useCase();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const filteredEvents = timelineEvents.filter(ev => {
    const matchesSearch = ev.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          ev.primaryCitation.documentTitle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || ev.category === selectedCategory;
    const matchesStatus = selectedStatus === 'all' || ev.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const sortedEvents = [...filteredEvents].sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return sortAsc ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-50 text-[#0F2547] border border-blue-200">
              <CalendarClock className="w-4 h-4 text-[#0F2547]" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Source-Verified Case Timeline
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Chronological sequence of verified records. Dual-record conflicts and undated events are preserved without automatic redaction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSortAsc(!sortAsc)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors shadow-xs"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>{sortAsc ? 'Oldest to Newest' : 'Newest to Oldest'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search timeline events..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Category:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700"
            >
              <option value="all">All Categories</option>
              <option value="filing">Filings</option>
              <option value="hearing">Hearings</option>
              <option value="order">Orders</option>
              <option value="notice">Notices</option>
              <option value="procedural">Procedural</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-slate-500">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="py-1 px-2 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700"
            >
              <option value="all">All Statuses</option>
              <option value="verified">Verified Only</option>
              <option value="conflicting">Conflicting Records</option>
              <option value="unsupported">Unsupported / Pending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Vertical Timeline Track */}
      <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
        {sortedEvents.map((ev) => {
          const isConflict = ev.isConflict || ev.status === 'conflicting';
          const isDateUncertain = ev.isDateUncertain || !ev.date;
          const isUnsupported = ev.status === 'unsupported';
          const isVerified = ev.status === 'verified';

          return (
            <div key={ev.id} className="relative group">
              <div className={`absolute -left-6 sm:-left-8 top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center bg-white shadow-xs ${
                isConflict 
                  ? 'border-rose-500 text-rose-600' 
                  : isDateUncertain || isUnsupported
                    ? 'border-amber-500 text-amber-600'
                    : 'border-[#0F2547] text-[#0F2547]'
              }`}>
                {isConflict ? (
                  <Split className="w-3 h-3" />
                ) : isDateUncertain ? (
                  <HelpCircle className="w-3 h-3" />
                ) : (
                  <ShieldCheck className="w-3 h-3" />
                )}
              </div>

              <div className={`p-5 rounded-lg border shadow-xs transition-all ${
                isConflict 
                  ? 'bg-rose-50/20 border-rose-200 hover:border-rose-300' 
                  : isDateUncertain 
                    ? 'bg-amber-50/20 border-amber-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
              }`}>
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {isConflict ? (
                        <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded border border-rose-300">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Conflicting Dates Preserved: 18 Jan 2026 vs 25 Jan 2026</span>
                        </div>
                      ) : (
                        <span className="font-mono text-xs font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                          {ev.displayDate}
                        </span>
                      )}

                      <span className="text-[10px] uppercase font-semibold text-slate-500 px-1.5 py-0.5 bg-slate-100 rounded">
                        {ev.category}
                      </span>
                    </div>

                    <h2 className="text-base font-bold text-slate-900">
                      {ev.title}
                    </h2>
                  </div>

                  <div className="shrink-0">
                    {isConflict ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-900 border border-rose-300">
                        <Split className="w-3 h-3" /> Contradiction Detected
                      </span>
                    ) : isVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        <ShieldCheck className="w-3 h-3" /> Source Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                        Pending Gate Review
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-3">
                  {ev.description}
                </p>

                {isConflict && ev.conflictingCitation ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-3 p-3.5 bg-rose-50/50 rounded border border-rose-200 text-xs">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                        <span>Source A: {ev.primaryCitation.documentTitle} [p. {ev.primaryCitation.pageNumber}]</span>
                        <span className="font-mono text-rose-700 font-bold">18-01-2026</span>
                      </div>
                      <blockquote className="p-2.5 bg-white rounded border border-rose-200 font-mono text-[11px] text-slate-800 italic">
                        "{ev.primaryCitation.exactPassage}"
                      </blockquote>
                      <button
                        onClick={() => openCitationModal(ev.primaryCitation)}
                        className="text-[11px] font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source A Record
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between font-bold text-slate-800 text-[11px]">
                        <span>Source B: {ev.conflictingCitation.documentTitle} [p. {ev.conflictingCitation.pageNumber}]</span>
                        <span className="font-mono text-rose-700 font-bold">25-01-2026</span>
                      </div>
                      <blockquote className="p-2.5 bg-white rounded border border-rose-200 font-mono text-[11px] text-slate-800 italic">
                        "{ev.conflictingCitation.exactPassage}"
                      </blockquote>
                      <button
                        onClick={() => openCitationModal(ev.conflictingCitation!)}
                        className="text-[11px] font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1 pt-1"
                      >
                        <ExternalLink className="w-3 h-3" /> View Source B Record
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded border border-slate-200 text-xs font-mono my-2 text-slate-800">
                    <div className="text-[10px] font-sans font-bold text-slate-500 uppercase tracking-wider mb-1">
                      Verbatim Record Citation: {ev.primaryCitation.documentTitle} [p. {ev.primaryCitation.pageNumber || '1'}]
                    </div>
                    <p className="italic">
                      "{ev.primaryCitation.exactPassage}"
                    </p>
                  </div>
                )}

                {ev.disputedNote && (
                  <p className="text-[11px] text-amber-800 mt-2 bg-amber-50/70 p-2 rounded border border-amber-200">
                    <strong>Integrity Note:</strong> {ev.disputedNote}
                  </p>
                )}

                <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openCitationModal(ev.primaryCitation)}
                      className="text-[#0F2547] hover:underline font-semibold inline-flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" /> Inspect Document Citation
                    </button>
                    {isConflict && (
                      <button
                        onClick={() => setActiveScreen('contradictions')}
                        className="text-rose-700 hover:underline font-semibold inline-flex items-center gap-1"
                      >
                        <Split className="w-3 h-3" /> Open in Contradiction Map
                      </button>
                    )}
                  </div>
                  {ev.approvedBy && (
                    <span className="text-[10px] text-slate-400">
                      Approved by {ev.approvedBy}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
