export type VerificationStatus = 'verified' | 'pending' | 'conflicting' | 'missing' | 'rejected' | 'unsupported';

export type EventCategory = 
  | 'filing' 
  | 'hearing' 
  | 'order' 
  | 'notice' 
  | 'medical' 
  | 'procedural' 
  | 'communication';

export type UserRole = 'lawyer' | 'client';

export type ActiveScreen = 
  | 'landing'
  | 'dashboard'
  | 'documents'
  | 'evidence_gate'
  | 'timeline'
  | 'contradictions'
  | 'missing_links'
  | 'deadlines'
  | 'insights'
  | 'simplifier'
  | 'reports'
  | 'audit'
  | 'common_room'
  | 'privacy'
  | 'terms';

export interface SourceCitation {
  documentId: string;
  documentTitle: string;
  pageNumber?: number;
  paragraphNumber?: string;
  exactPassage: string;
  annotatedDate?: string;
  isUnsupported?: boolean;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string | null; // null represents "Date uncertain"
  displayDate: string;
  description: string;
  category: EventCategory;
  status: VerificationStatus;
  primaryCitation: SourceCitation;
  conflictingCitation?: SourceCitation;
  disputedNote?: string;
  isDateUncertain?: boolean;
  isConflict?: boolean;
  approvedBy?: string;
  approvedAt?: string;
  extractedConfidence?: number;
  inCommonRoom: boolean; // whether approved for client view in Common Room
}

export interface CaseDocument {
  id: string;
  fileName: string;
  title: string;
  fileSize: string;
  uploadedAt: string;
  fileType: 'pdf' | 'docx' | 'txt';
  pageCount: number;
  status: 'verified' | 'processing' | 'missing_referenced' | 'unverified';
  summary: string;
  authoritativeSource: string;
  extractedPassagesCount: number;
  isMissingReferenced?: boolean;
  missingReferenceDetails?: {
    referencedByDocId: string;
    referencedByDocTitle: string;
    referencedCitation: string;
    importanceLevel: 'critical' | 'procedural' | 'supplementary';
  };
  sampleFullText?: string;
}

export interface ContradictionItem {
  id: string;
  subject: string;
  explanation: string;
  status: 'unresolved' | 'reviewed' | 'resolved_by_counsel';
  sourceA: {
    documentId: string;
    documentTitle: string;
    page: number;
    claim: string;
    exactPassage: string;
  };
  sourceB: {
    documentId: string;
    documentTitle: string;
    page: number;
    claim: string;
    exactPassage: string;
  };
  flaggedReason: string;
  reviewerClassification?: 'Drafting Discrepancy' | 'Subsequent Amendment' | 'Unresolved Disputed Claim';
  reviewerRationale?: string;
  reviewedBy?: string;
  reviewedAt?: string;
}

export interface MissingLinkItem {
  id: string;
  documentTitle: string;
  documentRef: string;
  referencedBy: string;
  pageRef: string;
  contextPassage: string;
  impactOnCase: string;
  urgency: 'high' | 'medium' | 'low';
  currentStatus: 'not_requested' | 'requested_from_client' | 'procurement_in_progress' | 'obtained';
}

export interface DocumentDeadline {
  id: string;
  title: string;
  dueDate: string;
  sourceDocId: string;
  sourceDocTitle: string;
  pageNumber: number;
  exactSourceSentence: string;
  isAmbiguous: boolean;
  ambiguityNote?: string;
  statutoryBasis?: string;
  status: 'pending' | 'complied' | 'critical';
}

export interface UserTask {
  id: string;
  title: string;
  dueDate: string;
  assignedRole: UserRole;
  assignedToName: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  createdAt: string;
  createdBy: string;
  notes?: string;
  sharedInCommonRoom: boolean;
}

export interface InsightItem {
  id: string;
  title: string;
  classification: 'Documented Observation' | 'Disputed Claim' | 'Hypothetical Scenario (Requires Counsel Review)';
  explanation: string;
  supportingSourceRefs: string[];
  assumptionsAndUncertainties: string;
  suggestedNextStep: string;
  legalCaveat: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  actorRole: UserRole | 'system';
  actionType: 
    | 'document_upload'
    | 'event_extracted'
    | 'event_approved'
    | 'event_rejected'
    | 'event_edited'
    | 'conflict_flagged'
    | 'conflict_reviewed'
    | 'task_created'
    | 'task_status_changed'
    | 'permission_modified'
    | 'report_exported';
  summary: string;
  details?: string;
  targetId?: string;
}

export interface CaseInformation {
  internalReference: string;
  caseTitle: string;
  forum: string;
  caseType: string;
  filingDate: string;
  clientName: string;
  clientContact: string;
  lawyerName: string;
  lawyerBarId: string;
  lawyerFirm: string;
  currentStage: string;
  lastUpdated: string;
  manuallyEnteredStatus: string;
  aiPipelineStatus: string;
}
