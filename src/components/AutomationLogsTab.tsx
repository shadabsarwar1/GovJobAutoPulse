import React from 'react';
import {
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { ScanLog, PublishLog } from '../types/index.js';

interface AutomationLogsTabProps {
  logs: {
    scanLogs: ScanLog[];
    publishLogs: PublishLog[];
  };
  onRefresh: () => void;
}

export const AutomationLogsTab: React.FC<AutomationLogsTabProps> = ({
  logs,
  onRefresh,
}) => {
  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Header */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-blue-600" />
            Surveillance & Publishing Audit Logs
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Full audit trail of AI web scans and posts dispatched to esckolkata2003.org
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Logs</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Publish to Website Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Send className="w-4 h-4 text-emerald-600" />
                <span>esckolkata2003.org Publishing Logs ({logs.publishLogs.length})</span>
              </h3>
            </div>

            {logs.publishLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No articles published yet. Click "Publish to Site" on any vacancy card to dispatch.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {logs.publishLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 truncate max-w-xs">
                        {log.vacancyTitle}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'success' || log.status === 'simulated_success'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status === 'simulated_success' ? 'Simulated Sync' : log.status}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 leading-snug">
                      {log.responseMessage}
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px] text-slate-400">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      {log.postUrl && (
                        <a
                          href={log.postUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-semibold underline flex items-center gap-0.5"
                        >
                          View Link <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Web Radar Scan Logs */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <span>AI Surveillance Scan Logs ({logs.scanLogs.length})</span>
              </h3>
            </div>

            {logs.scanLogs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No scan logs recorded yet.
              </div>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {logs.scanLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-200 bg-slate-50 text-xs space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 uppercase tracking-wider text-[10px]">
                        Trigger: {log.trigger}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                          log.status === 'success'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {log.status}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 leading-snug">
                      {log.message}
                    </p>

                    {log.newVacancies && log.newVacancies.length > 0 && (
                      <div className="text-[11px] text-emerald-700 font-medium">
                        + Stored: {log.newVacancies.join(', ')}
                      </div>
                    )}

                    <div className="pt-1 border-t border-slate-200 text-[10px] text-slate-400 flex items-center justify-between">
                      <span>{new Date(log.timestamp).toLocaleString()}</span>
                      <span>Found: {log.foundCount} notices</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
