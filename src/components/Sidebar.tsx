import { NavLink, useNavigate } from 'react-router-dom';
import { Home, ClipboardList, Megaphone, MessageSquareText, LogOut, GraduationCap, School, Users, BarChart3 } from 'lucide-react';

export default function Sidebar({ role, setRole }: { role: string, setRole: (r: string | null) => void }) {
    const navigate = useNavigate();

    const handleLogout = () => {
        setRole(null);
        navigate('/login');
    };

    const isFaculty = role?.startsWith('faculty');

    const getNavItems = () => {
        if (role === 'student') {
            return [
                { name: 'Dashboard', path: '/student', icon: Home },
                { name: 'My Requests', path: '/requests', icon: ClipboardList },
                { name: 'Announcements', path: '/announcements', icon: Megaphone },
                { name: 'AI Assistant', path: '/ai-chat', icon: MessageSquareText },
            ];
        }
        if (role === 'faculty_admin') {
            return [
                { name: 'Dashboard', path: '/faculty', icon: Home },
                { name: 'Manage Teachers', path: '/manage-teachers', icon: Users },
                { name: 'Manage Students', path: '/manage-students', icon: GraduationCap },
                { name: 'Reports', path: '/reports', icon: BarChart3 },
            ];
        }
        // teacher / hod
        return [
            { name: 'Dashboard', path: '/faculty', icon: Home },
            { name: 'Manage Requests', path: '/requests', icon: ClipboardList },
            { name: 'Announcements', path: '/announcements', icon: Megaphone },
        ];
    };

    const navItems = getNavItems();

    return (
        <div className="flex w-64 flex-col bg-white shadow-lg shadow-blue-900/5">
            <div className="flex h-16 shrink-0 items-center justify-center border-b px-4">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent flex items-center gap-2">
                    {isFaculty ? <School className="w-6 h-6 text-blue-600" /> : <GraduationCap className="w-6 h-6 text-indigo-600" />}
                    CampusEase
                </h1>
            </div>

            <div className="flex flex-1 flex-col overflow-y-auto pt-5 pb-4">
                <nav className="mt-5 flex-1 space-y-2 px-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        return (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `group flex items-center rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${isActive
                                        ? 'bg-blue-50 text-blue-700 shadow-sm'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`
                                }
                            >
                                <Icon className={`mr-3 h-5 w-5 shrink-0 transition-colors duration-200`} />
                                {item.name}
                            </NavLink>
                        );
                    })}
                </nav>
            </div>

            <div className="shrink-0 border-t p-4">
                <button
                    onClick={handleLogout}
                    className="group flex w-full items-center rounded-xl px-3 py-3 text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-700 transition-all duration-200"
                >
                    <LogOut className="mr-3 h-5 w-5 shrink-0" />
                    Logout
                </button>
            </div>
        </div>
    );
}
