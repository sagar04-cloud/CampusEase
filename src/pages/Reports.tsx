import { BarChart3, AlertTriangle, CheckCircle2, Clock, XCircle, FileText } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Reports() {
    const { requests } = useAppContext();

    const totalComplaints = requests.length;
    const pending = requests.filter(r => r.status === 'Pending');
    const approved = requests.filter(r => r.status === 'Approved');
    const rejected = requests.filter(r => r.status === 'Rejected');

    const summaryStats = [
        { label: 'Total Complaints Raised', value: totalComplaints.toString(), icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        { label: 'Pending Review', value: pending.length.toString(), icon: Clock, color: 'text-amber-600', bg: 'bg-amber-100' },
        { label: 'Approved / Resolved', value: approved.length.toString(), icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-100' },
        { label: 'Rejected', value: rejected.length.toString(), icon: XCircle, color: 'text-red-600', bg: 'bg-red-100' },
    ];

    // Group complaints by type
    const typeMap: Record<string, number> = {};
    requests.forEach(r => { typeMap[r.type] = (typeMap[r.type] || 0) + 1; });
    const typeEntries = Object.entries(typeMap).sort((a, b) => b[1] - a[1]);

    // Group complaints by priority
    const priorityMap: Record<string, number> = {};
    requests.forEach(r => { priorityMap[r.priority] = (priorityMap[r.priority] || 0) + 1; });

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 pb-5">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <BarChart3 className="w-7 h-7 text-indigo-600" /> Complaints & Reports
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                    Overview of all complaints raised, their status, category breakdown, and priority distribution.
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {summaryStats.map((stat) => (
                    <div key={stat.label} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-transform hover:-translate-y-1 duration-300">
                        <div className="flex items-center gap-4">
                            <div className={`rounded-xl ${stat.bg} p-3`}>
                                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* By Category */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                    <h3 className="text-base font-semibold text-gray-900 mb-5">Complaints by Category</h3>
                    <div className="space-y-4">
                        {typeEntries.length === 0 && <p className="text-sm text-gray-400">No data yet.</p>}
                        {typeEntries.map(([type, count]) => {
                            const pct = Math.round((count / totalComplaints) * 100);
                            return (
                                <div key={type}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-gray-700">{type}</span>
                                        <span className="text-gray-500">{count} complaint{count > 1 ? 's' : ''} ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* By Priority */}
                <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
                    <h3 className="text-base font-semibold text-gray-900 mb-5">Priority Distribution</h3>
                    <div className="space-y-4">
                        {Object.entries(priorityMap).map(([priority, count]) => {
                            const pct = Math.round((count / totalComplaints) * 100);
                            const barColor = priority === 'High' ? 'bg-red-500' : priority === 'Medium' ? 'bg-amber-500' : 'bg-emerald-500';
                            return (
                                <div key={priority}>
                                    <div className="flex justify-between text-sm mb-1.5">
                                        <span className="font-medium text-gray-700 flex items-center gap-2">
                                            {priority === 'High' && <AlertTriangle className="h-3.5 w-3.5 text-red-500" />}
                                            {priority} Priority
                                        </span>
                                        <span className="text-gray-500">{count} ({pct}%)</span>
                                    </div>
                                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                                        <div className={`${barColor} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }}></div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Recent Complaints Log */}
            <div className="rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200">
                    <h3 className="text-base font-semibold text-gray-900">All Complaints Log</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th className="py-3.5 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">ID</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Complaint Title</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Category</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Raised By</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Priority</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                <th className="px-3 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {requests.map(r => (
                                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 pl-6 pr-3 text-sm font-mono text-indigo-600 font-medium">{r.id}</td>
                                    <td className="px-3 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{r.type}</td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{r.author}</td>
                                    <td className="px-3 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${r.priority === 'High' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                            r.priority === 'Medium' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                                'bg-emerald-50 text-emerald-700 ring-emerald-600/20'
                                            }`}>{r.priority}</span>
                                    </td>
                                    <td className="px-3 py-4 text-sm">
                                        <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${r.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 ring-emerald-600/20' :
                                            r.status === 'Pending' ? 'bg-amber-50 text-amber-700 ring-amber-600/20' :
                                                r.status === 'Rejected' ? 'bg-red-50 text-red-700 ring-red-600/20' :
                                                    'bg-blue-50 text-blue-700 ring-blue-600/20'
                                            }`}>{r.status}</span>
                                    </td>
                                    <td className="px-3 py-4 text-sm text-gray-500">{r.date}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {requests.length === 0 && <div className="text-center py-10 text-sm text-gray-500">No complaints raised yet.</div>}
                </div>
            </div>
        </div>
    );
}
