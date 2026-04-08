import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Users, Calendar, Save, Loader2, Search, UserCheck } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, push, set } from 'firebase/database';

type Student = {
    id: string;
    name: string;
    rollNo: string;
    class: string;
};

export default function AttendanceManagement() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [attendance, setAttendance] = useState<Record<string, boolean>>({});
    const [selectedClass, setSelectedClass] = useState('CS-A');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const studentsRef = ref(db, 'students');
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Student[] = Object.entries(data)
                    .map(([key, val]: [string, any]) => ({
                        id: key,
                        ...val
                    }))
                    .filter(s => s.status === 'Active');
                setStudents(list);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filteredStudents = students.filter(s => 
        s.class === selectedClass && 
        (s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.includes(search))
    );

    const toggleAttendance = (id: string) => {
        setAttendance(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleMarkAll = (present: boolean) => {
        const next: Record<string, boolean> = {};
        filteredStudents.forEach(s => next[s.id] = present);
        setAttendance(prev => ({ ...prev, ...next }));
    };

    const handleSave = async () => {
        if (filteredStudents.length === 0) return;
        setSaving(true);
        
        const attendanceRecord = {
            date,
            class: selectedClass,
            records: attendance,
            timestamp: Date.now()
        };

        try {
            await push(ref(db, `attendance/${selectedClass}/${date}`), attendanceRecord);
            alert('Attendance saved successfully!');
            setSaving(false);
        } catch (error) {
            console.error(error);
            alert('Failed to save attendance.');
            setSaving(false);
        }
    };

    const classes = Array.from(new Set(students.map(s => s.class))).sort();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <UserCheck className="w-7 h-7 text-emerald-600" /> Mark Attendance
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Record daily student attendance for your classes.</p>
                </div>
                <div className="flex gap-2">
                    <input 
                        type="date" 
                        value={date} 
                        onChange={e => setDate(e.target.value)}
                        className="rounded-xl border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <select 
                        value={selectedClass} 
                        onChange={e => setSelectedClass(e.target.value)}
                        className="rounded-xl border-gray-300 text-sm focus:ring-emerald-500 focus:border-emerald-500"
                    >
                        {classes.map(c => <option key={c} value={c}>{c}</option>)}
                        {classes.length === 0 && <option>No Classes</option>}
                    </select>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-2xl shadow-sm ring-1 ring-gray-900/5">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search student..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border-gray-200 text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                </div>
                <div className="flex gap-3">
                    <button onClick={() => handleMarkAll(true)} className="text-xs font-semibold text-emerald-600 hover:bg-emerald-50 px-3 py-2 rounded-lg transition-colors">Mark All Present</button>
                    <button onClick={() => handleMarkAll(false)} className="text-xs font-semibold text-rose-600 hover:bg-rose-50 px-3 py-2 rounded-lg transition-colors">Mark All Absent</button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Student Name</th>
                            <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr><td colSpan={3} className="py-12 text-center"><Loader2 className="h-6 w-6 animate-spin text-emerald-400 mx-auto" /></td></tr>
                        ) : filteredStudents.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-mono text-gray-500">{s.rollNo}</td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                                <td className="py-4 pr-6 text-right">
                                    <button 
                                        onClick={() => toggleAttendance(s.id)}
                                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                                            attendance[s.id] 
                                            ? 'bg-emerald-100 text-emerald-700 ring-1 ring-emerald-600/20' 
                                            : 'bg-rose-100 text-rose-700 ring-1 ring-rose-600/20'
                                        }`}
                                    >
                                        {attendance[s.id] ? <><CheckCircle className="h-3.5 w-3.5" /> Present</> : <><XCircle className="h-3.5 w-3.5" /> Absent</>}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredStudents.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No students found for class {selectedClass}.</div>
                )}
            </div>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving || filteredStudents.length === 0}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-200 hover:bg-emerald-500 disabled:opacity-50 transition-all"
                >
                    {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
                    Save Attendance
                </button>
            </div>
        </div>
    );
}
