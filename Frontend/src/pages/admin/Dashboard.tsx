import { motion } from 'framer-motion';
import { mockAnalytics, mockOrders } from '@/data/mockData';
import { DollarSign, ShoppingBag, TrendingUp, Users, ArrowUpRight } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

const COLORS = ['hsl(239, 84%, 67%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(220, 9%, 46%)'];

export default function AdminDashboard() {
  const data = mockAnalytics;
  const stats = [
    { label: 'Total Orders', value: data.totalOrders.toLocaleString(), icon: ShoppingBag, change: '+12.5%', bgColor: 'bg-primary/8' },
    { label: 'Daily Revenue', value: `$${data.dailyRevenue.toLocaleString()}`, icon: DollarSign, change: '+8.2%', bgColor: 'bg-success/8' },
    { label: 'Avg Order Value', value: `$${(data.dailyRevenue / 205).toFixed(2)}`, icon: TrendingUp, change: '+3.1%', bgColor: 'bg-warning/8' },
    { label: 'Active Users', value: '342', icon: Users, change: '+15.4%', bgColor: 'bg-primary/8' },
  ];

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-8">Overview of your canteen operations</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="glass-card p-5">
            <div className="flex items-center justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                <stat.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-xs font-semibold text-success flex items-center gap-0.5 bg-success/8 px-2 py-1 rounded-full">
                <ArrowUpRight className="w-3 h-3" />{stat.change}
              </span>
            </div>
            <p className="text-2xl font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-3 gap-5 mb-8">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="lg:col-span-2 glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Weekly Revenue</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={data.weeklyData}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(239, 84%, 67%)" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Order Status Pie */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Order Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.statusDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="status">
                {data.statusDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap gap-3 mt-2">
            {data.statusDistribution.map((s, i) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {s.status}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Items */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Top Selling Items</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.topItems} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
            <XAxis type="number" stroke="hsl(220, 9%, 46%)" fontSize={12} />
            <YAxis dataKey="name" type="category" stroke="hsl(220, 9%, 46%)" fontSize={12} width={160} />
            <Tooltip contentStyle={{ background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }} />
            <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[0, 8, 8, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
