// Formatting and date helpers.

const pkr = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });

export function formatPKR(amount) {
  return `PKR ${pkr.format(amount)}`;
}

export function formatDuration(days) {
  if (days === 1) return '1 day';
  return `${days} days · ${days - 1} ${days - 1 === 1 ? 'night' : 'nights'}`;
}

function startOfToday() {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Real calendar date of a departure (anchored to the real today). */
export function getDepartureDate(daysFromToday) {
  const date = startOfToday();
  date.setDate(date.getDate() + daysFromToday);
  return date;
}

const dateFormat = new Intl.DateTimeFormat('en-GB', { weekday: 'short', day: 'numeric', month: 'short' });

export function formatDate(date) {
  return dateFormat.format(date);
}

export function formatDaysUntil(daysUntil) {
  if (daysUntil < 0) return 'departed';
  if (daysUntil === 0) return 'today';
  if (daysUntil === 1) return 'tomorrow';
  return `in ${daysUntil} days`;
}
