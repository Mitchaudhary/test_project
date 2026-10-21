import React, { useState } from 'react';
import { 
  Calendar, 
  CalendarDays, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  PartyPopper, 
  Coffee, 
  ShieldCheck, 
  GraduationCap, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2,
  BookOpen,
  CalendarCheck
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { AcademicHoliday } from '../../types/attendance';

interface AcademicCalendarViewProps {
  onNavigateToTimetable?: (day: string) => void;
}

export const AcademicCalendarView: React.FC<AcademicCalendarViewProps> = ({
  onNavigateToTimetable
}) => {
  const { 
    holidays, 
    addHoliday, 
    deleteHoliday, 
    semesterConfig, 
    currentUser,
    weeks,
    selectedWeek,
    setSelectedWeek
  } = useAttendance();

  const [activeMonth, setActiveMonth] = useState<number>(9); // 0-indexed: 9 = October 2026, 8 = Sept, 7 = August
  const [filterType, setFilterType] = useState<'all' | 'gazetted' | 'university_holiday' | 'vacation'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New holiday form
  const [newHolName, setNewHolName] = useState('');
  const [newHolDate, setNewHolDate] = useState('2026-10-25');
  const [newHolType, setNewHolType] = useState<'gazetted' | 'university_holiday' | 'vacation'>('university_holiday');
  const [newHolDesc, setNewHolDesc] = useState('Declared University Academic Recess');

  const months = [
    { index: 6, name: 'July 2026', daysInMonth: 31, startDayOfWeek: 3, year: 2026 }, // Wed
    { index: 7, name: 'August 2026', daysInMonth: 31, startDayOfWeek: 6, year: 2026 }, // Sat
    { index: 8, name: 'September 2026', daysInMonth: 30, startDayOfWeek: 2, year: 2026 }, // Tue
    { index: 9, name: 'October 2026', daysInMonth: 31, startDayOfWeek: 4, year: 2026 }, // Thu
    { index: 10, name: 'November 2026', daysInMonth: 30, startDayOfWeek: 0, year: 2026 }, // Sun
  ];

  const currentMonthData = months.find(m => m.index === activeMonth) || months[3];

  const filteredHolidays = holidays.filter(h => {
    if (filterType === 'all') return true;
    return h.type === filterType;
  });

  const handleCreateHoliday = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHolName.trim()) return;

    const dateObj = new Date(newHolDate);
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
    const dayOfWeek = dayNames[dateObj.getDay()];

    addHoliday({
      date: newHolDate,
      dayOfWeek,
      name: newHolName,
      type: newHolType,
      description: newHolDesc,
    });

    setIsAddModalOpen(false);
    setNewHolName('');
  };

  // Helper to format date string
  const getPaddedDateString = (year: number, monthZeroIndexed: number, day: number) => {
    const mm = String(monthZeroIndexed + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: 4-Month Semester Term Overview */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <CalendarDays className="w-3.5 h-3.5 text-indigo-400" />
                {semesterConfig.semesterName}
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                UGC Minimum 90 Instructional Days Validated
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              Academic Term & Holiday Schedule (3-4 Months Semester Architecture)
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Timetable operates on a 6-day academic cycle (Monday to Saturday, 09:00 AM - 03:00 PM). Sundays and gazetted public holidays automatically deactivate lecture broadcasts and reschedule syllabus pacing.
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-indigo-400">16</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Term Weeks</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-emerald-400">{semesterConfig.totalTeachingDays}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Teaching Days</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-amber-400">{holidays.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Holidays & Breaks</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-xl font-black text-rose-400">Sunday</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">Weekly Off</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Interactive Calendar & Holiday List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Month Calendar */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-6">
          {/* Month Selector Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                {currentMonthData.name} Academic Schedule
              </h3>
            </div>

            <div className="flex items-center gap-1.5 flex-wrap">
              {months.map(m => (
                <button
                  key={m.index}
                  onClick={() => setActiveMonth(m.index)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeMonth === m.index
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {m.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>

          {/* Calendar Grid (Sun to Sat) */}
          <div>
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <span className="text-rose-500">Sun (Off)</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span className="text-indigo-600">Sat</span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Empty leading padding days */}
              {Array.from({ length: currentMonthData.startDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="min-h-[85px] bg-slate-50/50 rounded-2xl border border-dashed border-slate-100" />
              ))}

              {/* Month Days */}
              {Array.from({ length: currentMonthData.daysInMonth }).map((_, i) => {
                const dayNum = i + 1;
                const dateStr = getPaddedDateString(currentMonthData.year, currentMonthData.index, dayNum);
                const dayIndex = (currentMonthData.startDayOfWeek + i) % 7;
                const isSunday = dayIndex === 0;
                const isSaturday = dayIndex === 6;

                // Check if this date has a registered holiday
                const dayHoliday = holidays.find(h => h.date === dateStr);
                const isMidSemExam = dateStr >= '2026-09-21' && dateStr <= '2026-09-28';
                const isEndSemExam = dateStr >= '2026-11-16' && dateStr <= '2026-11-28';

                return (
                  <div
                    key={dateStr}
                    className={`min-h-[85px] p-2 rounded-2xl border flex flex-col justify-between transition-all group ${
                      isSunday
                        ? 'bg-rose-50/40 border-rose-100 text-slate-400'
                        : dayHoliday
                        ? 'bg-amber-50 border-amber-200 shadow-xs'
                        : isMidSemExam || isEndSemExam
                        ? 'bg-purple-50/60 border-purple-200'
                        : 'bg-white hover:bg-indigo-50/40 border-slate-200 hover:border-indigo-300 cursor-pointer'
                    }`}
                    onClick={() => {
                      if (!isSunday && !dayHoliday && onNavigateToTimetable) {
                        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                        onNavigateToTimetable(dayNames[dayIndex]);
                      }
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-black ${
                        isSunday ? 'text-rose-500' : dayHoliday ? 'text-amber-800' : 'text-slate-800'
                      }`}>
                        {dayNum}
                      </span>
                      {isSunday && (
                        <span className="text-[9px] font-bold text-rose-500 bg-rose-100 px-1 rounded">
                          OFF
                        </span>
                      )}
                      {dayHoliday && (
                        <span className="text-[9px] font-bold text-amber-700 bg-amber-200/70 px-1 rounded truncate max-w-[60px]">
                          Holiday
                        </span>
                      )}
                    </div>

                    {/* Day Content */}
                    <div className="mt-1">
                      {isSunday ? (
                        <p className="text-[10px] text-rose-400/80 font-medium leading-tight">
                          Sunday Recess
                        </p>
                      ) : dayHoliday ? (
                        <p className="text-[10px] text-amber-900 font-bold leading-tight line-clamp-2">
                          {dayHoliday.name}
                        </p>
                      ) : isMidSemExam ? (
                        <p className="text-[10px] text-purple-700 font-bold leading-tight">
                          Mid-Sem Exam
                        </p>
                      ) : isEndSemExam ? (
                        <p className="text-[10px] text-indigo-700 font-bold leading-tight">
                          End-Sem Exam
                        </p>
                      ) : (
                        <div className="space-y-0.5">
                          <p className="text-[10px] text-slate-500 font-medium">
                            {isSaturday ? '3 LJU Slots' : '4 LJU Slots'}
                          </p>
                          <span className="text-[9px] text-indigo-600 font-bold group-hover:underline">
                            09:00 - 03:00
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Calendar Legend */}
          <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-white border border-slate-300"></span>
              Regular Instructional Day (4 Lectures / Lab)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-amber-100 border border-amber-300"></span>
              University & Gazetted Holiday
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-rose-100 border border-rose-300"></span>
              Sunday (Weekly Non-Working)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-md bg-purple-100 border border-purple-300"></span>
              Examination Assessment Window
            </span>
          </div>
        </div>

        {/* Right 1 Col: Gazetted Holiday Directory & Admin Actions */}
        <div className="space-y-6">
          {/* Header & Filter Card */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">
                  LJU University Holiday Matrix
                </h3>
                <p className="text-xs text-slate-500">
                  {holidays.length} official holidays recognized for term
                </p>
              </div>

              {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HOD') && (
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Declare</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 flex-wrap">
              {(['all', 'gazetted', 'university_holiday', 'vacation'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setFilterType(t)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                    filterType === t 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
                  }`}
                >
                  {t === 'all' ? 'All' : t.replace('_', ' ')}
                </button>
              ))}
            </div>

            {/* Holiday Scrollable List */}
            <div className="space-y-2.5 max-h-[460px] overflow-y-auto pr-1">
              {filteredHolidays.map(h => (
                <div
                  key={h.id}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/40 border border-slate-200 hover:border-indigo-200 transition-all flex items-start justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {h.name}
                      </span>
                      <span className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded border ${
                        h.type === 'gazetted' 
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : h.type === 'vacation'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-indigo-50 text-indigo-700 border-indigo-200'
                      }`}>
                        {h.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-slate-500 font-mono">
                      <span>{new Date(h.date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>•</span>
                      <span className="font-semibold text-slate-700">{h.dayOfWeek}</span>
                    </div>

                    {h.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2">
                        {h.description}
                      </p>
                    )}
                  </div>

                  {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HOD') && (
                    <button
                      onClick={() => deleteHoliday(h.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove holiday"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Academic Regulations Note */}
          <div className="bg-slate-900 text-slate-300 p-5 rounded-3xl border border-slate-800 text-xs space-y-3">
            <div className="flex items-center gap-2 text-white font-bold">
              <GraduationCap className="w-4 h-4 text-indigo-400" />
              <span>Gujarat Private Universities Act Compliance</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Academic regulations require every semester to maintain at least 90 instructional teaching days. In case of unexpected weather alerts, lost slots are automatically compensated in Week 12 &amp; 13 via extended lab hours.
            </p>
          </div>
        </div>
      </div>

      {/* Add Custom Holiday Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-5 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h4 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <PartyPopper className="w-5 h-5 text-indigo-600" />
                Declare University Holiday
              </h4>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 text-sm font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateHoliday} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Holiday / Occasion Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sardar Patel Jayanti / Tech Fest Recess"
                  value={newHolName}
                  onChange={(e) => setNewHolName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newHolDate}
                    onChange={(e) => setNewHolDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-indigo-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Classification
                  </label>
                  <select
                    value={newHolType}
                    onChange={(e) => setNewHolType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-indigo-600 bg-white"
                  >
                    <option value="gazetted">Gazetted State/National</option>
                    <option value="university_holiday">University Fest / Foundation</option>
                    <option value="vacation">Vacation Break</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Description / Notice Note
                </label>
                <textarea
                  rows={2}
                  value={newHolDesc}
                  onChange={(e) => setNewHolDesc(e.target.value)}
                  placeholder="Circular reference or compensatory plan details..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 text-xs text-slate-900 outline-none focus:border-indigo-600"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer"
                >
                  Confirm &amp; Update Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
