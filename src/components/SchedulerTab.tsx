import React, { useState, useEffect } from 'react';
import {
  Radio,
  Zap,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Globe,
  ExternalLink,
  Cpu,
  Layers,
  Database,
  Send,
  Building,
  Landmark,
  Search,
} from 'lucide-react';
import { SystemStatus, AutomationSettings, MonitoredPortal } from '../types/index.js';

interface SchedulerTabProps {
  status: SystemStatus | null;
  settings: AutomationSettings | null;
  onRunScan: () => void;
  onOpenSettings: () => void;
}

export const SchedulerTab: React.FC<SchedulerTabProps> = ({
  status,
  settings,
  onRunScan,
  onOpenSettings,
}) => {
  const [portals, setPortals] = useState<MonitoredPortal[]>([]);
  const [portalFilter, setPortalFilter] = useState<'All' | 'Central' | 'West Bengal'>('All');
  const [portalSearch, setPortalSearch] = useState('');
  const [isTriggering, setIsTriggering] = useState(false);

  useEffect(() => {
    fetch('/api/portals')
      .then((res) => res.json())
      .then((data) => setPortals(data))
      .catch((err) => console.error('Failed to load portals:', err));
  }, []);

  const handleManualTrigger = () => {
    setIsTriggering(true);
    onRunScan();
    setTimeout(() => setIsTriggering(false), 2000);
  };

  const filteredPortals = portals.filter((p) => {
    const matchesJurisdiction = portalFilter === 'All' || p.jurisdiction === portalFilter;
    const matchesSearch =
      p.name.toLowerCase().includes(portalSearch.toLowerCase()) ||
      p.domain.toLowerCase().includes(portalSearch.toLowerCase()) ||
      p.keyExams.toLowerCase().includes(portalSearch.toLowerCase());
    return matchesJurisdiction && matchesSearch;
  });

  const centralCount = portals.filter((p) => p.jurisdiction === 'Central').length;
  const wbCount = portals.filter((p) => p.jurisdiction === 'West Bengal').length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                Surveillance Radar System: Online
              </span>
            </div>
            <h2 className="text-xl font-extrabold tracking-tight">
              Central & West Bengal Government Vacancy Radar
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              GovJobAutoPulse continuously monitors all central recruitment bodies (SSC, UPSC, Banking, Income Tax, Railways, Defence) and West Bengal state authorities (WBPSC, WB Police/KP, WBSSC, WB Primary, WBMSC, WBHRB, District Panchayats). When a notice is published, Gemini extracts details and pushes the post to <strong className="text-white underline">esckolkata2003.org</strong>.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={handleManualTrigger}
              disabled={isTriggering || status?.isScanning}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isTriggering || status?.isScanning ? 'animate-spin' : ''}`} />
              <span>{status?.isScanning ? 'Scanning Portals...' : 'Trigger Scan Now'}</span>
            </button>
          </div>
        </div>

        {/* Status Indicators in Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-slate-800 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Central Portals:</span>
            <span className="font-bold text-white mt-0.5 block flex items-center gap-1">
              🇮🇳 {centralCount} Authorities
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">West Bengal Portals:</span>
            <span className="font-bold text-emerald-400 mt-0.5 block flex items-center gap-1">
              🏛️ {wbCount} State Bodies
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Scan Interval:</span>
            <span className="font-bold text-white mt-0.5 block">
              Every {settings?.autoScanInterval || 60} Minutes
            </span>
          </div>

          <div>
            <span className="text-slate-400 block font-medium">Publishing Target:</span>
            <span className="font-bold text-blue-300 truncate mt-0.5 block">
              esckolkata2003.org ({settings?.postStatus || 'draft'})
            </span>
          </div>
        </div>
      </div>

      {/* Visual Pipeline Architecture Diagram */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 mb-1">
          End-to-End Automation Flow Architecture
        </h3>
        <p className="text-xs text-slate-500 mb-5">
          How newly announced government exams flow seamlessly from official gazettes into your website
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 relative">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
              1
            </div>
            <h4 className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-blue-600" />
              Official Portal Web Radar
            </h4>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Surveillance crawlers poll Central (SSC, IBPS, UPSC, RRB) and West Bengal (WBPSC, WBPRB, WBMSC) portals.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-indigo-50/70 border border-indigo-200 relative">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
              2
            </div>
            <h4 className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-indigo-600" />
              Gemini 3.8 Flash Parser
            </h4>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Extracts post name, vacancy numbers, pay scales, age limits, syllabus stages, and deadlines.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200 relative">
            <div className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
              3
            </div>
            <h4 className="text-xs font-bold text-purple-950 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-purple-600" />
              ESC Kolkata Article Engine
            </h4>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Generates SEO post title, quick facts table, syllabus matrix, and educator preparation notes.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 relative">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-xs mb-3 shadow-xs">
              4
            </div>
            <h4 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
              <Send className="w-3.5 h-3.5 text-emerald-600" />
              Direct WordPress REST Dispatch
            </h4>
            <p className="text-[11px] text-slate-600 mt-1.5 leading-relaxed">
              Pushes live or draft article to <code>esckolkata2003.org</code> + formats WhatsApp broadcast.
            </p>
          </div>
        </div>
      </div>

      {/* Monitored Authorities Grid */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Active Official Portals Registry ({filteredPortals.length})
            </h3>
            <p className="text-xs text-slate-500">
              Comprehensive recruitment sources monitored for Central and West Bengal vacancies
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-xs">
            <button
              onClick={() => setPortalFilter('All')}
              className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                portalFilter === 'All'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              All ({portals.length})
            </button>
            <button
              onClick={() => setPortalFilter('Central')}
              className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                portalFilter === 'Central'
                  ? 'bg-blue-600 text-white'
                  : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
              }`}
            >
              Central Govt ({centralCount})
            </button>
            <button
              onClick={() => setPortalFilter('West Bengal')}
              className={`px-2.5 py-1 rounded-md font-semibold cursor-pointer ${
                portalFilter === 'West Bengal'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
              }`}
            >
              West Bengal ({wbCount})
            </button>
          </div>
        </div>

        {/* Search within portals */}
        <div className="mb-4">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search portal or exam name (e.g. Police, KMC, Food SI, Income Tax, UPSC, RRB)..."
              value={portalSearch}
              onChange={(e) => setPortalSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-3">
          {filteredPortals.map((source) => (
            <div
              key={source.id}
              className="p-3.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-slate-50/60 hover:bg-white transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
            >
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-slate-900">{source.name}</span>
                  <span
                    className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                      source.jurisdiction === 'Central'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {source.jurisdiction === 'Central' ? '🇮🇳 Central' : '🏛️ West Bengal'}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                    {source.category}
                  </span>
                </div>
                <div className="text-slate-600 text-[11px] mt-1">
                  <strong>Tracked Exams: </strong> {source.keyExams}
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[11px] text-blue-600 hover:text-blue-800 bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1"
                >
                  <span>{source.domain}</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>

                <span className="inline-flex items-center gap-1 font-bold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-200 text-[10px]">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Active Radar
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
