/**
 * Date formatting and parsing utility for the server to ensure all dates
 * adhere strictly to DD-MM-YYYY format (e.g. 24-07-2026).
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
  const d = dateInput instanceof Date ? dateInput : new Date(dateInput);
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

export function getTodayDDMMYYYY(): string {
  return formatDateDDMMYYYY(new Date());
}

export function getOffsetDateDDMMYYYY(daysOffset: number): string {
  const d = new Date(Date.now() + daysOffset * 86400000);
  return formatDateDDMMYYYY(d);
}
