import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { ClipboardList, Clock, Info, CheckCircle, Clock3, CalendarPlus } from 'lucide-react';
import { useAppContext, Request } from '../context/AppContext';

export default function StudentDashboard() {
    const { requests, addRequest, campusEvents, addCampusEvent, updateCampusEvent, removeCampusEvent } = useAppContext();

    const handleCreateRequest = () => {
        const newReq: Request = {
            id: `REQ-0${requests.length + 38}`,
            title: 'New Student Request',
            type: 'General',
            status: 'Pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: 'Alex Johnson',
            priority: 'Medium'
        };
        addRequest(newReq);
        alert('New request successfully created!');
    };
    const activeRequests = requests.filter(r => r.status === 'In Progress');
    const pendingApprovals = requests.filter(r => r.status === 'Pending');
    const approvedEvents = requests.filter(r => r.status === 'Approved' && r.type === 'Event');

    const stats = [
        { name: 'Active Requests', stat: activeRequests.length.toString(), icon: ClipboardList, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Pending Approvals', stat: pendingApprovals.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { name: 'Approved Events', stat: approvedEvents.length.toString(), icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
    ];

    const recentRequests = requests.slice(0, 3);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Approved': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            case 'Pending': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200';
            default: return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Welcome back, Alex! 👋
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Here's what's happening around campus today.
                    </p>
                </div>
                <button
                    onClick={handleCreateRequest}
                    className="inline-flex items-center rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-colors"
                >
                    <ClipboardList className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    New Request
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white px-4 pb-12 pt-5 shadow-sm ring-1 ring-gray-900/5 sm:px-6 sm:pt-6 transition-transform hover:-translate-y-1 duration-300">
                        <dt>
                            <div className={`absolute rounded-xl ${item.bg} p-3`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>
                        </dd>
                        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-3 sm:px-6 z-0">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-blue-600 hover:text-blue-500 inline-flex items-center transition-colors">
                                    View all <span className="sr-only"> {item.name}</span>
                                    <span aria-hidden="true" className="ml-1">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Calendar Widget */}
                <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                    <div className="border-b border-gray-200 bg-white px-6 py-5 flex justify-between items-center">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Campus Events</h3>
                        <button
                            onClick={() => {
                                const title = prompt('Event Name:');
                                if (!title) return;
                                const date = prompt('Event Date (YYYY-MM-DD):', new Date().toISOString().split('T')[0]);
                                if (!date) return;
                                addCampusEvent({
                                    id: `evt-${Date.now()}`,
                                    title,
                                    date,
                                    color: '#4f46e5',
                                });
                            }}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 hover:bg-blue-100 transition-colors ring-1 ring-inset ring-blue-700/10"
                        >
                            <CalendarPlus className="h-3.5 w-3.5" /> Add Event
                        </button>
                    </div>
                    <div className="p-6 h-[400px] overflow-y-auto fc-modern">
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            height="100%"
                            editable={true}
                            selectable={true}
                            headerToolbar={{
                                left: 'title',
                                right: 'prev,next today'
                            }}
                            events={campusEvents.map(evt => ({
                                id: evt.id,
                                title: evt.title,
                                start: evt.date,
                                end: evt.end,
                                color: evt.color,
                            }))}
                            eventClick={(info) => {
                                const evtId = info.event.id;
                                const currentTitle = info.event.title;
                                const action = prompt(
                                    `Event: "${currentTitle}"\n\nType a new name to EDIT, or type "delete" to REMOVE:`,
                                    currentTitle
                                );
                                if (action === null) return;
                                if (action.toLowerCase() === 'delete') {
                                    if (confirm(`Are you sure you want to delete "${currentTitle}"?`)) {
                                        removeCampusEvent(evtId);
                                    }
                                } else if (action.trim() !== '') {
                                    updateCampusEvent(evtId, { title: action });
                                }
                            }}
                            dateClick={(info) => {
                                const title = prompt(`Add new event on ${info.dateStr}:`);
                                if (title && title.trim()) {
                                    addCampusEvent({
                                        id: `evt-${Date.now()}`,
                                        title,
                                        date: info.dateStr,
                                        color: '#4f46e5',
                                    });
                                }
                            }}
                        />
                    </div>
                </div>

                {/* Recent Requests Widget */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 flex flex-col">
                    <div className="border-b border-gray-200 bg-white px-6 py-5 flex justify-between items-center">
                        <h3 className="text-base font-semibold leading-6 text-gray-900">Recent Requests</h3>
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-500">View All</button>
                    </div>
                    <div className="px-6 py-5 flex-1">
                        <ul role="list" className="divide-y divide-gray-100 h-full flex flex-col">
                            {recentRequests.map((request) => (
                                <li key={request.id} className="py-4 flex flex-col gap-y-2 hover:bg-gray-50 -mx-6 px-6 transition-colors cursor-pointer rounded-lg">
                                    <div className="flex justify-between items-start">
                                        <p className="text-sm font-medium text-gray-900 truncate">{request.title}</p>
                                        <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${getStatusColor(request.status)}`}>
                                            {request.status}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center text-xs text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Info className="w-3.5 h-3.5" /> {request.type}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock3 className="w-3.5 h-3.5" /> {request.date}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
