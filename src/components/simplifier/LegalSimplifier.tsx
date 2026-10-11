import React, { useState } from 'react';
import { LEGAL_SIMPLIFIER_PASSAGES } from '../../data/mockData';
import { 
  Languages, 
  FileText, 
  Check, 
  Copy, 
  Scale, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { useCase } from '../../context/CaseContext';

export const LegalSimplifier: React.FC = () => {
  const { openCitationModal } = useCase();

  const [selectedPassageId, setSelectedPassageId] = useState(LEGAL_SIMPLIFIER_PASSAGES[0].id);
  const [selectedLanguage, setSelectedLanguage] = useState<'english' | 'hindi' | 'marathi'>('english');
  const [copied, setCopied] = useState(false);

  const activePassage = LEGAL_SIMPLIFIER_PASSAGES.find(p => p.id === selectedPassageId) || LEGAL_SIMPLIFIER_PASSAGES[0];

  const handleCopy = () => {
    const textToCopy = activePassage[selectedLanguage];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Languages className="w-4 h-4 text-emerald-700" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Legal Language Simplifier
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Translates complex judicial clauses into plain, understandable language in English, Hindi (हिंदी), and Marathi (मराठी) without altering original legal record text.
          </p>
        </div>

        {/* Language Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded border border-slate-200">
          <button
            onClick={() => setSelectedLanguage('english')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              selectedLanguage === 'english'
                ? 'bg-white text-[#0F2547] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            English
          </button>
          <button
            onClick={() => setSelectedLanguage('hindi')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              selectedLanguage === 'hindi'
                ? 'bg-white text-[#0F2547] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            हिंदी (Hindi)
          </button>
          <button
            onClick={() => setSelectedLanguage('marathi')}
            className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
              selectedLanguage === 'marathi'
                ? 'bg-white text-[#0F2547] shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            मराठी (Marathi)
          </button>
        </div>
      </div>

      {/* Passage Selector Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {LEGAL_SIMPLIFIER_PASSAGES.map((p) => (
          <button
            key={p.id}
            onClick={() => setSelectedPassageId(p.id)}
            className={`p-3.5 rounded-lg border text-left transition-all text-xs ${
              selectedPassageId === p.id
                ? 'bg-white border-[#0F2547] shadow-xs ring-1 ring-[#0F2547]'
                : 'bg-white border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="font-bold text-slate-900 mb-1">{p.title}</div>
            <div className="text-[11px] text-slate-500 font-mono">{p.sourceRef}</div>
          </button>
        ))}
      </div>

      {/* Main Dual View: Original Verbatim vs Simplified Plain Language */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Original Verbatim Legal Passage */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#0F2547]" />
                <span>Original Case Record Text</span>
              </span>
              <span className="text-xs font-mono text-slate-500 font-semibold">
                {activePassage.sourceRef}
              </span>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 font-mono text-xs leading-relaxed text-slate-800">
              <blockquote className="border-l-3 border-[#0F2547] pl-3 italic">
                "{activePassage.originalText}"
              </blockquote>
            </div>

            <p className="text-[11px] text-slate-500 mt-3">
              This wording is directly preserved from the supplied electronic case record and remains the governing legal text.
            </p>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100">
            <button
              onClick={() => openCitationModal({
                documentId: activePassage.id,
                documentTitle: activePassage.sourceRef,
                exactPassage: activePassage.originalText
              })}
              className="text-xs font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Verify Verbatim Record</span>
            </button>
          </div>
        </div>

        {/* Right: Plain Language Explanation */}
        <div className="bg-white rounded-lg border border-emerald-200 p-5 shadow-xs flex flex-col justify-between bg-emerald-50/10">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-emerald-100">
              <span className="text-xs font-bold text-emerald-900 uppercase tracking-wider flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-700" />
                <span>Plain-Language Explanation ({selectedLanguage.toUpperCase()})</span>
              </span>
              <button
                onClick={handleCopy}
                className="text-xs text-emerald-800 hover:text-emerald-950 font-semibold inline-flex items-center gap-1"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>

            <div className="p-4 bg-white rounded border border-emerald-200 text-sm leading-relaxed text-slate-800 font-sans">
              {activePassage[selectedLanguage]}
            </div>

            <div className="mt-4 p-3 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 space-y-1">
              <div className="font-bold flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-amber-700" />
                <span>Important Limitations</span>
              </div>
              <p>
                This explanation conveys the operational meaning of the clause for clarity. It does not evaluate legal merits, predict tribunal discretion, or substitute for consultation with licensed counsel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
