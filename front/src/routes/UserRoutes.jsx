import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Auth from '../components/Auth';
import ProductDetails from '../pages/ProductDetails';
import ProtectedRoute from './ProtectedRoute';
import Profile from '../pages/account/Profile';
import Orders from '../pages/account/Orders';
import OrderDetail from '../pages/account/OrderDetail';
import Address from '../pages/account/Address';

const UserRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product" element={<ProductDetails />} />

            {/* Protected user-only routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/orders" element={<Layout><Orders /></Layout>} />
                <Route path="/orders/:id" element={<Layout><OrderDetail /></Layout>} />
                <Route path="/addresses" element={<Layout><Address /></Layout>} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
