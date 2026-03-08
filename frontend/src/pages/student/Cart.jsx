import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const PICKUP_SLOTS = ['8:00 AM', '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM'];

const Cart = () => {
    const [cart, setCart] = useState([]);
    const [pickupSlot, setPickupSlot] = useState('');
    const [placing, setPlacing] = useState(false);
    const [isPastDeadline, setIsPastDeadline] = useState(false);
    const navigate = useNavigate();

    const loadCart = () => {
        try { setCart(JSON.parse(localStorage.getItem('cart') || '[]')); }
        catch { setCart([]); }
    };

    useEffect(() => {
        loadCart();
        // Check deadline
        api.get('/settings/deadline').then(({ data }) => {
            const [h, m] = data.order_deadline.split(':').map(Number);
            const dl = new Date(); dl.setHours(h, m, 0, 0);
            setIsPastDeadline(new Date() > dl);
        }).catch(() => { });

        window.addEventListener('cartUpdated', loadCart);
        return () => window.removeEventListener('cartUpdated', loadCart);
    }, []);

    const updateQty = (menuId, delta) => {
        const updated = cart.map(item => {
            if (item.menu_id !== menuId) return item;
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            if (newQty > item.available_quantity) {
                toast.error('Exceeds available stock');
                return item;
            }
            return { ...item, quantity: newQty };
        }).filter(Boolean);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
    };

    const removeItem = (menuId) => {
        const updated = cart.filter(i => i.menu_id !== menuId);
        setCart(updated);
        localStorage.setItem('cart', JSON.stringify(updated));
        toast.success('Item removed');
    };

    const totalAmount = cart.reduce((sum, i) => sum + parseFloat(i.price) * i.quantity, 0);

    const placeOrder = async () => {
        if (!pickupSlot) { toast.error('Select a pickup slot'); return; }
        if (cart.length === 0) { toast.error('Cart is empty'); return; }
        if (isPastDeadline) { toast.error('Ordering deadline has passed'); return; }

        setPlacing(true);
        try {
            await api.post('/orders', {
                pickup_slot: pickupSlot,
                items: cart.map(i => ({ menu_id: i.menu_id, quantity: i.quantity })),
            });
            localStorage.removeItem('cart');
            setCart([]);
            toast.success('Order placed successfully! 🎉');
            navigate('/student/orders');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to place order');
        } finally {
            setPlacing(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Your Cart</h1>

            {cart.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">🛒</p>
                    <p className="text-gray-400 text-lg mb-4">Your cart is empty</p>
                    <button onClick={() => navigate('/student/menu')} className="btn-primary">
                        Browse Menu
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Cart items */}
                    <div className="card space-y-3">
                        {cart.map(item => (
                            <div key={item.menu_id} className="flex items-center justify-between gap-4 py-3 border-b border-gray-800 last:border-0">
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-100 truncate">{item.item_name}</p>
                                    <p className="text-sm text-gray-400">₹{parseFloat(item.price).toFixed(2)} each</p>
                                </div>

                                {/* Quantity controls */}
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => updateQty(item.menu_id, -1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
                                    >−</button>
                                    <span className="w-8 text-center font-semibold text-white">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQty(item.menu_id, 1)}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-700 hover:bg-gray-600 text-white font-bold transition-colors"
                                    >+</button>
                                </div>

                                <div className="text-right min-w-[80px]">
                                    <p className="font-semibold text-primary-400">₹{(parseFloat(item.price) * item.quantity).toFixed(2)}</p>
                                    <button
                                        onClick={() => removeItem(item.menu_id)}
                                        className="text-xs text-red-400 hover:text-red-300 transition-colors"
                                    >Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pickup slot */}
                    <div className="card">
                        <label className="label">Select Pickup Time Slot</label>
                        <select
                            value={pickupSlot}
                            onChange={(e) => setPickupSlot(e.target.value)}
                            className="input"
                        >
                            <option value="">Choose a slot...</option>
                            {PICKUP_SLOTS.map(slot => (
                                <option key={slot} value={slot}>{slot}</option>
                            ))}
                        </select>
                    </div>

                    {/* Order summary */}
                    <div className="card">
                        <div className="flex justify-between text-gray-400 mb-2">
                            <span>Items ({cart.length})</span>
                            <span>₹{totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between font-bold text-white text-lg border-t border-gray-800 pt-3 mt-3">
                            <span>Total</span>
                            <span className="text-primary-400">₹{totalAmount.toFixed(2)}</span>
                        </div>

                        {isPastDeadline && (
                            <div className="mt-4 p-3 bg-red-900/30 border border-red-700/30 rounded-lg text-red-400 text-sm">
                                ⚠️ Ordering deadline has passed. You cannot place new orders.
                            </div>
                        )}

                        <button
                            onClick={placeOrder}
                            disabled={placing || isPastDeadline}
                            className="btn-primary w-full mt-4"
                        >
                            {placing ? 'Placing Order...' : `Place Order — ₹${totalAmount.toFixed(2)}`}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
