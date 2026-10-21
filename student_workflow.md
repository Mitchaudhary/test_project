# Student Portal & Workflow Documentation

This document outlines all features, requirements, and workflows implemented for **Students** in the **Lok Jagruti Kendra University (LJU) ERP & Timetable Portal**.

---

## 1. Authentication & Stream-Specific Access
- **Multi-Role Login**: Students authenticate via the unified login page by selecting their specific program cohort and semester (e.g., M.Sc. IT Sem 3, BCA Sem 1, MCA Sem 3).
- **Stream Isolation**: Once logged in, students only see courses, attendance data, timetables, and syllabus tracking belonging strictly to their own enrolled stream, department, and semester. Cross-department clutter or master options are automatically hidden.

## 2. Aggregate Attendance & 75% Debarment Ordinance Calculator
- **Aggregate Turnout**: Displays overall attendance percentage calculated from conducted vs. attended lectures.
- **75% Threshold Badge**: 
  - **Green Badge (Safe/Eligible)**: Indicates attendance is $\ge 75\%$, displaying the safe lecture buffer count.
  - **Red Badge (At Risk / Defaulter)**: Warns of debarment risk and calculates the exact number of consecutive lectures required for recovery.
- **Streak & Profile**: Displays student roll number, daily streak counter, and direct quick-action buttons.

## 3. Subject-Wise Attendance & Syllabus Tracking
- **Stream-Locked Courses**: Students view all active subjects for their current semester (e.g., all 4 subjects for M.Sc. IT Sem 3: Python for Data Science, Data Analytics, Cyber Security, Cloud Computing).
- **Granular Micro-Topic Lesson Plans**: 40-lecture breakdown per subject showing completed vs. pending micro-topics, module names, delivered lecture counts, and upcoming lecture topics.

## 4. Semester Timetable & Weekly Navigation
- **Stream Timetable View**: Displays the student's daily and weekly lecture schedule with room assignments, lab locations, and faculty names.
- **Restricted Week Selector**: For students, week navigation is cleanly restricted to **Current Week (Week 11)** and **Next Week (Week 12)**. Master university timetable conflict warnings and conflict engines are hidden from student views.
