import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  QrCode, 
  Calendar, 
  Clock, 
  ChevronDown, 
  Check, 
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building2,
  GraduationCap
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';

interface TopbarProps {
  onNavigateTab?: (tab: any) => void;
}

export const Topbar: React.FC<TopbarProps> = ({ onNavigateTab }) => {
  const { 
    currentUser, 
    switchUser, 
    availableUsers, 
    selectedWeek,
    currentProgram,
    selectedYear,
    selectedSemester,
    logout
  } = useAttendance();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90 h-16 px-6 flex items-center justify-between gap-4">
      {/* Left: Academic Cohort Context */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="font-extrabold text-slate-900 text-sm tracking-tight hidden sm:inline">
            LJ University ERP
          </span>
          <span className="text-slate-300 hidden sm:inline">/</span>
          {currentUser.role === 'STUDENT' ? (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              {currentUser.programName || `${currentProgram.code} Yr ${selectedYear}`}
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              Faculty Academic Portal
            </span>
          )}
        </div>

        <span className="text-xs text-slate-400 font-mono hidden md:inline">
          Academic Week {selectedWeek} (Oct 19 - Oct 24, 2026)
        </span>
      </div>

      {/* Right Actions: User Profile */}
      <div className="flex items-center gap-2.5">

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 transition-all cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 rounded-lg object-cover border border-slate-200"
            />
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-800 leading-tight">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 capitalize">
                {currentUser.role}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Switch Role / Persona
                </span>
              </div>

              <div className="p-1 space-y-1">
                {availableUsers.map(user => {
                  const isSelected = user.id === currentUser.id;
                  return (
                    <button
                      key={user.id}
                      onClick={() => {
                        switchUser(user.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl text-xs text-left transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50 text-indigo-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-7 h-7 rounded-lg object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-900 leading-tight">{user.name}</div>
                          <div className="text-[10px] text-slate-500">{user.role} {user.rollNumber ? `• ${user.rollNumber}` : ''}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              <div className="p-2 border-t border-slate-100 mt-1">
                <button
                  onClick={() => {
                    logout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Sign Out to Login Gateway</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Quick Sign Out Button */}
        <button
          onClick={logout}
          title="Sign Out / Switch Portal"
          className="p-2 rounded-xl text-slate-500 hover:text-rose-600 hover:bg-rose-50 border border-slate-200 transition-all cursor-pointer hidden sm:flex items-center gap-1.5 text-xs font-semibold"
        >
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  );
};
