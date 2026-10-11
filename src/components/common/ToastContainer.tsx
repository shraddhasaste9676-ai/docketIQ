import React from 'react';
import { useCase } from '../../context/CaseContext';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useCase();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-md w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />,
          info: <Info className="w-4 h-4 text-[#0F2547] shrink-0" />
        };

        const bgColors = {
          success: 'bg-white border-emerald-300 text-slate-800',
          warning: 'bg-white border-amber-300 text-slate-800',
          error: 'bg-white border-rose-300 text-slate-800',
          info: 'bg-white border-slate-300 text-slate-800'
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-md border shadow-lg flex items-start justify-between gap-3 text-xs font-medium animate-in slide-in-from-bottom-2 duration-150 ${bgColors[toast.type]}`}
          >
            <div className="flex items-start gap-2.5">
              {icons[toast.type]}
              <span className="leading-relaxed">{toast.message}</span>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 p-0.5 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
