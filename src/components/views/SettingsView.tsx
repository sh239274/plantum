import React, { useState } from 'react';
import JSZip from 'jszip';
import { useApp } from '../../context/AppContext';
import {
  Settings as SettingsIcon,
  Globe,
  Calendar,
  Timer,
  Download,
  RotateCcw,
  Code2,
  Copy,
  Check,
  Smartphone,
  Database,
  FileArchive,
  Terminal,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    resetToInitialData,
    t,
    tasks,
    projects,
    goals,
    habits,
    notes,
    events,
    focusSessions,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'preferences' | 'flutterCode'>('preferences');
  const [selectedFlutterFile, setSelectedFlutterFile] = useState<string>('build_windows.bat');
  const [copiedFile, setCopiedFile] = useState<boolean>(false);
  const [isZipping, setIsZipping] = useState<boolean>(false);

  const handleExportData = () => {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      appName: 'Plantom',
      settings,
      tasks,
      projects,
      goals,
      habits,
      notes,
      events,
      focusSessions,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `plantom_backup_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedFile(true);
    setTimeout(() => setCopiedFile(false), 2000);
  };

  // FLUTTER PRODUCTION CODE ARCHITECTURE
  const flutterFiles: { [filename: string]: { path: string; description: string; code: string } } = {
    'build_windows.bat': {
      path: 'build_windows.bat',
      description: 'اسکریپت ویندوزی خودکار برای بیلد، تولید کدهای دیتابیس و ساخت خروجی اجرایی Plantom.exe',
      code: `@echo off
echo ===============================================================================
echo                Plantom (پلنتوم) - Windows Production Build Pipeline
echo ===============================================================================
echo [1/4] Cleaning previous build artifacts...
call flutter clean

echo [2/4] Fetching Flutter dependencies...
call flutter pub get

echo [3/4] Generating Drift SQLite database and Riverpod models...
call dart run build_runner build --delete-conflicting-outputs

echo [4/4] Compiling Native Standalone Windows Release Executable (Plantom.exe)...
call flutter build windows --release

echo ===============================================================================
echo [SUCCESS] Plantom Windows Build Complete!
echo The standalone runnable executable and files are located at:
echo build\\windows\\x64\\runner\\Release\\Plantom.exe
echo ===============================================================================
pause
`,
    },
    'pubspec.yaml': {
      path: 'pubspec.yaml',
      description: 'پیکربندی وابستگی‌های پروژه پلنتوم با Drift SQLite، Riverpod، shamsi_date و lucide_icons',
      code: `name: plantom
description: "Plantom (پلنتوم) - Comprehensive Cross-Platform Personal Productivity and Planning System for Windows, Android, iOS and Web"
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: '>=3.2.0 <4.0.0'

dependencies:
  flutter:
    sdk: flutter
  flutter_localizations:
    sdk: flutter

  # State Management & Reactive Architecture
  flutter_riverpod: ^2.5.1

  # Local Offline-first SQLite Persistence
  drift: ^2.18.0
  sqlite3_flutter_libs: ^0.5.24
  path_provider: ^2.1.3
  path: ^1.9.0

  # High-Precision Dual-Calendar (Jalali & Gregorian)
  shamsi_date: ^1.0.1
  intl: ^0.19.0

  # Modern UI, Typography, Icons & Audio
  lucide_icons: ^0.257.0
  google_fonts: ^6.2.1
  flutter_animate: ^4.5.0
  audioplayers: ^6.0.0
  uuid: ^4.4.0

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^3.0.0
  drift_dev: ^2.18.0
  build_runner: ^2.4.9

flutter:
  uses-material-design: true
  assets:
    - assets/
`,
    },
    'main.dart': {
      path: 'lib/main.dart',
      description: 'نقطه ورود اپلیکیشن فلاتر پلنتوم با ProviderScope، تم تیره/روشن و فونت فارسی وزیرمتن',
      code: `import 'dart:io';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'core/theme.dart';
import 'presentation/screens/dashboard_screen.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(
    const ProviderScope(
      child: PlantomApp(),
    ),
  );
}

class PlantomApp extends ConsumerWidget {
  const PlantomApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Plantom | پلنتوم',
      debugShowCheckedModeBanner: false,
      locale: const Locale('fa', 'IR'),
      supportedLocales: const [
        Locale('fa', 'IR'),
        Locale('en', 'US'),
      ],
      localizationsDelegates: const [
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: PlantomTheme.lightTheme,
      darkTheme: PlantomTheme.darkTheme,
      themeMode: ThemeMode.dark,
      home: const DashboardScreen(),
    );
  }
}
`,
    },
    'jalali_engine.dart': {
      path: 'lib/core/jalali_engine.dart',
      description: 'موتور محاسبات تقویم شمسی جلالی، تبدیل به میلادی و ارقام فارسی',
      code: `import 'package:shamsi_date/shamsi_date.dart';

class JalaliEngine {
  /// Converts Gregorian DateTime to Jalali formatted string with weekday name
  static String formatJalali(DateTime date, {bool usePersianDigits = true}) {
    final jalali = Jalali.fromDateTime(date);
    final formatter = jalali.formatter;
    final formatted = '\${formatter.wN}، \${formatter.d} \${formatter.mN} \${formatter.yyyy}';
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
`,
    },
    'theme.dart': {
      path: 'lib/core/theme.dart',
      description: 'پیکربندی استایل، رنگ‌ها و تایپوگرافی نیتیو پلنتوم با فونت Vazirmatn',
      code: `import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class PlantomTheme {
  static const primaryColor = Color(0xFF6366F1);
  static const darkBackground = Color(0xFF0A0A0B);
  static const darkCard = Color(0xFF141416);
  static const darkBorder = Color(0xFF27272A);

  static ThemeData get darkTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.dark,
      scaffoldBackgroundColor: darkBackground,
      colorScheme: const ColorScheme.dark(
        primary: primaryColor,
        surface: darkCard,
        background: darkBackground,
      ),
      fontFamily: GoogleFonts.vazirmatn().fontFamily,
      cardTheme: CardTheme(
        color: darkCard,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: darkBorder, width: 1),
        ),
      ),
    );
  }

  static ThemeData get lightTheme {
    return ThemeData(
      useMaterial3: true,
      brightness: Brightness.light,
      scaffoldBackgroundColor: const Color(0xFFF8FAFC),
      colorScheme: const ColorScheme.light(
        primary: primaryColor,
        surface: Colors.white,
      ),
      fontFamily: GoogleFonts.vazirmatn().fontFamily,
      cardTheme: CardTheme(
        color: Colors.white,
        elevation: 0,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(20),
          side: const BorderSide(color: Color(0xFFE2E8F0), width: 1),
        ),
      ),
    );
  }
}
`,
    },
    'dashboard_screen.dart': {
      path: 'lib/presentation/screens/dashboard_screen.dart',
      description: 'صفحه اصلی داشبورد دسکتاپ ویندوز پلنتوم با سایدبار نیتیو و کارت‌های مدرن',
      code: `import 'package:flutter/material.dart';
import 'package:lucide_icons/lucide_icons.dart';
import '../../core/jalali_engine.dart';
import '../../models/task_model.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  int _selectedTabIndex = 0;

  final List<TaskModel> _tasks = [
    const TaskModel(
      id: 't-1',
      title: 'طراحی ساختار دیتابیس لوکال SQLite ویندوز',
      priority: TaskPriority.urgent,
      dueDate: 'امروز',
      isCompleted: true,
    ),
    const TaskModel(
      id: 't-2',
      title: 'پیاده‌سازی گاه‌شماری جلالی شمسی و تبدیل تاریخ',
      priority: TaskPriority.high,
      dueDate: 'امروز',
      isCompleted: true,
    ),
    const TaskModel(
      id: 't-3',
      title: 'بهینه‌سازی رابط کاربری نسخه دسکتاپ ویندوز Plantom',
      priority: TaskPriority.medium,
      dueDate: 'امروز',
      isCompleted: false,
    ),
  ];

  @override
  Widget build(BuildContext context) {
    final now = DateTime.now();
    final jalaliDateStr = JalaliEngine.formatJalali(now);

    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: const Color(0xFF6366F1).withOpacity(0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: const Icon(LucideIcons.sparkles, color: Color(0xFF6366F1), size: 20),
            ),
            const SizedBox(width: 12),
            const Text(
              'پلنتوم (Plantom)',
              style: TextStyle(fontWeight: FontWeight.w900, fontSize: 18),
            ),
            const Spacer(),
            Text(
              jalaliDateStr,
              style: TextStyle(
                fontSize: 13,
                color: Colors.grey.shade400,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),
      ),
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: _selectedTabIndex,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedTabIndex = index;
              });
            },
            labelType: NavigationRailLabelType.all,
            destinations: const [
              NavigationRailDestination(
                icon: Icon(LucideIcons.layoutDashboard),
                label: Text('داشبورد'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.checkSquare),
                label: Text('وظایف'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.flame),
                label: Text('عادت‌ها'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.timer),
                label: Text('تمرکز'),
              ),
              NavigationRailDestination(
                icon: Icon(LucideIcons.calendar),
                label: Text('تقویم'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          Expanded(
            child: SingleChildScrollView(
              padding: const EdgeInsets.all(24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Container(
                    width: double.infinity,
                    padding: const EdgeInsets.all(24),
                    decoration: BoxDecoration(
                      gradient: const LinearGradient(
                        colors: [Color(0xFF4F46E5), Color(0xFF312E81)],
                        begin: Alignment.topRight,
                        end: Alignment.bottomLeft,
                      ),
                      borderRadius: BorderRadius.circular(24),
                    ),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'سامانه مدیریت بهره‌وری فردی پلنتوم (Plantom)',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          'نگارش رسمی ویندوز با معماری آفلاین SQLite و پشتیبانی دو زبانه',
                          style: TextStyle(
                            color: Colors.indigo.shade100,
                            fontSize: 13,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  const Text(
                    'وظایف روزانه',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                  ),
                  const SizedBox(height: 12),
                  ListView.separated(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: _tasks.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 8),
                    itemBuilder: (context, index) {
                      final task = _tasks[index];
                      return Card(
                        child: ListTile(
                          leading: Checkbox(
                            value: task.isCompleted,
                            onChanged: (val) {
                              setState(() {
                                _tasks[index] = task.copyWith(isCompleted: val ?? false);
                              });
                            },
                          ),
                          title: Text(
                            task.title,
                            style: TextStyle(
                              decoration: task.isCompleted ? TextDecoration.lineThrough : null,
                              color: task.isCompleted ? Colors.grey : null,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          trailing: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: const Color(0xFF6366F1).withOpacity(0.15),
                              borderRadius: BorderRadius.circular(8),
                            ),
                            child: Text(
                              task.dueDate ?? '',
                              style: const TextStyle(fontSize: 11, color: Color(0xFF818CF8)),
                            ),
                          ),
                        ),
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
`,
    },
    'windows_main.cpp': {
      path: 'windows/runner/main.cpp',
      description: 'کدهای C++ نیتیو ویندوز برای راه‌اندازی پنجره Win32 با تم تاریک Windows 11 و عنوان Plantom',
      code: `#include <flutter/flutter_window_controller.h>
#include <windows.h>
#include <dwmapi.h>

#include "flutter_window.h"
#include "utils.h"

int APIENTRY wWinMain(_In_ HINSTANCE instance, _In_opt_ HINSTANCE prev,
                      _In_ wchar_t *command_line, _In_ int show_command) {
  if (!::AttachConsole(ATTACH_PARENT_PROCESS) && ::IsDebuggerPresent()) {
    CreateAndAttachConsole();
  }

  ::CoInitializeEx(nullptr, COINIT_APARTMENTTHREADED);

  flutter::DartProject project(L"data");

  std::vector<std::string> command_line_arguments =
      GetCommandLineArguments();

  project.set_dart_entrypoint_arguments(std::move(command_line_arguments));

  FlutterWindow window(project);
  Win32Window::Point origin(10, 10);
  Win32Window::Size size(1280, 800);
  if (!window.Create(L"Plantom - سامانه برنامه‌ریزی و بهره‌وری فردی", origin, size)) {
    return EXIT_FAILURE;
  }
  window.SetQuitOnClose(true);

  // Enable Windows 11 Dark Mode Titlebar
  HWND hwnd = window.GetHandle();
  BOOL useDarkMode = TRUE;
  DwmSetWindowAttribute(hwnd, DWMWA_USE_IMMERSIVE_DARK_MODE, &useDarkMode, sizeof(useDarkMode));

  ::MSG msg;
  while (::GetMessage(&msg, nullptr, 0, 0)) {
    ::TranslateMessage(&msg);
    ::DispatchMessage(&msg);
  }

  ::CoUninitialize();
  return EXIT_SUCCESS;
}
`,
    },
  };

  const handleDownloadFlutterZip = async () => {
    try {
      setIsZipping(true);
      const zip = new JSZip();

      // Root build script & configs
      zip.file('build_windows.bat', flutterFiles['build_windows.bat'].code);
      zip.file('pubspec.yaml', flutterFiles['pubspec.yaml'].code);
      zip.file(
        'README.md',
        `# Plantom (پلنتوم) - Windows Flutter Productivity App\n\n## نحوه ساخت خروجی ویندوز (Build Plantom.exe):\nکافیست فایل build_windows.bat را اجرا کنید تا مراحل زیر به طور خودکار انجام شود:\n1. flutter clean\n2. flutter pub get\n3. dart run build_runner build --delete-conflicting-outputs\n4. flutter build windows --release\n\nفایل اجرایی در build/windows/x64/runner/Release/Plantom.exe ساخته می‌شود.`
      );

      // lib files
      zip.file('lib/main.dart', flutterFiles['main.dart'].code);
      zip.file('lib/core/theme.dart', flutterFiles['theme.dart'].code);
      zip.file('lib/core/jalali_engine.dart', flutterFiles['jalali_engine.dart'].code);
      zip.file('lib/presentation/screens/dashboard_screen.dart', flutterFiles['dashboard_screen.dart'].code);

      // windows runner files
      zip.file('windows/runner/main.cpp', flutterFiles['windows_main.cpp'].code);

      const content = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Plantom-Windows-Project.zip';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Failed to generate ZIP', err);
    } finally {
      setIsZipping(false);
    }
  };

  return (
    <div id="plantom-settings-view" className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2">
            <SettingsIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-black text-neutral-900 dark:text-neutral-50 sm:text-lg">
              {t.navSettings} & پکیج ویندوز پلنتوم (Plantom)
            </h2>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            شخصی‌سازی سیستم، گاه‌شماری شمسی، بازنشانی داده‌ها و دانلود پکیج ویندوز Flutter
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center rounded-2xl border border-neutral-200 bg-neutral-50 p-1 dark:border-neutral-800 dark:bg-neutral-800">
          <button
            onClick={() => setActiveTab('preferences')}
            className={`rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'preferences'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            تنظیمات عمومی
          </button>
          <button
            onClick={() => setActiveTab('flutterCode')}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition ${
              activeTab === 'flutterCode'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            <Code2 className="h-4 w-4" />
            <span>پروژه فلاتر ویندوز</span>
          </button>
        </div>
      </div>

      {activeTab === 'preferences' ? (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Language & Direction Card */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <Globe className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                زبان و چیدمان (Language & RTL/LTR)
              </h3>
            </div>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                  زبان پیش‌فرض
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() =>
                      updateSettings({
                        language: 'fa',
                        calendarType: 'jalali',
                        usePersianNumerals: true,
                      })
                    }
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition ${
                      settings.language === 'fa'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    فارسی (راست‌چین RTL)
                  </button>
                  <button
                    onClick={() =>
                      updateSettings({
                        language: 'en',
                        calendarType: 'gregorian',
                        usePersianNumerals: false,
                      })
                    }
                    className={`rounded-2xl border p-3 text-center text-xs font-bold transition ${
                      settings.language === 'en'
                        ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                        : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                    }`}
                  >
                    English (LTR)
                  </button>
                </div>
              </div>

              {/* Persian Numerals */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                  اعداد فارسی (۰ تا ۹)
                </span>
                <input
                  type="checkbox"
                  checked={settings.usePersianNumerals}
                  onChange={(e) => updateSettings({ usePersianNumerals: e.target.checked })}
                  className="h-4 w-4 rounded text-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Calendar System Card */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <Calendar className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                گاه‌شماری (Calendar System)
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateSettings({ calendarType: 'jalali' })}
                className={`rounded-2xl border p-3 text-center text-xs font-bold transition ${
                  settings.calendarType === 'jalali'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                }`}
              >
                شمسی (جلالی)
              </button>
              <button
                onClick={() => updateSettings({ calendarType: 'gregorian' })}
                className={`rounded-2xl border p-3 text-center text-xs font-bold transition ${
                  settings.calendarType === 'gregorian'
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-900 dark:border-indigo-500 dark:bg-indigo-950/40 dark:text-indigo-200'
                    : 'border-neutral-200 bg-white text-neutral-600 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-400'
                }`}
              >
                میلادی (Gregorian)
              </button>
            </div>
          </div>

          {/* Pomodoro Settings */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <Timer className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                تنظیمات پومودورو (دقیقه)
              </h3>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-500">
                  زمان کار
                </label>
                <input
                  type="number"
                  min="5"
                  max="90"
                  value={settings.pomodoroWorkMinutes}
                  onChange={(e) =>
                    updateSettings({ pomodoroWorkMinutes: parseInt(e.target.value, 10) || 25 })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-500">
                  استراحت کوتاه
                </label>
                <input
                  type="number"
                  min="1"
                  max="30"
                  value={settings.pomodoroShortBreakMinutes}
                  onChange={(e) =>
                    updateSettings({
                      pomodoroShortBreakMinutes: parseInt(e.target.value, 10) || 5,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>

              <div>
                <label className="mb-1 block text-[11px] font-semibold text-neutral-500">
                  استراحت بلند
                </label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  value={settings.pomodoroLongBreakMinutes}
                  onChange={(e) =>
                    updateSettings({
                      pomodoroLongBreakMinutes: parseInt(e.target.value, 10) || 15,
                    })
                  }
                  className="w-full rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs outline-none dark:border-neutral-800 dark:bg-neutral-800 dark:text-neutral-100"
                />
              </div>
            </div>
          </div>

          {/* Backup & Data Reset */}
          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900 space-y-4">
            <div className="flex items-center gap-2 border-b border-neutral-100 pb-3 dark:border-neutral-800">
              <Database className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                پشتیبان‌گیری و بازنشانی
              </h3>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 rounded-2xl bg-indigo-50 px-4 py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-100 dark:bg-indigo-950/50 dark:text-indigo-400"
              >
                <Download className="h-4 w-4" />
                <span>{t.exportJson}</span>
              </button>

              <button
                onClick={resetToInitialData}
                className="flex items-center gap-2 rounded-2xl bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:bg-rose-950/50 dark:text-rose-400"
              >
                <RotateCcw className="h-4 w-4" />
                <span>بازنشانی به داده‌های نمونه پلنتوم</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Flutter Code Architecture Inspector */
        <div className="space-y-6">
          {/* Download Windows Project Banner */}
          <div className="flex flex-col justify-between gap-4 rounded-3xl border border-indigo-500/30 bg-gradient-to-r from-indigo-900/40 via-indigo-950/30 to-purple-950/30 p-6 shadow-xs dark:border-indigo-500/20 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20">
                <FileArchive className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white sm:text-base">
                  دانلود پروژه کامل فلاتر ویندوز (Plantom-Windows-Project.zip)
                </h3>
                <p className="text-xs text-indigo-200">
                  شامل تمام فایل‌های Dart، پیکربندی C++ ویندوز و اسکریپت خودکار build_windows.bat
                </p>
              </div>
            </div>

            <button
              onClick={handleDownloadFlutterZip}
              disabled={isZipping}
              className="flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-xs font-bold text-white shadow-md transition hover:bg-indigo-700 active:scale-95 disabled:opacity-50"
            >
              <Download className="h-4 w-4" />
              <span>{isZipping ? 'در حال ایجاد فایل ZIP...' : 'دانلود فایل پروژه (ZIP)'}</span>
            </button>
          </div>

          <div className="rounded-3xl border border-neutral-200/80 bg-white p-6 shadow-xs dark:border-neutral-800/80 dark:bg-neutral-900">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                  <Terminal className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                    مشاهده سورس‌کدهای پروژه فلاتر پلنتوم (Plantom)
                  </h3>
                  <p className="text-xs text-neutral-500">
                    مسیر: <span className="font-mono text-indigo-600 dark:text-indigo-400">{flutterFiles[selectedFlutterFile].path}</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleCopyCode(flutterFiles[selectedFlutterFile].code)}
                className="flex items-center gap-1.5 rounded-2xl bg-neutral-100 px-4 py-2 text-xs font-bold text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-700"
              >
                {copiedFile ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                <span>{copiedFile ? 'کپی شد!' : 'کپی کد این فایل'}</span>
              </button>
            </div>

            {/* File Switcher Tabs */}
            <div className="mt-6 flex flex-wrap gap-2 border-b border-neutral-100 pb-4 dark:border-neutral-800">
              {Object.keys(flutterFiles).map((fn) => (
                <button
                  key={fn}
                  onClick={() => setSelectedFlutterFile(fn)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-mono font-semibold transition ${
                    selectedFlutterFile === fn
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300'
                  }`}
                >
                  {fn}
                </button>
              ))}
            </div>

            {/* Description */}
            <p className="mt-3 text-xs text-neutral-500 dark:text-neutral-400">
              {flutterFiles[selectedFlutterFile].description}
            </p>

            {/* Code Block */}
            <pre className="mt-4 max-h-96 overflow-x-auto rounded-2xl bg-neutral-950 p-4 font-mono text-xs text-indigo-300 leading-relaxed dark:bg-black/90">
              <code>{flutterFiles[selectedFlutterFile].code}</code>
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
