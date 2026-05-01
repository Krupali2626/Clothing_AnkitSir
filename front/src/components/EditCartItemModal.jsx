import { useState, useEffect } from 'react';
import { IoClose } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { removeFromCart, addToCart, fetchCart } from '../redux/slice/cart.slice';
import axiosInstance from '../utils/axiosInstance';
import toast from 'react-hot-toast';
import SizeSelectionModal from './SizeSelectionModal';

export default function EditCartItemModal({ isOpen, onClose, item }) {
    const dispatch = useDispatch();
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [showSizeModal, setShowSizeModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    useEffect(() => {
        if (item?.productVariantId && item?.productId) {
            setSelectedProduct(item.productId);
            setSelectedVariant(item.productVariantId);
        }
    }, [item]);

    const fetchProducts = async () => {
        setLoadingProducts(true);
        try {
            const response = await axiosInstance.get('/product/get-all');
            console.log('Products response:', response.data);
            const productsData = response.data?.result || [];
            console.log('Products data:', productsData);
            console.log('Number of products:', productsData.length);
            setProducts(productsData);
        } catch (error) {
            console.error('Error fetching products:', error);
            toast.error('Failed to load products');
        } finally {
            setLoadingProducts(false);
        }
    };

    if (!isOpen || !item) return null;

    const handleProductVariantSelect = (product, variant) => {
        setSelectedProduct(product);
        setSelectedVariant(variant);
        
        // If variant has size options, open size selection modal
        if (variant?.options && variant.options.length > 0) {
            setShowSizeModal(true);
        } else {
            // No size options, directly update cart
            handleUpdateCart(product, variant, null);
        }
    };

    const handleSizeConfirm = async (size) => {
        await handleUpdateCart(selectedProduct, selectedVariant, size);
    };

    const handleCloseSizeModal = () => {
        setShowSizeModal(false);
        // Also close the product modal
        onClose();
    };

    const handleSkip = () => {
        // Use the current cart item's product and variant
        if (item?.productVariantId && item?.productId) {
            setSelectedProduct(item.productId);
            setSelectedVariant(item.productVariantId);
            
            // Check if the current item has size options
            if (item.productVariantId?.options && item.productVariantId.options.length > 0) {
                setShowSizeModal(true);
            } else {
                // No size options, just close
                onClose();
            }
        } else {
            onClose();
        }
    };

    const handleUpdateCart = async (product, variant, size) => {
        setLoading(true);
        try {
            // First, remove the old item from cart
            await dispatch(
                removeFromCart({
                    productId: item?.productId?._id,
                    productVariantId: item?.productVariantId?._id,
                    selectedSize: item?.selectedSize,
                })
            ).unwrap();

            // Then, add the new item to cart
            await dispatch(
                addToCart({
                    productId: product._id,
                    quantity: item.quantity,
                    productVariantId: variant._id,
                    selectedSize: size,
                })
            ).unwrap();

            toast.success('Cart item updated successfully');
            
            // Close both modals
            setShowSizeModal(false);
            onClose();
            
            // Refresh cart data
            await dispatch(fetchCart());
        } catch (error) {
            console.error('Update cart error:', error);
            toast.error(error?.message || 'Failed to update cart item');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <SizeSelectionModal
                isOpen={showSizeModal}
                onClose={handleCloseSizeModal}
                product={selectedProduct}
                variant={selectedVariant}
                currentSize={item?.selectedSize}
                onConfirm={handleSizeConfirm}
            />
            
            <div className="fixed inset-0 z-50 flex">
                {/* Backdrop */}
                <div 
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                ></div>
                
                {/* Slide-in Panel from Right */}
                <div className="ml-auto relative bg-white w-full max-w-md h-full overflow-hidden shadow-2xl flex flex-col animate-slide-in-right">
                    {/* Header */}
                    <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
                        <h2 className="text-lg font-semibold text-gray-900">Edit Item</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <IoClose size={24} />
                        </button>
                    </div>

                    {/* Content - Scrollable */}
                    <div className="flex-1 overflow-y-auto px-6 py-6">
                        {/* Loading State */}
                        {loadingProducts && (
                            <div className="flex items-center justify-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                            </div>
                        )}

                        {/* Products Grid */}
                        {!loadingProducts && (
                            <>
                                {products.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-gray-500 text-sm">No products available</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-3 gap-3 mb-8">
                                        {products.map((product) => {
                                            // Check if product has variants
                                            if (!product?.variants || product.variants.length === 0) {
                                                console.log('Product without variants:', product.name);
                                                return null;
                                            }

                                            return product.variants.map((variant) => {
                                                const isSelected = selectedVariant?._id === variant._id;
                                                const variantPrice = variant.options && variant.options.length > 0
                                                    ? variant.options[0]?.price
                                                    : variant.price;

                                                return (
                                                    <div
                                                        key={`${product._id}-${variant._id}`}
                                                        onClick={() => handleProductVariantSelect(product, variant)}
                                                        className={`cursor-pointer group transition-all border-2 ${
                                                            isSelected ? 'border-primary shadow-md' : 'border-transparent hover:border-gray-200'
                                                        }`}
                                                    >
                                                        <div className="bg-gray-50 aspect-[3/4] overflow-hidden">
                                                            <img
                                                                src={variant.images?.[0] || '/images/product.png'}
                                                                alt={`${product.name} - ${variant.color}`}
                                                                className="w-full h-full object-cover"
                                                            />
                                                        </div>
                                                        <div className="text-center py-2 bg-white">
                                                            <p className="text-[10px] font-medium text-gray-900 capitalize line-clamp-2 px-1">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-[10px] text-gray-600 mt-0.5">
                                                                ${variantPrice?.toFixed(2) || '0.00'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                );
                                            });
                                        })}
                                    </div>
                                )}
                            </>
                        )}
                    </div>

                    {/* Footer Actions */}
                    <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
                        <button
                            onClick={handleSkip}
                            className="flex-1 h-12 bg-primary text-white text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all"
                        >
                            Skip
                        </button>
                        <button
                            onClick={onClose}
                            className="flex-1 h-12 bg-gray-100 text-gray-700 text-sm font-semibold uppercase tracking-wider hover:bg-gray-200 transition-all"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
