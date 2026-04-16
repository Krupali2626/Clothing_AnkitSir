import React, { useRef, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function InvoiceModal({ order, onClose }) {
    const invoiceRef = useRef();
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        setDownloading(true);
        try {
            const element = invoiceRef.current;
            const canvas = await html2canvas(element, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();

            const margin = 0;
            const usableWidth = pageWidth;
            const imgHeightMm = (canvas.height * usableWidth) / canvas.width;

            if (imgHeightMm <= pageHeight + 2) {
                pdf.addImage(imgData, 'PNG', 0, 0, usableWidth, imgHeightMm);
            } else {
                let yOffset = 0;
                while (yOffset < imgHeightMm - 1) {
                    if (yOffset > 0) pdf.addPage();
                    pdf.addImage(imgData, 'PNG', 0, -yOffset, usableWidth, imgHeightMm);
                    yOffset += pageHeight;
                }
            }

            pdf.save(`Invoice-${order.userId?.firstName}-${order?._id?.slice(0, 6)?.toUpperCase()}.pdf`);
        } catch (err) {
            console.error('PDF generation failed:', err);
        } finally {
            setDownloading(false);
        }
    };

    const addr = order.shippingAddress;
    const subtotal = order.billingAmount ?? 0;
    const discount = order.discountAmount ?? 0;
    const shipping = order.shippingCost ?? 0;
    const total = order.totalAmount ?? 0;

    const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
        month: 'long', day: 'numeric', year: 'numeric',
    });

    const colors = {
        primary: "#14372F",
        gold: "#D4AF37",
        border: "#E9ECEF",
        dark: "#1B1B1B",
        mainText: "#343A40",
        lightText: "#ADB5BD",
        mainBG: "#F8F9FA"
    };

    const statusColor =
        order.orderStatus === 'Delivered' ? '#009951' :
            order.orderStatus === 'Cancelled' ? '#C00F0C' : colors.gold;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-4xl max-h-[95vh] flex flex-col rounded shadow-2xl overflow-hidden border border-gray-100">

                {/* Toolbar */}
                <div className="flex items-center justify-between px-8 py-5 border-b border-gray-50 shrink-0 bg-white">
                    <h2 className="text-sm font-bold text-slate-400 uppercase tracking-[4px]">Elora Preview</h2>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleDownload}
                            disabled={downloading}
                            className="bg-[#14372F] text-white text-[10px] font-semibold tracking-[2px] px-8 py-3 rounded hover:brightness-110 active:scale-[0.98] transition-all flex items-center gap-3 disabled:opacity-60 uppercase"
                        >
                            {downloading ? 'Processing...' : 'Download Invoice'}
                        </button>
                        <button onClick={onClose} className="p-2 text-slate-300 hover:text-black transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <div className="overflow-y-auto flex-1 bg-gray-50 p-10">
                    <div
                        ref={invoiceRef}
                        style={{
                            background: '#ffffff',
                            width: '794px',
                            height: '1122px', // Forces full A4 page height
                            margin: '0 auto',
                            padding: '40px 35px',
                            fontFamily: "'Urbanist', sans-serif",
                            color: colors.dark,
                            boxSizing: 'border-box',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative'
                        }}
                    >
                        {/* Header */}
                        <div style={{ marginBottom: '40px' }}>
                            <h1 style={{ fontSize: '24px', fontWeight: '700', letterSpacing: '6px', color: colors.primary, margin: 0, textTransform: 'uppercase' }}>ELORA</h1>
                            <div style={{ height: '1.5px', width: '30px', background: colors.gold, marginTop: '8px' }} />
                        </div>

                        {/* Info Bar */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: `1px solid ${colors.border}`, paddingBottom: '15px', marginBottom: '35px' }}>
                            <div>
                                <p className='tracking-wide' style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: colors.lightText, marginBottom: '3px' }}>Order ID</p>
                                <p style={{ fontWeight: '600', textTransform: 'uppercase', }}>#{order.orderId}</p>
                            </div>
                            <div>
                                <p className='tracking-wide' style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: colors.lightText, marginBottom: '3px' }}>Date</p>
                                <p style={{ fontWeight: '600' }}>{formattedDate}</p>
                            </div>
                            <div className='tracking-wide' style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '10px', fontWeight: '700', textTransform: 'uppercase', color: colors.lightText, marginBottom: '3px' }}>Status</p>
                                <p style={{ fontWeight: '700', color: statusColor, textTransform: 'uppercase', fontSize: '11px' }}>{order.orderStatus}</p>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '50px', marginBottom: '40px' }}>
                            <div className='tracking-wide' style={{ background: colors.mainBG, padding: '25px', borderLeft: `2.5px solid ${colors.primary}` }}>
                                <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: colors.primary, marginBottom: '10px' }}>Shipment Details</h3>
                                {addr ? (
                                    <div style={{ lineHeight: '1.6', color: colors.mainText }}>
                                        <p style={{ fontWeight: '700', fontSize: '14px', marginBottom: '2px' }}>{addr.firstName} {addr.lastName}</p>
                                        <span>{addr.aptSuite}, {addr.street}</span>
                                        <span>{addr.city}, {addr.state} {addr.postalCode}</span>
                                    </div>
                                ) : <p>—</p>}
                            </div>
                            <div className='tracking-wide' style={{ background: colors.mainBG, padding: '25px', borderLeft: `2.5px solid ${colors.primary}` }}>
                                <h3 style={{ fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', color: colors.primary, marginBottom: '10px' }}>Payment Info</h3>
                                <p className='tracking-wide' style={{ color: colors.lightText, fontSize: '12px' }}>Mode: <span style={{ color: colors.dark, fontWeight: '600' }}>{order.paymentMethod}</span></p>
                                {order.appliedCoupon?.code && <p style={{ color: colors.lightText, fontSize: '12px', marginTop: '4px' }}>Promo: <span style={{ color: colors.gold, fontWeight: '700' }}>{order.appliedCoupon.code}</span></p>}
                            </div>
                        </div>

                        {/* Item Table */}
                        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '30px' }}>
                            <thead>
                                <tr style={{ borderBottom: `1px solid ${colors.dark}` }}>
                                    <th style={{ textAlign: 'left', padding: '10px 0', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', color: colors.primary }}>Item Selection</th>
                                    <th style={{ textAlign: 'center', padding: '10px 0', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', width: '50px' }}>Qty</th>
                                    <th style={{ textAlign: 'right', padding: '10px 0', fontSize: '9px', fontWeight: '700', textTransform: 'uppercase', width: '100px' }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {order.products?.map((item, idx) => (
                                    <tr key={idx} style={{ borderBottom: `1px solid ${colors.mainBG}` }}>
                                        <td style={{ padding: '15px 0' }}>
                                            <div style={{ fontWeight: '600', fontSize: '13px' }}>{item.name || item.productId?.name}</div>
                                            <div style={{ fontSize: '10px', color: colors.lightText }}>{[item.variantId?.color, item.selectedSize].filter(Boolean).join(' / ')}</div>
                                        </td>
                                        <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                        <td style={{ textAlign: 'right', fontWeight: '600' }}>${(item.price * item.quantity).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {/* Bottom Sections Pushed Down to Footer */}
                        <div style={{ marginTop: 'auto' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '30px' }}>
                                <div className='tracking-wide' style={{ width: '220px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                                        <span style={{ color: colors.dark, fontSize: '12px', fontWeight: '600' }}>Subtotal</span>
                                        <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
                                    </div>
                                    {discount > 0 && (
                                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', color: '#009951' }}>
                                            <span style={{ fontSize: '12px', fontWeight: '600' }}>Discount</span>
                                            <span style={{ fontWeight: '700' }}>-${discount.toFixed(2)}</span>
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderBottom: `1px solid ${colors.mainBG}`, paddingBottom: '12px' }}>
                                        <span style={{ color: colors.dark, fontSize: '12px', fontWeight: '500' }}>Shipping</span>
                                        <span style={{ fontWeight: '600' }}>${shipping.toFixed(2)}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 0', alignItems: 'center' }}>
                                        <span style={{ fontSize: '12px', fontWeight: '700', color: colors.primary, textTransform: 'uppercase', letterSpacing: '1px' }}>Grand Total</span>
                                        <span style={{ fontSize: '24px', fontWeight: '700', color: colors.primary }}>${total.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <div style={{ paddingTop: '20px', borderTop: `1px solid ${colors.border}`, textAlign: 'center' }}>
                                <p style={{ fontSize: '9px', color: colors.lightText, textTransform: 'uppercase', letterSpacing: '1px' }}>Thank you for choosing Elora · Authorized Transaction Receipt</p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div >
    );
}
