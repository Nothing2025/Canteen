import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleLayout from './components/RoleLayout';

// Auth pages
import Login from './pages/Login';
import Register from './pages/Register';

// Student pages
import Menu from './pages/student/Menu';
import Cart from './pages/student/Cart';
import OrderHistory from './pages/student/OrderHistory';

// Admin pages
import Dashboard from './pages/admin/Dashboard';
import MenuManagement from './pages/admin/MenuManagement';
import Settings from './pages/admin/Settings';

// Staff pages
import OrdersQueue from './pages/staff/OrdersQueue';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1f2937',
              color: '#f3f4f6',
              border: '1px solid #374151',
              borderRadius: '10px',
            },
            success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute allowedRoles={['student']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="menu" replace />} />
            <Route path="menu" element={<Menu />} />
            <Route path="cart" element={<Cart />} />
            <Route path="orders" element={<OrderHistory />} />
          </Route>

          {/* Admin routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="menu" element={<MenuManagement />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Staff routes */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={['staff', 'admin']}>
                <RoleLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<OrdersQueue />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
