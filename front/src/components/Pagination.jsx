import React from 'react';
import { HiChevronLeft, HiChevronRight } from 'react-icons/hi2';

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-8 md:mt-12">
            {/* Previous Button */}
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-10 h-10 flex items-center justify-center border border-border text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary disabled:cursor-not-allowed"
                aria-label="Previous Page"
            >
                <HiChevronLeft className="text-xl" />
            </button>

            {/* Page Numbers */}
            <div className="flex items-center gap-2">
                {pageNumbers.map((number) => (
                    <button
                        key={number}
                        onClick={() => onPageChange(number)}
                        className={`w-10 h-10 flex items-center justify-center text-sm font-bold tracking-widest transition-all border ${
                            currentPage === number
                                ? 'bg-primary text-white border-primary'
                                : 'bg-white text-primary border-border hover:border-primary'
                        }`}
                    >
                        {number.toString().padStart(2, '0')}
                    </button>
                ))}
            </div>

            {/* Next Button */}
            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-10 h-10 flex items-center justify-center border border-border text-primary hover:bg-primary hover:text-white transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-primary disabled:cursor-not-allowed"
                aria-label="Next Page"
            >
                <HiChevronRight className="text-xl" />
            </button>
        </div>
    );
};

export default Pagination;
