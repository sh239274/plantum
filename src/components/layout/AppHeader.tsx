import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { formatAppDate } from '../../utils/jalali';
import {
  Search,
  Bell,
  Sun,
  Moon,
  Globe,
  Timer,
  Menu,
} from 'lucide-react';

interface AppHeaderProps {
  onOpenMobileMenu: () => void;
}

export const AppHeader: React.FC<AppHeaderProps> = ({ onOpenMobileMenu }) => {
  const {
    settings,
    updateSettings,
    t,
    setIsCommandPaletteOpen,
    setIsNotificationOpen,
    notifications,
    setActiveSection,
  } = useApp();

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.isRead).length,
    [notifications]
  );

  const formattedDate = useMemo(() => {
    return formatAppDate(
      new Date(),
      settings.calendarType,
      settings.language,
      settings.usePersianNumerals,
      { includeDayName: true, includeYear: true }
    );
  }, [settings.calendarType, settings.language, settings.usePersianNumerals]);

  const circadianGreeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return t.goodMorning;
    if (hour >= 12 && hour < 17) return t.goodAfternoon;
    if (hour >= 17 && hour < 22) return t.goodEvening;
    return t.goodNight;
  }, [t]);

  const toggleTheme = () => {
    const isDark = settings.themeMode === 'dark' || settings.themeMode === 'oled';
    updateSettings({ themeMode: isDark ? 'light' : 'dark' });
  };

  const toggleLanguage = () => {
    const nextLang = settings.language === 'fa' ? 'en' : 'fa';
    const nextCal = nextLang === 'fa' ? 'jalali' : 'gregorian';
    const nextNum = nextLang === 'fa';
    updateSettings({
      language: nextLang,
      calendarType: nextCal,
      usePersianNumerals: nextNum,
    });
  };

  return (
    <header
      id="plantom-app-header"
      className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-neutral-200/80 bg-white/80 px-4 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/80 sm:px-6"
    >
      {/* Left: Mobile Menu & Greeting */}
      <div className="flex items-center gap-3">
        <button
          id="btn-mobile-menu"
          onClick={onOpenMobileMenu}
          aria-label="Open navigation menu"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              {circadianGreeting}
            </span>
            <span className="hidden text-neutral-300 dark:text-neutral-700 sm:inline">•</span>
            <span className="hidden text-xs text-neutral-500 dark:text-neutral-400 sm:inline">
              {formattedDate}
            </span>
          </div>
          <h1 className="text-sm font-bold text-neutral-900 dark:text-neutral-100 sm:text-base">
            {t.appName}
          </h1>
        </div>
      </div>

      {/* Center: Search Trigger */}
      <div className="mx-4 hidden max-w-md flex-1 md:block">
        <button
          id="btn-search-trigger"
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex h-9 w-full items-center justify-between rounded-xl border border-neutral-200 bg-neutral-50/80 px-3 text-xs text-neutral-500 transition hover:border-neutral-300 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-800/50 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-800"
        >
          <div className="flex items-center gap-2">
            <Search className="h-3.5 w-3.5" />
            <span>{t.searchPlaceholder}</span>
          </div>
          <kbd className="hidden rounded border border-neutral-300 bg-neutral-200/50 px-1.5 py-0.5 font-mono text-[10px] text-neutral-600 dark:border-neutral-700 dark:bg-neutral-700/50 dark:text-neutral-400 sm:inline-block">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Mobile Search Icon */}
        <button
          id="btn-mobile-search"
          onClick={() => setIsCommandPaletteOpen(true)}
          aria-label="Search"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 md:hidden"
        >
          <Search className="h-4 w-4" />
        </button>

        {/* Focus Mode Launcher */}
        <button
          id="btn-focus-mode-launcher"
          onClick={() => setActiveSection('focus')}
          title={t.navFocus}
          aria-label="Focus mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <Timer className="h-4 w-4" />
        </button>

        {/* Notifications Bell */}
        <button
          id="btn-notifications-bell"
          onClick={() => setIsNotificationOpen(true)}
          title={t.notifications}
          aria-label="Notifications"
          className="relative flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Language Switcher */}
        <button
          id="btn-language-toggle"
          onClick={toggleLanguage}
          title={settings.language === 'fa' ? 'Switch to English' : 'تغییر به فارسی'}
          aria-label="Toggle language"
          className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <Globe className="h-4 w-4" />
          <span className="uppercase">{settings.language}</span>
        </button>

        {/* Theme Mode Switcher */}
        <button
          id="btn-theme-toggle"
          onClick={toggleTheme}
          title={settings.themeMode === 'light' ? 'Dark Mode' : 'Light Mode'}
          aria-label="Toggle theme mode"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100"
        >
          {settings.themeMode === 'light' ? (
            <Moon className="h-4 w-4" />
          ) : (
            <Sun className="h-4 w-4" />
          )}
        </button>
      </div>
    </header>
  );
};
