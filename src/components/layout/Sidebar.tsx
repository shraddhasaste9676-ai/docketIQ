import React from 'react';
import { useCase } from '../../context/CaseContext';
import { ActiveScreen } from '../../types';
import { 
  LayoutDashboard, 
  FolderLock, 
  ShieldCheck, 
  CalendarClock, 
  Split, 
  Network, 
  CalendarCheck2, 
  Sparkles, 
  Languages, 
  FileSpreadsheet, 
  History, 
  Users2, 
  Lock,
  ChevronRight
} from 'lucide-react';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, onClose }) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    currentRole,
    timelineEvents,
    contradictions,
    missingLinks
  } = useCase();

  const pendingEventsCount = timelineEvents.filter(e => e.status === 'unsupported' || e.status === 'pending').length;
  const unresolvedConflictsCount = contradictions.filter(c => c.status === 'unresolved').length;
  const missingLinksCount = missingLinks.filter(m => m.currentStatus !== 'obtained').length;

  interface NavItem {
    id: ActiveScreen;
    label: string;
    icon: React.ReactNode;
    badge?: number;
    badgeType?: 'warning' | 'danger' | 'info';
    lawyerOnly?: boolean;
  }

  const primaryItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Case Overview',
      icon: <LayoutDashboard className="w-4 h-4" />
    },
    {
      id: 'common_room',
      label: 'Common Room',
      icon: <Users2 className="w-4 h-4 text-teal-600" />
    },
    {
      id: 'timeline',
      label: 'Interactive Timeline',
      icon: <CalendarClock className="w-4 h-4" />
    },
    {
      id: 'documents',
      label: 'Document Records',
      icon: <FolderLock className="w-4 h-4" />
    },
    {
      id: 'evidence_gate',
      label: 'Evidence Integrity Gate',
      icon: <ShieldCheck className="w-4 h-4 text-amber-600" />,
      badge: pendingEventsCount,
      badgeType: 'warning',
      lawyerOnly: false
    },
    {
      id: 'contradictions',
      label: 'Contradiction Map',
      icon: <Split className="w-4 h-4 text-rose-600" />,
      badge: unresolvedConflictsCount,
      badgeType: 'danger'
    },
    {
      id: 'missing_links',
      label: 'Missing-Link Graph',
      icon: <Network className="w-4 h-4 text-purple-600" />,
      badge: missingLinksCount,
      badgeType: 'warning'
    },
    {
      id: 'deadlines',
      label: 'Deadlines & Tasks',
      icon: <CalendarCheck2 className="w-4 h-4" />
    },
    {
      id: 'insights',
      label: 'AI Case Insights',
      icon: <Sparkles className="w-4 h-4 text-sky-600" />
    },
    {
      id: 'simplifier',
      label: 'Legal Simplifier',
      icon: <Languages className="w-4 h-4 text-emerald-600" />
    },
    {
      id: 'reports',
      label: 'Source Reports',
      icon: <FileSpreadsheet className="w-4 h-4" />
    },
    {
      id: 'audit',
      label: 'Audit Trail & History',
      icon: <History className="w-4 h-4" />
    }
  ];

  const handleNavClick = (screen: ActiveScreen) => {
    setActiveScreen(screen);
    if (onClose) onClose();
  };

  return (
    <>
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside className={`
        fixed md:sticky top-16 left-0 z-30 h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 
        flex flex-col transition-transform duration-200 ease-in-out shrink-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        {/* Role & Boundary Indicator Header */}
        <div className="p-3.5 border-b border-slate-200 bg-slate-50/80">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Active Scope
            </span>
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border ${
              currentRole === 'lawyer' 
                ? 'bg-blue-50 text-[#0F2547] border-blue-200' 
                : 'bg-teal-50 text-teal-800 border-teal-200'
            }`}>
              {currentRole === 'lawyer' ? 'Counsel View' : 'Client View'}
            </span>
          </div>
          <div className="mt-1 text-xs font-semibold text-slate-900 truncate">
            {currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Ananya R. Shinde'}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {currentRole === 'lawyer' 
              ? 'Full evidentiary administration & private notes' 
              : 'Authorized client view & shared timeline'}
          </p>
        </div>

        {/* Navigation Item List */}
        <div className="flex-1 overflow-y-auto px-2.5 py-3 space-y-1">
          {primaryItems.map((item) => {
            const isActive = activeScreen === item.id;
            const isCommonRoom = item.id === 'common_room';

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded transition-colors text-left group ${
                  isActive
                    ? isCommonRoom
                      ? 'bg-teal-50 text-teal-900 font-bold border border-teal-200'
                      : 'bg-slate-100 text-[#0F2547] font-bold border border-slate-200'
                    : isCommonRoom
                      ? 'text-teal-900 hover:bg-teal-50/60 font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`${isActive ? 'text-[#0F2547]' : 'text-slate-500 group-hover:text-slate-800'}`}>
                    {item.icon}
                  </span>
                  <span className="truncate">{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                      item.badgeType === 'danger'
                        ? 'bg-rose-100 text-rose-800'
                        : item.badgeType === 'warning'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3 h-3 text-slate-400" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom Safety / Traceability Badge */}
        <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold mb-1">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Evidentiary Integrity</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-tight">
            Every event links directly to its verbatim source passage.
          </p>
        </div>
      </aside>
    </>
  );
};
