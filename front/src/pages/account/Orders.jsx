import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { fetchMyOrders } from '../../redux/slice/order.slice';
import { HiChevronRight, HiArrowRight } from 'react-icons/hi2';

// Status colour mapping
const STATUS_STYLES = {
    'Delivered': 'text-[#009951]',
    'On the way': 'text-gold',
    'Pending': 'text-gold',
    'Cancelled': 'text-[#C00F0C]',
};

function StatusBadge({ status }) {
    const cls = STATUS_STYLES[status] || 'text-gray-500';
    return (
        <span className={`text-base font-bold ${cls}`}>{status}</span>
    );
}

function OrderCard({ order }) {
    const firstProduct = order.products?.[0];

    // Try to get image from populated productId or variantId
    const productImage =
        firstProduct?.productId?.images?.[0] ||
        firstProduct?.variantId?.images?.[0] ||
        null;

    const productName = firstProduct?.name || firstProduct?.productId?.name || 'Product';
    const productColor = firstProduct?.variantId?.color || null;
    const productSize = firstProduct?.selectedSize || null;
    const productPrice = firstProduct?.price != null ? `$${firstProduct.price}` : null;

    const itemCount = order.products?.length ?? 0;

    const formattedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '—';

    return (
        <div className="bg-white flex flex-col">
            {/* ── Header ── */}
            <div className="flex flex-col sm375:flex-row items-start justify-between px-5 pt-5 pb-3 sm375:gap-0 gap-1">
                <div>
                    <p className="text-base font-semibold text-mainText uppercase">#{order.orderId}</p>
                    <p className="text-sm font-medium text-lightText mt-0.5">Placed on {formattedDate}</p>
                </div>
                <StatusBadge status={order.orderStatus} />
            </div>

            {/* ── Product row ── */}
            <div className="flex items-center gap-4 px-5 py-3">
                {/* Thumbnail */}
                <div className="w-[72px] h-[72px] shrink-0 bg-mainBG border border-border overflow-hidden rounded-sm">
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lightText text-[10px]">
                            No img
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-sm md:text-base font-medium text-dark leading-snug line-clamp-2">
                        {productName}
                    </p>
                    <div className="mt-1 space-y-0.5 text-xs md:text-sm font-medium text-lightText">
                        <div className="flex gap-3 items-center">
                            {productColor && <p>Color: {productColor}</p>}
                            {productSize && <p>Size: {productSize}</p>}
                        </div>
                        {productPrice && <p>Price: {productPrice}</p>}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex items-center justify-between mx-5 py-3 border-t border-border">
                <div className="flex items-center gap-3">
                    <span className="text-mainText text-xs md:text-base font-medium">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <div className='border-l border-border h-3 w-px'></div>
                    <span className="text-mainText text-xs md:text-base font-medium">${order.totalAmount?.toFixed(2)}</span>
                </div>
                <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-1 text-xs md:text-sm font-medium text-dark hover:text-primary transition-colors"
                >
                    View Details <HiChevronRight className="text-xs md:text-base" />
                </Link>
            </div>
        </div>
    );
}

export default function Orders() {
    const dispatch = useDispatch();
    const { orders, loading, error } = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(fetchMyOrders());
    }, [dispatch]);

    return (
        <AccountLayout>
            <div className="flex flex-col min-h-[calc(100vh-17rem)]">

                {/* Page title */}
                <div className="flex justify-between items-center md:mb-8 mb-4">
                    <h1 className="text-2xl md:text-[28px] font-semibold text-primary">Orders</h1>
                </div>

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="bg-white border border-border rounded-sm p-5 animate-pulse h-44"
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex-1 flex items-center justify-center text-red-500 text-sm">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] gap-3 text-center">
                        <p className="text-xl font-semibold text-dark">No orders yet</p>
                        <p className="text-sm text-lightText">
                            Start exploring and place your first order
                        </p>
                        <Link
                            to="/"
                            className="mt-2 inline-flex items-center gap-2 bg-primary text-white text-sm font-semibold px-6 py-3 hover:bg-primary/90 transition-colors"
                        >
                            EXPLORE ALL <HiArrowRight />
                        </Link>
                    </div>
                )}

                {/* Orders grid */}
                {!loading && !error && orders.length > 0 && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {orders.map((order) => (
                            <OrderCard key={order._id} order={order} />
                        ))}
                    </div>
                )}
            </div>
        </AccountLayout>
    );
}
