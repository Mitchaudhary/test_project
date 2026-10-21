import React, { useState } from 'react';
import { 
  AlertTriangle, 
  Send, 
  CheckCircle2, 
  Download, 
  Search, 
  Mail, 
  ShieldCheck, 
  Calendar,
  User,
  BookOpen
} from 'lucide-react';
import { useAttendance } from '../../context/AttendanceContext';
import { ALL_STUDENTS_ROSTER } from '../../data/mockData';

export const DefaulterAuditView: React.FC = () => {
  const { getAtRiskDefaulters, courses, attendanceRecords, currentUser } = useAttendance();
  const [searchQuery, setSearchQuery] = useState('');
  const [dispatchedIds, setDispatchedIds] = useState<Set<string>>(new Set());
  const [batchNotified, setBatchNotified] = useState(false);

  const defaulters = getAtRiskDefaulters(75);

  const filteredDefaulters = defaulters.filter(d => 
    d.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.studentRoll.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.courseName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendIndividual = (id: string) => {
    setDispatchedIds(prev => new Set(prev).add(id));
  };

  const handleBatchDispatch = () => {
    defaulters.forEach(d => setDispatchedIds(prev => new Set(prev).add(d.id)));
    setBatchNotified(true);
    setTimeout(() => setBatchNotified(false), 4000);
  };

  const handleExportCSV = () => {
    const headers = 'Student Roll,Student Name,Subject Code,Subject Name,Current Turnout %,Required %,Deficit %,Exam Eligibility\n';
    const rows = defaulters.map(d => 
      `"${d.studentRoll}","${d.studentName}","${d.courseId.toUpperCase()}","${d.courseName}",${d.currentPercentage}%,75%,${75 - d.currentPercentage}%,"DEBARRED_WARNING"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `LJU_Attendance_Defaulters_Audit.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="bg-gradient-to-r from-slate-900 via-rose-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-300 text-xs font-semibold uppercase tracking-wider mb-1">
            <AlertTriangle className="w-4 h-4 text-rose-400" />
            <span>LJ University Examination Council • Statutory 75% Audit</span>
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-white">
            Semester Attendance Defaulters List (&lt;75%)
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Students falling below 75% aggregate are barred from writing university end-semester examinations under academic ordinance.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Defaulters CSV</span>
          </button>
          
          <button
            onClick={handleBatchDispatch}
            className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Dispatch Debarment Notices ({defaulters.length})</span>
          </button>
        </div>
      </div>

      {batchNotified && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs animate-in slide-in-from-top-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Official warning emails and SMS alerts dispatched to students and parents/guardians.</span>
        </div>
      )}

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by student roll, name, or course..."
            className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-600 focus:bg-white"
          />
        </div>

        <div className="text-xs font-mono font-bold text-slate-500">
          Total Flagged: <strong className="text-rose-600">{defaulters.length} Defaulters</strong>
        </div>
      </div>

      {/* Defaulter Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <th className="pb-3">Roll Number</th>
                <th className="pb-3">Student Name</th>
                <th className="pb-3">Subject</th>
                <th className="pb-3">Current Attendance</th>
                <th className="pb-3">Mandatory Shortage</th>
                <th className="pb-3">Status</th>
                <th className="pb-3 text-right">Notice Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDefaulters.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 italic">
                    No students currently below 75% matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredDefaulters.map(d => {
                  const isSent = dispatchedIds.has(d.id);
                  return (
                    <tr key={d.id} className="hover:bg-slate-50/70">
                      <td className="py-3 font-mono font-bold text-slate-700">
                        {d.studentRoll}
                      </td>
                      <td className="py-3 font-semibold text-slate-900">
                        {d.studentName}
                      </td>
                      <td className="py-3 text-slate-700">
                        <span className="font-mono text-indigo-600 font-bold mr-1">{d.courseId.toUpperCase()}</span>
                        {d.courseName}
                      </td>
                      <td className="py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-rose-500 rounded-full"
                              style={{ width: `${d.currentPercentage}%` }}
                            />
                          </div>
                          <span className="font-mono font-bold text-rose-600">{d.currentPercentage}%</span>
                        </div>
                      </td>
                      <td className="py-3 font-mono font-semibold text-rose-700">
                        -{75 - d.currentPercentage}% Short
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-700 border border-rose-200">
                          DEBARRED WARNING
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        {isSent ? (
                          <span className="text-[11px] font-bold text-emerald-600 inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Notice Dispatched
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleSendIndividual(d.id)}
                            className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                          >
                            Send Notice
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
