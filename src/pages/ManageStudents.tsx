import { useState } from 'react';
import { GraduationCap, Plus, Search, Edit2, Trash2 } from 'lucide-react';

type Student = { id: number; name: string; rollNo: string; class: string; email: string; status: string };

export default function ManageStudents() {
    const [students, setStudents] = useState<Student[]>([
        { id: 1, name: 'Alex Johnson', rollNo: 'CS2026-001', class: 'CS-A', email: 'alex@campusease.edu', status: 'Active' },
        { id: 2, name: 'Sarah Smith', rollNo: 'CS2026-002', class: 'CS-A', email: 'sarah@campusease.edu', status: 'Active' },
        { id: 3, name: 'Mike Brown', rollNo: 'ME2026-010', class: 'ME-B', email: 'mike@campusease.edu', status: 'Inactive' },
        { id: 4, name: 'Emily Davis', rollNo: 'EC2026-005', class: 'EC-A', email: 'emily@campusease.edu', status: 'Active' },
    ]);
    const [search, setSearch] = useState('');

    const filtered = students.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.rollNo.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        const name = prompt('Student Name:');
        if (!name) return;
        const rollNo = prompt('Roll Number:') || `STU-${Date.now()}`;
        const cls = prompt('Class:') || 'CS-A';
        setStudents(prev => [...prev, { id: Date.now(), name, rollNo, class: cls, email: `${name.toLowerCase().replace(/\s/g, '')}@campusease.edu`, status: 'Active' }]);
    };

    const handleEdit = (id: number) => {
        const s = students.find(st => st.id === id);
        if (!s) return;
        const name = prompt('Edit Name:', s.name);
        if (name) setStudents(prev => prev.map(st => st.id === id ? { ...st, name } : st));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this student?')) {
            setStudents(prev => prev.filter(s => s.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <GraduationCap className="w-7 h-7 text-indigo-600" /> Manage Students
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">View, add, or manage student records.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                    <Plus className="h-4 w-4" /> Add Student
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search students..." className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Roll No</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Class</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{s.name}</td>
                                <td className="px-3 py-4 text-sm text-gray-500 font-mono">{s.rollNo}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.class}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.email}</td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-300'}`}>{s.status}</span>
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(s.id)} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No students found.</div>}
            </div>
        </div>
    );
}
