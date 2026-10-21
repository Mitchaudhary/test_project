import React, { useState } from 'react';
import { 
  X, 
  Users, 
  Clock, 
  MapPin, 
  Play, 
  Square, 
  Sparkles, 
  Check, 
  AlertCircle, 
  Maximize2, 
  Minimize2,
  RefreshCw,
  Award,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { DynamicQRCode } from '../common/DynamicQRCode';
import { ALL_STUDENTS_ROSTER } from '../../data/mockData';

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveSessionModal: React.FC<LiveSessionModalProps> = ({ isOpen, onClose }) => {
  const { 
    activeSession, 
    endLectureSession, 
    rotateQRToken, 
    attendanceRecords,
    manualRollCallUpdate,
    courses,
    startLectureSession
  } = useAttendance();

  const [isFullScreen, setIsFullScreen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.id || 'bca102');
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [classroomInput, setClassroomInput] = useState('Room 101');
  const [geoFence, setGeoFence] = useState(true);

  if (!isOpen) return null;

  // If no active session, show launcher form
  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];
  const allLessons = selectedCourse ? selectedCourse.lessons : [];

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    startLectureSession({
      courseId: selectedCourseId,
      lessonId: selectedTopicId || (allLessons[0]?.id),
      roomOrLab: classroomInput || selectedCourse?.defaultRoom || 'Room 101',
      durationMinutes: 60,
    });
  };

  // Find attendance for active session
  const currentSessionRecords = activeSession
    ? attendanceRecords.filter(r => r.sessionId === activeSession.id)
    : [];

  const targetProgramId = activeSession?.programId || selectedCourse?.programId || 'bca';
  const eligibleRoster = ALL_STUDENTS_ROSTER.filter(s => s.programId === targetProgramId);
  const sessionStudentsRoster = eligibleRoster.length > 0 ? eligibleRoster : ALL_STUDENTS_ROSTER.slice(0, 10);

  const checkedInStudentIds = new Set(currentSessionRecords.map(r => r.studentId));

  const handleSimulateNextStudent = () => {
    if (!activeSession) return;
    const notYetCheckedIn = sessionStudentsRoster.filter(s => !checkedInStudentIds.has(s.id));
    if (notYetCheckedIn.length > 0) {
      const randomStudent = notYetCheckedIn[0];
      manualRollCallUpdate(randomStudent.id, activeSession.id, 'PRESENT');
    }
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-slate-950/80 backdrop-blur-xs animate-in fade-in duration-200 ${isFullScreen ? 'p-0' : ''}`}>
      <div className={`bg-white w-full rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-300 ${
        isFullScreen ? 'h-full rounded-none max-w-none' : 'max-w-4xl max-h-[90vh]'
      }`}>
        {/* Top Navbar */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <span className="p-2 bg-indigo-600 rounded-xl">
              <BookOpen className="w-5 h-5 text-white" />
            </span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base text-white">
                  {activeSession && activeSession.isActive ? 'Live Lecture Presentation Mode' : 'Launch New Lecture Attendance Session'}
                </h3>
                {activeSession && activeSession.isActive && (
                  <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                    BROADCASTING
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">
                {activeSession ? `${activeSession.courseCode}: ${activeSession.courseName}` : 'Select course and syllabus topic'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeSession && activeSession.isActive && (
              <button
                type="button"
                onClick={() => setIsFullScreen(!isFullScreen)}
                title={isFullScreen ? 'Exit Full Screen' : 'Enter Projector Full Screen'}
                className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                {isFullScreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
          {!activeSession || !activeSession.isActive ? (
            /* LAUNCH SESSION FORM */
            <form onSubmit={handleStart} className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
              <div>
                <h4 className="text-base font-bold text-slate-900">Start Lecture Session</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  This generates a rolling cryptographic QR code that updates every 15s to prevent screenshot sharing among students.
                </p>
              </div>

              {/* Course Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Course
                </label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => {
                    setSelectedCourseId(e.target.value);
                    const c = courses.find(item => item.id === e.target.value);
                    if (c && c.lessons[0]) {
                      setSelectedTopicId(c.lessons[0].id);
                      setClassroomInput(c.defaultRoom);
                    }
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none"
                >
                  {courses.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.code} - {c.name} ({c.facultyName})
                    </option>
                  ))}
                </select>
              </div>

              {/* Syllabus Topic Linked to this lecture */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Link Micro-Topic Lesson (Syllabus Tracker)
                </label>
                <select
                  value={selectedTopicId}
                  onChange={(e) => setSelectedTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium focus:bg-white focus:border-indigo-600 outline-none"
                >
                  {selectedCourse?.lessons.map(l => (
                    <option key={l.id} value={l.id}>
                      Lec {l.lectureNumber.toString().padStart(2, '0')}: {l.microTopicTitle} {l.isCompleted ? '✓ (Completed)' : '○ (Pending)'}
                    </option>
                  ))}
                </select>
                <p className="text-[11px] text-slate-500 mt-1">
                  Once marked, this micro-topic will be registered as delivered in the semester plan.
                </p>
              </div>

              {/* Classroom & Geo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Classroom / Lab
                  </label>
                  <input
                    type="text"
                    value={classroomInput}
                    onChange={(e) => setClassroomInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-indigo-600 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Security Policy
                  </label>
                  <label className="flex items-center gap-2 p-2.5 bg-slate-50 rounded-xl border border-slate-200 cursor-pointer text-xs">
                    <input
                      type="checkbox"
                      checked={geoFence}
                      onChange={(e) => setGeoFence(e.target.checked)}
                      className="rounded text-indigo-600"
                    />
                    <span className="font-medium text-slate-700">Campus GPS Geofence (100m)</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-white" />
                Launch Dynamic QR Presentation
              </button>
            </form>
          ) : (
            /* ACTIVE BROADCASTING DASHBOARD */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Big Dynamic QR Code & Controls */}
              <div className="lg:col-span-6 space-y-4">
                <DynamicQRCode
                  token={activeSession.qrSecretToken}
                  otpCode={activeSession.otpCode}
                  refreshIntervalSec={activeSession.refreshIntervalSec}
                  lastUpdatedAt={activeSession.tokenUpdatedAt}
                  onManualRefresh={rotateQRToken}
                  courseCode={activeSession.courseCode}
                  topicTitle={activeSession.coveredLessonTitle || ''}
                  classroom={activeSession.roomOrLab}
                  isFullScreen={isFullScreen}
                />

                {/* Session Action Controls */}
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleSimulateNextStudent}
                    className="flex-1 py-2.5 px-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-600" />
                    Simulate Student Scan
                  </button>
                  <button
                    type="button"
                    onClick={endLectureSession}
                    className="py-2.5 px-4 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Square className="w-3.5 h-3.5 fill-rose-600" />
                    End Session
                  </button>
                </div>
              </div>

              {/* Right Column: Live Roster & Real-Time Check-In Stream */}
              <div className="lg:col-span-6 space-y-4">
                {/* Stats Bar */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Present</span>
                    <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                      {currentSessionRecords.length}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Absent</span>
                    <div className="text-2xl font-bold text-slate-400 mt-0.5">
                      {Math.max(0, sessionStudentsRoster.length - currentSessionRecords.length)}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-500 uppercase">Turnout</span>
                    <div className="text-2xl font-bold text-indigo-600 mt-0.5">
                      {Math.round((currentSessionRecords.length / sessionStudentsRoster.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Live Check-In Feed */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-4 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                        Live Attendance Roster
                      </span>
                    </div>
                    <span className="text-xs text-slate-500">
                      {currentSessionRecords.length} / {sessionStudentsRoster.length} Students
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 pr-1 divide-y divide-slate-50">
                    {sessionStudentsRoster.map(student => {
                      const isPresent = checkedInStudentIds.has(student.id);
                      const record = currentSessionRecords.find(r => r.studentId === student.id);

                      return (
                        <div
                          key={student.id}
                          className="pt-1.5 first:pt-0 flex items-center justify-between text-xs py-1"
                        >
                          <div className="flex items-center gap-2.5">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                              isPresent ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'
                            }`}>
                              {student.name.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-slate-800 flex items-center gap-1.5">
                                {student.name}
                                {student.id === 'student_sarah' && (
                                  <span className="text-[9px] bg-indigo-50 text-indigo-600 px-1 py-0.2 rounded font-mono">Top Attender</span>
                                )}
                              </div>
                              <div className="text-[10px] font-mono text-slate-400">{student.roll}</div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isPresent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                {record?.timestamp ? new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Present'}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => manualRollCallUpdate(student.id, activeSession.id, 'PRESENT')}
                                className="px-2 py-0.5 rounded-md text-[10px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
                              >
                                Mark Present
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
