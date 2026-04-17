import { useState, useEffect } from 'react';
import AccountLayout from './AccountLayout';
import { HiArrowUpRight } from 'react-icons/hi2';
import { HiChevronRight } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';
import { HiOutlineBell, HiOutlineCreditCard, HiOutlineQuestionMarkCircle, HiOutlineDevicePhoneMobile, HiOutlineGlobeAlt } from 'react-icons/hi2';
import { fetchSavedCards } from '../../redux/slice/paymentCard.slice';
import { updateProfile, logout, fetchSessions, revokeSession, logoutAllDevices } from '../../redux/slice/auth.slice';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';

export default function Settings() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, sessions = [], sessionsLoading } = useSelector((state) => state.auth);
    const { cards, selectedCardId } = useSelector((state) => state.payment);

    const [notifications, setNotifications] = useState({
        orderUpdates: true,
        deliveryUpdates: true,
        paymentAlerts: true,
        accountActivity: true
    });

    // Initialize state from user profile
    useEffect(() => {
        if (user?.notificationPreferences) {
            setNotifications(user.notificationPreferences);
        }
    }, [user?.notificationPreferences]);

    useEffect(() => {
        dispatch(fetchSavedCards());
        dispatch(fetchSessions());
    }, [dispatch]);

    // Handle real-time notification toggle
    const toggleNotification = async (key) => {
        const oldValue = notifications[key];
        const newValue = !oldValue;
        
        // Optimistic UI update
        setNotifications(prev => ({ ...prev, [key]: newValue }));
        
        try {
            const resultAction = await dispatch(updateProfile({
                notificationPreferences: { [key]: newValue }
            }));
            
            if (updateProfile.fulfilled.match(resultAction)) {
                toast.success(`${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} updated`);
            } else {
                throw new Error('Update failed');
            }
        } catch (error) {
            // Revert state on failure
            setNotifications(prev => ({ ...prev, [key]: oldValue }));
            toast.error('Failed to update settings');
        }
    };

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
        toast.success('Logged out successfully');
    };

    const handleDeleteAccount = () => {
        toast.error("Account deletion is disabled for demo purposes");
    };

    const handleRevokeSession = async (sessionId) => {
        console.log('handleRevokeSession called with sessionId:', sessionId);
        try {
            const result = await dispatch(revokeSession(sessionId)).unwrap();
            console.log('revokeSession result:', result);
            toast.success('Device logged out successfully');
            // Refresh sessions list
            dispatch(fetchSessions());
        } catch (error) {
            console.error('revokeSession error:', error);
            toast.error(error?.message || 'Failed to logout device');
        }
    };

    const handleLogoutAll = async () => {
        console.log('handleLogoutAll called');
        try {
            const result = await dispatch(logoutAllDevices()).unwrap();
            console.log('logoutAllDevices result:', result);
            toast.success('Logged out from all devices');
            navigate('/login');
        } catch (error) {
            console.error('logoutAllDevices error:', error);
            toast.error(error?.message || 'Failed to logout from all devices');
        }
    };

    const defaultCard = cards.find(c => c._id === selectedCardId) || cards[0];

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
            title: 'NOTIFICATION SETTINGS',
            icon: <HiOutlineBell className="text-xl" />,
            content: (
                <div className="space-y-6 pt-4">
                    {[
                        { id: 'orderUpdates', label: 'Order Updates', desc: 'Real-time updates when your order is confirmed and processed' },
                        { id: 'deliveryUpdates', label: 'Delivery Updates', desc: 'Track shipping status and delivery progress' },
                        { id: 'paymentAlerts', label: 'Payment Alerts', desc: 'Immediate notification about transaction status' },
                        { id: 'accountActivity', label: 'Account Activity', desc: 'Stay informed about login activity and account changes' },
                    ].map((item) => (
                        <div key={item.id} className="flex items-center justify-between group/item">
                            <div className="pr-4">
                                <p className="text-base font-bold text-dark group-hover/item:text-primary transition-colors">{item.label}</p>
                                <p className="text-sm text-lightText/60 mt-0.5">{item.desc}</p>
                            </div>
                            <button
                                onClick={() => toggleNotification(item.id)}
                                className={`relative w-12 h-6 rounded-full transition-all duration-300 focus:outline-none ring-offset-2 focus:ring-2 focus:ring-primary/20 ${notifications[item.id] ? 'bg-primary' : 'bg-gray-200'
                                    }`}
                            >
                                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full shadow-sm transition-transform duration-300 ${notifications[item.id] ? 'translate-x-6' : 'translate-x-0'
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
                        <div className="w-12 h-8 bg-gray-50 flex items-center justify-center rounded border border-border/50">
                            {getCardIcon(defaultCard.cardType)}
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-dark tracking-widest">
                                •••• {defaultCard.cardNumber.slice(-4)}
                            </span>
                            <span className="text-[10px] text-lightText/60 uppercase font-bold tracking-widest">Default Payment Method</span>
                        </div>
                    </div>
                    <span className="text-base font-semibold text-dark">
                        Expires {defaultCard.expiryDate}
                    </span>
                </div>
            ) : (
                <div className="pt-6">
                    <p className="text-sm text-lightText italic">No payment method saved</p>
                    <button onClick={() => navigate('/payments')} className="mt-4 text-xs font-bold text-primary hover:underline underline-offset-4 uppercase tracking-widest">Add Card</button>
                </div>
            )
        },
        {
            id: 'support',
            title: 'SUPPORT & HELP',
            icon: <HiOutlineQuestionMarkCircle className="text-xl" />,
            content: (
                <div className="pt-4 divide-y divide-border/50">
                    <button onClick={() => navigate('/support')} className="flex items-center justify-between w-full py-5 group/btn">
                        <span className="text-lg font-bold text-dark group-hover/btn:text-primary transition-colors">Contact Customer Care</span>
                        <HiChevronRight className="text-lightText text-xl group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                    <button onClick={() => navigate('/support')} className="flex items-center justify-between w-full py-5 group/btn">
                        <span className="text-lg font-bold text-dark group-hover/btn:text-primary transition-colors">Help Center & FAQ</span>
                        <HiChevronRight className="text-lightText text-xl group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            )
        },
        {
            id: 'device',
            title: 'SECURITY & SESSIONS',
            icon: <HiOutlineDevicePhoneMobile className="text-xl" />,
            content: (
                <div className="pt-6 space-y-6">
                    {sessionsLoading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                        </div>
                    ) : sessions.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-lightText/60">No active sessions found</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <div key={session._id} className="flex items-center justify-between pb-6 last:mb-0 last:pb-0 border-b border-border/40 last:border-0 group/session">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${session.isCurrent ? 'bg-primary text-white' : 'bg-mainBG text-lightText group-hover/session:bg-gray-100'}`}>
                                        {session.deviceType === 'Desktop' ? <HiOutlineGlobeAlt className="text-2xl" /> : <HiOutlineDevicePhoneMobile className="text-2xl" />}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="text-lg font-bold text-dark truncate capitalize">{session.os === 'Unknown' ? 'Web Session' : session.os} ({session.browser})</p>
                                            {session.isCurrent && <span className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider shrink-0">Current</span>}
                                        </div>
                                        <p className="text-sm text-lightText/60 mt-0.5">
                                            {session.isCurrent ? 'Online Now' : formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })} • {session.ip}
                                        </p>
                                    </div>
                                </div>
                                {!session.isCurrent && (
                                    <button 
                                        onClick={() => handleRevokeSession(session._id)}
                                        className="px-6 py-2 border text-black border-border text-[10px] font-bold tracking-widest uppercase hover:bg-red-50 hover:text-red-500 hover:border-red-500/20 transition-all active:scale-95"
                                    >
                                        Log Out
                                    </button>
                                )}
                            </div>
                        ))
                    )}
                    <div className="flex flex-col items-center gap-4 pt-10 border-t border-border/40">
                        <button 
                            onClick={handleLogoutAll}
                            className="w-full py-4 bg-dark text-white text-xs font-bold tracking-[0.2em] uppercase hover:bg-primary transition-colors shadow-lg"
                        >
                            Sign Out of All Devices
                        </button>
                        <button 
                            onClick={handleDeleteAccount}
                            className="text-red-500 text-xs font-bold tracking-[0.2em] uppercase hover:underline decoration-red-500/30 underline-offset-8 transition-all"
                        >
                            Delete Account Permanently
                        </button>
                    </div>
                </div>
            )
        }
    ];

    return (
        <AccountLayout>
            <div className="max-w-4xl pb-20">
                <div className="mb-12">
                    <h1 className="text-5xl md:text-6xl font-black text-dark tracking-tighter mb-4">Settings</h1>
                    <p className="text-lightText/60 font-medium text-lg">Manage your account preferences, security and notifications.</p>
                </div>

                <div className="grid grid-cols-1 gap-10">
                    {sections.map((section) => (
                        <div key={section.id} className="bg-white border-l-4 border-l-transparent hover:border-l-primary border border-border p-8 md:p-10 shadow-sm transition-all duration-300 group overflow-hidden">
                            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-mainBG flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                        {section.icon}
                                    </div>
                                    <h2 className="text-xs font-black tracking-[0.3em] text-dark uppercase">{section.title}</h2>
                                </div>
                                {section.href && (
                                    <button
                                        onClick={() => navigate(section.href)}
                                        className="w-10 h-10 flex items-center justify-center text-dark hover:text-primary hover:bg-mainBG transition-all"
                                    >
                                        <HiArrowUpRight className="text-2xl" />
                                    </button>
                                )}
                            </div>

                            <div className="relative z-10">
                                {section.content}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AccountLayout>
    );
}
