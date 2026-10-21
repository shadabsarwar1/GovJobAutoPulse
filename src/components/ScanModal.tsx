import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Search,
  Radio,
  CheckCircle2,
  AlertCircle,
  Globe,
  Loader2,
  Building,
  Landmark,
} from 'lucide-react';

interface ScanModalProps {
  onClose: () => void;
  onRunScan: (query: string, autoGenerate: boolean) => Promise<any>;
}

export const ScanModal: React.FC<ScanModalProps> = ({ onClose, onRunScan }) => {
  const [activeCategory, setActiveCategory] = useState<'Central' | 'West Bengal'>('West Bengal');
  const [selectedTopic, setSelectedTopic] = useState('WBPSC WBCS (Executive) & Clerkship Examination 2026');
  const [customQuery, setCustomQuery] = useState('');
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<{
    success: boolean;
    foundCount?: number;
    newCount?: number;
    newVacancies?: string[];
    message?: string;
  } | null>(null);

  const centralPresets = [
    { label: 'Staff Selection Commission (SSC)', query: 'SSC CGL CHSL MTS GD JE CPO SI Stenographer Notification 2026' },
    { label: 'UPSC Civil Services & CDS', query: 'UPSC Civil Services CSE CDS NDA CAPF EPFO Notification 2026' },
    { label: 'Banking: IBPS, SBI, RBI', query: 'IBPS PO Clerk SBI PO RBI Grade B NABARD Notification 2026' },
    { label: 'Railways: RRB & RRC', query: 'Railway RRB NTPC ALP JE Technician RRC Group D Notification 2026' },
    { label: 'Income Tax & CBDT', query: 'Income Tax Inspector Tax Assistant CBDT Direct Recruitment 2026' },
    { label: 'CBIC Customs & GST', query: 'CBIC Central Excise GST Inspector Preventive Officer 2026' },
    { label: 'EPFO & ESIC Labour', query: 'EPFO Social Security Assistant SSA EO AO ESIC UDC 2026' },
    { label: 'Defence: AFCAT, Army, Navy', query: 'AFCAT Air Force CDS Army TGC Navy Coast Guard 2026' },
    { label: 'Central Teaching (KVS/NVS)', query: 'KVS Kendriya Vidyalaya PGT TGT PRT NVS EMRS 2026' },
    { label: 'Central PSUs (Coal India/ONGC)', query: 'Coal India ONGC IOCL NTPC Management Trainee PSU 2026' },
  ];

  const westBengalPresets = [
    { label: 'WBPSC (WBCS & Clerkship)', query: 'WBPSC WBCS Executive WBPSC Clerkship Examination 2026' },
    { label: 'WBPSC Food SI & Misc', query: 'WBPSC Food Sub Inspector Food SI Miscellaneous Services 2026' },
    { label: 'WB Police & Kolkata Police', query: 'West Bengal Police WBPRB Kolkata Police Constable SI 2026' },
    { label: 'WB School Service (WBSSC)', query: 'WBSSC SLST Assistant Teacher Secondary Higher Secondary 2026' },
    { label: 'WB Primary TET (WBBPE)', query: 'West Bengal Primary TET Primary School Teacher WBBPE 2026' },
    { label: 'WB Municipal (WBMSC KMC)', query: 'WBMSC Kolkata Municipal Corporation KMC SAE Clerk 2026' },
    { label: 'WB Health (WBHRB Nurse)', query: 'WBHRB Staff Nurse Grade II Pharmacist Medical Officer 2026' },
    { label: 'WB Gram Panchayat (23 Dists)', query: 'WBPRIMS Gram Panchayat Karmee Secretary Sahayak 2026' },
    { label: 'WB State PSUs (WBSEDCL)', query: 'WBSEDCL Office Executive Junior Engineer West Bengal 2026' },
    { label: 'WB Directorates & Courts', query: 'Calcutta High Court District Court LDC Land Reforms West Bengal' },
  ];

  const currentPresets = activeCategory === 'Central' ? centralPresets : westBengalPresets;

  const handleStartScan = async () => {
    setIsScanning(true);
    setScanResult(null);

    const query = customQuery.trim() || selectedTopic;

    try {
      const res = await onRunScan(query, autoGenerate);
      if (res && res.success) {
        setScanResult({
          success: true,
          foundCount: res.foundCount,
          newCount: res.newCount,
          newVacancies: res.newVacancies,
          message: `Scan successful! Found ${res.foundCount} official notices and saved ${res.newCount} new exams into ESC Kolkata pulse radar.`,
        });
      } else {
        setScanResult({
          success: false,
          message: res?.error || 'Scan completed with no new vacancies detected.',
        });
      }
    } catch (err: any) {
      setScanResult({
        success: false,
        message: err.message || 'Error occurred while scanning.',
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Run Web Surveillance Scan</h3>
              <p className="text-xs text-slate-500">
                Ground-truth discovery across Central & West Bengal Government Authorities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Selector Tabs */}
        <div className="px-5 pt-3 bg-white border-b border-slate-200 flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              setActiveCategory('West Bengal');
              setSelectedTopic(westBengalPresets[0].query);
            }}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'West Bengal'
                ? 'border-emerald-600 text-emerald-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Landmark className="w-3.5 h-3.5" />
            🏛️ West Bengal State Portals (WBPSC, Police, KMC, WBSSC, WBHRB)
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveCategory('Central');
              setSelectedTopic(centralPresets[0].query);
            }}
            className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
              activeCategory === 'Central'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            🇮🇳 Central Government Portals (SSC, UPSC, Banking, Income Tax, Railways)
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">
              Select Recruitment Authority / Exam Category:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentPresets.map((preset, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSelectedTopic(preset.query);
                    setCustomQuery('');
                  }}
                  className={`p-2.5 rounded-lg text-left text-xs font-medium border transition cursor-pointer ${
                    selectedTopic === preset.query && !customQuery
                      ? activeCategory === 'West Bengal'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold'
                        : 'bg-blue-50 border-blue-500 text-blue-900 font-bold'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="font-bold">{preset.label}</div>
                  <div className="text-[10px] text-slate-500 truncate mt-0.5">{preset.query}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Or Custom Search Query:
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="e.g. WBPSC Food SI vacancy notice 2026 or Income Tax Inspector CBDT"
                value={customQuery}
                onChange={(e) => setCustomQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">Auto-generate WordPress Post</span>
              <span className="text-[11px] text-slate-500">
                Immediately format ready-to-publish article with syllabus & quick facts table
              </span>
            </div>
            <input
              type="checkbox"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Feedback */}
          {scanResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs ${
                scanResult.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              <div className="flex items-center gap-2 font-bold">
                {scanResult.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                )}
                <span>{scanResult.message}</span>
              </div>
              {scanResult.newVacancies && scanResult.newVacancies.length > 0 && (
                <div className="mt-2 text-slate-700">
                  <span className="font-semibold">New entries stored: </span>
                  {scanResult.newVacancies.join(', ')}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleStartScan}
            disabled={isScanning}
            className={`px-5 py-2 rounded-lg text-white text-xs font-bold shadow-md flex items-center gap-2 transition disabled:opacity-50 cursor-pointer ${
              activeCategory === 'West Bengal'
                ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30'
                : 'bg-blue-600 hover:bg-blue-500 shadow-blue-600/30'
            }`}
          >
            {isScanning ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Scanning Official Portals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Scan {activeCategory} Portals</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
