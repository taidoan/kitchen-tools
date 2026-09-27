/**
 * Converts a decimal time value to a string in the format "minutes:seconds".
 *
 * @param decimalTime - The time value in decimal format (e.g., 2.45).
 * @returns A string representing the time in "minutes:seconds" format, where seconds are rounded and always two digits.
 *
 * @example
 * convertToMinutesSeconds(2.45); // "2:45"
 * convertToMinutesSeconds(3.07); // "3:07"
 */
export const convertToMinutesSeconds = (decimalTime: number) => {
  const minutes = Math.floor(decimalTime);
  const secondsDecimal = decimalTime - minutes;
  const seconds = Math.round(secondsDecimal * 100);

  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;
  return `${minutes}:${formattedSeconds}`;
};

/**
 * Converts a decimal time value to a string in "HH:MM" format.
 *
 * @param decimalTime - The time represented as a decimal number (e.g., 2.5 for 2 hours and 30 minutes).
 * @returns A string representing the time in "HH:MM" format, with leading zeros if necessary.
 */
export const convertToHHMM = (decimalTime: number) => {
  const hours = Math.floor(decimalTime);
  const minutes = Math.round((decimalTime - hours) * 60);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

/**
 * Converts KSRS hours-worked values to HH:MM.
 * The fractional part is minutes (8.3 / 8.30 → 08:30), not a decimal hour
 * (which would wrongly show 8.3 as 08:18).
 */
export const convertToHoursMinutes = (value: number) => {
  if (!Number.isFinite(value) || value < 0) return "00:00";

  const hours = Math.floor(value);
  let minutes = Math.round((value - hours) * 100);

  if (minutes >= 60) {
    const extraHours = Math.floor(minutes / 60);
    minutes = minutes % 60;
    return `${String(hours + extraHours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}`;
  }

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
    2,
    "0"
  )}`;
};

/**
 * Converts a time string in the format "MM:SS" to a decimal number of minutes.
 *
 * @param timeString - The time string to convert, formatted as "MM:SS".
 * @returns The total time in minutes as a decimal, rounded to two decimal places. Returns 0 if the input is falsy.
 */
export const convertTimeToMinutes = (timeString: string) => {
  if (!timeString) return 0;
  const [minutes, seconds] = timeString.split(":").map(Number);
  const decimal = (minutes || 0) + (seconds || 0) / 60;
  return parseFloat(decimal.toFixed(2));
};

/**
 * Formats a decimal number of minutes as M:SS (e.g. 8.5 → "8:30").
 */
export const formatKitchenTime = (decimalMinutes: number) => {
  const clamped = Math.max(0, decimalMinutes);
  const minutes = Math.floor(clamped);
  let seconds = Math.round((clamped - minutes) * 60);

  if (seconds === 60) {
    return `${minutes + 1}:00`;
  }

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
