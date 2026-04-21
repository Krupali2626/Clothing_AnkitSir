import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose, IoTrashOutline } from "react-icons/io5";
import { HiOutlineShoppingBag, HiPlus, HiMinus } from "react-icons/hi";
import { closeCart, fetchCart, updateCartItem, removeFromCart } from '../redux/slice/cart.slice';
import { useNavigate } from 'react-router-dom';

const CartSidebar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { items, totalAmount, isCartOpen, loading } = useSelector((state) => state.cart);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated && isCartOpen) {
            dispatch(fetchCart());
        }
    }, [dispatch, isAuthenticated, isCartOpen]);

    const handleQuantityChange = (productId, quantity, productVariantId, selectedSize) => {
        if (quantity < 1) return;
        dispatch(updateCartItem({ productId, quantity, productVariantId, selectedSize }));
    };

    const handleRemoveItem = (productId, productVariantId, selectedSize) => {
        dispatch(removeFromCart({ productId, productVariantId, selectedSize }));
    };

    const handleCheckout = () => {
        dispatch(closeCart());
        navigate('/checkout');
    };

    return (
        <>
            {/* Backdrop */}
            {isCartOpen && (
                <div
                    className="fixed inset-0 z-[120] bg-black/60 transition-opacity duration-300"
                    onClick={() => dispatch(closeCart())}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 right-0 h-full w-full md:w-[535px] bg-white z-[130] shadow-2xl flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-8 py-7 border-b border-gray-100">
                    <h2 className="text-xl font-bold tracking-tight text-dark uppercase">BAG</h2>
                    <button
                        onClick={() => dispatch(closeCart())}
                        className="group p-2 -mr-2 transition-transform hover:rotate-90 duration-300"
                    >
                        <IoClose size={24} className="text-dark/30 group-hover:text-dark transition-colors" />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {!isAuthenticated ? (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-mainBG rounded-full flex items-center justify-center mb-6">
                                <HiOutlineShoppingBag className="text-4xl text-lightText/30" />
                            </div>
                            <h4 className="text-xl font-bold text-dark mb-2">Login to see your bag</h4>
                            <p className="text-sm text-lightText/60 leading-relaxed mb-8">Please log in to view your saved items and continue shopping.</p>
                            <button
                                onClick={() => { dispatch(closeCart()); navigate('/auth'); }}
                                className="px-8 py-4 bg-dark text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors"
                            >
                                Login / Sign Up
                            </button>
                        </div>
                    ) : items.length > 0 ? (
                        <div className="divide-y divide-border/40">
                            {items.map((item) => {
                                const variant = item.productVariantId;
                                const selectedSizeObj = variant?.options?.find(o => o.size === item.selectedSize);
                                const unitPrice = selectedSizeObj?.price || variant?.price || 0;

                                return (
                                    <div key={item._id} className="p-4 md:p-6 flex gap-4 md:gap-6 hover:bg-mainBG/30 transition-colors group">
                                        {/* Image */}
                                        <div
                                            className="w-20 md:w-32 h-28 md:h-40 bg-gray-100 flex-shrink-0 overflow-hidden cursor-pointer"
                                            onClick={() => { dispatch(closeCart()); navigate(`/product/${item?.productId?.slug}`); }}
                                        >
                                            <img
                                                src={variant?.images?.[0] || item?.productId?.variants?.[0]?.images?.[0]}
                                                alt={item?.productId?.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 flex flex-col">
                                            {/* Title */}
                                            <h4
                                                className="text-base md:text-lg font-medium text-dark tracking-tight cursor-pointer hover:text-primary transition-colors line-clamp-2 mb-1"
                                                onClick={() => { dispatch(closeCart()); navigate(`/product/${item?.productId?.slug}`); }}
                                            >
                                                {item?.productId?.name}
                                            </h4>

                                            {/* Price */}
                                            <div className="text-base md:text-lg text-dark mb-1">
                                                ${(unitPrice * item.quantity).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </div>

                                            {/* Color */}
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-lightText font-normal">Color:</span>
                                                <div className="flex items-center gap-2">
                                                    <div 
                                                        className="w-3.5 h-3.5 rounded-sm border border-black/5" 
                                                        style={{ backgroundColor: variant?.colorCode || '#000' }} 
                                                    />
                                                    <span className="text-sm text-dark font-normal">{variant?.color || 'Default'}</span>
                                                </div>
                                            </div>

                                            {/* Size */}
                                            <div className="flex items-center gap-2 mb-4">
                                                <span className="text-sm text-lightText font-normal">Size:</span>
                                                <span className="text-sm text-dark font-normal">{item?.selectedSize || 'OS'}</span>
                                            </div>

                                            {/* Bottom Row: Quantity & Remove */}
                                            <div className="flex items-center gap-6 mt-auto">
                                                {/* Quantity Controls */}
                                                <div className="flex items-center bg-[#F8F9FA] px-1 py-1">
                                                    <button
                                                        onClick={() => handleQuantityChange(item?.productId?._id, item.quantity - 1, item?.productVariantId?._id, item.selectedSize)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    >
                                                        <HiMinus size={14} className="text-dark" />
                                                    </button>
                                                    <span className="w-8 text-center text-sm font-medium text-dark">{item.quantity}</span>
                                                    <button
                                                        onClick={() => handleQuantityChange(item?.productId?._id, item.quantity + 1, item?.productVariantId?._id, item.selectedSize)}
                                                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                                                    >
                                                        <HiPlus size={14} className="text-dark" />
                                                    </button>
                                                </div>

                                                <button
                                                    onClick={() => handleRemoveItem(item?.productId?._id, item?.productVariantId?._id, item?.selectedSize)}
                                                    className="text-sm text-lightText hover:text-red-500 transition-colors"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center p-12 text-center">
                            <div className="w-20 h-20 bg-mainBG rounded-full flex items-center justify-center mb-6">
                                <HiOutlineShoppingBag className="text-4xl text-lightText/30" />
                            </div>
                            <h4 className="text-xl font-bold text-dark mb-2">Your cart is empty</h4>
                            <button
                                onClick={() => dispatch(closeCart())}
                                className="px-8 py-4 bg-[#14372F] text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors mb-12"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {isAuthenticated && items.length > 0 && (
                    <div className="p-8 border-t border-border space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h2 className="text-xl font-bold text-dark uppercase mb-1">Subtotal</h2>
                            </div>
                            <div className="text-2xl text-dark">
                                ${totalAmount.toLocaleString()}
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleCheckout}
                                className="flex-1 py-4 bg-[#14372F] text-white text-md font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors shadow-lg"
                            >
                                Check out
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CartSidebar;
