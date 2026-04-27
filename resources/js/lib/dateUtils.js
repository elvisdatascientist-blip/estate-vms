/**
 * Date and time formatting utilities
 */

/**
 * Format date in user-friendly format
 * @param {string|Date} date - Date to format
 * @returns {string} Formatted date (e.g., "Mon, Apr 27, 2026")
 */
export function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Format time in 12-hour format with AM/PM
 * @param {string} time - Time string (H:i format)
 * @returns {string} Formatted time (e.g., "2:30 PM")
 */
export function formatTime(time) {
  if (!time) return '';
  const [hours, minutes] = time.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${hour12}:${minutes.toString().padStart(2, '0')} ${period}`;
}

/**
 * Format date and time together
 * @param {string|Date} date - Date to format
 * @param {string} time - Time string (H:i format)
 * @returns {string} Formatted datetime (e.g., "Mon, Apr 27, 2026 at 2:30 PM")
 */
export function formatDateTime(date, time) {
  return `${formatDate(date)} at ${formatTime(time)}`;
}

/**
 * Format date for display on cards/dashboards
 * @param {string|Date} date - Date to format
 * @returns {string} Short formatted date (e.g., "Apr 27, 2026")
 */
export function formatShortDate(date) {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * Get relative time (e.g., "2 hours ago", "just now")
 * @param {string|Date} date - Date to compare
 * @returns {string} Relative time string
 */
export function getRelativeTime(date) {
  if (!date) return '';
  const d = new Date(date);
  const now = new Date();
  const diffMs = now - d;
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} min${diffMins > 1 ? 's' : ''} ago`;

  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatShortDate(date);
}
