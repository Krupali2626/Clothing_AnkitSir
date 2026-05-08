import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AccountLayout from './AccountLayout';
import { fetchMyOrders } from '../../redux/slice/order.slice';
import { HiChevronRight, HiArrowRight } from 'react-icons/hi2';
import Pagination from '../../admin/components/Pagination';

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
        <span className={`text-sm sm:text-base font-bold ${cls}`}>{status}</span>
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
    const productPrice = firstProduct?.price != null ? `${firstProduct.price}` : null;

    const itemCount = order.products?.length ?? 0;

    const formattedDate = order.createdAt
        ? new Date(order.createdAt).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        })
        : '—';

    return (
        <div className="bg-white flex flex-col border border-border rounded-sm overflow-hidden">
            {/* ── Header ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 pt-3 sm:pt-4 md:pt-5 pb-2 sm:pb-3 gap-1.5 sm:gap-2">
                <div className="w-full sm:w-auto min-w-0 flex-1">
                    <p className="text-xs sm:text-sm md:text-base font-semibold text-mainText uppercase truncate">
                        #{order.orderId}
                    </p>
                    <p className="text-[10px] sm:text-xs md:text-sm font-medium text-lightText mt-0.5">
                        Placed on {formattedDate}
                    </p>
                </div>
                <div className="self-start sm:self-auto shrink-0">
                    <StatusBadge status={order.orderStatus} />
                </div>
            </div>

            {/* ── Product row ── */}
            <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4 px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3">
                {/* Thumbnail */}
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] shrink-0 bg-mainBG border border-border overflow-hidden rounded-sm">
                    {productImage ? (
                        <img
                            src={productImage}
                            alt={productName}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-lightText text-[9px] sm:text-[10px]">
                            No img
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base font-medium text-dark leading-snug line-clamp-2 mb-0.5 sm:mb-1">
                        {productName}
                    </p>
                    <div className="space-y-0.5 text-[10px] sm:text-[11px] md:text-xs lg:text-sm font-medium text-lightText">
                        {(productColor || productSize) && (
                            <div className="flex flex-wrap gap-x-1.5 sm:gap-x-2 md:gap-x-3 gap-y-0.5 items-center">
                                {productColor && <p className="whitespace-nowrap">Color: {productColor}</p>}
                                {productSize && <p className="whitespace-nowrap">Size: {productSize}</p>}
                            </div>
                        )}
                        {productPrice && <p>Price: {productPrice}</p>}
                    </div>
                </div>
            </div>

            {/* ── Footer ── */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-3 border-t border-border gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3">
                    <span className="text-mainText text-[10px] sm:text-xs md:text-sm lg:text-base font-medium whitespace-nowrap">
                        {itemCount} {itemCount === 1 ? 'Item' : 'Items'}
                    </span>
                    <div className='border-l border-border h-2.5 sm:h-3 w-px'></div>
                    <span className="text-mainText text-[10px] sm:text-xs md:text-sm lg:text-base font-medium whitespace-nowrap">
                        ${order.totalAmount?.toFixed(2)}
                    </span>
                </div>
                <Link
                    to={`/orders/${order._id}`}
                    className="flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-xs md:text-sm font-medium text-dark hover:text-primary transition-colors whitespace-nowrap"
                >
                    View Details <HiChevronRight className="text-xs sm:text-sm md:text-base" />
                </Link>
            </div>
        </div>
    );
}

export default function Orders() {
    const dispatch = useDispatch();
    const { orders, loading, error, currentPage, totalPages, totalOrders } = useSelector((state) => state.order);
    const [page, setPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        dispatch(fetchMyOrders({ page, limit: itemsPerPage }));
    }, [dispatch, page]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <AccountLayout>
            <div className="flex flex-col min-h-[calc(100vh-10rem)] md:min-h-[calc(100vh-17rem)]">

                {/* Page title */}
                <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8">
                    <h1 className="text-xl sm:text-2xl md:text-[28px] font-semibold text-primary">Orders</h1>
                </div>

                {/* Loading skeletons */}
                {loading && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                        {[1, 2, 3, 4].map((n) => (
                            <div
                                key={n}
                                className="bg-white border border-border rounded-sm p-4 sm:p-5 animate-pulse h-40 sm:h-44"
                            />
                        ))}
                    </div>
                )}

                {/* Error */}
                {!loading && error && (
                    <div className="flex-1 flex items-center justify-center text-red-500 text-xs sm:text-sm px-4 text-center">
                        {error}
                    </div>
                )}

                {/* Empty state */}
                {!loading && !error && orders.length === 0 && (
                    <div className="flex flex-col items-center justify-center flex-1 min-h-[50vh] sm:min-h-[60vh] gap-2 sm:gap-3 text-center px-4">
                        <p className="text-lg sm:text-xl font-semibold text-dark">No orders yet</p>
                        <p className="text-xs sm:text-sm text-lightText max-w-sm">
                            Start exploring and place your first order
                        </p>
                        <Link
                            to="/"
                            className="mt-2 inline-flex items-center gap-2 bg-primary text-white text-xs sm:text-sm font-semibold px-5 sm:px-6 py-2.5 sm:py-3 hover:bg-primary/90 transition-colors"
                        >
                            EXPLORE ALL <HiArrowRight className="text-sm sm:text-base" />
                        </Link>
                    </div>
                )}

                {/* Orders grid */}
                {!loading && !error && orders.length > 0 && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
                            {orders.map((order) => (
                                <OrderCard key={order._id} order={order} />
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-6 sm:mt-8">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    totalItems={totalOrders}
                                    itemsPerPage={itemsPerPage}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        )}
                    </>
                )}
            </div>
        </AccountLayout>
    );
}
