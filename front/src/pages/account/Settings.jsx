import React, { useState, useEffect } from 'react';
import AccountLayout from './AccountLayout';
import { HiArrowUpRight } from 'react-icons/hi2';
import { HiChevronRight } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';
import { HiOutlineBell, HiOutlineCreditCard, HiOutlineQuestionMarkCircle, HiOutlineDevicePhoneMobile, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { fetchSavedCards } from '../../redux/slice/paymentCard.slice';

export default function Settings() {
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { cards, selectedCardId } = useSelector((state) => state.payment);

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        deliveryUpdates: true,
        paymentAlerts: true,
        accountActivity: false
    });

    useEffect(() => {
        dispatch(fetchSavedCards());
    }, [dispatch]);

    const toggleNotification = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const defaultCard = cards.find(c => c._id === selectedCardId) || cards[0];

    // Helper to get card icon
    const getCardIcon = (type) => {
        const t = type?.toLowerCase();
        if (t?.includes('visa')) return <RiVisaLine className="text-blue-600 text-3xl" />;
        if (t?.includes('master')) return <RiMastercardLine className="text-orange-500 text-3xl" />;
        if (t?.includes('amex') || t?.includes('american')) return <SiAmericanexpress className="text-blue-400 text-2xl" />;
        return <HiOutlineCreditCard className="text-dark text-2xl" />;
    };

    const sections = [
        {
            id: 'notification',
            title: 'NOTIFICATION',
            icon: <HiOutlineBell className="text-xl" />,
            content: (
                <div className="space-y-6 pt-4">
                    {[
                        { id: 'orderUpdates', label: 'Order Updates', desc: 'Get updates when your order is confirmed and processed' },
                        { id: 'deliveryUpdates', label: 'Delivery Updates', desc: 'Track shipping status and delivery progress in real time' },
                        { id: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified about successful and failed transactions' },
                        { id: 'accountActivity', label: 'Account Activity', desc: 'Stay informed about login activity and account changes' },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                            <div>
                                <p className="text-[17px] font-semibold text-dark">{item.label}</p>
                                <p className="text-sm text-lightText/60 mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.id)}
                                className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none ${notifications[item.id] ? 'bg-primary' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 ${notifications[item.id] ? 'translate-x-6' : 'translate-x-0'
                                    }`} />
                            </button>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 'payment',
            title: 'MANAGE PAYMENT',
            icon: <HiOutlineCreditCard className="text-xl" />,
            href: '/payments',
            content: defaultCard ? (
                <div className="flex items-center justify-between pt-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-8 bg-gray-50 flex items-center justify-center rounded">
                            {getCardIcon(defaultCard.cardType)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-dark tracking-widest">
                                •••• {defaultCard.cardNumber.slice(-4)}
                            </span>
                        </div>
                    </div>
                    <span className="text-base font-semibold text-dark">
                        Expires {defaultCard.expiryDate}
                    </span>
                </div>
            ) : (
                <div className="pt-6">
                    <p className="text-sm text-lightText italic">No payment method saved</p>
                </div>
            )
        },
        {
            id: 'support',
            title: 'SUPPORT',
            icon: <HiOutlineQuestionMarkCircle className="text-xl" />,
            content: (
                <div className="pt-4 divide-y divide-border/50">
                    <button className="flex items-center justify-between w-full py-5 group">
                        <span className="text-lg font-semibold text-dark group-hover:text-primary transition-colors">Contact Us</span>
                        <HiChevronRight className="text-lightText text-xl group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="flex items-center justify-between w-full py-5 group">
                        <span className="text-lg font-semibold text-dark group-hover:text-primary transition-colors">Help Center</span>
                        <HiChevronRight className="text-lightText text-xl group-hover:translate-x-1 transition-transform" />
                    </button>
                </div>
            )
        },
        {
            id: 'device',
            title: 'DEVICE & LOGIN INFO',
            icon: <HiOutlineDevicePhoneMobile className="text-xl" />,
            content: (
                <div className="pt-6 space-y-6">
                    {[
                        { name: 'Samsung Phone', lastUsed: 'Today', icon: <HiOutlineDevicePhoneMobile className="text-2xl" /> },
                        { name: 'Web Browser', lastUsed: '15 days ago', icon: <HiOutlineGlobeAlt className="text-2xl" /> },
                    ].map((device, idx) => (
                        <div key={idx} className="flex items-center justify-between pb-6 last:border-0 border-b border-border/40">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-mainBG rounded-full flex items-center justify-center text-lightText">
                                    {device.icon}
                                </div>
                                <div>
                                    <p className="text-lg font-semibold text-dark">{device.name}</p>
                                    <p className="text-sm text-lightText/60 mt-0.5">Last used: {device.lastUsed}</p>
                                </div>
                            </div>
                            <button className="px-6 py-2 border border-red-500/20 text-red-500 text-sm font-bold tracking-widest uppercase hover:bg-red-50 transition-colors">
                                Log Out
                            </button>
                        </div>
                    ))}
                    <div className="flex justify-center pt-2 pb-2">
                        <button className="text-red-500 text-sm font-bold tracking-widest uppercase hover:underline decoration-red-500/30 underline-offset-8">
                            Delete Account
                        </button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <AccountLayout>
            <div className="max-w-4xl">
                <h1 className="text-[44px] font-bold text-dark mb-10">Settings</h1>

                <div className="grid grid-cols-1 gap-8 pb-20">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white border border-border p-10 shadow-sm relative group overflow-hidden">
                            {/* Decorative line */}
                            <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />

                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-primary">{section.icon}</span>
                                    <h2 className="text-sm font-bold tracking-[0.2em] text-dark">{section.title}</h2>
                                </div>
                                {section.href && (
                                    <button
                                        onClick={() => window.location.href = section.href}
                                        className="text-dark hover:text-primary transition-colors"
                                    >
                                        <HiArrowUpRight className="text-2xl" />
                                    </button>
                                )}
                            </div>

                            {section.content}
                        </div>
                    ))}
                </div>
            </div>
        </AccountLayout>
    );
}
