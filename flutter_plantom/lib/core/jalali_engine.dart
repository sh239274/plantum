import 'package:shamsi_date/shamsi_date.dart';

class JalaliEngine {
  /// Converts Gregorian DateTime to Jalali formatted string with weekday name
  static String formatJalali(DateTime date, {bool usePersianDigits = true}) {
    final jalali = Jalali.fromDateTime(date);
    final formatter = jalali.formatter;
    final formatted = '${formatter.wN}، ${formatter.d} ${formatter.mN} ${formatter.yyyy}';
    return usePersianDigits ? toPersianDigits(formatted) : formatted;
  }

  /// Converts English numbers to Persian digits (0-9 -> ۰-۹)
  static String toPersianDigits(dynamic input) {
    if (input == null) return '';
    const english = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

    var str = input.toString();
    for (var i = 0; i < 10; i++) {
      str = str.replaceAll(english[i], persian[i]);
    }
    return str;
  }

  /// Check if a Jalali year is a leap year (کبیسه)
  static bool isJalaliLeapYear(int year) {
    final jalali = Jalali(year, 1, 1);
    return jalali.isLeapYear();
  }
}
