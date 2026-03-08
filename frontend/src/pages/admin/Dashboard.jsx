import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';
import {
    BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, Cell
} from 'recharts';

const StatCard = ({ icon, label, value, color }) => (
    <div className="card flex items-center gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-gray-400 text-sm">{label}</p>
            <p className="text-2xl font-bold text-white">{value}</p>
        </div>
    </div>
);

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

const Dashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/orders/analytics')
            .then(({ data }) => setData(data))
            .catch(() => toast.error('Failed to load analytics'))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <LoadingSpinner text="Loading dashboard..." />;
    if (!data) return <p className="text-gray-400">No data available</p>;

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <StatCard
                    icon="💰"
                    label="Total Revenue"
                    value={`₹${parseFloat(data.total_revenue || 0).toFixed(2)}`}
                    color="bg-primary-900/40"
                />
                <StatCard
                    icon="📦"
                    label="Orders Today"
                    value={data.total_daily_orders}
                    color="bg-purple-900/40"
                />
                <StatCard
                    icon="🏆"
                    label="Most Ordered"
                    value={data.most_ordered?.item_name || 'N/A'}
                    color="bg-amber-900/40"
                />
            </div>

            {/* Charts row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Revenue */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Revenue (Last 7 Days)</h2>
                    {data.daily_revenue?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <LineChart data={data.daily_revenue}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis
                                    dataKey="date"
                                    tick={{ fill: '#9ca3af', fontSize: 11 }}
                                    tickFormatter={v => new Date(v).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                                    labelFormatter={v => new Date(v).toLocaleDateString('en-IN')}
                                    formatter={v => [`₹${parseFloat(v).toFixed(2)}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px] text-gray-500">No revenue data yet</div>
                    )}
                </div>

                {/* Top Items */}
                <div className="card">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">Top 5 Items by Quantity</h2>
                    {data.top_items?.length > 0 ? (
                        <ResponsiveContainer width="100%" height={220}>
                            <BarChart data={data.top_items}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                <XAxis dataKey="item_name" tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <YAxis tick={{ fill: '#9ca3af', fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{ backgroundColor: '#1f2937', border: '1px solid #374151', borderRadius: '8px', color: '#f3f4f6' }}
                                    formatter={v => [v, 'Qty Ordered']}
                                />
                                <Bar dataKey="total_qty" radius={[4, 4, 0, 0]}>
                                    {data.top_items.map((_, i) => (
                                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-[220px] text-gray-500">No order data yet</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
