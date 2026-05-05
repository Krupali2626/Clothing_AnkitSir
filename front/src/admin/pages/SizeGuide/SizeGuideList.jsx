import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchSizeGuides,
    deleteSizeGuide
} from '../../../redux/slice/sizeGuide.slice';
import {
    MdAdd,
    MdEdit,
    MdDelete,
    MdSearch,
    MdRefresh,
    MdStraighten
} from 'react-icons/md';
import SizeGuideForm from './SizeGuideForm';
import Pagination from '../../components/Pagination';

const SizeGuideList = () => {
    const dispatch = useDispatch();
    const { sizeGuides = [], loading } = useSelector((state) => state.sizeGuide || {});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingSizeGuide, setEditingSizeGuide] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchSizeGuides());
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this size guide?')) {
            dispatch(deleteSizeGuide(id));
        }
    };

    const filteredGuides = sizeGuides.filter(guide =>
        guide.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalItems = filteredGuides.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedGuides = filteredGuides.slice(startIndex, endIndex);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-black text-mainText tracking-tight">Size Guides</h2>
                    <p className="text-lightText text-sm font-medium">Create and manage size guides for categories and products.</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => dispatch(fetchSizeGuides())}
                        className="flex items-center gap-2.5 bg-white text-mainText px-6 py-2.5 rounded-none font-bold hover:shadow-lg hover:shadow-black/5 transition-all border border-slate-200 active:scale-95 shadow-sm"
                    >
                        <MdRefresh size={20} className={loading ? 'animate-spin' : ''} />
                        <span className="text-[14px]">Refresh</span>
                    </button>
                    <button
                        onClick={() => {
                            setEditingSizeGuide(null);
                            setIsModalOpen(true);
                        }}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-none font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase text-xs tracking-widest"
                    >
                        <MdAdd size={20} />
                        Add Guide
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-background p-4 rounded-none border border-border flex flex-col md:flex-row gap-4 items-center shadow-sm">
                    <div className="relative flex-1 w-full">
                        <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-lightText" size={18} />
                        <input
                            type="text"
                            placeholder="Search by guide name..."
                            className="w-full pl-12 pr-4 py-3 bg-mainBG border border-border rounded-none outline-none focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm text-mainText font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                <div className="bg-primary p-6 rounded-none border border-primary/10 flex items-center justify-between shadow-xl shadow-primary/20 group overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-white/50 text-[10px] font-black uppercase tracking-[0.2em]">Total</p>
                        <p className="text-3xl font-black text-white leading-tight">{sizeGuides.length}</p>
                    </div>
                    <div className="w-14 h-14 bg-white/10 rounded-none flex items-center justify-center backdrop-blur-md relative z-10 border border-white/10">
                        <MdStraighten className="text-white" size={28} />
                    </div>
                </div>
            </div>

            <div className="bg-background rounded-none border border-border overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-mainBG/50 border-b border-border">
                                <th className="px-8 py-5 text-[10px] font-black text-lightText uppercase tracking-[0.2em]">Name</th>
                                <th className="px-8 py-5 text-[10px] font-black text-lightText uppercase tracking-[0.2em]">Tables Count</th>
                                <th className="px-8 py-5 text-[10px] font-black text-lightText uppercase tracking-[0.2em]">Created At</th>
                                <th className="px-8 py-5 text-[10px] font-black text-lightText uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/50">
                            {loading && sizeGuides.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-none animate-spin"></div>
                                            <span className="text-[11px] font-black uppercase tracking-widest text-lightText opacity-50">Loading...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredGuides.length === 0 ? (
                                <tr>
                                    <td colSpan="4" className="px-8 py-20 text-center font-black uppercase tracking-widest text-xs text-lightText opacity-50">
                                        No size guides found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedGuides.map((guide) => (
                                    <tr key={guide._id} className="hover:bg-mainBG/30 transition-colors group">
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="text-sm font-black text-mainText tracking-tight">{guide.name}</span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap">
                                            <span className="px-3 py-1 bg-primary/5 text-primary rounded-none text-[10px] font-black uppercase tracking-widest border border-primary/10">
                                                {guide.tables?.length || 0} Tables
                                            </span>
                                        </td>
                                        <td className="px-8 py-5 whitespace-nowrap text-xs text-lightText">
                                            {new Date(guide.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-8 py-5 text-right whitespace-nowrap">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingSizeGuide(guide);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2.5 text-primary hover:bg-primary hover:text-white rounded-none transition-all duration-300 shadow-sm border border-border"
                                                >
                                                    <MdEdit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(guide._id)}
                                                    className="p-2.5 text-red-500 hover:bg-red-500 hover:text-white rounded-none transition-all duration-300 shadow-sm border border-border"
                                                >
                                                    <MdDelete size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-[60] flex justify-center items-start p-4 md:p-8 overflow-y-auto">
                    <div className="fixed inset-0 bg-primary/20 backdrop-blur-md z-0" onClick={() => setIsModalOpen(false)}></div>
                    <div className="relative z-10 w-full flex justify-center py-4 md:py-10">
                        <div className="animate-in zoom-in-95 duration-300 w-full max-w-4xl">
                            <SizeGuideForm
                                initialValues={editingSizeGuide}
                                onCancel={() => {
                                    setIsModalOpen(false);
                                    setEditingSizeGuide(null);
                                }}
                                onSuccess={() => {
                                    setIsModalOpen(false);
                                    setEditingSizeGuide(null);
                                }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SizeGuideList;
