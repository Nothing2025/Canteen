import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_BADGE = {
    pending: 'badge-pending',
    ready: 'badge-ready',
    completed: 'badge-completed',
    cancelled: 'badge-cancelled',
};

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(null);
    const [deadline, setDeadline] = useState('');

    const fetchOrders = async () => {
        try {
            const [ordersRes, settingsRes] = await Promise.all([
                api.get('/orders'),
                api.get('/settings/deadline'),
            ]);
            setOrders(ordersRes.data);
            setDeadline(settingsRes.data.order_deadline);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const cancelOrder = async (id) => {
        setCancelling(id);
        try {
            await api.delete(`/orders/${id}`);
            toast.success('Order cancelled');
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to cancel order');
        } finally {
            setCancelling(null);
        }
    };

    const isBeforeDeadline = () => {
        if (!deadline) return false;
        const [h, m] = deadline.split(':').map(Number);
        const dl = new Date(); dl.setHours(h, m, 0, 0);
        return new Date() < dl;
    };

    if (loading) return <LoadingSpinner text="Loading your orders..." />;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">My Orders</h1>

            {orders.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">📋</p>
                    <p className="text-gray-400 text-lg">No orders yet</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order.id} className="card">
                            {/* Header */}
                            <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-semibold text-gray-100">Order #{order.id}</p>
                                        <span className={STATUS_BADGE[order.status]}>{order.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-400 mt-0.5">
                                        {new Date(order.created_at).toLocaleString('en-IN')}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary-400">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                    <p className="text-sm text-gray-400">Pickup: {order.pickup_slot}</p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="space-y-1 mb-4">
                                {(order.items || []).map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm text-gray-400 py-1 border-b border-gray-800 last:border-0">
                                        <span>{item.item_name} × {item.quantity}</span>
                                        <span>₹{parseFloat(item.subtotal).toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Cancel button */}
                            {order.status === 'pending' && isBeforeDeadline() && (
                                <button
                                    onClick={() => cancelOrder(order.id)}
                                    disabled={cancelling === order.id}
                                    className="btn-danger text-sm"
                                >
                                    {cancelling === order.id ? 'Cancelling...' : 'Cancel Order'}
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;
