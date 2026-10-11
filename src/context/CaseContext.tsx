import React, { createContext, useState, ReactNode } from 'react';
import { 
  ActiveScreen, 
  UserRole, 
  CaseInformation, 
  CaseDocument, 
  TimelineEvent, 
  ContradictionItem, 
  MissingLinkItem, 
  DocumentDeadline, 
  UserTask, 
  InsightItem, 
  AuditEntry,
  SourceCitation
} from '../types';
import { 
  FICTIONAL_CASE_INFO, 
  INITIAL_DOCUMENTS, 
  INITIAL_TIMELINE_EVENTS, 
  INITIAL_CONTRADICTIONS, 
  INITIAL_MISSING_LINKS, 
  INITIAL_DEADLINES, 
  INITIAL_TASKS, 
  INITIAL_INSIGHTS, 
  INITIAL_AUDIT_LOG 
} from '../data/mockData';

interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

interface CaseContextType {
  // Navigation & Role
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  
  // Data State
  caseInfo: CaseInformation;
  documents: CaseDocument[];
  timelineEvents: TimelineEvent[];
  contradictions: ContradictionItem[];
  missingLinks: MissingLinkItem[];
  deadlines: DocumentDeadline[];
  tasks: UserTask[];
  insights: InsightItem[];
  auditLog: AuditEntry[];
  
  // Interactive Operations
  approveCandidateEvent: (eventId: string) => void;
  rejectCandidateEvent: (eventId: string, reason: string) => void;
  editCandidateEvent: (eventId: string, newTitle: string, newDate: string | null) => void;
  
  resolveContradiction: (
    id: string, 
    classification: 'Drafting Discrepancy' | 'Subsequent Amendment' | 'Unresolved Disputed Claim',
    rationale: string
  ) => void;

  addTask: (task: Omit<UserTask, 'id' | 'createdAt'>) => void;
  updateTaskStatus: (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => void;
  
  uploadLocalDocument: (file: File) => Promise<boolean>;

  // Source Citation Modal / Inspection
  activeCitationModal: SourceCitation | null;
  openCitationModal: (citation: SourceCitation) => void;
  closeCitationModal: () => void;

  // Launch Checklist Modal
  isChecklistOpen: boolean;
  setIsChecklistOpen: (open: boolean) => void;

  // Toast feedback
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  dismissToast: (id: string) => void;
}

const CaseContext = createContext<CaseContextType | undefined>(undefined);
let toastSeq = 0;

export const CaseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('landing');
  const [currentRole, setCurrentRole] = useState<UserRole>('lawyer');
  
  const [caseInfo] = useState<CaseInformation>(FICTIONAL_CASE_INFO);
  const [documents, setDocuments] = useState<CaseDocument[]>(INITIAL_DOCUMENTS);
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [contradictions, setContradictions] = useState<ContradictionItem[]>(INITIAL_CONTRADICTIONS);
  const [missingLinks] = useState<MissingLinkItem[]>(INITIAL_MISSING_LINKS);
  const [deadlines] = useState<DocumentDeadline[]>(INITIAL_DEADLINES);
  const [tasks, setTasks] = useState<UserTask[]>(INITIAL_TASKS);
  const [insights] = useState<InsightItem[]>(INITIAL_INSIGHTS);
  const [auditLog, setAuditLog] = useState<AuditEntry[]>(INITIAL_AUDIT_LOG);

  const [activeCitationModal, setActiveCitationModal] = useState<SourceCitation | null>(null);
  const [isChecklistOpen, setIsChecklistOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    toastSeq = (toastSeq + 1) % 100000;
    const id = `toast-${toastSeq}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const openCitationModal = (citation: SourceCitation) => {
    setActiveCitationModal(citation);
  };

  const closeCitationModal = () => {
    setActiveCitationModal(null);
  };

  // Integrity Gate: Approve candidate event
  const approveCandidateEvent = (eventId: string) => {
    const target = timelineEvents.find(e => e.id === eventId);
    if (!target) return;

    if (target.primaryCitation.isUnsupported) {
      showToast('Integrity Gate: Cannot approve unsupported event without valid verbatim source passage.', 'error');
      return;
    }

    setTimelineEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          status: 'verified',
          inCommonRoom: true,
          approvedBy: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Authorized Reviewer',
          approvedAt: new Date().toISOString()
        };
      }
      return ev;
    }));

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client Reviewer',
      actorRole: currentRole,
      actionType: 'event_approved',
      summary: `Approved event "${target.title}" to verified timeline`,
      details: `Source citation verified: ${target.primaryCitation.documentTitle} [p. ${target.primaryCitation.pageNumber || 'N/A'}]`,
      targetId: eventId
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`Event "${target.title}" approved and published to verified timeline.`, 'success');
  };

  // Integrity Gate: Reject candidate event
  const rejectCandidateEvent = (eventId: string, reason: string) => {
    const target = timelineEvents.find(e => e.id === eventId);
    if (!target) return;

    setTimelineEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          status: 'rejected',
          inCommonRoom: false,
          disputedNote: `Rejected by reviewer: ${reason}`
        };
      }
      return ev;
    }));

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client Reviewer',
      actorRole: currentRole,
      actionType: 'event_rejected',
      summary: `Rejected candidate event "${target.title}"`,
      details: `Reason for rejection: ${reason}`,
      targetId: eventId
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`Candidate event rejected with recorded rationale.`, 'info');
  };

  // Integrity Gate: Edit candidate event
  const editCandidateEvent = (eventId: string, newTitle: string, newDate: string | null) => {
    setTimelineEvents(prev => prev.map(ev => {
      if (ev.id === eventId) {
        return {
          ...ev,
          title: newTitle,
          date: newDate,
          displayDate: newDate ? newDate : 'Date Uncertain',
          status: 'verified',
          inCommonRoom: true,
          approvedBy: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Authorized Reviewer',
          approvedAt: new Date().toISOString()
        };
      }
      return ev;
    }));

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client Reviewer',
      actorRole: currentRole,
      actionType: 'event_edited',
      summary: `Edited and approved event "${newTitle}"`,
      details: `Updated title and date parameters with human verification.`,
      targetId: eventId
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`Event updated and verified.`, 'success');
  };

  // Contradiction Map: Classify and resolve
  const resolveContradiction = (
    id: string, 
    classification: 'Drafting Discrepancy' | 'Subsequent Amendment' | 'Unresolved Disputed Claim',
    rationale: string
  ) => {
    setContradictions(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          status: 'reviewed',
          reviewerClassification: classification,
          reviewerRationale: rationale,
          reviewedBy: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client Reviewer',
          reviewedAt: new Date().toISOString()
        };
      }
      return c;
    }));

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client Reviewer',
      actorRole: currentRole,
      actionType: 'conflict_reviewed',
      summary: `Classified conflict: ${classification}`,
      details: `Rationale: ${rationale}`,
      targetId: id
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`Conflict marked as reviewed: ${classification}`, 'success');
  };

  // Task Organizer
  const addTask = (newTask: Omit<UserTask, 'id' | 'createdAt'>) => {
    const id = `tsk-${Date.now()}`;
    const task: UserTask = {
      ...newTask,
      id,
      createdAt: new Date().toISOString()
    };

    setTasks(prev => [task, ...prev]);

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client User',
      actorRole: currentRole,
      actionType: 'task_created',
      summary: `Created task: "${task.title}"`,
      details: `Due date: ${task.dueDate}, Assigned: ${task.assignedToName}, Common Room: ${task.sharedInCommonRoom ? 'Yes' : 'Private'}`,
      targetId: id
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`New task created successfully.`, 'success');
  };

  const updateTaskStatus = (taskId: string, newStatus: 'todo' | 'in_progress' | 'completed') => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId) {
        return { ...t, status: newStatus };
      }
      return t;
    }));

    const target = tasks.find(t => t.id === taskId);
    if (target) {
      const auditItem: AuditEntry = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toISOString(),
        actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Client User',
        actorRole: currentRole,
        actionType: 'task_status_changed',
        summary: `Updated task status to ${newStatus.replace('_', ' ')}`,
        details: `Task: "${target.title}"`,
        targetId: taskId
      };
      setAuditLog(prev => [auditItem, ...prev]);
      showToast(`Task status updated.`, 'info');
    }
  };

  // Document Management Demo Upload
  const uploadLocalDocument = async (file: File): Promise<boolean> => {
    // Validate file type
    const validExtensions = ['pdf', 'docx', 'txt'];
    const ext = file.name.split('.').pop()?.toLowerCase() || '';
    if (!validExtensions.includes(ext)) {
      showToast(`Unsupported format .${ext}. Only PDF, DOCX, and TXT are supported.`, 'error');
      return false;
    }

    if (file.size > 25 * 1024 * 1024) {
      showToast('File size exceeds the 25MB demonstration boundary.', 'error');
      return false;
    }

    const docId = `doc-${Date.now()}`;
    const newDoc: CaseDocument = {
      id: docId,
      fileName: file.name,
      title: file.name.replace(/\.[^/.]+$/, ''),
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
      uploadedAt: new Date().toISOString(),
      fileType: ext as 'pdf' | 'docx' | 'txt',
      pageCount: 6, // simulated
      status: 'verified',
      summary: `Supplied document added in demonstration mode. Text extracted locally for preview and source verification.`,
      authoritativeSource: 'User supplied case file upload (Demonstration)',
      extractedPassagesCount: 1,
      sampleFullText: `[DEMONSTRATION EXTRACT FOR ${file.name.toUpperCase()}]\nUploaded by ${currentRole === 'lawyer' ? 'Counsel' : 'Client'}.\nExtracted text stream available for citation verification.`
    };

    setDocuments(prev => [newDoc, ...prev]);

    const auditItem: AuditEntry = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toISOString(),
      actor: currentRole === 'lawyer' ? 'Adv. Rohit V. Deshmukh' : 'Ananya Shinde (Client)',
      actorRole: currentRole,
      actionType: 'document_upload',
      summary: `Uploaded document: ${file.name}`,
      details: `File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB, format: ${ext.toUpperCase()}`,
      targetId: docId
    };

    setAuditLog(prev => [auditItem, ...prev]);
    showToast(`Document "${file.name}" uploaded and cataloged in demo workspace.`, 'success');
    return true;
  };

  return (
    <CaseContext.Provider
      value={{
        activeScreen,
        setActiveScreen,
        currentRole,
        setCurrentRole,
        caseInfo,
        documents,
        timelineEvents,
        contradictions,
        missingLinks,
        deadlines,
        tasks,
        insights,
        auditLog,
        approveCandidateEvent,
        rejectCandidateEvent,
        editCandidateEvent,
        resolveContradiction,
        addTask,
        updateTaskStatus,
        uploadLocalDocument,
        activeCitationModal,
        openCitationModal,
        closeCitationModal,
        isChecklistOpen,
        setIsChecklistOpen,
        toasts,
        showToast,
        dismissToast
      }}
    >
      {children}
    </CaseContext.Provider>
  );
};

export { CaseContext };
export { useCase } from './useCase';

