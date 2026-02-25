import { Megaphone, Calendar, FileText, BellRing, PlusCircle, Edit2 } from 'lucide-react';
import { useAppContext, Announcement } from '../context/AppContext';

export default function Announcements() {
    const { announcements, addAnnouncement, updateAnnouncement } = useAppContext();

    const handleEditAnnouncement = (id: number, currentTitle: string, currentContent: string) => {
        const newTitle = prompt('Edit Announcement Title:', currentTitle);
        if (newTitle !== null) {
            const newContent = prompt('Edit Announcement Content:', currentContent);
            if (newContent !== null) {
                updateAnnouncement(id, { title: newTitle || currentTitle, content: newContent || currentContent });
            }
        }
    };

    const getIcon = (iconName: string) => {
        switch (iconName) {
            case 'Calendar': return Calendar;
            case 'BellRing': return BellRing;
            case 'FileText': return FileText;
            default: return Megaphone;
        }
    };

    const handleNewAnnouncement = () => {
        const newAnn: Announcement = {
            id: Date.now(),
            title: 'New Campus Policy Update',
            content: 'Please review the updated policies available on the university portal regarding academic integrity and library usage.',
            date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
            author: 'Administration',
            iconType: 'FileText',
            category: 'Notice',
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
            isNew: true
        };
        addAnnouncement(newAnn);
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
                <button onClick={handleNewAnnouncement} className="inline-flex items-center gap-x-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all duration-200">
                    <PlusCircle aria-hidden="true" className="-ml-0.5 h-5 w-5" />
                    New Announcement
                </button>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {announcements.map((announcement) => (
                    <div key={announcement.id} className="relative flex flex-col gap-6 rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all duration-300 hover:shadow-md hover:ring-gray-900/10 hover:-translate-y-1">
                        {announcement.isNew && (
                            <span className="absolute top-4 right-14 inline-flex items-center rounded-full bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/20">
                                New
                            </span>
                        )}
                        <button
                            onClick={(e) => { e.stopPropagation(); handleEditAnnouncement(announcement.id, announcement.title, announcement.content); }}
                            className="absolute top-4 right-4 text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50"
                            title="Edit Announcement"
                        >
                            <Edit2 className="h-4 w-4" aria-hidden="true" />
                        </button>
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
            </div>
        </div>
    );
}
