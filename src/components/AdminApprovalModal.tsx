import React, { useState, useEffect } from 'react';
import {
  X,
  Mail,
  Send,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Radio,
  Sparkles,
  Smartphone,
  ShieldCheck,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { GovVacancy, AutomationSettings } from '../types/index.js';

interface AdminApprovalModalProps {
  vacancy: GovVacancy;
  settings: AutomationSettings | null;
  onClose: () => void;
  onApproveSuccess: (vacancy: GovVacancy) => void;
}

export const AdminApprovalModal: React.FC<AdminApprovalModalProps> = ({
  vacancy,
  settings,
  onClose,
  onApproveSuccess,
}) => {
  const [activeChannel, setActiveChannel] = useState<'email' | 'whatsapp'>('email');
  const [previewData, setPreviewData] = useState<{
    emailSubject?: string;
    emailHtml?: string;
    emailText?: string;
    whatsAppMessage?: string;
    approvalUrl?: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isApproving, setIsApproving] = useState(false);
  const [isSendingAlert, setIsSendingAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/notification-preview/${vacancy.id}`)
      .then((res) => res.json())
      .then((data) => setPreviewData(data))
      .catch((err) => console.error('Failed to load notification preview:', err))
      .finally(() => setIsLoading(false));
  }, [vacancy.id]);

  const handle1ClickApprove = async () => {
    setIsApproving(true);
    setFeedback(null);
    try {
      const res = await fetch('/api/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancyId: vacancy.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback('Successfully approved! Post has been dispatched to esckolkata2003.org.');
        onApproveSuccess(data.vacancy);
      } else {
        setFeedback('Failed to approve post.');
      }
    } catch (err: any) {
      setFeedback(`Error: ${err.message}`);
    } finally {
      setIsApproving(false);
    }
  };

  const handleSendTestAlert = async () => {
    setIsSendingAlert(true);
    try {
      const res = await fetch('/api/notify-admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vacancyId: vacancy.id }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFeedback(
          `Notification alert queued for ${settings?.adminApproval?.adminEmail || 'admin'} and WhatsApp!`
        );
      }
    } catch (err: any) {
      setFeedback(`Failed to send alert: ${err.message}`);
    } finally {
      setIsSendingAlert(false);
    }
  };

  const copyApprovalLink = () => {
    if (previewData?.approvalUrl) {
      navigator.clipboard.writeText(previewData.approvalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const adminEmail = settings?.adminApproval?.adminEmail || 'shadabsarwar@gmail.com';
  const adminWhatsApp = settings?.adminApproval?.adminWhatsApp || '+919948900368';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Admin Notification &amp; 1-Click Approval Gate</h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800 border border-amber-300">
                  {vacancy.approvalStatus === 'approved' ? 'Approved' : 'Pending Sign-Off'}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Recipient: <strong className="text-slate-800">{adminEmail}</strong> • WhatsApp: <strong className="text-slate-800">{adminWhatsApp}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Channel Switcher */}
        <div className="px-5 pt-3 bg-white border-b border-slate-200 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveChannel('email')}
              className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeChannel === 'email'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email Notification Preview ({adminEmail})
            </button>

            <button
              onClick={() => setActiveChannel('whatsapp')}
              className={`px-3 py-1.5 text-xs font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                activeChannel === 'whatsapp'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-600" />
              WhatsApp Alert Preview ({adminWhatsApp})
            </button>
          </div>

          <button
            onClick={handleSendTestAlert}
            disabled={isSendingAlert}
            className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer"
          >
            {isSendingAlert ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3 text-blue-600" />}
            <span>Dispatch Live Alert</span>
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 overflow-y-auto flex-1 bg-slate-50/50 space-y-4">
          {feedback && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center justify-between">
              <span className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {feedback}
              </span>
              <button onClick={() => setFeedback(null)} className="text-emerald-700 font-bold">
                ✕
              </button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-6 h-6 text-blue-600 animate-spin mx-auto mb-2" />
              <p className="text-xs text-slate-500">Generating interactive approval previews...</p>
            </div>
          ) : (
            <>
              {activeChannel === 'email' && (
                <div className="space-y-3">
                  <div className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs text-xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Email Subject Line:
                    </span>
                    <div className="font-bold text-slate-900 text-sm mt-0.5">
                      {previewData?.emailSubject}
                    </div>
                  </div>

                  {/* Rendered HTML Email Preview */}
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs overflow-hidden">
                    <div className="flex items-center justify-between pb-2 mb-3 border-b border-slate-100 text-xs text-slate-500">
                      <span>HTML Email Render (How Admin sees it in Gmail / Mail client):</span>
                      <button
                        onClick={copyApprovalLink}
                        className="text-blue-600 font-semibold flex items-center gap-1 hover:underline cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied 1-Click Link!' : 'Copy 1-Click Approval Link'}</span>
                      </button>
                    </div>

                    <div
                      className="border border-slate-100 rounded-lg p-3 bg-slate-50 max-h-96 overflow-y-auto"
                      dangerouslySetInnerHTML={{ __html: previewData?.emailHtml || '' }}
                    />

                    {/* Direct Email Actions */}
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Direct email actions for <strong>{adminEmail}</strong>:</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
                            adminEmail
                          )}&su=${encodeURIComponent(
                            previewData?.emailSubject || ''
                          )}&body=${encodeURIComponent(previewData?.emailText || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold flex items-center gap-1.5 shadow-2xs transition"
                          title="Open ready message directly in Gmail webmail"
                        >
                          <Mail className="w-3.5 h-3.5" />
                          <span>Open in Gmail (Webmail)</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>

                        <a
                          href={`mailto:${encodeURIComponent(adminEmail)}?subject=${encodeURIComponent(
                            previewData?.emailSubject || ''
                          )}&body=${encodeURIComponent(previewData?.emailText || '')}`}
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1 transition"
                        >
                          <span>Mail Client</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeChannel === 'whatsapp' && (
                <div className="space-y-3">
                  <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                          WA
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900">Admin Instant Approval Message</h4>
                          <span className="text-[10px] text-slate-500">Direct tap-to-approve on mobile WhatsApp</span>
                        </div>
                      </div>

                      <button
                        onClick={copyApprovalLink}
                        className="px-2.5 py-1 rounded bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        <span>{copied ? 'Copied Link!' : 'Copy Approval Link'}</span>
                      </button>
                    </div>

                    <pre className="p-4 bg-slate-900 text-emerald-300 rounded-xl text-xs whitespace-pre-wrap font-mono leading-relaxed border border-slate-800">
                      {previewData?.whatsAppMessage}
                    </pre>

                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
                      <span>Direct link to WhatsApp ({adminWhatsApp}):</span>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://wa.me/${adminWhatsApp.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(previewData?.whatsAppMessage || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition"
                        >
                          <Send className="w-3 h-3" />
                          <span>Send to Admin WhatsApp</span>
                        </a>
                        <a
                          href={`https://web.whatsapp.com/send?phone=${adminWhatsApp.replace(/[^0-9]/g, '')}&text=${encodeURIComponent(previewData?.whatsAppMessage || '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold flex items-center gap-1 transition"
                        >
                          <span>WhatsApp Web</span>
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-slate-200 bg-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-500">
            Publish destination: <strong className="text-blue-600">esckolkata2003.org</strong>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>

            <button
              onClick={handle1ClickApprove}
              disabled={isApproving || vacancy.approvalStatus === 'approved'}
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/30 flex items-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
            >
              {isApproving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              <span>
                {vacancy.approvalStatus === 'approved'
                  ? 'Already Approved & Live'
                  : 'Approve & Publish to esckolkata2003.org'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
