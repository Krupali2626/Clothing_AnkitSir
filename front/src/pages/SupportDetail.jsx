import React, { useState } from 'react';
import { Link, useParams, Navigate } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { HiPlus, HiMinus } from "react-icons/hi";
import { supportCategories } from '../utils/supportData';
import supportTeam from '../assets/images/support_team.webp';

export default function SupportDetail() {
    const { id } = useParams();
    const category = supportCategories.find(cat => cat.id === id);
    const [openFaq, setOpenFaq] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    if (!category) {
        return <Navigate to="/support" replace />;
    }

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const filteredFaqs = category.faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="py-6 border-b border-border">
                <nav className="flex text-[10px] md:text-base font-semibold justify-center uppercase text-lightText">
                    <Link to="/" className="hover:text-dark transition-colors">HOME</Link>
                    <span className="mx-2">/</span>
                    <Link to="/support" className="hover:text-dark transition-colors">SUPPORT</Link>
                    <span className="mx-2">/</span>
                    <span className="text-primary">{category.title}</span>
                </nav>
            </div>

            {/* Hero Section */}
            <section className="pt-20 pb-12 px-4 md:px-10 lg:px-20 text-center max-w-5xl mx-auto">
                <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-4">
                    SUPPORT
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4 uppercase">
                    {category.title} HELP
                </h1>
                <p className="text-sm md:text-lg text-lightText font-light mb-8 max-w-2xl mx-auto">
                    {category.desc}
                </p>

                {/* Search Bar */}
                <div className="relative max-w-3xl mx-auto group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <LuSearch className="text-xl md:text-2xl text-mainText group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder={`Search for ${category.title.toLowerCase()} help...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-16 pr-8 py-5 md:py-6 bg-[#F9F9F9] border-none text-sm md:text-lg text-mainText focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </section>

            {/* FAQs Grid */}
            <section className="pb-24 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-4">
                    {filteredFaqs.length > 0 ? (
                        filteredFaqs.map((faq, index) => (
                            <div
                                key={index}
                                className="border-b border-border/60 transition-all duration-300"
                            >
                                <button
                                    onClick={() => toggleFaq(index)}
                                    className="w-full flex items-center justify-between py-6 group text-left"
                                >
                                    <span className="text-xs md:text-base lg:text-lg font-medium text-mainText group-hover:text-dark transition-colors tracking-wide">
                                        {faq.q}
                                    </span>
                                    <div className="text-primary/40 group-hover:text-primary transition-colors">
                                        {openFaq === index ? <HiMinus /> : <HiPlus />}
                                    </div>
                                </button>
                                <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openFaq === index ? 'max-h-40 pb-6' : 'max-h-0'}`}>
                                    <p className="text-[13px] md:text-sm text-lightText leading-relaxed">
                                        {faq.a}
                                    </p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full text-center py-20 text-lightText">
                            No questions found matching your search.
                        </div>
                    )}
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-4 md:px-10 lg:px-20 mx-auto border-t border-border/20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-12">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm grayscale-[0.2] contrast-[1.05]">
                            <img
                                src={supportTeam}
                                alt="Support Team"
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-base md:text-2xl font-bold text-primary uppercase">What you can expect</h3>
                            <div className="divide-y divide-border/50 border-t border-border/50">
                                {[
                                    "Fast and helpful responses from our support team",
                                    "Clear guidance for orders, payments, and account issues",
                                    "Secure and reliable communication",
                                    "Support designed to solve your problems quickly"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-4 group">
                                        <div className="py-2 md:py-4">
                                            <p className="text-sm md:text-lg font-semibold text-mainText">{item}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white flex flex-col justify-between">
                        <div>
                            <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-4">
                                SUPPORT
                            </p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                                WITHOUT DELAY
                            </h1>
                            <p className="text-sm md:text-lg text-lightText font-light mb-8">
                                Have a question or need help? Reach out and our team will assist you with quick and reliable support.
                            </p>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-1 group">
                                        <label className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">Full Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter full name"
                                            className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                        />
                                    </div>
                                    <div className="space-y-1 group">
                                        <label className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Add your email address"
                                            className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Payment Issue"
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">Message</label>
                                    <textarea
                                        placeholder="e.g., Start typing your thoughts..."
                                        rows="1"
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent resize-none transition-all"
                                    ></textarea>
                                </div>
                                <button className="bg-primary text-white px-6 md:px-12 py-2 md:py-4 text-sm md:text-lg font-semibold uppercase hover:bg-[#1a3026] active:scale-[0.98] transition-all duration-300">
                                    SUBMIT
                                </button>
                            </form>
                        </div>

                        <div className="mt-10">
                            <p className="text-sm md:text-xl text-mainText font-medium">
                                We're here to make your experience smooth and hassle-free. Whether you need help with orders, payments, or your account, our team is ready to assist you with clear and timely responses.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
