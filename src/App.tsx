import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AppHeader } from './components/layout/AppHeader';
import { AppSidebar } from './components/layout/AppSidebar';
import { BottomNav } from './components/layout/BottomNav';
import { CommandPalette } from './components/layout/CommandPalette';
import { QuickAddModal } from './components/layout/QuickAddModal';
import { NotificationDrawer } from './components/layout/NotificationDrawer';

// Feature Views
import { DashboardView } from './components/views/DashboardView';
import { TodayView } from './components/views/TodayView';
import { CalendarView } from './components/views/CalendarView';
import { TasksView } from './components/views/TasksView';
import { ProjectsView } from './components/views/ProjectsView';
import { GoalsView } from './components/views/GoalsView';
import { HabitsView } from './components/views/HabitsView';
import { NotesView } from './components/views/NotesView';
import { FocusView } from './components/views/FocusView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';

const MainContent: React.FC = () => {
  const { activeSection, isSidebarCollapsed, settings } = useApp();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRtl = settings.language === 'fa';

  const renderActiveView = () => {
    switch (activeSection) {
      case 'dashboard':
        return <DashboardView />;
      case 'today':
        return <TodayView />;
      case 'calendar':
        return <CalendarView />;
      case 'tasks':
        return <TasksView />;
      case 'projects':
        return <ProjectsView />;
      case 'goals':
        return <GoalsView />;
      case 'habits':
        return <HabitsView />;
      case 'notes':
        return <NotesView />;
      case 'focus':
        return <FocusView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-neutral-100/60 font-sans text-neutral-900 transition-colors dark:bg-neutral-950 dark:text-neutral-100">
      {/* Sidebar Navigation */}
      <AppSidebar
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main App Container */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          isRtl
            ? isSidebarCollapsed
              ? 'lg:mr-20'
              : 'lg:mr-64'
            : isSidebarCollapsed
            ? 'lg:ml-20'
            : 'lg:ml-64'
        }`}
      >
        {/* Top Sticky Header */}
        <AppHeader onOpenMobileMenu={() => setIsMobileMenuOpen(true)} />

        {/* Dynamic Page View Body */}
        <main className="flex-1 px-4 py-6 pb-24 sm:px-6 sm:py-8 lg:pb-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>

      {/* Global Modals and Overlay Panels */}
      <CommandPalette />
      <QuickAddModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
