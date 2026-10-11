import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  FileText, 
  CalendarClock, 
  CheckCircle2, 
  Send, 
  MessageSquare, 
  Clock 
} from 'lucide-react';

export const ClientPortalView: React.FC = () => {
  const { 
    caseInfo, 
    timelineEvents, 
    documents, 
    tasks, 
    missingLinks, 
    openCitationModal,
    showToast 
  } = useCase();

  // Interactive client question response state
  const [clientAnswers, setClientAnswers] = useState<{ [key: string]: string }>({
    'q-01': 'I visited Civil Hospital yesterday; the medical clerk informed me the discharge summary with round seal will be ready on Tuesday.'
  });
  const [newResponse, setNewResponse] = useState('');

  // Events approved for client view in Common Room
  const clientApprovedEvents = timelineEvents.filter(e => e.inCommonRoom && e.status !== 'rejected');
  
  // Client tasks
  const clientTasks = tasks.filter(t => t.sharedInCommonRoom && t.assignedRole === 'client');
  
  // Documents client has permission to view
  const sharedDocs = documents.filter(d => d.status === 'verified');

  const handleSendResponse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResponse.trim()) return;

    setClientAnswers(prev => ({
      ...prev,
      [`resp-${Date.now()}`]: newResponse
    }));
    setNewResponse('');
    showToast('Your update has been recorded in the Common Room demonstration log.', 'success');
  };

  return (
    <div className="space-y-6">
      {/* Client Overview Card */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-4 border-b border-slate-100">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
              Client Portal View • {caseInfo.clientName}
            </span>
            <h1 className="text-xl font-bold text-slate-900 mt-1">
              Case Status: {caseInfo.caseTitle}
            </h1>
            <div className="text-xs text-slate-600 mt-0.5">
              Assigned Legal Counsel: <strong>{caseInfo.lawyerName}</strong> ({caseInfo.lawyerFirm})
            </div>
          </div>
          <div className="text-right text-xs">
            <span className="font-mono text-slate-500 font-semibold">{caseInfo.internalReference}</span>
          </div>
        </div>

        {/* Plain Language Summary */}
        <div className="p-4 bg-teal-50/50 rounded-lg border border-teal-200 text-xs text-teal-950 space-y-2">
          <div className="font-bold text-teal-900 text-sm flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-teal-700" />
            <span>Plain-Language Case Progress Summary</span>
          </div>
          <p className="leading-relaxed">
            Your claim petition has been formally registered with the Motor Accidents Claims Tribunal. The court has served summons on the State Road Transport Corporation. The tribunal bench has directed the corporation to submit its written reply by <strong>January 21, 2026</strong>. 
          </p>
          <p className="leading-relaxed">
            The next court date is scheduled for late January. Please review the items requested below to assist Adv. Deshmukh in preparing your evidence.
          </p>
        </div>
      </div>

      {/* Grid: Actions Requested from You vs Shared Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Requested Documents & Tasks for Client */}
        <div className="space-y-5">
          {/* Action Items for Client */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-teal-700" />
                <span>Tasks Assigned to You ({clientTasks.length})</span>
              </h2>
            </div>

            <div className="space-y-3">
              {clientTasks.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900">{t.title}</span>
                    <span className="font-mono text-[10px] font-bold text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded shrink-0">
                      Due: {t.dueDate}
                    </span>
                  </div>
                  {t.notes && (
                    <p className="text-[11px] text-slate-600 italic">
                      "{t.notes}"
                    </p>
                  )}
                  <div className="text-[10px] text-slate-400 pt-0.5">
                    Status: <strong className="capitalize text-slate-700">{t.status.replace('_', ' ')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Records Requested by Counsel */}
          <div className="bg-white rounded-lg border border-purple-200 p-5 shadow-xs bg-purple-50/20">
            <h2 className="text-xs font-bold text-purple-950 uppercase tracking-wider mb-2">
              Records Requested from You
            </h2>
            <p className="text-xs text-purple-800 mb-3">
              Counsel requires these original certificates to establish liability and medical quantum:
            </p>

            <div className="space-y-2.5 text-xs">
              {missingLinks.filter(m => m.currentStatus === 'requested_from_client').map((m) => (
                <div key={m.id} className="p-3 bg-white rounded border border-purple-200">
                  <div className="font-bold text-slate-900">{m.documentTitle}</div>
                  <div className="text-[11px] text-slate-600 mt-0.5">{m.impactOnCase}</div>
                  <div className="mt-2 text-[10px] text-purple-900 font-bold uppercase">
                    Urgency: {m.urgency}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Open Questions & Responses */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#0F2547]" />
              <span>Provide Case Information</span>
            </h2>

            <div className="space-y-2 mb-3 text-xs">
              <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-slate-700">
                <strong className="block text-slate-900 mb-1">
                  Counsel Question:
                </strong>
                "Have you obtained the final signed discharge card from Civil Hospital with official doctor seal?"
              </div>

              {Object.entries(clientAnswers).map(([k, val]) => (
                <div key={k} className="p-2.5 bg-teal-50 rounded border border-teal-200 text-teal-950 text-xs">
                  <span className="font-bold text-[10px] text-teal-800 uppercase block mb-0.5">Your Recorded Note:</span>
                  {val}
                </div>
              ))}
            </div>

            <form onSubmit={handleSendResponse} className="space-y-2">
              <textarea
                rows={2}
                value={newResponse}
                onChange={(e) => setNewResponse(e.target.value)}
                placeholder="Type an update or question for your counsel..."
                className="w-full p-2 text-xs bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
              />
              <button
                type="submit"
                className="w-full py-1.5 text-xs font-semibold text-white bg-teal-800 hover:bg-teal-900 rounded transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Send className="w-3 h-3" />
                <span>Submit Update</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Approved Shared Timeline & Documents */}
        <div className="lg:col-span-2 space-y-5">
          {/* Approved Shared Timeline */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-teal-800" />
                <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Shared Case Timeline ({clientApprovedEvents.length})
                </h2>
              </div>
              <span className="text-[11px] text-slate-500">
                Approved by Counsel for Shared Access
              </span>
            </div>

            <div className="divide-y divide-slate-100 text-xs">
              {clientApprovedEvents.map((ev) => (
                <div key={ev.id} className="py-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                        {ev.displayDate}
                      </span>
                      <strong className="text-slate-900 text-sm">{ev.title}</strong>
                    </div>
                    {ev.isConflict ? (
                      <span className="text-[10px] font-bold text-rose-800 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                        Date Review in Progress
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        Source Verified
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 leading-relaxed text-xs">
                    {ev.description}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <button
                      onClick={() => openCitationModal(ev.primaryCitation)}
                      className="text-[#0F2547] hover:underline font-semibold flex items-center gap-1"
                    >
                      <FileText className="w-3 h-3" />
                      <span>Source: {ev.primaryCitation.documentTitle} [p. {ev.primaryCitation.pageNumber || '1'}]</span>
                    </button>
                    <span className="text-slate-400 text-[10px]">
                      Verified by Adv. Rohit V. Deshmukh
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shared Case Documents */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
              Approved Case Documents ({sharedDocs.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {sharedDocs.map((doc) => (
                <div key={doc.id} className="p-3 bg-slate-50 rounded border border-slate-200 flex items-start justify-between gap-2">
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-900">{doc.fileName}</div>
                    <div className="text-[11px] text-slate-500">{doc.title}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{doc.fileSize} • {doc.pageCount} pgs</div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 shrink-0">
                    Approved
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
