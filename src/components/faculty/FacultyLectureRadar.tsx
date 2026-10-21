import React, { useState } from 'react';
import { 
  Clock, 
  MapPin, 
  User, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Layers, 
  Filter, 
  BookOpen, 
  Sparkles, 
  GraduationCap, 
  ChevronRight,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { DayOfWeek, TimetableSlot } from '../../types/attendance';
import { ALL_STUDENTS_ROSTER } from '../../data/mockData';

interface FacultyLectureRadarProps {
  onNavigateToSyllabus?: () => void;
}

export const FacultyLectureRadar: React.FC<FacultyLectureRadarProps> = ({
  onNavigateToSyllabus
}) => {
  const { 
    currentUser, 
    timetableSlots, 
    availableUsers, 
    switchUser,
    manualRollCallUpdate,
    attendanceRecords 
  } = useAttendance();

  // Selected faculty (defaults to current user if faculty, else first faculty member)
  const facultyUsers = availableUsers.filter(u => u.role === 'FACULTY');
  const defaultFacultyId = currentUser.role === 'FACULTY' ? currentUser.id : (facultyUsers[0]?.id || 'fac_amehta');
  const [selectedFacultyId, setSelectedFacultyId] = useState<string>(defaultFacultyId);

  // Day selector (Monday to Saturday)
  const currentDayIndex = new Date().getDay(); // 0 is Sunday, 1 is Monday...
  const dayNames: DayOfWeek[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const todayName = currentDayIndex === 0 ? 'Monday' : dayNames[currentDayIndex];
  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(todayName);

  // Semester filter
  const [semesterFilter, setSemesterFilter] = useState<string>('all');

  // Roll call modal state
  const [selectedSlotForRollCall, setSelectedSlotForRollCall] = useState<TimetableSlot | null>(null);
  const [rollCallStudents, setRollCallStudents] = useState<{ id: string; name: string; roll: string; status: 'PRESENT' | 'ABSENT' | 'LEAVE' }[]>([]);
  const [isRollCallSaved, setIsRollCallSaved] = useState(false);

  // The active faculty profile
  const activeFaculty = availableUsers.find(u => u.id === selectedFacultyId) || currentUser;

  // Filter all slots taught by this faculty on the selected day
  const facultyDaySlots = timetableSlots.filter(s => {
    const isTeacher = s.facultyId === selectedFacultyId || s.facultyName === activeFaculty.name;
    const isDay = s.day === selectedDay;
    return isTeacher && isDay;
  });

  // Apply semester filter
  const filteredSlots = facultyDaySlots.filter(s => {
    if (semesterFilter === 'all') return true;
    const semKey = `${s.programId}_sem${s.semester}`;
    return semKey === semesterFilter;
  });

  // Calculate distinct semesters taught today
  const distinctSemesters = Array.from(
    new Set(facultyDaySlots.map(s => `${s.programId.toUpperCase()} Sem ${s.semester}`))
  );

  // Calculate distinct rooms today
  const distinctRooms = Array.from(new Set(facultyDaySlots.map(s => s.roomOrLab)));

  // Open Roll Call sheet for a slot
  const handleOpenRollCall = (slot: TimetableSlot) => {
    setSelectedSlotForRollCall(slot);
    setIsRollCallSaved(false);

    // Filter relevant students or use full roster
    const roster = ALL_STUDENTS_ROSTER.slice(0, 10).map((stu, i) => {
      // Check existing record
      const existing = attendanceRecords.find(r => r.courseId === slot.courseId && r.studentId === stu.id);
      return {
        id: stu.id,
        name: stu.name,
        roll: stu.roll,
        status: (existing?.status as any) || (i % 7 === 0 ? 'ABSENT' : 'PRESENT')
      };
    });
    setRollCallStudents(roster);
  };

  // Toggle student status
  const handleToggleStudent = (studentId: string) => {
    setRollCallStudents(prev => prev.map(s => {
      if (s.id !== studentId) return s;
      const nextStatus = s.status === 'PRESENT' ? 'ABSENT' : s.status === 'ABSENT' ? 'LEAVE' : 'PRESENT';
      return { ...s, status: nextStatus };
    }));
  };

  // Save Roll Call
  const handleSaveRollCall = () => {
    if (!selectedSlotForRollCall) return;
    rollCallStudents.forEach(stu => {
      manualRollCallUpdate(
        stu.id,
        selectedSlotForRollCall.id,
        stu.status
      );
    });
    setIsRollCallSaved(true);
    setTimeout(() => {
      setSelectedSlotForRollCall(null);
      setIsRollCallSaved(false);
    }, 1200);
  };

  const getProgramBadge = (programId: string, semester: number) => {
    switch (programId) {
      case 'mca':
        return {
          bg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
          dot: 'bg-indigo-600',
          label: `MCA — Semester ${semester}`
        };
      case 'msc_it':
        return {
          bg: 'bg-purple-50 text-purple-700 border-purple-200',
          dot: 'bg-purple-600',
          label: `M.Sc. IT — Semester ${semester}`
        };
      case 'bca':
        return {
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dot: 'bg-emerald-600',
          label: `BCA — Semester ${semester}`
        };
      default:
        return {
          bg: 'bg-slate-50 text-slate-700 border-slate-200',
          dot: 'bg-slate-600',
          label: `${programId.toUpperCase()} Sem ${semester}`
        };
    }
  };

  const semesterFilterOptions = [
    { id: 'all', label: 'All Semesters', count: facultyDaySlots.length },
    { id: 'bca_sem1', label: 'BCA Sem 1', count: facultyDaySlots.filter(s => s.programId === 'bca' && s.semester === 1).length },
    { id: 'bca_sem3', label: 'BCA Sem 3', count: facultyDaySlots.filter(s => s.programId === 'bca' && s.semester === 3).length },
    { id: 'bca_sem5', label: 'BCA Sem 5', count: facultyDaySlots.filter(s => s.programId === 'bca' && s.semester === 5).length },
    { id: 'mca_sem1', label: 'MCA Sem 1', count: facultyDaySlots.filter(s => s.programId === 'mca' && s.semester === 1).length },
    { id: 'mca_sem3', label: 'MCA Sem 3', count: facultyDaySlots.filter(s => s.programId === 'mca' && s.semester === 3).length },
    { id: 'msc_it_sem1', label: 'M.Sc. IT Sem 1', count: facultyDaySlots.filter(s => s.programId === 'msc_it' && s.semester === 1).length },
    { id: 'msc_it_sem3', label: 'M.Sc. IT Sem 3', count: facultyDaySlots.filter(s => s.programId === 'msc_it' && s.semester === 3).length },
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner: Faculty Today's Lecture Schedule */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-3xl shadow-md border border-slate-800">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-indigo-400" />
                Faculty Daily Lecture Radar
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full text-xs font-bold">
                {selectedDay} Teaching Roster
              </span>
            </div>
            <h2 className="text-2xl font-black tracking-tight text-white">
              {activeFaculty.name} — Today's Lecture Schedule
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Real-time daily roster across multiple semesters (BCA Sem 1/3/5, MCA Sem 1/3, and M.Sc. IT Sem 1/3). Includes classrooms, lab venues, timing, and direct roll call.
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-indigo-400">{facultyDaySlots.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Lectures Today</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center">
              <div className="text-2xl font-black text-emerald-400">{distinctSemesters.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Active Semesters</div>
            </div>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-amber-400">{distinctRooms.length}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400 mt-0.5">Campus Venues</div>
            </div>
          </div>
        </div>
      </div>

      {/* Control Strip: Faculty Selector & Day Selector */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Select Faculty */}
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <User className="w-4 h-4 text-indigo-600" />
            Select Professor:
          </span>
          <select
            value={selectedFacultyId}
            onChange={(e) => {
              setSelectedFacultyId(e.target.value);
              setSemesterFilter('all');
            }}
            className="px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
          >
            {facultyUsers.map(f => (
              <option key={f.id} value={f.id}>
                {f.name} ({f.designation || 'Faculty'})
              </option>
            ))}
          </select>

          {currentUser.id !== selectedFacultyId && (
            <button
              onClick={() => switchUser(selectedFacultyId)}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
            >
              Switch Persona to this Faculty
            </button>
          )}
        </div>

        {/* Day Selector Ribbon */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as DayOfWeek[]).map(day => {
            const isSelected = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  isSelected
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {day.slice(0, 3)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Semester Filter Tabs (All, BCA 1/3/5, MCA 1/3, MSc IT 1/3) */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Filter className="w-4 h-4 text-indigo-600" />
            Filter by Semester:
          </span>
          <span className="text-xs text-slate-400 font-medium">
            Showing {filteredSlots.length} of {facultyDaySlots.length} lectures on {selectedDay}
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {semesterFilterOptions.map(opt => {
            const isActive = semesterFilter === opt.id;
            const hasLectures = opt.count > 0;
            return (
              <button
                key={opt.id}
                onClick={() => setSemesterFilter(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isActive
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : hasLectures
                    ? 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    : 'bg-slate-50/50 text-slate-400 border-slate-200/60 opacity-60'
                }`}
              >
                <span>{opt.label}</span>
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-white/20 text-white' : hasLectures ? 'bg-indigo-100 text-indigo-800' : 'bg-slate-200 text-slate-500'
                }`}>
                  {opt.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lecture Cards List */}
      <div className="space-y-3">
        {filteredSlots.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Calendar className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-800 text-sm">
              No Lectures Found for {activeFaculty.name}
            </h4>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              There are no lectures matching this semester filter on {selectedDay}. Try selecting "All Semesters" or picking another day from the bar above.
            </p>
            <button
              onClick={() => setSemesterFilter('all')}
              className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold cursor-pointer hover:bg-indigo-500 transition-colors"
            >
              Reset to All Semesters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSlots.map((slot) => {
              const badge = getProgramBadge(slot.programId, slot.semester);
              const isLab = slot.slotType === 'lab';
              return (
                <div
                  key={slot.id}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 p-5 shadow-xs transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header: Timing & Program Tag */}
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                        <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                          {slot.startTime} – {slot.endTime}
                        </span>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border flex items-center gap-1.5 ${badge.bg}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`}></span>
                        {badge.label}
                      </span>
                    </div>

                    {/* Course Title & Code */}
                    <div>
                      <span className="text-xs font-mono font-bold text-indigo-600">
                        {slot.courseCode}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 mt-0.5">
                        {slot.courseName}
                      </h3>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500 flex-wrap">
                        <span className="flex items-center gap-1 font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>Venue: <strong>{slot.roomOrLab}</strong></span>
                        </span>
                        <span className="flex items-center gap-1 text-slate-600">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{isLab ? 'Practical / Laboratory Session' : 'Theory Core Class'}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Roll Call Attendance & Syllabus */}
                  <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenRollCall(slot)}
                      className="flex-1 py-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <UserCheck className="w-3.5 h-3.5" />
                      <span>Take Roll Call</span>
                    </button>
                    {onNavigateToSyllabus && (
                      <button
                        type="button"
                        onClick={onNavigateToSyllabus}
                        className="py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1 cursor-pointer"
                        title="View Course Micro-Topics"
                      >
                        <BookOpen className="w-3.5 h-3.5 text-slate-500" />
                        <span className="hidden sm:inline">Topics</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* In-Place Manual Roll Call Modal (No QR code needed) */}
      {selectedSlotForRollCall && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
                  Manual Classroom Roll Call
                </span>
                <h3 className="font-bold text-base text-slate-900 mt-1">
                  {selectedSlotForRollCall.courseName}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {selectedSlotForRollCall.startTime} – {selectedSlotForRollCall.endTime} • {selectedSlotForRollCall.roomOrLab}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSlotForRollCall(null)}
                className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Quick summary of present/absent */}
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs font-semibold">
              <span className="text-slate-600">
                Present: <strong className="text-emerald-600">{rollCallStudents.filter(s => s.status === 'PRESENT').length}</strong> / {rollCallStudents.length}
              </span>
              <span className="text-slate-400 text-[11px]">
                Click student chip to toggle Present / Absent
              </span>
            </div>

            {/* Students List */}
            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {rollCallStudents.map(student => {
                const isPresent = student.status === 'PRESENT';
                return (
                  <div
                    key={student.id}
                    onClick={() => handleToggleStudent(student.id)}
                    className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer select-none transition-all ${
                      isPresent
                        ? 'bg-emerald-50/60 border-emerald-300 text-emerald-950'
                        : 'bg-rose-50/60 border-rose-200 text-rose-950'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isPresent ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                      }`}>
                        {isPresent ? 'P' : 'A'}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-900">{student.name}</div>
                        <div className="text-[10px] font-mono text-slate-500">{student.roll}</div>
                      </div>
                    </div>

                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Modal Footer */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setSelectedSlotForRollCall(null)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveRollCall}
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-1.5 shadow-md shadow-indigo-900/30"
              >
                {isRollCallSaved ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit Daily Attendance</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
