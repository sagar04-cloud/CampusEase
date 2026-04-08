import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Users, FileCheck, AlertTriangle, TrendingUp, Loader2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

type Props = { userName: string; role: string };

export default function FacultyDashboard({ userName, role }: Props) {
    const { requests, loadingRequests, updateRequestStatus } = useAppContext();
    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const urgentIssues = requests.filter(r => r.status === 'Pending' && r.priority === 'High');

    const [activeStudents, setActiveStudents] = useState<number | null>(null);

    useEffect(() => {
        const unsubscribe = onValue(ref(db, 'students'), (snap) => {
            if (snap.exists()) {
                const data = snap.val() as Record<string, { status: string }>;
                const count = Object.values(data).filter(s => s.status === 'Active').length;
                setActiveStudents(count);
            } else {
                setActiveStudents(0);
            }
        });
        return () => unsubscribe();
    }, []);

    const roleLabel =
        role === 'faculty_admin' ? 'Admin' :
        role === 'faculty_hod' ? 'HOD' :
        'Faculty';

    // Grouping logic for Weekly Trends
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const now = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(now.getDate() - (6 - i));
        return {
            label: days[d.getDay()],
            received: 0,
            resolved: 0,
            start: new Date(d.setHours(0,0,0,0)).getTime(),
            end: new Date(d.setHours(23,59,59,999)).getTime()
        };
    });

    requests.forEach(req => {
        const ts = req.timestamp;
        if (!ts) return;
        last7Days.forEach(day => {
            if (ts >= day.start && ts <= day.end) {
                day.received++;
                if (req.status === 'Approved' || req.status === 'Rejected') {
                    day.resolved++;
                }
            }
        });
    });

    const barChartData = {
        labels: last7Days.map(d => d.label),
        datasets: [
            {
                label: 'Requests Received',
                data: last7Days.map(d => d.received),
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 6,
            },
            {
                label: 'Requests Resolved',
                data: last7Days.map(d => d.resolved),
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const doughnutData = {
        labels: ['Maintenance', 'Event Booking', 'Academic', 'IT Support'],
        datasets: [{
            data: [
                requests.filter(r => r.type === 'Maintenance').length,
                requests.filter(r => r.type === 'Event').length,
                requests.filter(r => r.type === 'Academic').length,
                requests.filter(r => r.type === 'IT Support').length,
            ],
            backgroundColor: [
                'rgba(245, 158, 11, 0.8)',
                'rgba(16, 185, 129, 0.8)',
                'rgba(79, 70, 229, 0.8)',
                'rgba(59, 130, 246, 0.8)',
            ],
            borderWidth: 0,
            hoverOffset: 4
        }],
    };

    const stats = [
        { name: 'Pending Reviews', stat: pendingRequests.length.toString(), loading: loadingRequests, icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { name: 'Active Students', stat: activeStudents !== null ? activeStudents.toString() : '—', loading: activeStudents === null, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Urgent Issues', stat: urgentIssues.length.toString(), loading: loadingRequests, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight uppercase">
                        Welcome, {userName || roleLabel}! 👋
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Real-time system metrics and pending actions.</p>
                </div>
                <button
                    onClick={() => window.print()}
                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                >
                    <TrendingUp className="-ml-0.5 mr-2 h-5 w-5" />
                    Print Summary
                </button>
            </div>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                {stats.map((item) => (
                    <div key={item.name} className="relative overflow-hidden rounded-2xl bg-white px-4 pb-12 pt-5 shadow-sm ring-1 ring-gray-900/5 sm:px-6 sm:pt-6 transition-transform hover:-translate-y-1 duration-300">
                        <dt>
                            <div className={`absolute rounded-xl ${item.bg} p-3`}>
                                <item.icon className={`h-6 w-6 ${item.color}`} />
                            </div>
                            <p className="ml-16 truncate text-sm font-medium text-gray-500">{item.name}</p>
                        </dt>
                        <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                            {item.loading ? <Loader2 className="h-6 w-6 animate-spin text-gray-300" /> : <p className="text-2xl font-semibold text-gray-900">{item.stat}</p>}
                        </dd>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Last 7 Days Trend</h3>
                    <div className="h-[300px]">
                        <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }} />
                    </div>
                </div>
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6 flex flex-col">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Request Categories</h3>
                    <div className="flex-1 flex justify-center items-center h-[300px]">
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="border-b border-gray-200 bg-white px-6 py-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Needs Your Approval</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                    {loadingRequests ? (
                        <div className="p-6 flex justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-400" /></div>
                    ) : pendingRequests.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">No pending approvals!</div>
                    ) : (
                        pendingRequests.slice(0, 5).map((item) => (
                            <li key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-6 p-5 hover:bg-gray-50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{item.title}</p>
                                        <p className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase ring-1 ring-inset ${item.priority === 'High' ? 'bg-rose-50 text-rose-700 ring-rose-600/20' : 'bg-gray-50 text-gray-600 ring-gray-600/20'}`}>
                                            {item.priority}
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-[10px] text-gray-400 font-bold uppercase">
                                        <span>BY {item.author}</span>
                                        <span>•</span>
                                        <span>{item.type}</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4 sm:mt-0">
                                    <button onClick={() => updateRequestStatus(item.id, 'Approved')} className="rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-indigo-500">Approve</button>
                                    <button onClick={() => updateRequestStatus(item.id, 'Rejected')} className="rounded-lg bg-white px-3 py-1.5 text-xs font-bold text-rose-600 ring-1 ring-rose-200 hover:bg-rose-50">Reject</button>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
