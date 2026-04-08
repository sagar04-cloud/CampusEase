import { useState } from 'react';
import { Bell, Search, UserCircle2, CheckCircle2, Info, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

export default function Navbar({ role, userName, userEmail }: { role: string; userName: string; userEmail: string }) {
    const displayName = userName || (role?.startsWith('faculty') ? 'Prof. Smith' : 'Alex Johnson');
    const [showNotifications, setShowNotifications] = useState(false);
    const { notifications, markNotificationAsRead, markAllNotificationsAsRead } = useAppContext();

    const userNotifications = notifications.filter(n => n.recipientEmail === userEmail);
    const unreadCount = userNotifications.filter(n => !n.isRead).length;

    const getIcon = (type: string) => {
        switch (type) {
            case 'success': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
            case 'error': return <XCircle className="h-4 w-4 text-rose-500" />;
            case 'warning': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
            default: return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const formatTime = (ts: number) => {
        const diff = Date.now() - ts;
        if (diff < 60000) return 'Just now';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
        return new Date(ts).toLocaleDateString();
    };

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">Search</label>
                    <Search className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-2" aria-hidden="true" />
                    <input
                        id="search-field"
                        className="block h-full w-full border-0 py-0 pl-10 pr-0 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm bg-transparent outline-none"
                        placeholder="Search for requests, announcements..."
                        type="search"
                        name="search"
                    />
                </form>
                <div className="flex items-center gap-x-4 lg:gap-x-6">
                    <div className="relative">
                        <button
                            type="button"
                            className="-m-2.5 p-2.5 text-gray-400 hover:text-gray-500 relative transition-colors"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <span className="sr-only">View notifications</span>
                            <Bell className="h-5 w-5" aria-hidden="true" />
                            {unreadCount > 0 && (
                                <span className="absolute top-2 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white animate-pulse">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none z-50 overflow-hidden border border-gray-100">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                    {unreadCount > 0 && (
                                        <span 
                                            className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" 
                                            onClick={() => markAllNotificationsAsRead(userEmail)}
                                        >
                                            Mark all read
                                        </span>
                                    )}
                                </div>
                                <div className="max-h-[350px] overflow-y-auto">
                                    {userNotifications.length === 0 ? (
                                        <div className="p-8 text-center text-sm text-gray-400">
                                            <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                                            No notifications yet
                                        </div>
                                    ) : (
                                        userNotifications.map((n) => (
                                            <div 
                                                key={n.id} 
                                                onClick={() => !n.isRead && markNotificationAsRead(n.id)}
                                                className={`p-4 border-b border-gray-50 transition-colors cursor-pointer ${!n.isRead ? 'bg-blue-50/30' : 'hover:bg-gray-50'}`}
                                            >
                                                <div className="flex gap-3">
                                                    <div className="mt-0.5">{getIcon(n.type)}</div>
                                                    <div className="flex-1">
                                                        <p className={`text-sm ${!n.isRead ? 'font-bold text-gray-900' : 'text-gray-700'}`}>{n.title}</p>
                                                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{n.message}</p>
                                                        <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                                                            <Clock className="h-3 w-3" />
                                                            {formatTime(n.timestamp)}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowNotifications(false)}>
                                    <span className="text-xs font-semibold text-blue-600">Close</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                    <div className="flex items-center gap-x-4 p-1.5 cursor-pointer rounded-full hover:bg-gray-50 transition-colors">
                        <span className="sr-only">Open user menu</span>
                        <UserCircle2 className="h-8 w-8 text-gray-400" aria-hidden="true" />
                        <span className="hidden lg:flex lg:items-center">
                            <span className="text-sm font-semibold leading-6 text-gray-900 truncate max-w-[120px]" aria-hidden="true">
                                {displayName}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
