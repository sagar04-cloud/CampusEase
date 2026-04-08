import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function Layout({ role, setRole, userName, userEmail }: { role: string | null, setRole: (v: string | null) => void, userName: string, userEmail: string }) {
    if (!role) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            <Sidebar role={role} setRole={setRole} userName={userName} />

            <div className="flex-1 flex flex-col h-screen overflow-hidden">
                <Navbar role={role} userName={userName} userEmail={userEmail} />
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
                    <div className="mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
}
