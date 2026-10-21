import { TimetableSlot, UserProfile, DayOfWeek } from '../types/attendance';

export const FACULTY_MEMBERS: UserProfile[] = [
  {
    id: 'fac_amehta',
    name: 'Prof. A. Mehta',
    email: 'a.mehta@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Associate Professor (Python & Java)',
    specialization: 'Python Programming, Advanced Java & Systems',
    assignedRooms: ['MCA-101', 'MCA-201', 'Lab-1', 'Lab-2'],
  },
  {
    id: 'fac_rpatel',
    name: 'Prof. R. Patel',
    email: 'r.patel@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Associate Professor (DBMS)',
    specialization: 'Database Management Systems, SQL & Transactions',
    assignedRooms: ['MCA-101', 'MSCIT-101', 'Lab-1', 'Lab-2', 'IT-Lab-2'],
  },
  {
    id: 'fac_kshah',
    name: 'Prof. K. Shah',
    email: 'k.shah@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (Mathematics)',
    specialization: 'Discrete Mathematics & Numerical Computing',
    assignedRooms: ['MCA-102', 'MSCIT-102', 'MCA-101'],
  },
  {
    id: 'fac_ndesai',
    name: 'Prof. N. Desai',
    email: 'n.desai@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (Web & Data Mining)',
    specialization: 'Web Technology, Data Mining & Cloud Platforms',
    assignedRooms: ['Lab-1', 'MCA-101', 'MCA-202', 'MSCIT-302'],
  },
  {
    id: 'fac_sjoshi',
    name: 'Prof. S. Joshi',
    email: 's.joshi@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (Networks & Security)',
    specialization: 'Computer Networks, Cyber Security & Fundamentals',
    assignedRooms: ['MCA-102', 'MCA-101', 'MSCIT-102', 'MSCIT-301'],
  },
  {
    id: 'fac_pshah',
    name: 'Prof. P. Shah',
    email: 'p.shah@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (Communication)',
    specialization: 'Business Communication & Technical Writing',
    assignedRooms: ['MCA-101', 'MCA-102', 'MSCIT-101', 'MSCIT-102'],
  },
  {
    id: 'fac_dshah',
    name: 'Prof. D. Shah',
    email: 'd.shah@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Associate Professor (Software Engineering)',
    specialization: 'Software Engineering, Design Patterns & UML',
    assignedRooms: ['MCA-201', 'MCA-202', 'MSCIT-301', 'MSCIT-302'],
  },
  {
    id: 'fac_vpatel',
    name: 'Prof. V. Patel',
    email: 'v.patel@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Associate Professor (Cloud & Analytics)',
    specialization: 'Cloud Computing, Data Analytics & Project Mentorship',
    assignedRooms: ['MCA-202', 'MCA-201', 'Lab-1', 'MSCIT-302', 'MSCIT-301'],
  },
  {
    id: 'fac_hjoshi',
    name: 'Prof. H. Joshi',
    email: 'h.joshi@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Associate Professor (ML & Data Science)',
    specialization: 'Machine Learning, Python for Data Science & Labs',
    assignedRooms: ['MCA-201', 'Lab-2', 'MSCIT-301', 'IT-Lab-1'],
  },
  {
    id: 'fac_jshah',
    name: 'Prof. J. Shah',
    email: 'j.shah@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (C Programming)',
    specialization: 'C Programming, Pointers & System Applications',
    assignedRooms: ['MSCIT-101', 'IT-Lab-1', 'MSCIT-102', 'IT-Lab-2'],
  },
  {
    id: 'fac_mjoshi',
    name: 'Prof. M. Joshi',
    email: 'm.joshi@ljku.edu.in',
    role: 'FACULTY',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    departmentId: 'it_ca',
    designation: 'Assistant Professor (Web Designing)',
    specialization: 'UI/UX, CSS Grid, HTML5 & Responsive Design',
    assignedRooms: ['IT-Lab-1', 'MSCIT-101'],
  },
];

// Helper to build slot
const createSlot = (
  id: string,
  slotIndex: 1 | 2 | 3 | 4,
  programId: 'mca' | 'msc_it' | 'bca',
  year: number,
  semester: number,
  day: DayOfWeek,
  startTime: string,
  endTime: string,
  courseCode: string,
  courseName: string,
  facultyId: string,
  facultyName: string,
  roomOrLab: string,
  slotType: 'theory' | 'lab' = 'theory'
): TimetableSlot => ({
  id,
  slotIndex,
  programId,
  departmentId: 'it_ca',
  year,
  semester,
  section: 'A',
  day,
  startTime,
  endTime,
  courseId: courseCode.toLowerCase().replace(/[^a-z0-9]/g, ''),
  courseCode,
  courseName,
  facultyId,
  facultyName,
  roomOrLab,
  slotType,
});

// ==========================================
// 1. MCA — Semester 1
// ==========================================
export const MCA_SEM1_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('mca1_mon_1', 1, 'mca', 1, 1, 'Monday', '09:00 AM', '10:00 AM', 'MCA101', 'Python Programming', 'fac_amehta', 'Prof. A. Mehta', 'MCA-101'),
  createSlot('mca1_mon_2', 2, 'mca', 1, 1, 'Monday', '10:00 AM', '11:00 AM', 'MCA102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MCA-101'),
  createSlot('mca1_mon_3', 3, 'mca', 1, 1, 'Monday', '11:15 AM', '12:15 PM', 'MCA103', 'Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MCA-102'),
  createSlot('mca1_mon_4', 4, 'mca', 1, 1, 'Monday', '12:15 PM', '01:00 PM', 'MCA104', 'Web Technology', 'fac_ndesai', 'Prof. N. Desai', 'Lab-1', 'lab'),

  // Tuesday
  createSlot('mca1_tue_1', 1, 'mca', 1, 1, 'Tuesday', '09:00 AM', '10:00 AM', 'MCA102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MCA-101'),
  createSlot('mca1_tue_2', 2, 'mca', 1, 1, 'Tuesday', '10:00 AM', '11:00 AM', 'MCA101', 'Python Programming', 'fac_amehta', 'Prof. A. Mehta', 'Lab-1', 'lab'),
  createSlot('mca1_tue_3', 3, 'mca', 1, 1, 'Tuesday', '11:15 AM', '12:15 PM', 'MCA105', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'MCA-102'),
  createSlot('mca1_tue_4', 4, 'mca', 1, 1, 'Tuesday', '12:15 PM', '01:00 PM', 'MCA106', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'MCA-101'),

  // Wednesday
  createSlot('mca1_wed_1', 1, 'mca', 1, 1, 'Wednesday', '09:00 AM', '10:00 AM', 'MCA104', 'Web Technology', 'fac_ndesai', 'Prof. N. Desai', 'MCA-101'),
  createSlot('mca1_wed_2', 2, 'mca', 1, 1, 'Wednesday', '10:00 AM', '11:00 AM', 'MCA103', 'Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MCA-102'),
  createSlot('mca1_wed_3', 3, 'mca', 1, 1, 'Wednesday', '11:15 AM', '12:15 PM', 'MCA101-LAB', 'Python Lab', 'fac_amehta', 'Prof. A. Mehta', 'Lab-1', 'lab'),
  createSlot('mca1_wed_4', 4, 'mca', 1, 1, 'Wednesday', '12:15 PM', '01:00 PM', 'MCA102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MCA-101'),

  // Thursday
  createSlot('mca1_thu_1', 1, 'mca', 1, 1, 'Thursday', '09:00 AM', '10:00 AM', 'MCA105', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'MCA-101'),
  createSlot('mca1_thu_2', 2, 'mca', 1, 1, 'Thursday', '10:00 AM', '11:00 AM', 'MCA102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'Lab-1', 'lab'),
  createSlot('mca1_thu_3', 3, 'mca', 1, 1, 'Thursday', '11:15 AM', '12:15 PM', 'MCA101', 'Python Programming', 'fac_amehta', 'Prof. A. Mehta', 'MCA-102'),
  createSlot('mca1_thu_4', 4, 'mca', 1, 1, 'Thursday', '12:15 PM', '01:00 PM', 'MCA103', 'Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MCA-101'),

  // Friday
  createSlot('mca1_fri_1', 1, 'mca', 1, 1, 'Friday', '09:00 AM', '10:00 AM', 'MCA103', 'Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MCA-102'),
  createSlot('mca1_fri_2', 2, 'mca', 1, 1, 'Friday', '10:00 AM', '11:00 AM', 'MCA104', 'Web Technology', 'fac_ndesai', 'Prof. N. Desai', 'Lab-1', 'lab'),
  createSlot('mca1_fri_3', 3, 'mca', 1, 1, 'Friday', '11:15 AM', '12:15 PM', 'MCA102-LAB', 'DBMS Lab', 'fac_rpatel', 'Prof. R. Patel', 'Lab-2', 'lab'),
  createSlot('mca1_fri_4', 4, 'mca', 1, 1, 'Friday', '12:15 PM', '01:00 PM', 'MCA105', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'MCA-101'),

  // Saturday
  createSlot('mca1_sat_1', 1, 'mca', 1, 1, 'Saturday', '09:00 AM', '10:00 AM', 'MCA101', 'Python Programming', 'fac_amehta', 'Prof. A. Mehta', 'MCA-101'),
  createSlot('mca1_sat_2', 2, 'mca', 1, 1, 'Saturday', '10:00 AM', '11:00 AM', 'MCA106', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'MCA-102'),
  createSlot('mca1_sat_3', 3, 'mca', 1, 1, 'Saturday', '11:15 AM', '12:15 PM', 'MCA104', 'Web Technology', 'fac_ndesai', 'Prof. N. Desai', 'Lab-1', 'lab'),
  createSlot('mca1_sat_4', 4, 'mca', 1, 1, 'Saturday', '12:15 PM', '01:00 PM', 'MCA107', 'Weekly Practical', 'fac_amehta', 'Prof. A. Mehta', 'Lab-2', 'lab'),
];

// ==========================================
// 2. MCA — Semester 3
// ==========================================
export const MCA_SEM3_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('mca3_mon_1', 1, 'mca', 2, 3, 'Monday', '09:00 AM', '10:00 AM', 'MCA301', 'Advanced Java', 'fac_amehta', 'Prof. A. Mehta', 'MCA-201'),
  createSlot('mca3_mon_2', 2, 'mca', 2, 3, 'Monday', '10:00 AM', '11:00 AM', 'MCA302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MCA-201'),
  createSlot('mca3_mon_3', 3, 'mca', 2, 3, 'Monday', '11:15 AM', '12:15 PM', 'MCA303', 'Cloud Computing', 'fac_vpatel', 'Prof. V. Patel', 'MCA-202'),
  createSlot('mca3_mon_4', 4, 'mca', 2, 3, 'Monday', '12:15 PM', '01:00 PM', 'MCA304', 'Machine Learning', 'fac_hjoshi', 'Prof. H. Joshi', 'MCA-201'),

  // Tuesday
  createSlot('mca3_tue_1', 1, 'mca', 2, 3, 'Tuesday', '09:00 AM', '10:00 AM', 'MCA304', 'Machine Learning', 'fac_hjoshi', 'Prof. H. Joshi', 'MCA-201'),
  createSlot('mca3_tue_2', 2, 'mca', 2, 3, 'Tuesday', '10:00 AM', '11:00 AM', 'MCA301', 'Advanced Java', 'fac_amehta', 'Prof. A. Mehta', 'Lab-1', 'lab'),
  createSlot('mca3_tue_3', 3, 'mca', 2, 3, 'Tuesday', '11:15 AM', '12:15 PM', 'MCA305', 'Data Mining', 'fac_ndesai', 'Prof. N. Desai', 'MCA-202'),
  createSlot('mca3_tue_4', 4, 'mca', 2, 3, 'Tuesday', '12:15 PM', '01:00 PM', 'MCA303', 'Cloud Computing', 'fac_vpatel', 'Prof. V. Patel', 'MCA-201'),

  // Wednesday
  createSlot('mca3_wed_1', 1, 'mca', 2, 3, 'Wednesday', '09:00 AM', '10:00 AM', 'MCA302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MCA-201'),
  createSlot('mca3_wed_2', 2, 'mca', 2, 3, 'Wednesday', '10:00 AM', '11:00 AM', 'MCA305', 'Data Mining', 'fac_ndesai', 'Prof. N. Desai', 'MCA-202'),
  createSlot('mca3_wed_3', 3, 'mca', 2, 3, 'Wednesday', '11:15 AM', '12:15 PM', 'MCA301-LAB', 'Advanced Java Lab', 'fac_amehta', 'Prof. A. Mehta', 'Lab-1', 'lab'),
  createSlot('mca3_wed_4', 4, 'mca', 2, 3, 'Wednesday', '12:15 PM', '01:00 PM', 'MCA304', 'Machine Learning', 'fac_hjoshi', 'Prof. H. Joshi', 'MCA-201'),

  // Thursday
  createSlot('mca3_thu_1', 1, 'mca', 2, 3, 'Thursday', '09:00 AM', '10:00 AM', 'MCA303', 'Cloud Computing', 'fac_vpatel', 'Prof. V. Patel', 'MCA-202'),
  createSlot('mca3_thu_2', 2, 'mca', 2, 3, 'Thursday', '10:00 AM', '11:00 AM', 'MCA304-LAB', 'Machine Learning Lab', 'fac_hjoshi', 'Prof. H. Joshi', 'Lab-2', 'lab'),
  createSlot('mca3_thu_3', 3, 'mca', 2, 3, 'Thursday', '11:15 AM', '12:15 PM', 'MCA302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MCA-201'),
  createSlot('mca3_thu_4', 4, 'mca', 2, 3, 'Thursday', '12:15 PM', '01:00 PM', 'MCA305', 'Data Mining', 'fac_ndesai', 'Prof. N. Desai', 'MCA-202'),

  // Friday
  createSlot('mca3_fri_1', 1, 'mca', 2, 3, 'Friday', '09:00 AM', '10:00 AM', 'MCA305', 'Data Mining', 'fac_ndesai', 'Prof. N. Desai', 'MCA-201'),
  createSlot('mca3_fri_2', 2, 'mca', 2, 3, 'Friday', '10:00 AM', '11:00 AM', 'MCA301', 'Advanced Java', 'fac_amehta', 'Prof. A. Mehta', 'MCA-202'),
  createSlot('mca3_fri_3', 3, 'mca', 2, 3, 'Friday', '11:15 AM', '12:15 PM', 'MCA303-LAB', 'Cloud Computing Lab', 'fac_vpatel', 'Prof. V. Patel', 'Lab-1', 'lab'),
  createSlot('mca3_fri_4', 4, 'mca', 2, 3, 'Friday', '12:15 PM', '01:00 PM', 'MCA302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MCA-201'),

  // Saturday
  createSlot('mca3_sat_1', 1, 'mca', 2, 3, 'Saturday', '09:00 AM', '10:00 AM', 'MCA304', 'Machine Learning', 'fac_hjoshi', 'Prof. H. Joshi', 'MCA-201'),
  createSlot('mca3_sat_2', 2, 'mca', 2, 3, 'Saturday', '10:00 AM', '11:00 AM', 'MCA302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MCA-202'),
  createSlot('mca3_sat_3', 3, 'mca', 2, 3, 'Saturday', '11:15 AM', '12:15 PM', 'MCA305-LAB', 'Data Mining Lab', 'fac_ndesai', 'Prof. N. Desai', 'Lab-2', 'lab'),
  createSlot('mca3_sat_4', 4, 'mca', 2, 3, 'Saturday', '12:15 PM', '01:00 PM', 'MCA306', 'Project Work', 'fac_vpatel', 'Prof. V. Patel', 'Lab-1', 'lab'),
];

// ==========================================
// 3. M.Sc. IT — Semester 1
// ==========================================
export const MSCIT_SEM1_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('msc1_mon_1', 1, 'msc_it', 1, 1, 'Monday', '09:00 AM', '10:00 AM', 'MSCIT101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'MSCIT-101'),
  createSlot('msc1_mon_2', 2, 'msc_it', 1, 1, 'Monday', '10:00 AM', '11:00 AM', 'MSCIT102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MSCIT-101'),
  createSlot('msc1_mon_3', 3, 'msc_it', 1, 1, 'Monday', '11:15 AM', '12:15 PM', 'MSCIT103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MSCIT-102'),
  createSlot('msc1_mon_4', 4, 'msc_it', 1, 1, 'Monday', '12:15 PM', '01:00 PM', 'MSCIT104', 'Web Designing', 'fac_mjoshi', 'Prof. M. Joshi', 'IT-Lab-1', 'lab'),

  // Tuesday
  createSlot('msc1_tue_1', 1, 'msc_it', 1, 1, 'Tuesday', '09:00 AM', '10:00 AM', 'MSCIT102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MSCIT-101'),
  createSlot('msc1_tue_2', 2, 'msc_it', 1, 1, 'Tuesday', '10:00 AM', '11:00 AM', 'MSCIT101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'IT-Lab-1', 'lab'),
  createSlot('msc1_tue_3', 3, 'msc_it', 1, 1, 'Tuesday', '11:15 AM', '12:15 PM', 'MSCIT105', 'Computer Fundamentals', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-102'),
  createSlot('msc1_tue_4', 4, 'msc_it', 1, 1, 'Tuesday', '12:15 PM', '01:00 PM', 'MSCIT106', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'MSCIT-101'),

  // Wednesday
  createSlot('msc1_wed_1', 1, 'msc_it', 1, 1, 'Wednesday', '09:00 AM', '10:00 AM', 'MSCIT104', 'Web Designing', 'fac_mjoshi', 'Prof. M. Joshi', 'MSCIT-101'),
  createSlot('msc1_wed_2', 2, 'msc_it', 1, 1, 'Wednesday', '10:00 AM', '11:00 AM', 'MSCIT103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MSCIT-102'),
  createSlot('msc1_wed_3', 3, 'msc_it', 1, 1, 'Wednesday', '11:15 AM', '12:15 PM', 'MSCIT101-LAB', 'C Programming Lab', 'fac_jshah', 'Prof. J. Shah', 'IT-Lab-1', 'lab'),
  createSlot('msc1_wed_4', 4, 'msc_it', 1, 1, 'Wednesday', '12:15 PM', '01:00 PM', 'MSCIT102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MSCIT-101'),

  // Thursday
  createSlot('msc1_thu_1', 1, 'msc_it', 1, 1, 'Thursday', '09:00 AM', '10:00 AM', 'MSCIT105', 'Computer Fundamentals', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-101'),
  createSlot('msc1_thu_2', 2, 'msc_it', 1, 1, 'Thursday', '10:00 AM', '11:00 AM', 'MSCIT102-LAB', 'DBMS Lab', 'fac_rpatel', 'Prof. R. Patel', 'IT-Lab-2', 'lab'),
  createSlot('msc1_thu_3', 3, 'msc_it', 1, 1, 'Thursday', '11:15 AM', '12:15 PM', 'MSCIT101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'MSCIT-102'),
  createSlot('msc1_thu_4', 4, 'msc_it', 1, 1, 'Thursday', '12:15 PM', '01:00 PM', 'MSCIT103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MSCIT-101'),

  // Friday
  createSlot('msc1_fri_1', 1, 'msc_it', 1, 1, 'Friday', '09:00 AM', '10:00 AM', 'MSCIT103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'MSCIT-102'),
  createSlot('msc1_fri_2', 2, 'msc_it', 1, 1, 'Friday', '10:00 AM', '11:00 AM', 'MSCIT104', 'Web Designing', 'fac_mjoshi', 'Prof. M. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc1_fri_3', 3, 'msc_it', 1, 1, 'Friday', '11:15 AM', '12:15 PM', 'MSCIT105', 'Computer Fundamentals', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-101'),
  createSlot('msc1_fri_4', 4, 'msc_it', 1, 1, 'Friday', '12:15 PM', '01:00 PM', 'MSCIT102', 'DBMS', 'fac_rpatel', 'Prof. R. Patel', 'MSCIT-102'),

  // Saturday
  createSlot('msc1_sat_1', 1, 'msc_it', 1, 1, 'Saturday', '09:00 AM', '10:00 AM', 'MSCIT101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'MSCIT-101'),
  createSlot('msc1_sat_2', 2, 'msc_it', 1, 1, 'Saturday', '10:00 AM', '11:00 AM', 'MSCIT106', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'MSCIT-102'),
  createSlot('msc1_sat_3', 3, 'msc_it', 1, 1, 'Saturday', '11:15 AM', '12:15 PM', 'MSCIT104-LAB', 'Web Designing Lab', 'fac_mjoshi', 'Prof. M. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc1_sat_4', 4, 'msc_it', 1, 1, 'Saturday', '12:15 PM', '01:00 PM', 'MSCIT107', 'Practical Work', 'fac_jshah', 'Prof. J. Shah', 'IT-Lab-2', 'lab'),
];

// ==========================================
// 4. M.Sc. IT — Semester 3
// ==========================================
export const MSCIT_SEM3_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('msc3_mon_1', 1, 'msc_it', 2, 3, 'Monday', '09:00 AM', '10:00 AM', 'MSCIT301', 'Python for Data Science', 'fac_hjoshi', 'Prof. H. Joshi', 'MSCIT-301'),
  createSlot('msc3_mon_2', 2, 'msc_it', 2, 3, 'Monday', '10:00 AM', '11:00 AM', 'MSCIT302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MSCIT-301'),
  createSlot('msc3_mon_3', 3, 'msc_it', 2, 3, 'Monday', '11:15 AM', '12:15 PM', 'MSCIT303', 'Data Analytics', 'fac_vpatel', 'Prof. V. Patel', 'MSCIT-302'),
  createSlot('msc3_mon_4', 4, 'msc_it', 2, 3, 'Monday', '12:15 PM', '01:00 PM', 'MSCIT304', 'Cyber Security', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-301'),

  // Tuesday
  createSlot('msc3_tue_1', 1, 'msc_it', 2, 3, 'Tuesday', '09:00 AM', '10:00 AM', 'MSCIT303', 'Data Analytics', 'fac_vpatel', 'Prof. V. Patel', 'MSCIT-301'),
  createSlot('msc3_tue_2', 2, 'msc_it', 2, 3, 'Tuesday', '10:00 AM', '11:00 AM', 'MSCIT301', 'Python for Data Science', 'fac_hjoshi', 'Prof. H. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc3_tue_3', 3, 'msc_it', 2, 3, 'Tuesday', '11:15 AM', '12:15 PM', 'MSCIT305', 'Cloud Computing', 'fac_ndesai', 'Prof. N. Desai', 'MSCIT-302'),
  createSlot('msc3_tue_4', 4, 'msc_it', 2, 3, 'Tuesday', '12:15 PM', '01:00 PM', 'MSCIT304', 'Cyber Security', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-301'),

  // Wednesday
  createSlot('msc3_wed_1', 1, 'msc_it', 2, 3, 'Wednesday', '09:00 AM', '10:00 AM', 'MSCIT302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MSCIT-301'),
  createSlot('msc3_wed_2', 2, 'msc_it', 2, 3, 'Wednesday', '10:00 AM', '11:00 AM', 'MSCIT305', 'Cloud Computing', 'fac_ndesai', 'Prof. N. Desai', 'MSCIT-302'),
  createSlot('msc3_wed_3', 3, 'msc_it', 2, 3, 'Wednesday', '11:15 AM', '12:15 PM', 'MSCIT301-LAB', 'Python Lab', 'fac_hjoshi', 'Prof. H. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc3_wed_4', 4, 'msc_it', 2, 3, 'Wednesday', '12:15 PM', '01:00 PM', 'MSCIT303', 'Data Analytics', 'fac_vpatel', 'Prof. V. Patel', 'MSCIT-301'),

  // Thursday
  createSlot('msc3_thu_1', 1, 'msc_it', 2, 3, 'Thursday', '09:00 AM', '10:00 AM', 'MSCIT304', 'Cyber Security', 'fac_sjoshi', 'Prof. S. Joshi', 'MSCIT-301'),
  createSlot('msc3_thu_2', 2, 'msc_it', 2, 3, 'Thursday', '10:00 AM', '11:00 AM', 'MSCIT303-LAB', 'Data Analytics Lab', 'fac_vpatel', 'Prof. V. Patel', 'IT-Lab-2', 'lab'),
  createSlot('msc3_thu_3', 3, 'msc_it', 2, 3, 'Thursday', '11:15 AM', '12:15 PM', 'MSCIT302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MSCIT-302'),
  createSlot('msc3_thu_4', 4, 'msc_it', 2, 3, 'Thursday', '12:15 PM', '01:00 PM', 'MSCIT305', 'Cloud Computing', 'fac_ndesai', 'Prof. N. Desai', 'MSCIT-301'),

  // Friday
  createSlot('msc3_fri_1', 1, 'msc_it', 2, 3, 'Friday', '09:00 AM', '10:00 AM', 'MSCIT305', 'Cloud Computing', 'fac_ndesai', 'Prof. N. Desai', 'MSCIT-302'),
  createSlot('msc3_fri_2', 2, 'msc_it', 2, 3, 'Friday', '10:00 AM', '11:00 AM', 'MSCIT301', 'Python for Data Science', 'fac_hjoshi', 'Prof. H. Joshi', 'MSCIT-301'),
  createSlot('msc3_fri_3', 3, 'msc_it', 2, 3, 'Friday', '11:15 AM', '12:15 PM', 'MSCIT304-LAB', 'Cyber Security Lab', 'fac_sjoshi', 'Prof. S. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc3_fri_4', 4, 'msc_it', 2, 3, 'Friday', '12:15 PM', '01:00 PM', 'MSCIT302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MSCIT-302'),

  // Saturday
  createSlot('msc3_sat_1', 1, 'msc_it', 2, 3, 'Saturday', '09:00 AM', '10:00 AM', 'MSCIT303', 'Data Analytics', 'fac_vpatel', 'Prof. V. Patel', 'MSCIT-301'),
  createSlot('msc3_sat_2', 2, 'msc_it', 2, 3, 'Saturday', '10:00 AM', '11:00 AM', 'MSCIT302', 'Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'MSCIT-302'),
  createSlot('msc3_sat_3', 3, 'msc_it', 2, 3, 'Saturday', '11:15 AM', '12:15 PM', 'MSCIT301-LAB', 'Python Lab', 'fac_hjoshi', 'Prof. H. Joshi', 'IT-Lab-1', 'lab'),
  createSlot('msc3_sat_4', 4, 'msc_it', 2, 3, 'Saturday', '12:15 PM', '01:00 PM', 'MSCIT306', 'Project Work', 'fac_ndesai', 'Prof. N. Desai', 'IT-Lab-2', 'lab'),
];

// ==========================================
// 5. BCA — Semester 1, 3, 5 (Cross-Cohort Taught by Faculty)
// ==========================================
export const BCA_SEM1_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('bca1_mon_1', 1, 'bca', 1, 1, 'Monday', '09:00 AM', '10:00 AM', 'BCA101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'Room 101'),
  createSlot('bca1_mon_2', 2, 'bca', 1, 1, 'Monday', '10:00 AM', '11:00 AM', 'BCA102', 'Web Technology-I', 'fac_ndesai', 'Prof. N. Desai', 'Room 101'),
  createSlot('bca1_mon_3', 3, 'bca', 1, 1, 'Monday', '11:15 AM', '12:15 PM', 'BCA103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'Room 101'),
  createSlot('bca1_mon_4', 4, 'bca', 1, 1, 'Monday', '12:15 PM', '01:00 PM', 'BCA102-LAB', 'Web Programming Lab', 'fac_ndesai', 'Prof. N. Desai', 'Comp Lab 1', 'lab'),

  // Tuesday
  createSlot('bca1_tue_1', 1, 'bca', 1, 1, 'Tuesday', '09:00 AM', '10:00 AM', 'BCA102', 'Web Technology-I', 'fac_ndesai', 'Prof. N. Desai', 'Room 101'),
  createSlot('bca1_tue_2', 2, 'bca', 1, 1, 'Tuesday', '10:00 AM', '11:00 AM', 'BCA101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'Comp Lab 1', 'lab'),
  createSlot('bca1_tue_3', 3, 'bca', 1, 1, 'Tuesday', '11:15 AM', '12:15 PM', 'BCA104', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'Room 101'),
  createSlot('bca1_tue_4', 4, 'bca', 1, 1, 'Tuesday', '12:15 PM', '01:00 PM', 'BCA103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'Room 101'),

  // Wednesday
  createSlot('bca1_wed_1', 1, 'bca', 1, 1, 'Wednesday', '09:00 AM', '10:00 AM', 'BCA103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'Room 101'),
  createSlot('bca1_wed_2', 2, 'bca', 1, 1, 'Wednesday', '10:00 AM', '11:00 AM', 'BCA102', 'Web Technology-I', 'fac_ndesai', 'Prof. N. Desai', 'Room 101'),
  createSlot('bca1_wed_3', 3, 'bca', 1, 1, 'Wednesday', '11:15 AM', '12:15 PM', 'BCA101-LAB', 'C Programming Lab', 'fac_jshah', 'Prof. J. Shah', 'Comp Lab 1', 'lab'),
  createSlot('bca1_wed_4', 4, 'bca', 1, 1, 'Wednesday', '12:15 PM', '01:00 PM', 'BCA104', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'Room 101'),

  // Thursday
  createSlot('bca1_thu_1', 1, 'bca', 1, 1, 'Thursday', '09:00 AM', '10:00 AM', 'BCA101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'Room 101'),
  createSlot('bca1_thu_2', 2, 'bca', 1, 1, 'Thursday', '10:00 AM', '11:00 AM', 'BCA103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'Room 101'),
  createSlot('bca1_thu_3', 3, 'bca', 1, 1, 'Thursday', '11:15 AM', '12:15 PM', 'BCA102', 'Web Technology-I', 'fac_ndesai', 'Prof. N. Desai', 'Room 101'),
  createSlot('bca1_thu_4', 4, 'bca', 1, 1, 'Thursday', '12:15 PM', '01:00 PM', 'BCA102-LAB', 'Web Programming Lab', 'fac_ndesai', 'Prof. N. Desai', 'Comp Lab 1', 'lab'),

  // Friday
  createSlot('bca1_fri_1', 1, 'bca', 1, 1, 'Friday', '09:00 AM', '10:00 AM', 'BCA102', 'Web Technology-I', 'fac_ndesai', 'Prof. N. Desai', 'Room 101'),
  createSlot('bca1_fri_2', 2, 'bca', 1, 1, 'Friday', '10:00 AM', '11:00 AM', 'BCA101', 'C Programming', 'fac_jshah', 'Prof. J. Shah', 'Room 101'),
  createSlot('bca1_fri_3', 3, 'bca', 1, 1, 'Friday', '11:15 AM', '12:15 PM', 'BCA103', 'Discrete Mathematics', 'fac_kshah', 'Prof. K. Shah', 'Room 101'),
  createSlot('bca1_fri_4', 4, 'bca', 1, 1, 'Friday', '12:15 PM', '01:00 PM', 'BCA101-LAB', 'C Programming Lab', 'fac_jshah', 'Prof. J. Shah', 'Comp Lab 1', 'lab'),

  // Saturday
  createSlot('bca1_sat_1', 1, 'bca', 1, 1, 'Saturday', '09:00 AM', '10:00 AM', 'BCA104', 'Communication Skills', 'fac_pshah', 'Prof. P. Shah', 'Room 101'),
  createSlot('bca1_sat_2', 2, 'bca', 1, 1, 'Saturday', '10:00 AM', '11:00 AM', 'BCA101', 'C Programming Revision', 'fac_jshah', 'Prof. J. Shah', 'Room 101'),
  createSlot('bca1_sat_3', 3, 'bca', 1, 1, 'Saturday', '11:15 AM', '12:15 PM', 'BCA102-PRJ', 'Web Project Clinic', 'fac_ndesai', 'Prof. N. Desai', 'Comp Lab 1', 'lab'),
  createSlot('bca1_sat_4', 4, 'bca', 1, 1, 'Saturday', '12:15 PM', '01:00 PM', 'BCA105', 'Open Lab & Doubt Session', 'fac_amehta', 'Prof. A. Mehta', 'Comp Lab 1', 'lab'),
];

export const BCA_SEM3_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('bca3_mon_1', 1, 'bca', 2, 3, 'Monday', '09:00 AM', '10:00 AM', 'BCA201', 'DBMS & SQL Foundations', 'fac_rpatel', 'Prof. R. Patel', 'Room 102'),
  createSlot('bca3_mon_2', 2, 'bca', 2, 3, 'Monday', '10:00 AM', '11:00 AM', 'BCA202', 'Data Structures in Java', 'fac_amehta', 'Prof. A. Mehta', 'Room 102'),
  createSlot('bca3_mon_3', 3, 'bca', 2, 3, 'Monday', '11:15 AM', '12:15 PM', 'BCA203', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'Room 102'),
  createSlot('bca3_mon_4', 4, 'bca', 2, 3, 'Monday', '12:15 PM', '01:00 PM', 'BCA201-LAB', 'DBMS Practical Lab', 'fac_rpatel', 'Prof. R. Patel', 'Comp Lab 2', 'lab'),

  // Tuesday
  createSlot('bca3_tue_1', 1, 'bca', 2, 3, 'Tuesday', '09:00 AM', '10:00 AM', 'BCA202', 'Data Structures in Java', 'fac_amehta', 'Prof. A. Mehta', 'Room 102'),
  createSlot('bca3_tue_2', 2, 'bca', 2, 3, 'Tuesday', '10:00 AM', '11:00 AM', 'BCA201', 'DBMS & SQL Foundations', 'fac_rpatel', 'Prof. R. Patel', 'Room 102'),
  createSlot('bca3_tue_3', 3, 'bca', 2, 3, 'Tuesday', '11:15 AM', '12:15 PM', 'BCA204', 'Software Engineering Principles', 'fac_dshah', 'Prof. D. Shah', 'Room 102'),
  createSlot('bca3_tue_4', 4, 'bca', 2, 3, 'Tuesday', '12:15 PM', '01:00 PM', 'BCA202-LAB', 'Data Structures Lab', 'fac_amehta', 'Prof. A. Mehta', 'Comp Lab 2', 'lab'),

  // Wednesday
  createSlot('bca3_wed_1', 1, 'bca', 2, 3, 'Wednesday', '09:00 AM', '10:00 AM', 'BCA203', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'Room 102'),
  createSlot('bca3_wed_2', 2, 'bca', 2, 3, 'Wednesday', '10:00 AM', '11:00 AM', 'BCA204', 'Software Engineering Principles', 'fac_dshah', 'Prof. D. Shah', 'Room 102'),
  createSlot('bca3_wed_3', 3, 'bca', 2, 3, 'Wednesday', '11:15 AM', '12:15 PM', 'BCA201', 'DBMS & SQL Foundations', 'fac_rpatel', 'Prof. R. Patel', 'Room 102'),
  createSlot('bca3_wed_4', 4, 'bca', 2, 3, 'Wednesday', '12:15 PM', '01:00 PM', 'BCA201-LAB', 'DBMS Query Optimization', 'fac_rpatel', 'Prof. R. Patel', 'Comp Lab 2', 'lab'),

  // Thursday
  createSlot('bca3_thu_1', 1, 'bca', 2, 3, 'Thursday', '09:00 AM', '10:00 AM', 'BCA204', 'Software Engineering Principles', 'fac_dshah', 'Prof. D. Shah', 'Room 102'),
  createSlot('bca3_thu_2', 2, 'bca', 2, 3, 'Thursday', '10:00 AM', '11:00 AM', 'BCA202', 'Data Structures in Java', 'fac_amehta', 'Prof. A. Mehta', 'Room 102'),
  createSlot('bca3_thu_3', 3, 'bca', 2, 3, 'Thursday', '11:15 AM', '12:15 PM', 'BCA203', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'Room 102'),
  createSlot('bca3_thu_4', 4, 'bca', 2, 3, 'Thursday', '12:15 PM', '01:00 PM', 'BCA202-LAB', 'Java Algorithms Lab', 'fac_amehta', 'Prof. A. Mehta', 'Comp Lab 2', 'lab'),

  // Friday
  createSlot('bca3_fri_1', 1, 'bca', 2, 3, 'Friday', '09:00 AM', '10:00 AM', 'BCA201', 'DBMS & SQL Foundations', 'fac_rpatel', 'Prof. R. Patel', 'Room 102'),
  createSlot('bca3_fri_2', 2, 'bca', 2, 3, 'Friday', '10:00 AM', '11:00 AM', 'BCA203', 'Computer Networks', 'fac_sjoshi', 'Prof. S. Joshi', 'Room 102'),
  createSlot('bca3_fri_3', 3, 'bca', 2, 3, 'Friday', '11:15 AM', '12:15 PM', 'BCA202', 'Data Structures in Java', 'fac_amehta', 'Prof. A. Mehta', 'Room 102'),
  createSlot('bca3_fri_4', 4, 'bca', 2, 3, 'Friday', '12:15 PM', '01:00 PM', 'BCA205', 'Mini Project Hands-on', 'fac_dshah', 'Prof. D. Shah', 'Comp Lab 2', 'lab'),

  // Saturday
  createSlot('bca3_sat_1', 1, 'bca', 2, 3, 'Saturday', '09:00 AM', '10:00 AM', 'BCA202', 'Data Structures Revision', 'fac_amehta', 'Prof. A. Mehta', 'Room 102'),
  createSlot('bca3_sat_2', 2, 'bca', 2, 3, 'Saturday', '10:00 AM', '11:00 AM', 'BCA204', 'Agile Scrum Workshop', 'fac_dshah', 'Prof. D. Shah', 'Room 102'),
  createSlot('bca3_sat_3', 3, 'bca', 2, 3, 'Saturday', '11:15 AM', '12:15 PM', 'BCA201-REV', 'SQL Schema Clinic', 'fac_rpatel', 'Prof. R. Patel', 'Comp Lab 2', 'lab'),
  createSlot('bca3_sat_4', 4, 'bca', 2, 3, 'Saturday', '12:15 PM', '01:00 PM', 'BCA206', 'Project Code Review', 'fac_sjoshi', 'Prof. S. Joshi', 'Comp Lab 2', 'lab'),
];

export const BCA_SEM5_SLOTS: TimetableSlot[] = [
  // Monday
  createSlot('bca5_mon_1', 1, 'bca', 3, 5, 'Monday', '09:00 AM', '10:00 AM', 'BCA301', 'Cloud Computing & DevOps', 'fac_vpatel', 'Prof. V. Patel', 'Room 103'),
  createSlot('bca5_mon_2', 2, 'bca', 3, 5, 'Monday', '10:00 AM', '11:00 AM', 'BCA302', 'Agile Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'Room 103'),
  createSlot('bca5_mon_3', 3, 'bca', 3, 5, 'Monday', '11:15 AM', '12:15 PM', 'BCA303', 'Mobile Application Dev', 'fac_mjoshi', 'Prof. M. Joshi', 'Room 103'),
  createSlot('bca5_mon_4', 4, 'bca', 3, 5, 'Monday', '12:15 PM', '01:00 PM', 'BCA301-LAB', 'Cloud Deployment Lab', 'fac_vpatel', 'Prof. V. Patel', 'Adv Web Lab', 'lab'),

  // Tuesday
  createSlot('bca5_tue_1', 1, 'bca', 3, 5, 'Tuesday', '09:00 AM', '10:00 AM', 'BCA303', 'Mobile Application Dev', 'fac_mjoshi', 'Prof. M. Joshi', 'Room 103'),
  createSlot('bca5_tue_2', 2, 'bca', 3, 5, 'Tuesday', '10:00 AM', '11:00 AM', 'BCA301', 'Cloud Computing & DevOps', 'fac_vpatel', 'Prof. V. Patel', 'Room 103'),
  createSlot('bca5_tue_3', 3, 'bca', 3, 5, 'Tuesday', '11:15 AM', '12:15 PM', 'BCA304', 'Machine Learning Foundations', 'fac_hjoshi', 'Prof. H. Joshi', 'Room 103'),
  createSlot('bca5_tue_4', 4, 'bca', 3, 5, 'Tuesday', '12:15 PM', '01:00 PM', 'BCA303-LAB', 'Android Studio Lab', 'fac_mjoshi', 'Prof. M. Joshi', 'Adv Web Lab', 'lab'),

  // Wednesday
  createSlot('bca5_wed_1', 1, 'bca', 3, 5, 'Wednesday', '09:00 AM', '10:00 AM', 'BCA302', 'Agile Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'Room 103'),
  createSlot('bca5_wed_2', 2, 'bca', 3, 5, 'Wednesday', '10:00 AM', '11:00 AM', 'BCA304', 'Machine Learning Foundations', 'fac_hjoshi', 'Prof. H. Joshi', 'Room 103'),
  createSlot('bca5_wed_3', 3, 'bca', 3, 5, 'Wednesday', '11:15 AM', '12:15 PM', 'BCA301', 'Cloud Computing & DevOps', 'fac_vpatel', 'Prof. V. Patel', 'Room 103'),
  createSlot('bca5_wed_4', 4, 'bca', 3, 5, 'Wednesday', '12:15 PM', '01:00 PM', 'BCA305-LAB', 'Fullstack Capstone Lab', 'fac_amehta', 'Prof. A. Mehta', 'Adv Web Lab', 'lab'),

  // Thursday
  createSlot('bca5_thu_1', 1, 'bca', 3, 5, 'Thursday', '09:00 AM', '10:00 AM', 'BCA304', 'Machine Learning Foundations', 'fac_hjoshi', 'Prof. H. Joshi', 'Room 103'),
  createSlot('bca5_thu_2', 2, 'bca', 3, 5, 'Thursday', '10:00 AM', '11:00 AM', 'BCA302', 'Agile Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'Room 103'),
  createSlot('bca5_thu_3', 3, 'bca', 3, 5, 'Thursday', '11:15 AM', '12:15 PM', 'BCA303', 'Mobile Application Dev', 'fac_mjoshi', 'Prof. M. Joshi', 'Room 103'),
  createSlot('bca5_thu_4', 4, 'bca', 3, 5, 'Thursday', '12:15 PM', '01:00 PM', 'BCA304-LAB', 'ML Python Lab', 'fac_hjoshi', 'Prof. H. Joshi', 'Adv Web Lab', 'lab'),

  // Friday
  createSlot('bca5_fri_1', 1, 'bca', 3, 5, 'Friday', '09:00 AM', '10:00 AM', 'BCA301', 'Cloud Computing & DevOps', 'fac_vpatel', 'Prof. V. Patel', 'Room 103'),
  createSlot('bca5_fri_2', 2, 'bca', 3, 5, 'Friday', '10:00 AM', '11:00 AM', 'BCA303', 'Mobile Application Dev', 'fac_mjoshi', 'Prof. M. Joshi', 'Room 103'),
  createSlot('bca5_fri_3', 3, 'bca', 3, 5, 'Friday', '11:15 AM', '12:15 PM', 'BCA302', 'Agile Software Engineering', 'fac_dshah', 'Prof. D. Shah', 'Room 103'),
  createSlot('bca5_fri_4', 4, 'bca', 3, 5, 'Friday', '12:15 PM', '01:00 PM', 'BCA305-LAB', 'Fullstack Capstone Lab', 'fac_amehta', 'Prof. A. Mehta', 'Adv Web Lab', 'lab'),

  // Saturday
  createSlot('bca5_sat_1', 1, 'bca', 3, 5, 'Saturday', '09:00 AM', '10:00 AM', 'BCA305', 'Capstone Project Review', 'fac_vpatel', 'Prof. V. Patel', 'Room 103'),
  createSlot('bca5_sat_2', 2, 'bca', 3, 5, 'Saturday', '10:00 AM', '11:00 AM', 'BCA302', 'Sprint Demo Session', 'fac_dshah', 'Prof. D. Shah', 'Room 103'),
  createSlot('bca5_sat_3', 3, 'bca', 3, 5, 'Saturday', '11:15 AM', '12:15 PM', 'BCA304-REV', 'Model Deployment Review', 'fac_hjoshi', 'Prof. H. Joshi', 'Adv Web Lab', 'lab'),
  createSlot('bca5_sat_4', 4, 'bca', 3, 5, 'Saturday', '12:15 PM', '01:00 PM', 'BCA306', 'Industry Expert Mentorship', 'fac_amehta', 'Prof. A. Mehta', 'Adv Web Lab', 'lab'),
];

export const ALL_ACTIVE_SLOTS: TimetableSlot[] = [
  ...MCA_SEM1_SLOTS,
  ...MCA_SEM3_SLOTS,
  ...MSCIT_SEM1_SLOTS,
  ...MSCIT_SEM3_SLOTS,
  ...BCA_SEM1_SLOTS,
  ...BCA_SEM3_SLOTS,
  ...BCA_SEM5_SLOTS,
];
