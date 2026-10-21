import React from 'react';
import {
  Calendar,
  Building,
  GraduationCap,
  Banknote,
  Send,
  Eye,
  ExternalLink,
  FileDown,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Trash2,
  AlertCircle,
  Landmark,
  MapPin,
} from 'lucide-react';
import { GovVacancy } from '../types/index.js';

interface VacancyCardProps {
  vacancy: GovVacancy;
  onPreviewPost: (vacancy: GovVacancy) => void;
  onQuickPublish: (vacancy: GovVacancy) => void;
  onDeleteVacancy: (id: string) => void;
  isPublishing?: boolean;
}

export const VacancyCard: React.FC<VacancyCardProps> = ({
  vacancy,
  onPreviewPost,
  onQuickPublish,
  onDeleteVacancy,
  isPublishing,
}) => {
  // Calculate remaining days
  const calculateDaysLeft = (lastDateStr: string) => {
    try {
      const target = new Date(lastDateStr).getTime();
      const now = new Date().getTime();
      const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return null;
    }
  };

  const daysLeft = calculateDaysLeft(vacancy.lastDate);

  // Board colors
  const getBoardBadgeClass = (board: string) => {
    switch (board) {
      case 'SSC':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'UPSC':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'IBPS':
      case 'SBI':
      case 'RBI & Financial':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Income Tax & CBDT':
      case 'CBIC & Customs':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Railways RRB & RRC':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'EPFO & ESIC':
        return 'bg-teal-100 text-teal-800 border-teal-200';
      case 'Defence (Army/Navy/Air Force/Coast Guard)':
      case 'CAPFs & Central Police':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'WBPSC':
        return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case 'WB Police (WBPRB & KP)':
        return 'bg-rose-100 text-rose-800 border-rose-200';
      case 'WB School Service (WBSSC)':
      case 'WB Primary Education (WBBPE)':
        return 'bg-sky-100 text-sky-800 border-sky-200';
      case 'WB Municipal Service (WBMSC)':
        return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
      case 'WB Health (WBHRB)':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'WB District & Panchayat (DM/Zilla Parishad)':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  const isWestBengal = vacancy.jurisdiction === 'West Bengal' || String(vacancy.examBoard).startsWith('WB');

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs hover:shadow-md transition duration-200 flex flex-col justify-between overflow-hidden group">
      <div>
        {/* Top Header Card Info */}
        <div className="p-4 sm:p-5 border-b border-slate-100">
          <div className="flex items-start justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-1.5 flex-wrap">
              {/* Jurisdiction Flag Tag */}
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                  isWestBengal
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-blue-700 text-white shadow-2xs'
                }`}
              >
                {isWestBengal ? '🏛️ West Bengal' : '🇮🇳 Central Govt'}
              </span>

              <span
                className={`text-xs px-2 py-0.5 rounded-md font-bold border ${getBoardBadgeClass(
                  vacancy.examBoard
                )}`}
              >
                {vacancy.examBoard}
              </span>

              <span className="text-xs px-2 py-0.5 rounded-md font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                {typeof vacancy.vacanciesCount === 'number'
                  ? `${vacancy.vacanciesCount.toLocaleString()} Posts`
                  : `${vacancy.vacanciesCount} Posts`}
              </span>
            </div>

            {/* Sync status chip */}
            <div>
              {vacancy.syncStatus === 'published_to_site' ? (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  Live on Site
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                  <Clock className="w-3 h-3 text-amber-600" />
                  Draft Ready
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-600 transition leading-snug">
            {vacancy.title}
          </h3>

          <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
            {vacancy.summary}
          </p>
        </div>

        {/* Vital Exam Facts Grid */}
        <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-b border-slate-100 grid grid-cols-2 gap-2.5 text-xs">
          <div>
            <span className="text-slate-400 font-medium block flex items-center gap-1">
              <Banknote className="w-3.5 h-3.5 text-slate-500" />
              Pay Scale:
            </span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5">
              {vacancy.salaryScale}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              Eligibility:
            </span>
            <span className="font-semibold text-slate-800 truncate block mt-0.5" title={vacancy.qualification}>
              {vacancy.qualificationLevel}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-500" />
              Age Criteria:
            </span>
            <span className="font-semibold text-slate-800 block mt-0.5 truncate">
              {vacancy.ageLimit}
            </span>
          </div>

          <div>
            <span className="text-slate-400 font-medium block flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              Application Deadline:
            </span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="font-bold text-slate-900">{vacancy.lastDate}</span>
              {daysLeft !== null && daysLeft > 0 && daysLeft <= 10 && (
                <span className="text-[10px] px-1 py-0.2 rounded font-bold bg-rose-100 text-rose-700 animate-pulse">
                  {daysLeft}d left!
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Highlights & ESC Mentorship snippet */}
        <div className="p-4 sm:p-5 text-xs">
          <div className="mb-3">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
              Key Highlights & Selection:
            </span>
            <ul className="space-y-1 text-slate-600">
              {vacancy.keyHighlights.slice(0, 2).map((h, i) => (
                <li key={i} className="flex items-start gap-1.5">
                  <span className="text-blue-500 font-bold">•</span>
                  <span className="line-clamp-1">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {vacancy.esckolkataGuidance && (
            <div className="p-2.5 rounded-lg bg-blue-50/70 border border-blue-100 text-blue-900">
              <div className="flex items-center gap-1 font-bold text-[11px] text-blue-700">
                <Sparkles className="w-3 h-3 text-amber-500" />
                ESC Kolkata Mentor Strategy:
              </div>
              <p className="text-[11px] text-slate-700 mt-1 line-clamp-1 italic">
                "{vacancy.esckolkataGuidance.strategyTips[0]}"
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 sm:px-5 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-1.5">
          <a
            href={vacancy.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            title="Official Portal"
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
          >
            <ExternalLink className="w-4 h-4" />
          </a>

          {vacancy.notificationPdfUrl && (
            <a
              href={vacancy.notificationPdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              title="Official PDF Notification"
              className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition"
            >
              <FileDown className="w-4 h-4" />
            </a>
          )}

          <button
            onClick={() => onDeleteVacancy(vacancy.id)}
            title="Remove from tracking"
            className="p-1.5 rounded-lg hover:bg-rose-100 text-slate-400 hover:text-rose-600 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPreviewPost(vacancy)}
            className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs font-semibold flex items-center gap-1 shadow-2xs transition cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-blue-600" />
            <span>Review Article</span>
          </button>

          <button
            onClick={() => onQuickPublish(vacancy)}
            disabled={isPublishing}
            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 shadow-sm transition disabled:opacity-50 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>
              {vacancy.syncStatus === 'published_to_site'
                ? 'Update'
                : 'Publish to Site'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
