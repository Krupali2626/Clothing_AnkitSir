import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLowStockAlerts, bulkUpdateStock } from '../../../redux/slice/inventory.slice';
import toast from 'react-hot-toast';
import { MdWarning, MdSave, MdRefresh } from 'react-icons/md';

export default function InventoryList() {
    const dispatch = useDispatch();
    const { lowStockAlerts, loading, updateLoading } = useSelector(state => state.inventory);
    
    const [threshold, setThreshold] = useState(10);
    const [stockUpdates, setStockUpdates] = useState({});

    useEffect(() => {
        dispatch(fetchLowStockAlerts(threshold));
    }, [dispatch, threshold]);

    const handleStockChange = (key, value) => {
        setStockUpdates(prev => ({
            ...prev,
            [key]: parseInt(value) || 0
        }));
    };

    const handleSaveUpdates = async () => {
        const updatesArray = Object.keys(stockUpdates).map(key => {
            const [variantId, size] = key.split('_');
            return {
                variantId,
                size,
                newStock: stockUpdates[key]
            };
        });

        if (updatesArray.length === 0) {
            toast.error('No stock changes made');
            return;
        }

        try {
            await dispatch(bulkUpdateStock(updatesArray)).unwrap();
            toast.success('Stock updated successfully');
            setStockUpdates({});
            dispatch(fetchLowStockAlerts(threshold));
        } catch (error) {
            toast.error(error || 'Failed to update stock');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-border pb-6">
                <div>
                    <h1 className="text-2xl font-bold text-dark">Inventory Management</h1>
                    <p className="text-sm text-lightText mt-1">Monitor low stock alerts and bulk update inventory</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-dark uppercase tracking-wider">Alert Threshold:</label>
                        <select 
                            value={threshold}
                            onChange={(e) => setThreshold(Number(e.target.value))}
                            className="border border-border bg-white text-sm px-3 py-1.5 focus:outline-none focus:border-primary"
                        >
                            <option value="5">Under 5</option>
                            <option value="10">Under 10</option>
                            <option value="20">Under 20</option>
                            <option value="50">Under 50</option>
                        </select>
                    </div>
                    <button 
                        onClick={() => dispatch(fetchLowStockAlerts(threshold))}
                        className="p-2 text-lightText hover:text-primary transition-colors bg-white border border-border"
                        title="Refresh"
                    >
                        <MdRefresh size={20} />
                    </button>
                    <button 
                        onClick={handleSaveUpdates}
                        disabled={updateLoading || Object.keys(stockUpdates).length === 0}
                        className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm font-bold uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
                    >
                        <MdSave size={16} />
                        {updateLoading ? 'Saving...' : 'Save Updates'}
                    </button>
                </div>
            </div>

            <div className="bg-white border border-border shadow-sm">
                <div className="p-4 border-b border-border bg-red-50/50 flex items-center gap-3">
                    <MdWarning className="text-red-500 text-xl" />
                    <h2 className="text-sm font-bold text-red-700 uppercase tracking-widest">
                        {loading ? 'Checking Stock...' : `${lowStockAlerts?.length || 0} Items Require Attention`}
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-mainBG border-b border-border">
                            <tr>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs">Product</th>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs">Color</th>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs">Size</th>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs">SKU</th>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs">Current Stock</th>
                                <th className="px-6 py-4 font-bold text-dark uppercase tracking-wider text-xs text-right">Update Stock To</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-8 text-center text-lightText">Loading inventory data...</td>
                                </tr>
                            ) : lowStockAlerts?.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center">
                                        <p className="text-lg font-medium text-dark mb-1">Stock levels are healthy</p>
                                        <p className="text-lightText">No products are below the {threshold} unit threshold.</p>
                                    </td>
                                </tr>
                            ) : (
                                lowStockAlerts?.map((item, idx) => {
                                    const key = `${item.variantId}_${item.size}`;
                                    const isUpdated = stockUpdates[key] !== undefined;
                                    
                                    return (
                                        <tr key={idx} className="hover:bg-mainBG/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-dark truncate max-w-[200px]">
                                                {item.productName}
                                            </td>
                                            <td className="px-6 py-4 text-lightText capitalize">
                                                {item.color}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-dark">
                                                {item.size}
                                            </td>
                                            <td className="px-6 py-4 text-xs font-mono text-lightText">
                                                {item.sku}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${item.stock === 0 ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'}`}>
                                                    {item.stock} in stock
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <input 
                                                    type="number" 
                                                    min="0"
                                                    value={isUpdated ? stockUpdates[key] : item.stock}
                                                    onChange={(e) => handleStockChange(key, e.target.value)}
                                                    className={`w-24 border px-3 py-1.5 text-right text-sm focus:outline-none focus:border-primary ${isUpdated ? 'border-primary bg-primary/5 text-primary font-bold' : 'border-border bg-white'}`}
                                                />
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
