import React, { useState } from 'react';
import {
  X,
  FileText,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Clipboard,
} from 'lucide-react';
import { GovVacancy } from '../types/index.js';

interface CustomIngestModalProps {
  onClose: () => void;
  onIngestSuccess: (vacancy: GovVacancy) => void;
}

export const CustomIngestModal: React.FC<CustomIngestModalProps> = ({
  onClose,
  onIngestSuccess,
}) => {
  const [rawText, setRawText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sampleNotices = [
    {
      label: 'Sample: Staff Selection Commission (SSC) CHSL Notice',
      text: `STAFF SELECTION COMMISSION
NOTICE: Combined Higher Secondary (10+2) Level Examination, 2026
Dates for submission of online applications: 02-05-2026 to 01-06-2026
Last date and time for receipt of online applications: 01-06-2026 (23:00)
Schedule of Tier-I (Computer Based Examination): July 2026
Pay Scale: Lower Division Clerk (LDC)/ Junior Secretariat Assistant (JSA): Pay Level-2 (Rs. 19,900-63,200). Data Entry Operator (DEO): Pay Level-4 (Rs. 25,500-81,100).
Vacancies: Tentatively 3,712 vacancies.
Age Limit: 18-27 years as on 01-08-2026.
Essential Qualifications: Must have passed 12th Standard or equivalent examination from a recognized Board.
Application Fee: Rs. 100/- (Women/SC/ST/PwBD/ESM exempted).
Official Website: https://ssc.gov.in`,
    },
    {
      label: 'Sample: Central Bank PO / Specialist Officer Notice',
      text: `RECRUITMENT OF SPECIALIST OFFICERS (IT, LAW, MARKETING) 2026
Registration opens: 15-07-2026 to 05-08-2026.
Total vacancies: 1,250 posts across Scale I and Scale II.
Scale of Pay: Scale I (Rs. 48,480 - 85,920).
Eligibility: B.Tech / BE in CS/IT or MCA, or LLB for Law Officer.
Age: 20 to 30 years.
Selection Process: Online Written Test (Professional Knowledge + English + Reasoning) followed by Interview.
Apply online at: https://ibps.in`,
    },
  ];

  const handleParse = async () => {
    if (!rawText.trim()) {
      setError('Please paste or enter some text from the notice or circular.');
      return;
    }

    setIsParsing(true);
    setError(null);

    try {
      const response = await fetch('/api/custom-parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawText }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        onIngestSuccess(data.vacancy);
      } else {
        setError(data.error || 'Failed to parse notice.');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with server.');
    } finally {
      setIsParsing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Custom Notice / PDF Parser</h3>
              <p className="text-xs text-slate-500">
                Paste raw government circulars, PDF text, or newspaper clips to auto-create posts
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

        {/* Body */}
        <div className="p-5 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-700">
                Paste Announcement / Notification Text:
              </label>
              <div className="flex items-center gap-2">
                {sampleNotices.map((sample, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRawText(sample.text)}
                    className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold underline cursor-pointer"
                  >
                    Load Sample {i + 1}
                  </button>
                ))}
              </div>
            </div>

            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Paste notification circular text here (e.g. from SSC.gov.in, IBPS, Employment News, Railway Gazettes)..."
              rows={9}
              className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleParse}
            disabled={isParsing || !rawText.trim()}
            className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-2 transition disabled:opacity-50 cursor-pointer"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>AI Extracting Exam Parameters...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Extract Details & Generate Post</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
