/**
 * Plantom Dual-Calendar Engine (Jalali & Gregorian)
 * High-precision astronomical calendar transformations and localization helpers.
 */

import { Language } from '../types';

export interface JalaliDate {
  year: number;
  month: number; // 1 - 12
  day: number;   // 1 - 31
}

export const PERSIAN_MONTHS = [
  'فروردین', 'اردیبهشت', 'خرداد',
  'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر',
  'دی', 'بهمن', 'اسفند'
];

export const GREGORIAN_MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const GREGORIAN_MONTHS_FA = [
  'ژانویه', 'فوریه', 'مارس', 'آوریل', 'مه', 'ژوئن',
  'ژوئیه', 'اوت', 'سپتامبر', 'اکتبر', 'نوامبر', 'دسامبر'
];

export const PERSIAN_WEEKDAYS = [
  'شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'
];

export const PERSIAN_WEEKDAYS_SHORT = [
  'ش', 'ی', 'د', 'س', 'چ', 'پ', 'ج'
];

export const ENGLISH_WEEKDAYS = [
  'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'
];

export const ENGLISH_WEEKDAYS_MON_START = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export const ENGLISH_WEEKDAYS_SHORT = [
  'Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'
];

/**
 * Converts English digits to Persian digits
 */
export function toPersianDigits(input: string | number): string {
  const str = String(input);
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return str.replace(/[0-9]/g, (w) => persianDigits[parseInt(w, 10)]);
}

/**
 * Converts Persian digits to English digits
 */
export function toEnglishDigits(input: string): string {
  const persianDigits = [/۰/g, /۱/g, /۲/g, /۳/g, /۴/g, /۵/g, /۶/g, /۷/g, /۸/g, /۹/g];
  let res = input;
  for (let i = 0; i < 10; i++) {
    res = res.replace(persianDigits[i], String(i));
  }
  return res;
}

/**
 * Formats a number according to Persian numerals preference
 */
export function formatNum(num: number | string, usePersian: boolean): string {
  return usePersian ? toPersianDigits(num) : String(num);
}

/**
 * Gregorian to Jalali Conversion Algorithm
 */
export function gregorianToJalali(gy: number, gm: number, gd: number): JalaliDate {
  const g_d_m = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  let gy2 = (gm > 2) ? (gy + 1) : gy;
  let days = 355666 + (365 * gy) + Math.floor((gy2 + 3) / 4) - Math.floor((gy2 + 99) / 100) + Math.floor((gy2 + 399) / 400) + gd + g_d_m[gm - 1];
  let jy = -1595 + (33 * Math.floor(days / 12053));
  days %= 12053;
  jy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    jy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  let jm: number;
  let jd: number;
  if (days < 186) {
    jm = 1 + Math.floor(days / 31);
    jd = 1 + (days % 31);
  } else {
    jm = 7 + Math.floor((days - 186) / 30);
    jd = 1 + ((days - 186) % 30);
  }
  return { year: jy, month: jm, day: jd };
}

/**
 * Jalali to Gregorian Conversion Algorithm
 */
export function jalaliToGregorian(jy: number, jm: number, jd: number): { year: number; month: number; day: number } {
  const jy2 = jy + 1595;
  let days = -355668 + (365 * jy2) + (Math.floor(jy2 / 33) * 8) + Math.floor(((jy2 % 33) + 3) / 4) + jd + ((jm < 7) ? ((jm - 1) * 31) : (((jm - 7) * 30) + 186));
  let gy = 400 * Math.floor(days / 146097);
  days %= 146097;
  if (days > 36524) {
    gy += 100 * Math.floor(--days / 36524);
    days %= 36524;
    if (days >= 365) days++;
  }
  gy += 4 * Math.floor(days / 1461);
  days %= 1461;
  if (days > 365) {
    gy += Math.floor((days - 1) / 365);
    days = (days - 1) % 365;
  }
  const gd_m = [0, 31, ((gy % 4 === 0 && gy % 100 !== 0) || (gy % 400 === 0)) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  let gm = 0;
  while (gm < 13 && days >= gd_m[gm]) {
    days -= gd_m[gm];
    gm++;
  }
  return { year: gy, month: gm, day: days + 1 };
}

/**
 * Gets Jalali Date from JS Date
 */
export function getJalaliFromDate(date: Date = new Date()): JalaliDate {
  return gregorianToJalali(date.getFullYear(), date.getMonth() + 1, date.getDate());
}

/**
 * Checks if a Jalali year is leap year
 */
export function isJalaliLeapYear(jy: number): boolean {
  const breaks = [-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178];
  let jp = breaks[0];
  let jm = 0;
  let jump = 0;
  const bl = breaks.length;
  if (jy < jp || jy >= breaks[bl - 1]) return false;
  for (let i = 1; i < bl; i++) {
    const jmNext = breaks[i];
    jump = jmNext - jp;
    if (jy < jmNext) break;
    jp = jmNext;
  }
  let n = jy - jp;
  if (jump - n < 6) n = n - jump + (Math.floor(jump / 33) * 33);
  let leap = (n >= 0 ? n % 33 : (n % 33) + 33);
  if (leap === 1 || leap === 5 || leap === 9 || leap === 13 || leap === 17 || leap === 22 || leap === 26 || leap === 30) {
    return true;
  }
  return false;
}

/**
 * Gets days in a Jalali month
 */
export function getDaysInJalaliMonth(year: number, month: number): number {
  if (month <= 6) return 31;
  if (month <= 11) return 30;
  return isJalaliLeapYear(year) ? 30 : 29;
}

/**
 * Gets day of week index for a date (0=Saturday, 1=Sunday, ..., 6=Friday)
 */
export function getPersianDayOfWeek(date: Date): number {
  const day = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  return (day + 1) % 7; // 0 = Saturday, 1 = Sunday, ..., 6 = Friday
}

/**
 * Formats a Date object according to active calendar and language preferences
 */
export function formatAppDate(
  dateInput: Date | string,
  calendarType: 'jalali' | 'gregorian',
  language: 'fa' | 'en',
  usePersianNumerals: boolean,
  options: { includeDayName?: boolean; includeYear?: boolean; format?: 'full' | 'short' | 'compact' } = {}
): string {
  const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
  if (isNaN(date.getTime())) return '';

  const { includeDayName = true, includeYear = true, format = 'full' } = options;

  if (calendarType === 'jalali') {
    const j = getJalaliFromDate(date);
    const dayOfWeek = getPersianDayOfWeek(date);
    const dayName = language === 'fa' ? PERSIAN_WEEKDAYS[dayOfWeek] : ENGLISH_WEEKDAYS[dayOfWeek];
    const monthName = language === 'fa' ? PERSIAN_MONTHS[j.month - 1] : PERSIAN_MONTHS[j.month - 1];
    const dayNum = formatNum(j.day, usePersianNumerals);
    const yearNum = formatNum(j.year, usePersianNumerals);

    if (format === 'compact') {
      const padM = String(j.month).padStart(2, '0');
      const padD = String(j.day).padStart(2, '0');
      const str = `${j.year}/${padM}/${padD}`;
      return usePersianNumerals ? toPersianDigits(str) : str;
    }

    if (format === 'short') {
      return `${dayNum} ${monthName}`;
    }

    let result = '';
    if (includeDayName) result += `${dayName}، `;
    result += `${dayNum} ${monthName}`;
    if (includeYear) result += ` ${yearNum}`;
    return result;
  } else {
    const monthIndex = date.getMonth();
    const dayNum = date.getDate();
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();
    const dayNameEn = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
    const monthName = language === 'fa' ? GREGORIAN_MONTHS_FA[monthIndex] : GREGORIAN_MONTHS_EN[monthIndex];

    const formattedDay = formatNum(dayNum, usePersianNumerals);
    const formattedYear = formatNum(year, usePersianNumerals);

    if (format === 'compact') {
      const padM = String(monthIndex + 1).padStart(2, '0');
      const padD = String(dayNum).padStart(2, '0');
      const str = `${year}-${padM}-${padD}`;
      return usePersianNumerals ? toPersianDigits(str) : str;
    }

    if (format === 'short') {
      return `${monthName} ${formattedDay}`;
    }

    if (language === 'fa') {
      let res = '';
      if (includeDayName) res += `${PERSIAN_WEEKDAYS[(dayOfWeek + 1) % 7]}، `;
      res += `${formattedDay} ${monthName}`;
      if (includeYear) res += ` ${formattedYear}`;
      return res;
    } else {
      let res = '';
      if (includeDayName) res += `${dayNameEn}, `;
      res += `${monthName} ${formattedDay}`;
      if (includeYear) res += `, ${formattedYear}`;
      return res;
    }
  }
}

/**
 * Formats time string (e.g., "14:30")
 */
export function formatAppTime(timeStr: string, usePersianNumerals: boolean): string {
  if (!timeStr) return '';
  return usePersianNumerals ? toPersianDigits(timeStr) : timeStr;
}

/**
 * Returns ISO date string "YYYY-MM-DD" from JS Date
 */
export function toIsoDateString(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

/**
 * Returns short weekday name by day of week (0 = Sunday, 6 = Saturday)
 */
export function getDayOfWeekName(dayOfWeek: number, language: Language = 'fa'): string {
  if (language === 'fa') {
    // Jalali weekday mapping: Sat=0, Sun=1, Mon=2, Tue=3, Wed=4, Thu=5, Fri=6
    const pIndex = (dayOfWeek + 1) % 7;
    return PERSIAN_WEEKDAYS_SHORT[pIndex];
  }
  return ENGLISH_WEEKDAYS_SHORT[dayOfWeek];
}
