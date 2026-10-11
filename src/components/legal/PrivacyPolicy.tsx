import React from 'react';
import { useCase } from '../../context/CaseContext';
import { Shield, ArrowLeft } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
          <Shield className="w-5 h-5 text-[#0F2547]" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            DocketIQ Legal Governance
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-xs text-slate-500 mt-1 font-medium">
          Effective Date: January 1, 2026 • Status: Operating Protocol (Draft for Demonstration Mode)
        </p>
      </div>

      {/* Body Content */}
      <div className="prose prose-slate max-w-none text-xs leading-relaxed space-y-6 text-slate-700">
        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            1. Nature of the Service & Information Processed
          </h2>
          <p>
            DocketIQ is an evidentiary organization platform designed to process electronic case records voluntarily supplied by authorized legal practitioners and their clients. The application is architected to parse text passages from case documents (including petitions, orders, summons, and police charge sheets), index chronological references, and surface potential factual discrepancies.
          </p>
          <p>
            In this prototype demonstration environment, all data processing takes place entirely within local browser memory. No uploaded files, case notes, or personal identifying data are transmitted to or stored on persistent remote application databases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            2. Purpose of Document Processing
          </h2>
          <p>
            Case documents and metadata uploaded to DocketIQ are processed solely to:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Extract candidate event dates, titles, and verbatim source passages for human review.</li>
            <li>Detect temporal contradictions between separate records (e.g., appearance dates in summons vs bench orders).</li>
            <li>Identify references to documents that are absent from the supplied case archive.</li>
            <li>Facilitate shared coordination between authorized clients and counsel through the Common Room.</li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            3. Role-Based Access Boundaries
          </h2>
          <p>
            DocketIQ maintains strict logical boundaries between user roles:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Counsel Workspace:</strong> Access to full case administration, raw extraction logs, conflict classification tools, and confidential attorney work product notes. Private notes recorded in the Counsel Workspace are structurally partitioned and are never automatically shared with the client.
            </li>
            <li>
              <strong>Client Portal:</strong> Access strictly limited to documents, verified timeline entries, and tasks approved for shared visibility by counsel.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            4. Data Retention and Erasure
          </h2>
          <p>
            In demonstration mode, all session state is temporary. Refreshing or clearing the browser storage completely erases any uploaded records or local task modifications. In future production enterprise configurations, document retention periods will be configured in accordance with applicable bar council preservation regulations and client instruction.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wide">
            5. Third-Party Disclosures & Security Disclaimers
          </h2>
          <p>
            DocketIQ does not sell, rent, or monetize client case data. In this standalone frontend prototype, no external telemetry or third-party AI APIs are invoked. We make no unverified claims regarding SOC-2 or ISO compliance certifications until third-party security audits are executed on production backend infrastructure.
          </p>
        </section>
      </div>
    </div>
  );
};
