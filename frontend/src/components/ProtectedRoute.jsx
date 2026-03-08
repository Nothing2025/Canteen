import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) return <LoadingSpinner />;
    if (!user) return <Navigate to="/login" replace />;
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Redirect to appropriate dashboard by role
        if (user.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
        if (user.role === 'staff') return <Navigate to="/staff/orders" replace />;
        return <Navigate to="/student/menu" replace />;
    }

    return children;
};

export default ProtectedRoute;
