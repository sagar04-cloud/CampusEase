import { useState } from 'react';
import { Megaphone, Calendar, FileText, BellRing, PlusCircle, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';
import { useAppContext, Announcement } from '../context/AppContext';

type FormData = { title: string; content: string; category: string; iconType: string; color: string; bgColor: string };

const ICON_OPTIONS = [
    { label: 'Calendar', value: 'Calendar', color: 'text-indigo-600', bgColor: 'bg-indigo-100' },
    { label: 'Bell', value: 'BellRing', color: 'text-amber-600', bgColor: 'bg-amber-100' },
    { label: 'File', value: 'FileText', color: 'text-blue-600', bgColor: 'bg-blue-100' },
    { label: 'Megaphone', value: 'Megaphone', color: 'text-rose-600', bgColor: 'bg-rose-100' },
];

const emptyForm = (): FormData => ({
    title: '', content: '', category: 'Notice',
    iconType: 'FileText', color: 'text-blue-600', bgColor: 'bg-blue-100',
});

export default function Announcements({ role }: { role: string }) {
    const { announcements, loadingAnnouncements, addAnnouncement, updateAnnouncement, deleteAnnouncement } = useAppContext();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<FormData>(emptyForm());
    const [saving, setSaving] = useState(false);

    const isStaff = role?.startsWith('faculty');

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Calendar': return Calendar;
            case 'BellRing': return BellRing;
            case 'FileText': return FileText;
            default: return Megaphone;
        }
    };

    const openAdd = () => { if (!isStaff) return; setEditingId(null); setForm(emptyForm()); setShowModal(true); };

    const openEdit = (ann: Announcement) => {
        if (!isStaff) return;
        setEditingId(ann.id);
        setForm({ title: ann.title, content: ann.content, category: ann.category, iconType: ann.iconType, color: ann.color, bgColor: ann.bgColor });
        setShowModal(true);
    };

    const closeModal = () => { setShowModal(false); setEditingId(null); setForm(emptyForm()); };

    const handleSave = () => {
        if (!form.title.trim() || !form.content.trim() || !isStaff) return;
        setSaving(true);

        const chosen = ICON_OPTIONS.find(o => o.value === form.iconType) ?? ICON_OPTIONS[2];

        const payload: Omit<Announcement, 'id'> = {
            title: form.title.trim(),
            content: form.content.trim(),
            category: form.category,
            iconType: form.iconType,
            color: chosen.color,
            bgColor: chosen.bgColor,
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: role === 'faculty_admin' ? 'Admin' : role === 'faculty_hod' ? 'HOD' : 'Teacher',
            isNew: true,
        };

        if (editingId) {
            updateAnnouncement(editingId, payload);
        } else {
            addAnnouncement(payload);
        }
        setTimeout(() => { setSaving(false); closeModal(); }, 300);
    };

    const handleDelete = (id: string, title: string) => {
        if (!isStaff) return;
        if (window.confirm(`Delete announcement "${title}"?`)) {
            deleteAnnouncement(id);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight flex items-center gap-3">
                        <Megaphone className="w-8 h-8 text-blue-600" />
                        Campus Announcements
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Stay updated with the latest news, events, and notices.
                    </p>
                </div>
                {isStaff && (
                    <button onClick={openAdd} className="inline-flex items-center gap-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline transition-all duration-200">
                        <PlusCircle aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                        New Announcement
                    </button>
                )}
            </div>

            {loadingAnnouncements ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {announcements.map((announcement) => (
                        <div key={announcement.id} className="relative flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-md hover:ring-gray-900/10 hover:-translate-y-1">
                            {announcement.isNew && (
                                <span className={`absolute top-4 ${isStaff ? 'right-20' : 'right-4'} inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20`}>
                                    New
                                </span>
                            )}
                            {isStaff && (
                                <div className="absolute top-3 right-3 flex gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); openEdit(announcement); }}
                                        className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                                        title="Edit"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleDelete(announcement.id, announcement.title); }}
                                        className="text-gray-400 hover:text-red-600 transition-colors p-1.5 rounded-md hover:bg-red-50"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            )}
                            <div className="flex items-center gap-x-4">
                                <div className={`flex h-12 w-12 items-center justify-center rounded-xl shadow-sm ${announcement.bgColor}`}>
                                    {(() => {
                                        const Icon = getIcon(announcement.iconType);
                                        return <Icon className={`h-6 w-6 ${announcement.color}`} aria-hidden="true" />;
                                    })()}
                                </div>
                                <div className="text-sm font-medium leading-6 max-w-[calc(100%-4rem)]">
                                    <p className="text-gray-900 line-clamp-2">{announcement.title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{announcement.category}</p>
                                </div>
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-gray-600 leading-relaxed text-justify">
                                    {announcement.content}
                                </p>
                            </div>
                            <div className="flex items-center justify-between border-t border-gray-100 pt-4 mt-auto">
                                <p className="text-xs font-medium text-gray-500">{announcement.author}</p>
                                <time dateTime={announcement.date} className="text-xs text-gray-400">
                                    {announcement.date}
                                </time>
                            </div>
                        </div>
                    ))}
                    {announcements.length === 0 && (
                        <div className="col-span-3 text-center py-16 text-gray-400 text-sm">No announcements yet.</div>
                    )}
                </div>
            )}

            {/* Add / Edit Modal */}
            {isStaff && showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
                    <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                        <div className="flex items-center justify-between bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
                            <h3 className="text-base font-semibold text-white">{editingId ? 'Edit Announcement' : 'New Announcement'}</h3>
                            <button onClick={closeModal} className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Title *</label>
                                <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 outline-none" />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Content *</label>
                                <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Announcement content..." rows={3} className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-blue-600 outline-none resize-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                                    <input type="text" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} placeholder="e.g. Events, Notice" className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none" />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Icon</label>
                                    <select value={form.iconType} onChange={e => setForm(f => ({ ...f, iconType: e.target.value }))} className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm focus:ring-2 focus:ring-blue-600 outline-none bg-white">
                                        {ICON_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-5 pt-1">
                            <button onClick={closeModal} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors ring-1 ring-gray-200">Cancel</button>
                            <button onClick={handleSave} disabled={!form.title.trim() || !form.content.trim() || saving} className="inline-flex items-center gap-1.5 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                {editingId ? 'Save Changes' : 'Publish'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
