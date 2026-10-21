import React from 'react';
import { 
  GraduationCap, 
  LayoutDashboard, 
  Calendar, 
  QrCode, 
  BookOpen, 
  AlertTriangle, 
  Coffee, 
  RotateCcw,
  Sparkles,
  UserCheck,
  Building2,
  ChevronRight,
  ShieldCheck,
  CalendarDays,
  Clock,
  LogOut
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { UserRole } from '../../types/attendance';

export type ActiveNavTab = 
  | 'dashboard' 
  | 'faculty_radar' 
  | 'timetable' 
  | 'calendar' 
  | 'attendance' 
  | 'syllabus' 
  | 'defaulters' 
  | 'leaves';

interface SidebarProps {
  activeTab: ActiveNavTab;
  onSelectTab: (tab: ActiveNavTab) => void;
  onOpenLiveModal?: () => void;
  onOpenScannerModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  onOpenLiveModal,
  onOpenScannerModal,
}) => {
  const { 
    currentUser, 
    logout,
    getAtRiskDefaulters,
  } = useAttendance();

  const defaulters = getAtRiskDefaulters(75);

  const isStudent = currentUser.role === 'STUDENT';

  const allNavItems: { id: ActiveNavTab; label: string; icon: React.ReactNode; badge?: string | number; badgeColor?: string; roles?: string[] }[] = [
    { id: 'dashboard', label: isStudent ? 'Student Dashboard' : 'Academic Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'faculty_radar', label: "Faculty Today's Lectures", icon: <Clock className="w-4 h-4" />, roles: ['FACULTY', 'HOD', 'SUPER_ADMIN'] },
    { id: 'attendance', label: isStudent ? 'My Attendance Record' : 'Attendance & Roll Call', icon: <UserCheck className="w-4 h-4" /> },
    { id: 'timetable', label: isStudent ? 'Semester Timetable' : 'Master Timetable', icon: <Calendar className="w-4 h-4" /> },
    { id: 'calendar', label: 'Academic Term & Holidays', icon: <CalendarDays className="w-4 h-4" /> },
    { id: 'syllabus', label: 'Micro-Topic Syllabus', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'defaulters', label: 'Defaulters & Risk (<75%)', icon: <AlertTriangle className="w-4 h-4" />, badge: defaulters.length > 0 ? defaulters.length : undefined, badgeColor: 'bg-rose-500 text-white', roles: ['FACULTY', 'HOD', 'SUPER_ADMIN'] },
    { id: 'leaves', label: 'Faculty Leaves & Subs', icon: <Coffee className="w-4 h-4" />, roles: ['FACULTY', 'HOD', 'SUPER_ADMIN'] },
  ];

  const navItems = allNavItems.filter(item => !item.roles || item.roles.includes(currentUser.role));

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800 select-none min-h-screen">
      {/* Brand Header */}
      <div className="p-5 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-900/40">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-white text-base tracking-tight">
                LJ University
              </span>
              <span className="text-[9px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-1.5 py-0.2 rounded border border-indigo-500/30">
                ERP
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">
              Academic & Timetable Portal
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-3 space-y-1 flex-1">
        <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          Core Modules
        </div>

        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-900/50'
                  : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${item.badgeColor || 'bg-slate-800 text-slate-300'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* User Profile & Sign Out Footer */}
      <div className="p-3.5 border-t border-slate-800 bg-slate-950/60 space-y-3">
        <div className="p-2.5 bg-slate-800/60 rounded-xl border border-slate-800 flex items-center gap-2.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-9 h-9 rounded-lg object-cover border border-slate-700 shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="text-xs font-bold text-white truncate">
              {currentUser.name}
            </div>
            <div className="text-[10px] text-slate-400 truncate">
              {currentUser.role === 'SUPER_ADMIN' 
                ? 'Super Admin (Dean)' 
                : currentUser.role === 'HOD' 
                ? 'Head of Department' 
                : currentUser.role === 'FACULTY' 
                ? (currentUser.designation || 'Faculty') 
                : `${currentUser.programName || 'Student'} • ${currentUser.rollNumber || ''}`}
            </div>
          </div>
        </div>

        <button
          onClick={logout}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800 hover:bg-rose-950/60 text-slate-300 hover:text-rose-300 border border-slate-750 hover:border-rose-900/50 text-xs font-semibold transition-all cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out / Switch Portal</span>
        </button>
      </div>
    </aside>
  );
};
