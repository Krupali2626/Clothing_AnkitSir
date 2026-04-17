import React from 'react';
import { Link } from 'react-router-dom';

const SupportBreadcrumb = ({ categoryTitle }) => {
    return (
        <div className="py-6 border-b border-border">
            <nav className="flex text-[10px] md:text-base font-semibold justify-center uppercase text-lightText">
                <Link to="/" className="hover:text-dark transition-colors">HOME</Link>
                <span className="mx-2">/</span>
                {categoryTitle ? (
                    <>
                        <Link to="/support" className="hover:text-dark transition-colors">SUPPORT</Link>
                        <span className="mx-2">/</span>
                        <span className="text-primary">{categoryTitle}</span>
                    </>
                ) : (
                    <span className="text-primary">SUPPORT</span>
                )}
            </nav>
        </div>
    );
};

export default SupportBreadcrumb;
