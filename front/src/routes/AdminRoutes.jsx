import { Route, Routes } from 'react-router-dom';
import AdminLayout from '../admin/layouts/AdminLayout';
import MainCategoryList from '../admin/pages/MainCategory/CategoryList';
import CategoryList from '../admin/pages/Category/CategoryList';
import SubCategoryList from '../admin/pages/SubCategory/SubCategoryList';
import InsideSubCategoryList from '../admin/pages/InsideSubCategory/InsideSubCategoryList';
import ProtectedRoute from './ProtectedRoute';

const AdminRoutes = () => {
    return (
        <Routes>
            {/* All admin routes are protected — must be authenticated with role "admin" */}
            <Route element={<ProtectedRoute allowedRole="admin" redirectTo="/auth" />}>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<div className="p-6">Admin Dashboard</div>} />
                    <Route path="main-category" element={<MainCategoryList />} />
                    <Route path="category" element={<CategoryList />} />
                    <Route path="sub-category" element={<SubCategoryList />} />
                    <Route path="inside-sub-category" element={<InsideSubCategoryList />} />
                </Route>
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
