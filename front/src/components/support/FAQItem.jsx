import React from 'react';
import { HiPlus, HiMinus } from "react-icons/hi";

const FAQItem = ({ faq, isOpen, onToggle, index }) => {
    return (
        <div className="border-b border-border/60 transition-all duration-300">
            <button
                onClick={() => onToggle(index)}
                className="w-full flex items-center justify-between py-6 group text-left"
                aria-expanded={isOpen}
            >
                <span className="text-xs md:text-base lg:text-lg font-medium text-mainText group-hover:text-dark transition-colors tracking-wide">
                    {faq.q}
                </span>
                <div className="text-primary/40 group-hover:text-primary transition-colors">
                    {isOpen ? <HiMinus /> : <HiPlus />}
                </div>
            </button>
            <div 
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    isOpen ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
                }`}
            >
                <p className="text-[13px] md:text-sm text-lightText leading-relaxed">
                    {faq.a}
                </p>
            </div>
        </div>
    );
};

export default FAQItem;
