import { useState } from 'react';
import { ClipboardCheck, Search } from 'lucide-react';

type AttendanceRecord = { id: number; student: string; rollNo: string; class: string; date: string; status: 'Present' | 'Absent' | 'Late' };

export default function Attendance() {
    const [records] = useState<AttendanceRecord[]>([
        { id: 1, student: 'Alex Johnson', rollNo: 'CS2026-001', class: 'CS-A', date: 'Feb 25, 2026', status: 'Present' },
        { id: 2, student: 'Sarah Smith', rollNo: 'CS2026-002', class: 'CS-A', date: 'Feb 25, 2026', status: 'Present' },
        { id: 3, student: 'Mike Brown', rollNo: 'ME2026-010', class: 'ME-B', date: 'Feb 25, 2026', status: 'Absent' },
        { id: 4, student: 'Emily Davis', rollNo: 'EC2026-005', class: 'EC-A', date: 'Feb 25, 2026', status: 'Late' },
        { id: 5, student: 'Alex Johnson', rollNo: 'CS2026-001', class: 'CS-A', date: 'Feb 24, 2026', status: 'Present' },
        { id: 6, student: 'Mike Brown', rollNo: 'ME2026-010', class: 'ME-B', date: 'Feb 24, 2026', status: 'Present' },
    ]);
    const [search, setSearch] = useState('');

    const filtered = records.filter(r => r.student.toLowerCase().includes(search.toLowerCase()) || r.rollNo.toLowerCase().includes(search.toLowerCase()));

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Present': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            case 'Absent': return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'Late': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><ClipboardCheck className="w-7 h-7 text-indigo-600" /> Attendance Records</h2>
                <p className="mt-1 text-sm text-gray-500">View and track student attendance across all classes.</p>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or roll no..." className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">Student</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(r => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{r.student}</td>
                                <td className="px-3 py-4 text-sm text-gray-500 font-mono">{r.rollNo}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{r.class}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{r.date}</td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusBadge(r.status)}`}>{r.status}</span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No records found.</div>}
            </div>
        </div>
    );
}
