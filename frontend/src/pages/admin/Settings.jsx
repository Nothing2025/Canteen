import { useState, useEffect } from 'react';
import api from '../../api/axios';
import toast from 'react-hot-toast';

const Settings = () => {
    const [deadline, setDeadline] = useState('');
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/settings/deadline')
            .then(({ data }) => setDeadline(data.order_deadline))
            .catch(() => toast.error('Failed to load settings'))
            .finally(() => setLoading(false));
    }, []);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!/^\d{2}:\d{2}$/.test(deadline)) {
            toast.error('Use HH:MM format (e.g. 10:30)');
            return;
        }
        setSaving(true);
        try {
            await api.put('/settings/deadline', { order_deadline: deadline });
            toast.success('Deadline updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update deadline');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-2xl font-bold text-white mb-6">Settings</h1>

            <div className="card">
                <h2 className="text-lg font-semibold text-gray-100 mb-1">Order Deadline</h2>
                <p className="text-gray-400 text-sm mb-6">
                    Students cannot place new orders after this time each day.
                </p>

                {loading ? (
                    <div className="h-10 bg-gray-800 rounded-lg animate-pulse" />
                ) : (
                    <form onSubmit={handleSave} className="space-y-4">
                        <div>
                            <label className="label">Deadline Time (24-hour format)</label>
                            <input
                                type="time"
                                value={deadline}
                                onChange={e => setDeadline(e.target.value)}
                                className="input"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1.5">Current deadline: <span className="text-gray-300">{deadline}</span></p>
                        </div>

                        <button type="submit" disabled={saving} className="btn-primary">
                            {saving ? 'Saving...' : 'Save Deadline'}
                        </button>
                    </form>
                )}
            </div>

            <div className="mt-4 p-4 bg-yellow-900/20 border border-yellow-700/30 rounded-xl">
                <p className="text-yellow-400 text-sm font-medium">⚠️ Note</p>
                <p className="text-gray-400 text-sm mt-1">
                    Changing the deadline affects all future orders immediately. Students who have already added items to their cart will not be able to checkout after the new deadline.
                </p>
            </div>
        </div>
    );
};

export default Settings;
