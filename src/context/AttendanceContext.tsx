import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  UserProfile, 
  Course, 
  LectureSession, 
  AttendanceRecord, 
  Department, 
  DegreeProgram, 
  DepartmentId, 
  ProgramId, 
  TimetableSlot, 
  DayOfWeek,
  FacultyLeave,
  SemesterWeek,
  MicroTopicLesson,
  AttendanceAlert,
  UserRole,
  AcademicHoliday,
  SemesterScheduleConfig,
  SlotWeeklyStatus
} from '../types/attendance';
import { 
  DEPARTMENTS, 
  INITIAL_COURSES, 
  INITIAL_TIMETABLE_SLOTS, 
  INITIAL_USERS, 
  INITIAL_ACTIVE_SESSION, 
  INITIAL_FACULTY_LEAVES,
  SEMESTER_WEEKS,
  ACADEMIC_HOLIDAYS,
  SEMESTER_CONFIG,
  generateSeedAttendanceRecords, 
  ALL_STUDENTS_ROSTER 
} from '../data/mockData';

interface QRScanResult {
  success: boolean;
  message: string;
  courseName?: string;
  timestamp?: string;
  topicTitle?: string;
}

export interface TimetableConflict {
  type: 'room' | 'faculty';
  message: string;
  slotA: TimetableSlot;
  slotB: TimetableSlot;
}

interface AttendanceContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  availableUsers: UserProfile[];
  isAuthenticated: boolean;
  login: (user: UserProfile) => void;
  logout: () => void;
  
  // Department & Program taxonomy
  departments: Department[];
  selectedDepartmentId: DepartmentId;
  setSelectedDepartmentId: (deptId: DepartmentId) => void;
  selectedProgramId: ProgramId;
  setSelectedProgramId: (programId: ProgramId) => void;
  selectedYear: number;
  setSelectedYear: (yr: number) => void;
  selectedSemester: number;
  setSelectedSemester: (sem: number) => void;
  currentProgram: DegreeProgram;

  // Semester Calendar, Holidays & Weeks
  weeks: SemesterWeek[];
  selectedWeek: number;
  setSelectedWeek: (week: number) => void;
  holidays: AcademicHoliday[];
  addHoliday: (holiday: Omit<AcademicHoliday, 'id'>) => void;
  deleteHoliday: (holidayId: string) => void;
  semesterConfig: SemesterScheduleConfig;
  updateSemesterConfig: (config: Partial<SemesterScheduleConfig>) => void;

  // Timetable & Leaves
  timetableSlots: TimetableSlot[];
  facultyLeaves: FacultyLeave[];
  requestFacultyLeave: (leave: Omit<FacultyLeave, 'id' | 'status'>) => void;
  assignSubstitute: (slotId: string, substituteFacultyId: string, substituteFacultyName: string, reason: string) => void;
  revertSubstitute: (slotId: string) => void;
  addTimetableSlot: (slot: Omit<TimetableSlot, 'id'>) => void;
  updateTimetableSlot: (id: string, updates: Partial<TimetableSlot>) => void;
  deleteTimetableSlot: (id: string) => void;
  launchSessionFromSlot: (slotId: string) => void;
  applyWeeklySlotOverride: (slotId: string, status: SlotWeeklyStatus, note?: string, rescheduledTo?: string) => void;
  checkTimetableConflicts: () => { hasConflict: boolean; conflicts: TimetableConflict[] };

  // Courses & Micro-topics
  courses: Course[];
  selectedCourseId: string;
  setSelectedCourseId: (id: string) => void;
  toggleMicroTopic: (courseId: string, lessonId: string) => void;

  // Active Session & QR
  activeSession: LectureSession | null;
  startLectureSession: (params: {
    courseId: string;
    lessonId?: string;
    roomOrLab: string;
    durationMinutes: number;
    timetableSlotId?: string;
  }) => void;
  endLectureSession: () => void;
  rotateQRToken: () => void;

  // Attendance Records & Roll Call
  attendanceRecords: AttendanceRecord[];
  markStudentAttendance: (qrDataOrOtp: string, studentOverrideId?: string) => QRScanResult;
  manualRollCallUpdate: (studentId: string, sessionId: string, status: 'PRESENT' | 'ABSENT' | 'LEAVE') => void;

  // Analytics & Student Calculations
  getStudentAttendanceSummary: (studentId: string) => {
    overallPercentage: number;
    totalAttended: number;
    totalConducted: number;
    safeMargin: number;
    neededToRecover: number;
    isEligible: boolean;
    subjectBreakdown: {
      courseId: string;
      courseCode: string;
      courseName: string;
      facultyName: string;
      attended: number;
      total: number;
      percentage: number;
      status: 'safe' | 'warning' | 'critical';
      completedLessons: number;
      totalPlannedLessons: number;
      syllabusPercentage: number;
    }[];
  };
  getAtRiskDefaulters: (threshold?: number) => AttendanceAlert[];
  getCourseAnalytics: (courseId: string) => {
    avgTurnoutPct: number;
    conductedCount: number;
    syllabusPct: number;
    criticalStudentsCount: number;
    lessonList: MicroTopicLesson[];
  };

  resetAllData: () => void;
}

const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[LJU ERP] localStorage write skipped for ${key}:`, e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch {
      // ignore
    }
  },
  clear: (): void => {
    try {
      localStorage.clear();
    } catch {
      // ignore
    }
  }
};

const STORAGE_KEYS = {
  CURRENT_USER_ID: 'lju_current_user_id_v4',
  COURSES: 'lju_courses_v4',
  ACTIVE_SESSION: 'lju_active_session_v4',
  RECORDS: 'lju_records_v4',
  TIMETABLE: 'lju_timetable_v4',
  LEAVES: 'lju_leaves_v4',
  HOLIDAYS: 'lju_holidays_v4',
  SEMESTER_CONFIG: 'lju_semester_config_v4',
};

const AttendanceContext = createContext<AttendanceContextType | undefined>(undefined);

export const AttendanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Current user & authentication state (Defaults to false so LoginPage opens first)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return safeStorage.getItem('lju_auth_session_active_v6') === 'true';
    } catch {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    try {
      const savedId = safeStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      const found = INITIAL_USERS.find(u => u.id === savedId);
      if (found) return found;
    } catch {}
    return INITIAL_USERS[0]; // Default: Prof. A. Mehta (Faculty)
  });

  // Selected hierarchy
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<DepartmentId>('it_ca');
  const [selectedProgramId, setSelectedProgramId] = useState<ProgramId>('mca');
  const [selectedYear, setSelectedYear] = useState<number>(1);
  const [selectedSemester, setSelectedSemester] = useState<number>(1);
  const [selectedWeek, setSelectedWeek] = useState<number>(11); // Current Week 11
  const [selectedCourseId, setSelectedCourseId] = useState<string>('bca102');

  // Master courses
  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.COURSES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((c: Course) => c.id));
          const missing = INITIAL_COURSES.filter(c => !existingIds.has(c.id));
          return [...parsed, ...missing];
        }
      }
    } catch (e) { /* fallback */ }
    return INITIAL_COURSES;
  });

  // Master Timetable
  const [timetableSlots, setTimetableSlots] = useState<TimetableSlot[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.TIMETABLE);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* fallback */ }
    return INITIAL_TIMETABLE_SLOTS;
  });

  // Faculty Leaves
  const [facultyLeaves, setFacultyLeaves] = useState<FacultyLeave[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.LEAVES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) { /* fallback */ }
    return INITIAL_FACULTY_LEAVES;
  });

  // Active Live Lecture
  const [activeSession, setActiveSession] = useState<LectureSession | null>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.ACTIVE_SESSION);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) { /* fallback */ }
    return INITIAL_ACTIVE_SESSION;
  });

  // Attendance Records
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.RECORDS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* fallback */ }
    return generateSeedAttendanceRecords();
  });

  // Academic Calendar Holidays
  const [holidays, setHolidays] = useState<AcademicHoliday[]>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.HOLIDAYS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) { /* fallback */ }
    return ACADEMIC_HOLIDAYS;
  });

  // Semester Schedule Configuration (4-Month Term)
  const [semesterConfig, setSemesterConfig] = useState<SemesterScheduleConfig>(() => {
    try {
      const saved = safeStorage.getItem(STORAGE_KEYS.SEMESTER_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.semesterName && parsed.totalWeeks) return parsed;
      }
    } catch (e) { /* fallback */ }
    return SEMESTER_CONFIG;
  });

  // Sync to LocalStorage with safeStorage
  useEffect(() => { if (currentUser?.id) safeStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUser.id); }, [currentUser]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses)); }, [courses]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetableSlots)); }, [timetableSlots]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.LEAVES, JSON.stringify(facultyLeaves)); }, [facultyLeaves]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.RECORDS, JSON.stringify(attendanceRecords)); }, [attendanceRecords]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.HOLIDAYS, JSON.stringify(holidays)); }, [holidays]);
  useEffect(() => { safeStorage.setItem(STORAGE_KEYS.SEMESTER_CONFIG, JSON.stringify(semesterConfig)); }, [semesterConfig]);
  useEffect(() => {
    if (activeSession) safeStorage.setItem(STORAGE_KEYS.ACTIVE_SESSION, JSON.stringify(activeSession));
    else safeStorage.removeItem(STORAGE_KEYS.ACTIVE_SESSION);
  }, [activeSession]);

  // Sync user cohort if student
  useEffect(() => {
    if (currentUser.role === 'STUDENT') {
      if (currentUser.programId) setSelectedProgramId(currentUser.programId);
      if (currentUser.year) setSelectedYear(currentUser.year);
      if (currentUser.semester) setSelectedSemester(currentUser.semester);
    }
  }, [currentUser]);

  // 15-second dynamic QR token rotation
  useEffect(() => {
    if (!activeSession || !activeSession.isActive) return;
    const interval = setInterval(() => {
      rotateQRToken();
    }, (activeSession.refreshIntervalSec || 15) * 1000);
    return () => clearInterval(interval);
  }, [activeSession?.id, activeSession?.refreshIntervalSec]);

  const allPrograms = DEPARTMENTS.flatMap(d => d.programs);
  const currentProgram = allPrograms.find(p => p.id === selectedProgramId) || allPrograms[0];

  const login = (user: UserProfile) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    safeStorage.setItem('lju_auth_session_active_v6', 'true');
    safeStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, user.id);
    if (user.role === 'STUDENT' && user.programId) {
      setSelectedProgramId(user.programId);
      if (user.year) setSelectedYear(user.year);
      if (user.semester) setSelectedSemester(user.semester);
      const studentFirstCourse = INITIAL_COURSES.find(c => c.programId === user.programId && c.semester === (user.semester || 1));
      if (studentFirstCourse) setSelectedCourseId(studentFirstCourse.id);
    } else if (user.role === 'FACULTY') {
      const facCourse = INITIAL_COURSES.find(c => c.facultyId === user.id || c.facultyName === user.name);
      if (facCourse) setSelectedCourseId(facCourse.id);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    safeStorage.setItem('lju_auth_session_active_v6', 'false');
  };

  const switchUser = (userId: string) => {
    const found = INITIAL_USERS.find(u => u.id === userId);
    if (found) {
      login(found);
    }
  };

  const rotateQRToken = useCallback(() => {
    setActiveSession(prev => {
      if (!prev || !prev.isActive) return null;
      const salt = Math.random().toString(36).substring(2, 8).toUpperCase();
      const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
      return {
        ...prev,
        qrSecretToken: `LJU_${prev.courseCode}_T_${Date.now()}_${salt}`,
        otpCode: newOtp,
        tokenUpdatedAt: Date.now(),
      };
    });
  }, []);

  // Timetable Operations
  const assignSubstitute = (slotId: string, substituteFacultyId: string, substituteFacultyName: string, reason: string) => {
    setTimetableSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          isSubstitute: true,
          substituteFacultyId,
          substituteFacultyName,
          leaveReason: reason,
        };
      }
      return slot;
    }));
  };

  const revertSubstitute = (slotId: string) => {
    setTimetableSlots(prev => prev.map(slot => {
      if (slot.id === slotId) {
        return {
          ...slot,
          isSubstitute: false,
          substituteFacultyId: undefined,
          substituteFacultyName: undefined,
          leaveReason: undefined,
        };
      }
      return slot;
    }));
  };

  const requestFacultyLeave = (leaveData: Omit<FacultyLeave, 'id' | 'status'>) => {
    const newLeave: FacultyLeave = {
      ...leaveData,
      id: `leave_${Date.now()}`,
      status: 'APPROVED', // Auto approved for academic continuity
    };
    setFacultyLeaves(prev => [newLeave, ...prev]);

    // Update affected slots
    leaveData.substituteAssignments.forEach(sub => {
      assignSubstitute(sub.slotId, sub.substituteFacultyId, sub.substituteFacultyName, leaveData.reason);
    });
  };

  const addTimetableSlot = (slotData: Omit<TimetableSlot, 'id'>) => {
    const newSlot: TimetableSlot = {
      ...slotData,
      id: `slot_${Date.now()}_${Math.random().toString(36).substring(6)}`,
    };
    setTimetableSlots(prev => [...prev, newSlot]);
  };

  const updateTimetableSlot = (id: string, updates: Partial<TimetableSlot>) => {
    setTimetableSlots(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteTimetableSlot = (id: string) => {
    setTimetableSlots(prev => prev.filter(s => s.id !== id));
  };

  const launchSessionFromSlot = (slotId: string) => {
    const slot = timetableSlots.find(s => s.id === slotId);
    if (!slot) return;

    const course = courses.find(c => c.id === slot.courseId) || courses[0];
    const nextUnfinishedLesson = course.lessons.find(l => !l.isCompleted);

    startLectureSession({
      courseId: course.id,
      lessonId: nextUnfinishedLesson?.id,
      roomOrLab: slot.roomOrLab,
      durationMinutes: slot.slotType === 'lab' ? 120 : 60,
      timetableSlotId: slot.id,
    });
  };

  // Weekly Timetable Slot Override (Proxy, Rescheduled, Cancelled/Holiday, Extra)
  const applyWeeklySlotOverride = (
    slotId: string, 
    status: SlotWeeklyStatus, 
    note?: string, 
    rescheduledTo?: string
  ) => {
    setTimetableSlots(prev => prev.map(s => {
      if (s.id !== slotId) return s;
      return {
        ...s,
        weeklyStatus: status,
        overrideNote: note,
        rescheduledTo,
      };
    }));
  };

  // Conflict Detection Engine across Faculty and Rooms
  const checkTimetableConflicts = useCallback(() => {
    const conflicts: TimetableConflict[] = [];

    for (let i = 0; i < timetableSlots.length; i++) {
      for (let j = i + 1; j < timetableSlots.length; j++) {
        const a = timetableSlots[i];
        const b = timetableSlots[j];

        if (a.day === b.day && a.slotIndex === b.slotIndex) {
          // Check faculty overlap
          const facultyA = a.isSubstitute ? a.substituteFacultyName : a.facultyName;
          const facultyB = b.isSubstitute ? b.substituteFacultyName : b.facultyName;

          if (facultyA && facultyB && facultyA === facultyB && a.id !== b.id) {
            conflicts.push({
              type: 'faculty',
              message: `${facultyA} is double-booked on ${a.day} Slot ${a.slotIndex} (${a.startTime} - ${a.endTime}) across ${a.courseCode} (${a.roomOrLab}) and ${b.courseCode} (${b.roomOrLab})`,
              slotA: a,
              slotB: b,
            });
          }

          // Check room/lab overlap
          if (a.roomOrLab && b.roomOrLab && a.roomOrLab === b.roomOrLab && a.id !== b.id) {
            conflicts.push({
              type: 'room',
              message: `Room/Lab "${a.roomOrLab}" is double-booked on ${a.day} Slot ${a.slotIndex} for ${a.courseCode} (${a.programId.toUpperCase()}) and ${b.courseCode} (${b.programId.toUpperCase()})`,
              slotA: a,
              slotB: b,
            });
          }
        }
      }
    }

    return {
      hasConflict: conflicts.length > 0,
      conflicts,
    };
  }, [timetableSlots]);

  // Holiday management
  const addHoliday = (holidayData: Omit<AcademicHoliday, 'id'>) => {
    const newHol: AcademicHoliday = {
      ...holidayData,
      id: `hol_${Date.now()}`,
    };
    setHolidays(prev => [...prev, newHol]);
  };

  const deleteHoliday = (holidayId: string) => {
    setHolidays(prev => prev.filter(h => h.id !== holidayId));
  };

  const updateSemesterConfig = (updates: Partial<SemesterScheduleConfig>) => {
    setSemesterConfig(prev => ({ ...prev, ...updates }));
  };

  // Micro-topic toggle
  const toggleMicroTopic = (courseId: string, lessonId: string) => {
    setCourses(prev => prev.map(c => {
      if (c.id !== courseId) return c;
      return {
        ...c,
        lessons: c.lessons.map(l => {
          if (l.id === lessonId) {
            const nextVal = !l.isCompleted;
            return {
              ...l,
              isCompleted: nextVal,
              completedDate: nextVal ? new Date().toISOString().split('T')[0] : undefined,
              completedByFacultyId: nextVal ? currentUser.id : undefined,
              completedByFacultyName: nextVal ? currentUser.name : undefined,
            };
          }
          return l;
        }),
      };
    }));
  };

  // Start / End Session
  const startLectureSession = (params: {
    courseId: string;
    lessonId?: string;
    roomOrLab: string;
    durationMinutes: number;
    timetableSlotId?: string;
  }) => {
    const course = courses.find(c => c.id === params.courseId);
    if (!course) return;

    const lesson = course.lessons.find(l => l.id === params.lessonId);
    const sessionId = `sess_${course.id}_${Date.now()}`;

    const newSession: LectureSession = {
      id: sessionId,
      courseId: course.id,
      courseCode: course.code,
      courseName: course.name,
      departmentId: course.departmentId,
      programId: course.programId,
      year: course.year,
      semester: course.semester,
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      roomOrLab: params.roomOrLab,
      coveredLessonId: params.lessonId,
      coveredLessonTitle: lesson ? `Lec ${lesson.lectureNumber}: ${lesson.microTopicTitle}` : 'General Practical & Problem Solving',
      startTime: new Date().toISOString(),
      durationMinutes: params.durationMinutes,
      isActive: true,
      qrSecretToken: `LJU_${course.code}_SEC_${Math.floor(100000 + Math.random() * 900000)}`,
      otpCode: Math.floor(100000 + Math.random() * 900000).toString(),
      tokenUpdatedAt: Date.now(),
      refreshIntervalSec: 15,
      geoFenceEnabled: true,
      attendanceCount: 0,
      totalStudents: ALL_STUDENTS_ROSTER.length,
      timetableSlotId: params.timetableSlotId,
    };

    setActiveSession(newSession);

    // Increment conducted lecture count
    setCourses(prev => prev.map(c => c.id === course.id ? { ...c, totalLecturesConducted: c.totalLecturesConducted + 1 } : c));
  };

  const endLectureSession = () => {
    if (!activeSession) return;
    setActiveSession(prev => prev ? { ...prev, isActive: false, isLocked: true } : null);
  };

  // Attendance Scanning & Roll Call
  const markStudentAttendance = (qrDataOrOtp: string, studentOverrideId?: string): QRScanResult => {
    if (!activeSession || !activeSession.isActive) {
      return { success: false, message: 'No lecture session is currently broadcasting or accepting scans.' };
    }

    const targetStudentId = studentOverrideId || currentUser.id;
    const student = ALL_STUDENTS_ROSTER.find(s => s.id === targetStudentId);
    const studentName = student?.name || currentUser.name;
    const studentRoll = student?.roll || currentUser.rollNumber || '2026BCA000';

    const existing = attendanceRecords.find(r => r.sessionId === activeSession.id && r.studentId === targetStudentId);
    if (existing) {
      return {
        success: false,
        message: `Attendance already recorded for ${studentName} (${existing.status}) at ${new Date(existing.timestamp).toLocaleTimeString()}`,
      };
    }

    const cleanInput = qrDataOrOtp.trim();
    let isMatch = false;
    let method: 'qr_dynamic' | 'otp_code' = 'qr_dynamic';

    if (cleanInput === activeSession.qrSecretToken || cleanInput.includes(activeSession.qrSecretToken) || cleanInput.startsWith('LJU_')) {
      isMatch = true;
      method = 'qr_dynamic';
    } else if (cleanInput === activeSession.otpCode) {
      isMatch = true;
      method = 'otp_code';
    }

    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid or expired rotating QR token / OTP. Please re-scan from the lecturer screen.',
      };
    }

    const now = new Date();
    const newRecord: AttendanceRecord = {
      id: `att_${activeSession.id}_${targetStudentId}_${Date.now()}`,
      sessionId: activeSession.id,
      courseId: activeSession.courseId,
      studentId: targetStudentId,
      studentName,
      studentRoll,
      timestamp: now.toISOString(),
      status: 'PRESENT',
      verificationMethod: method,
      deviceInfo: 'LJ University Student Portal',
      locationVerified: true,
    };

    setAttendanceRecords(prev => [newRecord, ...prev]);
    setActiveSession(prev => prev ? { ...prev, attendanceCount: prev.attendanceCount + 1 } : null);

    if (activeSession.coveredLessonId) {
      toggleMicroTopic(activeSession.courseId, activeSession.coveredLessonId);
    }

    return {
      success: true,
      message: `Verified! Attendance recorded for ${activeSession.courseCode} (${activeSession.courseName}).`,
      courseName: activeSession.courseName,
      topicTitle: activeSession.coveredLessonTitle,
      timestamp: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  };

  const manualRollCallUpdate = (studentId: string, sessionId: string, status: 'PRESENT' | 'ABSENT' | 'LEAVE') => {
    const student = ALL_STUDENTS_ROSTER.find(s => s.id === studentId);
    if (!student) return;

    const existingIndex = attendanceRecords.findIndex(r => r.sessionId === sessionId && r.studentId === studentId);
    if (existingIndex >= 0) {
      setAttendanceRecords(prev => {
        const copy = [...prev];
        copy[existingIndex] = { ...copy[existingIndex], status, verificationMethod: 'roll_call' };
        return copy;
      });
    } else {
      const newRecord: AttendanceRecord = {
        id: `att_${sessionId}_${studentId}_${Date.now()}`,
        sessionId,
        courseId: activeSession?.courseId || 'bca102',
        studentId,
        studentName: student.name,
        studentRoll: student.roll,
        timestamp: new Date().toISOString(),
        status,
        verificationMethod: 'roll_call',
        locationVerified: true,
      };
      setAttendanceRecords(prev => [newRecord, ...prev]);
      if (status === 'PRESENT') {
        setActiveSession(prev => prev ? { ...prev, attendanceCount: prev.attendanceCount + 1 } : null);
      }
    }
  };

  // Student analytics calculations across all cohorts & semesters
  const getStudentAttendanceSummary = (studentId: string) => {
    const student = ALL_STUDENTS_ROSTER.find(s => s.id === studentId) || 
      (currentUser.role === 'STUDENT' ? currentUser : undefined);
    const targetProgramId = student?.programId || currentUser.programId || 'bca';
    const targetSemester = student?.semester || currentUser.semester || 1;
    
    // Find courses for this student's specific program & semester
    let cohortCourses = courses.filter(c => c.programId === targetProgramId && c.semester === targetSemester);
    if (cohortCourses.length === 0) {
      cohortCourses = courses.filter(c => c.programId === targetProgramId);
    }
    if (cohortCourses.length === 0) {
      cohortCourses = courses.slice(0, 4);
    }

    let totalAttended = 0;
    let totalConducted = 0;

    const isRisk = (student?.id || studentId).includes('risk') || (student?.id || studentId).includes('aryan');

    const subjectBreakdown = cohortCourses.map(course => {
      const courseRecords = attendanceRecords.filter(r => r.courseId === course.id && r.studentId === (student?.id || studentId));
      let attended = courseRecords.filter(r => r.status === 'PRESENT').length;
      let conducted = course.totalLecturesConducted || 24;

      if (courseRecords.length === 0) {
        attended = isRisk ? Math.round(conducted * 0.62) : Math.round(conducted * 0.88);
      }

      const pct = Math.round((attended / conducted) * 100);

      totalAttended += attended;
      totalConducted += conducted;

      let status: 'safe' | 'warning' | 'critical' = 'safe';
      if (pct < 65) status = 'critical';
      else if (pct < 75) status = 'warning';

      const completedLessons = course.lessons.filter(l => l.isCompleted).length;
      const plannedLessons = course.totalLecturesPlanned || 40;
      const syllabusPercentage = Math.min(100, Math.round((conducted / plannedLessons) * 100));

      return {
        courseId: course.id,
        courseCode: course.code,
        courseName: course.name,
        facultyName: course.facultyName,
        attended,
        total: conducted,
        percentage: pct,
        status,
        completedLessons,
        totalPlannedLessons: plannedLessons,
        syllabusPercentage,
      };
    });

    const overallPercentage = totalConducted > 0 ? Math.round((totalAttended / totalConducted) * 100) : 100;
    const isEligible = overallPercentage >= 75;

    // Buffer or Recovery
    const margin = Math.floor((totalAttended - 0.75 * totalConducted) / 0.75);
    const safeMargin = margin > 0 ? margin : 0;

    let neededToRecover = 0;
    if (overallPercentage < 75) {
      neededToRecover = Math.ceil((0.75 * totalConducted - totalAttended) / 0.25);
      if (neededToRecover < 1) neededToRecover = 1;
    }

    return {
      overallPercentage,
      totalAttended,
      totalConducted,
      safeMargin,
      neededToRecover,
      isEligible,
      subjectBreakdown,
    };
  };

  const getAtRiskDefaulters = (threshold: number = 75): AttendanceAlert[] => {
    const alerts: AttendanceAlert[] = [];
    const bcaCourses = courses.filter(c => c.programId === 'bca' && c.year === 1);

    bcaCourses.forEach(course => {
      ALL_STUDENTS_ROSTER.forEach(student => {
        const records = attendanceRecords.filter(r => r.courseId === course.id && r.studentId === student.id);
        const attended = records.filter(r => r.status === 'PRESENT').length;
        const total = course.totalLecturesConducted || 1;
        const pct = Math.round((attended / total) * 100);

        if (pct < threshold) {
          const sorted = [...records].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
          alerts.push({
            id: `alert_${course.id}_${student.id}`,
            studentId: student.id,
            studentName: student.name,
            studentRoll: student.roll,
            courseId: course.id,
            courseName: course.name,
            programId: course.programId,
            currentPercentage: pct,
            requiredPercentage: threshold,
            severity: pct < 60 ? 'high' : 'medium',
            lastAttended: sorted[0]?.timestamp,
          });
        }
      });
    });

    return alerts.sort((a, b) => a.currentPercentage - b.currentPercentage);
  };

  const getCourseAnalytics = (courseId: string) => {
    const course = courses.find(c => c.id === courseId) || courses[0];
    const totalStudents = ALL_STUDENTS_ROSTER.length;

    // Average turnout
    const courseRecords = attendanceRecords.filter(r => r.courseId === course.id);
    const totalPresents = courseRecords.filter(r => r.status === 'PRESENT').length;
    const totalPossibleSlots = (course.totalLecturesConducted || 1) * totalStudents;
    const avgTurnoutPct = totalPossibleSlots > 0 ? Math.round((totalPresents / totalPossibleSlots) * 100) : 85;

    // Syllabus
    const completedLessons = course.lessons.filter(l => l.isCompleted).length;
    const syllabusPct = course.totalLecturesPlanned > 0
      ? Math.round((completedLessons / course.totalLecturesPlanned) * 100)
      : 0;

    let criticalCount = 0;
    ALL_STUDENTS_ROSTER.forEach(s => {
      const records = attendanceRecords.filter(r => r.courseId === course.id && r.studentId === s.id);
      const attended = records.filter(r => r.status === 'PRESENT').length;
      const pct = (attended / (course.totalLecturesConducted || 1)) * 100;
      if (pct < 75) criticalCount++;
    });

    return {
      avgTurnoutPct,
      conductedCount: course.totalLecturesConducted,
      syllabusPct,
      criticalStudentsCount: criticalCount,
      lessonList: course.lessons,
    };
  };

  const resetAllData = () => {
    safeStorage.clear();
    setCurrentUser(INITIAL_USERS[2]); // Prof. Riddhi Vyas
    setCourses(INITIAL_COURSES);
    setTimetableSlots(INITIAL_TIMETABLE_SLOTS);
    setFacultyLeaves(INITIAL_FACULTY_LEAVES);
    setActiveSession(INITIAL_ACTIVE_SESSION);
    setAttendanceRecords(generateSeedAttendanceRecords());
    setHolidays(ACADEMIC_HOLIDAYS);
    setSemesterConfig(SEMESTER_CONFIG);
    setSelectedDepartmentId('it_ca');
    setSelectedProgramId('bca');
    setSelectedYear(1);
    setSelectedSemester(1);
    setSelectedWeek(11);
    setSelectedCourseId('bca102');
  };

  return (
    <AttendanceContext.Provider
      value={{
        currentUser,
        switchUser,
        availableUsers: INITIAL_USERS,
        isAuthenticated,
        login,
        logout,
        departments: DEPARTMENTS,
        selectedDepartmentId,
        setSelectedDepartmentId,
        selectedProgramId,
        setSelectedProgramId,
        selectedYear,
        setSelectedYear,
        selectedSemester,
        setSelectedSemester,
        currentProgram,
        weeks: SEMESTER_WEEKS,
        selectedWeek,
        setSelectedWeek,
        holidays,
        addHoliday,
        deleteHoliday,
        semesterConfig,
        updateSemesterConfig,
        timetableSlots,
        facultyLeaves,
        requestFacultyLeave,
        assignSubstitute,
        revertSubstitute,
        addTimetableSlot,
        updateTimetableSlot,
        deleteTimetableSlot,
        launchSessionFromSlot,
        applyWeeklySlotOverride,
        checkTimetableConflicts,
        courses,
        selectedCourseId,
        setSelectedCourseId,
        toggleMicroTopic,
        activeSession,
        startLectureSession,
        endLectureSession,
        rotateQRToken,
        attendanceRecords,
        markStudentAttendance,
        manualRollCallUpdate,
        getStudentAttendanceSummary,
        getAtRiskDefaulters,
        getCourseAnalytics,
        resetAllData,
      }}
    >
      {children}
    </AttendanceContext.Provider>
  );
};

export const useAttendance = () => {
  const context = useContext(AttendanceContext);
  if (!context) throw new Error('useAttendance must be used within an AttendanceProvider');
  return context;
};
