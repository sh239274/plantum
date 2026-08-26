import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  CheckSquare,
  FolderKanban,
  Target,
  Flame,
  FileText,
  Timer,
  BarChart3,
  Settings,
  Code2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';

interface AppSidebarProps {
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    activeSection,
    setActiveSection,
    t,
    tasks,
    projects,
    habits,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    settings,
  } = useApp();

  const isRtl = settings.language === 'fa';

  const pendingTasksCount = tasks.filter((t) => t.status !== 'completed' && t.status !== 'cancelled').length;
  const activeHabitsStreak = habits.reduce((acc, h) => acc + (h.currentStreak > 0 ? 1 : 0), 0);

  const navItems: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }>; badge?: string | number }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'today', label: t.navToday, icon: CalendarCheck },
    { id: 'calendar', label: t.navCalendar, icon: Calendar },
    { id: 'tasks', label: t.navTasks, icon: CheckSquare, badge: pendingTasksCount },
    { id: 'projects', label: t.navProjects, icon: FolderKanban, badge: projects.length },
    { id: 'goals', label: t.navGoals, icon: Target },
    { id: 'habits', label: t.navHabits, icon: Flame, badge: activeHabitsStreak > 0 ? `${activeHabitsStreak}🔥` : undefined },
    { id: 'notes', label: t.navNotes, icon: FileText },
    { id: 'focus', label: t.navFocus, icon: Timer },
    { id: 'analytics', label: t.navAnalytics, icon: BarChart3 },
    { id: 'settings', label: t.navSettings, icon: Settings },
  ];

  const handleSelect = (sec: NavSection) => {
    setActiveSection(sec);
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-neutral-900/60 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        id="plantom-app-sidebar"
        className={`fixed top-0 z-50 flex h-full flex-col border-neutral-200/80 bg-white transition-all duration-300 dark:border-neutral-800/80 dark:bg-neutral-900 ${
          isRtl ? 'right-0 border-l' : 'left-0 border-r'
        } ${
          isMobileOpen
            ? 'translate-x-0 w-64'
            : isRtl
            ? 'translate-x-full lg:translate-x-0'
            : '-translate-x-full lg:translate-x-0'
        } ${
          isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
        }`}
      >
        {/* Brand Header */}
        <div className="flex h-16 items-center justify-between px-4">
          <div
            onClick={() => handleSelect('dashboard')}
            className="flex cursor-pointer items-center gap-3 overflow-hidden"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            {!isSidebarCollapsed && (
              <div className="truncate">
                <span className="block text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                  {t.appName}
                </span>
                <span className="block text-[11px] text-neutral-500 dark:text-neutral-400">
                  Productivity System
                </span>
              </div>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            className="hidden h-7 w-7 items-center justify-center rounded-lg text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 lg:flex"
            title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isSidebarCollapsed ? (
              isRtl ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
            ) : (
              isRtl ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation List */}
        <div className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                id={`nav-item-${item.id}`}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400'
                    : 'text-neutral-600 hover:bg-neutral-100/80 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/60 dark:hover:text-neutral-100'
                }`}
                title={isSidebarCollapsed ? item.label : undefined}
              >
                <Icon
                  className={`h-4 w-4 shrink-0 transition-colors ${
                    isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-neutral-500 group-hover:text-neutral-900 dark:text-neutral-400 dark:group-hover:text-neutral-100'
                  }`}
                />
                {!isSidebarCollapsed && (
                  <>
                    <span className="flex-1 truncate text-start">{item.label}</span>
                    {item.badge !== undefined && (
                      <span
                        className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isActive
                            ? 'bg-indigo-200/60 text-indigo-800 dark:bg-indigo-900/60 dark:text-indigo-200'
                            : 'bg-neutral-200/60 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}

          {/* Flutter Architecture Code Viewer Section */}
          <div className="pt-4">
            <button
              id="nav-item-flutter-code"
              onClick={() => handleSelect('settings')}
              className="flex w-full items-center gap-3 rounded-xl border border-dashed border-indigo-300/80 bg-indigo-50/40 px-3 py-2 text-xs font-semibold text-indigo-600 transition hover:bg-indigo-100/50 dark:border-indigo-800/80 dark:bg-indigo-950/20 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
            >
              <Code2 className="h-4 w-4 shrink-0" />
              {!isSidebarCollapsed && (
                <span className="truncate text-start">{t.navFlutterCode}</span>
              )}
            </button>
          </div>
        </div>

        {/* User / Offline Status Footer */}
        <div className="border-t border-neutral-200/80 p-3 dark:border-neutral-800/80">
          <div className="flex items-center gap-3 rounded-xl bg-neutral-50 p-2 dark:bg-neutral-800/50">
            <div className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600 dark:bg-indigo-900 dark:text-indigo-300">
              Z
              <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-neutral-900" />
            </div>
            {!isSidebarCollapsed && (
              <div className="flex-1 truncate">
                <span className="block text-xs font-bold text-neutral-800 dark:text-neutral-200">
                  Local Workspace
                </span>
                <span className="block text-[10px] text-emerald-600 dark:text-emerald-400">
                  Offline-First (Active)
                </span>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
};
