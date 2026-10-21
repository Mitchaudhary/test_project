/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AttendanceProvider, useAttendance } from './context/AttendanceContext';
import { Sidebar, ActiveNavTab } from './components/layout/Sidebar';
import { Topbar } from './components/layout/Topbar';
import { AcademicDashboardView } from './components/dashboard/AcademicDashboardView';
import { LJTimetableManager } from './components/timetable/LJTimetableManager';
import { AttendanceSessionView } from './components/attendance/AttendanceSessionView';
import { GranularSyllabusTracker } from './components/syllabus/GranularSyllabusTracker';
import { DefaulterAuditView } from './components/defaulters/DefaulterAuditView';
import { FacultyLeaveManager } from './components/leaves/FacultyLeaveManager';
import { AcademicCalendarView } from './components/calendar/AcademicCalendarView';
import { FacultyLectureRadar } from './components/faculty/FacultyLectureRadar';
import { LoginPage } from './components/auth/LoginPage';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { GraduationCap, ShieldCheck, BookOpen, Clock } from 'lucide-react';

function LJUErpApp() {
  const { currentUser, isAuthenticated } = useAttendance();
  const [activeTab, setActiveTab] = useState<ActiveNavTab>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Topbar */}
        <Topbar
          onNavigateTab={setActiveTab}
        />

        {/* Tab Views Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {activeTab === 'dashboard' && (
            <AcademicDashboardView
              onNavigateTab={setActiveTab}
            />
          )}

          {activeTab === 'faculty_radar' && (
            <FacultyLectureRadar
              onNavigateToSyllabus={() => setActiveTab('syllabus')}
            />
          )}

          {activeTab === 'timetable' && (
            <LJTimetableManager
              isEditable={currentUser.role !== 'STUDENT'}
            />
          )}

          {activeTab === 'calendar' && (
            <AcademicCalendarView
              onNavigateToTimetable={(day) => {
                setActiveTab('timetable');
              }}
            />
          )}

          {activeTab === 'attendance' && (
            <AttendanceSessionView />
          )}

          {activeTab === 'syllabus' && (
            <GranularSyllabusTracker
              isEditable={currentUser.role !== 'STUDENT'}
            />
          )}

          {activeTab === 'defaulters' && (
            <DefaulterAuditView />
          )}

          {activeTab === 'leaves' && (
            <FacultyLeaveManager />
          )}
        </main>

        {/* Footer */}
        <footer className="border-t border-slate-200 bg-white py-4 px-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              <span className="font-bold text-slate-700">Lok Jagruti Kendra University (LJU) Ahmedabad</span>
              <span className="text-slate-400">• Academic, Timetable & Attendance ERP System</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span className="flex items-center gap-1 text-slate-600">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                75% Debarment Ordinance Active
              </span>
              <span className="flex items-center gap-1 text-slate-600">
                <Clock className="w-3.5 h-3.5 text-indigo-600" />
                09:00 AM - 01:00 PM Timetable Standard
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AttendanceProvider>
        <LJUErpApp />
      </AttendanceProvider>
    </ErrorBoundary>
  );
}
