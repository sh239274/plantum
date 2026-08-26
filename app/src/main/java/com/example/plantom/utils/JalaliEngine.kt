package com.example.plantom.utils

import com.example.plantom.model.CalendarType
import com.example.plantom.model.Language
import java.time.LocalDate
import java.time.format.DateTimeFormatter

data class JalaliDate(
    val year: Int,
    val month: Int, // 1 - 12
    val day: Int    // 1 - 31
)

object JalaliEngine {

    val PERSIAN_MONTHS = listOf(
        "فروردین", "اردیبهشت", "خرداد",
        "تیر", "مرداد", "شهریور",
        "مهر", "آبان", "آذر",
        "دی", "بهمن", "اسفند"
    )

    val GREGORIAN_MONTHS_EN = listOf(
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    )

    val GREGORIAN_MONTHS_FA = listOf(
        "ژانویه", "فوریه", "مارس", "آوریل", "مه", "ژوئن",
        "ژوئیه", "اوت", "سپتامبر", "اکتبر", "نوامبر", "دسامبر"
    )

    val PERSIAN_WEEKDAYS = listOf(
        "شنبه", "یکشنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"
    )

    val PERSIAN_WEEKDAYS_SHORT = listOf(
        "ش", "ی", "د", "س", "چ", "پ", "ج"
    )

    val ENGLISH_WEEKDAYS = listOf(
        "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
    )

    val ENGLISH_WEEKDAYS_SHORT = listOf(
        "Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"
    )

    fun toPersianDigits(input: Any): String {
        val str = input.toString()
        val persianDigits = charArrayOf('۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹')
        val sb = StringBuilder()
        for (ch in str) {
            if (ch in '0'..'9') {
                sb.append(persianDigits[ch - '0'])
            } else {
                sb.append(ch)
            }
        }
        return sb.toString()
    }

    fun formatNum(num: Any, usePersian: Boolean): String {
        return if (usePersian) toPersianDigits(num) else num.toString()
    }

    fun gregorianToJalali(gy: Int, gm: Int, gd: Int): JalaliDate {
        val gdm = intArrayOf(0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334)
        val gy2 = if (gm > 2) (gy + 1) else gy
        var days = 355666 + (365 * gy) + ((gy2 + 3) / 4) - ((gy2 + 99) / 100) + ((gy2 + 399) / 400) + gd + gdm[gm - 1]
        var jy = -1595 + (33 * (days / 12053))
        days %= 12053
        jy += 4 * (days / 1461)
        days %= 1461
        if (days > 365) {
            jy += (days - 1) / 365
            days = (days - 1) % 365
        }
        val jm: Int
        val jd: Int
        if (days < 186) {
            jm = 1 + (days / 31)
            jd = 1 + (days % 31)
        } else {
            jm = 7 + ((days - 186) / 30)
            jd = 1 + ((days - 186) % 30)
        }
        return JalaliDate(jy, jm, jd)
    }

    fun jalaliToGregorian(jy: Int, jm: Int, jd: Int): LocalDate {
        val jy2 = jy + 1595
        var days = -355668 + (365 * jy2) + ((jy2 / 33) * 8) + (((jy2 % 33) + 3) / 4) + jd + (if (jm < 7) ((jm - 1) * 31) else (((jm - 7) * 30) + 186))
        var gy = 400 * (days / 146097)
        days %= 146097
        if (days > 36524) {
            gy += 100 * (--days / 36524)
            days %= 36524
            if (days >= 365) days++
        }
        gy += 4 * (days / 1461)
        days %= 1461
        if (days > 365) {
            gy += (days - 1) / 365
            days = (days - 1) % 365
        }
        val gdM = intArrayOf(0, 31, if ((gy % 4 == 0 && gy % 100 != 0) || (gy % 400 == 0)) 29 else 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31)
        var gm = 0
        while (gm < 13 && days >= gdM[gm]) {
            days -= gdM[gm]
            gm++
        }
        return LocalDate.of(gy, gm, days + 1)
    }

    fun getJalaliFromDate(date: LocalDate = LocalDate.now()): JalaliDate {
        return gregorianToJalali(date.year, date.monthValue, date.dayOfMonth)
    }

    fun isJalaliLeapYear(jy: Int): Boolean {
        val breaks = intArrayOf(-61, 9, 38, 199, 426, 686, 756, 818, 1111, 1181, 1210, 1635, 2060, 2097, 2192, 2262, 2324, 2394, 2456, 3178)
        val bl = breaks.size
        if (jy < breaks[0] || jy >= breaks[bl - 1]) return false
        var jp = breaks[0]
        for (i in 1 until bl) {
            val jmNext = breaks[i]
            val jump = jmNext - jp
            if (jy < jmNext) {
                var n = jy - jp
                if (jump - n < 6) n = n - jump + ((jump / 33) * 33)
                val leap = if (n >= 0) n % 33 else (n % 33) + 33
                return leap in listOf(1, 5, 9, 13, 17, 22, 26, 30)
            }
            jp = jmNext
        }
        return false
    }

    fun getDaysInJalaliMonth(year: Int, month: Int): Int {
        if (month <= 6) return 31
        if (month <= 11) return 30
        return if (isJalaliLeapYear(year)) 30 else 29
    }

    /**
     * 0 = Saturday, 1 = Sunday, ..., 6 = Friday
     */
    fun getPersianDayOfWeek(date: LocalDate): Int {
        val day = date.dayOfWeek.value // 1=Mon, ..., 7=Sun
        return (day + 1) % 7 // Saturday is 6 in DayOfWeek -> (6+1)%7 = 0
    }

    fun formatAppDate(
        dateStr: String,
        calendarType: CalendarType,
        language: Language,
        usePersianNumerals: Boolean,
        includeDayName: Boolean = true,
        includeYear: Boolean = true,
        format: String = "full"
    ): String {
        val localDate = try {
            LocalDate.parse(dateStr, DateTimeFormatter.ISO_LOCAL_DATE)
        } catch (e: Exception) {
            LocalDate.now()
        }
        return formatAppDate(localDate, calendarType, language, usePersianNumerals, includeDayName, includeYear, format)
    }

    fun formatAppDate(
        date: LocalDate,
        calendarType: CalendarType,
        language: Language,
        usePersianNumerals: Boolean,
        includeDayName: Boolean = true,
        includeYear: Boolean = true,
        format: String = "full"
    ): String {
        if (calendarType == CalendarType.JALALI) {
            val j = getJalaliFromDate(date)
            val dayOfWeek = getPersianDayOfWeek(date)
            val dayName = if (language == Language.FA) PERSIAN_WEEKDAYS[dayOfWeek] else ENGLISH_WEEKDAYS[dayOfWeek]
            val monthName = PERSIAN_MONTHS[j.month - 1]
            val dayNum = formatNum(j.day, usePersianNumerals)
            val yearNum = formatNum(j.year, usePersianNumerals)

            if (format == "compact") {
                val padM = String.format("%02d", j.month)
                val padD = String.format("%02d", j.day)
                val str = "${j.year}/$padM/$padD"
                return if (usePersianNumerals) toPersianDigits(str) else str
            }

            if (format == "short") {
                return "$dayNum $monthName"
            }

            val sb = java.lang.StringBuilder()
            if (includeDayName) sb.append("$dayName، ")
            sb.append("$dayNum $monthName")
            if (includeYear) sb.append(" $yearNum")
            return sb.toString()
        } else {
            val monthIndex = date.monthValue - 1
            val dayNum = date.dayOfMonth
            val year = date.year
            val dayOfWeek = (date.dayOfWeek.value % 7) // 0 for Sun
            val dayNameEn = listOf("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday")[dayOfWeek]
            val monthName = if (language == Language.FA) GREGORIAN_MONTHS_FA[monthIndex] else GREGORIAN_MONTHS_EN[monthIndex]

            val formattedDay = formatNum(dayNum, usePersianNumerals)
            val formattedYear = formatNum(year, usePersianNumerals)

            if (format == "compact") {
                val padM = String.format("%02d", monthIndex + 1)
                val padD = String.format("%02d", dayNum)
                val str = "$year-$padM-$padD"
                return if (usePersianNumerals) toPersianDigits(str) else str
            }

            if (format == "short") {
                return "$monthName $formattedDay"
            }

            return if (language == Language.FA) {
                val pDay = PERSIAN_WEEKDAYS[getPersianDayOfWeek(date)]
                val sb = java.lang.StringBuilder()
                if (includeDayName) sb.append("$pDay، ")
                sb.append("$formattedDay $monthName")
                if (includeYear) sb.append(" $formattedYear")
                sb.toString()
            } else {
                val sb = java.lang.StringBuilder()
                if (includeDayName) sb.append("$dayNameEn, ")
                sb.append("$monthName $formattedDay")
                if (includeYear) sb.append(", $formattedYear")
                sb.toString()
            }
        }
    }

    fun getTodayIso(): String = LocalDate.now().format(DateTimeFormatter.ISO_LOCAL_DATE)

    fun getTomorrowIso(): String = LocalDate.now().plusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE)

    fun getYesterdayIso(): String = LocalDate.now().minusDays(1).format(DateTimeFormatter.ISO_LOCAL_DATE)

    fun getInDaysIso(days: Long): String = LocalDate.now().plusDays(days).format(DateTimeFormatter.ISO_LOCAL_DATE)
}
