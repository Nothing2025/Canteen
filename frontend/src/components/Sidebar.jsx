import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const studentLinks = [
    { to: '/student/menu', label: 'Menu', icon: '🍽️' },
    { to: '/student/cart', label: 'Cart', icon: '🛒' },
    { to: '/student/orders', label: 'My Orders', icon: '📋' },
];

const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { to: '/admin/menu', label: 'Menu Management', icon: '🍽️' },
    { to: '/admin/settings', label: 'Settings', icon: '⚙️' },
];

const staffLinks = [
    { to: '/staff/orders', label: 'Orders Queue', icon: '🧾' },
];

const Sidebar = () => {
    const { user } = useAuth();

    const links =
        user?.role === 'admin'
            ? adminLinks
            : user?.role === 'staff'
                ? staffLinks
                : studentLinks;

    return (
        <aside className="w-64 bg-gray-900 border-r border-gray-800 min-h-screen hidden md:flex flex-col py-6">
            <nav className="flex-1 px-4 space-y-1">
                {links.map((link) => (
                    <NavLink
                        key={link.to}
                        to={link.to}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
                                ? 'bg-primary-600/20 text-primary-400 border border-primary-500/20'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-gray-100'
                            }`
                        }
                    >
                        <span className="text-lg">{link.icon}</span>
                        {link.label}
                    </NavLink>
                ))}
            </nav>

            <div className="px-4 mt-6">
                <div className="bg-gradient-to-br from-primary-900/30 to-purple-900/30 border border-primary-800/30 rounded-xl p-4">
                    <p className="text-xs text-gray-400">Logged in as</p>
                    <p className="text-sm font-semibold text-gray-200 mt-0.5 truncate">{user?.name}</p>
                    <span className="text-xs text-primary-400 capitalize">{user?.role}</span>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
