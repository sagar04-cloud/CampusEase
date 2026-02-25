import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Doughnut } from 'react-chartjs-2';
import { Users, FileCheck, AlertTriangle, TrendingUp } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function FacultyDashboard() {
    const { requests, updateRequestStatus } = useAppContext();
    const pendingRequests = requests.filter(r => r.status === 'Pending');
    const urgentIssues = requests.filter(r => r.status === 'Pending' && r.priority === 'High');

    const stats = [
        { name: 'Pending Reviews', stat: pendingRequests.length.toString(), icon: FileCheck, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { name: 'Active Students', stat: '1,240', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
        { name: 'Urgent Issues', stat: urgentIssues.length.toString(), icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-100' },
    ];

    const barChartData = {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
        datasets: [
            {
                label: 'Requests Received',
                data: [12, 19, 15, 22, 18],
                backgroundColor: 'rgba(79, 70, 229, 0.8)',
                borderRadius: 6,
            },
            {
                label: 'Requests Resolved',
                data: [10, 15, 14, 20, 15],
                backgroundColor: 'rgba(59, 130, 246, 0.8)',
                borderRadius: 6,
            },
        ],
    };

    const barChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'top' as const },
        },
        scales: {
            y: { beginAtZero: true, grid: { color: 'rgba(0,0,0,0.05)' } },
            x: { grid: { display: false } }
        }
    };

    const doughnutData = {
        labels: ['Maintenance', 'Event Booking', 'Academic', 'IT Support'],
        datasets: [
            {
                data: [35, 25, 20, 20],
                backgroundColor: [
                    'rgba(245, 158, 11, 0.8)',
                    'rgba(16, 185, 129, 0.8)',
                    'rgba(79, 70, 229, 0.8)',
                    'rgba(59, 130, 246, 0.8)',
                ],
                borderWidth: 0,
                hoverOffset: 4
            },
        ],
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Faculty Overview
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        System metrics and pending action items.
                    </p>
                </div>
                <button
                    onClick={() => alert('Generating report...')}
                    className="inline-flex items-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-colors"
                >
                    <TrendingUp className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
                    Generate Report
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
                        <div className="absolute inset-x-0 bottom-0 bg-gray-50 px-4 py-3 sm:px-6 z-0 border-t border-gray-100">
                            <div className="text-sm">
                                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 inline-flex items-center transition-colors">
                                    Take action <span className="sr-only"> on {item.name}</span>
                                    <span aria-hidden="true" className="ml-1">→</span>
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                {/* Weekly Trend Chart */}
                <div className="lg:col-span-2 overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Request Volume Trend</h3>
                    <div className="h-[300px]">
                        <Bar data={barChartData} options={barChartOptions} />
                    </div>
                </div>

                {/* Breakdown Chart */}
                <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 p-6 flex flex-col">
                    <h3 className="text-base font-semibold leading-6 text-gray-900 mb-4">Request Categories</h3>
                    <div className="flex-1 flex justify-center items-center h-[300px]">
                        <Doughnut data={doughnutData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
                    </div>
                </div>
            </div>

            {/* Quick Actions Table */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="border-b border-gray-200 bg-white px-6 py-5">
                    <h3 className="text-base font-semibold leading-6 text-gray-900">Needs Your Approval</h3>
                </div>
                <ul role="list" className="divide-y divide-gray-100">
                    {pendingRequests.length === 0 ? (
                        <div className="p-6 text-center text-sm text-gray-500">No pending approvals needed!</div>
                    ) : (
                        pendingRequests.map((item) => (
                            <li key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-x-6 p-5 hover:bg-gray-50 transition-colors">
                                <div className="min-w-0 flex-1">
                                    <div className="flex items-start gap-x-3">
                                        <p className="text-sm font-semibold leading-6 text-gray-900">{item.title}</p>
                                        <p className="rounded-md whitespace-nowrap mt-0.5 px-1.5 py-0.5 text-xs font-medium ring-1 ring-inset text-amber-700 bg-amber-50 ring-amber-600/20">
                                            {item.priority} Priority
                                        </p>
                                    </div>
                                    <div className="mt-1 flex items-center gap-x-2 text-xs leading-5 text-gray-500">
                                        <p className="whitespace-nowrap">Requested by {item.author}</p>
                                        <svg viewBox="0 0 2 2" className="h-0.5 w-0.5 fill-current"><circle cx={1} cy={1} r={1} /></svg>
                                        <p className="truncate">{item.type}</p>
                                    </div>
                                </div>
                                <div className="flex flex-none items-center gap-x-4 mt-4 sm:mt-0">
                                    <button className="hidden sm:block rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                                        View details
                                    </button>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => updateRequestStatus(item.id, 'Approved')}
                                            className="rounded-md bg-indigo-600 px-2.5 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
                                        >
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => updateRequestStatus(item.id, 'Rejected')}
                                            className="rounded-md bg-rose-50 px-2.5 py-1.5 text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-100 ring-1 ring-inset ring-rose-600/20 transition-colors"
                                        >
                                            Decline
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))
                    )}
                </ul>
            </div>
        </div>
    );
}
