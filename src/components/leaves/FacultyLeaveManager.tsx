import React, { useState } from 'react';
import { 
  Coffee, 
  Calendar, 
  User, 
  Clock, 
  MapPin, 
  Plus, 
  CheckCircle2, 
  AlertTriangle, 
  ChevronRight, 
  RotateCcw,
  Sparkles,
  Sun,
  ShieldCheck
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { DayOfWeek } from '../../types/attendance';

export const FacultyLeaveManager: React.FC = () => {
  const { 
    facultyLeaves, 
    requestFacultyLeave, 
    timetableSlots, 
    revertSubstitute, 
    weeks, 
    currentUser 
  } = useAttendance();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [leaveDate, setLeaveDate] = useState('2026-10-23');
  const [leaveDay, setLeaveDay] = useState<DayOfWeek>('Friday');
  const [leaveReason, setLeaveReason] = useState('State Level Technical Symposium & Paper Evaluation');
  const [selectedSlotId, setSelectedSlotId] = useState(timetableSlots[0]?.id || '');
  const [substituteFacultyName, setSubstituteFacultyName] = useState('Prof. Anjali Trivedi');

  const myOrProgramSlots = timetableSlots.filter(s => s.day === leaveDay);

  const handleSubmitLeave = (e: React.FormEvent) => {
    e.preventDefault();
    const slot = timetableSlots.find(s => s.id === selectedSlotId);
    if (!slot) return;

    requestFacultyLeave({
      facultyId: currentUser.id,
      facultyName: currentUser.name,
      date: leaveDate,
      day: leaveDay,
      reason: leaveReason,
      substituteAssignments: [
        {
          slotId: slot.id,
          substituteFacultyId: 'fac_substitute_user',
          substituteFacultyName,
        },
      ],
    });

    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <Coffee className="w-4 h-4" />
            <span>LJ University Academic Continuity & Substitute System</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Faculty Leave & Weekly Timetable Adjustment
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Ensure zero student class cancellations by assigning authorized substitute professors during faculty duties & holidays.
          </p>
        </div>

        {currentUser.role !== 'STUDENT' && (
          <button
            onClick={() => setIsFormOpen(!isFormOpen)}
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Apply Leave & Assign Substitute</span>
          </button>
        )}
      </div>

      {/* FORM: Apply Leave & Assign Substitute */}
      {isFormOpen && (
        <form onSubmit={handleSubmitLeave} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h4 className="font-bold text-slate-900 text-sm">
              Schedule Faculty Leave & Delegate Timetable Slot
            </h4>
            <span className="text-xs text-slate-400">Automatic Timetable Propagation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Leave Date
              </label>
              <input
                type="date"
                value={leaveDate}
                onChange={(e) => setLeaveDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Day of Week
              </label>
              <select
                value={leaveDay}
                onChange={(e) => setLeaveDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Substitute Faculty Member
              </label>
              <select
                value={substituteFacultyName}
                onChange={(e) => setSubstituteFacultyName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                <option value="Prof. Anjali Trivedi">Prof. Anjali Trivedi (Web / Communication)</option>
                <option value="Dr. Priya Shah">Dr. Priya Shah (Full Stack / HOD)</option>
                <option value="Prof. Neha Sharma">Prof. Neha Sharma (Data Structures)</option>
                <option value="Prof. Pooja Dave">Prof. Pooja Dave (Core Java)</option>
                <option value="Prof. Hardik Dave">Prof. Hardik Dave (Operating Systems)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Select Lecture Slot to Reassign ({leaveDay})
              </label>
              <select
                value={selectedSlotId}
                onChange={(e) => setSelectedSlotId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium outline-none focus:border-indigo-600 focus:bg-white cursor-pointer"
              >
                {myOrProgramSlots.map(s => (
                  <option key={s.id} value={s.id}>
                    {s.startTime} - {s.endTime} • {s.courseCode} ({s.courseName}) in {s.roomOrLab}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Reason for Leave
              </label>
              <input
                type="text"
                value={leaveReason}
                onChange={(e) => setLeaveReason(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-xl text-xs cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer"
            >
              Confirm Substitute Reassignment
            </button>
          </div>
        </form>
      )}

      {/* ACTIVE LEAVES & SUBSTITUTE ASSIGNMENTS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">
              Current Active Faculty Substitutions & Duty Leaves
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live timetable overrides reflecting on student timetables
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-lg">
            {facultyLeaves.length} Active Records
          </span>
        </div>

        <div className="space-y-3">
          {facultyLeaves.map(leave => (
            <div
              key={leave.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-xs text-slate-900">{leave.facultyName}</span>
                  <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    APPROVED
                  </span>
                  <span className="text-xs font-mono text-slate-500">
                    ({leave.day}, {leave.date})
                  </span>
                </div>
                <p className="text-xs text-slate-600">
                  Reason: <strong>{leave.reason}</strong>
                </p>

                {leave.substituteAssignments.map((sub, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-indigo-700 font-semibold pt-1">
                    <span>🔄 Substitute Teaching:</span>
                    <strong className="text-slate-900">{sub.substituteFacultyName}</strong>
                    <span className="text-slate-400">• Slot ID: {sub.slotId}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  type="button"
                  onClick={() => {
                    leave.substituteAssignments.forEach(sub => revertSubstitute(sub.slotId));
                  }}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:text-rose-600 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  Revert Substitute
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SEMESTER HOLIDAYS & SUNDAY POLICY */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            <h3 className="font-bold text-slate-900 text-sm">
              LJ University Semester Holiday & Sunday Calendar
            </h3>
          </div>
          <span className="text-xs text-slate-400">Academic Year 2026-27</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Weekly Non-Working Day</span>
            <p className="text-slate-600">Every <strong>Sunday</strong>: University Campus Closed. Zero lectures scheduled.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Mahatma Gandhi Jayanti</span>
            <p className="text-slate-600">October 02, 2026 (Gazetted National Holiday)</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Sardar Patel Jayanti</span>
            <p className="text-slate-600">October 31, 2026 (National Unity Day)</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Diwali & Vikram Samvat Break</span>
            <p className="text-slate-600">November 06 - 10, 2026 (Semester Recess)</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Saturday Project Lab Policy</span>
            <p className="text-slate-600">Half day hands-on lab sessions from 09:00 AM to 01:30 PM.</p>
          </div>
          <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
            <span className="font-bold text-slate-900 block">Final University Exams</span>
            <p className="text-slate-600">Commencing November 23, 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
