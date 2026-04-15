import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

/**
 * ProtectedRoute
 * @param {string} allowedRole - 'user' | 'admin' (optional, if omitted just checks auth)
 * @param {string} redirectTo  - where to redirect if access is denied
 */
const ProtectedRoute = ({ allowedRole, redirectTo = '/auth' }) => {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (!isAuthenticated) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRole && user?.role !== allowedRole) {
        // Authenticated but wrong role → send to home
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
