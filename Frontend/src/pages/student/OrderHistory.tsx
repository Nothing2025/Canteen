import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockOrders } from '@/data/mockData';
import { Clock, CheckCircle, ChefHat, Package, Copy, QrCode, X } from 'lucide-react';
import { toast } from 'sonner';
import { QRCodeSVG } from 'qrcode.react';
import { Order } from '@/types';

const statusConfig: Record<string, { icon: any; color: string; class: string }> = {
  pending: { icon: Clock, color: 'text-warning', class: 'status-pending' },
  preparing: { icon: ChefHat, color: 'text-primary', class: 'status-preparing' },
  ready: { icon: Package, color: 'text-success', class: 'status-ready' },
  completed: { icon: CheckCircle, color: 'text-muted-foreground', class: 'status-completed' },
};

function buildQrPayload(order: Order) {
  return JSON.stringify({ orderId: order.id, otp: order.otp, total: order.total });
}

export default function OrderHistory() {
  const [qrOrder, setQrOrder] = useState<Order | null>(null);

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl lg:text-3xl font-display font-bold text-foreground mb-1">Orders</h1>
        <p className="text-muted-foreground mb-6">Track your orders and pickup with OTP</p>
      </motion.div>

      <div className="space-y-4">
        {mockOrders.map((order, i) => {
          const cfg = statusConfig[order.status];
          const Icon = cfg.icon;
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass-card p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <p className="font-display font-bold text-foreground">{order.id}</p>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium border capitalize ${cfg.class}`}>
                    <Icon className={`w-3 h-3 inline mr-1 ${cfg.color}`} />
                    {order.status}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>

              <div className="space-y-1 mb-3">
                {order.items.map((item, j) => (
                  <div key={j} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.quantity}x {item.menuItemName}</span>
                    <span className="text-foreground font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-display font-bold text-foreground">${order.total.toFixed(2)}</span>
                  <span className="text-xs text-muted-foreground">{order.paymentMethod}</span>
                </div>
                {order.status !== 'completed' && (
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-muted px-3 py-1.5 rounded-md font-mono font-bold text-foreground tracking-wider">
                      OTP: {order.otp}
                    </span>
                    <button
                      onClick={() => { navigator.clipboard.writeText(order.otp); toast.success('OTP copied!'); }}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setQrOrder(order)}
                      className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <QrCode className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* QR Code Modal */}
      <AnimatePresence>
        {qrOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            onClick={() => setQrOrder(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-border text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-foreground text-lg">Pickup QR Code</h3>
                <button onClick={() => setQrOrder(null)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 inline-block mb-4">
                <QRCodeSVG
                  value={buildQrPayload(qrOrder)}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Order <span className="font-bold text-foreground">{qrOrder.id}</span></p>
              <p className="text-xs text-muted-foreground">Show this QR code to staff for pickup verification</p>
              <div className="mt-3 bg-muted rounded-lg px-4 py-2">
                <span className="text-xs text-muted-foreground">OTP: </span>
                <span className="font-mono font-bold text-foreground tracking-wider">{qrOrder.otp}</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
