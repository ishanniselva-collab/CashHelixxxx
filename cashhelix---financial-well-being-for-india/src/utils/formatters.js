/**
 * Indian Rupee and date formatting utilities
 */

export function formatINR(amount, options = {}) {
  const { showSign = false, prefix = '₹', compact = false } = options;
  if (amount === undefined || amount === null || isNaN(amount)) return `${prefix}0`;

  const absAmount = Math.abs(amount);
  let formatted = '';

  if (compact && absAmount >= 10000000) {
    formatted = `${(absAmount / 10000000).toFixed(2).replace(/\.00$/, '')} Cr`;
  } else if (compact && absAmount >= 100000) {
    formatted = `${(absAmount / 100000).toFixed(2).replace(/\.00$/, '')} L`;
  } else if (compact && absAmount >= 1000) {
    formatted = `${(absAmount / 1000).toFixed(1).replace(/\.0$/, '')} k`;
  } else {
    formatted = new Intl.NumberFormat('en-IN', {
      maximumFractionDigits: 0,
    }).format(absAmount);
  }

  const sign = amount < 0 ? '-' : showSign && amount > 0 ? '+' : '';
  return `${sign}${prefix}${formatted}`;
}

export function formatDate(dateStr, locale = 'en-IN') {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString(locale, {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatShortDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short'
  });
}

export function getDaysRemaining(dateStr) {
  if (!dateStr) return 0;
  const target = new Date(dateStr);
  const now = new Date('2026-10-22');
  const diffTime = target - now;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}
