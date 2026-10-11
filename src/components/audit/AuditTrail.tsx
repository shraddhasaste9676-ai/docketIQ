import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  History, 
  Search, 
  Filter, 
  CheckCircle2, 
  FolderPlus, 
  Sparkles, 
  Edit3, 
  XCircle, 
  Split, 
  CalendarCheck
} from 'lucide-react';

export const AuditTrail: React.FC = () => {
  const { auditLog } = useCase();
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | 'lawyer' | 'client' | 'system'>('all');

  const filteredLogs = auditLog.filter((entry) => {
    const matchesSearch = entry.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          entry.actor.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (entry.details && entry.details.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesRole = roleFilter === 'all' || entry.actorRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getActionIcon = (type: string) => {
    switch (type) {
      case 'document_upload':
        return <FolderPlus className="w-4 h-4 text-[#0F2547]" />;
      case 'event_extracted':
        return <Sparkles className="w-4 h-4 text-sky-600" />;
      case 'event_approved':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'event_rejected':
        return <XCircle className="w-4 h-4 text-rose-600" />;
      case 'event_edited':
        return <Edit3 className="w-4 h-4 text-amber-600" />;
      case 'conflict_flagged':
      case 'conflict_reviewed':
        return <Split className="w-4 h-4 text-rose-600" />;
      case 'task_created':
      case 'task_status_changed':
        return <CalendarCheck className="w-4 h-4 text-teal-600" />;
      default:
        return <History className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-50 text-[#0F2547] border border-blue-200">
              <History className="w-4 h-4 text-[#0F2547]" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Version History & Audit Trail
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Immutable chronological ledger recording document uploads, reviewer approvals, conflict resolutions, and evidentiary edits.
          </p>
        </div>

        <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
          {auditLog.length} Recorded Entries (Fictional Demo Log)
        </span>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search audit actions, actors, or records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-slate-500">Filter by Actor:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as any)}
            className="py-1 px-2.5 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700"
          >
            <option value="all">All Actors</option>
            <option value="lawyer">Counsel (Lawyer)</option>
            <option value="client">Client</option>
            <option value="system">System AI Pipeline</option>
          </select>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Timestamp & ID</th>
                <th className="py-3 px-4">Actor & Role</th>
                <th className="py-3 px-4">Action Summary</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-mono text-slate-900 font-semibold">
                      {new Date(entry.timestamp).toLocaleDateString()} {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="font-mono text-[10px] text-slate-400 mt-0.5">
                      {entry.id}
                    </div>
                  </td>

                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="font-bold text-slate-900">{entry.actor}</div>
                    <span className={`inline-block text-[10px] uppercase font-semibold px-1.5 py-0.2 rounded mt-0.5 ${
                      entry.actorRole === 'lawyer'
                        ? 'bg-blue-50 text-[#0F2547] border border-blue-200'
                        : entry.actorRole === 'client'
                          ? 'bg-teal-50 text-teal-800 border border-teal-200'
                          : 'bg-slate-100 text-slate-600'
                    }`}>
                      {entry.actorRole}
                    </span>
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-slate-100 shrink-0">
                        {getActionIcon(entry.actionType)}
                      </div>
                      <span className="font-semibold text-slate-900">
                        {entry.summary}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4 text-slate-600 max-w-md">
                    {entry.details ? (
                      <p className="text-[11px] leading-relaxed">
                        {entry.details}
                      </p>
                    ) : (
                      <span className="text-slate-400 italic">No additional metadata</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No audit records found matching the filter criteria.
          </div>
        )}
      </div>
    </div>
  );
};
