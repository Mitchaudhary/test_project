export type UserRole = 'SUPER_ADMIN' | 'HOD' | 'FACULTY' | 'STUDENT';

export type DepartmentId = 'it_ca' | 'engineering' | 'management' | 'law';

export type ProgramId = 
  | 'bca' 
  | 'mca'
  | 'bsc_it' 
  | 'msc_it'
  | 'btech_cse' 
  | 'btech_mech' 
  | 'bba' 
  | 'mba'
  | 'ba_llb'
  | 'bba_llb';

export interface DegreeProgram {
  id: ProgramId;
  departmentId: DepartmentId;
  name: string;
  code: string;
  level: 'undergraduate' | 'postgraduate';
  durationYears: number;
  totalSemesters: number;
  currentActiveSemester: number;
  studentCount: number;
  description: string;
}

export interface Department {
  id: DepartmentId;
  name: string;
  code: string;
  headOfDepartment: string;
  hodEmail: string;
  programs: DegreeProgram[];
  icon: string;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type SlotType = 'theory' | 'lab' | 'break' | 'allied';
export type SlotWeeklyStatus = 'regular' | 'substitute' | 'rescheduled' | 'cancelled_holiday' | 'extra_lecture';

export interface TimetableSlot {
  id: string;
  slotIndex: 1 | 2 | 3 | 4; // 1: 09:00-10:00, 2: 10:00-11:00, 3: 11:30-12:30, 4: 01:00-03:00 (Lab)
  programId: ProgramId;
  departmentId: DepartmentId;
  year: number; // 1, 2, 3, 4, 5
  semester: number;
  section: string; // 'A' | 'B'
  day: DayOfWeek;
  startTime: string; // '09:00 AM'
  endTime: string;   // '10:00 AM'
  courseId: string;
  courseCode: string;
  courseName: string;
  facultyId: string;
  facultyName: string;
  roomOrLab: string; // 'Room 101', 'Comp Lab 1', etc.
  slotType: SlotType;
  isSubstitute?: boolean;
  substituteFacultyId?: string;
  substituteFacultyName?: string;
  leaveReason?: string;
  weekNumber?: number; // Supports weekly schedule customization
  weeklyStatus?: SlotWeeklyStatus;
  overrideNote?: string;
  rescheduledTo?: string;
}

export interface AcademicHoliday {
  id: string;
  date: string; // YYYY-MM-DD
  dayOfWeek: DayOfWeek;
  name: string;
  type: 'gazetted' | 'university_holiday' | 'exam_break' | 'vacation' | 'sunday';
  description?: string;
}

export interface SemesterScheduleConfig {
  semesterName: string;
  startDate: string;
  endDate: string;
  totalWeeks: number;
  currentWeekNumber: number;
  totalTeachingDays: number;
  totalHolidays: number;
  workingDaysPerWeek: number;
  midSemExamStart: string;
  midSemExamEnd: string;
  endSemExamStart: string;
  endSemExamEnd: string;
}

export interface MicroTopicLesson {
  id: string;
  lectureNumber: number; // 1 to 40
  moduleName: string;
  microTopicTitle: string;
  isCompleted: boolean;
  completedDate?: string;
  completedByFacultyId?: string;
  completedByFacultyName?: string;
  notes?: string;
}

export interface Course {
  id: string;
  code: string;
  name: string;
  departmentId: DepartmentId;
  programId: ProgramId;
  year: number;
  semester: number;
  facultyId: string;
  facultyName: string;
  totalCredits: number;
  totalLecturesPlanned: number; // 40 or 30
  totalLecturesConducted: number;
  defaultRoom: string;
  color: string;
  lessons: MicroTopicLesson[];
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  departmentId?: DepartmentId;
  programId?: ProgramId;
  programName?: string;
  year?: number;
  semester?: number;
  rollNumber?: string;
  designation?: string;
  specialization?: string;
  assignedRooms?: string[];
  currentStreakDays?: number;
}

export interface AttendanceRecord {
  id: string;
  sessionId: string;
  courseId: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  timestamp: string;
  status: 'PRESENT' | 'ABSENT' | 'LEAVE';
  verificationMethod: 'qr_dynamic' | 'roll_call' | 'otp_code';
  deviceInfo?: string;
  locationVerified?: boolean;
}

export interface LectureSession {
  id: string;
  courseId: string;
  courseCode: string;
  courseName: string;
  departmentId: DepartmentId;
  programId: ProgramId;
  year: number;
  semester: number;
  facultyId: string;
  facultyName: string;
  roomOrLab: string;
  coveredLessonId?: string;
  coveredLessonTitle?: string;
  startTime: string;
  durationMinutes: number;
  isActive: boolean;
  qrSecretToken: string;
  otpCode: string;
  tokenUpdatedAt: number;
  refreshIntervalSec: number;
  geoFenceEnabled: boolean;
  attendanceCount: number;
  totalStudents: number;
  timetableSlotId?: string;
  isLocked?: boolean;
}

export interface FacultyLeave {
  id: string;
  facultyId: string;
  facultyName: string;
  date: string; // YYYY-MM-DD
  day: DayOfWeek;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  substituteAssignments: {
    slotId: string;
    substituteFacultyId: string;
    substituteFacultyName: string;
  }[];
}

export interface SemesterWeek {
  weekNumber: number; // 1 to 16
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  theme?: string;
  holidays?: { date: string; name: string }[];
}

export interface AttendanceAlert {
  id: string;
  studentId: string;
  studentName: string;
  studentRoll: string;
  courseId: string;
  courseName: string;
  programId: ProgramId;
  currentPercentage: number;
  requiredPercentage: number;
  severity: 'high' | 'medium' | 'low';
  lastAttended?: string;
}
