import React from 'react';
import {
  Globe,
  Radio,
  Sparkles,
  Settings,
  PlusCircle,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Bell,
  Mail,
} from 'lucide-react';
import { SystemStatus, AutomationSettings } from '../types/index.js';

interface HeaderProps {
  status: SystemStatus | null;
  settings: AutomationSettings | null;
  onOpenScan: () => void;
  onOpenIngest: () => void;
  onOpenSettings: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  status,
  settings,
  onOpenScan,
  onOpenIngest,
  onOpenSettings,
  activeTab,
  setActiveTab,
}) => {
  const pendingApprovals = status?.pendingApprovalCount || 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30 shadow-md">
      {/* Top Notice Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-600 to-emerald-600 px-4 py-1.5 text-xs font-medium text-white flex items-center justify-between">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-300"></span>
          </span>
          <span className="font-bold tracking-wide">AUTO-SURVEILLANCE RADAR ACTIVE:</span>
          <span className="truncate opacity-95">
            Central &amp; West Bengal Vacancies • Email &amp; WhatsApp Admin Approval Gate Active.
          </span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="text-blue-100 flex items-center gap-1">
            Target Site: <strong className="text-white underline">{settings?.siteUrl || 'https://esckolkata2003.org'}</strong>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Brand & Educator Title */}
          <div className="flex items-center gap-3.5">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-blue-500/20 text-white ring-2 ring-white/10 shrink-0">
              <Radio className="w-6 h-6 animate-pulse text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  GovJobAutoPulse
                  <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                    ESC KOLKATA
                  </span>
                </h1>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Education Support Council (Est. 2003)</span>
                <span>•</span>
                <span className="text-emerald-400 flex items-center gap-1 font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Admin Approval Gate Active
                </span>
                <span>•</span>
                <a
                  href="https://esckolkata2003.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 flex items-center gap-0.5 underline"
                >
                  esckolkata2003.org <ExternalLink className="w-3 h-3" />
                </a>
              </p>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {pendingApprovals > 0 && (
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-3 py-2 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 transition hover:bg-amber-500/30 cursor-pointer animate-pulse"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{pendingApprovals} Approvals Pending</span>
              </button>
            )}

            <button
              onClick={onOpenScan}
              disabled={status?.isScanning}
              className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${status?.isScanning ? 'animate-spin' : ''}`} />
              <span>{status?.isScanning ? 'Scanning Official Portals...' : 'Run Web Scan'}</span>
            </button>

            <button
              onClick={onOpenIngest}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Parse Notice / PDF</span>
            </button>

            <button
              onClick={onOpenSettings}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5 text-blue-400" />
              <span>Integration</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 mt-4 pt-3 border-t border-slate-800 overflow-x-auto text-xs">
          <button
            onClick={() => setActiveTab('vacancies')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'vacancies'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📋 Exam Vacancies &amp; Posts ({status?.totalTracked || 0})
          </button>

          <button
            onClick={() => setActiveTab('approvals')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'approvals'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin Approvals &amp; Alerts</span>
            {pendingApprovals > 0 && (
              <span className="px-1.5 py-0.2 rounded-full font-bold bg-amber-400 text-slate-900 text-[10px]">
                {pendingApprovals}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('scheduler')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'scheduler'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            ⚡ Surveillance Radar (23 Portals)
          </button>

          <button
            onClick={() => setActiveTab('broadcast')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'broadcast'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📢 Student Broadcasts (WhatsApp/Telegram)
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'settings'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            🔗 esckolkata2003.org Integration
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`px-3.5 py-1.5 rounded-md font-medium transition cursor-pointer whitespace-nowrap ${
              activeTab === 'logs'
                ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 font-semibold'
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            📊 Audit &amp; Sync Logs
          </button>
        </div>
      </div>
    </header>
  );
};
