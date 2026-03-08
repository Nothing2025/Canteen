import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCartIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const Navbar = ({ cartCount = 0 }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const roleLabel = {
        student: '🎓 Student',
        admin: '⚙️ Admin',
        staff: '👨‍🍳 Staff',
    };

    return (
        <nav className="bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                            C
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-primary-400 to-purple-400 bg-clip-text text-transparent">
                            CanteenPro
                        </span>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-3">
                        {user?.role === 'student' && (
                            <Link
                                to="/student/cart"
                                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <ShoppingCartIcon className="h-6 w-6" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800 rounded-lg">
                            <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                            <span className="text-sm text-gray-300">{user?.name}</span>
                            <span className="text-xs text-gray-500 hidden sm:block">
                                {roleLabel[user?.role]}
                            </span>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                            title="Logout"
                        >
                            <ArrowRightOnRectangleIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
