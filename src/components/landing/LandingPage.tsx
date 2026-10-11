import React from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  ShieldCheck, 
  Split, 
  FileQuestion, 
  CalendarClock, 
  Users2, 
  Sparkles, 
  Languages, 
  FileSpreadsheet, 
  History, 
  ShieldAlert, 
  ArrowRight, 
  AlertTriangle, 
  Briefcase, 
  UserCheck, 
  Building2 
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveScreen, setCurrentRole } = useCase();

  return (
    <div className="space-y-20 pb-16">
      {/* HERO SECTION */}
      <section className="pt-12 sm:pt-16 pb-8 text-center max-w-4xl mx-auto px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-50 text-[#0F2547] border border-blue-200 text-xs font-semibold mb-6">
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>From Docket to Action. Every Event. Every Source. Every Next Step.</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
          Every case event. <br className="hidden sm:inline" />
          <span className="text-[#0F2547]">One traceable timeline.</span>
        </h1>

        <p className="mt-5 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
          DocketIQ organizes supplied case documents into a chronological, source-linked timeline. Identify conflicting dates, find missing records, manage case actions, and keep authorized clients and lawyers aligned.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
          <button
            onClick={() => {
              setCurrentRole('lawyer');
              setActiveScreen('dashboard');
            }}
            className="w-full sm:w-auto px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>Explore the Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              const el = document.getElementById('how-it-works-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-5 py-3 text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-50 border border-slate-300 rounded transition-colors shadow-xs"
          >
            See How It Works
          </button>
        </div>

        <p className="mt-4 text-[11px] text-slate-500 font-medium">
          Built for supplied case records. Designed for traceability and human review.
        </p>
      </section>

      {/* SUBSTANTIAL PRODUCT PREVIEW */}
      <section id="preview-section" className="max-w-6xl mx-auto px-4">
        <div className="rounded-xl border border-slate-300 bg-white shadow-xl overflow-hidden">
          <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              <span className="ml-2 font-mono text-[11px] font-bold text-slate-600">
                DocketIQ Case Workspace • DIQ-2026-0842-DEMO (Fictional Demonstration)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-amber-100 text-amber-900 px-2 py-0.5 rounded font-bold border border-amber-200">
                Live Interactive Component Preview
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-slate-50/50">
            <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-mono font-bold text-[#0F2547] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                  DIQ-2026-0842-DEMO
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  Shinde v. State Transport Corporation & Anr.
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Motor Accidents Claims Tribunal • Claim under S. 166 Motor Vehicles Act 1988
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setCurrentRole('lawyer');
                    setActiveScreen('common_room');
                  }}
                  className="px-3.5 py-1.5 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 rounded border border-teal-200 transition-colors inline-flex items-center gap-1.5"
                >
                  <Users2 className="w-3.5 h-3.5" />
                  <span>Open Common Room</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                      <CalendarClock className="w-4 h-4 text-[#0F2547]" />
                      <span>Chronological Case Event Stream</span>
                    </h4>
                    <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Source Verified
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 rounded border border-slate-200 text-xs flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-slate-700">12 Nov 2025</span>
                        <strong className="text-slate-900">Claim Petition Filed</strong>
                      </div>
                      <p className="text-slate-600 mt-0.5">
                        Claim Petition No. 842/2025 lodged before MACT Registry.
                      </p>
                      <span className="font-mono text-[10px] text-slate-500 mt-1 block">
                        Source: Petition.pdf [Page 1 Header]
                      </span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                      Verified
                    </span>
                  </div>

                  <div className="p-4 bg-rose-50/40 rounded border border-rose-300 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-rose-800 font-bold">
                        <AlertTriangle className="w-4 h-4 text-rose-600" />
                        <span>UNRESOLVED DATE CONFLICT: First Scheduled Hearing</span>
                      </div>
                      <span className="text-[10px] font-bold bg-rose-100 text-rose-900 px-2 py-0.5 rounded border border-rose-300">
                        Dual Records Preserved
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                      <div className="p-2.5 bg-white rounded border border-rose-200">
                        <div className="font-bold text-slate-900">Notice.pdf (Page 1)</div>
                        <div className="font-mono text-rose-700 font-bold">Hearing: 18 Jan 2026</div>
                        <p className="italic text-slate-600 mt-0.5">"Summoned to appear on 18th day of January 2026 at 11:00 AM..."</p>
                      </div>
                      <div className="p-2.5 bg-white rounded border border-rose-200">
                        <div className="font-bold text-slate-900">Order.pdf (Page 2)</div>
                        <div className="font-mono text-rose-700 font-bold">Adjourned: 25 Jan 2026</div>
                        <p className="italic text-slate-600 mt-0.5">"Matter stands adjourned to 25th January 2026 for written statement..."</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-5 rounded-lg border border-purple-200 shadow-xs bg-purple-50/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-purple-950 uppercase tracking-wider flex items-center gap-1.5">
                      <FileQuestion className="w-4 h-4 text-purple-700" />
                      <span>Missing Referenced Document</span>
                    </span>
                    <span className="text-[10px] font-bold bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded">
                      Critical
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">
                    Police Charge Sheet No. 402/2025
                  </h5>
                  <p className="text-xs text-purple-900 leading-relaxed">
                    Referenced in <strong>Order.pdf p. 3</strong> and <strong>Petition.pdf p. 4</strong> as primary proof of driver culpability, but missing from uploaded case files.
                  </p>
                </div>

                <div className="bg-white p-5 rounded-lg border border-amber-200 shadow-xs bg-amber-50/20 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-amber-950 uppercase tracking-wider flex items-center gap-1.5">
                      <CalendarClock className="w-4 h-4 text-amber-700" />
                      <span>Document-Derived Deadline</span>
                    </span>
                    <span className="font-mono font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                      21 Jan 2026
                    </span>
                  </div>
                  <h5 className="font-bold text-sm text-slate-900">
                    MSRTC Written Statement Filing Limit
                  </h5>
                  <p className="text-xs text-slate-600 font-mono italic">
                    "Strict 30-day forfeiture period fixed in Order.pdf [p. 3 para 5]"
                  </p>
                </div>

                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-xs space-y-1">
                  <span className="font-bold text-sky-900 uppercase tracking-wider text-[10px] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-sky-600" /> AI Case Insight
                  </span>
                  <div className="font-semibold text-slate-900">
                    Disability Quantum Divergence
                  </div>
                  <p className="text-slate-600 text-[11px]">
                    Claimant alleges 45% disability; respondent oral memo asserts 30%. Apex Medical Board assessment recommended.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEMS AND SOLUTIONS SECTION */}
      <section className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Built to solve real legal document friction.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-2">
            DocketIQ links information back to verifiable sources rather than asking legal practitioners to trust an unsupported AI summary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {[
            {
              problem: 'Case documents scattered across PDFs, orders, and emails.',
              solution: 'Unified source-verified timeline linking every event to its exact page and paragraph.'
            },
            {
              problem: 'Conflicting dates in summons versus interlocutory bench orders.',
              solution: 'Preserves dual-record conflicts side-by-side without arbitrarily guessing a winner.'
            },
            {
              problem: 'Referenced evidence absent from the supplied client bundle.',
              solution: 'Missing-Link Graph flags cited exhibits (e.g. Charge Sheets, Medical Reports) that are missing.'
            },
            {
              problem: 'Important court procedural deadlines buried in dense text.',
              solution: 'Strictly extracts explicitly stated legal deadlines with verbatim source sentences.'
            },
            {
              problem: 'Communication gaps between anxious clients and busy lawyers.',
              solution: 'The Common Room provides a shared, plain-language case history while keeping private notes confidential.'
            },
            {
              problem: 'Complex legal terminology confusing clients.',
              solution: 'Legal Language Simplifier translates provisions into English, Hindi, and Marathi.'
            }
          ].map((item, idx) => (
            <div key={idx} className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
              <div className="text-rose-700 font-bold flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                <span>Friction: {item.problem}</span>
              </div>
              <div className="text-slate-800 leading-relaxed font-medium pl-3 border-l-2 border-[#0F2547]">
                <strong>DocketIQ Resolution: </strong> {item.solution}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURE OVERVIEW (10 Capabilities) */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            System Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Ten core modules for rigorous case intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[
            {
              icon: <CalendarClock className="w-5 h-5 text-[#0F2547]" />,
              title: '1. Source-Verified Case Timeline',
              desc: 'Chronological timeline where every single event is anchored to its source document and verbatim passage.'
            },
            {
              icon: <ShieldAlert className="w-5 h-5 text-amber-600" />,
              title: '2. Evidence Integrity Gate',
              desc: 'Mandatory human verification layer. If an event has no verifiable source passage, verification is strictly blocked.'
            },
            {
              icon: <Split className="w-5 h-5 text-rose-600" />,
              title: '3. Contradiction Map',
              desc: 'Side-by-side comparison of divergent dates, amounts, and statements without discarding either source.'
            },
            {
              icon: <FileQuestion className="w-5 h-5 text-purple-600" />,
              title: '4. Missing-Link Graph',
              desc: 'Topological relationship graph identifying critical exhibits cited in court orders that are missing from the file.'
            },
            {
              icon: <CalendarClock className="w-5 h-5 text-teal-600" />,
              title: '5. Deadline and Action Organizer',
              desc: 'Clean separation between document-derived court deadlines and user-created operational tasks.'
            },
            {
              icon: <Users2 className="w-5 h-5 text-teal-700" />,
              title: '6. Common Room',
              desc: 'Shared workspace connecting authorized client and counsel with role boundaries for private work product.'
            },
            {
              icon: <Sparkles className="w-5 h-5 text-sky-600" />,
              title: '7. AI Case Insights',
              desc: 'Identifies evidence gaps and procedural scenarios with strict guardrails against outcome predictions.'
            },
            {
              icon: <Languages className="w-5 h-5 text-emerald-600" />,
              title: '8. Legal Language Simplifier',
              desc: 'Plain-language explanations in English, Hindi, and Marathi while preserving governing legal text.'
            },
            {
              icon: <History className="w-5 h-5 text-slate-600" />,
              title: '9. Version History & Audit Trail',
              desc: 'Immutable chronological ledger of uploads, reviewer approvals, conflict classifications, and edits.'
            },
            {
              icon: <FileSpreadsheet className="w-5 h-5 text-blue-600" />,
              title: '10. Source-Linked PDF Reports',
              desc: 'Print-ready case briefs compiling verified timelines, conflict logs, and disclaimers for court review.'
            }
          ].map((f, i) => (
            <div key={i} className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2.5">
              <div className="p-2 rounded bg-slate-50 w-fit border border-slate-200">
                {f.icon}
              </div>
              <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* COMMON ROOM PROMINENT SECTION */}
      <section id="common-room-section" className="max-w-6xl mx-auto px-4">
        <div className="bg-[#0F2547] text-white rounded-xl p-8 sm:p-12 shadow-xl space-y-8">
          <div className="max-w-2xl">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-300">
              The Common Room
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mt-1">
              One shared case history. Clear boundaries for every participant.
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-3 leading-relaxed">
              The Common Room gives authorized clients and lawyers a shared view of approved case events, documents, unresolved issues, and next actions. Private lawyer workspaces remain separate.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-teal-300 font-bold">
                <UserCheck className="w-4 h-4" />
                <span>Client Portal</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Plain-language case overview, approved timeline, shared documents, and tasks assigned to client.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-teal-900/60 border-2 border-teal-400 space-y-2 ring-2 ring-teal-400/20">
              <div className="flex items-center gap-2 text-white font-bold">
                <Users2 className="w-4 h-4 text-teal-300" />
                <span>The Common Room</span>
              </div>
              <p className="text-teal-100 text-[11px] leading-relaxed">
                The collaboration layer connecting client and lawyer with source-verified timeline and open questions.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-blue-300 font-bold">
                <Briefcase className="w-4 h-4" />
                <span>Lawyer Workspace</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Full evidence review queue, integrity gate, contradiction map, and confidential attorney work product notes.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-slate-900/90 border border-slate-700 space-y-2">
              <div className="flex items-center gap-2 text-amber-300 font-bold">
                <Building2 className="w-4 h-4" />
                <span>Judiciary Info Room</span>
              </div>
              <p className="text-slate-300 text-[11px] leading-relaxed">
                Contextual statutory reference guide (S. 166 MV Act, CPC Order 8). Information only, not an actual court.
              </p>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs text-slate-300 border-t border-blue-900/80">
            <span>Notice: The Common Room is a collaboration layer, not a court or judicial registry service.</span>
            <button
              onClick={() => {
                setCurrentRole('client');
                setActiveScreen('common_room');
              }}
              className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold rounded transition-colors"
            >
              Enter Common Room Demo →
            </button>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS (4 Steps) */}
      <section id="how-it-works-section" className="max-w-5xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Methodology
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            How DocketIQ organizes case intelligence.
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          {[
            {
              step: '01',
              title: 'Upload supplied documents',
              desc: 'Upload electronic petitions, summons, orders, or police charge sheets in PDF, DOCX, or TXT.'
            },
            {
              step: '02',
              title: 'Extract events and passages',
              desc: 'System indexes dates, participants, and citations with verbatim source passages.'
            },
            {
              step: '03',
              title: 'Review conflicts & missing links',
              desc: 'Evidence Integrity Gate verifies records, reconciles contradictory dates, and flags missing files.'
            },
            {
              step: '04',
              title: 'Coordinate and export reports',
              desc: 'Collaborate in the Common Room and export source-linked printable case reports.'
            }
          ].map((s, idx) => (
            <div key={idx} className="p-5 bg-white rounded-lg border border-slate-200 shadow-xs space-y-2">
              <span className="text-xs font-mono font-bold text-[#0F2547] bg-slate-100 px-2 py-0.5 rounded">
                Step {s.step}
              </span>
              <h3 className="text-sm font-bold text-slate-900 mt-2">{s.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PRIVACY AND TRUST */}
      <section id="trust-section" className="max-w-5xl mx-auto px-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 shadow-xs space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-lg font-bold text-slate-900">
              Security, Privacy, and Verifiable Trust
            </h2>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            DocketIQ is designed around source traceability, role-based access, human review, and careful handling of case information. In this demonstration prototype, data is processed locally in browser session memory. We do not make unverified claims about encryption certifications or regulatory compliance until production deployment has been audited.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="block text-slate-800">Source Traceability:</strong>
              <span className="text-slate-600">Every claim links to an identifiable document passage.</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="block text-slate-800">Role Boundaries:</strong>
              <span className="text-slate-600">Confidential lawyer strategy remains strictly separate.</span>
            </div>
            <div className="p-3 rounded bg-slate-50 border border-slate-200">
              <strong className="block text-slate-800">No Outcome Predictions:</strong>
              <span className="text-slate-600">AI outputs never replace licensed legal counsel judgment.</span>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="text-center max-w-3xl mx-auto px-4 pt-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Make the case history easier to follow.
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Start with supplied documents and turn scattered records into an organized, reviewable case workspace.
        </p>
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setCurrentRole('lawyer');
              setActiveScreen('dashboard');
            }}
            className="px-6 py-3 text-xs sm:text-sm font-bold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Explore the Demo</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
