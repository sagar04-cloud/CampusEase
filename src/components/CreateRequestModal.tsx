import { useState } from 'react';
import { X, ClipboardList, Send, Loader2 } from 'lucide-react';
import { Request } from '../context/AppContext';

type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (request: Omit<Request, 'id' | 'timestamp'>) => void;
    userName: string;
    userEmail: string;
    role?: string; // Add role to props
};

export default function CreateRequestModal({ isOpen, onClose, onSubmit, userName, userEmail, role }: Props) {
    const [title, setTitle] = useState('');
    const [type, setType] = useState('General');
    const [priority, setPriority] = useState('Medium');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const isStudent = role === 'student';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title.trim()) return;

        setLoading(true);
        const newReq: Omit<Request, 'id' | 'timestamp'> = {
            title: title.trim(),
            type,
            status: 'Pending',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: userName,
            studentEmail: userEmail,
            priority: isStudent ? 'Medium' : priority // Students get default Medium priority
        };

        try {
            await onSubmit(newReq);
            setTitle('');
            setType('General');
            setPriority('Medium');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <div className="flex items-center gap-2.5">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <ClipboardList className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">New Request</h3>
                            <p className="text-xs text-gray-500">Submit a new application or request</p>
                        </div>
                    </div>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-200 rounded-full transition-colors"
                    >
                        <X className="h-5 w-5 text-gray-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1.5">Request Title</label>
                        <input 
                            type="text"
                            required
                            autoFocus
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="e.g., Leave Application for Midterms"
                            className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                        />
                    </div>

                    <div className={`grid ${isStudent ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                            <select 
                                value={type}
                                onChange={e => setType(e.target.value)}
                                className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                            >
                                <option>General</option>
                                <option>Academic</option>
                                <option>Maintenance</option>
                                <option>Event</option>
                                <option>IT Support</option>
                                <option>Procurement</option>
                            </select>
                        </div>
                        
                        {!isStudent && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Priority</label>
                                <select 
                                    value={priority}
                                    onChange={e => setPriority(e.target.value)}
                                    className="w-full rounded-xl border-gray-200 bg-gray-50/50 focus:border-blue-500 focus:ring-blue-500 text-sm py-2.5"
                                >
                                    <option>Low</option>
                                    <option>Medium</option>
                                    <option>High</option>
                                    <option>Urgent</option>
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="pt-4 border-t border-gray-100 flex gap-3 justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white px-6 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-blue-200 transition-all active:scale-95"
                        >
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Submit Request</>}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
