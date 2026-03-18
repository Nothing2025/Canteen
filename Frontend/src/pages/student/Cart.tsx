import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, CreditCard, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, total } = useCart();
  const [placing, setPlacing] = useState(false);
  const [confirmation, setConfirmation] = useState<{ orderId: string; otp: string } | null>(null);

  const generateOtp = () => String(Math.floor(1000 + Math.random() * 9000));
  const generateOrderId = () => `ORD-${String(Date.now()).slice(-3)}`;

  const handlePlaceOrder = () => {
    setPlacing(true);
    const otp = generateOtp();
    const orderId = generateOrderId();
    setTimeout(() => {
      setConfirmation({ orderId, otp });
      toast.success(`Order placed! OTP: ${otp}`);
      clearCart();
      setPlacing(false);
    }, 1500);
  };

  if (items.length === 0) {
    return (
      <div className="p-6 lg:p-8 max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <ShoppingBag className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h2 className="text-xl font-display font-bold text-foreground mb-2">Your cart is empty</h2>
          <p className="text-muted-foreground mb-6">Browse the menu and add some delicious items!</p>
          <Link to="/menu">
            <Button className="gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
              Browse Menu
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/menu" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 mb-4">
          <ArrowLeft className="w-4 h-4" /> Back to menu
        </Link>
        <h1 className="text-2xl font-display font-bold text-foreground mb-6">Your Cart</h1>
      </motion.div>

      <div className="space-y-3 mb-6">
        {items.map((item, i) => (
          <motion.div
            key={item.menuItem.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass-card p-4 flex gap-4"
          >
            <img src={item.menuItem.image} alt={item.menuItem.name} className="w-20 h-20 rounded-lg object-cover" />
            <div className="flex-1 min-w-0">
              <h3 className="font-display font-semibold text-foreground truncate">{item.menuItem.name}</h3>
              <p className="text-primary font-bold text-sm">${item.menuItem.price.toFixed(2)}</p>
              <div className="flex items-center gap-3 mt-2">
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity - 1)}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Minus className="w-3 h-3 text-foreground" />
                </button>
                <span className="text-sm font-semibold text-foreground w-6 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.menuItem.id, item.quantity + 1)}
                  className="w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <Plus className="w-3 h-3 text-foreground" />
                </button>
                <button onClick={() => removeItem(item.menuItem.id)} className="ml-auto text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            <p className="font-display font-bold text-foreground">${(item.menuItem.price * item.quantity).toFixed(2)}</p>
          </motion.div>
        ))}
      </div>

      {/* Summary */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-card p-6">
        <h3 className="font-display font-semibold text-foreground mb-4">Order Summary</h3>
        <div className="space-y-2 mb-4 text-sm">
          <div className="flex justify-between text-muted-foreground">
            <span>Subtotal</span><span>${total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-muted-foreground">
            <span>Service fee</span><span>$0.50</span>
          </div>
          <div className="border-t border-border pt-2 flex justify-between font-display font-bold text-foreground text-base">
            <span>Total</span><span>${(total + 0.50).toFixed(2)}</span>
          </div>
        </div>
        <Button
          className="w-full gradient-primary text-primary-foreground font-semibold h-12 shadow-glow hover:opacity-90 transition-opacity"
          onClick={handlePlaceOrder}
          disabled={placing}
        >
          <CreditCard className="w-4 h-4 mr-2" />
          {placing ? 'Placing Order...' : `Place Order · $${(total + 0.50).toFixed(2)}`}
        </Button>
      </motion.div>

      {/* Order Confirmation with QR */}
      <AnimatePresence>
        {confirmation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/50 z-50 flex items-center justify-center p-4"
            onClick={() => setConfirmation(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl p-6 max-w-sm w-full shadow-xl border border-border text-center"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-foreground text-lg">Order Confirmed! 🎉</h3>
                <button onClick={() => setConfirmation(null)} className="p-1 rounded-md hover:bg-muted text-muted-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="bg-white rounded-xl p-6 inline-block mb-4">
                <QRCodeSVG
                  value={JSON.stringify({ orderId: confirmation.orderId, otp: confirmation.otp })}
                  size={200}
                  level="H"
                  includeMargin={false}
                />
              </div>
              <p className="text-sm text-muted-foreground mb-1">Order <span className="font-bold text-foreground">{confirmation.orderId}</span></p>
              <p className="text-xs text-muted-foreground mb-3">Show this QR code or OTP to staff at pickup</p>
              <div className="bg-muted rounded-lg px-4 py-2 mb-4">
                <span className="text-xs text-muted-foreground">OTP: </span>
                <span className="font-mono font-bold text-foreground text-lg tracking-wider">{confirmation.otp}</span>
              </div>
              <Link to="/orders">
                <Button className="w-full gradient-primary text-primary-foreground shadow-glow hover:opacity-90">
                  View Orders
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
