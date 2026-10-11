import React from 'react';
import { useCase } from '../../context/CaseContext';
import { Scale, ArrowLeft } from 'lucide-react';

export const TermsConditions: React.FC = () => {
  const { setActiveScreen } = useCase();

  return (
    <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveScreen('landing')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0F2547] hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Product Overview</span>
        </button>
      </div>

      {/* Header */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center gap-2 mb-2">
          <Scale className="w-5 h-5 text-[#0F2547]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            DocketIQ Legal Governance
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Terms & Conditions of Service
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Effective Date: January 1, 2026 • Status: Operating Protocol (Draft for Demonstration Mode)
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-6 text-slate-700">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            1. Intended Purpose of DocketIQ
          </h2>
          <p>
            DocketIQ is designed exclusively as an evidentiary management and case timeline coordination tool. It is intended to assist legal practitioners and their authorized clients in structuring supplied case records, identifying missing referenced documents, and highlighting factual contradictions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            2. Distinction Between Legal Information and Legal Advice
          </h2>
          <div className="p-3.5 bg-amber-50 rounded border border-amber-200 text-amber-950">
            <strong>Critical Notice: </strong> DocketIQ does not provide legal advice, does not practice law, does not evaluate the substantive legal merits of a claim, and does not predict the likelihood of judicial success. All statutory summaries provided in the Judiciary Information Room are for contextual reference only.
          </div>
          <p>
            Use of DocketIQ does not establish an attorney-client relationship between the platform operators and any user. Authorized clients must consult their designated licensed counsel for all legal decisions.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            3. User Verification & Evidence Integrity Gate
          </h2>
          <p>
            Users acknowledge that AI-assisted data extraction is probabilistic and must be independently verified by a human reviewer. The Evidence Integrity Gate requires counsel to verify that each extracted date, event, and claim corresponds to an authentic verbatim source passage before treating it as verified. DocketIQ accepts no liability for decisions made on the basis of unverified candidate data.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            4. Absence of Live Court System Endorsement
          </h2>
          <p>
            DocketIQ is an independent technology platform. It is not affiliated with, endorsed by, or connected to any government court registry, judicial data repository, or tribunal administration. Fictional demo records provided in this instance are purely illustrative.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            5. Governing Law and Amendments
          </h2>
          <p>
            These Terms shall be interpreted in accordance with applicable civic technology and public system service frameworks. Terms may be updated to reflect changes in regulatory standards or backend integration capabilities.
          </p>
        </section>
      </div>
    </div>
  );
};
