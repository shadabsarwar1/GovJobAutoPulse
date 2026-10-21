import React from 'react';
import {
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
  Send,
  Building,
  TrendingUp,
  Zap,
  Globe,
  Landmark,
} from 'lucide-react';
import { GovVacancy, SystemStatus } from '../types/index.js';

interface MetricsOverviewProps {
  vacancies: GovVacancy[];
  status: SystemStatus | null;
  onFilterChange?: (filter: string) => void;
  activeFilter?: string;
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  vacancies,
  status,
  onFilterChange,
  activeFilter,
}) => {
  const totalVacanciesNum = vacancies.reduce((acc, v) => {
    const num = typeof v.vacanciesCount === 'number' ? v.vacanciesCount : parseInt(String(v.vacanciesCount).replace(/[^0-9]/g, '')) || 0;
    return acc + num;
  }, 0);

  const publishedCount = vacancies.filter((v) => v.syncStatus === 'published_to_site').length;
  const centralCount = vacancies.filter((v) => v.jurisdiction === 'Central').length;
  const wbCount = vacancies.filter((v) => v.jurisdiction === 'West Bengal').length;
  const closingSoonCount = vacancies.filter((v) => v.status === 'closing_soon').length;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 mb-6">
      {/* Metric 1: Total Exams */}
      <div
        onClick={() => onFilterChange && onFilterChange('all')}
        className={`p-4 rounded-xl border bg-white shadow-xs transition cursor-pointer hover:shadow-md ${
          activeFilter === 'all' ? 'ring-2 ring-blue-500 border-blue-400' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Total Tracked Exams
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileText className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{vacancies.length}</span>
          <span className="text-xs font-bold text-emerald-600 flex items-center">
            <TrendingUp className="w-3 h-3 mr-0.5" />
            {totalVacanciesNum.toLocaleString()}+ Posts
          </span>
        </div>
        <p className="text-xs text-slate-500 mt-1">Central & West Bengal</p>
      </div>

      {/* Metric 2: West Bengal & Kolkata */}
      <div
        onClick={() => onFilterChange && onFilterChange('west_bengal')}
        className={`p-4 rounded-xl border bg-white shadow-xs transition cursor-pointer hover:shadow-md ${
          activeFilter === 'west_bengal' ? 'ring-2 ring-emerald-500 border-emerald-400' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            West Bengal & Kolkata
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Landmark className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-emerald-700">{wbCount}</span>
          <span className="text-xs font-medium text-slate-500">Exams Monitored</span>
        </div>
        <p className="text-xs text-emerald-600 font-semibold mt-1">
          WBPSC, Police/KP, WBSSC, KMC, WBHRB
        </p>
      </div>

      {/* Metric 3: Central Govt */}
      <div
        onClick={() => onFilterChange && onFilterChange('central')}
        className={`p-4 rounded-xl border bg-white shadow-xs transition cursor-pointer hover:shadow-md ${
          activeFilter === 'central' ? 'ring-2 ring-indigo-500 border-indigo-400' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Central Govt & All-India
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Globe className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-indigo-700">{centralCount}</span>
          <span className="text-xs font-medium text-slate-500">All-India Exams</span>
        </div>
        <p className="text-xs text-indigo-600 font-semibold mt-1">
          SSC, Bank PO, Tax, Railways, UPSC, Defence
        </p>
      </div>

      {/* Metric 4: Website Sync Status */}
      <div
        onClick={() => onFilterChange && onFilterChange('published')}
        className={`p-4 rounded-xl border bg-white shadow-xs transition cursor-pointer hover:shadow-md ${
          activeFilter === 'published' ? 'ring-2 ring-amber-500 border-amber-400' : 'border-slate-200'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Live on esckolkata2003.org
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
            <CheckCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-extrabold text-slate-900">{publishedCount}</span>
          <span className="text-xs font-medium text-slate-500">/ {vacancies.length} Synced</span>
        </div>
        <p className="text-xs text-slate-500 mt-1">
          {closingSoonCount > 0 ? (
            <span className="text-rose-600 font-bold">{closingSoonCount} Closing Soon!</span>
          ) : (
            <span className="text-emerald-600 font-medium">Pipeline Synchronized</span>
          )}
        </p>
      </div>
    </div>
  );
};
