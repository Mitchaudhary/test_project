import React, { useState } from 'react';
import { 
  GraduationCap, 
  ShieldCheck, 
  UserCheck, 
  BookOpen, 
  Clock, 
  LogIn, 
  ArrowRight, 
  AlertCircle, 
  CheckCircle2, 
  Building2, 
  Users, 
  ChevronRight,
  Sparkles,
  School,
  Lock
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { UserProfile, ProgramId } from '../../types/attendance';

export const LoginPage: React.FC = () => {
  const { availableUsers, login } = useAttendance();
  const [activeRoleTab, setActiveRoleTab] = useState<'STUDENT' | 'FACULTY' | 'ADMIN'>('STUDENT');
  const [selectedSemesterCohort, setSelectedSemesterCohort] = useState<string>('mca_1');
  const [customRollOrEmail, setCustomRollOrEmail] = useState('');
  const [customPassword, setCustomPassword] = useState('lju2026');
  const [errorMsg, setErrorMsg] = useState('');

  // Segregate users
  const students = availableUsers.filter(u => u.role === 'STUDENT');
  const facultyMembers = availableUsers.filter(u => u.role === 'FACULTY');
  const adminMembers = availableUsers.filter(u => u.role === 'HOD' || u.role === 'SUPER_ADMIN');

  // Semester grouping for students
  const semesterCohorts = [
    { id: 'bca_1', programId: 'bca' as ProgramId, semester: 1, label: 'BCA Semester 1' },
    { id: 'bca_3', programId: 'bca' as ProgramId, semester: 3, label: 'BCA Semester 3' },
    { id: 'bca_5', programId: 'bca' as ProgramId, semester: 5, label: 'BCA Semester 5' },
    { id: 'mca_1', programId: 'mca' as ProgramId, semester: 1, label: 'MCA Semester 1' },
    { id: 'mca_3', programId: 'mca' as ProgramId, semester: 3, label: 'MCA Semester 3' },
    { id: 'msc_1', programId: 'msc_it' as ProgramId, semester: 1, label: 'M.Sc. IT Semester 1' },
    { id: 'msc_3', programId: 'msc_it' as ProgramId, semester: 3, label: 'M.Sc. IT Semester 3' },
  ];

  const currentCohort = semesterCohorts.find(c => c.id === selectedSemesterCohort) || semesterCohorts[0];
  const cohortStudents = students.filter(s => s.programId === currentCohort.programId && s.semester === currentCohort.semester);

  const handleCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const query = customRollOrEmail.trim().toLowerCase();

    if (!query) {
      setErrorMsg('Please enter your Roll Number or Email ID.');
      return;
    }

    const matchedUser = availableUsers.find(
      u => u.email.toLowerCase() === query || 
           (u.rollNumber && u.rollNumber.toLowerCase() === query) ||
           u.id.toLowerCase() === query
    );

    if (matchedUser) {
      login(matchedUser);
    } else {
      setErrorMsg('Account not found in university directory. Try selecting a profile below.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-indigo-500 selection:text-white">
      {/* Top Header */}
      <header className="border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-indigo-700 text-white flex items-center justify-center font-bold shadow-lg shadow-indigo-950/60">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-white text-base tracking-tight">
                  Lok Jagruti Kendra University (LJU)
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded border border-indigo-500/30">
                  ERP Portal
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Academic, Timetable & 75% Attendance Compliance Gateway
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              University 75% Ordinance Active
            </span>
            <span className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-4 h-4 text-indigo-400" />
              Academic Term 2026-27
            </span>
          </div>
        </div>
      </header>

      {/* Main Authentication Container */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: University Info & System Overview */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-900/40 text-indigo-300 border border-indigo-700/50">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Centralized Academic & Attendance Authentication
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Single Sign-On <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-indigo-200">
                  Student & Faculty Portal
                </span>
              </h2>
              <p className="text-sm text-slate-400 leading-relaxed">
                Log in to inspect your semester timetable, real-time subject-wise attendance (75% ordinance status), syllabus delivery progress, and daily lectures.
              </p>
            </div>

            {/* University 75% Rules Card */}
            <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 space-y-3.5 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-300 uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Attendance Ordinance Guidelines</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-emerald-950/40 border border-emerald-900/60 rounded-xl p-3">
                  <div className="font-bold text-emerald-300">75% & Above</div>
                  <div className="text-[11px] text-emerald-400/80 mt-0.5">Eligible for Term-End Final University Exams</div>
                </div>
                <div className="bg-rose-950/40 border border-rose-900/60 rounded-xl p-3">
                  <div className="font-bold text-rose-300">Below 75%</div>
                  <div className="text-[11px] text-rose-400/80 mt-0.5">Debarred Status • Mandatory Recovery Plan</div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                In this demo, each semester has <strong>2 students</strong>: one with safe attendance (&gt;75%) and one on the defaulter list (&lt;75%).
              </p>
            </div>

            {/* Quick credentials hint */}
            <div className="bg-indigo-950/30 border border-indigo-900/50 rounded-xl p-3.5 flex items-center justify-between text-xs text-indigo-300">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>Demo Password for all accounts:</span>
              </div>
              <code className="font-mono bg-indigo-900/60 px-2 py-0.5 rounded text-white font-bold">
                lju2026
              </code>
            </div>
          </div>

          {/* Right Column: Interactive Login Box */}
          <div className="lg:col-span-7 bg-slate-900/95 rounded-3xl border border-slate-800/90 shadow-2xl p-6 sm:p-8 space-y-6">
            
            {/* Role Switcher Tabs */}
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800/80">
              <button
                type="button"
                onClick={() => { setActiveRoleTab('STUDENT'); setErrorMsg(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'STUDENT'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <GraduationCap className="w-4 h-4" />
                <span>Student</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveRoleTab('FACULTY'); setErrorMsg(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'FACULTY'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                <span>Faculty</span>
              </button>
              <button
                type="button"
                onClick={() => { setActiveRoleTab('ADMIN'); setErrorMsg(''); }}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeRoleTab === 'ADMIN'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900/50'
                }`}
              >
                <School className="w-4 h-4" />
                <span>Admin / HOD</span>
              </button>
            </div>

            {/* TAB 1: STUDENT LOGIN */}
            {activeRoleTab === 'STUDENT' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    Select Your Semester Cohort
                  </label>
                  {/* Semester Chips */}
                  <div className="flex flex-wrap gap-1.5">
                    {semesterCohorts.map(cohort => {
                      const isSelected = cohort.id === selectedSemesterCohort;
                      return (
                        <button
                          key={cohort.id}
                          type="button"
                          onClick={() => setSelectedSemesterCohort(cohort.id)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-indigo-500 text-white shadow-sm shadow-indigo-500/30'
                              : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 hover:text-white border border-slate-700/60'
                          }`}
                        >
                          {cohort.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Cohort 2 Students (1 >75% Safe, 1 <75% Defaulter) */}
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                    <span>Students in {currentCohort.label} (2 Demo Profiles)</span>
                    <span className="text-slate-500 font-normal">Click to Sign In</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cohortStudents.map((student, idx) => {
                      const isSafe = !student.id.includes('risk') && !student.id.includes('aryan');
                      const approxPct = isSafe ? (88 + (idx % 4)) : (61 + (idx % 3));

                      return (
                        <div
                          key={student.id}
                          onClick={() => login(student)}
                          className="group relative p-3.5 bg-slate-950/80 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer flex flex-col justify-between"
                        >
                          <div className="flex items-start gap-3">
                            <img
                              src={student.avatar}
                              alt={student.name}
                              className="w-10 h-10 rounded-xl object-cover border border-slate-700 shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-1">
                                <h4 className="font-bold text-white text-sm truncate group-hover:text-indigo-300 transition-colors">
                                  {student.name}
                                </h4>
                                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-0.5 transition-all" />
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                {student.rollNumber}
                              </div>
                              <div className="text-[11px] text-slate-400 truncate">
                                {student.programName}
                              </div>
                            </div>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                              isSafe
                                ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                                : 'bg-rose-950 text-rose-300 border border-rose-800/60'
                            }`}>
                              {isSafe ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <AlertCircle className="w-3 h-3 text-rose-400" />}
                              {isSafe ? 'Above 75% (Eligible)' : 'Below 75% (Defaulter)'}
                            </span>
                            <span className="text-xs font-extrabold font-mono text-white">
                              ~{approxPct}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Or Custom Login Form */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] text-slate-400 mb-2 font-semibold">
                    Or Sign In using Student Roll Number / Email:
                  </div>
                  <form onSubmit={handleCustomLogin} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <input
                          type="text"
                          placeholder="e.g. 2026MCA014 or email"
                          value={customRollOrEmail}
                          onChange={(e) => setCustomRollOrEmail(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                      <div>
                        <input
                          type="password"
                          placeholder="Password (lju2026)"
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        />
                      </div>
                    </div>
                    {errorMsg && (
                      <div className="text-xs text-rose-400 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" />
                        <span>{errorMsg}</span>
                      </div>
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md shadow-indigo-950"
                    >
                      <LogIn className="w-4 h-4" />
                      <span>Authenticate Student & View Timetable</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB 2: FACULTY LOGIN */}
            {activeRoleTab === 'FACULTY' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <span>University Faculty Directory</span>
                  <span className="text-slate-500 font-normal">Click any professor to login</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[380px] overflow-y-auto pr-1">
                  {facultyMembers.map(faculty => (
                    <div
                      key={faculty.id}
                      onClick={() => login(faculty)}
                      className="p-3 bg-slate-950/80 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer flex items-center justify-between gap-3 group"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <img
                          src={faculty.avatar}
                          alt={faculty.name}
                          className="w-9 h-9 rounded-xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="font-bold text-white text-xs truncate group-hover:text-indigo-300 transition-colors">
                            {faculty.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {faculty.designation || faculty.specialization}
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-1 rounded-lg border border-indigo-800/60 shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                        Login
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 3: ADMIN / HOD LOGIN */}
            {activeRoleTab === 'ADMIN' && (
              <div className="space-y-4">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Administrative Leadership & HOD Access
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {adminMembers.map(admin => (
                    <div
                      key={admin.id}
                      onClick={() => login(admin)}
                      className="p-4 bg-slate-950/80 hover:bg-slate-800/80 rounded-2xl border border-slate-800 hover:border-indigo-500/60 transition-all cursor-pointer flex items-center justify-between gap-4 group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={admin.avatar}
                          alt={admin.name}
                          className="w-12 h-12 rounded-2xl object-cover border border-slate-700 shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-white text-sm group-hover:text-indigo-300 transition-colors">
                              {admin.name}
                            </h4>
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
                              {admin.role}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">
                            {admin.designation}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500">
                            {admin.email}
                          </p>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 text-white shadow-md shadow-indigo-950 shrink-0 group-hover:bg-indigo-500 transition-all">
                        Access ERP
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-900/40 py-3.5 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Lok Jagruti Kendra University • S.G. Highway, Ahmedabad, Gujarat 382210
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <span>Ordinance Clause 14(B): 75% Minimum Attendance Threshold</span>
            <span>Academic Session July - Nov 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
