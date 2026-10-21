/**
 * Date formatting and parsing utility to ensure all dates throughout
 * the application adhere strictly to DD-MM-YYYY format (e.g. 24-07-2026).
 */

export function formatDateDDMMYYYY(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';

  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    // If already in DD-MM-YYYY format (e.g. 24-07-2026 or 24/07/2026)
    if (/^\d{2}[-/]\d{2}[-/]\d{4}$/.test(trimmed)) {
      return trimmed.replace(/\//g, '-');
    }
    // If in YYYY-MM-DD format (e.g. 2026-07-24)
    const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
    if (ymdMatch) {
      const year = ymdMatch[1];
      const month = ymdMatch[2].padStart(2, '0');
      const day = ymdMatch[3].padStart(2, '0');
      return `${day}-${month}-${year}`;
    }
    // If in ISO timestamp format
    const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})T/);
    if (isoMatch) {
      const year = isoMatch[1];
      const month = isoMatch[2];
      const day = isoMatch[3];
      return `${day}-${month}-${year}`;
    }
  }

  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
}

export function formatDateTimeDDMMYYYY(dateInput: string | Date | undefined | null): string {
  if (!dateInput) return '';
  let d = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(d.getTime()) && typeof dateInput === 'string') {
    const parsed = parseDateFlexible(dateInput);
    if (parsed) d = parsed;
  }
  if (isNaN(d.getTime())) {
    return String(dateInput);
  }
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
}

export function parseDateFlexible(dateStr: string | undefined | null): Date | null {
  if (!dateStr) return null;
  const trimmed = dateStr.trim();

  // Check DD-MM-YYYY or DD/MM/YYYY
  const dmyMatch = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})/);
  if (dmyMatch) {
    const day = parseInt(dmyMatch[1], 10);
    const month = parseInt(dmyMatch[2], 10) - 1;
    const year = parseInt(dmyMatch[3], 10);
    return new Date(year, month, day);
  }

  // Check YYYY-MM-DD
  const ymdMatch = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})/);
  if (ymdMatch) {
    const year = parseInt(ymdMatch[1], 10);
    const month = parseInt(ymdMatch[2], 10) - 1;
    const day = parseInt(ymdMatch[3], 10);
    return new Date(year, month, day);
  }

  const d = new Date(trimmed);
  return isNaN(d.getTime()) ? null : d;
}

export function getDaysLeft(lastDateStr: string | undefined | null): number | null {
  if (!lastDateStr) return null;
  const targetDate = parseDateFlexible(lastDateStr);
  if (!targetDate) return null;
  const now = new Date();
  const diff = Math.ceil((targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}
