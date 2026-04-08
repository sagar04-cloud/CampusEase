import { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Calendar, Plus, Trash2, Edit3, X, Check, Loader2 } from 'lucide-react';
import { useAppContext, CampusEvent } from '../context/AppContext';

type EventFormData = {
    title: string;
    date: string;
    end: string;
    color: string;
    description: string;
};

const COLOR_OPTIONS = [
    { label: 'Indigo', value: '#4f46e5' },
    { label: 'Red', value: '#dc2626' },
    { label: 'Green', value: '#059669' },
    { label: 'Amber', value: '#d97706' },
    { label: 'Blue', value: '#2563eb' },
    { label: 'Purple', value: '#7c3aed' },
    { label: 'Pink', value: '#db2777' },
    { label: 'Teal', value: '#0d9488' },
];

const emptyForm = (): EventFormData => ({
    title: '',
    date: new Date().toISOString().split('T')[0],
    end: '',
    color: '#4f46e5',
    description: '',
});

export default function EventCalendar() {
    const { campusEvents, loadingEvents, addCampusEvent, updateCampusEvent, removeCampusEvent } = useAppContext();

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState<EventFormData>(emptyForm());
    const [saving, setSaving] = useState(false);

    const openAdd = (dateStr?: string) => {
        setEditingId(null);
        setForm({ ...emptyForm(), date: dateStr ?? emptyForm().date });
        setShowModal(true);
    };

    const openEdit = (evt: CampusEvent) => {
        setEditingId(evt.id);
        setForm({
            title: evt.title,
            date: evt.date,
            end: evt.end ?? '',
            color: evt.color,
            description: evt.description ?? '',
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingId(null);
        setForm(emptyForm());
    };

    const handleSave = async () => {
        if (!form.title.trim() || !form.date) return;
        setSaving(true);

        const payload: Omit<CampusEvent, 'id'> = {
            title: form.title.trim(),
            date: form.date,
            color: form.color,
            ...(form.end ? { end: form.end } : {}),
            ...(form.description.trim() ? { description: form.description.trim() } : {}),
        };

        if (editingId) {
            updateCampusEvent(editingId, payload);
        } else {
            addCampusEvent(payload);
        }

        // small delay so the UI feels responsive
        setTimeout(() => { setSaving(false); closeModal(); }, 300);
    };

    const handleDelete = (id: string, title: string) => {
        if (window.confirm(`Delete event "${title}"?`)) {
            removeCampusEvent(id);
        }
    };

    const upcomingEvents = [...campusEvents]
        .filter(e => e.date >= new Date().toISOString().split('T')[0])
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 8);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Calendar className="w-7 h-7 text-indigo-600" />
                        Event Calendar
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage campus events — changes sync to all users in real time.
                    </p>
                </div>
                <button
                    onClick={() => openAdd()}
                    className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                    <Plus className="h-4 w-4" /> Add Event
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Calendar */}
                <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                    <div className="border-b border-gray-100 bg-white px-6 py-4">
                        <h3 className="text-base font-semibold text-gray-900">Monthly View</h3>
                    </div>
                    <div className="p-4 h-[460px] fc-modern">
                        {loadingEvents ? (
                            <div className="flex h-full items-center justify-center">
                                <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
                            </div>
                        ) : (
                            <FullCalendar
                                plugins={[dayGridPlugin, interactionPlugin]}
                                initialView="dayGridMonth"
                                height="100%"
                                editable={false}
                                selectable={true}
                                headerToolbar={{ left: 'title', right: 'prev,next today' }}
                                events={campusEvents.map(evt => ({
                                    id: evt.id,
                                    title: evt.title,
                                    start: evt.date,
                                    end: evt.end,
                                    color: evt.color,
                                }))}
                                dateClick={(info) => openAdd(info.dateStr)}
                                eventClick={(info) => {
                                    const evt = campusEvents.find(e => e.id === info.event.id);
                                    if (evt) openEdit(evt);
                                }}
                            />
                        )}
                    </div>
                </div>

                {/* Upcoming Events List */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 flex flex-col">
                    <div className="border-b border-gray-100 bg-white px-6 py-4 flex items-center justify-between">
                        <h3 className="text-base font-semibold text-gray-900">Upcoming Events</h3>
                        <span className="text-xs font-medium text-gray-400">{upcomingEvents.length} events</span>
                    </div>

                    {loadingEvents ? (
                        <div className="flex flex-1 items-center justify-center py-12">
                            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                        </div>
                    ) : upcomingEvents.length === 0 ? (
                        <div className="flex flex-1 flex-col items-center justify-center py-12 text-center px-6">
                            <Calendar className="h-10 w-10 text-gray-300 mb-3" />
                            <p className="text-sm text-gray-500">No upcoming events. Click a day on the calendar to add one.</p>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100 overflow-y-auto flex-1">
                            {upcomingEvents.map(evt => (
                                <li key={evt.id} className="flex items-start gap-3 px-5 py-4 hover:bg-gray-50 transition-colors group">
                                    <div
                                        className="mt-0.5 h-3 w-3 rounded-full shrink-0 ring-2 ring-offset-1"
                                        style={{ backgroundColor: evt.color }}
                                    />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-gray-900 truncate">{evt.title}</p>
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {evt.date}{evt.end ? ` → ${evt.end}` : ''}
                                        </p>
                                        {evt.description && (
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{evt.description}</p>
                                        )}
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                        <button
                                            onClick={() => openEdit(evt)}
                                            className="p-1 rounded-md text-blue-400 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            title="Edit"
                                        >
                                            <Edit3 className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(evt.id, evt.title)}
                                            className="p-1 rounded-md text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>

            {/* Add / Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    {/* Backdrop */}
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />

                    {/* Modal */}
                    <div className="relative w-full max-w-md rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-4">
                            <h3 className="text-base font-semibold text-white">
                                {editingId ? 'Edit Event' : 'Add New Event'}
                            </h3>
                            <button
                                onClick={closeModal}
                                className="rounded-lg p-1 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="px-6 py-5 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Event Title *</label>
                                <input
                                    type="text"
                                    value={form.title}
                                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                                    placeholder="e.g. Annual Sports Day"
                                    className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date *</label>
                                    <input
                                        type="date"
                                        value={form.date}
                                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                                    <input
                                        type="date"
                                        value={form.end}
                                        onChange={e => setForm(f => ({ ...f, end: e.target.value }))}
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-indigo-600 outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Description</label>
                                <textarea
                                    value={form.description}
                                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                                    placeholder="Optional description..."
                                    rows={2}
                                    className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 px-3.5 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-2">Event Color</label>
                                <div className="flex flex-wrap gap-2">
                                    {COLOR_OPTIONS.map(c => (
                                        <button
                                            key={c.value}
                                            type="button"
                                            title={c.label}
                                            onClick={() => setForm(f => ({ ...f, color: c.value }))}
                                            className={`h-7 w-7 rounded-full transition-transform hover:scale-110 ${form.color === c.value ? 'ring-2 ring-offset-2 ring-gray-500 scale-110' : ''}`}
                                            style={{ backgroundColor: c.value }}
                                        >
                                            {form.color === c.value && <Check className="h-4 w-4 text-white mx-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="flex justify-between items-center px-6 pb-5 pt-1 gap-3">
                            {editingId && (
                                <button
                                    onClick={() => { handleDelete(editingId, form.title); closeModal(); }}
                                    className="inline-flex items-center gap-1.5 rounded-xl px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors ring-1 ring-red-200"
                                >
                                    <Trash2 className="h-4 w-4" /> Delete
                                </button>
                            )}
                            <div className="flex gap-2 ml-auto">
                                <button
                                    onClick={closeModal}
                                    className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors ring-1 ring-gray-200"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={!form.title.trim() || !form.date || saving}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                    {editingId ? 'Save Changes' : 'Add Event'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
