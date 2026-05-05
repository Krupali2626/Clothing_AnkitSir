import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createSizeGuide, updateSizeGuide } from '../../../redux/slice/sizeGuide.slice';
import { MdAdd, MdDelete, MdClose, MdSave, MdFormatListBulleted } from 'react-icons/md';
import toast from 'react-hot-toast';

const SizeGuideForm = ({ initialValues, onCancel, onSuccess }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [name, setName] = useState(initialValues?.name || '');
    const [tables, setTables] = useState(initialValues?.tables || [
        { title: '', productInfo: 'Product info', columns: ['S', 'M', 'L'], rows: [{ label: 'Chest (cm)', values: ['', '', ''] }] }
    ]);

    const handleAddTable = () => {
        setTables([...tables, { title: '', productInfo: 'Product info', columns: ['S', 'M', 'L'], rows: [{ label: 'Chest (cm)', values: ['', '', ''] }] }]);
    };

    const handleRemoveTable = (index) => {
        const newTables = [...tables];
        newTables.splice(index, 1);
        setTables(newTables);
    };

    const handleTableChange = (index, field, value) => {
        const newTables = [...tables];
        newTables[index][field] = value;
        setTables(newTables);
    };

    const handleAddColumn = (tableIndex) => {
        const newTables = [...tables];
        newTables[tableIndex].columns.push('');
        newTables[tableIndex].rows.forEach(row => row.values.push(''));
        setTables(newTables);
    };

    const handleRemoveColumn = (tableIndex, colIndex) => {
        const newTables = [...tables];
        newTables[tableIndex].columns.splice(colIndex, 1);
        newTables[tableIndex].rows.forEach(row => row.values.splice(colIndex, 1));
        setTables(newTables);
    };

    const handleColumnChange = (tableIndex, colIndex, value) => {
        const newTables = [...tables];
        newTables[tableIndex].columns[colIndex] = value;
        setTables(newTables);
    };

    const handleAddRow = (tableIndex) => {
        const newTables = [...tables];
        const numCols = newTables[tableIndex].columns.length;
        newTables[tableIndex].rows.push({ label: '', values: new Array(numCols).fill('') });
        setTables(newTables);
    };

    const handleRemoveRow = (tableIndex, rowIndex) => {
        const newTables = [...tables];
        newTables[tableIndex].rows.splice(rowIndex, 1);
        setTables(newTables);
    };

    const handleRowLabelChange = (tableIndex, rowIndex, value) => {
        const newTables = [...tables];
        newTables[tableIndex].rows[rowIndex].label = value;
        setTables(newTables);
    };

    const handleRowValueChange = (tableIndex, rowIndex, valIndex, value) => {
        const newTables = [...tables];
        newTables[tableIndex].rows[rowIndex].values[valIndex] = value;
        setTables(newTables);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name) return toast.error('Guide name is required');
        
        setLoading(true);
        try {
            if (initialValues?._id) {
                await dispatch(updateSizeGuide({ id: initialValues._id, data: { name, tables } })).unwrap();
                toast.success('Size guide updated successfully');
            } else {
                await dispatch(createSizeGuide({ name, tables })).unwrap();
                toast.success('Size guide created successfully');
            }
            onSuccess();
        } catch (error) {
            toast.error(error.message || 'Operation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-none border border-border shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-border flex items-center justify-between bg-mainBG/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary text-white flex items-center justify-center">
                        <MdFormatListBulleted size={20} />
                    </div>
                    <div>
                        <h3 className="text-lg font-black text-mainText tracking-tight uppercase">
                            {initialValues ? 'Edit Size Guide' : 'New Size Guide'}
                        </h3>
                        <p className="text-[10px] text-lightText font-bold uppercase tracking-widest">Guide Configuration</p>
                    </div>
                </div>
                <button onClick={onCancel} className="p-2 hover:bg-mainBG transition-colors rounded-none">
                    <MdClose size={24} className="text-lightText" />
                </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-8">
                <div>
                    <label className="block text-[11px] font-black uppercase tracking-widest text-lightText mb-2">Guide Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g., Men's Tops, Women's Shoes"
                        className="w-full px-4 py-3 bg-mainBG border border-border rounded-none outline-none focus:border-primary transition-all font-medium text-sm"
                        required
                    />
                </div>

                <div className="space-y-10">
                    <div className="flex items-center justify-between border-b border-border pb-4">
                        <h4 className="text-sm font-black uppercase tracking-widest text-mainText">Measurement Tables</h4>
                        <button
                            type="button"
                            onClick={handleAddTable}
                            className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:opacity-70 transition-all"
                        >
                            <MdAdd size={18} />
                            Add Table
                        </button>
                    </div>

                    {tables.map((table, tIdx) => (
                        <div key={tIdx} className="p-6 bg-mainBG/30 border border-border relative group">
                            <button
                                type="button"
                                onClick={() => handleRemoveTable(tIdx)}
                                className="absolute top-4 right-4 p-1.5 text-red-500 hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100"
                            >
                                <MdDelete size={18} />
                            </button>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-lightText mb-2">Table Title</label>
                                    <input
                                        type="text"
                                        value={table.title}
                                        onChange={(e) => handleTableChange(tIdx, 'title', e.target.value)}
                                        placeholder="e.g., International Conversion"
                                        className="w-full px-4 py-2 bg-white border border-border rounded-none outline-none focus:border-primary text-sm font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-black uppercase tracking-widest text-lightText mb-2">Primary Info Column Name</label>
                                    <input
                                        type="text"
                                        value={table.productInfo}
                                        onChange={(e) => handleTableChange(tIdx, 'productInfo', e.target.value)}
                                        placeholder="e.g., EU / France"
                                        className="w-full px-4 py-2 bg-white border border-border rounded-none outline-none focus:border-primary text-sm font-medium"
                                    />
                                </div>
                            </div>

                            <div className="overflow-x-auto border border-border bg-white p-4">
                                <table className="w-full min-w-[600px] border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border border-border bg-mainBG/50 w-40"></th>
                                            {table.columns.map((col, cIdx) => (
                                                <th key={cIdx} className="p-2 border border-border bg-mainBG/50 relative group/col">
                                                    <input
                                                        type="text"
                                                        value={col}
                                                        onChange={(e) => handleColumnChange(tIdx, cIdx, e.target.value)}
                                                        className="w-full bg-transparent text-center text-xs font-black uppercase outline-none"
                                                        placeholder="Size"
                                                    />
                                                    {table.columns.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveColumn(tIdx, cIdx)}
                                                            className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/col:opacity-100 transition-all"
                                                        >
                                                            <MdClose size={10} />
                                                        </button>
                                                    )}
                                                </th>
                                            ))}
                                            <th className="p-2 w-10">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddColumn(tIdx)}
                                                    className="w-6 h-6 flex items-center justify-center bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all"
                                                >
                                                    <MdAdd size={16} />
                                                </button>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {table.rows.map((row, rIdx) => (
                                            <tr key={rIdx}>
                                                <td className="p-2 border border-border relative group/row">
                                                    <input
                                                        type="text"
                                                        value={row.label}
                                                        onChange={(e) => handleRowLabelChange(tIdx, rIdx, e.target.value)}
                                                        className="w-full bg-transparent text-xs font-medium outline-none"
                                                        placeholder="Label"
                                                    />
                                                    {table.rows.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveRow(tIdx, rIdx)}
                                                            className="absolute -left-2 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover/row:opacity-100 transition-all"
                                                        >
                                                            <MdClose size={10} />
                                                        </button>
                                                    )}
                                                </td>
                                                {row.values.map((val, vIdx) => (
                                                    <td key={vIdx} className="p-2 border border-border">
                                                        <input
                                                            type="text"
                                                            value={val}
                                                            onChange={(e) => handleRowValueChange(tIdx, rIdx, vIdx, e.target.value)}
                                                            className="w-full bg-transparent text-center text-xs outline-none"
                                                        />
                                                    </td>
                                                ))}
                                                <td></td>
                                            </tr>
                                        ))}
                                        <tr>
                                            <td colSpan={table.columns.length + 2} className="p-2 text-center">
                                                <button
                                                    type="button"
                                                    onClick={() => handleAddRow(tIdx)}
                                                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline"
                                                >
                                                    + Add Row
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-border">
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-8 py-3 text-xs font-black uppercase tracking-widest text-lightText hover:bg-mainBG transition-all border border-border"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-primary text-white px-10 py-3 rounded-none font-black hover:opacity-90 transition-all shadow-xl shadow-primary/20 active:scale-95 uppercase text-xs tracking-widest disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (
                            <>
                                <MdSave size={18} />
                                {initialValues ? 'Update Guide' : 'Save Guide'}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SizeGuideForm;
