import React from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  FileQuestion, 
  CalendarClock, 
  ArrowRight, 
  Activity, 
  Users2, 
  ExternalLink,
  CheckCircle2
} from 'lucide-react';

export const CaseDashboard: React.FC = () => {
  const { 
    caseInfo, 
    timelineEvents, 
    contradictions, 
    missingLinks, 
    deadlines, 
    tasks, 
    auditLog, 
    setActiveScreen, 
    openCitationModal 
  } = useCase();

  const verifiedEvents = timelineEvents.filter(e => e.status === 'verified');
  const pendingEvents = timelineEvents.filter(e => e.status === 'unsupported' || e.status === 'pending');
  const unresolvedConflicts = contradictions.filter(c => c.status === 'unresolved');
  const activeTasks = tasks.filter(t => t.status !== 'completed');

  return (
    <div className="space-y-6">
      {/* Top Banner: Fictional Case Identification */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-slate-100 text-[#0F2547] rounded border border-slate-300">
                {caseInfo.internalReference}
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-50 text-amber-800 font-semibold border border-amber-200">
                Fictional Demonstration Case
              </span>
              <span className="text-xs text-slate-500">
                Filing Date: {caseInfo.filingDate}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
              {caseInfo.caseTitle}
            </h1>
            <p className="text-xs text-slate-600 mt-1 flex items-center gap-2">
              <span>{caseInfo.forum}</span>
              <span>•</span>
              <span className="font-medium text-slate-800">{caseInfo.caseType}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveScreen('common_room')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded transition-colors"
            >
              <Users2 className="w-3.5 h-3.5" />
              <span>Enter Common Room</span>
            </button>
            <button
              onClick={() => setActiveScreen('reports')}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
            >
              <span>Export Source Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Status Distinction: Manual vs AI System */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded bg-slate-50 border border-slate-200">
            <span className="font-bold text-slate-700 block mb-0.5 uppercase tracking-wider text-[10px]">
              Counsel Recorded Stage (Human Entry)
            </span>
            <p className="text-slate-900 font-medium">
              {caseInfo.manuallyEnteredStatus}
            </p>
          </div>
          <div className="p-3 rounded bg-blue-50/50 border border-blue-200">
            <span className="font-bold text-blue-900 block mb-0.5 uppercase tracking-wider text-[10px]">
              AI Evidentiary Pipeline State (System Calculated)
            </span>
            <p className="text-blue-950">
              {caseInfo.aiPipelineStatus}
            </p>
          </div>
        </div>
      </div>

      {/* Metric & Critical Alert Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Verified Events */}
        <button
          onClick={() => setActiveScreen('timeline')}
          className="p-4 bg-white rounded-lg border border-slate-200 hover:border-slate-300 text-left transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px]">Verified Events</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold text-slate-900">
            {verifiedEvents.length}
          </div>
          <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Linked to verbatim records</span>
            <ArrowRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        {/* Unresolved Conflicts */}
        <button
          onClick={() => setActiveScreen('contradictions')}
          className={`p-4 bg-white rounded-lg border text-left transition-all shadow-xs group ${
            unresolvedConflicts.length > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-rose-800">
              Date Conflicts
            </span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl font-bold text-rose-900">
            {unresolvedConflicts.length}
          </div>
          <p className="text-[11px] text-rose-700 mt-1 flex items-center gap-1 font-medium">
            <span>Notice summons vs Order sheet</span>
            <ArrowRight className="w-3 h-3 text-rose-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        {/* Missing Records */}
        <button
          onClick={() => setActiveScreen('missing_links')}
          className="p-4 bg-white rounded-lg border border-purple-200 bg-purple-50/20 text-left transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-purple-900">
              Missing Referenced Docs
            </span>
            <FileQuestion className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-purple-950">
            {missingLinks.length}
          </div>
          <p className="text-[11px] text-purple-700 mt-1 flex items-center gap-1 font-medium">
            <span>Charge sheet & Medical board cert</span>
            <ArrowRight className="w-3 h-3 text-purple-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>

        {/* Explicit Deadlines */}
        <button
          onClick={() => setActiveScreen('deadlines')}
          className="p-4 bg-white rounded-lg border border-amber-200 bg-amber-50/20 text-left transition-all shadow-xs group"
        >
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold uppercase tracking-wider text-[10px] text-amber-900">
              Document Deadlines
            </span>
            <CalendarClock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-amber-950">
            {deadlines.length}
          </div>
          <p className="text-[11px] text-amber-700 mt-1 flex items-center gap-1 font-medium">
            <span>Next: 21 Jan 2026 (Written Stmt)</span>
            <ArrowRight className="w-3 h-3 text-amber-500 group-hover:translate-x-0.5 transition-transform" />
          </p>
        </button>
      </div>

      {/* Main Grid: Verified Timeline Preview vs Action Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Traceable Event Stream */}
        <div className="lg:col-span-2 space-y-5">
          {/* Recent Verified Events */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Recent Source-Verified Events
                </h2>
              </div>
              <button
                onClick={() => setActiveScreen('timeline')}
                className="text-xs font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1"
              >
                <span>View Full Timeline</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {verifiedEvents.slice(0, 4).map((event) => (
                <div key={event.id} className="py-3 flex items-start justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{event.title}</span>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-slate-100 text-slate-700 rounded border border-slate-200">
                        {event.displayDate}
                      </span>
                    </div>
                    <p className="text-slate-600 leading-relaxed text-xs">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-2 pt-0.5">
                      <button
                        onClick={() => openCitationModal(event.primaryCitation)}
                        className="inline-flex items-center gap-1 text-[11px] font-medium text-[#0F2547] hover:underline bg-slate-50 px-2 py-0.5 rounded border border-slate-200"
                      >
                        <span>{event.primaryCitation.documentTitle} [p. {event.primaryCitation.pageNumber || '1'}]</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </button>
                      <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-0.5">
                        <CheckCircle2 className="w-3 h-3" /> Verified by {event.approvedBy || 'Counsel'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pending Evidence Integrity Gate Items */}
          <div className="bg-white rounded-lg border border-amber-200 p-5 shadow-xs bg-amber-50/10">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Evidence Gate Review Queue ({pendingEvents.length})
                </h2>
              </div>
              <button
                onClick={() => setActiveScreen('evidence_gate')}
                className="text-xs font-semibold text-amber-900 hover:underline"
              >
                Inspect Integrity Gate →
              </button>
            </div>
            <p className="text-xs text-slate-600 mb-3">
              Extracted entries requiring human audit before being treated as verified case facts.
            </p>

            <div className="space-y-2">
              {pendingEvents.map((item) => (
                <div 
                  key={item.id} 
                  className="p-3 bg-white rounded border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900">{item.title}</div>
                    <div className="text-[11px] text-rose-700 font-medium mt-0.5">
                      {item.disputedNote || 'Candidate event awaiting human verification'}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveScreen('evidence_gate')}
                    className="px-2.5 py-1 text-xs font-semibold text-[#0F2547] bg-slate-100 hover:bg-slate-200 rounded self-start sm:self-auto shrink-0 transition-colors"
                  >
                    Review in Gate
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Deadlines, Tasks & Audit Activity */}
        <div className="space-y-5">
          {/* Explicit Deadlines & Tasks */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Explicit Court Deadlines
                </h3>
              </div>
              <button
                onClick={() => setActiveScreen('deadlines')}
                className="text-xs font-semibold text-[#0F2547] hover:underline"
              >
                Manage
              </button>
            </div>

            <div className="space-y-2.5">
              {deadlines.map((dl) => (
                <div key={dl.id} className="p-3 rounded bg-slate-50 border border-slate-200 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900">{dl.title}</span>
                    <span className="font-mono text-[11px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                      {dl.dueDate}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-600 italic">
                    "{dl.exactSourceSentence}"
                  </p>
                  <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Source: {dl.sourceDocTitle} [p. {dl.pageNumber}]</span>
                    {dl.isAmbiguous && (
                      <span className="text-amber-700 font-semibold">Flagged: Ambiguous</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* User Operational Tasks */}
            <div className="mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Active User Tasks ({activeTasks.length})
                </span>
                <span className="text-[11px] text-slate-500">Operational</span>
              </div>
              <div className="space-y-2 text-xs">
                {activeTasks.slice(0, 2).map((t) => (
                  <div key={t.id} className="p-2.5 rounded bg-white border border-slate-200 flex items-start justify-between gap-2">
                    <div>
                      <div className="font-medium text-slate-800">{t.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">
                        Assigned to: {t.assignedToName} • Due: {t.dueDate}
                      </div>
                    </div>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      t.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent Audit Activity */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-600" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Traceable Audit Log
                </h3>
              </div>
              <button
                onClick={() => setActiveScreen('audit')}
                className="text-xs font-semibold text-[#0F2547] hover:underline"
              >
                Full Trail
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {auditLog.slice(0, 4).map((entry) => (
                <div key={entry.id} className="border-l-2 border-[#0F2547] pl-3 py-1 space-y-0.5">
                  <div className="flex items-center justify-between text-[10px] text-slate-500">
                    <span className="font-semibold text-slate-700">{entry.actor}</span>
                    <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                  </div>
                  <div className="font-medium text-slate-900">{entry.summary}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
