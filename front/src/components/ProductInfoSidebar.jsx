import React, { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';

const ProductInfoSidebar = ({ isOpen, onClose, initialTab = 'Product Details', product }) => {
    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        if (isOpen) {
            setActiveTab(initialTab);
        }
    }, [isOpen, initialTab]);

    const tabs = ['Product Details', 'Size Guide', 'Delivery & Returns'];

    const renderContent = () => {
        switch (activeTab) {
            case 'Product Details':
                const productDescription = product?.productDetails?.description || "No description available.";
                const productPoints = product?.productDetails?.points || [];

                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <p className="text-[15px] leading-relaxed text-dark">
                            {productDescription}
                        </p>
                        {productPoints.length > 0 && (
                            <ul className="space-y-3">
                                {productPoints.map((item, index) => (
                                    <li key={index} className="flex items-start gap-3 text-[15px] text-dark">
                                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-dark shrink-0" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <div className="pt-4 space-y-4">
                            {product?.material && (
                                <div className="text-[14px]">
                                    <span className="font-bold uppercase tracking-widest text-[11px] block mb-1">Material</span>
                                    <span className="text-dark/70">{product.material}</span>
                                </div>
                            )}
                            {product?.careInstructions && (
                                <div className="text-[14px]">
                                    <span className="font-bold uppercase tracking-widest text-[11px] block mb-1">Care Instructions</span>
                                    <span className="text-dark/70">{product.careInstructions}</span>
                                </div>
                            )}
                            {product?.countryOfOrigin && (
                                <div className="text-[14px]">
                                    <span className="font-bold uppercase tracking-widest text-[11px] block mb-1">Country of Origin</span>
                                    <span className="text-dark/70">{product.countryOfOrigin}</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            case 'Size Guide':
                const sizeGuide = product?.sizeGuide;

                if (!sizeGuide || !sizeGuide.tables || sizeGuide.tables.length === 0) {
                    return (
                        <div className="flex flex-col items-center justify-center py-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <span className="text-2xl text-gray-300">?</span>
                            </div>
                            <h3 className="text-lg font-bold text-dark mb-2">No Size Guide Available</h3>
                            <p className="text-sm text-gray-400 max-w-xs">A size guide has not been assigned to this product yet.</p>
                        </div>
                    );
                }

                return (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
                        {sizeGuide.tables.map((table, tableIdx) => (
                            <div key={tableIdx}>
                                <h3 className="text-[18px] font-bold uppercase tracking-[0.1em] text-dark mb-6">{table.title}</h3>
                                <div className="overflow-x-auto no-scrollbar border border-gray-100 rounded-sm">
                                    <table className="w-full text-[13px] text-left border-collapse">
                                        <thead className="bg-[#EBEEF0] text-dark transition-colors">
                                            <tr>
                                                <th className="px-5 py-4 border border-gray-100 font-normal">
                                                    {table.productInfo || "Product info"}
                                                </th>
                                                {table.columns.map((col, colIdx) => (
                                                    <th key={colIdx} className="px-5 py-4 border border-gray-100 text-center font-normal">
                                                        {col}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="text-dark bg-white">
                                            {table.rows.map((row, rowIdx) => (
                                                <tr key={rowIdx}>
                                                    <td className="px-5 py-4 border border-gray-100 font-normal text-dark/70">
                                                        {row.label}
                                                    </td>
                                                    {row.values.map((v, valIdx) => (
                                                        <td key={valIdx} className="px-5 py-4 border border-gray-100 text-center font-normal text-dark">
                                                            {v}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}
                    </div>
                );
            case 'Delivery & Returns':
                const deliveryDescription = product?.deliveryReturns?.description || "EO’S offers complimentary worldwide DHL Express and UPS delivery on all orders. Timings are estimated from the moment your order is dispatched and may vary depending on your delivery destination, as shown at checkout.";
                const deliveryPoints = product?.deliveryReturns?.points || [];

                return (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <section>
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-dark mb-4">DELIVERY</h4>
                            <p className="text-[15px] text-dark leading-relaxed mb-3">
                                {deliveryDescription}
                            </p>
                            {deliveryPoints.length > 0 && (
                                <ul className="space-y-2 mt-4">
                                    {deliveryPoints.map((point, idx) => (
                                        <li key={idx} className="flex items-start gap-3 text-[14px] text-dark/80">
                                            <span className="mt-1.5 w-1 h-1 rounded-full bg-dark/40 shrink-0" />
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </section>
                        <section>
                            <h4 className="text-[13px] font-bold uppercase tracking-widest text-dark mb-4">DUTIES & RETURNS</h4>
                            <p className="text-[15px] text-dark leading-relaxed">
                                Please note that import duties and taxes may apply upon delivery for customers outside the US, EU and UK. We kindly recommend checking with your country's customs office to determine any applicable import duties and taxes before making a purchase.
                            </p>
                            <p className="text-[15px] text-dark leading-relaxed pt-4">
                                You may return your order within 14 days of delivery. For more information, please refer to our FAQs page.
                            </p>
                        </section>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                onClick={onClose}
                className={`fixed inset-0 bg-black/40 z-[100] transition-opacity duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
                    }`}
            />

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-[85%] md:w-[65%] lg:w-[45%] bg-white shadow-2xl z-[110] transform transition-transform duration-500 ease-[cubic-bezier(0.32,0,0.07,1)] flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 sm:px-8 md:px-10 py-6 sm:py-8 lg:py-10 border-b border-gray-100">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-dark">Product info</h2>
                    <button
                        onClick={onClose}
                        className="group p-2 -mr-2 transition-transform hover:rotate-90 duration-300 outline-none"
                    >
                        <IoClose size={28} className="text-dark/30 group-hover:text-dark transition-colors" />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex px-2 sm:px-4 md:px-8 border-b border-gray-100 overflow-x-auto no-scrollbar scroll-smooth">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 sm:px-5 md:px-6 py-4 sm:py-5 lg:py-6 text-[11px] sm:text-[12px] md:text-[13px] font-bold uppercase tracking-widest whitespace-nowrap transition-all relative outline-none ${activeTab === tab ? 'text-dark' : 'text-gray-300 hover:text-dark/60'
                                }`}
                        >
                            {tab}
                            {activeTab === tab && (
                                <div className="absolute bottom-0 left-0 w-full h-[2px] bg-dark animate-in fade-in slide-in-from-left duration-300" />
                            )}
                        </button>
                    ))}
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 sm:p-8 md:p-10 lg:p-14 color-sidebar-scroll">
                    <div className="max-w-4xl mx-auto">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductInfoSidebar;
