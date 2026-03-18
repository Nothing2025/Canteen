import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockOrders } from '@/data/mockData';
import { Order, OrderStatus } from '@/types';
import { Clock, ChefHat, Package, CheckCircle, KeyRound, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import QrScanner from '@/components/QrScanner';

const statusConfig: Record<string, { icon: any; class: string; next?: OrderStatus }> = {
  pending: { icon: Clock, class: 'status-pending', next: 'preparing' },
  preparing: { icon: ChefHat, class: 'status-preparing', next: 'ready' },
  ready: { icon: Package, class: 'status-ready', next: 'completed' },
  completed: { icon: CheckCircle, class: 'status-completed' },
};

export default function StaffDashboard() {
  const [orders, setOrders] = useState<Order[]>(mockOrders.filter(o => o.status !== 'completed'));
  const [verifyOrder, setVerifyOrder] = useState<Order | null>(null);
  const [otpInput, setOtpInput] = useState('');

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === 'completed') {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setVerifyOrder(order);
        return;
      }
    }
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
    toast.success(`Order ${orderId} → ${newStatus}`);
  };

  const verifyAndComplete = (otp?: string) => {
    if (!verifyOrder) return;
    const code = otp || otpInput;
    if (code === verifyOrder.otp) {
      setOrders(prev => prev.filter(o => o.id !== verifyOrder.id));
      toast.success(`Order ${verifyOrder.id} verified & completed!`);
      setVerifyOrder(null);
      setOtpInput('');
    } else {
      toast.error('Invalid OTP. Please try again.');
    }
  };

  const handleQrScan = (data: string) => {
    try {
      const parsed = JSON.parse(data);
      if (parsed.otp && verifyOrder) {
        verifyAndComplete(parsed.otp);
      } else if (parsed.orderId) {
        // Find and auto-select the order if scanned from main screen
        const order = orders.find(o => o.id === parsed.orderId);
        if (order) {
          setVerifyOrder(order);
          if (parsed.otp) {
            setTimeout(() => verifyAndComplete(parsed.otp), 100);
          }
        } else {
          toast.error('Order not found');
        }
      }
    } catch {
      toast.error('Invalid QR code format');
    }
  };

  const activeCount = (status: string) => orders.filter(o => o.status === status).length;

  return (
    <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Staff Dashboard</h1>
        <p className="text-muted-foreground mb-6">Manage incoming orders and verify pickups</p>
      </motion.div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Pending', count: activeCount('pending'), class: 'status-pending', icon: Clock },
          { label: 'Preparing', count: activeCount('preparing'), class: 'status-preparing', icon: ChefHat },
          { label: 'Ready', count: activeCount('ready'), class: 'status-ready', icon: Package },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-card p-4 text-center">
            <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-display font-bold text-foreground">{s.count}</p>
            <p className="text-xs text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Orders */}
      <div className="space-y-3">
        {orders.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            <p className="font-display font-bold text-foreground text-lg">All caught up!</p>
            <p className="text-muted-foreground text-sm">No pending orders right now</p>
          </div>
        ) : (
          orders.map((order, i) => {
            const cfg = statusConfig[order.status];
            const Icon = cfg.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card p-5"
              >
                <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
                  <div className="flex items-center gap-3">
                    <p className="font-display font-bold text-foreground text-lg">{order.id}</p>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${cfg.class}`}>
                      <Icon className="w-3 h-3 inline mr-1" />{order.status}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground font-mono">{new Date(order.createdAt).toLocaleTimeString()}</span>
                </div>

                <div className="space-y-1.5 mb-4">
                  {order.items.map((item, j) => (
                    <div key={j} className="flex justify-between text-sm">
                      <span className="text-foreground font-medium">{item.quantity}x {item.menuItemName}</span>
                      <span className="text-muted-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-border pt-3">
                  <span className="font-display font-bold text-foreground">${order.total.toFixed(2)}</span>
                  {cfg.next && (
                    <Button onClick={() => updateStatus(order.id, cfg.next!)} className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                      {cfg.next === 'completed' ? (
                        <><KeyRound className="w-4 h-4 mr-2" /> Verify & Complete</>
                      ) : (
                        <>Mark as {cfg.next}</>
                      )}
                    </Button>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Verification Dialog */}
      <Dialog open={!!verifyOrder} onOpenChange={o => { if (!o) { setVerifyOrder(null); setOtpInput(''); } }}>
        <DialogContent className="bg-card border-border max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-foreground">Verify Pickup - {verifyOrder?.id}</DialogTitle>
            <DialogDescription className="text-muted-foreground">Enter OTP or scan the customer's QR code to complete the order.</DialogDescription>
          </DialogHeader>
          <Tabs defaultValue="otp" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="otp"><KeyRound className="w-3.5 h-3.5 mr-1.5" />OTP</TabsTrigger>
              <TabsTrigger value="qr"><QrCode className="w-3.5 h-3.5 mr-1.5" />Scan QR</TabsTrigger>
            </TabsList>
            <TabsContent value="otp" className="space-y-3 pt-2">
              <Input
                placeholder="Enter OTP"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                className="text-center text-lg font-mono tracking-[0.3em]"
                maxLength={4}
              />
              <Button onClick={() => verifyAndComplete()} className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                <KeyRound className="w-4 h-4 mr-2" /> Verify OTP
              </Button>
            </TabsContent>
            <TabsContent value="qr" className="pt-2">
              <QrScanner onScan={handleQrScan} onError={(msg) => toast.error(msg)} />
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </div>
  );
}
