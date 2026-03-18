import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { CartProvider } from "@/context/CartContext";
import AppLayout from "@/components/layout/AppLayout";

import Login from "@/pages/Login";
import Register from "@/pages/Register";
import StudentDashboard from "@/pages/student/Dashboard";
import MenuPage from "@/pages/student/Menu";
import CartPage from "@/pages/student/Cart";
import FavoritesPage from "@/pages/student/Favorites";
import OrderHistory from "@/pages/student/OrderHistory";
import ProfilePage from "@/pages/student/Profile";
import AdminDashboard from "@/pages/admin/Dashboard";
import MenuManagement from "@/pages/admin/MenuManagement";
import OrderManagement from "@/pages/admin/OrderManagement";
import AnalyticsPage from "@/pages/admin/Analytics";
import StaffDashboard from "@/pages/staff/Dashboard";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles?: string[] }) {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/login" replace />;
  return <AppLayout>{children}</AppLayout>;
}

function AppRoutes() {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to={user?.role === 'admin' ? '/admin' : user?.role === 'staff' ? '/staff' : '/dashboard'} replace /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Student */}
      <Route path="/dashboard" element={<ProtectedRoute roles={['student']}><StudentDashboard /></ProtectedRoute>} />
      <Route path="/menu" element={<ProtectedRoute roles={['student']}><MenuPage /></ProtectedRoute>} />
      <Route path="/cart" element={<ProtectedRoute roles={['student']}><CartPage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute roles={['student']}><FavoritesPage /></ProtectedRoute>} />
      <Route path="/orders" element={<ProtectedRoute roles={['student']}><OrderHistory /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute roles={['student']}><ProfilePage /></ProtectedRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/menu" element={<ProtectedRoute roles={['admin']}><MenuManagement /></ProtectedRoute>} />
      <Route path="/admin/orders" element={<ProtectedRoute roles={['admin']}><OrderManagement /></ProtectedRoute>} />
      <Route path="/admin/analytics" element={<ProtectedRoute roles={['admin']}><AnalyticsPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute roles={['admin']}><div className="p-8"><h1 className="text-2xl font-display font-bold text-foreground">User Management</h1><p className="text-muted-foreground mt-2">Coming soon</p></div></ProtectedRoute>} />

      {/* Staff */}
      <Route path="/staff" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />
      <Route path="/staff/orders" element={<ProtectedRoute roles={['staff']}><StaffDashboard /></ProtectedRoute>} />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <CartProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
