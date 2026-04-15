import { Route, Routes } from 'react-router-dom';
import Layout from '../components/Layout';
import Home from '../pages/Home';
import Auth from '../components/Auth';
import ProductDetails from '../pages/ProductDetails';
import ProtectedRoute from './ProtectedRoute';

const UserRoutes = () => {
    return (
        <Routes>
            {/* Public routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/product" element={<ProductDetails />} />

            {/* Protected user-only routes — add more inside here */}
            <Route element={<ProtectedRoute allowedRole="user" />}>
                {/* e.g. <Route path="/profile" element={<Profile />} /> */}
            </Route>
        </Routes>
    );
};

export default UserRoutes;
