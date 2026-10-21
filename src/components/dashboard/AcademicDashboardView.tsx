import React from 'react';
import { 
  Building2, 
  Users, 
  BookOpen, 
  AlertTriangle, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  Flame, 
  ShieldCheck, 
  QrCode, 
  ChevronRight,
  Coffee,
  Play,
  Award,
  CalendarDays,
  Sparkles
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { ActiveNavTab } from '../layout/Sidebar';

interface AcademicDashboardViewProps {
  onNavigateTab: (tab: ActiveNavTab) => void;
  onOpenLiveModal?: () => void;
  onOpenScannerModal?: () => void;
}

export const AcademicDashboardView: React.FC<AcademicDashboardViewProps> = ({
  onNavigateTab,
}) => {
  const { 
    currentUser, 
    courses, 
    timetableSlots, 
    getStudentAttendanceSummary, 
    getAtRiskDefaulters, 
    departments,
    activeSession,
    holidays,
    semesterConfig
  } = useAttendance();

  const defaulters = getAtRiskDefaulters(75);
  const studentSummary = currentUser.role === 'STUDENT' ? getStudentAttendanceSummary(currentUser.id) : null;

  const targetProgramId = currentUser.programId || 'bca';
  const targetYear = currentUser.year || 1;

  // If faculty, filter slots taught by current faculty, otherwise current cohort's Monday slots
  const facultySlots = timetableSlots.filter(s => s.facultyId === currentUser.id || s.substituteFacultyId === currentUser.id);
  const mondaySlots = currentUser.role === 'FACULTY' && facultySlots.length > 0
    ? facultySlots.filter(s => s.day === 'Monday')
    : timetableSlots.filter(s => s.day === 'Monday' && s.programId === targetProgramId && s.year === targetYear);

  // Subject-wise dynamic syllabus courses for the logged-in student or faculty
  const mySubjects = React.useMemo(() => {
    if (currentUser.role === 'STUDENT') {
      const pId = currentUser.programId || 'bca';
      const sem = currentUser.semester || 1;
      const studentCourses = courses.filter(c => c.programId === pId && c.semester === sem);
      if (studentCourses.length > 0) {
        return studentCourses.map(c => {
          const completedLesson = c.lessons?.find(l => l.isCompleted);
          const nextLesson = c.lessons?.find(l => !l.isCompleted);
          
          let currentTopic = completedLesson?.microTopicTitle || c.lessons?.[0]?.microTopicTitle || 'Core Curriculum & Practical Lab';
          let nextTopic = nextLesson?.microTopicTitle || c.lessons?.[1]?.microTopicTitle || 'Advanced Applications & Assessment';

          return {
            id: c.id,
            code: c.code,
            name: c.name,
            program: c.programId.toUpperCase(),
            semester: c.semester,
            room: c.defaultRoom || c.room || 'Room 101',
            facultyName: c.facultyName || 'Faculty',
            delivered: c.totalLecturesConducted || 26,
            total: c.totalLecturesPlanned || 40,
            currentTopic,
            nextTopic
          };
        });
      }
    }

    // 1. Gather all courses taught by this faculty from timetable
    const userTaughtSlots = timetableSlots.filter(s => 
      s.facultyId === currentUser.id || 
      s.facultyName.toLowerCase().includes(currentUser.name.toLowerCase().split(' ')[1] || '---')
    );

    const slotMap = new Map<string, {
      id: string;
      code: string;
      name: string;
      program: string;
      semester: number;
      room: string;
      facultyName: string;
      delivered: number;
      total: number;
      currentTopic: string;
      nextTopic: string;
    }>();

    userTaughtSlots.forEach(s => {
      const key = `${s.courseCode}_${s.programId}_sem${s.semester}`;
      if (!slotMap.has(key)) {
        let currentTopic = 'Core Concept & Practical Demonstration';
        let nextTopic = 'Advanced Applications & Evaluation';

        if (s.courseName.toLowerCase().includes('python')) {
          currentTopic = 'Python Data Structures, Functions & OOPs';
          nextTopic = 'Exception Handling, Generators & File I/O';
        } else if (s.courseName.toLowerCase().includes('java')) {
          currentTopic = 'Spring Boot REST Architecture & DI';
          nextTopic = 'Microservices Communication & JPA';
        } else if (s.courseName.toLowerCase().includes('dbms')) {
          currentTopic = 'Relational Algebra & Normalization (3NF/BCNF)';
          nextTopic = 'ACID Transactions & Indexing B-Trees';
        } else if (s.courseName.toLowerCase().includes('data science') || s.courseName.toLowerCase().includes('data analytics')) {
          currentTopic = 'NumPy, Pandas & Exploratory Data Analysis';
          nextTopic = 'Scikit-Learn Regression & Clustering Models';
        } else if (s.courseName.toLowerCase().includes('cloud')) {
          currentTopic = 'AWS EC2, Docker Containers & VPC';
          nextTopic = 'Kubernetes Orchestration & Helm Charts';
        } else if (s.courseName.toLowerCase().includes('machine learning')) {
          currentTopic = 'Supervised Learning & Decision Trees';
          nextTopic = 'Neural Networks & Deep Learning Intro';
        } else if (s.courseName.toLowerCase().includes('web')) {
          currentTopic = 'Flexbox Layouts & Responsive Navbars';
          nextTopic = 'CSS Grid 2D Systems & Media Queries';
        } else if (s.courseName.toLowerCase().includes('mathematics')) {
          currentTopic = 'Propositional Logic & Truth Tables';
          nextTopic = 'Set Theory, Relations & Graph Theory';
        } else if (s.courseName.toLowerCase().includes('network')) {
          currentTopic = 'OSI Layers & TCP/IP Protocol Suite';
          nextTopic = 'Subnetting, Routing Algorithms & Socket API';
        } else if (s.courseName.toLowerCase().includes('c prog')) {
          currentTopic = 'Pointers & Dynamic Memory Allocation';
          nextTopic = 'Structures, Unions & File Handling';
        }

        slotMap.set(key, {
          id: s.id,
          code: s.courseCode,
          name: s.courseName,
          program: s.programId.toUpperCase(),
          semester: s.semester,
          room: s.roomOrLab,
          facultyName: s.facultyName,
          delivered: 26,
          total: 40,
          currentTopic,
          nextTopic
        });
      }
    });

    const list = Array.from(slotMap.values());
    if (list.length > 0) return list;

    // Comprehensive default courses across MCA, M.Sc. IT, and BCA
    return [
      {
        id: 'sub_mca_py',
        code: 'MCA101',
        name: 'Python Programming',
        program: 'MCA',
        semester: 1,
        room: 'MCA-101 / Lab-1',
        facultyName: 'Prof. A. Mehta',
        delivered: 26,
        total: 40,
        currentTopic: 'Python Data Structures, Functions & OOPs',
        nextTopic: 'Exception Handling, Generators & File I/O'
      },
      {
        id: 'sub_mca_java',
        code: 'MCA201',
        name: 'Advanced Java',
        program: 'MCA',
        semester: 3,
        room: 'MCA-201 / Lab-1',
        facultyName: 'Prof. A. Mehta',
        delivered: 24,
        total: 40,
        currentTopic: 'Spring Boot REST Architecture & DI',
        nextTopic: 'Microservices Communication & JPA'
      },
      {
        id: 'sub_msc_ds',
        code: 'MSCIT301',
        name: 'Python for Data Science',
        program: 'M.SC. IT',
        semester: 3,
        room: 'MSCIT-301 / IT-Lab-1',
        facultyName: 'Prof. H. Joshi',
        delivered: 25,
        total: 40,
        currentTopic: 'NumPy, Pandas & Exploratory Data Analysis',
        nextTopic: 'Scikit-Learn Regression & Clustering Models'
      },
      {
        id: 'sub_mca_dbms',
        code: 'MCA102',
        name: 'DBMS',
        program: 'MCA',
        semester: 1,
        room: 'MCA-101 / Lab-2',
        facultyName: 'Prof. R. Patel',
        delivered: 27,
        total: 40,
        currentTopic: 'Relational Algebra & Normalization (3NF/BCNF)',
        nextTopic: 'ACID Transactions & Indexing B-Trees'
      },
      {
        id: 'sub_bca_wt',
        code: 'BCA102',
        name: 'Web Technology-I',
        program: 'BCA',
        semester: 1,
        room: 'Room 101 / Comp Lab 1',
        facultyName: 'Prof. Riddhi Vyas',
        delivered: 27,
        total: 40,
        currentTopic: 'Flexbox Layouts & Responsive Navbars',
        nextTopic: 'CSS Grid 2D Systems & Media Queries'
      },
      {
        id: 'sub_bca_c',
        code: 'BCA101',
        name: 'C Programming & Logic',
        program: 'BCA',
        semester: 1,
        room: 'Room 101 / Comp Lab 1',
        facultyName: 'Prof. Krunal Patel',
        delivered: 26,
        total: 40,
        currentTopic: 'Pointers & Dynamic Memory Allocation',
        nextTopic: 'Structures, Unions & File Handling in C'
      }
    ];
  }, [timetableSlots, currentUser, courses]);

  const [selectedSubjectIndex, setSelectedSubjectIndex] = React.useState<number>(0);
  const currentSubject = mySubjects[selectedSubjectIndex] || mySubjects[0];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner - Clean & Simple */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-5 rounded-2xl shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-0.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>Lok Jagruti Kendra University (LJU) Ahmedabad</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Welcome, {currentUser.name}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5">
            Role: <strong className="text-white">{currentUser.role}</strong> • {currentUser.designation || currentUser.programName || 'Faculty Portal'}
          </p>
        </div>

        <div className="text-right sm:shrink-0 text-xs text-indigo-200 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl">
          <div className="font-bold text-white">Academic Term 2026-27</div>
          <div className="text-[11px] text-slate-400">Week 11 (Oct 19 – 24, 2026)</div>
        </div>
      </div>

      {/* STUDENT VIEW HERO (Turnout + 75% Bunk Calculator) */}
      {studentSummary && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Circular attendance gauge */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {currentUser.programName || `${currentUser.programId?.toUpperCase()} Semester ${currentUser.semester || 1}`} • Aggregate Attendance
                  </span>
                  <h3 className="text-3xl font-black text-slate-900 mt-1">
                    {studentSummary.overallPercentage}%
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {studentSummary.totalAttended} attended out of {studentSummary.totalConducted} conducted lectures
                  </p>
                </div>

                <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="6" className="text-slate-100" fill="transparent" />
                    <circle
                      cx="40"
                      cy="40"
                      r="34"
                      stroke="currentColor"
                      strokeWidth="6"
                      className={`transition-all duration-1000 ${
                        studentSummary.overallPercentage >= 75 ? 'text-emerald-500' : 'text-rose-500'
                      }`}
                      strokeDasharray={2 * Math.PI * 34}
                      strokeDashoffset={2 * Math.PI * 34 * (1 - studentSummary.overallPercentage / 100)}
                      strokeLinecap="round"
                      fill="transparent"
                    />
                  </svg>
                  <div className="absolute font-extrabold text-sm text-slate-900 font-mono">
                    {studentSummary.overallPercentage}%
                  </div>
                </div>
              </div>

              {/* Bunk / Deficit Box */}
              <div className={`mt-5 p-4 rounded-xl border text-xs ${
                studentSummary.isEligible 
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
                  : 'bg-rose-50 border-rose-200 text-rose-900'
              }`}>
                <div className="flex items-center gap-2 font-bold mb-1">
                  {studentSummary.isEligible ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Eligible for Semester Examination (Above 75% Threshold)</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>Attendance Shortage Warning! Debarred from University Exams</span>
                    </>
                  )}
                </div>
                <p className="text-[11px] leading-relaxed opacity-90">
                  {studentSummary.isEligible ? (
                    <>
                      You have a safe buffer of <strong>{studentSummary.safeMargin} lectures</strong> that you can safely miss while maintaining your eligibility above 75%.
                    </>
                  ) : (
                    <>
                      You must attend the next <strong>{studentSummary.neededToRecover} consecutive lectures</strong> continuously without missing to recover your attendance to 75%!
                    </>
                  )}
                </p>
              </div>
            </div>

            {/* Quick Shortcuts */}
            <div className="md:col-span-5 bg-gradient-to-br from-indigo-900 to-slate-900 text-white p-6 rounded-2xl shadow-2xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-indigo-300">
                  <span className="font-bold uppercase tracking-wider">Student Profile</span>
                  <span className="font-mono bg-white/10 px-2 py-0.5 rounded-full text-[11px] flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" />
                    {currentUser.currentStreakDays || 0} Day Streak
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-12 h-12 rounded-full border-2 border-indigo-400/50 object-cover"
                  />
                  <div>
                    <h4 className="font-bold text-white text-base">{currentUser.name}</h4>
                    <p className="text-xs text-indigo-200 font-mono">
                      Roll: {currentUser.rollNumber} • {currentUser.programName || `${currentUser.programId?.toUpperCase()} Sem ${currentUser.semester || 1}`}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10 flex gap-2">
                <button
                  onClick={() => onNavigateTab('timetable')}
                  className="flex-1 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold transition-colors cursor-pointer text-center"
                >
                  View Timetable
                </button>
                <button
                  onClick={() => onNavigateTab('syllabus')}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer text-center"
                >
                  Track Syllabus
                </button>
              </div>
            </div>
          </div>

          {/* DYNAMIC SUBJECT-WISE ATTENDANCE & SYLLABUS STATUS TABLE / CARDS */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Subject-Wise Attendance & Syllabus Progress</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time lecture attendance turnout and course syllabus completion for your active semester
                </p>
              </div>
              <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100 w-fit">
                {studentSummary.subjectBreakdown.length} Enrolled Courses
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {studentSummary.subjectBreakdown.map((subj) => (
                <div 
                  key={subj.courseId} 
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white transition-all space-y-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded">
                          {subj.courseCode}
                        </span>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          subj.percentage >= 75
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}>
                          {subj.percentage >= 75 ? 'Safe (Eligible)' : 'Defaulter (<75%)'}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900 text-sm mt-1">
                        {subj.courseName}
                      </h4>
                      <p className="text-xs text-slate-500">
                        Faculty: <strong>{subj.facultyName}</strong>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className={`text-xl font-black font-mono ${
                        subj.percentage >= 75 ? 'text-emerald-600' : 'text-rose-600'
                      }`}>
                        {subj.percentage}%
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {subj.attended}/{subj.total} attended
                      </div>
                    </div>
                  </div>

                  {/* Attendance Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-500">
                      <span>Attendance Turnout</span>
                      <span className="font-semibold">{subj.attended} of {subj.total} Lectures</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${
                          subj.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'
                        }`} 
                        style={{ width: `${subj.percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Syllabus Delivery Progress Bar */}
                  <div className="space-y-1 pt-1 border-t border-slate-200/60">
                    <div className="flex justify-between text-[11px] text-slate-600">
                      <span>Syllabus Delivered</span>
                      <span className="font-bold text-indigo-700">{subj.total} / {subj.totalPlannedLessons} Lectures ({subj.syllabusPercentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full transition-all duration-500" 
                        style={{ width: `${subj.syllabusPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* METRICS ROW FOR FACULTY, HOD, & SUPER_ADMIN (Clean, no static cards) */}
      {currentUser.role !== 'STUDENT' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Average Lecture Turnout</span>
            <div className="text-2xl font-black text-emerald-600 mt-1">84.8%</div>
            <span className="text-[11px] text-emerald-600 font-semibold">+9.8% above 75% bar</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Today's Scheduled Slots</span>
            <div className="text-2xl font-black text-slate-900 mt-1">
              {mondaySlots.length} Slots
            </div>
            <span className="text-[11px] text-slate-400">09:00 AM – 01:00 PM Timetable Standard</span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-500 uppercase">Active Teaching Subjects</span>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {mySubjects.length} Courses
            </div>
            <span className="text-[11px] text-indigo-600 font-semibold">Across MCA, BCA & M.Sc. IT</span>
          </div>
        </div>
      )}

      {/* ACADEMIC CALENDAR & 4-MONTH TERM BANNER */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 text-white rounded-2xl border border-indigo-800/60 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center shrink-0 mt-0.5">
            <CalendarDays className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-300">
                {semesterConfig.semesterName}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Week {semesterConfig.currentWeekNumber} of {semesterConfig.totalWeeks}
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                {semesterConfig.totalTeachingDays} Teaching Days
              </span>
            </div>
            <h3 className="font-bold text-sm text-white mt-1">
              Academic Term: July 2026 – November 2026 (4-Month Semester Cycle)
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
              Next Campus Holiday: <strong className="text-amber-300">{holidays.find(h => h.type !== 'sunday')?.name || 'Gandhi Jayanti'}</strong> ({holidays.find(h => h.type !== 'sunday')?.date}) • Sundays designated Academic Recess.
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('calendar')}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-indigo-950/40"
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>View 4-Month Calendar</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* TODAY'S SCHEDULE QUEUE (09:00 AM - 01:00 PM) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Today's Assigned Lecture & Lab Slots (09:00 AM – 01:00 PM)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              LJ University • {currentUser.role === 'FACULTY' ? `${currentUser.name} Teaching Roster` : `${currentUser.programName || 'Academic Schedule'}`}
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('timetable')}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer"
          >
            <span>Full Weekly Timetable</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {mondaySlots.map((slot, idx) => {
            const isLive = activeSession?.timetableSlotId === slot.id;
            return (
              <div
                key={slot.id}
                className={`p-3.5 rounded-xl border space-y-2 transition-all ${
                  isLive ? 'bg-emerald-50/70 border-emerald-300 ring-1 ring-emerald-400 shadow-xs' : 'bg-slate-50/60 border-slate-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-slate-700 bg-white px-1.5 py-0.2 rounded border border-slate-200">
                    {slot.startTime} - {slot.endTime}
                  </span>
                  {isLive && (
                    <span className="text-[9px] font-bold bg-emerald-500 text-white px-1.5 py-0.2 rounded animate-pulse">
                      LIVE
                    </span>
                  )}
                </div>

                <div>
                  <span className="text-xs font-mono font-black text-indigo-700 block">
                    {slot.courseCode}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs truncate">
                    {slot.courseName}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {slot.facultyName} • <strong className="text-indigo-600">{slot.roomOrLab}</strong>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC SUBJECT-WISE SYLLABUS COMPLETION TRACKER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        {/* Header with Subject Selector Dropdown */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <h3 className="font-bold text-slate-900 text-sm">
                Subject-Wise Syllabus Completion Pace
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Select any course to view real delivery progress, completed micro-topics, and next upcoming lecture.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Subject:</span>
            <select
              value={selectedSubjectIndex}
              onChange={(e) => setSelectedSubjectIndex(Number(e.target.value))}
              aria-label="Select subject to view syllabus pace"
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
            >
              {mySubjects.map((sub, i) => (
                <option key={sub.id || i} value={i}>
                  {sub.code} — {sub.name} ({sub.program} Sem {sub.semester})
                </option>
              ))}
            </select>

            <button
              onClick={() => onNavigateTab('syllabus')}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1 cursor-pointer pl-2"
            >
              <span>Full Syllabus</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Subject Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {mySubjects.map((sub, i) => {
            const isSelected = selectedSubjectIndex === i;
            return (
              <button
                key={sub.id || i}
                onClick={() => setSelectedSubjectIndex(i)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 border ${
                  isSelected 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs' 
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <span>{sub.name}</span>
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                }`}>
                  Sem {sub.semester}
                </span>
              </button>
            );
          })}
        </div>

        {/* Selected Subject Progress Detail Card */}
        {currentSubject && (
          <div className="bg-slate-50/80 rounded-xl p-4 border border-slate-200 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono font-bold text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-md">
                    {currentSubject.code}
                  </span>
                  <span className="font-bold text-slate-900 text-sm">
                    {currentSubject.name}
                  </span>
                  <span className="text-[11px] font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {currentSubject.program} • Semester {currentSubject.semester}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Instructor: <strong>{currentSubject.facultyName}</strong> • Venue: <span className="text-indigo-600 font-semibold">{currentSubject.room}</span>
                </p>
              </div>

              <div className="text-right sm:shrink-0">
                <div className="text-lg font-black text-indigo-700 font-mono">
                  {currentSubject.delivered} / {currentSubject.total} Lectures
                </div>
                <div className="text-[11px] text-emerald-600 font-bold">
                  {Math.round((currentSubject.delivered / currentSubject.total) * 100)}% Syllabus Delivered
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="space-y-1.5">
              <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${Math.round((currentSubject.delivered / currentSubject.total) * 100)}%` }} 
                />
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                <span className="text-slate-600">
                  Last Completed (Lec {currentSubject.delivered}): <strong>{currentSubject.currentTopic}</strong>
                </span>
                <span className="text-emerald-700 font-semibold">
                  Next Scheduled (Lec {currentSubject.delivered + 1}): {currentSubject.nextTopic}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
