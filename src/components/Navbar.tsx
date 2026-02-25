import { useState } from 'react';
import { Bell, Search, UserCircle2 } from 'lucide-react';

export default function Navbar({ role }: { role: string }) {
    const displayName = role?.startsWith('faculty') ? 'Prof. Smith' : 'Alex Johnson';
    const [showNotifications, setShowNotifications] = useState(false);

    return (
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white/80 px-4 shadow-sm backdrop-blur-md sm:gap-x-6 sm:px-6 lg:px-8">
            <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
                <form className="relative flex flex-1" action="#" method="GET">
                    <label htmlFor="search-field" className="sr-only">
                        Search
                    </label>
                    <Search
                        className="pointer-events-none absolute inset-y-0 left-0 h-full w-5 text-gray-400 pl-2"
                        aria-hidden="true"
                    />
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
                            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 mt-3 w-80 rounded-xl bg-white shadow-lg ring-1 ring-gray-900/5 focus:outline-none z-50 overflow-hidden">
                                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                                    <span className="text-xs text-blue-600 font-medium cursor-pointer hover:underline" onClick={() => setShowNotifications(false)}>Mark all read</span>
                                </div>
                                <div className="max-h-[300px] overflow-y-auto">
                                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900">Leave Application was Approved</p>
                                        <p className="text-xs text-gray-500 mt-1">10 minutes ago</p>
                                    </div>
                                    <div className="p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900">New Announcement: Tech Symposium</p>
                                        <p className="text-xs text-gray-500 mt-1">1 hour ago</p>
                                    </div>
                                    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer">
                                        <p className="text-sm font-medium text-gray-900">Wi-Fi Issue updated to "In Progress"</p>
                                        <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                                    </div>
                                </div>
                                <div className="p-3 border-t border-gray-100 text-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => setShowNotifications(false)}>
                                    <span className="text-xs font-semibold text-blue-600">View all</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" aria-hidden="true" />

                    <div className="flex items-center gap-x-4 p-1.5 cursor-pointer rounded-full hover:bg-gray-50 transition-colors">
                        <span className="sr-only">Open user menu</span>
                        <UserCircle2 className="h-8 w-8 text-gray-400" aria-hidden="true" />
                        <span className="hidden lg:flex lg:items-center">
                            <span className="text-sm font-semibold leading-6 text-gray-900" aria-hidden="true">
                                {displayName}
                            </span>
                        </span>
                    </div>
                </div>
            </div>
        </header>
    );
}
