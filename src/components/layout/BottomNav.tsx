import React from 'react';
import { useApp } from '../../context/AppContext';
import { NavSection } from '../../types';
import {
  LayoutDashboard,
  CalendarCheck,
  Calendar,
  CheckSquare,
  Plus,
} from 'lucide-react';

export const BottomNav: React.FC = () => {
  const { activeSection, setActiveSection, setIsQuickAddOpen, t } = useApp();

  const items: { id: NavSection; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'dashboard', label: t.navDashboard, icon: LayoutDashboard },
    { id: 'today', label: t.navToday, icon: CalendarCheck },
    { id: 'calendar', label: t.navCalendar, icon: Calendar },
    { id: 'tasks', label: t.navTasks, icon: CheckSquare },
  ];

  return (
    <nav
      id="plantom-bottom-nav"
      className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-neutral-200/80 bg-white/90 px-4 backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-900/90 lg:hidden"
    >
      {items.slice(0, 2).map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] font-semibold transition ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        );
      })}

      {/* Center Quick Add Button */}
      <div className="flex flex-1 items-center justify-center">
        <button
          id="bottom-nav-quick-add"
          onClick={() => setIsQuickAddOpen(true)}
          aria-label="Quick Add"
          className="-mt-5 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 transition hover:bg-indigo-700 active:scale-95 dark:bg-indigo-500"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {items.slice(2, 4).map((item) => {
        const Icon = item.icon;
        const isActive = activeSection === item.id;
        return (
          <button
            key={item.id}
            id={`bottom-nav-${item.id}`}
            onClick={() => setActiveSection(item.id)}
            className={`flex flex-1 flex-col items-center justify-center gap-1 py-1 text-[10px] font-semibold transition ${
              isActive
                ? 'text-indigo-600 dark:text-indigo-400'
                : 'text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};
