import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const STATUS_BADGE = {
    pending: 'badge-pending',
    ready: 'badge-ready',
    completed: 'badge-completed',
};

const OrdersQueue = () => {
    const [orders, setOrders] = useState([]);
    const [slots, setSlots] = useState([]);
    const [selectedSlot, setSelectedSlot] = useState('');
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(null);

    const fetchOrders = useCallback(async () => {
        try {
            const [ordersRes, slotsRes] = await Promise.all([
                api.get('/staff/orders', { params: selectedSlot ? { slot: selectedSlot } : {} }),
                api.get('/staff/slots'),
            ]);
            setOrders(ordersRes.data);
            setSlots(slotsRes.data);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    }, [selectedSlot]);

    useEffect(() => {
        fetchOrders();
        // Poll every 30 seconds
        const interval = setInterval(fetchOrders, 30000);
        return () => clearInterval(interval);
    }, [fetchOrders]);

    const updateStatus = async (id, status) => {
        setUpdating(id);
        try {
            await api.patch(`/staff/orders/${id}`, { status });
            toast.success(`Order marked as ${status}`);
            fetchOrders();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update');
        } finally {
            setUpdating(null);
        }
    };

    const pending = orders.filter(o => o.status === 'pending');
    const ready = orders.filter(o => o.status === 'ready');
    const completed = orders.filter(o => o.status === 'completed');

    if (loading) return <LoadingSpinner text="Loading orders..." />;

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Orders Queue</h1>
                    <p className="text-sm text-gray-400 mt-0.5">Auto-refreshes every 30s</p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Slot filter */}
                    <select
                        value={selectedSlot}
                        onChange={e => setSelectedSlot(e.target.value)}
                        className="input w-auto py-2 text-sm"
                    >
                        <option value="">All Slots</option>
                        {slots.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <button onClick={fetchOrders} className="btn-secondary text-sm py-2">
                        🔄 Refresh
                    </button>
                </div>
            </div>

            {/* Stats bar */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Pending', count: pending.length, color: 'text-yellow-400', bg: 'bg-yellow-900/20 border-yellow-700/30' },
                    { label: 'Ready', count: ready.length, color: 'text-blue-400', bg: 'bg-blue-900/20 border-blue-700/30' },
                    { label: 'Completed', count: completed.length, color: 'text-emerald-400', bg: 'bg-emerald-900/20 border-emerald-700/30' },
                ].map(s => (
                    <div key={s.label} className={`rounded-xl p-4 border text-center ${s.bg}`}>
                        <p className={`text-3xl font-bold ${s.color}`}>{s.count}</p>
                        <p className="text-gray-400 text-sm">{s.label}</p>
                    </div>
                ))}
            </div>

            {orders.length === 0 ? (
                <div className="card text-center py-16">
                    <p className="text-5xl mb-4">🧾</p>
                    <p className="text-gray-400 text-lg">No orders in the queue</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div
                            key={order.id}
                            className={`card border-l-4 ${order.status === 'pending' ? 'border-l-yellow-500' :
                                    order.status === 'ready' ? 'border-l-blue-500' : 'border-l-emerald-500'
                                }`}
                        >
                            <div className="flex flex-wrap items-start justify-between gap-4">
                                {/* Order info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="font-semibold text-gray-100">Order #{order.id}</p>
                                        <span className={STATUS_BADGE[order.status]}>{order.status}</span>
                                    </div>
                                    <p className="text-sm text-gray-400">Student: <span className="text-gray-200">{order.student_name}</span></p>
                                    <p className="text-sm text-gray-400">Pickup: <span className="text-primary-400 font-medium">{order.pickup_slot}</span></p>
                                    <p className="text-xs text-gray-500 mt-1">{new Date(order.created_at).toLocaleString('en-IN')}</p>

                                    {/* Items */}
                                    <div className="flex flex-wrap gap-2 mt-3">
                                        {(order.items || []).map((item, i) => (
                                            <span key={i} className="text-xs bg-gray-800 text-gray-300 px-2.5 py-1 rounded-full border border-gray-700">
                                                {item.item_name} ×{item.quantity}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Amount + Actions */}
                                <div className="text-right">
                                    <p className="text-xl font-bold text-primary-400 mb-3">₹{parseFloat(order.total_amount).toFixed(2)}</p>
                                    <div className="flex flex-col gap-2">
                                        {order.status === 'pending' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'ready')}
                                                disabled={updating === order.id}
                                                className="btn-primary text-sm py-1.5"
                                            >
                                                ✅ Mark Ready
                                            </button>
                                        )}
                                        {order.status === 'ready' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'completed')}
                                                disabled={updating === order.id}
                                                className="btn-success text-sm py-1.5"
                                            >
                                                🏁 Mark Completed
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrdersQueue;
