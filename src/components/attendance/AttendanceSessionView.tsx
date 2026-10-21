import React, { useState } from 'react';
import { 
  QrCode, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BookOpen, 
  Play, 
  Square, 
  Sparkles, 
  Layers,
  MapPin,
  Calendar,
  Coffee,
  ShieldCheck,
  Check,
  UserCheck
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { DynamicQRCode } from '../common/DynamicQRCode';
import { ALL_STUDENTS_ROSTER } from '../../data/mockData';

export const AttendanceSessionView: React.FC<{ onOpenScanner?: () => void }> = ({ onOpenScanner }) => {
  const { 
    currentUser, 
    activeSession, 
    courses, 
    startLectureSession, 
    endLectureSession, 
    rotateQRToken,
    attendanceRecords,
    manualRollCallUpdate,
    markStudentAttendance,
    getStudentAttendanceSummary
  } = useAttendance();

  const [selectedCourseId, setSelectedCourseId] = useState(courses[1]?.id || 'bca102'); // Web Tech
  const [selectedLessonId, setSelectedLessonId] = useState('wt_28');
  const [roomInput, setRoomInput] = useState('Room 101');
  const [mode, setMode] = useState<'qr' | 'roll_call'>('roll_call');
  const [otpInput, setOtpInput] = useState('');
  const [verifyStatus, setVerifyStatus] = useState<string | null>(null);

  const studentSummary = currentUser.role === 'STUDENT' ? getStudentAttendanceSummary(currentUser.id) : null;

  const selectedCourse = courses.find(c => c.id === selectedCourseId) || courses[0];

  const handleStartSession = (e: React.FormEvent) => {
    e.preventDefault();
    startLectureSession({
      courseId: selectedCourseId,
      lessonId: selectedLessonId,
      roomOrLab: roomInput,
      durationMinutes: 60,
    });
  };

  // Records for currently active session
  const currentSessionRecords = activeSession
    ? attendanceRecords.filter(r => r.sessionId === activeSession.id)
    : [];

  const handleSimulateStudentScan = () => {
    if (!activeSession) return;
    const recordedIds = new Set(currentSessionRecords.map(r => r.studentId));
    const nextStudent = ALL_STUDENTS_ROSTER.find(s => !recordedIds.has(s.id));
    if (nextStudent) {
      markStudentAttendance(activeSession.qrSecretToken, nextStudent.id);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <QrCode className="w-4 h-4" />
            <span>LJ University • Real-Time Attendance Engine</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Lecture Attendance & Roll Call Console
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Supports Dynamic Anti-Proxy 15s Rotating QR Codes, 6-digit OTPs, and Manual Classroom Roll-Call.
          </p>
        </div>

        {currentUser.role === 'STUDENT' && (
          <button
            onClick={onOpenScanner}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <QrCode className="w-4 h-4" />
            <span>Launch Camera Scanner</span>
          </button>
        )}
      </div>

      {/* IF STUDENT LOGGED IN: Render Personal Attendance Register & 75% Threshold Status */}
      {currentUser.role === 'STUDENT' ? (
        <div className="space-y-6">
          {/* Active Lecture Banner if Faculty is broadcasting */}
          {activeSession && activeSession.isActive && (
            <div className="p-5 bg-gradient-to-r from-emerald-950 via-teal-950 to-slate-900 border border-emerald-600/40 rounded-2xl text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                  Live Lecture Active
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {activeSession.courseCode} — {activeSession.courseName}
                </h3>
                <p className="text-xs text-slate-300">
                  Instructor: <strong>{activeSession.facultyName}</strong> • Room: <strong>{activeSession.roomOrLab}</strong>
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const res = markStudentAttendance(activeSession.qrSecretToken, currentUser.id);
                    setVerifyStatus(res.message);
                  }}
                  className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer"
                >
                  Mark Present (One-Click)
                </button>
              </div>
            </div>
          )}

          {verifyStatus && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between">
              <span>{verifyStatus}</span>
              <button onClick={() => setVerifyStatus(null)} className="text-emerald-900 font-bold ml-2">×</button>
            </div>
          )}

          {/* Student Aggregate Summary Card */}
          {studentSummary && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Aggregate Turnout</span>
                <div className={`text-3xl font-black mt-1 font-mono ${
                  studentSummary.isEligible ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {studentSummary.overallPercentage}%
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {studentSummary.totalAttended} / {studentSummary.totalConducted} Lectures
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">75% Ordinance Status</span>
                <div className="mt-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                    studentSummary.isEligible 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                      : 'bg-rose-100 text-rose-800 border border-rose-200'
                  }`}>
                    {studentSummary.isEligible ? 'Eligible for Exams' : 'Debarred (<75%)'}
                  </span>
                </div>
                <div className="text-xs text-slate-500 mt-2">
                  {studentSummary.isEligible 
                    ? `Safe margin: ${studentSummary.safeMargin} lectures`
                    : `Must attend next ${studentSummary.neededToRecover} lectures`}
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
                <span className="text-xs font-bold text-slate-500 uppercase">Registered Program</span>
                <div className="text-base font-bold text-slate-900 mt-1">
                  {currentUser.programName || `${currentUser.programId?.toUpperCase()} Sem ${currentUser.semester || 1}`}
                </div>
                <div className="text-xs font-mono text-slate-500 mt-1">
                  Roll: {currentUser.rollNumber}
                </div>
              </div>
            </div>
          )}

          {/* Subject Breakdown Table */}
          {studentSummary && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h4 className="font-bold text-slate-900 text-sm">
                  Course-Wise Attendance Register (Semester {currentUser.semester || 1})
                </h4>
                <span className="text-xs text-slate-500 font-mono">
                  Minimum Required: 75%
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Course Code</th>
                      <th className="pb-3">Subject Name</th>
                      <th className="pb-3">Faculty</th>
                      <th className="pb-3">Turnout</th>
                      <th className="pb-3">Percentage</th>
                      <th className="pb-3 text-right">75% Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentSummary.subjectBreakdown.map((subj) => (
                      <tr key={subj.courseId} className="hover:bg-slate-50/70">
                        <td className="py-3 font-mono font-bold text-indigo-700">{subj.courseCode}</td>
                        <td className="py-3 font-semibold text-slate-900">{subj.courseName}</td>
                        <td className="py-3 text-slate-600">{subj.facultyName}</td>
                        <td className="py-3 text-slate-700 font-mono">{subj.attended} / {subj.total}</td>
                        <td className="py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold font-mono">{subj.percentage}%</span>
                            <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${subj.percentage >= 75 ? 'bg-emerald-500' : 'bg-rose-500'}`}
                                style={{ width: `${subj.percentage}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 text-right">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            subj.percentage >= 75
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}>
                            {subj.percentage >= 75 ? 'Safe' : 'Shortage'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : !activeSession || !activeSession.isActive ? (
        /* LAUNCH NEW SESSION FORM (FACULTY ONLY) */
        <div className="max-w-xl mx-auto bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div>
            <h3 className="font-bold text-slate-900 text-base">Start Lecture Attendance Broadcast</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Select course and tie this session to an atomic micro-topic lesson from the syllabus.
            </p>
          </div>

          <form onSubmit={handleStartSession} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Course
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  const c = courses.find(item => item.id === e.target.value);
                  if (c && c.lessons[0]) setSelectedLessonId(c.lessons[0].id);
                }}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>
                    {c.code} - {c.name} ({c.facultyName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Link Micro-Topic Lesson Covered Today
              </label>
              <select
                value={selectedLessonId}
                onChange={(e) => setSelectedLessonId(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                {selectedCourse.lessons.map(l => (
                  <option key={l.id} value={l.id}>
                    Lec {l.lectureNumber.toString().padStart(2, '0')}: {l.microTopicTitle} {l.isCompleted ? '✓ (Completed)' : '○ (Pending)'}
                  </option>
                ))}
              </select>
              <p className="text-[11px] text-slate-500 mt-1">
                Once attendance is initiated, this micro-topic will be linked and recorded in syllabus progress.
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Classroom Venue
              </label>
              <input
                type="text"
                value={roomInput}
                onChange={(e) => setRoomInput(e.target.value)}
                placeholder="e.g. Room 101 / Comp Lab 1"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Launch Live Lecture Session</span>
            </button>
          </form>
        </div>
      ) : (
        /* ACTIVE SESSION BROADCAST */
        <div className="space-y-6">
          {/* Mode Switcher: Dynamic QR vs Manual Roll Call */}
          <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase mr-1">Attendance Method:</span>
              <button
                type="button"
                onClick={() => setMode('qr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'qr' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <QrCode className="w-3.5 h-3.5" />
                Dynamic Anti-Proxy QR
              </button>
              <button
                type="button"
                onClick={() => setMode('roll_call')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  mode === 'roll_call' ? 'bg-indigo-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserCheck className="w-3.5 h-3.5" />
                Manual Roll Call Matrix
              </button>
            </div>

            <button
              type="button"
              onClick={endLectureSession}
              className="px-3.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Square className="w-3.5 h-3.5 fill-rose-600" />
              <span>Lock & End Session</span>
            </button>
          </div>

          {mode === 'qr' ? (
            /* QR PROJECTOR VIEW */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
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
                />

                <button
                  type="button"
                  onClick={handleSimulateStudentScan}
                  className="w-full py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>Simulate Next Student QR Scan</span>
                </button>
              </div>

              {/* Roster counter */}
              <div className="lg:col-span-6 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Present</span>
                    <div className="text-2xl font-black text-emerald-600 mt-0.5">
                      {currentSessionRecords.filter(r => r.status === 'PRESENT').length}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Absent</span>
                    <div className="text-2xl font-black text-slate-400 mt-0.5">
                      {Math.max(0, ALL_STUDENTS_ROSTER.length - currentSessionRecords.filter(r => r.status === 'PRESENT').length)}
                    </div>
                  </div>
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Turnout</span>
                    <div className="text-2xl font-black text-indigo-600 mt-0.5">
                      {Math.round((currentSessionRecords.filter(r => r.status === 'PRESENT').length / ALL_STUDENTS_ROSTER.length) * 100)}%
                    </div>
                  </div>
                </div>

                {/* Real-time feed */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs p-4 flex flex-col h-[340px]">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-800">
                    <span>Live Verified Roster</span>
                    <span className="text-slate-400 font-mono">
                      {currentSessionRecords.length}/{ALL_STUDENTS_ROSTER.length} Scanned
                    </span>
                  </div>

                  <div className="flex-1 overflow-y-auto mt-2 space-y-1.5 divide-y divide-slate-50">
                    {ALL_STUDENTS_ROSTER.map(student => {
                      const record = currentSessionRecords.find(r => r.studentId === student.id);
                      const isPresent = record?.status === 'PRESENT';

                      return (
                        <div key={student.id} className="pt-1.5 first:pt-0 flex items-center justify-between text-xs py-1">
                          <div>
                            <div className="font-semibold text-slate-900">{student.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{student.roll}</div>
                          </div>
                          <div>
                            {isPresent ? (
                              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                {new Date(record.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => manualRollCallUpdate(student.id, activeSession.id, 'PRESENT')}
                                className="px-2 py-0.5 rounded text-[10px] font-medium text-slate-500 hover:text-indigo-600 hover:bg-slate-100 border border-slate-200 cursor-pointer"
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
          ) : (
            /* MANUAL ROLL CALL MATRIX */
            <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">
                    Manual Roll Call Register • {activeSession.courseCode} ({activeSession.roomOrLab})
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click status badges to atomically toggle student state between Present, Absent, and Official Leave.
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                      <th className="pb-3">Roll No</th>
                      <th className="pb-3">Student Name</th>
                      <th className="pb-3">Current Status</th>
                      <th className="pb-3 text-right">Quick Mark Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ALL_STUDENTS_ROSTER.map(student => {
                      const record = currentSessionRecords.find(r => r.studentId === student.id);
                      const currentStatus = record?.status || 'ABSENT';

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/70">
                          <td className="py-3 font-mono font-bold text-slate-700">{student.roll}</td>
                          <td className="py-3 font-semibold text-slate-900">{student.name}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              currentStatus === 'PRESENT'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : currentStatus === 'LEAVE'
                                ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                : 'bg-rose-50 text-rose-700 border border-rose-200'
                            }`}>
                              {currentStatus}
                            </span>
                          </td>
                          <td className="py-3 text-right space-x-1.5">
                            <button
                              type="button"
                              onClick={() => manualRollCallUpdate(student.id, activeSession.id, 'PRESENT')}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                currentStatus === 'PRESENT' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              P
                            </button>
                            <button
                              type="button"
                              onClick={() => manualRollCallUpdate(student.id, activeSession.id, 'ABSENT')}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                currentStatus === 'ABSENT' ? 'bg-rose-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              A
                            </button>
                            <button
                              type="button"
                              onClick={() => manualRollCallUpdate(student.id, activeSession.id, 'LEAVE')}
                              className={`px-2 py-1 rounded-md text-[10px] font-bold transition-colors cursor-pointer ${
                                currentStatus === 'LEAVE' ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              }`}
                            >
                              L
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
