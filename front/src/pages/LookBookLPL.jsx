import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

// Import images from assets
import look01 from '../assets/images/look01.avif';
import look02 from '../assets/images/look02.avif';
import look03 from '../assets/images/look03.avif';
import look04 from '../assets/images/look04.avif';
import look1 from '../assets/images/look1.avif';

const LookBookLPL = () => {
    const navigate = useNavigate();
    // Scroll to top on mount
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const products = [
        {
            id: 1,
            title: "Limited Edition Striped Linen Blend Blazer",
            price: "$103",
            image: look01
        },
        {
            id: 2,
            title: "Limited Edition Floral Lace Skirt",
            price: "$92",
            image: look02
        },
        {
            id: 3,
            title: "Limited Edition Semi-sheer Cardigan",
            price: "$42",
            image: look03
        },
        {
            id: 4,
            title: "Limited Edition Shimmer Ring",
            price: "$22",
            image: look04
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.15,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 1,
                ease: [0.25, 1, 0.5, 1]
            }
        }
    };

    return (
        <div className="w-full min-h-screen bg-white">
            {/* Unified Section Header and Grid */}
            <div className="w-full p-4 sm:p-6 md:p-8 lg:p-10">
                <div className="mb-12">
                    <p className="text-[10px] md:text-[11px] font-bold tracking-[0.3em] text-[#14372F] uppercase opacity-90">
                        04 Products
                    </p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 border-t border-l border-[#E9ECEF]">
                    {/* First 2 Product Cards */}
                    {products.slice(0, 2).map((product) => (
                        <motion.div 
                            key={product.id} 
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            onClick={() => {
                                navigate(`/product/${product.id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="group cursor-pointer border-r border-b border-[#E9ECEF] flex flex-col items-center bg-white transition-colors duration-300 hover:bg-gray-50/50"
                        >
                            <div className="w-full aspect-square overflow-hidden mb-6 flex items-center justify-center">
                                <img 
                                    src={product.image} 
                                    alt={product.title} 
                                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-sm lg:text-base font-medium text-[#1A1A1A] mb-1 uppercase tracking-tight">
                                    {product.title}
                                </h3>
                                <p className="text-sm lg:text-base text-gray-500 font-light">
                                    {product.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}

                    {/* Model Image - Spanning 2x2 on Desktop, positioned after the first 2 products */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        className="col-span-2 row-span-2 order-last lg:order-none border-r border-b border-[#E9ECEF] overflow-hidden bg-gray-50"
                    >
                        <img 
                            src={look1} 
                            alt="Model Look" 
                            className="w-full h-full object-cover transition-transform duration-[2000ms] hover:scale-105"
                            loading="lazy"
                        />
                    </motion.div>

                    {/* Last 2 Product Cards */}
                    {products.slice(2, 4).map((product) => (
                        <motion.div 
                            key={product.id} 
                            initial="hidden"
                            animate="visible"
                            variants={itemVariants}
                            onClick={() => {
                                navigate(`/product/${product.id}`);
                                window.scrollTo(0, 0);
                            }}
                            className="group cursor-pointer border-r border-b border-[#E9ECEF] flex flex-col items-center bg-white transition-colors duration-300 hover:bg-gray-50/50"
                        >
                            <div className="w-full aspect-square overflow-hidden mb-6 flex items-center justify-center">
                                <img 
                                    src={product?.image} 
                                    alt={product?.title} 
                                    className="w-full h-full object-contain transition-transform duration-700 ease-out group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            <div className="text-center p-4">
                                <h3 className="text-sm lg:text-base font-medium text-[#1A1A1A] mb-1 tracking-tight">
                                    {product?.title}
                                </h3>
                                <p className="text-sm lg:text-base text-gray-500 font-light">
                                    {product?.price}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>
        </div>
    );
};

export default LookBookLPL;



