import React, { useState } from 'react';
import { 
  BookOpen, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  User, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter, 
  Sparkles,
  Layers,
  ChevronRight,
  ChevronDown,
  Award
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { MicroTopicLesson } from '../../types/attendance';

export const GranularSyllabusTracker: React.FC<{ isEditable?: boolean }> = ({ isEditable = false }) => {
  const { courses, selectedCourseId, setSelectedCourseId, toggleMicroTopic, currentUser } = useAttendance();
  const [selectedCohortFilter, setSelectedCohortFilter] = useState<string>(() => {
    if (currentUser.role === 'STUDENT' && currentUser.programId) {
      return `${currentUser.programId}_sem${currentUser.semester || 1}`;
    }
    return 'all';
  });
  const [filterMode, setFilterMode] = useState<'all' | 'completed' | 'pending'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Auto-sync for students: filter strictly to their program & semester
  const isStudent = currentUser.role === 'STUDENT';
  
  // Cohorts list for filtering
  const cohortOptions = [
    { id: 'all', label: 'All University Courses' },
    { id: 'mca_sem1', programId: 'mca', semester: 1, label: 'MCA (Sem 1)' },
    { id: 'mca_sem3', programId: 'mca', semester: 3, label: 'MCA (Sem 3)' },
    { id: 'msc_it_sem1', programId: 'msc_it', semester: 1, label: 'M.Sc. IT (Sem 1)' },
    { id: 'msc_it_sem3', programId: 'msc_it', semester: 3, label: 'M.Sc. IT (Sem 3)' },
    { id: 'bca_sem1', programId: 'bca', semester: 1, label: 'BCA (Sem 1)' },
    { id: 'bca_sem3', programId: 'bca', semester: 3, label: 'BCA (Sem 3)' },
    { id: 'bca_sem5', programId: 'bca', semester: 5, label: 'BCA (Sem 5)' },
  ];

  const displayedCourses = React.useMemo(() => {
    if (isStudent && currentUser.programId) {
      const match = courses.filter(c => c.programId === currentUser.programId && c.semester === (currentUser.semester || 1));
      if (match.length > 0) return match;
    }
    if (selectedCohortFilter === 'all') {
      if (currentUser.role === 'FACULTY') {
        const myCourses = courses.filter(c => c.facultyId === currentUser.id || c.facultyName === currentUser.name);
        if (myCourses.length > 0) return myCourses;
      }
      return courses.slice(0, 8);
    }
    const opt = cohortOptions.find(o => o.id === selectedCohortFilter);
    if (opt && opt.programId) {
      return courses.filter(c => c.programId === opt.programId && c.semester === opt.semester);
    }
    return courses;
  }, [courses, isStudent, currentUser, selectedCohortFilter]);

  // Ensure currentCourse belongs to displayedCourses
  const currentCourse = displayedCourses.find(c => c.id === selectedCourseId) || displayedCourses[0] || courses[0];

  React.useEffect(() => {
    if (displayedCourses.length > 0 && !displayedCourses.some(c => c.id === selectedCourseId)) {
      setSelectedCourseId(displayedCourses[0].id);
    }
  }, [displayedCourses, selectedCourseId, setSelectedCourseId]);

  const completedLessons = currentCourse.lessons.filter(l => l.isCompleted);
  const totalPlanned = currentCourse.totalLecturesPlanned || currentCourse.lessons.length;
  const completionPercentage = totalPlanned > 0 ? Math.round((completedLessons.length / totalPlanned) * 100) : 0;

  // Filter lessons
  const filteredLessons = currentCourse.lessons.filter(lesson => {
    const matchesSearch = lesson.microTopicTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lesson.moduleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          `Lec ${lesson.lectureNumber}`.toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (filterMode === 'completed') return lesson.isCompleted;
    if (filterMode === 'pending') return !lesson.isCompleted;
    return true;
  });

  // Group lessons by module name
  const groupedByModule: { [moduleName: string]: MicroTopicLesson[] } = {};
  filteredLessons.forEach(lesson => {
    if (!groupedByModule[lesson.moduleName]) {
      groupedByModule[lesson.moduleName] = [];
    }
    groupedByModule[lesson.moduleName].push(lesson);
  });

  return (
    <div className="space-y-6">
      {/* Header Context Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span>40-Lecture Micro-Topic Syllabus & Lesson Plan</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {isStudent 
              ? `Showing syllabus and delivery status for your semester: ${currentUser.programName || `${currentUser.programId?.toUpperCase()} Sem ${currentUser.semester}`}`
              : 'Granular tracking of each lecture topic, module coverage, and delivery milestones.'}
          </p>
        </div>

        {/* Cohort Switcher for Faculty & Admin */}
        {!isStudent && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Cohort:</span>
            <select
              value={selectedCohortFilter}
              onChange={(e) => setSelectedCohortFilter(e.target.value)}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-600 cursor-pointer shadow-2xs"
            >
              {cohortOptions.map(opt => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Course Selector Cards with FULL Subject Names */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {displayedCourses.map(course => {
          const done = course.lessons.filter(l => l.isCompleted).length;
          const total = course.totalLecturesPlanned || course.lessons.length;
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const isSelected = course.id === currentCourse.id;

          return (
            <button
              key={course.id}
              onClick={() => setSelectedCourseId(course.id)}
              className={`p-3.5 rounded-2xl text-left transition-all cursor-pointer border flex flex-col justify-between gap-2.5 ${
                isSelected
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-950/20'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-2xs'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1">
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-indigo-50 text-indigo-700 border border-indigo-100'
                  }`}>
                    {course.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold ${
                    isSelected ? 'text-indigo-100' : 'text-emerald-600'
                  }`}>
                    {pct}% Done
                  </span>
                </div>
                <h4 className="font-bold text-xs line-clamp-1 leading-snug">
                  {course.name}
                </h4>
                <p className={`text-[11px] truncate mt-0.5 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                  Prof: {course.facultyName}
                </p>
              </div>

              {/* Progress bar */}
              <div className="space-y-1">
                <div className={`w-full h-1.5 rounded-full overflow-hidden ${isSelected ? 'bg-white/20' : 'bg-slate-200'}`}>
                  <div
                    className={`h-full rounded-full ${isSelected ? 'bg-white' : 'bg-indigo-600'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className={`flex justify-between text-[10px] ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                  <span>Delivered: {done}/{total}</span>
                  <span>{course.programId.toUpperCase()} Sem {course.semester}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Hero Lesson Plan Header */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-indigo-800/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold tracking-wider uppercase mb-1">
              <BookOpen className="w-4 h-4" />
              <span>LJ University • Micro-Topic Lesson Plan System</span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {currentCourse.code}: {currentCourse.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1">
              Faculty: <strong className="text-white">{currentCourse.facultyName}</strong> • {currentCourse.defaultRoom} • 4 Credits
            </p>
          </div>

          {/* Progress Circular Gauge */}
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/10 shrink-0">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <svg className="w-16 h-16 transform -rotate-90">
                <circle cx="32" cy="32" r="26" stroke="currentColor" strokeWidth="5" className="text-white/20" fill="transparent" />
                <circle
                  cx="32"
                  cy="32"
                  r="26"
                  stroke="currentColor"
                  strokeWidth="5"
                  className="text-emerald-400 transition-all duration-1000 ease-out"
                  strokeDasharray={2 * Math.PI * 26}
                  strokeDashoffset={2 * Math.PI * 26 * (1 - completionPercentage / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-base font-bold text-white">{completionPercentage}%</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] text-indigo-200 uppercase font-semibold">Semester Target</div>
              <div className="text-sm font-bold text-white">
                {completedLessons.length} / {totalPlanned} Lectures
              </div>
              <div className="text-[11px] text-slate-300">
                {totalPlanned - completedLessons.length} Micro-topics Pending
              </div>
            </div>
          </div>
        </div>

        {/* Milestone Indicator */}
        <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Delivered Modules</div>
              <div className="text-slate-300 text-[11px]">{completedLessons.length} of {totalPlanned} Lectures Completed</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-indigo-500/20 text-indigo-300 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Remaining Syllabus</div>
              <div className="text-slate-300 text-[11px]">{Math.max(0, totalPlanned - completedLessons.length)} Lectures to Cover</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-cyan-500/20 text-cyan-300 rounded-lg">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="font-semibold text-white">Term Milestone Target</div>
              <div className="text-slate-300 text-[11px]">75% Attendance + 40-Lec Plan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, keyword, or Lec number..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-slate-500 uppercase mr-1">Filter:</span>
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'all' ? 'bg-indigo-50 text-indigo-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            All ({currentCourse.lessons.length})
          </button>
          <button
            onClick={() => setFilterMode('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'completed' ? 'bg-emerald-50 text-emerald-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Completed ({completedLessons.length})
          </button>
          <button
            onClick={() => setFilterMode('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterMode === 'pending' ? 'bg-amber-50 text-amber-600 font-bold' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Pending ({currentCourse.lessons.length - completedLessons.length})
          </button>
        </div>
      </div>

      {/* Grouped Modules & Micro-Topic Lesson Rows */}
      <div className="space-y-4">
        {Object.keys(groupedByModule).map(moduleName => {
          const moduleLessons = groupedByModule[moduleName];
          const moduleCompletedCount = moduleLessons.filter(l => l.isCompleted).length;
          const modulePct = Math.round((moduleCompletedCount / moduleLessons.length) * 100);

          return (
            <div key={moduleName} className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs overflow-hidden">
              {/* Module Header */}
              <div className="p-4 bg-slate-50/70 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="p-1.5 bg-indigo-50 text-indigo-700 rounded-lg">
                    <Layers className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800">
                    {moduleName}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded-full ${
                    modulePct === 100 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {moduleCompletedCount}/{moduleLessons.length} Covered ({modulePct}%)
                  </span>
                </div>
              </div>

              {/* Individual Micro-Topics */}
              <div className="p-3 divide-y divide-slate-100">
                {moduleLessons.map(lesson => (
                  <div
                    key={lesson.id}
                    className={`py-3 px-3 rounded-xl transition-all flex items-start justify-between gap-3 ${
                      lesson.isCompleted ? 'bg-emerald-50/20' : 'hover:bg-slate-50/60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {/* Checkbox button */}
                      <button
                        type="button"
                        disabled={!isEditable && currentUser.role === 'STUDENT'}
                        onClick={() => toggleMicroTopic(currentCourse.id, lesson.id)}
                        className={`mt-0.5 transition-transform ${
                          isEditable || currentUser.role !== 'STUDENT'
                            ? 'cursor-pointer hover:scale-110'
                            : 'cursor-default'
                        }`}
                        title={isEditable || currentUser.role !== 'STUDENT' ? 'Click to toggle completed status' : 'Syllabus status'}
                      >
                        {lesson.isCompleted ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                        ) : (
                          <Circle className="w-5 h-5 text-slate-300 hover:text-indigo-400" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded">
                            Lec {lesson.lectureNumber.toString().padStart(2, '0')}
                          </span>
                          <span className={`text-xs font-semibold ${lesson.isCompleted ? 'text-slate-800' : 'text-slate-900'}`}>
                            {lesson.microTopicTitle}
                          </span>
                        </div>

                        {lesson.isCompleted && lesson.completedDate && (
                          <div className="flex items-center gap-3 text-[11px] text-emerald-700 mt-1 font-mono">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              Taught on: {lesson.completedDate}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500 font-sans">
                              <User className="w-3 h-3" />
                              {currentCourse.facultyName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        lesson.isCompleted ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {lesson.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
