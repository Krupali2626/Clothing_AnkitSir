import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Auth from '../components/Auth';
import ProductDetails from '../pages/ProductDetails';
import Support from '../pages/Support';
import SupportDetail from '../pages/SupportDetail';
import ProtectedRoute from './ProtectedRoute';
import Profile from '../pages/account/Profile';
import Orders from '../pages/account/Orders';
import OrderDetail from '../pages/account/OrderDetail';
import Address from '../pages/account/Address';
import PaymentsCard from '../pages/account/PaymentsCard';

const UserRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product" element={<ProductDetails />} />
            <Route path="/support" element={<Layout><Support /></Layout>} />
            <Route path="/support/:id" element={<Layout><SupportDetail /></Layout>} />

            {/* Protected user-only routes */}
            <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Layout><Profile /></Layout>} />
                <Route path="/orders" element={<Layout><Orders /></Layout>} />
                <Route path="/orders/:id" element={<Layout><OrderDetail /></Layout>} />
                <Route path="/addresses" element={<Layout><Address /></Layout>} />
                <Route path="/payments" element={<Layout><PaymentsCard /></Layout>} />
            </Route>
        </Routes>
    );
};

export default UserRoutes;
