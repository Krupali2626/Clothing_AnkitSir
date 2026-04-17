import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuSearch } from "react-icons/lu";
import { HiPlus, HiMinus } from "react-icons/hi";
import { HiArrowUpRight } from "react-icons/hi2";
import supportTeam from '../assets/images/support_team.webp';
import { supportCategories, allFaqs } from '../utils/supportData';


export default function Support() {
    const [openFaq, setOpenFaq] = useState(null);

    const toggleFaq = (index) => {
        setOpenFaq(openFaq === index ? null : index);
    };

    const categories = supportCategories;
    const faqs = allFaqs.slice(0, 10); // Show first 10 for general view

    return (
        <div className="bg-white min-h-screen">
            {/* Breadcrumb */}
            <div className="py-6 border-b border-border">
                <nav className="flex text-[10px] md:text-base font-semibold  justify-center uppercase  text-lightText">
                    <Link to="/" className="hover:text-dark transition-colors">HOME</Link>
                    <span className="mx-2">/</span>
                    <span className="text-primary">SUPPORT</span>
                </nav>
            </div>

            {/* Hero Section */}
            <section className="pt-20 pb-20 px-4 md:px-10 lg:px-20 text-center max-w-5xl mx-auto">
                <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-4 animate-fade-in">
                    NEED HELP?
                </p>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                    HOW CAN WE HELP YOU?
                </h1>
                <p className="text-sm md:text-lg text-lightText font-light mb-8  mx-auto ">
                    Find answers or contact our support team.
                </p>

                {/* Search Bar */}
                <div className="relative max-w-3xl mx-auto group">
                    <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                        <LuSearch className="text-xl md:text-2xl text-mainText group-focus-within:text-primary transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search for help (orders, payments, account)"
                        className="w-full pl-16 pr-8 py-5 md:py-6 bg-[#F9F9F9] border-none text-sm md:text-lg text-mainText focus:ring-1 focus:ring-primary/20 outline-none transition-all"
                    />
                </div>
            </section>

            {/* FAQs Grid */}
            <section className="pb-24 px-4 md:px-10 lg:px-20 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-4">
                    {faqs.map((faq, index) => (
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
                    ))}
                </div>
            </section>

            {/* Categories Section */}
            <section className=" bg-white px-4 md:px-10 lg:px-20">
                <div className="max-w-7xl mx-auto text-center mb-16">


                    <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-4 animate-fade-in">
                        FIND YOUR ANSWER
                    </p>
                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                        BROWSE BY CATEGORY
                    </h1>
                    <p className="text-sm md:text-lg text-lightText font-light mb-8  mx-auto ">
                        Find help based on what you need.
                    </p>
                </div>

                <div className="mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                    {categories.map((cat, idx) => (
                        <div
                            key={idx}
                            className="bg-[#FBFBFB] p-10 md:p-14 text-center group hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 border border-border/10 rounded-sm"
                        >
                            <div className="w-[100px] h-[100px]  rounded-full flex items-center justify-center mx-auto mb-6 text-3xl text-white group-hover:scale-110 transition-transform duration-500  overflow-hidden">
                                <img src={cat.icon} alt={cat.title} className="w-full h-full object-cover p-2" />
                            </div>
                            <h3 className="text-base md:text-3xl font-bold text-primary mb-2 uppercase tracking-tight">{cat.title}</h3>
                            <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-2">{cat.subtitle}</p>
                            <p className="text-sm md:text-xl text-lightText mb-6 font-medium">{cat.desc}</p>
                            <Link to={`/support/${cat.id}`} className="inline-flex items-center gap-2 text-sm md:text-lg font-bold uppercase text-primary group-hover:text-gold transition-colors border-b border-transparent hover:border-gold pb-1">
                                {cat.link}
                                <HiArrowUpRight className="text-xs transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </Link>
                        </div>
                    ))}
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-4 md:px-10 lg:px-20 mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
                    {/* Left side: Image and Features */}
                    <div className="space-y-12">
                        <div className="aspect-[4/3] overflow-hidden rounded-sm grayscale-[0.2] contrast-[1.05]">
                            <img
                                src={supportTeam}
                                alt="Support Team"
                                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                            />
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-base md:text-2xl font-bold text-primary uppercase ">What you can expect</h3>
                            <div className=" divide-y divide-border/50 border-t border-border/50">
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

                    {/* Right side: Form */}
                    <div className="bg-white flex flex-col justify-between">
                        <div>

                            <p className="text-[10px] md:text-lg font-semibold uppercase text-mainText mb-4 animate-fade-in">
                                SUPPORT
                            </p>
                            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-primary mb-4">
                                WITHOUT DELAY
                            </h1>
                            <p className="text-sm md:text-lg text-lightText font-light mb-8  mx-auto ">
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
                                        <label className="text-[10px] md:text-xs font-bold  uppercase text-primary group-focus-within:text-gold transition-colors">Email Address</label>
                                        <input
                                            type="email"
                                            placeholder="Add your email address"
                                            className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] md:text-xs font-bold  uppercase text-primary group-focus-within:text-gold transition-colors">Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Payment Issue"
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label className="text-[10px] md:text-xs font-bold  uppercase text-primary group-focus-within:text-gold transition-colors">Message</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Start typing your thoughts..."
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent resize-none transition-all"
                                    />
                                </div>
                                <button className="bg-primary text-white px-6 md:px-12 py-2 md:py-4 text-sm md:text-lg font-semibold uppercase hover:bg-[#1a3026] active:scale-[0.98] transition-all duration-300">
                                    SUBMIT
                                </button>
                            </form>
                        </div>


                        <div className="mt-10">
                            <p className="text-sm md:text-xl text-mainText font-medium">
                                We're here to make your experience smooth and hassle-free. Whether you need help with orders, payments, or your account, our team is ready to assist you with clear and timely responses. Every request is handled with care to ensure you get the support you need without unnecessary delays.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
