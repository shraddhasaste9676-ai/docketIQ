import React, { useState } from 'react';
import { CaseProvider, useCase } from './context/CaseContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { CitationModal } from './components/common/CitationModal';
import { ToastContainer } from './components/common/ToastContainer';
import { LaunchChecklistModal } from './components/checklist/LaunchChecklistModal';

// Screens
import { LandingPage } from './components/landing/LandingPage';
import { CaseDashboard } from './components/dashboard/CaseDashboard';
import { DocumentManager } from './components/documents/DocumentManager';
import { EvidenceIntegrityGate } from './components/evidence/EvidenceIntegrityGate';
import { CaseTimeline } from './components/timeline/CaseTimeline';
import { ContradictionMap } from './components/contradictions/ContradictionMap';
import { MissingLinkGraph } from './components/graph/MissingLinkGraph';
import { DeadlineOrganizer } from './components/deadlines/DeadlineOrganizer';
import { CaseInsights } from './components/insights/CaseInsights';
import { LegalSimplifier } from './components/simplifier/LegalSimplifier';
import { ReportGenerator } from './components/reports/ReportGenerator';
import { AuditTrail } from './components/audit/AuditTrail';
import { CommonRoom } from './components/commonroom/CommonRoom';
import { PrivacyPolicy } from './components/legal/PrivacyPolicy';
import { TermsConditions } from './components/legal/TermsConditions';

const AppContent: React.FC = () => {
  const { activeScreen } = useCase();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const isPublicPage = activeScreen === 'landing' || activeScreen === 'privacy' || activeScreen === 'terms';

  const renderScreen = () => {
    switch (activeScreen) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <CaseDashboard />;
      case 'documents':
        return <DocumentManager />;
      case 'evidence_gate':
        return <EvidenceIntegrityGate />;
      case 'timeline':
        return <CaseTimeline />;
      case 'contradictions':
        return <ContradictionMap />;
      case 'missing_links':
        return <MissingLinkGraph />;
      case 'deadlines':
        return <DeadlineOrganizer />;
      case 'insights':
        return <CaseInsights />;
      case 'simplifier':
        return <LegalSimplifier />;
      case 'reports':
        return <ReportGenerator />;
      case 'audit':
        return <AuditTrail />;
      case 'common_room':
        return <CommonRoom />;
      case 'privacy':
        return <PrivacyPolicy />;
      case 'terms':
        return <TermsConditions />;
      default:
        return <CaseDashboard />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F9FA] text-[#0F172A] font-sans">
      {/* Top Navigation */}
      <Navbar 
        onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)} 
        isSidebarOpen={isMobileSidebarOpen}
      />

      {/* Main Content Area */}
      {isPublicPage ? (
        <main className="flex-1">
          {renderScreen()}
        </main>
      ) : (
        <div className="flex-1 flex max-w-7xl w-full mx-auto">
          {/* App Sidebar */}
          <Sidebar 
            isOpen={isMobileSidebarOpen} 
            onClose={() => setIsMobileSidebarOpen(false)} 
          />

          {/* Screen Content Body */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">
            {renderScreen()}
          </main>
        </div>
      )}

      {/* Persistent Global Modals and Alerts */}
      <CitationModal />
      <LaunchChecklistModal />
      <ToastContainer />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <CaseProvider>
      <AppContent />
    </CaseProvider>
  );
}
