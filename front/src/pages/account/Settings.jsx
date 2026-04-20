import { useState, useEffect } from 'react';
import AccountLayout from './AccountLayout';
import { HiArrowUpRight } from 'react-icons/hi2';
import { HiChevronRight } from 'react-icons/hi2';
import { useSelector, useDispatch } from 'react-redux';
import { RiVisaLine, RiMastercardLine } from 'react-icons/ri';
import { SiAmericanexpress } from 'react-icons/si';
import { HiOutlineBell, HiOutlineCreditCard, HiOutlineQuestionMarkCircle, HiOutlineDevicePhoneMobile, HiOutlineGlobeAlt, HiOutlineShieldCheck } from 'react-icons/hi2';
import { fetchSavedCards } from '../../redux/slice/paymentCard.slice';
import { updateProfile, logoutUser, fetchSessions, revokeSession, logoutAllDevices } from '../../redux/slice/auth.slice';
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
        accountActivity: false
    });

    useEffect(() => {
        if (user?.notificationPreferences) {
            setNotifications(user.notificationPreferences);
        }
    }, [user?.notificationPreferences]);

    useEffect(() => {
        dispatch(fetchSavedCards());
        dispatch(fetchSessions());
    }, [dispatch]);

    const toggleNotification = async (key) => {
        const oldValue = notifications[key];
        const newValue = !oldValue;
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
            setNotifications(prev => ({ ...prev, [key]: oldValue }));
            toast.error('Failed to update settings');
        }
    };

    const handleDeleteAccount = () => {
        toast.error("Account deletion is disabled for demo purposes");
    };

    const handleRevokeSession = async (sessionId) => {
        try {
            await dispatch(revokeSession(sessionId)).unwrap();
            toast.success('Device logged out successfully');
            dispatch(fetchSessions());
        } catch (error) {
            toast.error(error?.message || 'Failed to logout device');
        }
    };

    const defaultCard = cards.find(c => c._id === selectedCardId) || cards[0];

    const getCardBadge = (type) => {
        const t = type?.toLowerCase();
        if (t?.includes('visa')) return (
            <span className="inline-flex items-center gap-1 bg-[#1a1f71] text-white text-xs font-bold px-3 py-1 rounded">
                <RiVisaLine className="text-base" /> VISA
            </span>
        );
        if (t?.includes('master')) return (
            <span className="inline-flex items-center gap-1 bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded">
                <RiMastercardLine className="text-base" /> Mastercard
            </span>
        );
        if (t?.includes('amex') || t?.includes('american')) return (
            <span className="inline-flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded">
                <SiAmericanexpress className="text-base" /> Amex
            </span>
        );
        return (
            <span className="inline-flex items-center gap-1 bg-border/50 text-dark text-xs font-bold px-3 py-1 rounded">
                <HiOutlineCreditCard className="text-base" /> Card
            </span>
        );
    };

    // Toggle switch styled to match image (dark teal when on)
    const Toggle = ({ checked, onChange }) => (
        <button
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${checked ? 'bg-primary' : 'bg-border'}`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`}
            />
        </button>
    );

    return (
        <AccountLayout>
            <div className="max-w-2xl">
                {/* Page title */}
                <div className="flex justify-between items-center md:mb-8 mb-4">
                    <h1 className="text-2xl md:text-[28px] font-semibold text-primary">Settings</h1>
                </div>

                <div className="space-y-4">
                    {/* NOTIFICATION */}
                    <div className="bg-white shadow-sm overflow-hidden">
                        <div className="flex items-center gap-2 mx-6 pt-5 pb-4 border-b border-border">
                            <HiOutlineBell className="text-mainText text-lg" />
                            <span className="text-sm md:text-base font-semibold tracking-widest text-mainText uppercase">Notification</span>
                        </div>
                        <div className="px-6 py-2">
                            {[
                                { id: 'orderUpdates', label: 'Order Updates', desc: 'Get updates when your order is confirmed and processed' },
                                { id: 'deliveryUpdates', label: 'Delivery Updates', desc: 'Track shipping status and delivery progress in real time' },
                                { id: 'paymentAlerts', label: 'Payment Alerts', desc: 'Get notified about successful and failed transactions' },
                                { id: 'accountActivity', label: 'Account Activity', desc: 'Stay informed about login activity and account changes' },
                            ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between py-4 gap-2 md:gap-4">
                                    <div className="flex-1">
                                        <p className="text-sm md:text-base font-medium text-dark">{item.label}</p>
                                        <p className="text-[12px] md:text-sm font-medium text-lightText mt-0.5">{item.desc}</p>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <Toggle
                                            checked={notifications[item.id]}
                                            onChange={() => toggleNotification(item.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* MANAGE PAYMENT */}
                    <div className="bg-white overflow-hidden">
                        <div className="flex items-center justify-between mx-6 pt-5 pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <HiOutlineCreditCard className="text-dark text-lg" />
                                <span className="text-sm md:text-base font-semibold tracking-wide text-mainText uppercase">Manage Payment</span>
                            </div>
                            <button
                                onClick={() => navigate('/payments')}
                                className="text-mainText hover:text-mainText transition-colors"
                            >
                                <HiArrowUpRight className="text-lg" />
                            </button>
                        </div>
                        <div className="px-6 py-5">
                            {defaultCard ? (
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        {getCardBadge(defaultCard.cardType)}
                                        <span className="text-sm md:text-base font-semibold text-dark tracking-widest leading-none">
                                            ···· {defaultCard.cardNumber.slice(-4)}
                                        </span>
                                    </div>
                                    <span className="text-sm md:text-base font-semibold text-dark leading-none">
                                        Expires {defaultCard.expiryDate}
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-lightText">No payment method saved</p>
                                    <button
                                        onClick={() => navigate('/payments')}
                                        className="text-xs font-semibold text-primary hover:underline underline-offset-4"
                                    >
                                        Add Card
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SUPPORT */}
                    <div className="bg-white overflow-hidden">
                        <div className="flex items-center justify-between mx-6 pt-5 pb-4 border-b border-border">
                            <div className="flex items-center gap-2">
                                <HiOutlineQuestionMarkCircle className="text-dark text-lg" />
                                <span className="text-sm md:text-base font-bold tracking-widest text-mainText uppercase">Support</span>
                            </div>
                            <button
                                onClick={() => navigate('/support')}
                                className="text-dark hover:text-primary transition-colors"
                            >
                                <HiArrowUpRight className="text-lg" />
                            </button>
                        </div>
                        <div>
                            <button
                                onClick={() => navigate('/support')}
                                className="flex items-center justify-between w-full px-6 py-4 hover:bg-mainBG transition-colors"
                            >
                                <span className="text-base font-medium text-dark">Contact Us</span>
                                <HiChevronRight className="text-lightText text-base" />
                            </button>
                            <button
                                onClick={() => navigate('/support')}
                                className="flex items-center justify-between w-full px-6 py-4 hover:bg-mainBG transition-colors"
                            >
                                <span className="text-base font-medium text-dark">Help Center</span>
                                <HiChevronRight className="text-lightText text-base" />
                            </button>
                        </div>
                    </div>

                    {/* DEVICE & LOGIN INFO */}
                    <div className="bg-white overflow-hidden">
                        <div className="flex items-center gap-2 mx-6 pt-5 pb-4 border-b border-border">
                            <HiOutlineShieldCheck className="text-dark text-lg" />
                            <span className="text-sm md:text-base font-bold tracking-widest text-mainText uppercase">Device &amp; Login Info</span>
                        </div>
                        <div className="px-6 py-2">
                            {sessionsLoading ? (
                                <div className="flex items-center justify-center py-10">
                                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
                                </div>
                            ) : sessions.length === 0 ? (
                                <p className="text-sm text-lightText py-6 text-center">No active sessions found</p>
                            ) : (
                                <div className="">
                                    {sessions.map((session) => (
                                        <div key={session._id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4 border-b border-border/50 last:border-0">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-12 h-12 relative flex items-center justify-center shrink-0 ${session.isCurrent ? 'text-primary' : 'text-lightText'}`}>
                                                    {session.deviceType === 'Desktop'
                                                        ? <HiOutlineGlobeAlt className="text-xl" />
                                                        : <HiOutlineDevicePhoneMobile className="text-xl" />
                                                    }
                                                    {session.isCurrent && (
                                                        <div className="h-2.5 w-2.5 rounded-full bg-green-500 absolute top-2 right-3 border-2 border-white"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className={`text-sm md:text-base font-semibold capitalize ${session.isCurrent ? 'text-dark' : 'text-lightText'}`}>
                                                        {session.os === 'Unknown' ? 'Web Browser' : session.os}
                                                    </p>
                                                    <p className="text-[12px] md:text-sm text-lightText mt-0.5">
                                                        {session.isCurrent
                                                            ? 'Last used: Today'
                                                            : `Last used: ${formatDistanceToNow(new Date(session.lastActive), { addSuffix: true })}`
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRevokeSession(session._id)}
                                                className="w-full sm:w-auto px-5 py-2 border border-[#EC221F] text-[#EC221F] text-xs md:text-sm font-semibold hover:bg-[#EC221F] hover:text-white transition-all duration-200"
                                            >
                                                Log Out
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Delete Account — centered at bottom */}
                        <div className="flex justify-center px-6 py-5">
                            <button
                                onClick={handleDeleteAccount}
                                className="text-sm font-medium text-red-500 hover:underline underline-offset-4"
                            >
                                Delete Account
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </AccountLayout>
    );
}
