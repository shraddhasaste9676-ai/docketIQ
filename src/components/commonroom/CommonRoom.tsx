import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { ClientPortalView } from './ClientPortalView';
import { LawyerWorkspaceView } from './LawyerWorkspaceView';
import { JudiciaryInfoRoom } from './JudiciaryInfoRoom';
import { 
  Users2, 
  Scale, 
  Briefcase, 
  User
} from 'lucide-react';

export const CommonRoom: React.FC = () => {
  const { currentRole, setCurrentRole, caseInfo } = useCase();
  const [activeTab, setActiveTab] = useState<'shared_workspace' | 'judiciary'>('shared_workspace');

  return (
    <div className="space-y-6">
      {/* Common Room Banner */}
      <div className="bg-[#0F2547] text-white rounded-lg p-6 shadow-md">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-blue-900/60">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="p-1 rounded bg-teal-500/20 text-teal-300 border border-teal-400/30">
                <Users2 className="w-4 h-4 text-teal-300" />
              </span>
              <span className="text-xs uppercase font-bold tracking-wider text-teal-300">
                The Common Room • Core Collaborative Space
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              One Shared Case History. Clear Boundaries.
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Connecting authorized client <strong>{caseInfo.clientName}</strong> with legal counsel <strong>{caseInfo.lawyerName}</strong> through an approved, source-verified timeline and coordinated next steps.
            </p>
          </div>

          {/* Role Switching inside Common Room */}
          <div className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-700/80 text-xs shrink-0 space-y-1.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Perspective Switcher:
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCurrentRole('lawyer')}
                className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  currentRole === 'lawyer'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white bg-slate-800'
                }`}
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span>Counsel View</span>
              </button>
              <button
                onClick={() => setCurrentRole('client')}
                className={`px-3 py-1.5 rounded font-semibold text-xs transition-colors flex items-center gap-1.5 ${
                  currentRole === 'client'
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-300 hover:text-white bg-slate-800'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Client View</span>
              </button>
            </div>
          </div>
        </div>

        {/* Common Room Navigation Tabs */}
        <div className="flex items-center gap-4 pt-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('shared_workspace')}
            className={`pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'shared_workspace'
                ? 'border-teal-400 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users2 className="w-3.5 h-3.5" />
            <span>Shared Workspace ({currentRole === 'lawyer' ? 'Counsel View' : 'Client View'})</span>
          </button>

          <button
            onClick={() => setActiveTab('judiciary')}
            className={`pb-1 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'judiciary'
                ? 'border-teal-400 text-white font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Judiciary Information Room</span>
          </button>
        </div>
      </div>

      {/* Main Tab Views */}
      {activeTab === 'judiciary' ? (
        <JudiciaryInfoRoom />
      ) : (
        currentRole === 'client' ? <ClientPortalView /> : <LawyerWorkspaceView />
      )}
    </div>
  );
};
