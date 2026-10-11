import React, { useState } from 'react';
import { useCase } from '../../context/CaseContext';
import { Logo } from '../brand/Logo';
import { 
  Users, 
  Briefcase, 
  CheckSquare, 
  Menu, 
  X, 
  ArrowRight
} from 'lucide-react';

interface NavbarProps {
  onToggleMobileSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileSidebar, isSidebarOpen }) => {
  const { 
    activeScreen, 
    setActiveScreen, 
    currentRole, 
    setCurrentRole, 
    setIsChecklistOpen,
    caseInfo
  } = useCase();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isLanding = activeScreen === 'landing';
  const isLegal = activeScreen === 'privacy' || activeScreen === 'terms';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-xs border-b border-slate-200 shadow-xs">
      {/* Top Advisory Bar */}
      <div className="bg-[#0F2547] text-white px-4 py-1 text-[11px] font-medium flex items-center justify-between no-print">
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          <span>Fictional Demonstration Mode: All case records & citations are sample data.</span>
        </div>
        <div className="hidden sm:flex items-center gap-4 text-slate-300">
          <span>Evidentiary Traceability Platform</span>
          <span>•</span>
          <button 
            onClick={() => setIsChecklistOpen(true)}
            className="text-sky-300 hover:text-white underline cursor-pointer"
          >
            Launch Checklist
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand & Mobile Sidebar Toggle */}
        <div className="flex items-center gap-3">
          {!isLanding && !isLegal && onToggleMobileSidebar && (
            <button
              onClick={onToggleMobileSidebar}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded focus:outline-none"
              aria-label="Toggle navigation drawer"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <button 
            onClick={() => setActiveScreen('landing')}
            className="flex items-center text-left focus:outline-none focus:ring-2 focus:ring-[#0F2547] rounded"
          >
            <Logo size="md" />
          </button>

          {!isLanding && (
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-slate-200 text-xs">
              <span className="font-mono text-slate-500 font-semibold">{caseInfo.internalReference}</span>
              <span className="text-slate-300">|</span>
              <span className="text-slate-800 font-medium truncate max-w-xs">{caseInfo.caseTitle}</span>
            </div>
          )}
        </div>

        {/* Right Section */}
        {isLanding ? (
          /* Public Navigation */
          <div className="hidden md:flex items-center gap-7">
            <nav className="flex items-center gap-6 text-xs font-semibold text-slate-600">
              <button 
                onClick={() => {
                  const el = document.getElementById('preview-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hover:text-[#0F2547] transition-colors"
              >
                Product
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('how-it-works-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hover:text-[#0F2547] transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('common-room-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hover:text-[#0F2547] transition-colors"
              >
                Common Room
              </button>
              <button 
                onClick={() => {
                  const el = document.getElementById('trust-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }} 
                className="hover:text-[#0F2547] transition-colors"
              >
                Security & Privacy
              </button>
            </nav>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setCurrentRole('lawyer');
                  setActiveScreen('dashboard');
                }}
                className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              >
                Sign In
              </button>
              <button
                onClick={() => {
                  setCurrentRole('lawyer');
                  setActiveScreen('dashboard');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#0F2547] hover:bg-[#1E3A8A] rounded transition-colors shadow-xs"
              >
                <span>Get Started</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ) : (
          /* Application Mode Header Controls */
          <div className="flex items-center gap-3">
            {/* Role Switcher */}
            <div className="flex items-center bg-slate-100 p-0.5 rounded border border-slate-200">
              <button
                onClick={() => setCurrentRole('lawyer')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  currentRole === 'lawyer'
                    ? 'bg-white text-[#0F2547] shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Counsel workspace view"
              >
                <Briefcase className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Lawyer Workspace</span>
                <span className="sm:hidden">Lawyer</span>
              </button>
              <button
                onClick={() => setCurrentRole('client')}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded transition-all ${
                  currentRole === 'client'
                    ? 'bg-white text-teal-800 shadow-xs border border-slate-200/60'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Switch to Client Portal view"
              >
                <Users className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Client Portal</span>
                <span className="sm:hidden">Client</span>
              </button>
            </div>

            {/* Checklist Button */}
            <button
              onClick={() => setIsChecklistOpen(true)}
              className="p-1.5 text-slate-600 hover:text-[#0F2547] hover:bg-slate-100 rounded transition-colors hidden sm:flex items-center gap-1 text-xs font-semibold"
              title="Launch Readiness Checklist"
            >
              <CheckSquare className="w-4 h-4 text-slate-600" />
              <span className="hidden md:inline">Checklist</span>
            </button>

            {/* Return to Landing Page */}
            <button
              onClick={() => setActiveScreen('landing')}
              className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded border border-slate-200 transition-colors"
            >
              Overview
            </button>
          </div>
        )}

        {/* Mobile Hamburger toggle for landing */}
        {isLanding && (
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Drawer Menu for Landing */}
      {isLanding && mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-4 space-y-3 animate-in slide-in-from-top-2">
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('preview-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-1.5 text-xs font-semibold text-slate-700"
          >
            Product
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('how-it-works-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-1.5 text-xs font-semibold text-slate-700"
          >
            How It Works
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('common-room-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-1.5 text-xs font-semibold text-slate-700"
          >
            Common Room
          </button>
          <button 
            onClick={() => {
              setMobileMenuOpen(false);
              document.getElementById('trust-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="block w-full text-left py-1.5 text-xs font-semibold text-slate-700"
          >
            Security & Privacy
          </button>
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setActiveScreen('dashboard');
              }}
              className="w-full py-2 text-xs font-semibold text-white bg-[#0F2547] rounded text-center"
            >
              Explore the Demo
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
