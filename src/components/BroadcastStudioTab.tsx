import React, { useState } from 'react';
import {
  Share2,
  Copy,
  Check,
  Send,
  MessageSquare,
  Sparkles,
  ExternalLink,
  Building,
  GraduationCap,
  Calendar,
  Clock,
} from 'lucide-react';
import { GovVacancy, AutomationSettings } from '../types/index.js';
import { formatDateDDMMYYYY, parseDateFlexible } from '../utils/dateUtils.js';

interface BroadcastStudioTabProps {
  vacancies: GovVacancy[];
  settings: AutomationSettings | null;
}

export const BroadcastStudioTab: React.FC<BroadcastStudioTabProps> = ({
  vacancies,
  settings,
}) => {
  const sortedVacancies = [...vacancies].sort(
    (a, b) =>
      (parseDateFlexible(b.lastDate)?.getTime() || 0) -
      (parseDateFlexible(a.lastDate)?.getTime() || 0)
  );

  const [selectedVacancyId, setSelectedVacancyId] = useState<string>(
    sortedVacancies[0]?.id || ''
  );
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [customAnnouncement, setCustomAnnouncement] = useState(
    '🎯 Special Guidance Session & Free Mock Test Series available at ESC Kolkata for all registered students!'
  );

  const selectedVacancy =
    sortedVacancies.find((v) => v.id === selectedVacancyId) || sortedVacancies[0];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  if (!selectedVacancy) {
    return (
      <div className="text-center py-12 text-slate-500 text-sm">
        No vacancies tracked yet. Run a web scan to discover notifications.
      </div>
    );
  }

  const websiteUrl = settings?.siteUrl || 'https://esckolkata2003.org';
  const postSlug =
    selectedVacancy.generatedPost?.slug ||
    selectedVacancy.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const fullArticleLink = `${websiteUrl}/${postSlug}`;

  // Formatted WhatsApp message
  const whatsAppMessage = `🚨 *NEW GOVT EXAM VACANCY ALERT!* 🚨
━━━━━━━━━━━━━━━━━━━━
🎓 *${selectedVacancy.title}*

🏛️ *Recruitment Board:* ${selectedVacancy.examBoard}
🎯 *Total Vacancies:* ${selectedVacancy.vacanciesCount} Posts
💰 *Pay Scale:* ${selectedVacancy.salaryScale}
🎓 *Eligibility:* ${selectedVacancy.qualification} (${selectedVacancy.qualificationLevel})
⏳ *Age Limit:* ${selectedVacancy.ageLimit}

📅 *IMPORTANT DATES:*
• Application Start: ${formatDateDDMMYYYY(selectedVacancy.startDate)}
• *Last Date to Apply:* ${formatDateDDMMYYYY(selectedVacancy.lastDate)}
• Exam Schedule: ${selectedVacancy.examDate || 'Announced Soon'}

💡 *ESC KOLKATA MENTOR STRATEGY:*
"${selectedVacancy.esckolkataGuidance?.strategyTips?.[0] || 'Start high-yield topic revision and mock tests.'}"

📢 *${customAnnouncement}*

🔗 *Read Complete Syllabus & Apply Online:*
👉 ${fullArticleLink}

━━━━━━━━━━━━━━━━━━━━
_Shared by Education Support Council (ESC Kolkata)_
_Guiding Competitive Aspirants Since 2003_
🌐 Website: ${websiteUrl}
📞 Helpline: ${settings?.escBranding?.phone || 'Kolkata Center'}`;

  // Formatted Telegram message
  const telegramMessage = `📢 **GOVERNMENT EXAM RECRUITMENT NOTIFICATION** 📢
────────────────────────
🏛️ **${selectedVacancy.title}**

🔹 **Board:** ${selectedVacancy.examBoard}
🔹 **Vacancies:** ${selectedVacancy.vacanciesCount}
🔹 **Salary / Pay Scale:** ${selectedVacancy.salaryScale}
🔹 **Qualification:** ${selectedVacancy.qualification}
🔹 **Age Criteria:** ${selectedVacancy.ageLimit}

⏰ **CRUCIAL APPLICATION DEADLINE:**
**${formatDateDDMMYYYY(selectedVacancy.lastDate)}**

💡 **ESC Kolkata Faculty Tip:**
_${selectedVacancy.esckolkataGuidance?.strategyTips?.[0] || 'Focus on speed and accuracy in reasoning and quantitative sections.'}_

🎓 **Batch Alert:** ${selectedVacancy.esckolkataGuidance?.recommendedBatch || 'ESC Kolkata Regular Classroom & Online Cohort'}

🔗 **Full Notification, Syllabus Breakdown & Application Link:**
${fullArticleLink}

────────────────────────
*Education Support Council (ESC Kolkata) - Est. 2003*`;

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <Share2 className="w-5 h-5 text-emerald-600" />
            Student Broadcast Studio
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            1-Click formatted announcements for your WhatsApp student groups, broadcast lists, and Telegram channel.
          </p>
        </div>

        {/* Exam selector */}
        <div className="w-full sm:w-80">
          <label className="text-[11px] font-bold text-slate-600 uppercase tracking-wider block mb-1">
            Select Exam to Broadcast (Newest Deadline First):
          </label>
          <select
            value={selectedVacancyId}
            onChange={(e) => setSelectedVacancyId(e.target.value)}
            className="w-full p-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-slate-50 font-medium"
          >
            {sortedVacancies.map((v) => (
              <option key={v.id} value={v.id}>
                {v.shortName} (Deadline: {formatDateDDMMYYYY(v.lastDate)} • {v.vacanciesCount} Posts)
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Custom Batch announcement addon */}
      <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs">
        <label className="font-bold text-blue-900 block mb-1">
          Add Custom Batch / Institute Announcement to Broadcast:
        </label>
        <input
          type="text"
          value={customAnnouncement}
          onChange={(e) => setCustomAnnouncement(e.target.value)}
          placeholder="e.g. New Batch starting this Monday at Kolkata Center! Call for seat reservation."
          className="w-full p-2 text-xs bg-white border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Grid of Broadcast Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* WhatsApp Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  WA
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">WhatsApp Broadcast Message</h3>
                  <span className="text-[11px] text-slate-500">Includes WhatsApp bold formatting (*), bullets & emojis</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(whatsAppMessage, 'wa_tab')}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedType === 'wa_tab' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'wa_tab' ? 'Copied!' : 'Copy Message'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-emerald-300 rounded-xl text-xs whitespace-pre-wrap font-mono leading-relaxed border border-slate-800 max-h-96 overflow-y-auto">
              {whatsAppMessage}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Direct Website Link Attached</span>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(whatsAppMessage)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 font-semibold hover:bg-emerald-100 transition flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Open in WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Telegram Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                  TG
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Telegram Channel Broadcast</h3>
                  <span className="text-[11px] text-slate-500">Formatted with Telegram Markdown for channel broadcast</span>
                </div>
              </div>

              <button
                onClick={() => copyToClipboard(telegramMessage, 'tg_tab')}
                className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
              >
                {copiedType === 'tg_tab' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedType === 'tg_tab' ? 'Copied!' : 'Copy Markdown'}</span>
              </button>
            </div>

            <pre className="p-3.5 bg-slate-900 text-sky-200 rounded-xl text-xs whitespace-pre-wrap font-mono leading-relaxed border border-slate-800 max-h-96 overflow-y-auto">
              {telegramMessage}
            </pre>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Telegram Channel Ready</span>
            <a
              href={`https://t.me/share/url?url=${encodeURIComponent(fullArticleLink)}&text=${encodeURIComponent(
                `${selectedVacancy.title} - ${selectedVacancy.vacanciesCount} Vacancies Released!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 font-semibold hover:bg-sky-100 transition flex items-center gap-1"
            >
              <Send className="w-3 h-3" />
              <span>Share to Telegram</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
