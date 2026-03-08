import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/auth/login', form);
            login(data.user, data.token);
            toast.success(`Welcome, ${data.user.name}!`);
            if (data.user.role === 'admin') navigate('/admin/dashboard');
            else if (data.user.role === 'staff') navigate('/staff/orders');
            else navigate('/student/menu');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-gray-950 to-purple-900/20 pointer-events-none" />

            <div className="relative w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl mx-auto mb-4 shadow-2xl shadow-primary-500/30">
                        C
                    </div>
                    <h1 className="text-3xl font-bold text-white">CanteenPro</h1>
                    <p className="text-gray-400 mt-1">Pre-Ordering System</p>
                </div>

                <div className="card shadow-2xl">
                    <h2 className="text-xl font-semibold text-gray-100 mb-6">Sign in to your account</h2>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="label">Email address</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                className="input"
                                placeholder="you@example.com"
                                required
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <input
                                type="password"
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                className="input"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button type="submit" disabled={loading} className="btn-primary w-full mt-2">
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div className="mt-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                        <p className="text-xs text-gray-400 font-medium mb-2">Demo Credentials:</p>
                        <div className="space-y-1 text-xs text-gray-500">
                            <p>Admin: admin@canteen.com / <span className="text-gray-400">Admin@123</span></p>
                            <p>Staff: staff@canteen.com / <span className="text-gray-400">Admin@123</span></p>
                        </div>
                    </div>

                    <p className="mt-4 text-center text-sm text-gray-400">
                        No account?{' '}
                        <Link to="/register" className="text-primary-400 hover:text-primary-300 font-medium">
                            Register here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
