import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  X,
  Bell,
  Clock,
  Flame,
  CheckCircle,
  AlertTriangle,
  Trash2,
} from 'lucide-react';

export const NotificationDrawer: React.FC = () => {
  const {
    isNotificationOpen,
    setIsNotificationOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    clearAllNotifications,
    setActiveSection,
    settings,
    t,
  } = useApp();

  if (!isNotificationOpen) return null;

  const isRtl = settings.language === 'fa';

  const handleNotificationClick = (item: (typeof notifications)[0]) => {
    markNotificationRead(item.id);
    if (item.targetSection) {
      setActiveSection(item.targetSection);
    }
    setIsNotificationOpen(false);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'deadline':
        return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'habit':
        return <Flame className="h-4 w-4 text-rose-500" />;
      case 'reminder':
        return <Clock className="h-4 w-4 text-indigo-500" />;
      default:
        return <Bell className="h-4 w-4 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-neutral-900/50 backdrop-blur-sm">
      <div className="absolute inset-0" onClick={() => setIsNotificationOpen(false)} />

      <div
        className={`absolute top-0 bottom-0 flex w-full max-w-md flex-col bg-white shadow-2xl transition-all dark:bg-neutral-900 ${
          isRtl ? 'left-0 border-r border-neutral-200 dark:border-neutral-800' : 'right-0 border-l border-neutral-200 dark:border-neutral-800'
        }`}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-200 px-4 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
              {t.notifications}
            </h2>
          </div>
          <button
            onClick={() => setIsNotificationOpen(false)}
            className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-2 text-xs dark:border-neutral-800/60">
          <button
            onClick={markAllNotificationsRead}
            className="flex items-center gap-1 font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
          >
            <CheckCircle className="h-3.5 w-3.5" />
            <span>{t.markAllRead}</span>
          </button>
          <button
            onClick={clearAllNotifications}
            className="flex items-center gap-1 font-semibold text-neutral-400 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>{t.clearAll}</span>
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center text-neutral-400">
              <Bell className="h-10 w-10 opacity-30 mb-2" />
              <p className="text-xs">{t.noNotifications}</p>
            </div>
          ) : (
            notifications.map((item) => (
              <div
                key={item.id}
                onClick={() => handleNotificationClick(item)}
                className={`cursor-pointer rounded-xl border p-3.5 transition ${
                  item.isRead
                    ? 'border-neutral-200/60 bg-neutral-50/50 opacity-75 dark:border-neutral-800/60 dark:bg-neutral-800/30'
                    : 'border-indigo-200 bg-indigo-50/40 shadow-sm dark:border-indigo-900/60 dark:bg-indigo-950/20'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 rounded-lg bg-white p-1.5 shadow-xs dark:bg-neutral-800">
                    {getIcon(item.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                        {item.title}
                      </h3>
                      {!item.isRead && (
                        <span className="h-2 w-2 rounded-full bg-indigo-600 dark:bg-indigo-400" />
                      )}
                    </div>
                    <p className="mt-1 text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
