import { useState } from 'react';
import { Layers, Plus, Edit2, Trash2 } from 'lucide-react';

type ClassSection = { id: number; name: string; section: string; students: number; advisor: string };

export default function Classes() {
    const [classes, setClasses] = useState<ClassSection[]>([
        { id: 1, name: 'Computer Science', section: 'CS-A', students: 60, advisor: 'Prof. Smith' },
        { id: 2, name: 'Computer Science', section: 'CS-B', students: 58, advisor: 'Dr. Patel' },
        { id: 3, name: 'Mechanical Eng.', section: 'ME-A', students: 55, advisor: 'Dr. Williams' },
        { id: 4, name: 'Electronics', section: 'EC-A', students: 50, advisor: 'Prof. Davis' },
    ]);

    const handleAdd = () => {
        const name = prompt('Department / Class Name:');
        if (!name) return;
        const section = prompt('Section (e.g. A, B):') || 'A';
        setClasses(prev => [...prev, { id: Date.now(), name, section: `${name.substring(0, 2).toUpperCase()}-${section}`, students: 0, advisor: 'TBD' }]);
    };

    const handleEdit = (id: number) => {
        const c = classes.find(cl => cl.id === id);
        if (!c) return;
        const advisor = prompt('Edit Class Advisor:', c.advisor);
        if (advisor) setClasses(prev => prev.map(cl => cl.id === id ? { ...cl, advisor } : cl));
    };

    const handleDelete = (id: number) => {
        if (confirm('Remove this class?')) setClasses(prev => prev.filter(c => c.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3"><Layers className="w-7 h-7 text-indigo-600" /> Classes & Sections</h2>
                    <p className="mt-1 text-sm text-gray-500">Manage class divisions and assigned advisors.</p>
                </div>
                <button onClick={handleAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"><Plus className="h-4 w-4" /> Add Class</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {classes.map(c => (
                    <div key={c.id} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 hover:shadow-md transition-all hover:-translate-y-0.5">
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="text-base font-semibold text-gray-900">{c.section}</h3>
                                <p className="text-sm text-gray-500 mt-0.5">{c.name}</p>
                            </div>
                            <div className="flex gap-1">
                                <button onClick={() => handleEdit(c.id)} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50"><Edit2 className="h-4 w-4" /></button>
                                <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50"><Trash2 className="h-4 w-4" /></button>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-sm">
                            <span className="text-gray-500">{c.students} Students</span>
                            <span className="text-indigo-600 font-medium">{c.advisor}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
