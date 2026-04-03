import { format, addHours } from 'date-fns';

/**
 * Format UTC timestamp to Vietnam timezone (UTC+7)
 * @param dateString - ISO string or any valid date format
 * @returns Formatted string: "HH:mm:ss dd/MM/yyyy"
 */
export const formatVietnamTime = (dateString: string): string => {
  try {
    const utcDate = new Date(dateString);
    const vietnamDate = addHours(utcDate, 7); // UTC+7 for Vietnam
    return format(vietnamDate, 'HH:mm:ss dd/MM/yyyy');
  } catch (error) {
    return new Date(dateString).toLocaleString('vi-VN');
  }
};

/**
 * Format UTC timestamp to Vietnam timezone with short format
 * @param dateString - ISO string or any valid date format
 * @returns Formatted string: "dd/MM/yyyy HH:mm"
 */
export const formatVietnamTimeShort = (dateString: string): string => {
  try {
    const utcDate = new Date(dateString);
    const vietnamDate = addHours(utcDate, 7);
    return format(vietnamDate, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    return new Date(dateString).toLocaleString('vi-VN');
  }
};
