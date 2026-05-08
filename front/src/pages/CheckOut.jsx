import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { HiMinus, HiPlus } from 'react-icons/hi';
import { IoClose } from 'react-icons/io5';
import { updateCartItem, removeFromCart, fetchCart, applyCoupon, removeCoupon } from '../redux/slice/cart.slice';
import { fetchRecentlyViewed } from '../redux/slice/product.slice';
import toast from 'react-hot-toast';
import EditCartItemModal from '../components/EditCartItemModal';

// ─── Coupon Formik schema ────────────────────────────────────────────────────
const couponSchema = Yup.object({
    code: Yup.string()
        .trim()
        .min(2, 'Enter a valid coupon code')
        .required('Please enter a coupon code'),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────
const fmt = (n) =>
    Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// ── Recently Viewed Card ──────────────────────────────────────────
const RecentlyViewedCard = ({ product }) => {
    const navigate = useNavigate();
    const defaultVariant = product.variants?.find(v => v.isDefault) || product.variants?.[0];
    const image = defaultVariant?.images?.[0] || null;

    const getPrice = () => {
        if (!defaultVariant) return null;
        if (defaultVariant.options?.length > 0) {
            const prices = defaultVariant.options.map(o => o.price).filter(Boolean);
            if (!prices.length) return null;
            const min = Math.min(...prices);
            return `$${min}`;
        }
        return defaultVariant.price ? `$${defaultVariant.price}` : null;
    };

    return (
        <div
            onClick={() => navigate(`/product/${product.slug}`)}
            className="flex flex-col items-center bg-white border border-border/10 cursor-pointer group"
        >
            <div className="w-full aspect-[4/5] bg-white overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-lightText/40">
                        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2" /></svg>
                    </div>
                )}
            </div>
            <div className="py-6 px-4 flex flex-col items-center gap-1">
                <p className="text-[13px] font-medium text-dark text-center tracking-tight">{product.name}</p>
                <p className="text-[12px] font-bold text-lightText">{getPrice()}</p>
            </div>
        </div>
    );
};

export default function CheckOut() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isAuthenticated } = useSelector((state) => state.auth);
    const { cartData, loading: cartLoading } = useSelector((state) => state.cart);
    const { recentlyViewed } = useSelector((state) => state.product);
    const [updatingId, setUpdatingId] = useState(null); // item._id being updated
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState(null);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth');
            return;
        }
        dispatch(fetchCart());
        dispatch(fetchRecentlyViewed());
    }, [isAuthenticated, dispatch, navigate]);

    // ── Quantity change ───────────────────────────────────────────────────────
    const handleQty = async (item, delta) => {
        const newQty = item.quantity + delta;
        if (newQty < 1) return;
        setUpdatingId(item._id);
        try {
            await dispatch(
                updateCartItem({
                    productId: item?.productId?._id,
                    quantity: newQty,
                    productVariantId: item?.productVariantId?._id,
                    selectedSize: item.selectedSize,
                })
            ).unwrap();
        } finally {
            setUpdatingId(null);
        }
    };

    // ── Remove item ───────────────────────────────────────────────────────────
    const handleRemove = async (item) => {
        setUpdatingId(item._id);
        try {
            await dispatch(
                removeFromCart({
                    productId: item?.productId?._id,
                    productVariantId: item?.productVariantId?._id,
                    selectedSize: item?.selectedSize,
                })
            ).unwrap();
        } finally {
            setUpdatingId(null);
        }
    };

    const couponFormik = useFormik({
        initialValues: { code: '' },
        validationSchema: couponSchema,
        onSubmit: async (values, { setSubmitting, setFieldError }) => {
            try {
                const result = await dispatch(applyCoupon(values.code.trim().toUpperCase())).unwrap();
                toast.success(result?.message || 'Coupon applied!');
            } catch (err) {
                const msg = err?.message || 'Invalid or expired coupon';
                setFieldError('code', msg);
                toast.error(msg);
            } finally {
                setSubmitting(false);
            }
        },
    });

    const handleRemoveCoupon = async () => {
        try {
            await dispatch(removeCoupon()).unwrap();
            couponFormik.resetForm();
            toast.success('Coupon removed');
        } catch {
            toast.error('Failed to remove coupon');
        }
    };



    // ── Handle Edit Item ──────────────────────────────────────────────────────
    const handleEditItem = (item) => {
        setEditingItem(item);
        setEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setEditModalOpen(false);
        setEditingItem(null);
    };

    // ── Derived values ────────────────────────────────────────────────────────
    const cartItems = cartData?.items || [];
    const subtotal = cartData?.subtotal || 0;
    const discount = cartData?.discount || 0;
    const shipping = cartData?.shipping || 25;
    const total = cartData?.total || 0;
    const appliedCoupon = cartData?.appliedCoupon;
    const hasCoupon = !!appliedCoupon?.code;
    const isEmpty = !cartLoading && cartItems.length === 0;

    if (isEmpty) {
        return (
            <div className="bg-mainBG flex flex-col">
                {/* Empty Cart Section */}
                <div className="flex flex-col items-center justify-center px-6 py-24">
                    <div className="w-full max-w-4xl flex flex-col items-center">
                        <div className="w-full  p-16 text-center border border-dashed border-border/40 rounded-lg flex flex-col items-center justify-center">
                            <p className="text-xl font-bold text-primary mb-8 tracking-wider">
                                YOUR CART IS EMPTY
                            </p>
                            <Link
                                to="/"
                                className="inline-block bg-primary text-white text-[13px] font-bold uppercase tracking-[3px] px-12 py-5 hover:bg-primary/90 transition-all shadow-lg"
                            >
                                continue shopping
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Recently Viewed Section */}
                {recentlyViewed && recentlyViewed.length > 0 && (
                    <section className="bg-mainBG border-t border-border/20">
                        <div className="mx-auto px-6 py-24">
                            <div className="flex flex-col items-center text-center mb-16 gap-3">
                                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-dark/60">
                                    THE ARCHIVE OF YOUR SEARCH
                                </p>
                                <h2 className="text-[32px] md:text-[48px] font-bold uppercase text-primary leading-tight tracking-tight">
                                    RECENTLY VIEWED PRODUCTS
                                </h2>
                                <p className="text-[14px] text-lightText max-w-2xl leading-relaxed">
                                    Don't let a favorite piece slip away. Re-access your latest searches and pick up your exploration exactly where you left off.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 border-t border-l border-border/10">
                                {recentlyViewed.slice(0, 4).map((product) => (
                                    <div key={product._id} className="border-r border-b border-border/10">
                                        <RecentlyViewedCard product={product} />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        );
    }

    // console.log("cartItems", cartItems);


    // ─────────────────────────────────────────────────────────────────────────
    return (
        <>
            <EditCartItemModal
                isOpen={editModalOpen}
                onClose={handleCloseEditModal}
                item={editingItem}
            />
            <div className="min-h-screen bg-white flex flex-col">
                <div className="flex-1 flex flex-col lg:flex-row">
                    {/* ══════════════════════════════════════════════════════════
                    LEFT — Cart items (White Background)
                ══════════════════════════════════════════════════════════ */}
                    <div className="flex-1 bg-white">
                        <div className="max-w-[720px] ml-auto mr-0 lg:mr-10 px-6 py-10 md:py-14">
                            {/* Header row */}
                            <div className="flex items-center justify-between mb-10">
                                <h1 className="text-2xl font-bold text-primary ">
                                    Cart
                                </h1>
                                <Link
                                    to="/"
                                    className="text-sm underline font-bold text-gold"
                                >
                                    Continue Shopping
                                </Link>
                            </div>

                            {/* ── Loading skeleton ── */}
                            {cartLoading && (
                                <div className="space-y-6">
                                    {[1, 2].map((n) => (
                                        <div
                                            key={n}
                                            className="bg-white border border-border/20 p-6 flex gap-8 animate-pulse"
                                        >
                                            <div className="w-[120px] h-[150px] bg-gray-100 flex-shrink-0" />
                                            <div className="flex-1 space-y-4 py-2">
                                                <div className="h-5 bg-gray-100 rounded w-3/4" />
                                                <div className="h-4 bg-gray-100 rounded w-1/3" />
                                                <div className="h-4 bg-gray-100 rounded w-1/4" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Cart items ── */}
                            {!cartLoading && cartItems.length > 0 && (
                                <div className="space-y-12">
                                    {cartItems.map((item) => {
                                        const variant = item.productVariantId;
                                        const isUpdating = updatingId === item._id;

                                        // Calculate item price based on size or default price
                                        let itemPrice = 0;
                                        if (variant?.options && variant.options.length > 0 && item.selectedSize) {
                                            const sizeObj = variant.options.find(s => s.size === item.selectedSize);
                                            itemPrice = sizeObj?.price || 0;
                                        } else {
                                            itemPrice = variant?.price || 0;
                                        }

                                        return (
                                            <div
                                                key={item._id}
                                                className={`flex flex-col md:flex-row gap-6 transition-opacity group relative pr-10 ${isUpdating ? 'opacity-50 pointer-events-none' : ''}`}
                                            >
                                                {/* Remove Button Icon - Far Right */}
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleRemove(item);
                                                    }}
                                                    className="absolute top-0 -right-2 md:top-2 md:right-0 bg-white/80 hover:bg-red-50 text-lightText hover:text-red-500 p-2 rounded-full opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-300 z-10"
                                                    title="Remove from cart"
                                                >
                                                    <IoClose size={18} />
                                                </button>

                                                {/* Product image */}
                                                <div
                                                    className="w-[130px] h-[130px] bg-[#F9F9F7] flex-shrink-0 overflow-hidden cursor-pointer relative"
                                                >
                                                    <img
                                                        src={variant?.images?.[0] || '/images/product.png'}
                                                        alt={item?.productId?.name}
                                                        onClick={() => navigate(`/product/${item?.productId?.slug}`)}
                                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                                                    />
                                                </div>

                                                {/* Details & Controls */}
                                                <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 sm:gap-4">
                                                    <div className="flex flex-col items-start gap-1 sm:gap-2">
                                                        <h3
                                                            className="text-sm sm:text-base font-semibold text-dark capitalize tracking-wide cursor-pointer hover:text-gold transition-colors leading-snug"
                                                            onClick={() => navigate(`/product/${item?.productId?.slug}`)}
                                                        >
                                                            {item?.productId?.name}
                                                        </h3>

                                                        <div className="flex flex-col gap-1 mt-1">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] sm:text-xs text-lightText font-medium tracking-wider uppercase">Color:</span>
                                                                <span className="text-[10px] sm:text-xs text-primary flex items-center gap-1.5 font-bold tracking-wide uppercase">
                                                                    <div className="inline-block h-2 w-2 sm:h-3 sm:w-3" style={{ backgroundColor: variant?.colorCode }}></div>
                                                                    {variant?.color || 'Default'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[10px] sm:text-xs text-lightText font-medium tracking-wider uppercase">Size:</span>
                                                                <span className="text-[10px] sm:text-xs text-primary font-bold tracking-wide uppercase">
                                                                    {item?.selectedSize || 'M'}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <button
                                                            onClick={() => handleEditItem(item)}
                                                            className="text-[10px] sm:text-xs font-bold text-gold underline cursor-pointer mt-2 block tracking-widest hover:text-gold/80 transition-colors uppercase"
                                                        >
                                                            Edit Item
                                                        </button>
                                                    </div>

                                                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 border-t sm:border-t-0 border-border/10 pt-4 sm:pt-0">
                                                        <div className="flex items-center gap-4 bg-mainBG px-3 py-1.5 rounded-sm text-dark text-xs">
                                                            <button
                                                                onClick={() => handleQty(item, -1)}
                                                                className=" hover:scale-110 transition-transform p-1"
                                                            >
                                                                <HiMinus size={12} />
                                                            </button>
                                                            <span className="font-bold w-4 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => handleQty(item, 1)}
                                                                className=" hover:scale-110 transition-transform p-1"
                                                            >
                                                                <HiPlus size={12} />
                                                            </button>
                                                        </div>

                                                        <span className="text-sm sm:text-base font-black text-dark">
                                                            ${fmt(itemPrice * item.quantity)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Checkout button at bottom of left column */}
                            {!isEmpty && !cartLoading && (
                                <div className="mt-16">
                                    <button
                                        onClick={() => navigate('/checkout-form')}
                                        className="w-full h-[54px] bg-primary text-white text-[13px] font-bold uppercase tracking-[2px] hover:bg-primary/90 transition-all shadow-md"
                                    >
                                        CHECKOUT
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ══════════════════════════════════════════════════════════
                    RIGHT — Order Summary (Light Gray Background)
                ══════════════════════════════════════════════════════════ */}
                    <div className="w-full lg:w-[480px] xl:w-[40%] bg-[#F9F9F7] border-t lg:border-t-0 lg:border-l border-border/20">
                        <div className="max-w-[420px] mx-auto lg:ml-10 lg:mr-auto px-6 sm:px-8 py-10 md:py-14">
                            <h2 className="text-xl sm:text-2xl font-bold text-primary mb-10 tracking-tight uppercase">
                                Order Summary
                            </h2>

                            <form onSubmit={couponFormik.handleSubmit} noValidate>
                                <div className="flex gap-0 mb-1">
                                    <input
                                        type="text"
                                        name="code"
                                        value={couponFormik.values.code}
                                        onChange={(e) => couponFormik.setFieldValue('code', e.target.value.toUpperCase())}
                                        onBlur={couponFormik.handleBlur}
                                        placeholder="Discount code"
                                        disabled={hasCoupon}
                                        className={`flex-1 border border-r-0 ${couponFormik.touched.code && couponFormik.errors.code
                                            ? 'border-red-400'
                                            : 'border-[#D8D8D8]'
                                            } px-3 sm:px-4 py-3 text-sm text-primary placeholder:text-lightText/60 outline-none focus:border-primary/50 transition-colors disabled:bg-transparent disabled:cursor-not-allowed bg-white`}
                                    />
                                    <button
                                        type="submit"
                                        disabled={couponFormik.isSubmitting || hasCoupon || !couponFormik.values.code.trim()}
                                        className="bg-primary text-white text-[11px] sm:text-[12px] font-bold uppercase tracking-widest px-5 sm:px-8 py-3 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap min-w-[80px] sm:min-w-[120px]"
                                    >
                                        {couponFormik.isSubmitting ? '...' : 'Apply'}
                                    </button>
                                </div>

                                {couponFormik.touched.code && couponFormik.errors.code && (
                                    <p className="text-[11px] text-red-500 mb-2">
                                        {couponFormik.errors.code}
                                    </p>
                                )}
                            </form>

                            {!hasCoupon && (
                                <p className="text-[11px] text-lightText font-medium mt-2 mb-6">
                                    Use code SALE20 for 20% off your order (minimum 100$)
                                </p>
                            )}

                            {hasCoupon && (
                                <div className="flex items-center gap-2 mt-4 mb-6">
                                    <span className="inline-flex items-center gap-2 border border-[#D8D8D8] bg-white px-4 py-1.5 text-[12px] font-bold text-primary uppercase tracking-wider">
                                        {appliedCoupon.code}
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="ml-1 text-lightText hover:text-red-500 transition-colors"
                                        >
                                            <IoClose size={14} />
                                        </button>
                                    </span>
                                </div>
                            )}

                            <div className="space-y-4 mt-12">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-1.5 text-sm text-lightText font-medium uppercase tracking-wide">
                                        <span>Subtotal</span>
                                        <span className="text-[10px] opacity-40">•</span>
                                        <span>{cartItems.length} ITEM{cartItems.length !== 1 ? 'S' : ''}</span>
                                    </div>
                                    <span className="text-sm font-bold text-primary">
                                        ${fmt(subtotal)}
                                    </span>
                                </div>

                                {discount > 0 && (
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-1.5 text-sm text-lightText font-medium uppercase tracking-wide">
                                            <span>Discount</span>
                                            <span className="text-[10px] opacity-40">•</span>
                                            {appliedCoupon?.discountType === 'percentage' && (
                                                <span>{appliedCoupon.percentageValue}% OFF</span>
                                            )}
                                        </div>
                                        <span className="text-sm font-bold text-primary">
                                            -${fmt(discount)}
                                        </span>
                                    </div>
                                )}

                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-lightText font-medium uppercase tracking-wide">Shipping</span>
                                    <span className="text-sm font-bold text-primary">
                                        {shipping === 0 ? 'FREE' : `$${fmt(shipping)}`}
                                    </span>
                                </div>

                                <div className="pt-8 flex justify-between items-end border-t border-border/40 mt-6">
                                    <span className="text-base sm:text-lg font-bold text-primary uppercase tracking-tight">Total</span>
                                    <span className="text-3xl sm:text-4xl md:text-[40px] font-bold text-primary leading-none tracking-tighter">
                                        ${fmt(total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
