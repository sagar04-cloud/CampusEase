import { useState, useEffect } from 'react';
import { BookOpen, Calendar, Clock, FileText, Plus, Trash2, X, Check, Loader2, Link, Search } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, push, remove } from 'firebase/database';

type Assignment = {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    class: string;
    type: 'Assignment' | 'Study Material' | 'Quiz';
    link?: string;
    author: string;
    createdAt: number;
};

type FormData = {
    title: string;
    description: string;
    dueDate: string;
    class: string;
    type: string;
    link: string;
};

const emptyForm = (): FormData => ({
    title: '', description: '', dueDate: new Date().toISOString().split('T')[0],
    class: 'CS-A', type: 'Assignment', link: ''
});

export default function AssignmentManagement({ userName }: { userName: string }) {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState<FormData>(emptyForm());
    const [saving, setSaving] = useState(false);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const assignmentsRef = ref(db, 'assignments');
        const unsubscribe = onValue(assignmentsRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Assignment[] = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                // Only show assignments by this teacher (or all for now?)
                setAssignments(list.sort((a, b) => b.createdAt - a.createdAt));
            } else {
                setAssignments([]);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filtered = assignments.filter(a =>
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.class.toLowerCase().includes(search.toLowerCase()) ||
        a.type.toLowerCase().includes(search.toLowerCase())
    );

    const closeModal = () => { setShowModal(false); setForm(emptyForm()); };

    const handleSave = async () => {
        if (!form.title.trim() || !form.description.trim()) return;
        setSaving(true);

        const payload: Omit<Assignment, 'id'> = {
            title: form.title.trim(),
            description: form.description.trim(),
            dueDate: form.dueDate,
            class: form.class,
            type: form.type as any,
            link: form.link.trim() || undefined,
            author: userName,
            createdAt: Date.now()
        };

        try {
            await push(ref(db, 'assignments'), payload);
            setSaving(false);
            closeModal();
            alert('Material published successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to publish material.');
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (window.confirm(`Remove "${title}"?`)) {
            await remove(ref(db, `assignments/${id}`));
        }
    };

    const typeStyle = (type: string) => {
        switch (type) {
            case 'Assignment': return 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20';
            case 'Quiz': return 'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20';
            default: return 'bg-blue-50 text-blue-700 ring-1 ring-blue-600/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-blue-600" /> Academic Materials
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Post assignments, quizzes, and resources for your students.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 transition-all duration-200"
                >
                    <Plus className="h-4 w-4" /> Add Material
                </button>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, class or type..."
                    className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm ring-1 ring-gray-900/5 focus:ring-2 focus:ring-blue-600 outline-none"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-12 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-blue-400" /></div>
                ) : filtered.map((item) => (
                    <div key={item.id} className="relative flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-200 hover:shadow-md transition-all">
                        <div className="flex justify-between items-start">
                            <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeStyle(item.type)}`}>
                                {item.type}
                            </span>
                            <button
                                onClick={() => handleDelete(item.id, item.title)}
                                className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-red-50 transition-colors"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>

                        <div>
                            <h3 className="text-lg font-bold text-gray-900 truncate">{item.title}</h3>
                            <p className="text-xs text-gray-500 font-medium">Class: {item.class} • By {item.author}</p>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">
                            {item.description}
                        </p>

                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                            <div className="flex items-center gap-1.5 font-semibold text-gray-700">
                                <Calendar className="h-3.5 w-3.5 text-blue-600" /> Due: {item.dueDate}
                            </div>
                            {item.link && (
                                <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline">
                                    <Link className="h-3.5 w-3.5" /> Attachment
                                </a>
                            )}
                        </div>
                    </div>
                ))}
                {!loading && filtered.length === 0 && (
                    <div className="col-span-full text-center py-16 text-gray-400 text-sm">No academic materials posted yet.</div>
                )}
            </div>

            {/* Create Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden text-black">
                        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 flex items-center justify-between">
                            <h3 className="text-base font-semibold text-white">New Academic Material</h3>
                            <button onClick={closeModal} className="text-white/70 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                                <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} type="text" placeholder="e.g. Unit 1 Quiz" className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description *</label>
                                <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Instructions or details..." rows={3} className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Target Class</label>
                                    <input value={form.class} onChange={e => setForm(f => ({ ...f, class: e.target.value }))} type="text" placeholder="e.g. CS-A" className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Material Type</label>
                                    <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white">
                                        <option value="Assignment">Assignment</option>
                                        <option value="Study Material">Study Material</option>
                                        <option value="Quiz">Quiz</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Due Date</label>
                                    <input value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} type="date" className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Resource Link (Optional)</label>
                                    <input value={form.link} onChange={e => setForm(f => ({ ...f, link: e.target.value }))} type="text" placeholder="URL to PDF/Video" className="w-full rounded-xl border-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-5">
                            <button onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200">Cancel</button>
                            <button
                                onClick={handleSave}
                                disabled={!form.title.trim() || !form.description.trim() || saving}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Publish Material
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
