import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    MdSearch, MdFilterList, MdPeople, MdVisibility,
    MdEmail, MdPhone, MdLocationOn, MdRefresh,
    MdCheckCircle, MdCancel, MdBlock, MdVerifiedUser
} from 'react-icons/md';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import axiosInstance from '../../../utils/axiosInstance';
import toast from 'react-hot-toast';
import Pagination from '../../components/Pagination';

// ── Status Badge ──────────────────────────────────────────────────
const StatusBadge = ({ isDeleted, emailVerified }) => {
    if (isDeleted) {
        return (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700">
                <MdBlock size={14} />
                Deleted
            </span>
        );
    }

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            emailVerified ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
        }`}>
            {emailVerified ? <MdVerifiedUser size={14} /> : <MdCancel size={14} />}
            {emailVerified ? 'Verified' : 'Unverified'}
        </span>
    );
};

// ── Main Component ────────────────────────────────────────────────
const CustomerList = () => {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [stats, setStats] = useState({
        total: 0,
        verified: 0,
        unverified: 0,
        deleted: 0,
    });

    const fetchCustomers = async (page = 1) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/user/admin/all?page=${page}&limit=10`);
            const data = response.data?.result;
            setCustomers(data?.users || []);
            setCurrentPage(data?.currentPage || 1);
            setTotalPages(data?.totalPages || 1);
            setTotalCustomers(data?.totalUsers || 0);
            
            // Calculate stats
            const users = data?.users || [];
            setStats({
                total: data?.totalUsers || 0,
                verified: users.filter(u => u.emailVerified).length,
                unverified: users.filter(u => !u.emailVerified).length,
                deleted: users.filter(u => u.isUserDeleted).length,
            });
        } catch (error) {
            console.error('Error fetching customers:', error);
            toast.error('Failed to fetch customers');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers(currentPage);
    }, [currentPage]);

    const handleRefresh = () => {
        fetchCustomers(currentPage);
        toast.success('Customers refreshed');
    };

    const filteredCustomers = customers.filter(customer => {
        const searchLower = searchTerm.toLowerCase();
        return (
            customer.firstName?.toLowerCase().includes(searchLower) ||
            customer.lastName?.toLowerCase().includes(searchLower) ||
            customer.email?.toLowerCase().includes(searchLower) ||
            customer.phone?.toLowerCase().includes(searchLower)
        );
    });

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Customers</h2>
                    <p className="text-slate-500 text-sm">Manage and view all registered customers</p>
                </div>
                <button
                    onClick={handleRefresh}
                    className="flex items-center justify-center gap-2 bg-black text-white px-6 py-3 rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-black/10 active:scale-95"
                >
                    <MdRefresh size={20} />
                    Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1">Total</p>
                    <p className="text-2xl font-black text-slate-900">{stats.total}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                    <p className="text-green-700 text-xs font-bold uppercase tracking-wide mb-1">Verified</p>
                    <p className="text-2xl font-black text-green-700">{stats.verified}</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-2xl border border-yellow-200">
                    <p className="text-yellow-700 text-xs font-bold uppercase tracking-wide mb-1">Unverified</p>
                    <p className="text-2xl font-black text-yellow-700">{stats.unverified}</p>
                </div>
                <div className="bg-red-50 p-4 rounded-2xl border border-red-200">
                    <p className="text-red-700 text-xs font-bold uppercase tracking-wide mb-1">Deleted</p>
                    <p className="text-2xl font-black text-red-700">{stats.deleted}</p>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-3xl border border-slate-200 flex gap-4 items-center shadow-sm">
                <div className="relative flex-1">
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all text-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button className="flex items-center gap-2 px-6 py-2.5 text-slate-600 hover:bg-black hover:text-white rounded-2xl transition-all text-sm border border-slate-100 font-semibold group">
                    <MdFilterList size={16} className="group-hover:rotate-180 transition-transform duration-500" />
                    Filters
                </button>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin" />
                        <span className="text-slate-400">Loading customers...</span>
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <MdPeople size={64} className="mx-auto mb-4 opacity-20" />
                        <p>No customers found</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Customer</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Contact</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Joined</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Addresses</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-bold text-slate-600 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {filteredCustomers.map((customer) => (
                                        <tr key={customer._id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-sm">
                                                        {customer.firstName?.charAt(0)}{customer.lastName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-slate-900">
                                                            {customer.firstName} {customer.lastName}
                                                        </p>
                                                        <p className="text-xs text-slate-500">ID: {customer._id.slice(-6)}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="space-y-1">
                                                    <div className="flex items-center gap-2 text-xs text-slate-600">
                                                        <MdEmail size={14} className="text-slate-400" />
                                                        {customer.email}
                                                    </div>
                                                    {customer.phone && (
                                                        <div className="flex items-center gap-2 text-xs text-slate-600">
                                                            <MdPhone size={14} className="text-slate-400" />
                                                            {customer.phone}
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="text-xs text-slate-600">{formatDate(customer.createdAt)}</span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center gap-1.5 text-xs text-slate-600">
                                                    <MdLocationOn size={14} className="text-slate-400" />
                                                    <span className="font-semibold">{customer.address?.length || 0}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <StatusBadge 
                                                    isDeleted={customer.isUserDeleted} 
                                                    emailVerified={customer.emailVerified} 
                                                />
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <button
                                                    onClick={() => navigate(`/admin/customer/view/${customer._id}`)}
                                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <MdVisibility size={18} className="text-slate-600" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            totalItems={totalCustomers}
                            itemsPerPage={10}
                            onPageChange={setCurrentPage}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default CustomerList;
