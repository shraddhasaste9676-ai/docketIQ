import { 
  CaseInformation, 
  CaseDocument, 
  TimelineEvent, 
  ContradictionItem, 
  MissingLinkItem, 
  DocumentDeadline, 
  UserTask, 
  InsightItem, 
  AuditEntry 
} from '../types';

export const FICTIONAL_CASE_INFO: CaseInformation = {
  internalReference: 'DIQ-2026-0842-DEMO',
  caseTitle: 'Shinde v. State Transport Corporation & Anr.',
  forum: 'Motor Accidents Claims Tribunal, Courtroom 4 (Fictional Demonstration)',
  caseType: 'Claim Petition under Section 166, Motor Vehicles Act 1988',
  filingDate: '2025-11-12',
  clientName: 'Ananya Ramesh Shinde',
  clientContact: 'client.shinde@demo-email.test',
  lawyerName: 'Adv. Rohit V. Deshmukh',
  lawyerBarId: 'MAH/5820/2014 (Demo)',
  lawyerFirm: 'Deshmukh & Associates Legal Chambers',
  currentStage: 'Pleadings & Written Statement Stage',
  lastUpdated: '2026-01-10T14:30:00Z',
  manuallyEnteredStatus: 'Pre-Trial Written Statement Pending (Manual entry by Adv. Deshmukh)',
  aiPipelineStatus: 'Extraction complete: 6 candidate events, 1 unresolved date conflict, 2 missing referenced records identified',
};

export const INITIAL_DOCUMENTS: CaseDocument[] = [
  {
    id: 'doc-001',
    fileName: 'Petition.pdf',
    title: 'Claim Petition under S. 166 MV Act (Verified Copy)',
    fileSize: '3.4 MB',
    uploadedAt: '2025-11-14T10:15:00Z',
    fileType: 'pdf',
    pageCount: 12,
    status: 'verified',
    summary: 'Initial formal claim petition stating particulars of vehicular collision on State Highway 4, injuries sustained, compensation claimed of INR 24,50,000, and initial witness list.',
    authoritativeSource: 'Registrar, MACT Tribunal filing stamp no. 1092/2025',
    extractedPassagesCount: 4,
    sampleFullText: `IN THE MOTOR ACCIDENTS CLAIMS TRIBUNAL
CLAIM PETITION NO. 842 OF 2025
Ananya Ramesh Shinde ... Petitioner
Versus
State Road Transport Corporation & Anr. ... Respondents

[Page 1, Paragraph 3]
1. That on 14th August 2025 at approximately 18:30 hours, the Petitioner was lawfully travelling on State Highway 4 when vehicle bearing registration MH-14-BT-9102 operated by Respondent No. 1 struck the Petitioner's vehicle due to rash and negligent driving.
2. The Petitioner sustained severe compound fractures to the right lower limb, resulting in prolonged hospitalization at Civil Hospital.
3. The Petitioner has incurred medical expenditures exceeding INR 4,20,000 and suffers permanent partial functional impairment.

[Page 4, Paragraph 8]
4. The local police station registered FIR No. 204/2025 and subsequently investigated the matter, concluding with Police Charge Sheet No. 402/2025, which conclusively pins liability upon the Respondent's driver.

[Page 7, Paragraph 14]
5. Permanent functional disability is assessed provisionally at 45% as documented in the preliminary evaluation MACT-Ex. 7 by District Medical Board.`
  },
  {
    id: 'doc-002',
    fileName: 'Notice.pdf',
    title: 'Tribunal Summons and Notice to Appear',
    fileSize: '840 KB',
    uploadedAt: '2025-12-05T09:40:00Z',
    fileType: 'pdf',
    pageCount: 2,
    status: 'verified',
    summary: 'Official summons issued by MACT Courtroom 4 directing respondent corporation to appear and file written statement.',
    authoritativeSource: 'MACT Registry Process Department',
    extractedPassagesCount: 2,
    sampleFullText: `COURT OF THE MOTOR ACCIDENTS CLAIMS TRIBUNAL
NOTICE OF HEARING

To: The Depot Manager, State Road Transport Corporation, Central Bus Depot.
Whereas Claim Petition No. 842 of 2025 has been instituted against you by Petitioner Ananya Ramesh Shinde:

[Page 1, Paragraph 2]
"You are hereby summoned to appear before this Tribunal in Courtroom No. 4 in person or by pleader on the 18th day of January 2026 at 11:00 AM sharp to answer the claim, and to produce all relevant documentary evidence."

Take notice that in default of your appearance on the day afore-mentioned, the petition will be heard and determined in your absence.`
  },
  {
    id: 'doc-003',
    fileName: 'Order.pdf',
    title: 'Interim Directions & Adjournment Order',
    fileSize: '1.2 MB',
    uploadedAt: '2025-12-24T16:00:00Z',
    fileType: 'pdf',
    pageCount: 4,
    status: 'verified',
    summary: 'Interim tribunal order recording appearance of panel counsel and directing filing of written statement within statutory window.',
    authoritativeSource: 'MACT Presiding Officer Bench Order Sheet',
    extractedPassagesCount: 3,
    sampleFullText: `IN THE MOTOR ACCIDENTS CLAIMS TRIBUNAL
ORDER SHEET - DATED 22-12-2025

Coram: Hon'ble Presiding Officer, MACT-4
Claim Petition No. 842/2025
Adv. Rohit Deshmukh for Petitioner.
Adv. K. L. Mehta for Respondent No. 1 (Corporation).

[Page 2, Item 4]
"Panel counsel for Respondent No. 1 enters appearance on memo. Let regular Vakalatnama be placed on file. Matter stands adjourned to 25th January 2026 for filing of Written Statement and production of depot inspection log."

[Page 3, Paragraph 5]
"Respondent Corporation is directed to place its Written Statement on record strictly within 30 days of receipt hereof, failing which right to file defence shall stand closed: Strict Deadline fixed 21-01-2026."

[Page 3, Paragraph 7]
"Petitioner is directed to produce certified copy of Police Charge Sheet No. 402/2025 and final Disability Certificate from Civil Surgeon on or before the next date."`
  },
  {
    id: 'doc-004-missing',
    fileName: 'Police_Charge_Sheet_402_2025.pdf',
    title: 'Police Investigation Charge Sheet No. 402/2025 (REFERENCED BUT MISSING)',
    fileSize: '0 KB',
    uploadedAt: 'Not Uploaded',
    fileType: 'pdf',
    pageCount: 0,
    status: 'missing_referenced',
    summary: 'Crucial evidentiary police report explicitly referenced in Petition.pdf (p. 4) and Order.pdf (p. 3). Not present in supplied case archive.',
    authoritativeSource: 'Investigating Officer, Highway Police Station',
    extractedPassagesCount: 0,
    isMissingReferenced: true,
    missingReferenceDetails: {
      referencedByDocId: 'doc-003',
      referencedByDocTitle: 'Order.pdf (p. 3 para 7)',
      referencedCitation: 'Order.pdf: "Petitioner is directed to produce certified copy of Police Charge Sheet No. 402/2025 on or before next date."',
      importanceLevel: 'critical'
    }
  },
  {
    id: 'doc-005-missing',
    fileName: 'Disability_Board_Certificate_MACT_Ex7.pdf',
    title: 'Civil Hospital Final Disability Assessment (REFERENCED BUT MISSING)',
    fileSize: '0 KB',
    uploadedAt: 'Not Uploaded',
    fileType: 'pdf',
    pageCount: 0,
    status: 'missing_referenced',
    summary: 'Specialist medical board assessment certificate determining permanent functional loss, cited in Petition.pdf (p. 7) as MACT-Ex. 7.',
    authoritativeSource: 'District Medical Board / Civil Surgeon',
    extractedPassagesCount: 0,
    isMissingReferenced: true,
    missingReferenceDetails: {
      referencedByDocId: 'doc-001',
      referencedByDocTitle: 'Petition.pdf (p. 7 para 14)',
      referencedCitation: 'Petition.pdf: "Permanent functional disability is assessed provisionally at 45% as documented in preliminary evaluation MACT-Ex. 7."',
      importanceLevel: 'critical'
    }
  }
];

export const INITIAL_TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: 'evt-001',
    title: 'Incident: Highway Collision on State Highway 4',
    date: '2025-08-14',
    displayDate: '14 Aug 2025',
    description: 'Collision between passenger vehicle and State Transport Bus MH-14-BT-9102 resulting in severe limb injuries.',
    category: 'filing',
    status: 'verified',
    primaryCitation: {
      documentId: 'doc-001',
      documentTitle: 'Petition.pdf',
      pageNumber: 1,
      paragraphNumber: '3',
      exactPassage: 'That on 14th August 2025 at approximately 18:30 hours, the Petitioner was lawfully travelling on State Highway 4 when vehicle bearing registration MH-14-BT-9102 operated by Respondent No. 1 struck the Petitioner\'s vehicle...',
      annotatedDate: '14-08-2025'
    },
    inCommonRoom: true,
    approvedBy: 'Adv. Rohit V. Deshmukh',
    approvedAt: '2025-11-15T11:00:00Z',
    extractedConfidence: 0.98
  },
  {
    id: 'evt-002',
    title: 'Claim Petition Lodged before MACT Registry',
    date: '2025-11-12',
    displayDate: '12 Nov 2025',
    description: 'Formal claim petition registered seeking compensation of INR 24,50,000 under Section 166 Motor Vehicles Act.',
    category: 'filing',
    status: 'verified',
    primaryCitation: {
      documentId: 'doc-001',
      documentTitle: 'Petition.pdf',
      pageNumber: 1,
      paragraphNumber: 'Header Registry Seal',
      exactPassage: 'IN THE MOTOR ACCIDENTS CLAIMS TRIBUNAL, CLAIM PETITION NO. 842 OF 2025, Filed on 12-11-2025.',
      annotatedDate: '12-11-2025'
    },
    inCommonRoom: true,
    approvedBy: 'Adv. Rohit V. Deshmukh',
    approvedAt: '2025-11-15T11:02:00Z',
    extractedConfidence: 0.99
  },
  {
    id: 'evt-003',
    title: 'Summons Issued to Respondent Transport Corporation',
    date: '2025-12-04',
    displayDate: '04 Dec 2025',
    description: 'Process department issued official summons for corporation appearance in Courtroom 4.',
    category: 'notice',
    status: 'verified',
    primaryCitation: {
      documentId: 'doc-002',
      documentTitle: 'Notice.pdf',
      pageNumber: 1,
      paragraphNumber: 'Header Notice',
      exactPassage: 'COURT OF THE MOTOR ACCIDENTS CLAIMS TRIBUNAL, NOTICE OF HEARING, Issued under seal on 04-12-2025.',
      annotatedDate: '04-12-2025'
    },
    inCommonRoom: true,
    approvedBy: 'Adv. Rohit V. Deshmukh',
    approvedAt: '2025-12-06T14:20:00Z',
    extractedConfidence: 0.96
  },
  {
    id: 'evt-004',
    title: 'Tribunal Next Hearing Date (CONFLICTING RECORDS DETECTED)',
    date: '2026-01-18', // preserves both in UI
    displayDate: '18 Jan 2026 vs 25 Jan 2026',
    description: 'Notice.pdf specifies hearing on 18 Jan 2026, whereas subsequently Order.pdf records adjournment to 25 Jan 2026. Neither date was silently discarded.',
    category: 'hearing',
    status: 'conflicting',
    isConflict: true,
    primaryCitation: {
      documentId: 'doc-002',
      documentTitle: 'Notice.pdf',
      pageNumber: 1,
      paragraphNumber: '2',
      exactPassage: 'You are hereby summoned to appear before this Tribunal in Courtroom No. 4 in person or by pleader on the 18th day of January 2026 at 11:00 AM sharp to answer the claim...',
      annotatedDate: '18-01-2026'
    },
    conflictingCitation: {
      documentId: 'doc-003',
      documentTitle: 'Order.pdf',
      pageNumber: 2,
      paragraphNumber: 'Item 4',
      exactPassage: 'Panel counsel for Respondent No. 1 enters appearance on memo... Matter stands adjourned to 25th January 2026 for filing of Written Statement and production of depot inspection log.',
      annotatedDate: '25-01-2026'
    },
    disputedNote: 'Preserved dual-record conflict: Notice summons specifies 18 Jan 2026. Interim Order sheet dated 22 Dec 2025 records bench adjournment to 25 Jan 2026. Human review required to confirm if 25 Jan supersedes Notice.',
    inCommonRoom: true,
    extractedConfidence: 0.94
  },
  {
    id: 'evt-005',
    title: 'Interim Order Issued: Appearance Recorded & 30-Day Limit Fixed',
    date: '2025-12-22',
    displayDate: '22 Dec 2025',
    description: 'Tribunal noted presence of counsel, granted time for memo, and issued mandatory 30-day timeline for corporation written statement.',
    category: 'order',
    status: 'verified',
    primaryCitation: {
      documentId: 'doc-003',
      documentTitle: 'Order.pdf',
      pageNumber: 1,
      paragraphNumber: 'Coram & Date',
      exactPassage: 'IN THE MOTOR ACCIDENTS CLAIMS TRIBUNAL, ORDER SHEET - DATED 22-12-2025. Adv. Rohit Deshmukh for Petitioner. Adv. K. L. Mehta for Respondent No. 1.',
      annotatedDate: '22-12-2025'
    },
    inCommonRoom: true,
    approvedBy: 'Adv. Rohit V. Deshmukh',
    approvedAt: '2025-12-26T17:10:00Z',
    extractedConfidence: 0.97
  },
  {
    id: 'evt-006',
    title: 'Statutory 30-Day Deadline for Written Statement Filing',
    date: '2026-01-21',
    displayDate: '21 Jan 2026',
    description: 'Strict court-mandated deadline for Respondent Corporation to place its written statement on record or face forfeiture of defence.',
    category: 'order',
    status: 'verified',
    primaryCitation: {
      documentId: 'doc-003',
      documentTitle: 'Order.pdf',
      pageNumber: 3,
      paragraphNumber: '5',
      exactPassage: 'Respondent Corporation is directed to place its Written Statement on record strictly within 30 days of receipt hereof, failing which right to file defence shall stand closed: Strict Deadline fixed 21-01-2026.',
      annotatedDate: '21-01-2026'
    },
    inCommonRoom: true,
    approvedBy: 'Adv. Rohit V. Deshmukh',
    approvedAt: '2025-12-26T17:12:00Z',
    extractedConfidence: 0.99
  },
  {
    id: 'evt-007-unsupported',
    title: 'Proposed Out-of-Court Settlement Discussions (UNSUPPORTED CANDIDATE)',
    date: null,
    displayDate: 'Date Uncertain / Unsupported',
    description: 'AI model drafted candidate event indicating parties initiated mutual Lok Adalat settlement discussions. However, no source document supports this entry.',
    category: 'procedural',
    status: 'unsupported',
    isDateUncertain: true,
    primaryCitation: {
      documentId: 'unsupported-source',
      documentTitle: 'No Matching Document in Supplied Bundle',
      exactPassage: 'No verbatim source passage identified in Petition.pdf, Notice.pdf, or Order.pdf.',
      isUnsupported: true
    },
    disputedNote: 'Integrity Gate Action: Marked unsupported. System blocks verification until corroborating document is uploaded and reviewed by counsel.',
    inCommonRoom: false,
    extractedConfidence: 0.22
  }
];

export const INITIAL_CONTRADICTIONS: ContradictionItem[] = [
  {
    id: 'conf-001',
    subject: 'First Scheduled Tribunal Hearing Date',
    explanation: 'Notice.pdf states the appearance date is 18 January 2026, whereas Order.pdf (Item 4) indicates the matter was adjourned to 25 January 2026.',
    status: 'unresolved',
    sourceA: {
      documentId: 'doc-002',
      documentTitle: 'Notice.pdf',
      page: 1,
      claim: 'Hearing summons fixed for 18th January 2026 at 11:00 AM.',
      exactPassage: 'You are hereby summoned to appear before this Tribunal in Courtroom No. 4 in person or by pleader on the 18th day of January 2026 at 11:00 AM sharp to answer the claim...'
    },
    sourceB: {
      documentId: 'doc-003',
      documentTitle: 'Order.pdf',
      page: 2,
      claim: 'Hearing adjourned by bench order to 25th January 2026.',
      exactPassage: 'Panel counsel for Respondent No. 1 enters appearance on memo... Matter stands adjourned to 25th January 2026 for filing of Written Statement and production of depot inspection log.'
    },
    flaggedReason: 'Temporal ambiguity between summons issuance and subsequent interlocutory bench direction. Both dates retained to prevent missed court appearance.',
    reviewerClassification: undefined,
    reviewerRationale: undefined
  },
  {
    id: 'conf-002',
    subject: 'Provisional Disability Percentage Assessment',
    explanation: 'Petition asserts 45% permanent partial disability based on preliminary hospital memo, but Respondent oral memo claims provisional hospital note indicated 30%.',
    status: 'reviewed',
    sourceA: {
      documentId: 'doc-001',
      documentTitle: 'Petition.pdf',
      page: 7,
      claim: 'Permanent functional disability is assessed provisionally at 45%.',
      exactPassage: 'Permanent functional disability is assessed provisionally at 45% as documented in the preliminary evaluation MACT-Ex. 7 by District Medical Board.'
    },
    sourceB: {
      documentId: 'doc-003',
      documentTitle: 'Order.pdf',
      page: 3,
      claim: 'Bench directive requiring production of certified Civil Surgeon certificate due to oral objection by Respondent counsel.',
      exactPassage: 'Petitioner is directed to produce certified copy of Police Charge Sheet No. 402/2025 and final Disability Certificate from Civil Surgeon on or before the next date.'
    },
    flaggedReason: 'Contested evidentiary valuation. Requires final Medical Board certificate (MACT-Ex. 7) to substantiate claim.',
    reviewerClassification: 'Unresolved Disputed Claim',
    reviewerRationale: 'Classified as contested claim pending procurement of final Civil Surgeon disability certificate. Cannot be reconciled solely from current case file.',
    reviewedBy: 'Adv. Rohit V. Deshmukh',
    reviewedAt: '2026-01-08T15:20:00Z'
  }
];

export const INITIAL_MISSING_LINKS: MissingLinkItem[] = [
  {
    id: 'ml-001',
    documentTitle: 'Police Charge Sheet No. 402/2025',
    documentRef: 'FIR No. 204/2025, Highway PS',
    referencedBy: 'Petition.pdf (Page 4, Para 8) & Order.pdf (Page 3, Para 7)',
    pageRef: 'p. 4 & p. 3',
    contextPassage: 'Order.pdf: "Petitioner is directed to produce certified copy of Police Charge Sheet No. 402/2025... on or before the next date."',
    impactOnCase: 'Essential for proving driver negligence under MV Act Section 166. In absence of charge sheet, tribunal cannot formulate liability issue.',
    urgency: 'high',
    currentStatus: 'procurement_in_progress'
  },
  {
    id: 'ml-002',
    documentTitle: 'Civil Surgeon Final Disability Certificate (MACT-Ex. 7)',
    documentRef: 'District Civil Hospital, Ref. Ortho-B-99',
    referencedBy: 'Petition.pdf (Page 7, Para 14) & Order.pdf (Page 3, Para 7)',
    pageRef: 'p. 7 & p. 3',
    contextPassage: 'Petition.pdf: "...permanent functional disability is assessed provisionally at 45% as documented in preliminary evaluation MACT-Ex. 7 by District Medical Board."',
    impactOnCase: 'Determines the multiplier and quantum of pecuniary compensation for future loss of earning capacity.',
    urgency: 'high',
    currentStatus: 'requested_from_client'
  },
  {
    id: 'ml-003',
    documentTitle: 'State Transport Bus Depot Inspection Log',
    documentRef: 'Central Bus Depot Vehicle Maintenance Roster MH-14-BT-9102',
    referencedBy: 'Order.pdf (Page 2, Item 4)',
    pageRef: 'p. 2',
    contextPassage: 'Order.pdf: "...Matter stands adjourned... for filing of Written Statement and production of depot inspection log."',
    impactOnCase: 'Required from respondent corporation to inspect mechanical fitness and brake maintenance prior to collision.',
    urgency: 'medium',
    currentStatus: 'not_requested'
  }
];

export const INITIAL_DEADLINES: DocumentDeadline[] = [
  {
    id: 'dd-001',
    title: 'Corporation Written Statement Filing (Strict 30-Day Statutory Limit)',
    dueDate: '2026-01-21',
    sourceDocId: 'doc-003',
    sourceDocTitle: 'Order.pdf',
    pageNumber: 3,
    exactSourceSentence: 'Respondent Corporation is directed to place its Written Statement on record strictly within 30 days of receipt hereof, failing which right to file defence shall stand closed: Strict Deadline fixed 21-01-2026.',
    isAmbiguous: false,
    statutoryBasis: 'MACT Rules & Order 8 Rule 1, Code of Civil Procedure',
    status: 'critical'
  },
  {
    id: 'dd-002',
    title: 'Production of Certified Police Charge Sheet No. 402/2025',
    dueDate: '2026-01-25',
    sourceDocId: 'doc-003',
    sourceDocTitle: 'Order.pdf',
    pageNumber: 3,
    exactSourceSentence: 'Petitioner is directed to produce certified copy of Police Charge Sheet No. 402/2025 and final Disability Certificate from Civil Surgeon on or before the next date.',
    isAmbiguous: true,
    ambiguityNote: 'Due date contingent upon resolved hearing date (25 Jan 2026 vs summons notice date 18 Jan 2026). Treated conservatively as 25 Jan based on Order.pdf.',
    statutoryBasis: 'Rule 234, State Motor Vehicles Rules',
    status: 'pending'
  }
];

export const INITIAL_TASKS: UserTask[] = [
  {
    id: 'tsk-001',
    title: 'Collect original hospital medical discharge summary and pharmacy vouchers from Civil Hospital',
    dueDate: '2026-01-16',
    assignedRole: 'client',
    assignedToName: 'Ananya Ramesh Shinde (Client)',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-01-02T10:00:00Z',
    createdBy: 'Adv. Rohit V. Deshmukh',
    notes: 'Please verify with the Billing Superintendent that hospital receipts contain official round stamp and signature.',
    sharedInCommonRoom: true
  },
  {
    id: 'tsk-002',
    title: 'File formal application for certified copy of Charge Sheet 402/2025 at Magistrate Court Registry',
    dueDate: '2026-01-18',
    assignedRole: 'lawyer',
    assignedToName: 'Adv. Rohit V. Deshmukh (Counsel)',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2026-01-03T11:30:00Z',
    createdBy: 'Adv. Rohit V. Deshmukh',
    notes: 'Court clerk instructed to check index under FIR 204/2025.',
    sharedInCommonRoom: true
  },
  {
    id: 'tsk-003',
    title: 'Review MSRTC driver license verification and depot roster upon filing',
    dueDate: '2026-01-23',
    assignedRole: 'lawyer',
    assignedToName: 'Adv. Rohit V. Deshmukh (Counsel)',
    priority: 'medium',
    status: 'todo',
    createdAt: '2026-01-05T14:15:00Z',
    createdBy: 'Adv. Rohit V. Deshmukh',
    notes: 'Check if driver possessed valid commercial badge endorsement on incident date.',
    sharedInCommonRoom: false // Private lawyer task
  }
];

export const INITIAL_INSIGHTS: InsightItem[] = [
  {
    id: 'ins-001',
    title: 'Critical Evidentiary Gap: Missing Police Charge Sheet 402/2025',
    classification: 'Documented Observation',
    explanation: 'Both the claim petition (p. 4) and the tribunal interlocutory order (p. 3) cite Charge Sheet 402/2025 as the primary record establishing driver culpability. However, the document is not present in the supplied case files.',
    supportingSourceRefs: [
      'Petition.pdf [p. 4 para 8]',
      'Order.pdf [p. 3 para 7]'
    ],
    assumptionsAndUncertainties: 'Assumes police investigation concluded and charge sheet was submitted to the jurisdictional judicial magistrate.',
    suggestedNextStep: 'File urgent certified copy application at Judicial Magistrate First Class (JMFC) court and upload before 25 Jan hearing.',
    legalCaveat: 'Identified as an informational evidence gap. DocketIQ does not predict judicial determination of liability.'
  },
  {
    id: 'ins-002',
    title: 'Unresolved Procedural Schedule: Hearing Date Discrepancy (18 Jan vs 25 Jan)',
    classification: 'Disputed Claim',
    explanation: 'The initial appearance summons (Notice.pdf) specifies 18-01-2026. The subsequently recorded order sheet (Order.pdf) lists 25-01-2026. If the court board took up the matter on 18 Jan without formal cause-list notification, petitioner risk of non-appearance exists.',
    supportingSourceRefs: [
      'Notice.pdf [p. 1 para 2]',
      'Order.pdf [p. 2 item 4]'
    ],
    assumptionsAndUncertainties: 'Uncertain whether bench order on 22 Dec formally superseded registry summons notice on the tribunal daily cause list.',
    suggestedNextStep: 'Counsel clerk should inspect tribunal cause board for 18 Jan 2026 to confirm whether matter is listed for formal calling or adjourned straight to 25 Jan.',
    legalCaveat: 'Procedural coordination observation only. Requires human verification with tribunal court clerk.'
  },
  {
    id: 'ins-003',
    title: 'Medical Disability Assessment Divergence (45% vs 30% Oral Contention)',
    classification: 'Hypothetical Scenario (Requires Counsel Review)',
    explanation: 'If respondent corporation contests the provisional 45% disability mentioned in Petition.pdf, tribunal may refer claimant to an independent Apex Medical Board, potentially extending the pre-trial evidence timeline by 60 to 90 days.',
    supportingSourceRefs: [
      'Petition.pdf [p. 7 para 14]',
      'Order.pdf [p. 3 para 7]'
    ],
    assumptionsAndUncertainties: 'Hypothetical scenario based on standard MACT adjudication procedure when disability certificate is contested.',
    suggestedNextStep: 'Counsel should evaluate scheduling an immediate independent medical evaluation with Civil Surgeon prior to respondent written statement.',
    legalCaveat: 'This scenario is an analytical projection for preparation only. DocketIQ does not estimate compensation quantum or case outcome.'
  }
];

export const INITIAL_AUDIT_LOG: AuditEntry[] = [
  {
    id: 'aud-001',
    timestamp: '2025-11-14T10:15:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'document_upload',
    summary: 'Uploaded Petition.pdf (12 pages, 3.4 MB)',
    details: 'Initial claim petition under Section 166 Motor Vehicles Act filed with tribunal registry stamp.'
  },
  {
    id: 'aud-002',
    timestamp: '2025-11-14T10:16:30Z',
    actor: 'System AI Extraction Pipeline',
    actorRole: 'system',
    actionType: 'event_extracted',
    summary: 'Extracted 3 candidate events from Petition.pdf',
    details: 'Identified incident date (14 Aug 2025), filing date (12 Nov 2025), and preliminary disability claim.'
  },
  {
    id: 'aud-003',
    timestamp: '2025-11-15T11:00:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'event_approved',
    summary: 'Approved incident and filing events to verified case timeline',
    details: 'Human review verified exact passage matches on Page 1 Paragraph 3 of Petition.pdf.'
  },
  {
    id: 'aud-004',
    timestamp: '2025-12-05T09:40:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'document_upload',
    summary: 'Uploaded Notice.pdf (2 pages, 840 KB)',
    details: 'Tribunal summons notice for appearance in Courtroom 4.'
  },
  {
    id: 'aud-005',
    timestamp: '2025-12-24T16:00:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'document_upload',
    summary: 'Uploaded Order.pdf (4 pages, 1.2 MB)',
    details: 'Interim directions order sheet dated 22 Dec 2025.'
  },
  {
    id: 'aud-006',
    timestamp: '2025-12-24T16:02:15Z',
    actor: 'System AI Integrity Pipeline',
    actorRole: 'system',
    actionType: 'conflict_flagged',
    summary: 'Flagged Hearing Date Conflict: Notice.pdf (18 Jan 2026) vs Order.pdf (25 Jan 2026)',
    details: 'System flagged temporal discrepancy between summons notice date and bench order adjournment.'
  },
  {
    id: 'aud-007',
    timestamp: '2026-01-02T10:00:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'task_created',
    summary: 'Created task for Client: Collect original hospital discharge summary',
    details: 'Shared in Common Room with due date 16 Jan 2026.'
  },
  {
    id: 'aud-008',
    timestamp: '2026-01-08T15:20:00Z',
    actor: 'Adv. Rohit V. Deshmukh',
    actorRole: 'lawyer',
    actionType: 'conflict_reviewed',
    summary: 'Classified disability divergence as Unresolved Disputed Claim',
    details: 'Reviewer rationale added: pending final Civil Surgeon assessment.'
  }
];

export const LEGAL_SIMPLIFIER_PASSAGES = [
  {
    id: 'simp-001',
    title: 'Order.pdf: Written Statement Forfeiture Clause',
    sourceRef: 'Order.pdf [Page 3, Paragraph 5]',
    originalText: 'Respondent Corporation is directed to place its Written Statement on record strictly within 30 days of receipt hereof, failing which right to file defence shall stand closed: Strict Deadline fixed 21-01-2026.',
    english: 'The judge ordered the bus corporation to submit its written reply (their side of the story) within 30 days. If they fail to file it by January 21, 2026, the court will close their right to present a defence, and the case will proceed based on the claimant\'s evidence.',
    hindi: 'अदालत ने बस निगम को इस आदेश की प्राप्ति के 30 दिनों के भीतर अपना लिखित बयान (जवाब-दावा) पेश करने का निर्देश दिया है। यदि वे 21 जनवरी 2026 तक इसे दाखिल नहीं करते हैं, तो अदालत उनके बचाव के अधिकार को समाप्त कर देगी और मामला केवल याचिकाकर्ता के सबूतों पर आगे बढ़ेगा।',
    marathi: 'न्यायालयाने एसटी महामंडळाला हा आदेश मिळाल्यापासून ३० दिवसांच्या आत आपले लेखी म्हणणे (बचाव) न्यायालयात दाखल करण्याचा आदेश दिला आहे. त्यांनी २१ जानेवारी २०२६ पर्यंत म्हणणे दाखल न केल्यास, त्यांचा बचावाचा हक्क बंद करण्यात येईल आणि केवळ याचिकाकर्त्याच्या पुराव्यावर खटला चालवला जाईल.'
  },
  {
    id: 'simp-002',
    title: 'Notice.pdf: Default Appearance Summons',
    sourceRef: 'Notice.pdf [Page 1, Paragraph 2]',
    originalText: 'You are hereby summoned to appear before this Tribunal in Courtroom No. 4 in person or by pleader on the 18th day of January 2026 at 11:00 AM sharp to answer the claim, and to produce all relevant documentary evidence. Take notice that in default of your appearance on the day afore-mentioned, the petition will be heard and determined in your absence.',
    english: 'This is an official court notice instructing the opposing party to come to Courtroom 4 on January 18, 2026 at 11:00 AM (either personally or through their lawyer) with all documents. If they do not show up, the court warns that it may decide the matter in their absence (ex-parte).',
    hindi: 'यह अदालत का औपचारिक समन है जिसमें विपक्षी दल को 18 जनवरी 2026 को सुबह 11:00 बजे कोर्ट रूम नंबर 4 में स्वयं या अपने वकील के माध्यम से उपस्थित होने और दस्तावेज पेश करने का निर्देश दिया गया है। चेतावनी दी गई है कि अनुपस्थित रहने पर उनकी अनुपस्थिति में ही फैसला किया जा सकता है।',
    marathi: 'हे अधिकृत न्यायालयीन समन्स असून विरोधी पक्षाला १८ जानेवारी २०२६ रोजी सकाळी ११:०० वाजता कोर्टरूम क्र. ४ मध्ये स्वतः किंवा वकिलामार्फत कागदपत्रांसह हजर राहण्याचे निर्देश देते. हजर न राहिल्यास त्यांच्या अनुपस्थितीतच (एकतर्फी) निर्णय दिला जाईल असा इशारा यात दिला आहे.'
  },
  {
    id: 'simp-003',
    title: 'Petition.pdf: Section 166 Motor Vehicles Act Claim',
    sourceRef: 'Petition.pdf [Page 1, Paragraph 3]',
    originalText: 'That on 14th August 2025 at approximately 18:30 hours, the Petitioner was lawfully travelling on State Highway 4 when vehicle bearing registration MH-14-BT-9102 operated by Respondent No. 1 struck the Petitioner\'s vehicle due to rash and negligent driving.',
    english: 'This is the formal assertion filed by the injured claimant stating where, when, and how the incident occurred, alleging that the bus driver was driving carelessly and is legally responsible for causing the crash and resulting injuries.',
    hindi: 'यह घायल याचिकाकर्ता द्वारा दायर किया गया औपचारिक बयान है, जिसमें बताया गया है कि दुर्घटना कब और कैसे हुई। इसमें आरोप लगाया गया है कि बस चालक की लापरवाही के कारण यह टक्कर हुई और वे कानूनी रूप से इसके जिम्मेदार हैं।',
    marathi: 'हा जखमी याचिकाकर्त्याने दाखल केलेला अधिकृत दावा आहे. यात अपघात कधी, कुठे आणि कसा झाला हे स्पष्ट केले असून एसटी बस चालकाच्या निष्काळजी व बेदरकार वाहन चालवण्यामुळे हा अपघात घडल्याचा आरोप करण्यात आला आहे.'
  }
];

export const JUDICIARY_INFO_SECTIONS = [
  {
    id: 'jud-001',
    act: 'Motor Vehicles Act, 1988',
    section: 'Section 166: Application for Compensation',
    title: 'Legal Basis for Compensation Claim',
    explanation: 'Section 166 allows an injured victim or legal representatives of a deceased individual to file a claim before the Motor Accidents Claims Tribunal (MACT) within whose jurisdiction the accident occurred or where the claimant resides. The claimant must prove rash and negligent driving by the offending vehicle.',
    practicalImpact: 'Requires production of official Police First Information Report (FIR) and Charge Sheet to substantiate negligence.',
    disclaimer: 'Informational statutory reference only. Not an official court ruling or legal advice.'
  },
  {
    id: 'jud-002',
    act: 'Motor Vehicles Act, 1988',
    section: 'Section 140: Liability to pay compensation in certain cases on the principle of no fault',
    title: 'No-Fault Liability Interim Compensation',
    explanation: 'Provides immediate interim financial relief in cases of permanent disablement or death, without requiring claimant to prove negligence or fault of the offending driver.',
    practicalImpact: 'Enables counsel to apply for expedited interim relief while regular evidence and written statements are pending.',
    disclaimer: 'Informational statutory reference only. Not an official court ruling or legal advice.'
  },
  {
    id: 'jud-003',
    act: 'Code of Civil Procedure, 1908 (CPC)',
    section: 'Order VIII Rule 1: Written Statement Timing',
    title: 'Defence Filing Timelines & Forfeiture',
    explanation: 'Mandates that the defendant shall present a written statement of their defence within thirty days from the date of service of summons. The court may extend this up to ninety days for reasons recorded in writing, after which the right to file defence is forfeited.',
    practicalImpact: 'Underpins the strict 21 Jan 2026 deadline fixed in Order.pdf.',
    disclaimer: 'Informational statutory reference only. Not an official court ruling or legal advice.'
  }
];
