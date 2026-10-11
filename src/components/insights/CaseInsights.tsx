import React from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  Sparkles, 
  CheckCircle2, 
  Scale
} from 'lucide-react';

export const CaseInsights: React.FC = () => {
  const { insights, setActiveScreen } = useCase();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
              <Sparkles className="w-4 h-4 text-sky-700" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              AI Case Insights & Evidentiary Scenarios
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Structural analysis of evidentiary gaps, procedural questions, and scenario preparations based strictly on supplied records.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-700 font-semibold border border-slate-200">
            {insights.length} Structured Insights
          </span>
        </div>
      </div>

      {/* Mandatory Safeguard Disclaimer Card */}
      <div className="p-4 rounded-lg bg-slate-900 text-white text-xs space-y-2 border border-slate-800 shadow-xs">
        <div className="flex items-center gap-2 font-bold text-amber-300">
          <Scale className="w-4 h-4 text-amber-300" />
          <span>Legal Intelligence Safeguard & Professional Boundary Notice</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          DocketIQ identifies observable inconsistencies, missing referenced records, and procedural scenarios. <strong>It does not predict legal outcomes, calculate win/loss probabilities, or provide professional legal advice.</strong> All procedural insights require independent verification by qualified legal counsel.
        </p>
      </div>

      {/* Insight Cards */}
      <div className="space-y-5">
        {insights.map((ins) => {
          const isHypothetical = ins.classification.includes('Hypothetical');
          const isDisputed = ins.classification.includes('Disputed');

          return (
            <div 
              key={ins.id}
              className={`rounded-lg border shadow-xs overflow-hidden ${
                isHypothetical 
                  ? 'bg-white border-purple-200' 
                  : isDisputed 
                    ? 'bg-white border-amber-200' 
                    : 'bg-white border-slate-200'
              }`}
            >
              {/* Card Header */}
              <div className="px-5 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                    isHypothetical 
                      ? 'bg-purple-50 text-purple-900 border-purple-200' 
                      : isDisputed 
                        ? 'bg-amber-50 text-amber-900 border-amber-200' 
                        : 'bg-blue-50 text-[#0F2547] border-blue-200'
                  }`}>
                    {ins.classification}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  Insight Ref: {ins.id}
                </span>
              </div>

              {/* Title & Explanation */}
              <div className="p-5 space-y-3">
                <h2 className="text-base font-bold text-slate-900">
                  {ins.title}
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ins.explanation}
                </p>

                {/* Supporting Source References */}
                <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs space-y-1">
                  <span className="font-semibold text-slate-700 block text-[11px] uppercase tracking-wider">
                    Supporting Evidentiary Citations:
                  </span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {ins.supportingSourceRefs.map((ref, idx) => (
                      <span 
                        key={idx} 
                        className="font-mono text-[11px] bg-white px-2 py-0.5 rounded border border-slate-300 text-slate-800"
                      >
                        {ref}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Assumptions and Uncertainty Box */}
                <div className="p-3 bg-amber-50/50 rounded border border-amber-200/80 text-xs text-amber-950">
                  <strong className="block text-[11px] text-amber-900 mb-0.5">
                    Assumptions & Identified Uncertainty:
                  </strong>
                  <p className="leading-relaxed">
                    {ins.assumptionsAndUncertainties}
                  </p>
                </div>

                {/* Suggested Organizational Next Step */}
                <div className="p-3 bg-emerald-50/40 rounded border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-[11px] text-emerald-900 mb-0.5">
                      Suggested Organizational Next Step:
                    </strong>
                    <p className="leading-relaxed">
                      {ins.suggestedNextStep}
                    </p>
                  </div>
                </div>
              </div>

              {/* Caveat Footer */}
              <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                <span className="italic">{ins.legalCaveat}</span>
                <button
                  onClick={() => setActiveScreen('deadlines')}
                  className="font-semibold text-[#0F2547] hover:underline shrink-0 ml-2"
                >
                  Create Task from Insight →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
