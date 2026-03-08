import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

const RoleLayout = () => {

    // Read cart from localStorage on each render
    const getCartCount = () => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart') || '[]');
            return cart.reduce((acc, item) => acc + item.quantity, 0);
        } catch {
            return 0;
        }
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar cartCount={getCartCount()} />
            <div className="flex flex-1">
                <Sidebar />
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RoleLayout;
