import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchNotifications, markAsRead, markAllAsRead, deleteNotification } from '../redux/slice/notification.slice';
import { formatDistanceToNow } from 'date-fns';
import { Link, useNavigate } from 'react-router-dom';
import { HiOutlineBell, HiArrowUpRight } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";

export default function NotificationsPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notifications, unreadCount, loading } = useSelector((state) => state.notification);
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!user) {
            navigate('/auth');
        } else {
            dispatch(fetchNotifications());
        }
    }, [dispatch, user, navigate]);

    const handleClearAll = () => {
        // Since there's no clearAll endpoint, we iterate and delete
        notifications.forEach(n => {
            dispatch(deleteNotification(n._id));
        });
    };

    return (
        <div className="pt-32 pb-24 min-h-[70vh] bg-white">
            <div className="px-4 md:px-10 flex flex-col md:flex-row justify-between items-start md:items-end mb-10 pb-6 border-b border-border">
                <div>
                    <h1 className="text-3xl md:text-5xl font-black text-dark tracking-tighter uppercase mb-4">
                        Notification Center
                    </h1>
                    <p className="text-sm md:text-base text-lightText font-light flex items-center gap-2">
                        Stay updated on your orders and exclusive offers.
                        {unreadCount > 0 && (
                            <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-0.5 rounded ml-2">
                                {unreadCount} NEW
                            </span>
                        )}
                    </p>
                </div>
                
                {notifications.length > 0 && (
                    <div className="flex gap-6 mt-6 md:mt-0">
                        <button 
                            onClick={() => dispatch(markAllAsRead())} 
                            className="text-xs font-bold text-primary uppercase tracking-widest hover:text-dark transition-colors"
                        >
                            Mark all as read
                        </button>
                        <button 
                            onClick={handleClearAll}
                            className="text-xs font-bold text-lightText/60 uppercase tracking-widest hover:text-red-500 transition-colors"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            <div className="bg-white px-4 md:px-10">
                {loading && notifications.length === 0 ? (
                    <div className="p-10 space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse flex gap-4 p-4">
                                <div className="w-3 h-3 bg-mainBG rounded-full mt-1"></div>
                                <div className="flex-1 space-y-3">
                                    <div className="h-4 bg-mainBG w-1/4"></div>
                                    <div className="h-3 bg-mainBG w-3/4"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : notifications.length > 0 ? (
                    <div className="divide-y divide-border/40">
                        {notifications.map((notification) => (
                            <div
                                key={notification._id}
                                className={`p-6 md:p-8 transition-colors relative group/noti flex items-start gap-4 md:gap-6 ${!notification.isRead ? 'bg-primary/5' : 'hover:bg-mainBG/30'}`}
                                onClick={() => dispatch(markAsRead(notification._id))}
                            >
                                <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${notification.isRead ? 'bg-transparent' : 'bg-primary pulse-small'}`} />
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-2 gap-2">
                                        <h4 className="text-base md:text-lg font-bold text-dark truncate pr-4">{notification.title}</h4>
                                        <span className="text-xs text-lightText/60 font-medium whitespace-nowrap">
                                            {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm md:text-base text-lightText leading-relaxed mb-4 max-w-3xl">{notification.message}</p>
                                    
                                    {notification.metadata?.orderId && (
                                        <Link
                                            to={`/orders/${notification.metadata.orderId}`}
                                            className="inline-flex items-center gap-2 text-xs font-bold text-primary uppercase tracking-widest hover:gap-3 transition-all"
                                        >
                                            View Order Details <HiArrowUpRight />
                                        </Link>
                                    )}
                                </div>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        dispatch(deleteNotification(notification._id));
                                    }}
                                    className="p-2 text-lightText hover:text-red-500 transition-all opacity-50 hover:opacity-100"
                                >
                                    <IoClose size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-24 flex flex-col items-center justify-center text-center px-4">
                        <div className="w-24 h-24 bg-mainBG/50 rounded-full flex items-center justify-center mb-8">
                            <HiOutlineBell className="text-5xl text-lightText/30" />
                        </div>
                        <h4 className="text-2xl font-bold text-dark mb-4">No new notifications</h4>
                        <p className="text-base text-lightText/60 leading-relaxed max-w-md">
                            You're all caught up! We'll notify you when something important happens, like order updates or exclusive offers.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
