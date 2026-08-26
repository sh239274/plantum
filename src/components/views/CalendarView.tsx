import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import {
  CalendarViewType,
  CalendarEvent,
} from '../../types';
import {
  getJalaliFromDate,
  jalaliToGregorian,
  getDaysInJalaliMonth,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS_SHORT,
  ENGLISH_WEEKDAYS_SHORT,
  GREGORIAN_MONTHS_EN,
  GREGORIAN_MONTHS_FA,
  formatAppDate,
  formatNum,
  toIsoDateString,
} from '../../utils/jalali';
import {
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Plus,
  Clock,
  MapPin,
  ListFilter,
  CheckCircle2,
} from 'lucide-react';

export const CalendarView: React.FC = () => {
  const { events, tasks, addEvent, settings, t } = useApp();

  const [viewType, setViewType] = useState<CalendarViewType>('month');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<string>(toIsoDateString());
  const [isAddEventModalOpen, setIsAddEventModalOpen] = useState(false);

  // New Event Form
  const [eventTitle, setEventTitle] = useState('');
  const [eventStartTime, setEventStartTime] = useState('09:00');
  const [eventEndTime, setEventEndTime] = useState('10:00');
  const [eventLocation, setEventLocation] = useState('');

  const isRtl = settings.language === 'fa';
  const isJalali = settings.calendarType === 'jalali';

  // Navigation (Next / Prev Month or Day)
  const handlePrev = () => {
    const d = new Date(currentDate);
    if (viewType === 'month') {
      d.setMonth(d.getMonth() - 1);
    } else if (viewType === 'week') {
      d.setDate(d.getDate() - 7);
    } else {
      d.setDate(d.getDate() - 1);
    }
    setCurrentDate(d);
  };

  const handleNext = () => {
    const d = new Date(currentDate);
    if (viewType === 'month') {
      d.setMonth(d.getMonth() + 1);
    } else if (viewType === 'week') {
      d.setDate(d.getDate() + 7);
    } else {
      d.setDate(d.getDate() + 1);
    }
    setCurrentDate(d);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(toIsoDateString(now));
  };

  // Header Title
  const headerTitle = useMemo(() => {
    if (isJalali) {
      const j = getJalaliFromDate(currentDate);
      const mName = PERSIAN_MONTHS[j.month - 1];
      const yNum = formatNum(j.year, settings.usePersianNumerals);
      return `${mName} ${yNum}`;
    } else {
      const mName = settings.language === 'fa' ? GREGORIAN_MONTHS_FA[currentDate.getMonth()] : GREGORIAN_MONTHS_EN[currentDate.getMonth()];
      const yNum = formatNum(currentDate.getFullYear(), settings.usePersianNumerals);
      return `${mName} ${yNum}`;
    }
  }, [currentDate, isJalali, settings.language, settings.usePersianNumerals]);

  // Month Grid Calculation
  const monthDays = useMemo(() => {
    if (isJalali) {
      const currentJ = getJalaliFromDate(currentDate);
      const daysInMonth = getDaysInJalaliMonth(currentJ.year, currentJ.month);

      // Find first day of this Jalali month in Gregorian
      const gFirst = jalaliToGregorian(currentJ.year, currentJ.month, 1);
      const firstDate = new Date(gFirst.year, gFirst.month - 1, gFirst.day);
      const startDayOfWeek = (firstDate.getDay() + 1) % 7; // 0 = Saturday, 6 = Friday

      const days: { dayNum: number; isoDate: string; isCurrentMonth: boolean }[] = [];

      // Padding days from previous month
      for (let i = 0; i < startDayOfWeek; i++) {
        days.push({ dayNum: 0, isoDate: '', isCurrentMonth: false });
      }

      // Days of this month
      for (let d = 1; d <= daysInMonth; d++) {
        const gDay = jalaliToGregorian(currentJ.year, currentJ.month, d);
        const iso = `${gDay.year}-${String(gDay.month).padStart(2, '0')}-${String(gDay.day).padStart(2, '0')}`;
        days.push({ dayNum: d, isoDate: iso, isCurrentMonth: true });
      }

      return days;
    } else {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

      const days: { dayNum: number; isoDate: string; isCurrentMonth: boolean }[] = [];
      for (let i = 0; i < firstDay; i++) {
        days.push({ dayNum: 0, isoDate: '', isCurrentMonth: false });
      }
      for (let d = 1; d <= daysInMonth; d++) {
        const iso = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        days.push({ dayNum: d, isoDate: iso, isCurrentMonth: true });
      }
      return days;
    }
  }, [currentDate, isJalali]);

  // Filter items for selected day
  const selectedDateEvents = useMemo(() => {
    return events.filter((e) => e.startDate === selectedDate);
  }, [events, selectedDate]);

  const selectedDateTasks = useMemo(() => {
    return tasks.filter((t) => t.dueDate === selectedDate);
  }, [tasks, selectedDate]);

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;
    addEvent({
      title: eventTitle.trim(),
      startDate: selectedDate,
      startTime: eventStartTime,
      endDate: selectedDate,
      endTime: eventEndTime,
      isAllDay: false,
      color: '#6366f1',
      location: eventLocation.trim() || undefined,
    });
    setEventTitle('');
    setEventLocation('');
    setIsAddEventModalOpen(false);
  };

  const weekdaysHeader = isJalali ? PERSIAN_WEEKDAYS_SHORT : ENGLISH_WEEKDAYS_SHORT;

  return (
    <div id="plantom-calendar-view" className="space-y-6">
      {/* Calendar Top Bar */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        {/* Title & Navigation Controls */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
            <CalendarIcon className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {headerTitle}
            </h2>
            <span className="text-xs text-neutral-400">
              {isJalali ? 'گاه‌شماری خورشیدی' : 'Gregorian Calendar'}
            </span>
          </div>
        </div>

        {/* View Switcher & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Navigation Prev/Next */}
          <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
            <button
              onClick={handlePrev}
              className="rounded-lg p-1.5 text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </button>
            <button
              onClick={handleToday}
              className="px-2.5 py-1 text-xs font-semibold text-neutral-700 hover:text-indigo-600 dark:text-neutral-300 dark:hover:text-indigo-400"
            >
              {t.today}
            </button>
            <button
              onClick={handleNext}
              className="rounded-lg p-1.5 text-neutral-600 hover:bg-white dark:text-neutral-300 dark:hover:bg-neutral-700"
            >
              {isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </button>
          </div>

          {/* View Type Switcher */}
          <div className="flex items-center rounded-xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
            {(['month', 'agenda'] as CalendarViewType[]).map((v) => (
              <button
                key={v}
                onClick={() => setViewType(v)}
                className={`rounded-lg px-3 py-1 text-xs font-semibold transition ${
                  viewType === v
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
                }`}
              >
                {v === 'month' ? t.calendarMonthView : t.calendarAgendaView}
              </button>
            ))}
          </div>

          {/* Add Event Button */}
          <button
            onClick={() => setIsAddEventModalOpen(true)}
            className="flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-indigo-700 active:scale-95"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">{t.newEvent}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Month Grid or Agenda */}
      {viewType === 'month' ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Month Calendar (2 Cols) */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 lg:col-span-2">
            {/* Weekday Labels */}
            <div className="grid grid-cols-7 gap-1 text-center font-bold text-xs text-neutral-400 pb-3 border-b border-neutral-100 dark:border-neutral-800">
              {weekdaysHeader.map((d, i) => (
                <div key={i}>{d}</div>
              ))}
            </div>

            {/* Days Grid */}
            <div className="mt-3 grid grid-cols-7 gap-2">
              {monthDays.map((item, idx) => {
                if (!item.isCurrentMonth) {
                  return <div key={idx} className="h-20 sm:h-24 rounded-2xl bg-neutral-50/40 dark:bg-neutral-800/20" />;
                }

                const isSelected = item.isoDate === selectedDate;
                const isToday = item.isoDate === toIsoDateString();
                const dayEvents = events.filter((e) => e.startDate === item.isoDate);
                const dayTasks = tasks.filter((t) => t.dueDate === item.isoDate);

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedDate(item.isoDate)}
                    className={`h-20 sm:h-24 cursor-pointer rounded-2xl border p-2 flex flex-col justify-between transition ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 dark:border-indigo-500 dark:bg-indigo-950/30'
                        : isToday
                        ? 'border-indigo-300 bg-white shadow-xs dark:border-indigo-800 dark:bg-neutral-900'
                        : 'border-neutral-100 bg-white hover:border-neutral-300 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-neutral-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                          isToday
                            ? 'bg-indigo-600 text-white'
                            : 'text-neutral-800 dark:text-neutral-200'
                        }`}
                      >
                        {formatNum(item.dayNum, settings.usePersianNumerals)}
                      </span>
                    </div>

                    {/* Dot Indicators */}
                    <div className="space-y-1 overflow-hidden">
                      {dayEvents.slice(0, 1).map((ev) => (
                        <div
                          key={ev.id}
                          className="truncate rounded-md bg-indigo-100 px-1 py-0.5 text-[9px] font-semibold text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200"
                        >
                          {ev.title}
                        </div>
                      ))}
                      {dayTasks.length > 0 && (
                        <div className="flex items-center gap-1 text-[9px] text-amber-600 dark:text-amber-400 font-bold truncate">
                          <span>• {formatNum(dayTasks.length, settings.usePersianNumerals)} وظیفه</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Selected Date Details Sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                برنامه روز انتخاب‌شده
              </h3>
              <h4 className="mt-1 text-sm font-black text-neutral-900 dark:text-neutral-100">
                {formatAppDate(selectedDate, settings.calendarType, settings.language, settings.usePersianNumerals, { includeDayName: true, includeYear: true })}
              </h4>

              {/* Events for this day */}
              <div className="mt-4 space-y-3">
                <h5 className="text-[11px] font-bold text-neutral-500">رویدادها و جلسات</h5>
                {selectedDateEvents.length === 0 ? (
                  <p className="text-xs text-neutral-400">رویدادی برای این روز ثبت نشده است.</p>
                ) : (
                  selectedDateEvents.map((ev) => (
                    <div
                      key={ev.id}
                      className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-3 dark:border-indigo-900/60 dark:bg-indigo-950/20"
                    >
                      <div className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {ev.title}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[10px] text-neutral-500 dark:text-neutral-400">
                        <Clock className="h-3 w-3" />
                        <span>
                          {formatNum(ev.startTime, settings.usePersianNumerals)} - {formatNum(ev.endTime, settings.usePersianNumerals)}
                        </span>
                        {ev.location && (
                          <>
                            <span>•</span>
                            <MapPin className="h-3 w-3" />
                            <span className="truncate">{ev.location}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ))
                )}

                {/* Deadlines for this day */}
                <h5 className="pt-2 text-[11px] font-bold text-neutral-500">موعد وظایف</h5>
                {selectedDateTasks.length === 0 ? (
                  <p className="text-xs text-neutral-400">وظیفه‌ای با این موعد ثبت نشده است.</p>
                ) : (
                  selectedDateTasks.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between rounded-xl bg-neutral-50 p-2.5 dark:bg-neutral-800/50"
                    >
                      <span className="text-xs font-medium text-neutral-800 dark:text-neutral-200 truncate">
                        {t.title}
                      </span>
                      {t.status === 'completed' && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Agenda View */
        <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-4">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
            {t.calendarAgendaView} (رویدادها و جلسات پیش‌رو)
          </h3>

          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {events.map((ev) => (
              <div key={ev.id} className="py-3 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                    {ev.title}
                  </h4>
                  <div className="mt-1 flex items-center gap-3 text-[11px] text-neutral-500">
                    <span>
                      {formatAppDate(ev.startDate, settings.calendarType, settings.language, settings.usePersianNumerals, { format: 'short' })}
                    </span>
                    <span>•</span>
                    <span>
                      {formatNum(ev.startTime, settings.usePersianNumerals)} - {formatNum(ev.endTime, settings.usePersianNumerals)}
                    </span>
                    {ev.location && (
                      <>
                        <span>•</span>
                        <span>{ev.location}</span>
                      </>
                    )}
                  </div>
                </div>
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: ev.color }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {isAddEventModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-sm"
          onClick={() => setIsAddEventModalOpen(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.newEvent}
            </h3>
            <form onSubmit={handleCreateEvent} className="mt-4 space-y-4">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.eventTitle}
                </label>
                <input
                  type="text"
                  required
                  autoFocus
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.eventStart}
                  </label>
                  <input
                    type="time"
                    value={eventStartTime}
                    onChange={(e) => setEventStartTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                    {t.eventEnd}
                  </label>
                  <input
                    type="time"
                    value={eventEndTime}
                    onChange={(e) => setEventEndTime(e.target.value)}
                    className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-600 dark:text-neutral-400">
                  {t.location}
                </label>
                <input
                  type="text"
                  placeholder="مکان یا لینک جلسه آنلاین..."
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddEventModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-xs font-semibold text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400"
                >
                  {t.cancel}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700"
                >
                  {t.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
