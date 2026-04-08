import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, Mail, Lock, User, ChevronRight, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';
import { db } from '../firebase';
import { ref, get, set } from 'firebase/database';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRecord = {
    name: string;
    email: string;
    password: string;         // plain-text for demo; use Firebase Auth for production
    role: 'student' | 'faculty_teacher' | 'faculty_hod' | 'faculty_admin';
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Firebase keys cannot contain . # $ [ ] / — encode email to a safe key */
const emailToKey = (email: string) =>
    email.toLowerCase().replace(/\./g, ',').replace(/@/g, '__at__');

/** Pre-seeded admin account — written once if it doesn't exist in Firebase */
const STAFF_SEEDS: UserRecord[] = [
    { name: 'System Admin', email: 'admin@campusease.edu', password: 'Admin@123', role: 'faculty_admin' },
];

async function seedStaffAccounts() {
    for (const staff of STAFF_SEEDS) {
        const key = emailToKey(staff.email);
        const snap = await get(ref(db, `users/${key}`));
        if (!snap.exists()) {
            await set(ref(db, `users/${key}`), staff);
        }
    }
}

// ─── Component ────────────────────────────────────────────────────────────────

type Props = {
    setRole: (role: string) => void;
    setUserName: (name: string) => void;
    setUserEmail: (email: string) => void;
};

export default function Login({ setRole, setUserName, setUserEmail }: Props) {
    const navigate = useNavigate();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // Seed staff accounts once on mount
    useEffect(() => { seedStaffAccounts(); }, []);

    const resetForm = () => {
        setEmail(''); setPassword(''); setName(''); setConfirmPassword('');
        setError(''); setShowPass(false);
    };

    const switchMode = (next: 'login' | 'register') => {
        resetForm();
        setMode(next);
    };

    // ── Login ──────────────────────────────────────────────────────────────────

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        setLoading(true);
        try {
            const key = emailToKey(email.trim());
            const snap = await get(ref(db, `users/${key}`));

            if (!snap.exists()) {
                setError('No account found with this email address.');
                setLoading(false);
                return;
            }

            const user = snap.val() as UserRecord;

            if (user.password !== password) {
                setError('Incorrect password. Please try again.');
                setLoading(false);
                return;
            }

            // Success
            setRole(user.role);
            setUserName(user.name);
            setUserEmail(user.email);
            navigate(user.role === 'student' ? '/student' : '/faculty');
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Register (students only) ───────────────────────────────────────────────

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!name.trim()) { setError('Please enter your full name.'); return; }
        if (!email.trim()) { setError('Please enter your email address.'); return; }
        if (password.length < 6) { setError('Password must be at least 6 characters.'); return; }
        if (password !== confirmPassword) { setError('Passwords do not match.'); return; }

        setLoading(true);
        try {
            const key = emailToKey(email.trim());
            const snap = await get(ref(db, `users/${key}`));

            if (snap.exists()) {
                setError('An account with this email already exists. Please log in.');
                setLoading(false);
                return;
            }

            const newUser: UserRecord = {
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
                role: 'student',
            };

            await set(ref(db, `users/${key}`), newUser);
            setRole('student');
            setUserName(newUser.name);
            setUserEmail(newUser.email);
            navigate('/student');
        } catch {
            setError('Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // ── Render ─────────────────────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900 flex items-center justify-center p-4">

            {/* Background Blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl" />
            </div>

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-600/20 backdrop-blur ring-1 ring-blue-500/30 mb-4 shadow-xl shadow-blue-500/20">
                        {mode === 'register'
                            ? <GraduationCap className="w-8 h-8 text-blue-400" />
                            : <School className="w-8 h-8 text-blue-400" />}
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">CampusEase</h1>
                    <p className="mt-1 text-sm text-blue-300/80">
                        {mode === 'login' ? 'Sign in to your account' : 'Create your student account'}
                    </p>
                </div>

                {/* Card */}
                <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl ring-1 ring-white/20">

                    {/* Mode Switcher */}
                    <div className="flex bg-white/10 rounded-xl p-1 mb-6">
                        <button
                            type="button"
                            onClick={() => switchMode('login')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'login'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            Sign In
                        </button>
                        <button
                            type="button"
                            onClick={() => switchMode('register')}
                            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${mode === 'register'
                                ? 'bg-white text-gray-900 shadow-md'
                                : 'text-white/70 hover:text-white'
                                }`}
                        >
                            Create Account
                        </button>
                    </div>

                    {/* Info box for Create Account tab */}
                    {mode === 'register' && (
                        <div className="mb-4 flex items-start gap-2.5 bg-blue-500/20 border border-blue-400/30 rounded-xl px-4 py-3">
                            <AlertCircle className="h-4 w-4 text-blue-300 mt-0.5 shrink-0" />
                            <p className="text-xs text-blue-200 leading-relaxed">
                                Account registration is available for <strong>students only</strong>. Staff members (Admin, HOD, Teachers) must use their pre-assigned credentials.
                            </p>
                        </div>
                    )}

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-4 flex items-start gap-2.5 bg-red-500/20 border border-red-400/30 rounded-xl px-4 py-3">
                            <AlertCircle className="h-4 w-4 text-red-300 mt-0.5 shrink-0" />
                            <p className="text-sm text-red-200">{error}</p>
                        </div>
                    )}

                    {/* ── LOGIN FORM ───────────────────── */}
                    {mode === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        autoComplete="email"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@campusease.edu"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">
                                    Password
                                </label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        autoComplete="current-password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(s => !s)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors"
                                    >
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-300 shadow-lg shadow-blue-900/40 mt-2"
                            >
                                {loading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <>Sign In <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                                }
                            </button>
                        </form>
                    )}

                    {/* ── REGISTER FORM ───────────────── */}
                    {mode === 'register' && (
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">Full Name</label>
                                <div className="relative">
                                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Your full name"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="you@campusease.edu"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-10 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70 transition-colors">
                                        {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-blue-200 mb-1.5">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40 pointer-events-none" />
                                    <input
                                        type={showPass ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={e => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className="w-full bg-white/10 text-white placeholder:text-white/30 rounded-xl pl-10 pr-4 py-2.5 text-sm ring-1 ring-white/20 focus:ring-2 focus:ring-blue-400 outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="group w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold rounded-xl py-3 text-sm transition-all duration-300 shadow-lg shadow-blue-900/40"
                            >
                                {loading
                                    ? <Loader2 className="h-4 w-4 animate-spin" />
                                    : <>Create Account <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
                                }
                            </button>

                            <p className="text-center text-xs text-white/40">
                                Already have an account?{' '}
                                <button type="button" onClick={() => switchMode('login')} className="text-blue-300 hover:text-blue-200 font-semibold transition-colors">
                                    Sign in
                                </button>
                            </p>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
