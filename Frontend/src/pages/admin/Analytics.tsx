import { motion } from 'framer-motion';
import { mockAnalytics } from '@/data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const COLORS = ['hsl(239, 84%, 67%)', 'hsl(142, 71%, 45%)', 'hsl(38, 92%, 50%)', 'hsl(220, 9%, 46%)'];

const tooltipStyle = { background: 'hsl(0, 0%, 100%)', border: '1px solid hsl(220, 13%, 91%)', borderRadius: '12px', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' };

export default function AnalyticsPage() {
  const data = mockAnalytics;

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Analytics</h1>
        <p className="text-muted-foreground mb-8">Deep dive into your canteen performance</p>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Revenue Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={data.weeklyData}>
              <defs>
                <linearGradient id="revGrad2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(239, 84%, 67%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Area type="monotone" dataKey="revenue" stroke="hsl(239, 84%, 67%)" strokeWidth={2.5} fill="url(#revGrad2)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Orders Trend */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Daily Orders</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={data.weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="day" stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="orders" stroke="hsl(142, 71%, 45%)" strokeWidth={2.5} dot={{ fill: 'hsl(142, 71%, 45%)', r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Top Items */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Top Selling Items</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data.topItems}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis dataKey="name" stroke="hsl(220, 9%, 46%)" fontSize={10} angle={-15} textAnchor="end" height={60} />
              <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill="hsl(239, 84%, 67%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Status Distribution */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-card p-6">
          <h3 className="font-display font-semibold text-foreground mb-4">Order Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={data.statusDistribution} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="count" nameKey="status" label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                {data.statusDistribution.map((_, i) => (
                  <Cell key={i} fill={COLORS[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-3 mt-2">
            {data.statusDistribution.map((s, i) => (
              <div key={s.status} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                {s.status} ({s.count})
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
