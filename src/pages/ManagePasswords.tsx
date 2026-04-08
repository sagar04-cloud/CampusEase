import { useState, useEffect } from 'react';
import { Key, Search, Edit2, ShieldAlert, Loader2, Check, Lock } from 'lucide-react';
import { db } from '../firebase';
import { ref, onValue, update } from 'firebase/database';

type UserData = {
    name: string;
    email: string;
    role: string;
    password: string;
};

type UserAccount = UserData & { id: string };

export default function ManagePasswords() {
    const [accounts, setAccounts] = useState<UserAccount[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingAccount, setEditingAccount] = useState<UserAccount | null>(null);
    const [newPassword, setNewPassword] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const usersRef = ref(db, 'users');
        const unsubscribe = onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const list: UserAccount[] = Object.entries(data).map(([key, val]) => ({
                    ...(val as UserData),
                    id: key,
                }));
                // Sort by role then name
                list.sort((a, b) => a.role.localeCompare(b.role) || a.name.localeCompare(b.name));
                setAccounts(list);
            } else {
                setAccounts([]);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredAccounts = accounts.filter(acc =>
        acc.name.toLowerCase().includes(search.toLowerCase()) ||
        acc.email.toLowerCase().includes(search.toLowerCase()) ||
        acc.role.toLowerCase().includes(search.toLowerCase())
    );

    const handleUpdatePassword = async () => {
        if (!editingAccount || !newPassword.trim()) return;
        setSaving(true);

        try {
            await update(ref(db, `users/${editingAccount.id}`), {
                password: newPassword.trim()
            });
            setSaving(false);
            setEditingAccount(null);
            setNewPassword('');
        } catch (error) {
            console.error(error);
            alert('Failed to update password.');
            setSaving(false);
        }
    };

    const getRoleBadge = (role: string) => {
        switch (role) {
            case 'faculty_admin': return 'bg-red-50 text-red-700 ring-red-600/20';
            case 'faculty_hod': return 'bg-purple-50 text-purple-700 ring-purple-600/20';
            case 'faculty_teacher': return 'bg-blue-50 text-blue-700 ring-blue-600/20';
            case 'student': return 'bg-emerald-50 text-emerald-700 ring-emerald-600/20';
            default: return 'bg-gray-50 text-gray-700 ring-gray-600/20';
        }
    };

    const formatRole = (role: string) => {
        return role.replace('faculty_', '').toUpperCase();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-5">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                        <Key className="w-7 h-7 text-rose-600" /> Account Security
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">Manage login passwords for all accounts across the platform.</p>
                </div>
            </div>

            {/* Warning Box */}
            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-xl">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ShieldAlert className="h-5 w-5 text-amber-400" aria-hidden="true" />
                    </div>
                    <div className="ml-3">
                        <p className="text-sm text-amber-700 font-medium"> Admin Access Only </p>
                        <p className="text-sm text-amber-600 mt-0.5"> Changing passwords will log the user out of all sessions (if applicable). Use this with caution. </p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name, email or role..."
                    className="w-full rounded-xl border-0 py-2.5 pl-10 pr-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-rose-600 sm:text-sm outline-none"
                />
            </div>

            {/* List */}
            <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-900/5">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="py-4 pl-6 pr-3 text-left text-xs font-semibold text-gray-500 uppercase">User</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Role</th>
                            <th className="px-3 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Current Password</th>
                            <th className="py-4 pr-6 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={4} className="py-12 text-center">
                                    <Loader2 className="h-6 w-6 animate-spin text-rose-400 mx-auto" />
                                </td>
                            </tr>
                        ) : filteredAccounts.map(acc => (
                            <tr key={acc.id} className="hover:bg-gray-50 transition-colors">
                                <td className="py-4 pl-6 pr-3 text-sm">
                                    <div className="font-medium text-gray-900">{acc.name}</div>
                                    <div className="text-gray-500 text-xs">{acc.email}</div>
                                </td>
                                <td className="px-3 py-4 text-sm">
                                    <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${getRoleBadge(acc.role)}`}>
                                        {formatRole(acc.role)}
                                    </span>
                                </td>
                                <td className="px-3 py-4 text-sm text-gray-500 font-mono">
                                    {acc.password}
                                </td>
                                <td className="py-4 pr-6 text-right">
                                    <button
                                        onClick={() => { setEditingAccount(acc); setNewPassword(''); }}
                                        className="text-rose-600 hover:text-rose-800 p-1.5 rounded-md hover:bg-rose-50 transition-colors"
                                        title="Change Password"
                                    >
                                        <Edit2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {!loading && filteredAccounts.length === 0 && (
                    <div className="text-center py-12 text-gray-400 text-sm">No accounts found.</div>
                )}
            </div>

            {/* Change Password Modal */}
            {editingAccount && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setEditingAccount(null)} />
                    <div className="relative w-full max-w-sm rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/10 overflow-hidden text-black">
                        <div className="bg-rose-600 px-6 py-4">
                            <h3 className="text-base font-semibold text-white">Change Password</h3>
                            <p className="text-rose-100 text-xs mt-0.5">For {editingAccount.name}</p>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1.5 text-black">New Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <input
                                        type="text"
                                        autoFocus
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Enter new password"
                                        className="w-full rounded-xl border-0 ring-1 ring-gray-300 py-2.5 pl-10 pr-3.5 text-sm text-gray-900 focus:ring-2 focus:ring-rose-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 px-6 pb-5">
                            <button onClick={() => setEditingAccount(null)} className="rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 ring-1 ring-gray-200">Cancel</button>
                            <button
                                onClick={handleUpdatePassword}
                                disabled={!newPassword.trim() || saving}
                                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 transition-colors"
                            >
                                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                                Update Password
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
