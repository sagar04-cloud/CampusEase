import { useState } from 'react';
import { Filter, Search, Plus, CheckCircle2, XCircle, Clock, Edit2 } from 'lucide-react';
import { useAppContext, Request } from '../context/AppContext';

export default function Requests() {
    const [activeTab, setActiveTab] = useState('All');
    const { requests, addRequest, updateRequest } = useAppContext();

    const handleEditRequest = (id: string, currentTitle: string) => {
        const newTitle = prompt('Edit Request Title:', currentTitle);
        if (newTitle && newTitle.trim() !== '') {
            updateRequest(id, { title: newTitle });
        }
    };

    const handleCreateRequest = () => {
        const newReq: Request = {
            id: `REQ-0${requests.length + 38}`,
            title: 'New Event Proposal',
            type: 'Event',
            status: 'Pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: 'Current User',
            priority: 'Medium'
        };
        addRequest(newReq);
    };

    const filteredRequests = activeTab === 'All' ? requests : requests.filter(r => r.status === activeTab);

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'Approved':
                return <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-emerald-700 bg-emerald-50 ring-1 ring-inset ring-emerald-600/20"><CheckCircle2 className="h-3.5 w-3.5" /> Approved</span>;
            case 'Pending':
                return <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-amber-700 bg-amber-50 ring-1 ring-inset ring-amber-600/20"><Clock className="h-3.5 w-3.5" /> Pending</span>;
            case 'Rejected':
                return <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-red-700 bg-red-50 ring-1 ring-inset ring-red-600/20"><XCircle className="h-3.5 w-3.5" /> Rejected</span>;
            default:
                return <span className="inline-flex items-center gap-x-1.5 rounded-full px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 ring-1 ring-inset ring-blue-600/20">{status}</span>;
        }
    };

    return (
        <div className="space-y-6">
            <div className="sm:flex sm:items-center sm:justify-between section-header pb-4 border-b border-gray-200">
                <div>
                    <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
                        Manage Requests
                    </h2>
                    <p className="mt-2 text-sm text-gray-500">
                        Track, review, and manage all campus requests and applications.
                    </p>
                </div>
                <div className="mt-4 flex sm:ml-4 sm:mt-0">
                    <button
                        onClick={handleCreateRequest}
                        className="inline-flex items-center gap-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200"
                    >
                        <Plus aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                        Create Request
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="flex bg-gray-100 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
                    {['All', 'Pending', 'In Progress', 'Approved', 'Rejected'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`${activeTab === tab
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                } rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 whitespace-nowrap`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative flex-grow sm:max-w-xs">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <Search className="h-4 w-4 text-gray-400" aria-hidden="true" />
                        </div>
                        <input
                            type="text"
                            name="search"
                            id="search"
                            className="block w-full rounded-xl border-0 py-2 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
                            placeholder="Search requests..."
                        />
                    </div>
                    <button className="inline-flex items-center justify-center rounded-xl bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        <Filter className="h-4 w-4 text-gray-500" />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50/50">
                            <tr>
                                <th scope="col" className="py-4 pl-4 pr-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sm:pl-6">Request details</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th scope="col" className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                <th scope="col" className="relative py-4 pl-3 pr-4 sm:pr-6"><span className="sr-only">Actions</span></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredRequests.map((request) => (
                                <tr key={request.id} className="hover:bg-gray-50 transition-colors cursor-pointer">
                                    <td className="whitespace-nowrap py-5 pl-4 pr-3 sm:pl-6">
                                        <div className="flex items-center">
                                            <div>
                                                <div className="font-medium text-gray-900">{request.title}</div>
                                                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                                                    <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">{request.id}</span>
                                                    • By {request.author}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 w-32">
                                        {request.type}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 w-32">
                                        {request.date}
                                    </td>
                                    <td className="whitespace-nowrap px-3 py-5 text-sm text-gray-500 w-32">
                                        {getStatusBadge(request.status)}
                                    </td>
                                    <td className="relative whitespace-nowrap py-5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 w-16">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleEditRequest(request.id, request.title); }}
                                            className="text-blue-500 hover:text-blue-700 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                                            title="Edit Request"
                                        >
                                            <Edit2 className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredRequests.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-sm text-gray-500">No requests found matching your filter.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
