/**
 * proQ Kenya - Real-Time Tender Date & Status Engine
 * Handles accurate closing date calculations, countdowns, and live status resolution.
 */

export type LiveTenderStatus = 'active' | 'closing-soon' | 'closed';

/**
 * Calculates days remaining from today until the tender closing date.
 * If the tender closes today or is in the past, returns 0 or negative days.
 */
export function calculateDaysRemaining(closingDateStr: string, closingTimeStr?: string): number {
  if (!closingDateStr) return 0;
  
  const now = new Date();
  const closing = new Date(closingDateStr);

  // Set closing time if provided, or default to 10:00 AM East Africa Time (standard in Kenya)
  if (closingTimeStr && closingTimeStr.includes(':')) {
    const timeMatch = closingTimeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
    if (timeMatch) {
      let hours = parseInt(timeMatch[1], 10);
      const minutes = parseInt(timeMatch[2], 10);
      const ampm = timeMatch[3]?.toUpperCase();
      if (ampm === 'PM' && hours < 12) hours += 12;
      if (ampm === 'AM' && hours === 12) hours = 0;
      closing.setHours(hours, minutes, 0, 0);
    }
  } else {
    closing.setHours(10, 0, 0, 0);
  }

  const diffMs = closing.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Resolves the live status of a tender based on real-time date calculation:
 * - 'closed': 0 or negative days remaining
 * - 'closing-soon': 1 to 3 days remaining
 * - 'active': 4 or more days remaining
 */
export function getDynamicTenderStatus(closingDateStr: string, closingTimeStr?: string): LiveTenderStatus {
  const days = calculateDaysRemaining(closingDateStr, closingTimeStr);
  if (days <= 0) return 'closed';
  if (days <= 3) return 'closing-soon';
  return 'active';
}

/**
 * Returns a human-friendly closing countdown string
 */
export function formatClosingCountdown(closingDateStr: string, closingTimeStr?: string): string {
  const days = calculateDaysRemaining(closingDateStr, closingTimeStr);
  if (days < 0) {
    return `Closed ${Math.abs(days)} day${Math.abs(days) === 1 ? '' : 's'} ago`;
  }
  if (days === 0) {
    return 'Closes today at 10:00 AM EAT';
  }
  if (days === 1) {
    return 'Closes tomorrow (urgent)';
  }
  if (days <= 3) {
    return `Closing in ${days} days (urgent)`;
  }
  return `${days} days remaining`;
}

/**
 * Formats standard date display (e.g. "18 Sep 2026")
 */
export function formatKenyanDate(dateStr: string): string {
  if (!dateStr) return 'N/A';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return dateStr;
  }
}

/**
 * Enriches any tender object with dynamic live status and real-time days remaining
 */
export function enrichTenderWithLiveStatus<T extends { closingDate: string; closingTime?: string; status?: any; daysRemaining?: number }>(
  tender: T
): T & { status: LiveTenderStatus; daysRemaining: number; liveCountdown: string } {
  const days = calculateDaysRemaining(tender.closingDate, tender.closingTime);
  const status = getDynamicTenderStatus(tender.closingDate, tender.closingTime);
  const liveCountdown = formatClosingCountdown(tender.closingDate, tender.closingTime);

  return {
    ...tender,
    status,
    daysRemaining: Math.max(0, days),
    liveCountdown,
  };
}
