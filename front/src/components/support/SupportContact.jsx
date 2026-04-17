import React from 'react';
import supportTeam from '../../assets/images/support_team.webp';

const SupportContact = () => {
    const expectations = [
        "Fast and helpful responses from our support team",
        "Clear guidance for orders, payments, and account issues",
        "Secure and reliable communication",
        "Support designed to solve your problems quickly"
    ];

    return (
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
                            {expectations.map((item, i) => (
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

                        <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-1 group">
                                    <label htmlFor="fullName" className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">
                                        Full Name
                                    </label>
                                    <input
                                        id="fullName"
                                        type="text"
                                        placeholder="Enter full name"
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                    />
                                </div>
                                <div className="space-y-1 group">
                                    <label htmlFor="email" className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        placeholder="Add your email address"
                                        className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1 group">
                                <label htmlFor="subject" className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">
                                    Subject
                                </label>
                                <input
                                    id="subject"
                                    type="text"
                                    placeholder="e.g., Payment Issue"
                                    className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent transition-all"
                                />
                            </div>
                            <div className="space-y-1 group">
                                <label htmlFor="message" className="text-[10px] md:text-xs font-bold uppercase text-primary group-focus-within:text-gold transition-colors">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    placeholder="e.g., Start typing your thoughts..."
                                    rows="1"
                                    className="w-full border-b border-border py-3 text-sm md:text-lg text-dark focus:border-primary focus:outline-none bg-transparent resize-none transition-all"
                                ></textarea>
                            </div>
                            <button type="submit" className="bg-primary text-white px-6 md:px-12 py-2 md:py-4 text-sm md:text-lg font-semibold uppercase hover:bg-[#1a3026] active:scale-[0.98] transition-all duration-300">
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
    );
};

export default SupportContact;
