import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  CheckSquare,
  FolderKanban,
  Target,
  Flame,
  FileText,
  Timer,
  Settings,
  Plus,
  X,
  ArrowRight,
} from 'lucide-react';
import { NavSection } from '../../types';

export const CommandPalette: React.FC = () => {
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    tasks,
    projects,
    goals,
    habits,
    notes,
    setActiveSection,
    setIsQuickAddOpen,
    t,
  } = useApp();

  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isCommandPaletteOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isCommandPaletteOpen]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    const results: {
      id: string;
      title: string;
      subtitle?: string;
      category: 'task' | 'project' | 'goal' | 'habit' | 'note' | 'action';
      icon: React.ComponentType<{ className?: string }>;
      action: () => void;
    }[] = [];

    // Quick Actions
    results.push({
      id: 'action-quick-add',
      title: t.quickAdd,
      subtitle: 'Create a new task, project, event or note',
      category: 'action',
      icon: Plus,
      action: () => {
        setIsCommandPaletteOpen(false);
        setIsQuickAddOpen(true);
      },
    });

    results.push({
      id: 'action-start-focus',
      title: t.startFocus,
      subtitle: 'Launch Pomodoro deep work timer',
      category: 'action',
      icon: Timer,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveSection('focus');
      },
    });

    results.push({
      id: 'action-settings',
      title: t.navSettings,
      subtitle: 'Customize theme, language, and calendar',
      category: 'action',
      icon: Settings,
      action: () => {
        setIsCommandPaletteOpen(false);
        setActiveSection('settings');
      },
    });

    if (!q) return results;

    // Search Tasks
    tasks.forEach((task) => {
      if (task.title.toLowerCase().includes(q) || task.description?.toLowerCase().includes(q)) {
        results.push({
          id: `task-${task.id}`,
          title: task.title,
          subtitle: `Task • Priority: ${task.priority} • Status: ${task.status}`,
          category: 'task',
          icon: CheckSquare,
          action: () => {
            setIsCommandPaletteOpen(false);
            setActiveSection('tasks');
          },
        });
      }
    });

    // Search Projects
    projects.forEach((proj) => {
      if (proj.name.toLowerCase().includes(q) || proj.description?.toLowerCase().includes(q)) {
        results.push({
          id: `proj-${proj.id}`,
          title: proj.name,
          subtitle: `Project • ${proj.sections.length} Sections • Status: ${proj.status}`,
          category: 'project',
          icon: FolderKanban,
          action: () => {
            setIsCommandPaletteOpen(false);
            setActiveSection('projects');
          },
        });
      }
    });

    // Search Goals
    goals.forEach((goal) => {
      if (goal.title.toLowerCase().includes(q) || goal.category.toLowerCase().includes(q)) {
        results.push({
          id: `goal-${goal.id}`,
          title: goal.title,
          subtitle: `Goal • ${goal.category} • Progress: ${goal.progressPercentage}%`,
          category: 'goal',
          icon: Target,
          action: () => {
            setIsCommandPaletteOpen(false);
            setActiveSection('goals');
          },
        });
      }
    });

    // Search Habits
    habits.forEach((habit) => {
      if (habit.name.toLowerCase().includes(q) || habit.description?.toLowerCase().includes(q)) {
        results.push({
          id: `habit-${habit.id}`,
          title: habit.name,
          subtitle: `Habit • Streak: ${habit.currentStreak} days`,
          category: 'habit',
          icon: Flame,
          action: () => {
            setIsCommandPaletteOpen(false);
            setActiveSection('habits');
          },
        });
      }
    });

    // Search Notes
    notes.forEach((note) => {
      if (note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q)) {
        results.push({
          id: `note-${note.id}`,
          title: note.title,
          subtitle: `Note • ${note.folder || 'General'}`,
          category: 'note',
          icon: FileText,
          action: () => {
            setIsCommandPaletteOpen(false);
            setActiveSection('notes');
          },
        });
      }
    });

    return results;
  }, [query, tasks, projects, goals, habits, notes, t, setActiveSection, setIsCommandPaletteOpen, setIsQuickAddOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % searchResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + searchResults.length) % searchResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (searchResults[selectedIndex]) {
        searchResults[selectedIndex].action();
      }
    } else if (e.key === 'Escape') {
      setIsCommandPaletteOpen(false);
    }
  };

  if (!isCommandPaletteOpen) return null;

  return (
    <div
      id="plantom-command-palette"
      className="fixed inset-0 z-50 flex items-start justify-center bg-neutral-900/60 p-4 pt-16 backdrop-blur-sm sm:pt-24"
      onClick={() => setIsCommandPaletteOpen(false)}
    >
      <div
        className="flex w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl transition-all dark:border-neutral-800 dark:bg-neutral-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <Search className="h-5 w-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder={t.searchPlaceholder}
            className="flex-1 bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {searchResults.length === 0 ? (
            <div className="py-8 text-center text-xs text-neutral-500 dark:text-neutral-400">
              موردی با این عبارت یافت نشد.
            </div>
          ) : (
            <div className="space-y-1">
              {searchResults.map((item, idx) => {
                const Icon = item.icon;
                const isSelected = idx === selectedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={item.action}
                    onMouseEnter={() => setSelectedIndex(idx)}
                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-start transition ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 dark:bg-indigo-950/50 dark:text-indigo-200'
                        : 'text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-semibold">{item.title}</div>
                        {item.subtitle && (
                          <div className="text-[10px] text-neutral-400 truncate">{item.subtitle}</div>
                        )}
                      </div>
                    </div>
                    {isSelected && (
                      <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400 rtl:rotate-180" />
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer shortcuts helper */}
        <div className="flex items-center justify-between border-t border-neutral-200 bg-neutral-50 px-4 py-2 text-[10px] text-neutral-500 dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-400">
          <div className="flex items-center gap-2">
            <span>↑↓ برای انتخاب</span>
            <span>•</span>
            <span>Enter برای تایید</span>
          </div>
          <div>ESC برای خروج</div>
        </div>
      </div>
    </div>
  );
};
