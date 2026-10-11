import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Lock, 
  Save
} from 'lucide-react';

export const LawyerWorkspaceView: React.FC = () => {
  const { 
    caseInfo, 
    missingLinks, 
    tasks, 
    setActiveScreen, 
    showToast 
  } = useCase();

  // Confidential private lawyer notes (strictly never sent to client)
  const [privateNotes, setPrivateNotes] = useState<string>(
    `[CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGED WORK PRODUCT]\n` +
    `1. Preliminary Strategy: MSRTC driver was arguably driving rashly on SH-4. Awaiting certified copy of Charge Sheet 402/2025 to corroborate site inspection panchnama.\n` +
    `2. Written Statement: Anticipate standard defence of contributory negligence from Corporation panel counsel. Check whether bus brake inspection was conducted prior to morning shift.\n` +
    `3. Disability Quantum: If respondent disputes 45% provisional rating, move immediate interim application under Section 140 (No-fault liability) for INR 50,000 interim relief while Apex Board evaluation is pending.\n` +
    `4. Hearing listing: Check cause list on 18 Jan 2026 to ensure matter is not dismissed for default if bench took it up unannounced.`
  );

  const [isSaved, setIsSaved] = useState(false);

  const handleSaveNotes = () => {
    setIsSaved(true);
    showToast('Confidential attorney notes saved locally.', 'success');
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Workspace Header */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#0F2547] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Authorized Counsel Workspace
              </span>
              <span className="text-xs text-slate-500 font-mono">
                {caseInfo.lawyerBarId}
              </span>
            </div>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              {caseInfo.lawyerName} • {caseInfo.lawyerFirm}
            </h1>
            <p className="text-xs text-slate-600 mt-0.5">
              Client: <strong>{caseInfo.clientName}</strong> • Internal Reference: <span className="font-mono">{caseInfo.internalReference}</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveScreen('evidence_gate')}
              className="px-3 py-1.5 text-xs font-semibold text-[#0F2547] bg-slate-100 hover:bg-slate-200 rounded border border-slate-300 transition-colors"
            >
              Integrity Gate Queue
            </button>
            <button
              onClick={() => setActiveScreen('reports')}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
            >
              Generate Case Report
            </button>
          </div>
        </div>

        {/* Counsel Quick Status */}
        <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-bold text-slate-700 block mb-0.5">Hearing Date Conflict</span>
            <span className="text-rose-700 font-bold">18 Jan (Notice) vs 25 Jan (Order)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-bold text-slate-700 block mb-0.5">30-Day Response Deadline</span>
            <span className="text-amber-800 font-bold">21 Jan 2026 (Order.pdf p. 3)</span>
          </div>
          <div className="p-3 bg-slate-50 rounded border border-slate-200">
            <span className="font-bold text-slate-700 block mb-0.5">Critical Missing Record</span>
            <span className="text-purple-900 font-bold">Police Charge Sheet 402/2025</span>
          </div>
        </div>
      </div>

      {/* Main Dual Area: Private Work Product vs Client Collaboration View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: CONFIDENTIAL COUNSEL NOTES (STRICT BOUNDARY) */}
        <div className="bg-white rounded-lg border border-slate-300 shadow-xs flex flex-col justify-between">
          <div>
            <div className="p-4 bg-slate-900 text-white rounded-t-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-amber-400" />
                <h2 className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Private Attorney Work Product (CONFIDENTIAL)
                </h2>
              </div>
              <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                Hidden from Client Portal
              </span>
            </div>

            <div className="p-3 bg-amber-50 border-b border-amber-200 text-[11px] text-amber-900 leading-tight">
              <strong>Security & Access Boundary: </strong> Notes entered here remain strictly inside the Counsel Workspace and are never transmitted to the client Common Room view.
            </div>

            <div className="p-4">
              <textarea
                value={privateNotes}
                onChange={(e) => setPrivateNotes(e.target.value)}
                rows={12}
                className="w-full p-3 font-mono text-xs text-slate-900 bg-slate-50 border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547] leading-relaxed resize-y"
              />
            </div>
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <span className="text-[11px] text-slate-500">
              {isSaved ? 'All notes updated in session.' : 'Uncommitted draft changes in editor.'}
            </span>
            <button
              onClick={handleSaveNotes}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Private Notes</span>
            </button>
          </div>
        </div>

        {/* Right: Client Action Requests & Shared Task Administration */}
        <div className="space-y-5">
          {/* Active Tasks & Due Dates */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Case Task Administration
              </h2>
              <button
                onClick={() => setActiveScreen('deadlines')}
                className="text-xs font-semibold text-[#0F2547] hover:underline"
              >
                Open Organizer →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {tasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-slate-900">{t.title}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      Assigned to: {t.assignedToName} • Due: {t.dueDate}
                    </div>
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded uppercase ${
                    t.sharedInCommonRoom ? 'bg-teal-50 text-teal-800 border border-teal-200' : 'bg-slate-200 text-slate-700'
                  }`}>
                    {t.sharedInCommonRoom ? 'Shared' : 'Private'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Records to Procure */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Missing Referenced Records
              </h2>
              <button
                onClick={() => setActiveScreen('missing_links')}
                className="text-xs font-semibold text-purple-900 hover:underline"
              >
                Graph View →
              </button>
            </div>

            <div className="space-y-2.5 text-xs">
              {missingLinks.map((ml) => (
                <div key={ml.id} className="p-3 rounded bg-purple-50/40 border border-purple-200">
                  <div className="flex items-center justify-between font-bold text-purple-950">
                    <span>{ml.documentTitle}</span>
                    <span className="text-[10px] text-rose-700 font-bold uppercase">{ml.urgency}</span>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">{ml.impactOnCase}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
