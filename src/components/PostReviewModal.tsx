import React, { useState } from 'react';
import {
  X,
  Send,
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Share2,
  Code,
  FileText,
  AlertCircle,
  Building,
  GraduationCap,
  Calendar,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { GovVacancy, GeneratedPost, AutomationSettings } from '../types/index.js';
import { formatDateDDMMYYYY } from '../utils/dateUtils.js';

interface PostReviewModalProps {
  vacancy: GovVacancy;
  settings: AutomationSettings | null;
  onClose: () => void;
  onPublish: (vacancy: GovVacancy, customPost?: GeneratedPost) => Promise<any>;
  onRegeneratePost: (vacancyId: string) => Promise<any>;
}

export const PostReviewModal: React.FC<PostReviewModalProps> = ({
  vacancy,
  settings,
  onClose,
  onPublish,
  onRegeneratePost,
}) => {
  const [activeView, setActiveView] = useState<'preview' | 'broadcast' | 'code'>('preview');
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [publishFeedback, setPublishFeedback] = useState<{
    success: boolean;
    message: string;
    url?: string;
  } | null>(null);

  // Fallback post structure if not yet generated
  const post: GeneratedPost = vacancy.generatedPost || {
    title: `${vacancy.shortName} Notification 2026: ${vacancy.vacanciesCount} Vacancies Released, Eligibility & Syllabus`,
    slug: `${vacancy.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-notification-apply-online`,
    excerpt: `${vacancy.title}. Apply online for ${vacancy.vacanciesCount} vacancies. Last date: ${formatDateDDMMYYYY(vacancy.lastDate)}. Check full eligibility and syllabus on ESC Kolkata.`,
    htmlContent: `
      <div class="esc-notice-wrapper">
        <div style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 14px; margin-bottom: 20px; border-radius: 4px;">
          <h3 style="margin: 0; color: #1e3a8a;">📢 Official Notification Announcement - ESC Kolkata</h3>
          <p style="margin: 5px 0 0; font-size: 14px; color: #1e40af;">Published by Education Support Council (esckolkata2003.org) for competitive exam aspirants.</p>
        </div>

        <h2>${vacancy.title}</h2>
        <p>${vacancy.summary}</p>

        <h3>📋 Quick Exam Highlights</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Recruitment Board</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.examBoard}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Total Vacancies</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.vacanciesCount}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Pay Scale / Salary</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.salaryScale}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Minimum Qualification</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.qualification}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Age Criteria</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.ageLimit}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Application Window</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formatDateDDMMYYYY(vacancy.startDate)} to <strong>${formatDateDDMMYYYY(vacancy.lastDate)}</strong></td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; background: #f8fafc;"><strong>Application Fee</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${vacancy.applicationFee}</td></tr>
        </table>

        <h3>🎯 Selection Process Stages</h3>
        <ul>
          ${vacancy.selectionProcess.map((s) => `<li><strong>${s}</strong></li>`).join('')}
        </ul>

        <h3>📚 Syllabus & Exam Pattern Breakdown</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
          <thead>
            <tr style="background: #0f172a; color: white;">
              <th style="padding: 8px; text-align: left;">Subject</th>
              <th style="padding: 8px; text-align: center;">Questions</th>
              <th style="padding: 8px; text-align: center;">Marks</th>
              <th style="padding: 8px; text-align: left;">Key Topics</th>
            </tr>
          </thead>
          <tbody>
            ${vacancy.syllabusOverview
              .map(
                (sub) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;"><strong>${sub.subject}</strong></td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${sub.questions}</td>
                <td style="padding: 8px; border: 1px solid #ddd; text-align: center;">${sub.marks}</td>
                <td style="padding: 8px; border: 1px solid #ddd; font-size: 13px;">${sub.keyTopics}</td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; padding: 18px; border-radius: 8px; margin: 25px 0;">
          <h3 style="margin-top: 0; color: #166534;">🎓 ESC Kolkata Mentor's Preparation Strategy</h3>
          <p style="color: #15803d; font-size: 14px;"><em>"${vacancy.esckolkataGuidance.strategyTips.join(' ')}"</em></p>
          <p style="margin: 8px 0 0; font-size: 13px; color: #14532d;">
            <strong>Recommended Batch:</strong> ${vacancy.esckolkataGuidance.recommendedBatch}<br/>
            <strong>Cutoff Insight:</strong> ${vacancy.esckolkataGuidance.cutoffTrend}
          </p>
          <div style="margin-top: 12px;">
            <a href="https://esckolkata2003.org" style="display: inline-block; background: #16a34a; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 13px;">Join ESC Kolkata Exam Guidance</a>
          </div>
        </div>

        <h3>🔗 Official Application & Notification Links</h3>
        <p>
          👉 <a href="${vacancy.officialWebsite}" target="_blank" rel="noopener noreferrer"><strong>Official Website (${vacancy.officialWebsite})</strong></a><br/>
          ${
            vacancy.notificationPdfUrl
              ? `📄 <a href="${vacancy.notificationPdfUrl}" target="_blank" rel="noopener noreferrer"><strong>Download Official Notification PDF</strong></a>`
              : ''
          }
        </p>
      </div>
    `,
    markdownContent: `# ${vacancy.title}\n\n${vacancy.summary}\n\n* Total Vacancies: ${vacancy.vacanciesCount}\n* Last Date: ${formatDateDDMMYYYY(vacancy.lastDate)}\n* Qualification: ${vacancy.qualification}`,
    categories: ['Govt Jobs', vacancy.examBoard, 'Exam Notifications'],
    tags: [vacancy.shortName, 'Govt Jobs 2026', 'Admit Card', 'Syllabus', 'ESC Kolkata'],
    seoKeywords: [vacancy.shortName, 'Eligibility', 'Vacancies', 'Last Date', 'Syllabus'],
    whatsAppAlert: `🚨 *NEW GOVT JOB NOTIFICATION RELEASED!* 🚨\n\n📌 *Exam:* ${vacancy.title}\n🏛️ *Board:* ${vacancy.examBoard}\n🎯 *Total Vacancies:* ${vacancy.vacanciesCount}\n💰 *Salary:* ${vacancy.salaryScale}\n🎓 *Eligibility:* ${vacancy.qualification}\n⏳ *Last Date to Apply:* ${formatDateDDMMYYYY(vacancy.lastDate)}\n\n📖 *Complete Syllabus, Eligibility & Apply Link:* https://esckolkata2003.org/${vacancy.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\n\n_Shared by Education Support Council (ESC Kolkata) - Guiding Aspirants Since 2003_`,
    telegramAlert: `📢 **NEW GOVT EXAM VACANCY ALERT** 📢\n\n**${vacancy.title}**\n\n🔹 **Vacancies:** ${vacancy.vacanciesCount}\n🔹 **Board:** ${vacancy.examBoard}\n🔹 **Pay Scale:** ${vacancy.salaryScale}\n🔹 **Eligibility:** ${vacancy.qualification}\n🔹 **Last Date:** ${formatDateDDMMYYYY(vacancy.lastDate)}\n\n🔗 **Read Full Details & Syllabus Breakdown:**\nhttps://esckolkata2003.org/${vacancy.shortName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}\n\n*ESC Kolkata Study Portal (Est. 2003)*`,
  };

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2500);
  };

  const handlePublishClick = async () => {
    setIsPublishing(true);
    setPublishFeedback(null);
    try {
      const res = await onPublish(vacancy, post);
      if (res.success) {
        setPublishFeedback({
          success: true,
          message: res.result?.message || 'Published successfully!',
          url: res.result?.publishedUrl || `https://esckolkata2003.org/${post.slug}`,
        });
      } else {
        setPublishFeedback({
          success: false,
          message: res.result?.message || 'Failed to publish to website.',
        });
      }
    } catch (err: any) {
      setPublishFeedback({
        success: false,
        message: err.message || 'Error occurred while communicating with WordPress API.',
      });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleRegenerateClick = async () => {
    setIsRegenerating(true);
    try {
      await onRegeneratePost(vacancy.id);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Bar */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-0.5 rounded font-bold bg-blue-100 text-blue-800">
                {vacancy.examBoard}
              </span>
              <span className="text-xs text-slate-500 font-mono">
                Target: {settings?.siteUrl || 'https://esckolkata2003.org'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1 truncate max-w-xl">
              Post Review & Publishing Studio: {vacancy.shortName}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRegenerateClick}
              disabled={isRegenerating}
              className="px-2.5 py-1.5 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
              title="Regenerate with Gemini 3.8 Flash"
            >
              <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isRegenerating ? 'animate-spin' : ''}`} />
              <span>{isRegenerating ? 'Regenerating...' : 'AI Rewrite'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 bg-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'preview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              Website Post Preview
            </button>

            <button
              onClick={() => setActiveView('broadcast')}
              className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'broadcast'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Share2 className="w-3.5 h-3.5 text-emerald-600" />
              Student Broadcasts (WhatsApp/Telegram)
            </button>

            <button
              onClick={() => setActiveView('code')}
              className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeView === 'code'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Code className="w-3.5 h-3.5 text-purple-600" />
              HTML / Gutenberg Code
            </button>
          </div>

          <div className="text-[11px] text-slate-500 hidden sm:block">
            Status: <span className="font-semibold text-slate-800">{settings?.postStatus || 'draft'}</span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50">
          {/* Status Feedback Banner if published */}
          {publishFeedback && (
            <div
              className={`p-3.5 rounded-xl mb-4 border text-xs flex items-start justify-between gap-3 ${
                publishFeedback.success
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}
            >
              <div className="flex items-start gap-2">
                {publishFeedback.success ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <div className="font-bold">{publishFeedback.message}</div>
                  {publishFeedback.url && (
                    <div className="mt-1">
                      <a
                        href={publishFeedback.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-700 underline flex items-center gap-1 font-semibold"
                      >
                        {publishFeedback.url} <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
              <button
                onClick={() => setPublishFeedback(null)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {activeView === 'preview' && (
            <div className="space-y-4">
              {/* Title & SEO Meta Box */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  WordPress Post Title & SEO Slug
                </span>
                <h1 className="text-xl font-extrabold text-slate-900">{post.title}</h1>
                <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 font-mono">
                  <span>Slug:</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-blue-600">/{post.slug}</span>
                </div>
                <p className="text-xs text-slate-600 mt-2 italic bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <strong className="text-slate-700 not-italic">Excerpt: </strong>
                  {post.excerpt}
                </p>

                {/* Categories & Tags */}
                <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="font-semibold text-slate-600">Categories:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {post.categories.map((cat, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 font-medium">
                        {cat}
                      </span>
                    ))}
                  </div>

                  <span className="font-semibold text-slate-600 ml-2">Tags:</span>
                  <div className="flex items-center gap-1 flex-wrap">
                    {post.tags.map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rendered HTML Post Preview */}
              <div className="p-6 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Article Body Preview (Rendered WordPress Content)
                  </span>
                  <button
                    onClick={() => copyToClipboard(post.htmlContent, 'html_body')}
                    className="text-xs text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'html_body' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'html_body' ? 'Copied HTML!' : 'Copy HTML'}</span>
                  </button>
                </div>

                <div
                  className="wp-rendered-content text-slate-800 text-sm"
                  dangerouslySetInnerHTML={{ __html: post.htmlContent }}
                />
              </div>
            </div>
          )}

          {activeView === 'broadcast' && (
            <div className="space-y-4">
              {/* WhatsApp Broadcast */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                      WA
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">WhatsApp Student Alert Broadcast</h3>
                      <p className="text-xs text-slate-500">Formatted for WhatsApp groups, channels & broadcast lists</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(post.whatsAppAlert, 'wa')}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedType === 'wa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'wa' ? 'Copied WhatsApp Msg!' : 'Copy for WhatsApp'}</span>
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-900 text-emerald-300 rounded-lg text-xs whitespace-pre-wrap font-mono leading-relaxed mt-2 border border-slate-800">
                  {post.whatsAppAlert}
                </pre>
              </div>

              {/* Telegram Broadcast */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-xs">
                      TG
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">Telegram Channel Broadcast</h3>
                      <p className="text-xs text-slate-500">Formatted with markdown for Telegram channel subscribers</p>
                    </div>
                  </div>

                  <button
                    onClick={() => copyToClipboard(post.telegramAlert, 'tg')}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold flex items-center gap-1 transition cursor-pointer"
                  >
                    {copiedType === 'tg' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedType === 'tg' ? 'Copied Telegram Msg!' : 'Copy for Telegram'}</span>
                  </button>
                </div>

                <pre className="p-3.5 bg-slate-900 text-sky-200 rounded-lg text-xs whitespace-pre-wrap font-mono leading-relaxed mt-2 border border-slate-800">
                  {post.telegramAlert}
                </pre>
              </div>
            </div>
          )}

          {activeView === 'code' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Full HTML / Gutenberg Block Ready Code:</span>
                  <button
                    onClick={() => copyToClipboard(post.htmlContent, 'full_html')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'full_html' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'full_html' ? 'Copied!' : 'Copy All HTML'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={post.htmlContent}
                  rows={14}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-200 rounded-lg border border-slate-800 focus:outline-none select-all"
                />
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-700">Markdown Format:</span>
                  <button
                    onClick={() => copyToClipboard(post.markdownContent, 'full_md')}
                    className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    {copiedType === 'full_md' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedType === 'full_md' ? 'Copied!' : 'Copy Markdown'}</span>
                  </button>
                </div>
                <textarea
                  readOnly
                  value={post.markdownContent}
                  rows={8}
                  className="w-full p-3 font-mono text-xs bg-slate-900 text-slate-200 rounded-lg border border-slate-800 focus:outline-none select-all"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Bottom Publishing Bar */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Publishing as: <strong className="text-slate-800">{settings?.postStatus || 'draft'}</strong> to{' '}
            <strong className="text-blue-600">{settings?.siteUrl || 'https://esckolkata2003.org'}</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handlePublishClick}
              disabled={isPublishing}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              <Send className={`w-3.5 h-3.5 ${isPublishing ? 'animate-bounce' : ''}`} />
              <span>
                {isPublishing
                  ? 'Pushing to esckolkata2003.org...'
                  : `Publish to esckolkata2003.org (${settings?.postStatus || 'draft'})`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
