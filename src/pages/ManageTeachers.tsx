import { useState } from 'react';
import { Users, Plus, Search, Edit2, Trash2 } from 'lucide-react';

type Teacher = { id: number; name: string; department: string; email: string; status: string };

export default function ManageTeachers() {
    const [teachers, setTeachers] = useState<Teacher[]>([
        { id: 1, name: 'Prof. Smith', department: 'Computer Science', email: 'smith@campusease.edu', status: 'Active' },
        { id: 2, name: 'Dr. Patel', department: 'Mathematics', email: 'patel@campusease.edu', status: 'Active' },
        { id: 3, name: 'Dr. Williams', department: 'Physics', email: 'williams@campusease.edu', status: 'On Leave' },
        { id: 4, name: 'Prof. Davis', department: 'Chemistry', email: 'davis@campusease.edu', status: 'Active' },
    ]);
    const [search, setSearch] = useState('');

    const filtered = teachers.filter(t => t.name.toLowerCase().includes(search.toLowerCase()) || t.department.toLowerCase().includes(search.toLowerCase()));

    const handleAdd = () => {
        const name = prompt('Teacher Name:');
        if (!name) return;
        const department = prompt('Department:') || 'General';
        const email = prompt('Email:') || `${name.toLowerCase().replace(/\s/g, '')}@campusease.edu`;
        setTeachers(prev => [...prev, { id: Date.now(), name, department, email, status: 'Active' }]);
    };

    const handleEdit = (id: number) => {
        const teacher = teachers.find(t => t.id === id);
        if (!teacher) return;
        const name = prompt('Edit Name:', teacher.name);
        if (name) setTeachers(prev => prev.map(t => t.id === id ? { ...t, name } : t));
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to remove this teacher?')) {
            setTeachers(prev => prev.filter(t => t.id !== id));
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Users className="w-7 h-7 text-indigo-600" /> Manage Teachers
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Add, edit, or remove faculty members.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                    <Plus className="h-4 w-4" /> Add Teacher
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search teachers..." className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm" />
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">Name</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Email</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                            <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filtered.map(t => (
                            <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">{t.name}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{t.department}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{t.email}</td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${t.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20'}`}>{t.status}</span>
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(t.id)} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(t.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filtered.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No teachers found.</div>}
            </div>
        </div>
    );
}
