import { useState, useEffect } from 'react';
import { Users, Search, Mail, GraduationCap, Loader2, UserCheck } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

type Student = {
    id: string;
    name: string;
    rollNo: string;
    class: string;
    email: string;
    status: 'Active' | 'Inactive';
};

export default function StudentRoster() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedClass, setSelectedClass] = useState('All Classes');

    useEffect(() => {
        const studentsRef = ref(db, 'students');
        const unsubscribe = onValue(studentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Student[] = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                setStudents(list);
            } else {
                setStudents([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filtered = students.filter(s => {
        const matchesClass = selectedClass === 'All Classes' || s.class === selectedClass;
        const matchesSearch = s.name.toLowerCase().includes(search.toLowerCase()) ||
                             s.rollNo.toLowerCase().includes(search.toLowerCase());
        return matchesClass && matchesSearch;
    });

    const classes = ['All Classes', ...Array.from(new Set(students.map(s => s.class)))].sort();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-8 h-8 text-indigo-600" /> Student Directory
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">View and browse through the students enrolled in your department.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="relative w-full sm:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search student name or roll no..."
                        className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-indigo-600 outline-none shadow-sm"
                    />
                </div>
                <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {classes.map((cls) => (
                        <button
                            key={cls}
                            onClick={() => setSelectedClass(cls)}
                            className={`${selectedClass === cls
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                } rounded-lg px-4 py-1.5 text-xs font-bold transition-all duration-200 whitespace-nowrap`}
                        >
                            {cls}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
                ) : filtered.map((s) => (
                    <div key={s.id} className="relative group overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-900/5 hover:ring-indigo-600/30 hover:shadow-md transition-all duration-300">
                        <div className="flex items-center gap-4">
                            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-bold text-xl group-hover:scale-110 transition-transform">
                                {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <h3 className="text-base font-bold text-gray-900 truncate group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{s.name}</h3>
                                <p className="text-xs text-gray-500 font-mono tracking-wider">{s.rollNo}</p>
                            </div>
                            {s.status === 'Active' ? (
                                <span className="p-1.5 rounded-full bg-emerald-50 ring-1 ring-emerald-600/20"><UserCheck className="h-3.5 w-3.5 text-emerald-600" /></span>
                            ) : (
                                <span className="p-1.5 rounded-full bg-gray-50 ring-1 ring-gray-600/20"><UserCheck className="h-3.5 w-3.5 text-gray-400" /></span>
                            )}
                        </div>

                        <div className="mt-4 space-y-2">
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <GraduationCap className="h-4 w-4 text-indigo-400" />
                                <span>Class: <span className="font-bold text-gray-900">{s.class}</span></span>
                            </div>
                            <div className="flex items-center gap-2.5 text-sm text-gray-600">
                                <Mail className="h-4 w-4 text-indigo-400" />
                                <span className="truncate">{s.email}</span>
                            </div>
                        </div>


                    </div>
                ))}
                {!loading && filtered.length === 0 && (
                    <div className="col-span-full text-center py-16 text-gray-400 text-sm">No students found.</div>
                )}
            </div>
        </div>
    );
}
