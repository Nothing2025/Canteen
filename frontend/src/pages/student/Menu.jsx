import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const Menu = () => {
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deadline, setDeadline] = useState('');
    const [isPastDeadline, setIsPastDeadline] = useState(false);

    const getCart = () => {
        try { return JSON.parse(localStorage.getItem('cart') || '[]'); }
        catch { return []; }
    };

    const saveCart = (cart) => localStorage.setItem('cart', JSON.stringify(cart));

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [menuRes, settingsRes] = await Promise.all([
                    api.get('/menu'),
                    api.get('/settings/deadline'),
                ]);
                setMenu(menuRes.data);
                const dl = settingsRes.data.order_deadline;
                setDeadline(dl);
                // Check if past deadline
                const [h, m] = dl.split(':').map(Number);
                const deadlineDate = new Date();
                deadlineDate.setHours(h, m, 0, 0);
                setIsPastDeadline(new Date() > deadlineDate);
            } catch {
                toast.error('Failed to load menu');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const addToCart = (item) => {
        if (isPastDeadline) {
            toast.error('Ordering deadline has passed');
            return;
        }
        if (item.available_quantity === 0) {
            toast.error('Item out of stock');
            return;
        }
        const cart = getCart();
        const existing = cart.find(c => c.menu_id === item.id);
        if (existing) {
            if (existing.quantity >= item.available_quantity) {
                toast.error('Max available quantity reached');
                return;
            }
            existing.quantity += 1;
        } else {
            cart.push({
                menu_id: item.id,
                item_name: item.item_name,
                price: item.price,
                quantity: 1,
                available_quantity: item.available_quantity,
            });
        }
        saveCart(cart);
        toast.success(`${item.item_name} added to cart!`);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    if (loading) return <LoadingSpinner text="Loading today's menu..." />;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-white">Today's Menu</h1>
                    <p className="text-gray-400 text-sm mt-0.5">
                        {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                </div>
                <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium ${isPastDeadline
                    ? 'bg-red-900/30 border-red-700/30 text-red-400'
                    : 'bg-emerald-900/30 border-emerald-700/30 text-emerald-400'
                    }`}>
                    <span className={`w-2 h-2 rounded-full ${isPastDeadline ? 'bg-red-400' : 'bg-emerald-400 animate-pulse'}`} />
                    {isPastDeadline ? `Ordering closed (${deadline})` : `Order by ${deadline}`}
                </div>
            </div>

            {/* Menu grid */}
            {menu.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-4xl mb-4">🍽️</p>
                    <p className="text-gray-400 text-lg">No items available today</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menu.map((item) => (
                        <div
                            key={item.id}
                            className="card hover:border-gray-700 transition-all duration-200 flex flex-col group"
                        >
                            {/* Item emoji/icon area */}
                            <div className="w-full h-32 bg-gradient-to-br from-primary-900/30 to-purple-900/30 rounded-lg flex items-center justify-center text-5xl mb-4 group-hover:scale-105 transition-transform duration-200">
                                🍱
                            </div>

                            <h3 className="font-semibold text-gray-100 text-lg">{item.item_name}</h3>

                            <div className="flex items-center justify-between mt-2 mb-4">
                                <span className="text-2xl font-bold text-primary-400">₹{parseFloat(item.price).toFixed(2)}</span>
                                <span className={`text-xs px-2 py-1 rounded-full ${item.available_quantity === 0
                                    ? 'bg-red-900/40 text-red-400'
                                    : item.available_quantity <= 5
                                        ? 'bg-yellow-900/40 text-yellow-400'
                                        : 'bg-emerald-900/40 text-emerald-400'
                                    }`}>
                                    {item.available_quantity === 0 ? 'Out of stock' : `${item.available_quantity} left`}
                                </span>
                            </div>

                            <button
                                onClick={() => addToCart(item)}
                                disabled={isPastDeadline || item.available_quantity === 0}
                                className="btn-primary w-full mt-auto text-sm"
                            >
                                Add to Cart
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;
