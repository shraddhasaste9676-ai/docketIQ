import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { 
  CalendarClock, 
  CheckSquare, 
  Plus, 
  AlertCircle, 
  FileText, 
  Users2,
  Lock
} from 'lucide-react';
import { UserRole } from '../../types';

export const DeadlineOrganizer: React.FC = () => {
  const { deadlines, tasks, addTask, updateTaskStatus, openCitationModal, currentRole } = useCase();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskAssigneeRole, setTaskAssigneeRole] = useState<UserRole>('client');
  const [taskPriority, setTaskPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [taskNotes, setTaskNotes] = useState('');
  const [shareInCommonRoom, setShareInCommonRoom] = useState(true);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim() || !taskDueDate) {
      alert('Please provide a task title and due date.');
      return;
    }

    addTask({
      title: taskTitle,
      dueDate: taskDueDate,
      assignedRole: taskAssigneeRole,
      assignedToName: taskAssigneeRole === 'client' ? 'Ananya Ramesh Shinde (Client)' : 'Adv. Rohit V. Deshmukh (Counsel)',
      priority: taskPriority,
      status: 'todo',
      createdBy: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Ananya Shinde',
      notes: taskNotes,
      sharedInCommonRoom: shareInCommonRoom
    });

    setIsTaskModalOpen(false);
    setTaskTitle('');
    setTaskDueDate('');
    setTaskNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded bg-blue-50 text-[#0F2547] border border-blue-200">
              <CalendarClock className="w-4 h-4 text-[#0F2547]" />
            </span>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Deadlines & Action Organizer
            </h1>
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Strict separation between <strong>Document-Derived Court Deadlines</strong> (from judicial orders) and <strong>User-Created Operational Tasks</strong>.
          </p>
        </div>

        <button
          onClick={() => setIsTaskModalOpen(true)}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create Operational Task</span>
        </button>
      </div>

      {/* Safety Notice: Legal Deadlines vs Reminders */}
      <div className="p-4 rounded-lg bg-amber-50/70 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-amber-900">
            Procedural Boundary Rule
          </p>
          <p className="text-amber-800 leading-relaxed">
            Legal deadlines are extracted strictly from explicit judicial directions or statutory periods contained in supplied documents. Operational tasks and client reminders are maintained separately and do not represent judicial determinations.
          </p>
        </div>
      </div>

      {/* SECTION A: Document-Derived Legal Deadlines */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CalendarClock className="w-4 h-4 text-rose-700" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Category A: Document-Derived Judicial Deadlines ({deadlines.length})
            </h2>
          </div>
          <span className="text-[11px] font-semibold text-slate-500">
            Extracted from Order Sheets & Summons
          </span>
        </div>

        <div className="space-y-3">
          {deadlines.map((dl) => (
            <div 
              key={dl.id}
              className="p-4 rounded border border-slate-200 bg-slate-50/50 hover:bg-slate-50 transition-colors text-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{dl.title}</span>
                    {dl.isAmbiguous && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Date Ambiguity Flagged
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    Statutory Rule Basis: <strong>{dl.statutoryBasis || 'MACT Interlocutory Rules'}</strong>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="font-mono text-xs font-bold text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 inline-block">
                    Strict Due: {dl.dueDate}
                  </span>
                </div>
              </div>

              {/* Exact Source Sentence Quote */}
              <div className="my-2.5 p-3 rounded bg-white border border-slate-200 font-mono text-[11px] text-slate-800 italic">
                "{dl.exactSourceSentence}"
              </div>

              {dl.ambiguityNote && (
                <div className="p-2 bg-amber-50 rounded border border-amber-200 text-[11px] text-amber-900 mb-2">
                  <strong>Ambiguity Note: </strong> {dl.ambiguityNote}
                </div>
              )}

              <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                <span>Source Record: <strong>{dl.sourceDocTitle} [p. {dl.pageNumber}]</strong></span>
                <button
                  onClick={() => openCitationModal({
                    documentId: dl.sourceDocId,
                    documentTitle: dl.sourceDocTitle,
                    pageNumber: dl.pageNumber,
                    exactPassage: dl.exactSourceSentence
                  })}
                  className="text-[#0F2547] hover:underline font-semibold inline-flex items-center gap-1"
                >
                  <FileText className="w-3 h-3" /> Inspect Order Sentence
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION B: User-Created Operational Tasks */}
      <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <CheckSquare className="w-4 h-4 text-[#0F2547]" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Category B: User-Created Operational Tasks ({tasks.length})
            </h2>
          </div>
          <button
            onClick={() => setIsTaskModalOpen(true)}
            className="text-xs font-semibold text-[#0F2547] hover:underline inline-flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> Add Task
          </button>
        </div>

        <div className="divide-y divide-slate-100 text-xs">
          {tasks.map((task) => (
            <div key={task.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${
                    task.status === 'completed' 
                      ? 'bg-emerald-500' 
                      : task.status === 'in_progress' 
                        ? 'bg-amber-500' 
                        : 'bg-slate-400'
                  }`} />
                  <span className={`font-bold ${task.status === 'completed' ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {task.title}
                  </span>
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded uppercase ${
                    task.priority === 'high' 
                      ? 'bg-rose-100 text-rose-800' 
                      : task.priority === 'medium'
                        ? 'bg-slate-100 text-slate-700'
                        : 'bg-slate-50 text-slate-500'
                  }`}>
                    {task.priority}
                  </span>
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Assigned: <strong>{task.assignedToName}</strong></span>
                  <span>•</span>
                  <span>Due: <strong className="text-slate-700 font-mono">{task.dueDate}</strong></span>
                  <span>•</span>
                  {task.sharedInCommonRoom ? (
                    <span className="text-teal-700 font-medium flex items-center gap-1">
                      <Users2 className="w-3 h-3" /> Shared in Common Room
                    </span>
                  ) : (
                    <span className="text-slate-500 flex items-center gap-1">
                      <Lock className="w-3 h-3" /> Private Counsel Note
                    </span>
                  )}
                </div>

                {task.notes && (
                  <p className="text-[11px] text-slate-600 italic mt-0.5">
                    "{task.notes}"
                  </p>
                )}
              </div>

              {/* Status Update Dropdown */}
              <div className="shrink-0 flex items-center gap-2">
                <select
                  value={task.status}
                  onChange={(e) => updateTaskStatus(task.id, e.target.value as any)}
                  className="py-1 px-2.5 bg-slate-50 border border-slate-300 rounded text-xs font-medium text-slate-700 focus:outline-none"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white rounded-lg border border-slate-300 shadow-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">
                Create Operational Action Item
              </h3>
              <button
                onClick={() => setIsTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="E.g., Procure original pharmacy vouchers"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Due Date
                  </label>
                  <input
                    type="date"
                    required
                    value={taskDueDate}
                    onChange={(e) => setTaskDueDate(e.target.value)}
                    className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none focus:ring-1 focus:ring-[#0F2547]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Priority
                  </label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as any)}
                    className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none"
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Assignee
                </label>
                <select
                  value={taskAssigneeRole}
                  onChange={(e) => setTaskAssigneeRole(e.target.value as any)}
                  className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none"
                >
                  <option value="client">Client: Ananya Ramesh Shinde</option>
                  <option value="lawyer">Counsel: Adv. Rohit V. Deshmukh</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Notes / Instructions
                </label>
                <textarea
                  rows={2}
                  value={taskNotes}
                  onChange={(e) => setTaskNotes(e.target.value)}
                  placeholder="Specific instructions or filing notes..."
                  className="w-full p-2 bg-white border border-slate-300 rounded focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="shareCheck"
                  checked={shareInCommonRoom}
                  onChange={(e) => setShareInCommonRoom(e.target.checked)}
                  className="rounded text-[#0F2547]"
                />
                <label htmlFor="shareCheck" className="text-slate-700 font-medium">
                  Share in Common Room with Client
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTaskModalOpen(false)}
                  className="px-3 py-1.5 text-slate-600 hover:text-slate-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#0F2547] rounded shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
