import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Coffee, 
  Utensils, 
  AlertTriangle, 
  QrCode, 
  Sparkles, 
  Plus, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  X,
  ShieldCheck,
  UserCheck,
  Building2,
  Table,
  Layers,
  Filter
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { DayOfWeek, TimetableSlot, ProgramId, DepartmentId, SlotWeeklyStatus } from '../../types/attendance';

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

interface CohortOption {
  programId: ProgramId;
  year: number;
  semester: number;
  label: string;
  roomDesc: string;
  departmentId: DepartmentId;
}

const AVAILABLE_COHORTS: CohortOption[] = [
  { programId: 'mca', year: 1, semester: 1, label: 'MCA Year 1 (Sem 1)', roomDesc: 'MCA-101, MCA-102, Lab-1, Lab-2', departmentId: 'it_ca' },
  { programId: 'mca', year: 2, semester: 3, label: 'MCA Year 2 (Sem 3)', roomDesc: 'MCA-201, MCA-202, Lab-1, Lab-2', departmentId: 'it_ca' },
  { programId: 'msc_it', year: 1, semester: 1, label: 'M.Sc. IT Year 1 (Sem 1)', roomDesc: 'MSCIT-101, MSCIT-102, IT-Lab-1', departmentId: 'it_ca' },
  { programId: 'msc_it', year: 2, semester: 3, label: 'M.Sc. IT Year 2 (Sem 3)', roomDesc: 'MSCIT-301, MSCIT-302, IT-Lab-1', departmentId: 'it_ca' },
  { programId: 'bca', year: 1, semester: 1, label: 'BCA Year 1 (Sem 1)', roomDesc: 'Room 101 / Comp Lab 1', departmentId: 'it_ca' },
  { programId: 'bca', year: 2, semester: 3, label: 'BCA Year 2 (Sem 3)', roomDesc: 'Room 102 / Comp Lab 2', departmentId: 'it_ca' },
  { programId: 'bca', year: 3, semester: 5, label: 'BCA Year 3 (Sem 5)', roomDesc: 'Room 103 / Adv Web Lab', departmentId: 'it_ca' },
  { programId: 'btech_cse', year: 1, semester: 1, label: 'B.Tech CSE Year 1 (Sem 1)', roomDesc: 'Engg 201 / Physics Lab', departmentId: 'engineering' },
  { programId: 'bba', year: 1, semester: 1, label: 'BBA Year 1 (Sem 1)', roomDesc: 'Mgmt 301 / Tally Lab', departmentId: 'management' },
  { programId: 'mba', year: 1, semester: 1, label: 'MBA Year 1 (Sem 1)', roomDesc: 'Board Room 1 / Exec Suite', departmentId: 'management' },
  { programId: 'ba_llb', year: 1, semester: 1, label: 'BA-LLB Year 1 (Sem 1)', roomDesc: 'Law Block 401 / Moot Court 1', departmentId: 'law' },
];

interface LJTimetableManagerProps {
  isEditable?: boolean;
  onLaunchSession?: (slot: TimetableSlot) => void;
  onStudentScan?: () => void;
}

export const LJTimetableManager: React.FC<LJTimetableManagerProps> = ({
  isEditable = false,
  onLaunchSession,
  onStudentScan,
}) => {
  const { 
    timetableSlots, 
    weeks, 
    selectedWeek, 
    setSelectedWeek,
    currentUser,
    assignSubstitute,
    revertSubstitute,
    launchSessionFromSlot,
    activeSession,
    addTimetableSlot,
    applyWeeklySlotOverride,
    checkTimetableConflicts,
    holidays
  } = useAttendance();

  // Cohort Selection (Defaults to student's program/year or BCA Yr 1)
  const defaultCohort = AVAILABLE_COHORTS.find(
    c => c.programId === currentUser.programId && (c.semester === currentUser.semester || c.year === currentUser.year)
  ) || AVAILABLE_COHORTS[0];

  const [selectedCohort, setSelectedCohort] = useState<CohortOption>(defaultCohort);

  React.useEffect(() => {
    if (currentUser.role === 'STUDENT' && currentUser.programId) {
      const match = AVAILABLE_COHORTS.find(
        c => c.programId === currentUser.programId && (c.semester === currentUser.semester || c.year === currentUser.year)
      );
      if (match) {
        setSelectedCohort(match);
      }
    }
  }, [currentUser]);

  const [filterMode, setFilterMode] = useState<'cohort' | 'my_faculty' | 'my_proxy'>('cohort');
  const [viewMode, setViewMode] = useState<'day_timeline' | 'weekly_grid'>('day_timeline');
  const [activeDay, setActiveDay] = useState<DayOfWeek>('Monday');

  // Conflict modal
  const [isConflictModalOpen, setIsConflictModalOpen] = useState(false);
  const conflictReport = checkTimetableConflicts();

  // Weekly Override Modal (Substitute, Reschedule, Holiday, Remedial)
  const [isOverrideModalOpen, setIsOverrideModalOpen] = useState(false);
  const [selectedSlotForOverride, setSelectedSlotForOverride] = useState<TimetableSlot | null>(null);
  const [overrideStatus, setOverrideStatus] = useState<SlotWeeklyStatus>('substitute');
  const [overrideFacultyName, setOverrideFacultyName] = useState('Prof. Hardik Dave');
  const [overrideNote, setOverrideNote] = useState('Faculty on Academic Duty / Leave');
  const [rescheduledTiming, setRescheduledTiming] = useState('Friday 03:00 PM (Comp Lab 2)');

  // Substitute modal
  const [isSubstituteModalOpen, setIsSubstituteModalOpen] = useState(false);
  const [selectedSlotForSubstitute, setSelectedSlotForSubstitute] = useState<TimetableSlot | null>(null);
  const [substituteFacultyName, setSubstituteFacultyName] = useState('Prof. Anjali Trivedi');
  const [substituteReason, setSubstituteReason] = useState('Faculty on Academic Leave / Duty');

  // Add slot modal for Admin/HOD
  const [isAddSlotOpen, setIsAddSlotOpen] = useState(false);
  const [newSlotCourseCode, setNewSlotCourseCode] = useState('BCA102');
  const [newSlotCourseName, setNewSlotCourseName] = useState('Web Technology-I');
  const [newSlotFaculty, setNewSlotFaculty] = useState('Prof. Riddhi Vyas');
  const [newSlotRoom, setNewSlotRoom] = useState('Room 101');
  const [newSlotIndex, setNewSlotIndex] = useState<1 | 2 | 3 | 4>(1);
  const [newSlotType, setNewSlotType] = useState<'theory' | 'lab' | 'allied'>('theory');

  const currentWeekObj = weeks.find(w => w.weekNumber === selectedWeek) || weeks[10];
  const matchingDayHoliday = holidays.find(h => h.dayOfWeek === activeDay);

  const handleOpenSubstituteModal = (slot: TimetableSlot) => {
    setSelectedSlotForSubstitute(slot);
    setIsSubstituteModalOpen(true);
  };

  const handleOpenOverrideModal = (slot: TimetableSlot) => {
    setSelectedSlotForOverride(slot);
    setOverrideStatus(slot.weeklyStatus || (slot.isSubstitute ? 'substitute' : 'regular'));
    setOverrideFacultyName(slot.substituteFacultyName || 'Prof. Hardik Dave');
    setOverrideNote(slot.overrideNote || slot.leaveReason || 'Special Academic Adjustment');
    setRescheduledTiming(slot.rescheduledTo || 'Friday 03:00 PM');
    setIsOverrideModalOpen(true);
  };

  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForOverride) return;

    if (overrideStatus === 'substitute') {
      assignSubstitute(
        selectedSlotForOverride.id,
        'fac_proxy_custom',
        overrideFacultyName,
        overrideNote
      );
      applyWeeklySlotOverride(selectedSlotForOverride.id, 'substitute', overrideNote);
    } else if (overrideStatus === 'regular') {
      revertSubstitute(selectedSlotForOverride.id);
      applyWeeklySlotOverride(selectedSlotForOverride.id, 'regular');
    } else {
      applyWeeklySlotOverride(
        selectedSlotForOverride.id,
        overrideStatus,
        overrideNote,
        overrideStatus === 'rescheduled' ? rescheduledTiming : undefined
      );
    }

    setIsOverrideModalOpen(false);
    setSelectedSlotForOverride(null);
  };

  const handleConfirmSubstitute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSlotForSubstitute) return;

    assignSubstitute(
      selectedSlotForSubstitute.id,
      'fac_substitute',
      substituteFacultyName,
      substituteReason
    );

    setIsSubstituteModalOpen(false);
    setSelectedSlotForSubstitute(null);
  };

  const handleCreateSlot = (e: React.FormEvent) => {
    e.preventDefault();
    const timeMap = {
      1: { start: '09:00 AM', end: '10:00 AM' },
      2: { start: '10:00 AM', end: '11:00 AM' },
      3: { start: '11:30 AM', end: '12:30 PM' },
      4: { start: '01:00 PM', end: '03:00 PM' },
    };

    addTimetableSlot({
      slotIndex: newSlotIndex,
      programId: selectedCohort.programId,
      departmentId: selectedCohort.departmentId,
      year: selectedCohort.year,
      semester: selectedCohort.semester,
      section: 'A',
      day: activeDay,
      startTime: timeMap[newSlotIndex].start,
      endTime: timeMap[newSlotIndex].end,
      courseId: newSlotCourseCode.toLowerCase().replace(/[^a-z0-9]/g, ''),
      courseCode: newSlotCourseCode,
      courseName: newSlotCourseName,
      facultyId: 'fac_custom',
      facultyName: newSlotFaculty,
      roomOrLab: newSlotRoom,
      slotType: newSlotType,
    });

    setIsAddSlotOpen(false);
  };

  // Filter slots for active cohort OR my faculty slots OR my proxy slots
  const filteredSlots = timetableSlots.filter(s => {
    if (filterMode === 'my_faculty') {
      return s.facultyId === currentUser.id;
    }
    if (filterMode === 'my_proxy') {
      return s.substituteFacultyId === currentUser.id || s.isSubstitute;
    }
    return s.programId === selectedCohort.programId && s.year === selectedCohort.year;
  });

  // Slots for the active day
  const daySlots = filteredSlots.filter(s => s.day === activeDay);

  const getSlot1 = daySlots.find(s => s.slotIndex === 1);
  const getSlot2 = daySlots.find(s => s.slotIndex === 2);
  const getSlot3 = daySlots.find(s => s.slotIndex === 3);
  const getSlot4 = daySlots.find(s => s.slotIndex === 4);

  return (
    <div className="space-y-6">
      {/* Top Banner: Academic Week Selector & Cohort Bar */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-base text-slate-900">
              {currentUser.role === 'STUDENT' ? `${selectedCohort.label} — Semester Timetable` : 'LJ University Master Timetable (09:00 AM - 03:00 PM)'}
            </h3>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              {selectedCohort.label} • {selectedCohort.roomDesc}
            </span>
            
            {/* Live Conflict Engine Status Badge - Hidden for students */}
            {currentUser.role !== 'STUDENT' && (
              <button
                onClick={() => setIsConflictModalOpen(true)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 cursor-pointer transition-colors ${
                  conflictReport.hasConflict
                    ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                    : 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                {conflictReport.hasConflict ? (
                  <>
                    <AlertTriangle className="w-3 h-3 text-rose-600" />
                    <span>Conflict Warning: {conflictReport.conflicts.length} Overlaps!</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Conflict Engine: 0 Overlaps (100% Conflict-Free)</span>
                  </>
                )}
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            09:00 AM - 03:00 PM standard curriculum architecture with 4 discrete lectures and universal campus recesses.
          </p>
        </div>

        {/* 16-Week Navigation */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <span className="text-xs font-bold text-slate-500 uppercase">Week:</span>
          <select
            value={selectedWeek}
            onChange={(e) => setSelectedWeek(Number(e.target.value))}
            className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
          >
            {weeks
              .filter(w => currentUser.role !== 'STUDENT' || w.weekNumber === 11 || w.weekNumber === 12)
              .map(w => (
                <option key={w.weekNumber} value={w.weekNumber}>
                  Week {w.weekNumber} ({new Date(w.startDate).toLocaleDateString([], { month: 'short', day: 'numeric' })} - {new Date(w.endDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}) {w.isCurrent ? '★ Current (Week 11)' : (w.weekNumber === 12 ? 'Next Week (Week 12)' : '')}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Cohort Selector Ribbon & Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-wrap">
          {currentUser.role !== 'STUDENT' && (
            <>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-indigo-600" />
                Academic Cohort:
              </span>

              <select
                value={`${selectedCohort.programId}_${selectedCohort.year}`}
                onChange={(e) => {
                  const [pId, yr] = e.target.value.split('_');
                  const found = AVAILABLE_COHORTS.find(c => c.programId === pId && c.year === Number(yr));
                  if (found) {
                    setSelectedCohort(found);
                    setFilterMode('cohort');
                  }
                }}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-indigo-600 cursor-pointer min-w-[240px]"
              >
                {AVAILABLE_COHORTS.map(c => (
                  <option key={`${c.programId}_${c.year}`} value={`${c.programId}_${c.year}`}>
                    {c.label} — {c.roomDesc}
                  </option>
                ))}
              </select>
            </>
          )}

          {/* If Faculty, toggle personal teaching schedule or proxy duties */}
          {currentUser.role === 'FACULTY' && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setFilterMode('cohort')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterMode === 'cohort'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <span>Cohort View</span>
              </button>
              <button
                onClick={() => setFilterMode('my_faculty')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterMode === 'my_faculty'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>My Regular Classes</span>
              </button>
              <button
                onClick={() => setFilterMode('my_proxy')}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  filterMode === 'my_proxy'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                <Coffee className="w-3.5 h-3.5" />
                <span>My Proxy / Subs</span>
              </button>
            </div>
          )}

          {/* Add Slot for Admin */}
          {(currentUser.role === 'SUPER_ADMIN' || currentUser.role === 'HOD') && (
            <button
              onClick={() => setIsAddSlotOpen(true)}
              className="px-3 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-indigo-50 hover:text-indigo-700 text-slate-700 border border-slate-200 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Custom Slot</span>
            </button>
          )}
        </div>

        {/* View Mode Toggle: Day Timeline vs Full Weekly Grid */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start lg:self-center border border-slate-200">
          <button
            onClick={() => setViewMode('day_timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'day_timeline' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Day Timeline</span>
          </button>
          <button
            onClick={() => setViewMode('weekly_grid')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'weekly_grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-indigo-600" />
            <span>Full Week Grid (Mon-Sat)</span>
          </button>
        </div>
      </div>

      {/* Week Theme & Holiday Banner */}
      {currentWeekObj.holidays && currentWeekObj.holidays.length > 0 && (
        <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs flex items-center justify-between">
          <span className="font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Upcoming University Holiday: {currentWeekObj.holidays[0].name} ({currentWeekObj.holidays[0].date})
          </span>
          <span className="text-[11px] font-mono bg-white/70 px-2 py-0.5 rounded border border-amber-200">
            Timetable Auto-Compensated
          </span>
        </div>
      )}

      {/* VIEW 1: DAY TIMELINE VIEW */}
      {viewMode === 'day_timeline' && (
        <div className="space-y-4">
          {/* Day Selector Pills (Monday to Saturday) */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {DAYS.map(day => {
              const isSelected = activeDay === day;
              const slotsForThisDay = filteredSlots.filter(s => s.day === day);
              const hasSubstitute = slotsForThisDay.some(s => s.isSubstitute);

              return (
                <button
                  key={day}
                  onClick={() => setActiveDay(day)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  <span>{day}</span>
                  <span className="text-[10px] font-mono opacity-70">({slotsForThisDay.length} classes)</span>
                  {hasSubstitute && (
                    <span className="w-2 h-2 rounded-full bg-amber-400" title="Substitute Assigned"></span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Daily Conflict-Free Timeline Grid (09:00 AM - 03:00 PM) */}
          <div className="space-y-4">
            {/* SLOT 1: 09:00 AM - 10:00 AM (Core Theory 1) */}
            {getSlot1 ? (
              <TimetableSlotCard
                slot={getSlot1}
                timeLabel="09:00 AM - 10:00 AM"
                slotTitle="Slot 1: Core Theory Lecture 1"
                isLive={activeSession?.timetableSlotId === getSlot1.id}
                currentUserRole={currentUser.role}
                onLaunch={() => launchSessionFromSlot(getSlot1.id)}
                onStudentScan={onStudentScan}
                onSubstitute={() => handleOpenSubstituteModal(getSlot1)}
                onRevert={() => revertSubstitute(getSlot1.id)}
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                No lecture scheduled for Slot 1 (09:00 - 10:00 AM)
              </div>
            )}

            {/* SLOT 2: 10:00 AM - 11:00 AM (Core Theory 2) */}
            {getSlot2 ? (
              <TimetableSlotCard
                slot={getSlot2}
                timeLabel="10:00 AM - 11:00 AM"
                slotTitle="Slot 2: Core Theory Lecture 2"
                isLive={activeSession?.timetableSlotId === getSlot2.id}
                currentUserRole={currentUser.role}
                onLaunch={() => launchSessionFromSlot(getSlot2.id)}
                onStudentScan={onStudentScan}
                onSubstitute={() => handleOpenSubstituteModal(getSlot2)}
                onRevert={() => revertSubstitute(getSlot2.id)}
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                No lecture scheduled for Slot 2 (10:00 - 11:00 AM)
              </div>
            )}

            {/* BREAK: 11:00 AM - 11:30 AM (Morning Universal Tea Recess) */}
            <div className="p-3 bg-gradient-to-r from-amber-50/80 via-orange-50/40 to-amber-50/80 rounded-xl border border-amber-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-amber-900">
                <span className="p-1.5 bg-amber-100 text-amber-700 rounded-lg">
                  <Coffee className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold">11:00 AM - 11:30 AM (30 Mins)</span>
                  <span className="text-amber-700 font-medium ml-2">• Morning Universal Tea Recess & Student Break</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-amber-700 bg-amber-100/70 px-2 py-0.5 rounded">
                All Departments Synchronized
              </span>
            </div>

            {/* SLOT 3: 11:30 AM - 12:30 PM (Core Theory 3 / Allied) */}
            {getSlot3 ? (
              <TimetableSlotCard
                slot={getSlot3}
                timeLabel="11:30 AM - 12:30 PM"
                slotTitle="Slot 3: Core Theory / Allied Communication"
                isLive={activeSession?.timetableSlotId === getSlot3.id}
                currentUserRole={currentUser.role}
                onLaunch={() => launchSessionFromSlot(getSlot3.id)}
                onStudentScan={onStudentScan}
                onSubstitute={() => handleOpenSubstituteModal(getSlot3)}
                onRevert={() => revertSubstitute(getSlot3.id)}
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                No lecture scheduled for Slot 3 (11:30 - 12:30 PM)
              </div>
            )}

            {/* BREAK: 12:30 PM - 01:00 PM (Lunch Break) */}
            <div className="p-3 bg-gradient-to-r from-emerald-50/80 via-teal-50/40 to-emerald-50/80 rounded-xl border border-emerald-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5 text-emerald-900">
                <span className="p-1.5 bg-emerald-100 text-emerald-700 rounded-lg">
                  <Utensils className="w-4 h-4" />
                </span>
                <div>
                  <span className="font-bold">12:30 PM - 01:00 PM (30 Mins)</span>
                  <span className="text-emerald-700 font-medium ml-2">• Universal Campus Lunch Break</span>
                </div>
              </div>
              <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                Campus Cafeteria & Food Court Open
              </span>
            </div>

            {/* SLOT 4: 01:00 PM - 03:00 PM (2-Hour Practical Lab Session) */}
            {getSlot4 ? (
              <TimetableSlotCard
                slot={getSlot4}
                timeLabel="01:00 PM - 03:00 PM"
                slotTitle="Slot 4: 2-Hour Hands-On Practical Lab Session"
                isLive={activeSession?.timetableSlotId === getSlot4.id}
                currentUserRole={currentUser.role}
                onLaunch={() => launchSessionFromSlot(getSlot4.id)}
                onStudentScan={onStudentScan}
                onSubstitute={() => handleOpenSubstituteModal(getSlot4)}
                onRevert={() => revertSubstitute(getSlot4.id)}
              />
            ) : (
              <div className="p-4 bg-white rounded-2xl border border-dashed border-slate-200 text-xs text-slate-400 text-center">
                No lab session scheduled for Slot 4 (01:00 - 03:00 PM)
              </div>
            )}
          </div>
        </div>
      )}

      {/* VIEW 2: FULL WEEK TIMETABLE GRID (Mon - Sat Matrix) */}
      {viewMode === 'weekly_grid' && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div>
              <h4 className="font-bold text-sm text-slate-900">
                Weekly Timetable Matrix (Monday to Saturday)
              </h4>
              <p className="text-xs text-slate-500">
                Full 6-day academic schedule for {selectedCohort.label}
              </p>
            </div>
            <span className="text-xs font-mono bg-white px-2.5 py-1 rounded-lg border border-slate-200 font-bold text-indigo-700">
              09:00 AM - 03:00 PM Timetable Standard
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3 w-32 border-r border-slate-200">Time Slot</th>
                  {DAYS.map(day => (
                    <th key={day} className="p-3 min-w-[170px] border-r border-slate-200 last:border-r-0">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {/* SLOT 1 */}
                <tr>
                  <td className="p-3 bg-slate-50 font-mono font-bold text-slate-700 border-r border-slate-200">
                    <div>09:00 - 10:00</div>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">Slot 1 (Theory)</span>
                  </td>
                  {DAYS.map(day => {
                    const slot = filteredSlots.find(s => s.day === day && s.slotIndex === 1);
                    return <GridCell key={day} slot={slot} onLaunch={launchSessionFromSlot} />;
                  })}
                </tr>

                {/* SLOT 2 */}
                <tr>
                  <td className="p-3 bg-slate-50 font-mono font-bold text-slate-700 border-r border-slate-200">
                    <div>10:00 - 11:00</div>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">Slot 2 (Theory)</span>
                  </td>
                  {DAYS.map(day => {
                    const slot = filteredSlots.find(s => s.day === day && s.slotIndex === 2);
                    return <GridCell key={day} slot={slot} onLaunch={launchSessionFromSlot} />;
                  })}
                </tr>

                {/* TEA RECESS */}
                <tr className="bg-amber-50/70 text-amber-900 font-semibold">
                  <td className="p-2.5 font-mono text-center border-r border-amber-200">
                    11:00 - 11:30
                  </td>
                  <td colSpan={6} className="p-2.5 text-center text-[11px] font-bold text-amber-800">
                    ☕ Universal Morning Tea Recess & Campus Break (All Departments Synchronized)
                  </td>
                </tr>

                {/* SLOT 3 */}
                <tr>
                  <td className="p-3 bg-slate-50 font-mono font-bold text-slate-700 border-r border-slate-200">
                    <div>11:30 - 12:30</div>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">Slot 3 (Theory)</span>
                  </td>
                  {DAYS.map(day => {
                    const slot = filteredSlots.find(s => s.day === day && s.slotIndex === 3);
                    return <GridCell key={day} slot={slot} onLaunch={launchSessionFromSlot} />;
                  })}
                </tr>

                {/* LUNCH BREAK */}
                <tr className="bg-emerald-50/70 text-emerald-900 font-semibold">
                  <td className="p-2.5 font-mono text-center border-r border-emerald-200">
                    12:30 - 01:00
                  </td>
                  <td colSpan={6} className="p-2.5 text-center text-[11px] font-bold text-emerald-800">
                    🍽 Universal Campus Lunch Break (Cafeteria & Food Court Open)
                  </td>
                </tr>

                {/* SLOT 4 (LAB) */}
                <tr>
                  <td className="p-3 bg-slate-50 font-mono font-bold text-slate-700 border-r border-slate-200">
                    <div>01:00 - 03:00</div>
                    <span className="text-[10px] text-slate-500 font-sans font-medium">Slot 4 (2-Hr Lab)</span>
                  </td>
                  {DAYS.map(day => {
                    const slot = filteredSlots.find(s => s.day === day && s.slotIndex === 4);
                    return <GridCell key={day} slot={slot} onLaunch={launchSessionFromSlot} />;
                  })}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBSTITUTE FACULTY ASSIGNMENT MODAL */}
      {isSubstituteModalOpen && selectedSlotForSubstitute && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Assign Substitute Faculty</h4>
                <p className="text-xs text-slate-500">
                  {selectedSlotForSubstitute.courseCode} ({selectedSlotForSubstitute.startTime} - {selectedSlotForSubstitute.endTime})
                </p>
              </div>
              <button
                onClick={() => setIsSubstituteModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmSubstitute} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Original Assigned Faculty
                </label>
                <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800">
                  {selectedSlotForSubstitute.facultyName} ({selectedSlotForSubstitute.roomOrLab})
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Select Substitute Faculty
                </label>
                <select
                  value={substituteFacultyName}
                  onChange={(e) => setSubstituteFacultyName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
                >
                  <option value="Prof. Anjali Trivedi">Prof. Anjali Trivedi (Communication / Web)</option>
                  <option value="Dr. Priya Shah">Dr. Priya Shah (Full Stack / HOD)</option>
                  <option value="Prof. Pooja Dave">Prof. Pooja Dave (Core Java)</option>
                  <option value="Prof. Amit Joshi">Prof. Amit Joshi (DBMS)</option>
                  <option value="Prof. Neha Sharma">Prof. Neha Sharma (Data Structures)</option>
                  <option value="Dr. Ketan Mehta">Dr. Ketan Mehta (DSA & AI/ML)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Reason for Adjustment / Faculty Leave
                </label>
                <input
                  type="text"
                  value={substituteReason}
                  onChange={(e) => setSubstituteReason(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsSubstituteModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Confirm & Update Timetable
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADD CUSTOM SLOT MODAL (FOR SUPER ADMIN / HOD) */}
      {isAddSlotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Add Timetable Slot</h4>
                <p className="text-xs text-slate-500">
                  {selectedCohort.label} • {activeDay}
                </p>
              </div>
              <button
                onClick={() => setIsAddSlotOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSlot} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Slot Period
                  </label>
                  <select
                    value={newSlotIndex}
                    onChange={(e) => setNewSlotIndex(Number(e.target.value) as 1 | 2 | 3 | 4)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value={1}>Slot 1 (09:00 - 10:00 AM)</option>
                    <option value={2}>Slot 2 (10:00 - 11:00 AM)</option>
                    <option value={3}>Slot 3 (11:30 - 12:30 PM)</option>
                    <option value={4}>Slot 4 Lab (01:00 - 03:00 PM)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Type
                  </label>
                  <select
                    value={newSlotType}
                    onChange={(e) => setNewSlotType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 cursor-pointer"
                  >
                    <option value="theory">Theory</option>
                    <option value="lab">Lab (Practical)</option>
                    <option value="allied">Allied / Tutorial</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Course Code & Title
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="BCA102"
                    value={newSlotCourseCode}
                    onChange={(e) => setNewSlotCourseCode(e.target.value)}
                    className="col-span-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold outline-none focus:border-indigo-600"
                  />
                  <input
                    type="text"
                    placeholder="Course Name"
                    value={newSlotCourseName}
                    onChange={(e) => setNewSlotCourseName(e.target.value)}
                    className="col-span-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Faculty In-Charge
                  </label>
                  <input
                    type="text"
                    value={newSlotFaculty}
                    onChange={(e) => setNewSlotFaculty(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    Room / Lab
                  </label>
                  <input
                    type="text"
                    value={newSlotRoom}
                    onChange={(e) => setNewSlotRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddSlotOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs cursor-pointer"
                >
                  Save Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for individual TimetableSlotCard in Day Timeline
interface TimetableSlotCardProps {
  slot: TimetableSlot;
  timeLabel: string;
  slotTitle: string;
  isLive: boolean;
  currentUserRole: string;
  onLaunch: () => void;
  onStudentScan?: () => void;
  onSubstitute: () => void;
  onRevert: () => void;
}

const TimetableSlotCard: React.FC<TimetableSlotCardProps> = ({
  slot,
  timeLabel,
  slotTitle,
  isLive,
  currentUserRole,
  onLaunch,
  onStudentScan,
  onSubstitute,
  onRevert,
}) => {
  return (
    <div className={`p-4 rounded-2xl border transition-all ${
      isLive 
        ? 'bg-emerald-50/50 border-emerald-300 shadow-sm ring-1 ring-emerald-400' 
        : slot.isSubstitute 
        ? 'bg-amber-50/30 border-amber-200 shadow-2xs' 
        : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
    }`}>
      {/* Slot Type Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
            {timeLabel}
          </span>
          <span className="text-xs font-bold text-slate-800">
            {slotTitle}
          </span>
        </div>

        {isLive && (
          <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
            LIVE BROADCASTING
          </span>
        )}

        {slot.isSubstitute && (
          <span className="text-[10px] font-bold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-200">
            🔄 Substitute Arrangement
          </span>
        )}
      </div>

      {/* Main Content Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-indigo-700">
              {slot.courseCode}
            </span>
            <span className="text-sm font-bold text-slate-900">
              {slot.courseName}
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.2 rounded-full border ${
              slot.slotType === 'lab' 
                ? 'bg-cyan-50 text-cyan-700 border-cyan-200' 
                : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}>
              {slot.slotType === 'lab' ? 'Lab (Practical)' : 'Theory'}
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-500 font-medium flex-wrap pt-0.5">
            <span className="flex items-center gap-1.5 text-slate-700">
              <User className="w-3.5 h-3.5 text-slate-400" />
              Faculty: <strong>{slot.isSubstitute ? slot.substituteFacultyName : slot.facultyName}</strong>
              {slot.isSubstitute && <span className="text-xs text-amber-600 italic">(substituting for {slot.facultyName})</span>}
            </span>
            <span className="flex items-center gap-1.5 text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              Venue: <strong className="text-indigo-600">{slot.roomOrLab}</strong>
            </span>
          </div>

          {slot.isSubstitute && slot.leaveReason && (
            <p className="text-[11px] text-amber-700 italic">
              Notice: {slot.leaveReason}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {(currentUserRole === 'FACULTY' || currentUserRole === 'HOD' || currentUserRole === 'SUPER_ADMIN') ? (
            <>
              {slot.isSubstitute ? (
                <button
                  type="button"
                  onClick={onRevert}
                  className="px-2.5 py-1.5 text-[11px] font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                  title="Revert back to original faculty"
                >
                  Revert Original
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onSubstitute}
                  className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg border border-slate-200 cursor-pointer"
                >
                  Substitute
                </button>
              )}

              <button
                type="button"
                onClick={onLaunch}
                className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <QrCode className="w-3.5 h-3.5" />
                <span>Launch QR Attendance</span>
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onStudentScan}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>Check-In / Scan Attendance</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

// Sub-component for individual cell in Full Weekly Grid
function GridCell({ slot, onLaunch }: { slot?: TimetableSlot; onLaunch: (slotId: string) => void }) {
  if (!slot) {
    return (
      <td className="p-3 border-r border-slate-200 last:border-r-0 text-slate-300 text-center italic bg-slate-50/40">
        Free Slot
      </td>
    );
  }

  return (
    <td className="p-2.5 border-r border-slate-200 last:border-r-0 align-top group hover:bg-indigo-50/40 transition-colors">
      <div className="font-bold text-slate-900 text-[11px] flex items-center justify-between">
        <span className="font-mono text-indigo-700">{slot.courseCode}</span>
        <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
          slot.slotType === 'lab' ? 'bg-cyan-100 text-cyan-800' : 'bg-slate-100 text-slate-600'
        }`}>
          {slot.roomOrLab}
        </span>
      </div>
      <div className="font-semibold text-slate-800 truncate text-[11px] mt-0.5" title={slot.courseName}>
        {slot.courseName}
      </div>
      <div className="text-[10px] text-slate-500 truncate mt-0.5">
        {slot.isSubstitute ? `🔄 ${slot.substituteFacultyName}` : slot.facultyName}
      </div>
      <button
        onClick={() => onLaunch(slot.id)}
        className="mt-1.5 w-full py-1 bg-white hover:bg-indigo-600 hover:text-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer flex items-center justify-center gap-1"
      >
        <QrCode className="w-3 h-3" />
        Launch QR
      </button>
    </td>
  );
}
