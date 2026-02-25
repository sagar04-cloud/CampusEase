import { useState } from 'react';
import { BookOpen, Plus, Edit2, Trash2 } from 'lucide-react';

type Subject = { id: number; code: string; name: string; department: string; credits: number };

export default function Subjects() {
    const [subjects, setSubjects] = useState<Subject[]>([
        { id: 1, code: 'CS301', name: 'Data Structures & Algorithms', department: 'CS', credits: 4 },
        { id: 2, code: 'CS302', name: 'Operating Systems', department: 'CS', credits: 3 },
        { id: 3, code: 'MA201', name: 'Linear Algebra', department: 'Math', credits: 3 },
        { id: 4, code: 'PH101', name: 'Engineering Physics', department: 'Physics', credits: 4 },
    ]);

    const handleAdd = () => {
        const name = prompt('Subject Name:');
        if (!name) return;
        const code = prompt('Subject Code:') || `SUB${Date.now()}`;
        const department = prompt('Department:') || 'General';
        setSubjects(prev => [...prev, { id: Date.now(), code, name, department, credits: 3 }]);
    };

    const handleEdit = (id: number) => {
        const s = subjects.find(sub => sub.id === id);
        if (!s) return;
        const name = prompt('Edit Subject Name:', s.name);
        if (name) setSubjects(prev => prev.map(sub => sub.id === id ? { ...sub, name } : sub));
    };

    const handleDelete = (id: number) => {
        if (confirm('Remove this subject?')) setSubjects(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><BookOpen className="w-7 h-7 text-indigo-600" /> Subjects</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage course subjects across departments.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"><Plus className="h-4 w-4" /> Add Subject</button>
            </div>
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">Code</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Subject Name</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Department</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Credits</th>
                            <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {subjects.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-mono font-medium text-indigo-600">{s.code}</td>
                                <td className="px-3 py-4 text-sm font-medium text-gray-900">{s.name}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.department}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.credits}</td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => handleEdit(s.id)} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subjects.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No subjects found.</div>}
            </div>
        </div>
    );
}
