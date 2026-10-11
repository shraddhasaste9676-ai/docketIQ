import React from 'react';
import { JUDICIARY_INFO_SECTIONS } from '../../data/mockData';
import { Scale, AlertCircle } from 'lucide-react';

export const JudiciaryInfoRoom: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Scale className="w-4 h-4 text-[#0F2547]" />
            <span>Judiciary Information Room (Statutory Reference Guide)</span>
          </h2>
          <p className="text-xs text-slate-600 mt-0.5">
            Verified statutory references and procedural rules applicable to the forum (Motor Accidents Claims Tribunal).
          </p>
        </div>
      </div>

      {/* Prominent Judicial Boundary Safeguard */}
      <div className="p-4 rounded-lg bg-slate-900 text-white text-xs space-y-2 border border-slate-800">
        <div className="flex items-center gap-2 text-amber-300 font-bold">
          <AlertCircle className="w-4 h-4 text-amber-300" />
          <span>Informational Legal Reference Notice</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-[11px]">
          The Judiciary Information Room provides legal reference information only. It is not an actual judge, court, or tribunal, and is not connected to live judicial registry servers. It does not decide which provisions apply or substitute for advice from qualified counsel.
        </p>
      </div>

      {/* Statutory Provisions List */}
      <div className="space-y-4">
        {JUDICIARY_INFO_SECTIONS.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {item.act}
                </span>
                <h3 className="text-sm font-bold text-slate-900 mt-1">
                  {item.section}
                </h3>
                <div className="text-xs text-slate-700 font-semibold mt-0.5">
                  {item.title}
                </div>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded border border-slate-200 text-xs text-slate-800 leading-relaxed">
              <strong className="block text-[11px] text-slate-600 uppercase tracking-wide mb-1">
                Statutory Summary:
              </strong>
              {item.explanation}
            </div>

            <div className="p-3 bg-blue-50/50 rounded border border-blue-200 text-xs text-blue-950">
              <strong className="block text-[11px] text-blue-900 mb-0.5">
                Practical Application to Case Records:
              </strong>
              {item.practicalImpact}
            </div>

            <div className="text-[10px] text-slate-400 italic pt-1">
              {item.disclaimer}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
