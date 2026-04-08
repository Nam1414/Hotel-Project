import { format } from 'date-fns';

/**
 * Format UTC timestamp to Vietnam timezone (UTC+7)
 * @param dateString - ISO string or any valid date format
 * @returns Formatted string: "HH:mm:ss dd/MM/yyyy"
 */
export const formatVietnamTime = (dateString: string): string => {
  try {
    const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const localDate = new Date(utcString);
    return format(localDate, 'HH:mm:ss dd/MM/yyyy');
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
    const utcString = dateString.endsWith('Z') ? dateString : `${dateString}Z`;
    const localDate = new Date(utcString);
    return format(localDate, 'dd/MM/yyyy HH:mm');
  } catch (error) {
    return new Date(dateString).toLocaleString('vi-VN');
  }
};
