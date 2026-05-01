import React, { useState } from 'react';
import {
    MdSettings, MdStore, MdEmail, MdPayment, MdLocalShipping,
    MdNotifications, MdSecurity, MdPalette, MdCode, MdSave,
    MdRefresh, MdCheckCircle
} from 'react-icons/md';
import toast from 'react-hot-toast';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');
    const [saving, setSaving] = useState(false);

    // General Settings
    const [generalSettings, setGeneralSettings] = useState({
        storeName: 'EO Studio',
        storeEmail: 'admin@eostudio.com',
        storePhone: '+1 234 567 8900',
        storeAddress: '123 Fashion Street, New York, NY 10001',
        currency: 'USD',
        timezone: 'America/New_York',
        language: 'en',
    });

    // Email Settings
    const [emailSettings, setEmailSettings] = useState({
        smtpHost: 'smtp.gmail.com',
        smtpPort: '587',
        smtpUser: '',
        smtpPassword: '',
        fromEmail: 'noreply@eostudio.com',
        fromName: 'EO Studio',
    });

    // Payment Settings
    const [paymentSettings, setPaymentSettings] = useState({
        stripeEnabled: true,
        stripePublishableKey: process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || '',
        stripeSecretKey: '',
        paypalEnabled: false,
        paypalClientId: '',
        paypalSecret: '',
    });

    // Shipping Settings
    const [shippingSettings, setShippingSettings] = useState({
        freeShippingThreshold: 100,
        standardShippingCost: 25,
        expressShippingCost: 50,
        internationalShippingCost: 75,
        estimatedDeliveryDays: '5-7',
    });

    // Notification Settings
    const [notificationSettings, setNotificationSettings] = useState({
        orderConfirmation: true,
        orderShipped: true,
        orderDelivered: true,
        lowStockAlert: true,
        newCustomerAlert: true,
        dailySalesReport: false,
    });

    const handleSave = async (section) => {
        setSaving(true);
        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success(`${section} settings saved successfully!`);
        } catch (error) {
            toast.error('Failed to save settings');
        } finally {
            setSaving(false);
        }
    };

    const tabs = [
        { id: 'general', label: 'General', icon: <MdStore size={20} /> },
        { id: 'email', label: 'Email', icon: <MdEmail size={20} /> },
        { id: 'payment', label: 'Payment', icon: <MdPayment size={20} /> },
        { id: 'shipping', label: 'Shipping', icon: <MdLocalShipping size={20} /> },
        { id: 'notifications', label: 'Notifications', icon: <MdNotifications size={20} /> },
    ];

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
                    <p className="text-slate-500 text-sm">Manage your store configuration and preferences</p>
                </div>
                <button
                    onClick={() => window.location.reload()}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                >
                    <MdRefresh size={20} />
                    Reset
                </button>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                <div className="border-b border-slate-200 overflow-x-auto">
                    <div className="flex">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-semibold text-sm whitespace-nowrap transition-all ${
                                    activeTab === tab.id
                                        ? 'text-black border-b-2 border-black bg-slate-50'
                                        : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'
                                }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="p-8">
                    {/* General Settings */}
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Store Information</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Store Name
                                        </label>
                                        <input
                                            type="text"
                                            value={generalSettings.storeName}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, storeName: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Store Email
                                        </label>
                                        <input
                                            type="email"
                                            value={generalSettings.storeEmail}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, storeEmail: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Store Phone
                                        </label>
                                        <input
                                            type="tel"
                                            value={generalSettings.storePhone}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, storePhone: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Currency
                                        </label>
                                        <select
                                            value={generalSettings.currency}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, currency: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="AUD">AUD - Australian Dollar</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Store Address
                                        </label>
                                        <textarea
                                            value={generalSettings.storeAddress}
                                            onChange={(e) => setGeneralSettings({ ...generalSettings, storeAddress: e.target.value })}
                                            rows={3}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => handleSave('General')}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Email Settings */}
                    {activeTab === 'email' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">SMTP Configuration</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            SMTP Host
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.smtpHost}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpHost: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            SMTP Port
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.smtpPort}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPort: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            SMTP Username
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.smtpUser}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpUser: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            SMTP Password
                                        </label>
                                        <input
                                            type="password"
                                            value={emailSettings.smtpPassword}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, smtpPassword: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            From Email
                                        </label>
                                        <input
                                            type="email"
                                            value={emailSettings.fromEmail}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, fromEmail: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            From Name
                                        </label>
                                        <input
                                            type="text"
                                            value={emailSettings.fromName}
                                            onChange={(e) => setEmailSettings({ ...emailSettings, fromName: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => handleSave('Email')}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Payment Settings */}
                    {activeTab === 'payment' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Stripe Configuration</h3>
                                <div className="space-y-4">
                                    <label className="flex items-center gap-3 p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors">
                                        <input
                                            type="checkbox"
                                            checked={paymentSettings.stripeEnabled}
                                            onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeEnabled: e.target.checked })}
                                            className="w-5 h-5"
                                        />
                                        <div>
                                            <p className="font-semibold text-slate-900">Enable Stripe Payments</p>
                                            <p className="text-xs text-slate-500">Accept credit and debit card payments</p>
                                        </div>
                                    </label>

                                    {paymentSettings.stripeEnabled && (
                                        <div className="grid grid-cols-1 gap-4 pl-8">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Publishable Key
                                                </label>
                                                <input
                                                    type="text"
                                                    value={paymentSettings.stripePublishableKey}
                                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, stripePublishableKey: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-mono text-sm"
                                                    placeholder="pk_test_..."
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                                    Secret Key
                                                </label>
                                                <input
                                                    type="password"
                                                    value={paymentSettings.stripeSecretKey}
                                                    onChange={(e) => setPaymentSettings({ ...paymentSettings, stripeSecretKey: e.target.value })}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all font-mono text-sm"
                                                    placeholder="sk_test_..."
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => handleSave('Payment')}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Shipping Settings */}
                    {activeTab === 'shipping' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping Rates</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Free Shipping Threshold ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={shippingSettings.freeShippingThreshold}
                                            onChange={(e) => setShippingSettings({ ...shippingSettings, freeShippingThreshold: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Standard Shipping ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={shippingSettings.standardShippingCost}
                                            onChange={(e) => setShippingSettings({ ...shippingSettings, standardShippingCost: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Express Shipping ($)
                                        </label>
                                        <input
                                            type="number"
                                            value={shippingSettings.expressShippingCost}
                                            onChange={(e) => setShippingSettings({ ...shippingSettings, expressShippingCost: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-2">
                                            Estimated Delivery (days)
                                        </label>
                                        <input
                                            type="text"
                                            value={shippingSettings.estimatedDeliveryDays}
                                            onChange={(e) => setShippingSettings({ ...shippingSettings, estimatedDeliveryDays: e.target.value })}
                                            className="w-full px-4 py-2.5 border border-slate-200 rounded-xl outline-none focus:border-black focus:ring-4 focus:ring-black/5 transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => handleSave('Shipping')}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Notification Settings */}
                    {activeTab === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-4">Email Notifications</h3>
                                <div className="space-y-3">
                                    {Object.entries(notificationSettings).map(([key, value]) => (
                                        <label
                                            key={key}
                                            className="flex items-center justify-between p-4 border border-slate-200 rounded-xl cursor-pointer hover:border-slate-300 transition-colors"
                                        >
                                            <div>
                                                <p className="font-semibold text-slate-900 capitalize">
                                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {key === 'orderConfirmation' && 'Send email when order is placed'}
                                                    {key === 'orderShipped' && 'Send email when order is shipped'}
                                                    {key === 'orderDelivered' && 'Send email when order is delivered'}
                                                    {key === 'lowStockAlert' && 'Alert when product stock is low'}
                                                    {key === 'newCustomerAlert' && 'Alert when new customer registers'}
                                                    {key === 'dailySalesReport' && 'Receive daily sales summary'}
                                                </p>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="checkbox"
                                                    checked={value}
                                                    onChange={(e) => setNotificationSettings({ ...notificationSettings, [key]: e.target.checked })}
                                                    className="sr-only peer"
                                                />
                                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-black/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="pt-6 border-t border-slate-200">
                                <button
                                    onClick={() => handleSave('Notification')}
                                    disabled={saving}
                                    className="flex items-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-bold hover:bg-slate-800 transition-all disabled:opacity-50"
                                >
                                    {saving ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <MdSave size={20} />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
