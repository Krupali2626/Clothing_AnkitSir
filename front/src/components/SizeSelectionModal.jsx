import { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import toast from 'react-hot-toast';

export default function SizeSelectionModal({ isOpen, onClose, product, variant, onConfirm, currentSize }) {
    const [selectedSize, setSelectedSize] = useState(currentSize || null);

    if (!isOpen || !variant) return null;

    const handleConfirm = () => {
        if (!selectedSize) {
            toast.error('Please select a size');
            return;
        }
        onConfirm(selectedSize);
    };

    // Get price for selected size
    const getPrice = () => {
        if (!selectedSize) return 0;
        if (variant.options && variant.options.length > 0) {
            const sizeObj = variant.options.find(s => s.size === selectedSize);
            return sizeObj?.price || 0;
        }
        return variant.price || 0;
    };

    const currentPrice = getPrice();

    return (
        <div className="fixed inset-0 z-[60] flex">
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
                    {/* Product Info */}
                    <div className="mb-8">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-20 h-24 bg-gray-50 overflow-hidden flex-shrink-0">
                                <img
                                    src={variant.images?.[0] || '/images/product.png'}
                                    alt={product?.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold text-gray-900 capitalize mb-1">
                                    {product?.name}
                                </h3>
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-3 h-3 rounded-full border border-gray-300"
                                        style={{ backgroundColor: variant.colorCode }}
                                    />
                                    <p className="text-xs text-gray-600 capitalize">
                                        {variant.color}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Size Selection */}
                    {variant?.options && variant.options.length > 0 ? (
                        <div>
                            <div className="flex items-center justify-between mb-4">
                                <h4 className="text-sm font-medium text-gray-900">
                                    Select Size
                                </h4>
                                {selectedSize && (
                                    <span className="text-xs text-gold font-semibold">
                                        SELECTED: {selectedSize}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-2">
                                {variant.options.map((option) => {
                                    const isSelected = selectedSize === option.size;
                                    const isOutOfStock = option.stock <= 0;

                                    return (
                                        <button
                                            key={option.size}
                                            onClick={() => !isOutOfStock && setSelectedSize(option.size)}
                                            disabled={isOutOfStock}
                                            className={`w-full flex items-center justify-between px-4 py-3 border-2 transition-all ${
                                                isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : isOutOfStock
                                                    ? 'border-gray-200 bg-gray-50 cursor-not-allowed opacity-50'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                                    isSelected ? 'border-primary' : 'border-gray-300'
                                                }`}>
                                                    {isSelected && (
                                                        <div className="w-3 h-3 rounded-full bg-primary"></div>
                                                    )}
                                                </div>
                                                <span className={`text-sm font-medium ${
                                                    isSelected ? 'text-primary' : isOutOfStock ? 'text-gray-400 line-through' : 'text-gray-700'
                                                }`}>
                                                    {option.size}
                                                </span>
                                            </div>
                                            <div className="text-right">
                                                {isOutOfStock ? (
                                                    <span className="text-xs text-red-500 font-medium">
                                                        Out of Stock
                                                    </span>
                                                ) : (
                                                    <span className={`text-sm font-semibold ${
                                                        isSelected ? 'text-primary' : 'text-gray-700'
                                                    }`}>
                                                        ${option.price?.toFixed(2)}
                                                    </span>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-10">
                            <p className="text-sm text-gray-500">No size options available</p>
                        </div>
                    )}

                    {/* Price Summary */}
                    {selectedSize && (
                        <div className="mt-8 p-4 bg-gray-50 rounded">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-gray-600">Total Price:</span>
                                <span className="text-xl font-bold text-primary">
                                    ${currentPrice.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer Actions */}
                <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
                    <button
                        onClick={handleConfirm}
                        disabled={!selectedSize}
                        className="flex-1 h-12 bg-primary text-white text-sm font-semibold uppercase tracking-wider hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Update
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
    );
}
