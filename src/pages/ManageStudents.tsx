import { useState, useEffect } from 'react';
import { GraduationCap, Plus, Search, Edit2, Trash2, X, Check, Loader2, Users, Lock } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, push, update, remove, get, set } from 'firebase/database';

type Student = {
    id: string;
    name: string;
    rollNo: string;
    class: string;
    email: string;
    status: 'Active' | 'Inactive';
};

type FormData = {
    name: string;
    rollNo: string;
    class: string;
    email: string;
    status: 'Active' | 'Inactive';
    password: string;
};

const emailToKey = (email: string) =>
    email.toLowerCase().replace(/\./g, ',').replace(/@/g, '__at__');

const emptyForm = (): FormData => ({ name: '', rollNo: '', class: '', email: '', status: 'Active', password: '' });

export default function ManageStudents() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm());
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const dbRef = ref(db, 'students');
        const unsubscribe = onValue(dbRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Student[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as Omit<Student, 'id'>),
                    id: key,
                }));
                setStudents(list);
            } else {
                setStudents([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filtered = students.filter(s =>
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.rollNo.toLowerCase().includes(search.toLowerCase()) ||
        s.class.toLowerCase().includes(search.toLowerCase())
    );

    const openAdd = () => { setEditingId(null); setForm(emptyForm()); setShowModal(true); };

    const openEdit = (s: Student) => {
        setEditingId(s.id);
        const userKey = emailToKey(s.email);
        get(ref(db, `users/${userKey}`)).then(snap => {
            const userData = snap.val();
            setForm({ 
                name: s.name, 
                rollNo: s.rollNo, 
                class: s.class, 
                email: s.email, 
                status: s.status,
                password: userData?.password || ''
            });
            setShowModal(true);
        });
    };

    const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm()); };

    const handleSave = async () => {
        if (!form.name.trim() || !form.rollNo.trim() || !form.email.trim() || !form.password.trim()) {
            alert('Name, Roll No, Email and Password are required.');
            return;
        }
        setSaving(true);

        const studentEmail = form.email.trim().toLowerCase();
        const userKey = emailToKey(studentEmail);

        const studentPayload = {
            name: form.name.trim(),
            rollNo: form.rollNo.trim(),
            class: form.class.trim() || 'CS-A',
            email: studentEmail,
            status: form.status,
        };

        const userPayload = {
            name: form.name.trim(),
            email: studentEmail,
            password: form.password.trim(),
            role: 'student'
        };

        try {
            if (editingId) {
                await update(ref(db, `students/${editingId}`), studentPayload);
            } else {
                await push(ref(db, 'students'), studentPayload);
            }

            // Sync with users node for login
            await set(ref(db, `users/${userKey}`), userPayload);
            
            setSaving(false);
            closeModal();
        } catch (error) {
            console.error(error);
            alert('Error saving student.');
            setSaving(false);
        }
    };

    const handleDelete = async (id: string, name: string, email: string) => {
        if (window.confirm(`Remove student "${name}" and their login account?`)) {
            await remove(ref(db, `students/${id}`));
            await remove(ref(db, `users/${emailToKey(email)}`));
        }
    };

    const activeCount = students.filter(s => s.status === 'Active').length;
    const inactiveCount = students.filter(s => s.status === 'Inactive').length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <GraduationCap className="w-7 h-7 text-indigo-600" /> Manage Students
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Add student records and set login passwords.</p>
                </div>
                <button onClick={openAdd} className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors">
                    <Plus className="h-4 w-4" /> Add Student
                </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: 'Total Students', value: students.length, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                    { label: 'Active', value: activeCount, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'Inactive', value: inactiveCount, color: 'text-gray-500', bg: 'bg-gray-50' },
                ].map(stat => (
                    <div key={stat.label} className={`rounded-2xl ${stat.bg} px-4 py-3 ring-1 ring-gray-900/5`}>
                        <p className="text-xs font-medium text-gray-500">{stat.label}</p>
                        {loading ? (
                            <Loader2 className="h-5 w-5 animate-spin text-gray-300 mt-1" />
                        ) : (
                            <p className={`text-2xl font-bold ${stat.color} mt-0.5`}>{stat.value}</p>
                        )}
                    </div>
                ))}
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, roll no or class..."
                    className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 sm:text-sm outline-none"
                />
            </div>

            {/* Table */}
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
                        {loading ? (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-indigo-400 mx-auto" />
                                </td>
                            </tr>
                        ) : filtered.map(s => (
                            <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm font-medium text-gray-900">
                                    <div className="flex items-center gap-2.5">
                                        <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-semibold text-xs shrink-0">
                                            {s.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                        </div>
                                        {s.name}
                                    </div>
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 font-mono">{s.rollNo}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.class}</td>
                                <td className="px-3 py-4 text-sm text-gray-500">{s.email}</td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${s.status === 'Active' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' : 'bg-gray-100 text-gray-600 ring-1 ring-gray-300'}`}>
                                        {s.status}
                                    </span>
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button onClick={() => openEdit(s)} className="p-1.5 rounded-md text-blue-500 hover:bg-blue-50 transition-colors" title="Edit"><Edit2 className="h-4 w-4" /></button>
                                        <button onClick={() => handleDelete(s.id, s.name, s.email)} className="p-1.5 rounded-md text-red-500 hover:bg-red-50 transition-colors" title="Delete"><Trash2 className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filtered.length === 0 && (
                    <div className="text-center py-12">
                        <Users className="h-10 w-10 text-gray-300 mx-auto mb-2" />
                        <p className="text-sm text-gray-500">No students found.</p>
                    </div>
                )}
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden text-black">
                        {/* Modal Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                            <h3 className="text-base font-semibold text-white">
                                {editingId ? 'Edit Student' : 'Add New Student'}
                            </h3>
                            <button onClick={closeModal} className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Full Name *</label>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                                        placeholder="e.g. John Doe"
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Roll Number *</label>
                                    <input
                                        type="text"
                                        value={form.rollNo}
                                        onChange={e => setForm(f => ({ ...f, rollNo: e.target.value }))}
                                        placeholder="e.g. CS2026-010"
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Class</label>
                                    <input
                                        type="text"
                                        value={form.class}
                                        onChange={e => setForm(f => ({ ...f, class: e.target.value }))}
                                        placeholder="e.g. CS-A"
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Email *</label>
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                                        placeholder="student@campusease.edu"
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Login Password *</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={form.password}
                                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                                            placeholder="Set initial password"
                                            className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Status</label>
                                    <div className="flex gap-3">
                                        {(['Active', 'Inactive'] as const).map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => setForm(f => ({ ...f, status: s }))}
                                                className={`flex-1 rounded-xl py-2 text-sm font-medium transition-all ${form.status === s
                                                    ? s === 'Active'
                                                        ? 'bg-emerald-600 text-white shadow-sm'
                                                        : 'bg-gray-500 text-white shadow-sm'
                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                    }`}
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-end gap-2 px-6 pb-5 pt-1">
                            <button onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors ring-1 ring-gray-200">
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={!form.name.trim() || !form.rollNo.trim() || !form.email.trim() || !form.password.trim() || saving}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {editingId ? 'Save Changes' : 'Add Student'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
