import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoCloseOutline } from "react-icons/io5";
import { fetchWishlist, toggleWishlist } from '../redux/slice/product.slice';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Wishlist = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { wishlist, loading } = useSelector((state) => state.product);
    const { isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchWishlist());
        }
    }, [dispatch, isAuthenticated]);

    const handleRemoveFromWishlist = (e, productId) => {
        e.stopPropagation();
        dispatch(toggleWishlist(productId));
    };

    const handleAddToCart = (e, product) => {
        e.stopPropagation();
        navigate(`/product/${product.slug}`);
    };

    const getProductImage = (product) => {
        if (product.variants && product.variants.length > 0) {
            const defaultV = product.variants.find(v => v.isDefault) || product.variants[0];
            return defaultV.images?.[0] || '/images/placeholder.png';
        }
        return '/images/placeholder.png';
    };

    const getProductPrice = (product) => {
        if (product.variants && product.variants.length > 0) {
            const defaultV = product.variants.find(v => v.isDefault) || product.variants[0];
            if (defaultV.options && defaultV.options.length > 0) {
                return defaultV.options[0].price;
            }
            return defaultV.price;
        }
        return product.basePrice || 0;
    };

    return (
        <div className="min-h-screen bg-white">            
            <main className="px-8 py-12">
                {/* Header Section */}
                <div className="pb-8">
                    <h1 className="text-[10px] md:text-sm font-bold text-[#1a1a1a] uppercase tracking-widest">
                        {wishlist.length} PRODUCTS
                    </h1>
                </div>

                {loading && wishlist.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-12 h-12 border-4 border-[#14372F] border-t-transparent rounded-full animate-spin mb-4"></div>
                        <p className="text-gray-500 font-medium">Loading your wishlist...</p>
                    </div>
                ) : wishlist.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-0 ">
                        {wishlist.map((product) => (
                            <div 
                                key={product._id}
                                onClick={() => navigate(`/product/${product.slug}`)}
                                className="group relative border border-gray-100 p-4 md:p-6 lg:p-8 bg-white transition-all duration-300 hover:shadow-[0_10px_30px_rgba(0,0,0,0.05)] hover:z-10"
                            >
                                {/* Top Labels & Actions */}
                                <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
                                    <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter text-gray-300">
                                        NEW
                                    </span>
                                    <button 
                                        onClick={(e) => handleRemoveFromWishlist(e, product._id)}
                                        className="p-1 hover:bg-gray-50 rounded-full transition-colors"
                                    >
                                        <IoCloseOutline size={20} className="text-gray-400 group-hover:text-dark transition-colors" />
                                    </button>
                                </div>

                                {/* Image Section */}
                                <div className="relative aspect-square flex items-center justify-center mb-6 overflow-hidden">
                                    <img 
                                        src={getProductImage(product)} 
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>

                                {/* Info Section */}
                                <div className="text-center mb-8">
                                    <h3 className="text-xs md:text-sm lg:text-base font-medium text-dark mb-1 line-clamp-1 group-hover:text-[#14372F] transition-colors">
                                        {product.name}
                                    </h3>
                                    <p className="text-xs md:text-sm lg:text-base font-medium text-dark">
                                        ${getProductPrice(product)}
                                    </p>
                                </div>

                                {/* Add to Cart Button */}
                                <button 
                                    onClick={(e) => handleAddToCart(e, product)}
                                    className="w-full bg-[#14372F] text-white py-3 md:py-4 text-[10px] md:text-xs font-bold uppercase tracking-widest"
                                >
                                    ADD TO CART
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-32 text-center">
                        <h2 className="text-lg font-bold text-dark mb-2 tracking-tight">Your Wishlist is Empty</h2>
                        <button 
                            onClick={() => navigate('/')}
                            className="bg-[#14372F] text-white px-8 py-3.5 text-xs font-bold uppercase tracking-widest hover:bg-[#0d2a23] transition-all"
                        >
                            CONTINUE SHOPPING
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default Wishlist;
