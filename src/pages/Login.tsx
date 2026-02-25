import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, School, ChevronRight, Mail, Lock } from 'lucide-react';

export default function Login({ setRole }: { setRole: (v: string) => void }) {
    const [isStudent, setIsStudent] = useState(true);
    const [facultyRole, setFacultyRole] = useState('teacher');
    const [email, setEmail] = useState('student@campusease.edu');
    const [password, setPassword] = useState('password123');
    const navigate = useNavigate();

    const handleDemoFill = () => {
        if (isStudent) {
            setEmail('student@campusease.edu');
            setPassword('password123');
        } else {
            setEmail(`faculty_${facultyRole}@campusease.edu`);
            setPassword('adminpass456');
        }
    };

    const handleRoleTabClick = (studentMode: boolean) => {
        setIsStudent(studentMode);
        if (studentMode) {
            setEmail('student@campusease.edu');
        } else {
            setEmail(`faculty_${facultyRole}@campusease.edu`);
        }
    };

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        const role = isStudent ? 'student' : `faculty_${facultyRole}`;
        setRole(role);
        navigate(isStudent ? '/student' : '/faculty');
    };

    return (
        <div className="flex min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <div className="flex justify-center mb-6 text-blue-600">
                    {isStudent ? <GraduationCap size={48} /> : <School size={48} />}
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    CampusEase
                </h2>
                <p className="mt-2 text-sm text-gray-600 max-w">
                    Your All-in-One Smart Campus Companion
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl shadow-blue-900/10 sm:rounded-2xl sm:px-10 border border-white">
                    <div className="flex justify-center mb-8 bg-gray-100/50 p-1 rounded-xl">
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${isStudent ? 'bg-white shadow-md text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => handleRoleTabClick(true)}
                        >
                            Student Portal
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${!isStudent ? 'bg-white shadow-md text-indigo-600' : 'text-gray-500 hover:text-gray-700'}`}
                            onClick={() => handleRoleTabClick(false)}
                        >
                            Faculty Portal
                        </button>
                    </div>

                    <form className="space-y-6" onSubmit={handleLogin}>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                University Email Address
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white/50"
                                    placeholder="you@university.edu"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                                Password
                            </label>
                            <div className="relative mt-2 rounded-md shadow-sm">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                </div>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full rounded-xl border-0 py-2.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 bg-white/50"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isStudent && (
                            <div>
                                <label htmlFor="facultyRole" className="block text-sm font-medium leading-6 text-gray-900">
                                    Faculty Access Level
                                </label>
                                <select
                                    id="facultyRole"
                                    name="facultyRole"
                                    value={facultyRole}
                                    onChange={(e) => setFacultyRole(e.target.value)}
                                    className="mt-2 block w-full rounded-xl border-0 py-2.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6 bg-white/50"
                                >
                                    <option value="teacher">Teacher (Basic Access)</option>
                                    <option value="hod">Head of Department (Moderate Access)</option>
                                    <option value="admin">System Admin (Full Access)</option>
                                </select>
                            </div>
                        )}

                        <div className="flex items-center justify-between">
                            <div className="flex items-center">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
                                />
                                <label htmlFor="remember-me" className="ml-3 block text-sm leading-6 text-gray-700">
                                    Remember me
                                </label>
                            </div>

                            <div className="text-sm leading-6">
                                <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                                    Forgot password?
                                </a>
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="group flex w-full justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-3 text-sm font-semibold text-white shadow-sm hover:from-blue-500 hover:to-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 tracking-wide transition-all duration-300"
                            >
                                Sign In
                                <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 flex flex-col items-center justify-center text-center text-xs text-gray-500 gap-3">
                        <p>For demo purposes, you can use the quick fill button.</p>
                        <button
                            type="button"
                            onClick={handleDemoFill}
                            className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                        >
                            Quick Fill Magic
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
