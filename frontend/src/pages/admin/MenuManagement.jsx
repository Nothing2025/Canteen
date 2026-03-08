import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/LoadingSpinner';

const emptyForm = { item_name: '', price: '', available_quantity: '', date: new Date().toISOString().split('T')[0] };

const MenuManagement = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);

    const fetchItems = async () => {
        try {
            const { data } = await api.get('/menu/all');
            setItems(data);
        } catch {
            toast.error('Failed to load menu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchItems(); }, []);

    const handleEdit = (item) => {
        setEditing(item.id);
        setForm({
            item_name: item.item_name,
            price: item.price,
            available_quantity: item.available_quantity,
            date: item.date?.split('T')[0] || new Date().toISOString().split('T')[0],
        });
        setShowForm(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editing) {
                await api.put(`/menu/${editing}`, form);
                toast.success('Item updated');
            } else {
                await api.post('/menu', form);
                toast.success('Item created');
            }
            setShowForm(false);
            setEditing(null);
            setForm(emptyForm);
            fetchItems();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save item');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Delete this item?')) return;
        try {
            await api.delete(`/menu/${id}`);
            toast.success('Item deleted');
            fetchItems();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleToggle = async (id) => {
        try {
            await api.patch(`/menu/${id}/toggle`);
            fetchItems();
        } catch {
            toast.error('Failed to toggle');
        }
    };

    if (loading) return <LoadingSpinner />;

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-white">Menu Management</h1>
                <button
                    onClick={() => { setShowForm(true); setEditing(null); setForm(emptyForm); }}
                    className="btn-primary"
                >
                    + Add Item
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="card mb-6 border-primary-500/30">
                    <h2 className="text-lg font-semibold text-gray-100 mb-4">
                        {editing ? 'Edit Item' : 'New Menu Item'}
                    </h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                            <label className="label">Item Name</label>
                            <input
                                type="text"
                                value={form.item_name}
                                onChange={e => setForm({ ...form, item_name: e.target.value })}
                                className="input"
                                required
                                placeholder="e.g. Masala Dosa"
                            />
                        </div>
                        <div>
                            <label className="label">Price (₹)</label>
                            <input
                                type="number"
                                value={form.price}
                                onChange={e => setForm({ ...form, price: e.target.value })}
                                className="input"
                                required min="0" step="0.01"
                                placeholder="e.g. 45.00"
                            />
                        </div>
                        <div>
                            <label className="label">Available Quantity</label>
                            <input
                                type="number"
                                value={form.available_quantity}
                                onChange={e => setForm({ ...form, available_quantity: e.target.value })}
                                className="input"
                                required min="0"
                                placeholder="e.g. 50"
                            />
                        </div>
                        <div>
                            <label className="label">Date</label>
                            <input
                                type="date"
                                value={form.date}
                                onChange={e => setForm({ ...form, date: e.target.value })}
                                className="input"
                                required
                            />
                        </div>
                        <div className="flex gap-3 sm:col-span-2">
                            <button type="submit" disabled={saving} className="btn-primary">
                                {saving ? 'Saving...' : (editing ? 'Update Item' : 'Create Item')}
                            </button>
                            <button
                                type="button"
                                onClick={() => { setShowForm(false); setEditing(null); setForm(emptyForm); }}
                                className="btn-secondary"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Table */}
            <div className="card p-0 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-800/50 border-b border-gray-700">
                            <tr>
                                {['Item Name', 'Price', 'Quantity', 'Date', 'Status', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {items.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-500">No menu items yet</td>
                                </tr>
                            ) : items.map(item => (
                                <tr key={item.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition-colors">
                                    <td className="px-4 py-3 font-medium text-gray-100">{item.item_name}</td>
                                    <td className="px-4 py-3 text-primary-400 font-semibold">₹{parseFloat(item.price).toFixed(2)}</td>
                                    <td className="px-4 py-3">
                                        <span className={`font-medium ${item.available_quantity === 0 ? 'text-red-400' : 'text-gray-300'}`}>
                                            {item.available_quantity}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-gray-400">
                                        {new Date(item.date).toLocaleDateString('en-IN')}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() => handleToggle(item.id)}
                                            className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-colors cursor-pointer ${item.is_active
                                                    ? 'bg-emerald-900/40 text-emerald-400 border-emerald-700/30 hover:bg-emerald-900/60'
                                                    : 'bg-gray-700/40 text-gray-400 border-gray-600/30 hover:bg-gray-700/60'
                                                }`}
                                        >
                                            {item.is_active ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="text-primary-400 hover:text-primary-300 text-xs font-medium px-3 py-1 rounded bg-primary-900/20 hover:bg-primary-900/40 transition-colors"
                                            >Edit</button>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="text-red-400 hover:text-red-300 text-xs font-medium px-3 py-1 rounded bg-red-900/20 hover:bg-red-900/40 transition-colors"
                                            >Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default MenuManagement;
