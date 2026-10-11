import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { CaseDocument } from '../../types';
import { 
  UploadCloud, 
  FileText, 
  Search, 
  Filter, 
  FileQuestion, 
  AlertCircle, 
  Eye, 
  X, 
  ShieldCheck
} from 'lucide-react';

export const DocumentManager: React.FC = () => {
  const { documents, uploadLocalDocument } = useCase();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'verified' | 'missing_referenced'>('all');
  const [selectedDocPreview, setSelectedDocPreview] = useState<CaseDocument | null>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          doc.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];

    setIsUploading(true);
    setUploadProgress(10);

    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(async () => {
      clearInterval(interval);
      setUploadProgress(100);
      await uploadLocalDocument(file);
      setIsUploading(false);
      setUploadProgress(0);
    }, 800);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileUpload(e.dataTransfer.files);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Supplied Document Records & Extraction
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Demonstration mode: Upload, catalog, and inspect verbatim passages extracted from supplied electronic records.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-50 text-[#0F2547] border border-blue-200">
            {documents.filter(d => d.status === 'verified').length} Verified In Bundle
          </span>
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-purple-50 text-purple-900 border border-purple-200">
            {documents.filter(d => d.status === 'missing_referenced').length} Missing Referenced
          </span>
        </div>
      </div>

      {/* Upload Zone (Drag & Drop) */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`p-6 rounded-lg border-2 border-dashed transition-all text-center ${
          isDragging 
            ? 'border-[#0F2547] bg-blue-50/40' 
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
      >
        <div className="max-w-md mx-auto space-y-3">
          <div className="w-12 h-12 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-600">
            <UploadCloud className="w-6 h-6 text-[#0F2547]" />
          </div>
          <div>
            <p className="text-sm font-bold text-slate-800">
              Drag and drop case documents here, or browse files
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Supported formats: PDF, DOCX, TXT (Maximum file size: 25 MB)
            </p>
          </div>

          <div className="flex items-center justify-center gap-3">
            <label className="cursor-pointer px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs">
              <span>Browse Local Files</span>
              <input
                type="file"
                className="hidden"
                accept=".pdf,.docx,.txt"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={isUploading}
              />
            </label>
          </div>

          {/* Honest Notice */}
          <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] text-slate-600">
            <span className="font-semibold text-slate-800">Demonstration Mode: </span>
            Uploaded files are processed locally in your browser memory for preview and passage extraction. No files are transmitted to an external unverified server.
          </div>

          {/* Progress Bar */}
          {isUploading && (
            <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden mt-3">
              <div 
                className="bg-[#0F2547] h-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search records, citations, or content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <Filter className="w-3.5 h-3.5 text-slate-500" />
          <span className="text-xs text-slate-500">Filter:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="text-xs py-1.5 px-2.5 bg-slate-50 border border-slate-200 rounded font-medium text-slate-700 focus:outline-none"
          >
            <option value="all">All Records ({documents.length})</option>
            <option value="verified">Verified Supplied Files</option>
            <option value="missing_referenced">Referenced but Missing</option>
          </select>
        </div>
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Document Record</th>
                <th className="py-3 px-4">Type & Size</th>
                <th className="py-3 px-4">Authoritative Source / Citation</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-800">
              {filteredDocuments.map((doc) => {
                const isMissing = doc.status === 'missing_referenced';

                return (
                  <tr key={doc.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className={`p-2 rounded mt-0.5 shrink-0 ${
                          isMissing ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-slate-100 text-[#0F2547]'
                        }`}>
                          {isMissing ? <FileQuestion className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 flex items-center gap-2">
                            <span>{doc.fileName}</span>
                            {isMissing && (
                              <span className="text-[10px] bg-purple-100 text-purple-900 px-1.5 py-0.2 rounded font-semibold border border-purple-200">
                                Missing Reference
                              </span>
                            )}
                          </div>
                          <div className="text-slate-500 text-[11px] mt-0.5">
                            {doc.title}
                          </div>
                          <p className="text-[11px] text-slate-600 mt-1 max-w-md line-clamp-1">
                            {doc.summary}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap text-slate-600">
                      <span className="uppercase font-mono font-semibold text-slate-700">{doc.fileType}</span>
                      <div className="text-[11px] text-slate-400">{doc.fileSize} • {doc.pageCount} pgs</div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 text-xs">
                      {isMissing && doc.missingReferenceDetails ? (
                        <div className="space-y-0.5 text-purple-900">
                          <span className="font-semibold block">Referenced in {doc.missingReferenceDetails.referencedByDocTitle}</span>
                          <span className="text-[11px] text-purple-700 italic line-clamp-2">
                            "{doc.missingReferenceDetails.referencedCitation}"
                          </span>
                        </div>
                      ) : (
                        <span>{doc.authoritativeSource}</span>
                      )}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      {isMissing ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-purple-50 text-purple-900 border border-purple-200">
                          <AlertCircle className="w-3 h-3 text-purple-600" /> Missing Record
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <ShieldCheck className="w-3 h-3 text-emerald-600" /> Supplied & Verified
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedDocPreview(doc)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#0F2547] bg-slate-100 hover:bg-slate-200 rounded transition-colors inline-flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isMissing ? 'Details' : 'Inspect Text'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredDocuments.length === 0 && (
          <div className="p-8 text-center text-slate-500 text-xs">
            No matching documents found for search query.
          </div>
        )}
      </div>

      {/* Extracted Text Preview Drawer / Modal */}
      {selectedDocPreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-3xl bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden flex flex-col max-h-[85vh]">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Extracted Record Viewer
                </span>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedDocPreview.fileName}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded text-xs space-y-1">
                <div><strong>Document Title:</strong> {selectedDocPreview.title}</div>
                <div><strong>Authoritative Seal / Source:</strong> {selectedDocPreview.authoritativeSource}</div>
                <div><strong>Extracted Passages:</strong> {selectedDocPreview.extractedPassagesCount} key citations indexed</div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide block mb-1.5">
                  Verbatim Extracted Text Stream
                </label>
                {selectedDocPreview.sampleFullText ? (
                  <pre className="p-4 bg-slate-950 text-slate-100 rounded text-xs font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
                    {selectedDocPreview.sampleFullText}
                  </pre>
                ) : (
                  <div className="p-4 bg-purple-50 border border-purple-200 text-purple-900 rounded text-xs">
                    <strong>Document Missing from File Bundle:</strong> This document was referenced in other court records but has not yet been physically supplied or uploaded.
                  </div>
                )}
              </div>
            </div>

            <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-end">
              <button
                onClick={() => setSelectedDocPreview(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
