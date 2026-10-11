import React from 'react';
import { useCase } from '../../context/CaseContext';
import { Logo } from '../brand/Logo';
import { ShieldCheck, Scale } from 'lucide-react';

const CURRENT_YEAR = 2026;

export const Footer: React.FC = () => {
  const { setActiveScreen, setIsChecklistOpen } = useCase();

  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <Logo size="md" showTagline />
            <p className="text-slate-500 leading-relaxed text-xs">
              AI-powered legal case intelligence and coordination platform. Built for supplied case records, designed for traceability and human review.
            </p>
            <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Evidence Integrity Guaranteed</span>
            </div>
          </div>

          {/* Navigation Columns */}
          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Product & Modules
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveScreen('timeline')}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  Source-Verified Timeline
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('evidence_gate')}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  Evidence Integrity Gate
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('contradictions')}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  Contradiction Map
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('missing_links')}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  Missing-Link Graph
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('insights')}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  AI Case Insights
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Collaboration & Governance
            </h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => setActiveScreen('common_room')}
                  className="hover:text-[#0F2547] text-left transition-colors font-medium text-[#0F2547]"
                >
                  The Common Room
                </button>
              </li>
              <li>
                <button 
                  onClick={() => {
                    const el = document.getElementById('trust-section');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                    else setActiveScreen('landing');
                  }}
                  className="hover:text-[#0F2547] text-left transition-colors"
                >
                  Security & Privacy Architecture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('privacy')}
                  className="hover:text-[#0F2547] text-left transition-colors font-semibold"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveScreen('terms')}
                  className="hover:text-[#0F2547] text-left transition-colors font-semibold"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setIsChecklistOpen(true)}
                  className="hover:text-[#0F2547] text-left transition-colors text-amber-700 font-semibold"
                >
                  Launch Checklist
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 text-xs uppercase tracking-wider">
              Operational Boundaries
            </h4>
            <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1.5 text-[11px] leading-relaxed text-slate-600">
              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                <Scale className="w-3.5 h-3.5 text-slate-600" />
                <span>Notice of Scope</span>
              </div>
              <p>
                DocketIQ organizes supplied electronic case records into a verifiable chronology. It does not provide legal advice, calculate judicial outcome probabilities, or connect directly to live court systems.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {CURRENT_YEAR} DocketIQ. Built for supplied case records. Designed for traceability and human review.
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setActiveScreen('privacy')} 
              className="hover:underline"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveScreen('terms')} 
              className="hover:underline"
            >
              Terms & Conditions
            </button>
            <span>•</span>
            <button 
              onClick={() => setActiveScreen('reports')} 
              className="hover:underline"
            >
              Traceable Case Reports
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
