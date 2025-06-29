/**
 * Agnostic utility functions for time calculations and duration formatting
 */

/**
 * Calculate the duration in minutes between two timestamps
 * @param startTime ISO 8601 timestamp string or Date object
 * @param endTime ISO 8601 timestamp string or Date object
 * @returns Duration in minutes as a whole number
 */
export function calculateMinutes(
  startTime: string | Date,
  endTime: string | Date
): number {
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date provided");
  }

  const diffMs = end.getTime() - start.getTime();
  const minutes = diffMs / (1000 * 60);

  return Math.round(minutes);
}

/**
 * Calculate the duration in hours between two timestamps
 * @param startTime ISO 8601 timestamp string or Date object
 * @param endTime ISO 8601 timestamp string or Date object
 * @returns Duration in hours as a decimal number
 */
export function calculateHours(
  startTime: string | Date,
  endTime: string | Date
): number {
  const start = startTime instanceof Date ? startTime : new Date(startTime);
  const end = endTime instanceof Date ? endTime : new Date(endTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new Error("Invalid date provided");
  }

  const diffMs = end.getTime() - start.getTime();
  const hours = diffMs / (1000 * 60 * 60);

  return Math.round(hours * 100) / 100;
}

/**
 * Calculate duration and return formatted time info
 * @param startTime ISO 8601 timestamp string or Date object
 * @param endTime ISO 8601 timestamp string or Date object
 * @returns Object with duration in hours and formatted duration string
 */
export function getDuration(startTime: string | Date, endTime: string | Date) {
  const hours = calculateHours(startTime, endTime);
  const wholeHours = Math.floor(hours);
  const minutes = Math.round((hours - wholeHours) * 60);

  let formatted = "";
  if (wholeHours > 0) {
    formatted += `${wholeHours}h`;
  }
  if (minutes > 0) {
    if (wholeHours > 0) formatted += " ";
    formatted += `${minutes}m`;
  }

  return {
    hours,
    formatted,
    wholeHours,
    minutes,
  };
}

/**
 * Format a timestamp to a specific timezone
 * @param timestamp ISO 8601 timestamp string or Date object
 * @param timezone IANA timezone string (e.g., "UTC", "America/New_York")
 * @param options Intl.DateTimeFormatOptions for formatting
 * @returns Formatted date string in the specified timezone
 */
export function formatInTimezone(
  timestamp: string | Date,
  timezone: string = "UTC",
  options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  }
): string {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  if (isNaN(date.getTime())) {
    throw new Error("Invalid date provided");
  }

  return date.toLocaleString("en-US", {
    ...options,
    timeZone: timezone,
  });
}

/**
 * Get the current time in a specific timezone
 * @param timezone IANA timezone string (e.g., "UTC", "America/New_York")
 * @returns Current Date object
 */
export function getCurrentTimeInTimezone(timezone: string = "UTC"): Date {
  const now = new Date();

  // Use toLocaleString to get the time in the target timezone, then parse it back
  const timeString = now.toLocaleString("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  return new Date(timeString.replace(", ", "T"));
}

/**
 * Validate if a timestamp is valid
 * @param timestamp The timestamp string or Date object to validate
 * @returns true if valid, false otherwise
 */
export function isValidTimestamp(timestamp: string | Date): boolean {
  try {
    const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Convert minutes to a formatted duration string
 * @param minutes Total duration in minutes
 * @returns Formatted string like "2h 30m" or "45m"
 */
export function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  let formatted = "";
  if (hours > 0) {
    formatted += `${hours}h`;
  }
  if (remainingMinutes > 0) {
    if (hours > 0) formatted += " ";
    formatted += `${remainingMinutes}m`;
  }

  return formatted || "0m";
}
