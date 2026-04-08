import { useState, useEffect } from 'react';
import { BookOpen, FileText, Loader2, Search, Download } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

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

export default function AcademicMaterials() {
    const [materials, setMaterials] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const refD = ref(db, 'assignments');
        const unsubscribe = onValue(refD, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: Assignment[] = Object.entries(data).map(([key, val]: [string, any]) => ({
                    id: key,
                    ...val
                }));
                // In a real app, we'd filter by the student's class
                setMaterials(list.sort((a, b) => b.createdAt - a.createdAt));
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const filtered = materials.filter(m =>
        m.title.toLowerCase().includes(search.toLowerCase()) ||
        m.author.toLowerCase().includes(search.toLowerCase()) ||
        m.class.toLowerCase().includes(search.toLowerCase())
    );

    const typeStyle = (type: string) => {
        switch (type) {
            case 'Assignment': return 'bg-amber-50 text-amber-700 ring-amber-600/20';
            case 'Quiz': return 'bg-rose-50 text-rose-700 ring-rose-600/20';
            default: return 'bg-blue-50 text-blue-700 ring-blue-600/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3 text-red">
                        <BookOpen className="w-8 h-8 text-indigo-600" /> Academic Materials
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Access study materials, assignments, and quizzes posted by your teachers.</p>
                </div>
            </div>

            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by title, teacher or class..."
                    className="w-full rounded-xl border-gray-200 py-2.5 pl-10 pr-4 text-sm ring-1 ring-gray-900/5 focus:ring-2 focus:ring-indigo-600 outline-none"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {loading ? (
                    <div className="col-span-full py-16 flex justify-center"><Loader2 className="h-8 w-8 animate-spin text-indigo-400" /></div>
                ) : filtered.map((item) => (
                    <div key={item.id} className="group relative flex flex-col bg-white rounded-3xl p-6 shadow-sm ring-1 ring-gray-900/5 hover:ring-indigo-600/30 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ring-1 ring-inset ${typeStyle(item.type)}`}>
                                {item.type}
                            </span>
                            <div className="text-[10px] font-bold text-gray-400 uppercase">{item.class}</div>
                        </div>

                        <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">{item.title}</h3>
                        <p className="text-sm text-gray-500 line-clamp-3 mb-6 leading-relaxed flex-1">
                            {item.description}
                        </p>

                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                            <div className="flex flex-col">
                                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Post By</span>
                                <span className="text-xs font-bold text-gray-900">{item.author}</span>
                            </div>
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] text-rose-500 font-bold uppercase tracking-tight">Due Date</span>
                                <span className="text-xs font-bold text-gray-900">{item.dueDate}</span>
                            </div>
                        </div>

                        {item.link && (
                            <a 
                                href={item.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="mt-4 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-700 py-2.5 rounded-xl text-xs font-bold hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                            >
                                <Download className="h-3.5 w-3.5" /> View / Download Resource
                            </a>
                        )}
                    </div>
                ))}
                {!loading && filtered.length === 0 && (
                    <div className="col-span-full text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 text-gray-400">
                        <FileText className="h-10 w-10 mx-auto mb-3 opacity-20" />
                        <p className="text-sm font-medium">No materials found for your search.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
