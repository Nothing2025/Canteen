import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { NavLink, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard, UtensilsCrossed, ShoppingCart, Heart, ClipboardList,
  User, BarChart3, Users, ChefHat, LogOut, Package, Settings,
  Menu as MenuIcon, X
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const studentLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/menu', icon: UtensilsCrossed, label: 'Menu' },
  { to: '/cart', icon: ShoppingCart, label: 'Cart' },
  { to: '/favorites', icon: Heart, label: 'Favorites' },
  { to: '/orders', icon: ClipboardList, label: 'Orders' },
  { to: '/profile', icon: User, label: 'Profile' },
];

const adminLinks = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/admin/menu', icon: UtensilsCrossed, label: 'Menu Mgmt' },
  { to: '/admin/orders', icon: Package, label: 'Orders' },
  { to: '/admin/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/admin/users', icon: Users, label: 'Users' },
];

const staffLinks = [
  { to: '/staff', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/staff/orders', icon: Package, label: 'Orders' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { itemCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const links = user?.role === 'admin' ? adminLinks : user?.role === 'staff' ? staffLinks : studentLinks;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-sidebar fixed inset-y-0 left-0 z-40">
        <div className="p-5 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
              <ChefHat className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-base text-sidebar-foreground tracking-tight">SmartCanteen</h1>
              <p className="text-xs text-sidebar-muted capitalize">{user?.role} Portal</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5 mt-2">
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/staff'}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200',
                  isActive
                    ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-glow'
                    : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                )
              }
            >
              <link.icon className="w-[18px] h-[18px]" />
              <span>{link.label}</span>
              {link.label === 'Cart' && itemCount > 0 && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                  {itemCount}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-sidebar-border">
          <div className="flex items-center gap-3 px-3.5 py-2.5 mb-1">
            <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground text-xs font-bold shadow-glow">
              {user?.name?.[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">{user?.name}</p>
              <p className="text-[11px] text-sidebar-muted truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-sidebar-muted hover:text-destructive hover:bg-sidebar-accent transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-14 bg-card/95 backdrop-blur-lg border-b border-border z-40 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button onClick={() => setMobileOpen(true)} className="p-2 rounded-lg hover:bg-muted transition-colors">
            <MenuIcon className="w-5 h-5 text-foreground" />
          </button>
          <span className="font-display font-bold text-foreground tracking-tight">SmartCanteen</span>
        </div>
        {user?.role === 'student' && (
          <NavLink to="/cart" className="relative p-2">
            <ShoppingCart className="w-5 h-5 text-foreground" />
            {itemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-primary text-primary-foreground text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </NavLink>
        )}
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-foreground/40 backdrop-blur-sm z-50"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed inset-y-0 left-0 w-[280px] bg-sidebar text-sidebar-foreground z-50 flex flex-col"
            >
              <div className="p-4 flex justify-between items-center border-b border-sidebar-border">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center shadow-glow">
                    <ChefHat className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-display font-bold text-sidebar-foreground tracking-tight">SmartCanteen</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-2 rounded-lg hover:bg-sidebar-accent transition-colors">
                  <X className="w-5 h-5 text-sidebar-foreground" />
                </button>
              </div>
              <nav className="flex-1 p-3 space-y-0.5 mt-1">
                {links.map(link => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    end={link.to === '/dashboard' || link.to === '/admin' || link.to === '/staff'}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all',
                        isActive
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                          : 'text-sidebar-muted hover:text-sidebar-foreground hover:bg-sidebar-accent'
                      )
                    }
                  >
                    <link.icon className="w-[18px] h-[18px]" />
                    <span>{link.label}</span>
                  </NavLink>
                ))}
              </nav>
              <div className="p-3 border-t border-sidebar-border">
                <button onClick={() => { logout(); setMobileOpen(false); }} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-sidebar-muted hover:text-destructive w-full transition-colors">
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 lg:ml-[260px] min-h-screen">
        <div className="pt-14 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
