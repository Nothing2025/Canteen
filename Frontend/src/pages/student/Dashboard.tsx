import { useAuth } from '@/context/AuthContext';
import { motion } from 'framer-motion';
import { mockOrders, menuItems } from '@/data/mockData';
import { ShoppingBag, Clock, CheckCircle, TrendingUp, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function StudentDashboard() {
  const { user } = useAuth();
  const activeOrders = mockOrders.filter(o => o.status !== 'completed');
  const completedOrders = mockOrders.filter(o => o.status === 'completed');

  const stats = [
    { label: 'Active Orders', value: activeOrders.length, icon: Clock, color: 'text-primary', bgColor: 'bg-primary/8' },
    { label: 'Completed', value: completedOrders.length, icon: CheckCircle, color: 'text-success', bgColor: 'bg-success/8' },
    { label: 'Total Spent', value: `$${mockOrders.reduce((s, o) => s + o.total, 0).toFixed(2)}`, icon: TrendingUp, color: 'text-primary', bgColor: 'bg-primary/8' },
    { label: 'Items Ordered', value: mockOrders.reduce((s, o) => s + o.items.reduce((a, i) => a + i.quantity, 0), 0), icon: ShoppingBag, color: 'text-warning', bgColor: 'bg-warning/8' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'status-pending',
    preparing: 'status-preparing',
    ready: 'status-ready',
    completed: 'status-completed',
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 p-6 rounded-2xl gradient-primary relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-5 h-5 text-primary-foreground/80" />
            <span className="text-primary-foreground/70 text-sm font-medium">Good to see you!</span>
          </div>
          <h1 className="text-2xl lg:text-3xl font-display font-bold text-primary-foreground">
            Hey, {user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-primary-foreground/70 mt-1">Here's what's happening with your orders</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
            className="glass-card p-5 group"
          >
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Active Orders */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Active Orders</h2>
          <Link to="/orders" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {activeOrders.length === 0 ? (
            <p className="text-muted-foreground text-sm glass-card p-8 text-center">No active orders</p>
          ) : (
            activeOrders.map((order, i) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <p className="font-display font-semibold text-foreground">{order.id}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${statusColors[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{order.items.map(i => i.menuItemName).join(', ')}</p>
                </div>
                <p className="font-display font-bold text-foreground">${order.total.toFixed(2)}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Quick Menu */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-display font-semibold text-foreground">Popular Items</h2>
          <Link to="/menu" className="text-sm text-primary font-medium flex items-center gap-1 hover:gap-2 transition-all">
            Browse menu <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {menuItems.slice(0, 4).map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              className="glass-card overflow-hidden group cursor-pointer"
            >
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-3">
                <p className="font-display font-semibold text-sm text-foreground truncate">{item.name}</p>
                <p className="text-primary font-bold text-sm mt-1">${item.price.toFixed(2)}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
