import React, { useState, useEffect } from 'react'
import { CgProfile } from "react-icons/cg";
import { HiOutlineShoppingBag } from "react-icons/hi";
import { LuSearch } from "react-icons/lu";
import { FaRegHeart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { fetchMainCategories } from '../redux/slice/category.slice';
import { Link } from 'react-router-dom';

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dispatch = useDispatch();
    const { mainCategories, loading } = useSelector((state) => state.category);
    const { user } = useSelector((state) => state.auth);
    console.log(user);

    useEffect(() => {
        dispatch(fetchMainCategories());
    }, [dispatch]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setIsMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="font-sans">
            {/* Main Header Container */}
            <div className="absolute top-0 left-0 w-full z-50">
                {/* Promo Bar */}
                <div className="bg-primary hidden md:block border-b border-white/5">
                    <p className='text-white text-center text-[10px] sm:text-xs py-2 font-medium tracking-[0.25em] opacity-80 uppercase'>
                        Orders over $250 ship free | Extended returns available through Jun 15.
                    </p>
                </div>
                {/* Header Content */}
                <header className="bg-transparent text-white">
                    <div className="mx-auto px-4 lg:px-10">
                        <div className="flex items-center h-20 relative">

                            {/* Left: Mobile Menu & Desktop Nav */}
                            <div className="flex items-center w-1/4 lg:w-auto lg:flex-1">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="lg:hidden p-2 -ml-2 hover:opacity-70 transition-opacity z-[70] relative"
                                    aria-label="Toggle Menu"
                                >
                                    {isMenuOpen ? (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                                    ) : (
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12" /><line x1="4" x2="20" y1="6" y2="6" /><line x1="4" x2="20" y1="18" y2="18" /></svg>
                                    )}
                                </button>

                                <nav className="hidden lg:flex items-center space-x-10">
                                    {(mainCategories && mainCategories.length > 0) ? (
                                        mainCategories.map((category) => (
                                            <a
                                                key={category._id}
                                                href={`/collection/${category.slug || category.mainCategoryName?.toLowerCase().replace(' ', '-')}`}
                                                className="text-base font-medium text-nowrap opacity-60 hover:opacity-100 transition-all duration-300 relative group uppercase"
                                            >
                                                {category.mainCategoryName}
                                                <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white transition-all duration-300 group-hover:w-full"></span>
                                            </a>
                                        ))
                                    ) : (
                                        ['SHOP', 'MEN', 'WOMEN', 'LUX CARE'].map((item) => (
                                            <a key={item} href="#" className="text-base font-medium opacity-60 hover:opacity-100 uppercase">{item}</a>
                                        ))
                                    )}
                                </nav>
                            </div>

                            {/* Center: Logo */}
                            <div className="flex-1 flex justify-center z-[60]">
                                <a href="/" className="text-3xl md:text-4xl font-black tracking-tighter hover:opacity-80 transition-opacity outline-none">eo</a>
                            </div>

                            {/* Right: Icons */}
                            <div className="flex items-center justify-end w-1/4 lg:w-auto lg:flex-1 space-x-1 sm:space-x-2 md:space-x-4">
                                <button className="p-2 rounded-full hover:bg-white/5 transition-all duration-300 opacity-70 hover:opacity-100">
                                    <LuSearch className='text-2xl' />
                                </button>
                                <button className="hidden xs:block p-2 rounded-full hover:bg-white/5 transition-all duration-300 opacity-70 hover:opacity-100">
                                    <FaRegHeart className='text-2xl' />
                                </button>
                                <button className="p-2 rounded-full hover:bg-white/5 transition-all duration-300 opacity-70 hover:opacity-100 relative">
                                    <HiOutlineShoppingBag className='text-2xl' />
                                </button>
                                {user ? (
                                    <div className='flex gap-2 items-center'>
                                        <div className="h-8 w-8 bg-primary uppercase rounded-full flex items-center justify-center font-bold">
                                            {user?.firstName?.slice(0, 1) || 'U'}
                                        </div>
                                        <span className='capitalize'>{user?.firstName}</span>
                                    </div>
                                ) : (
                                    <Link to="/auth" className="hidden sm:block p-2 rounded-full hover:bg-white/5 transition-all duration-300 opacity-70 hover:opacity-100">
                                        <CgProfile className='text-2xl' />
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Mobile Navigation Menu Overflow */}
                <div
                    className={`fixed inset-0 top-[80px] md:top-[100px] bg-black lg:hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] z-[40] ${isMenuOpen ? 'opacity-100 translate-y-0 visibility-visible shadow-2xl' : 'opacity-0 -translate-y-4 visibility-hidden pointer-events-none'
                        }`}
                    style={{ height: 'calc(100vh - 80px)' }}
                >
                    <div className="flex flex-col h-full overflow-y-auto px-10 py-12">
                        <nav className="flex flex-col space-y-5">
                            {mainCategories && mainCategories.map((category, index) => (
                                <a
                                    key={category._id}
                                    href={`/collection/${category.slug || category.mainCategoryName?.toLowerCase().replace(' ', '-')}`}
                                    onClick={() => setIsMenuOpen(false)}
                                    className={`text-lg font-semibold tracking-[0.2em] transform transition-all duration-500 text-white hover:text-gray-400 uppercase ${isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                                        }`}
                                    style={{ transitionDelay: `${index * 75}ms` }}
                                >
                                    {category.mainCategoryName}
                                </a>
                            ))}
                        </nav>

                        <div className={`mt-10 pt-10 border-t border-white/10 flex flex-col space-y-5 transition-all duration-700 delay-300 ${isMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
                            }`}>
                            <a href="/account" className="text-xs font-semibold tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase">Account</a>
                            <a href="/wishlist" className="text-xs font-semibold tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase">Wishlist</a>
                            <a href="/support" className="text-xs font-semibold tracking-[0.15em] text-white/50 hover:text-white transition-colors uppercase">Customer Care</a>

                            <div className="pt-6 flex space-x-4">
                                {['IG', 'FB', 'TW'].map((social) => (
                                    <div key={social} className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center opacity-40 hover:opacity-100 hover:border-white/30 cursor-pointer transition-all">
                                        <span className="text-[9px] font-bold tracking-tighter">{social}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}




