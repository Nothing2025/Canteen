import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types';
import { Clock, ChefHat, Package, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const statusFlow: OrderStatus[] = ['pending', 'preparing', 'ready', 'completed'];
const statusConfig: Record<string, { icon: any; class: string; next?: string }> = {
  pending: { icon: Clock, class: 'status-pending', next: 'preparing' },
  preparing: { icon: ChefHat, class: 'status-preparing', next: 'ready' },
  ready: { icon: Package, class: 'status-ready', next: 'completed' },
  completed: { icon: CheckCircle, class: 'status-completed' },
};

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [filter, setFilter] = useState<string>('all');

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Order Management</h1>
        <p className="text-muted-foreground mb-6">Manage and track all orders</p>
      </motion.div>

      <div className="flex gap-2 mb-6 overflow-x-auto">
        {['all', ...statusFlow].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-sm font-medium capitalize whitespace-nowrap transition-all ${
              filter === s ? 'gradient-primary text-primary-foreground' : 'bg-card border border-border text-muted-foreground hover:border-primary'
            }`}
          >
            {s} {s !== 'all' && `(${orders.filter(o => s === 'all' || o.status === s).length})`}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order, i) => {
          const cfg = statusConfig[order.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <p className="font-display font-bold text-foreground">{order.id}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${cfg.class}`}>
                    <Icon className="w-3 h-3 inline mr-1" />{order.status}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleTimeString()}</span>
                  <span className="text-xs bg-muted px-2 py-1 rounded text-muted-foreground">OTP: {order.otp}</span>
                </div>
              </div>
              <div className="text-sm text-muted-foreground mb-3">
                {order.items.map(i => `${i.quantity}x ${i.menuItemName}`).join(' · ')}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-display font-bold text-foreground">${order.total.toFixed(2)}</span>
                {cfg.next && (
                  <button
                    onClick={() => updateStatus(order.id, cfg.next as OrderStatus)}
                    className="px-4 py-2 rounded-lg text-sm font-medium gradient-primary text-primary-foreground shadow-glow hover:opacity-90 transition-opacity"
                  >
                    Mark as {cfg.next}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
