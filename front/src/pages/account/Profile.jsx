import { useSelector } from 'react-redux';
import AccountLayout from './AccountLayout';
import { HiOutlineCheckCircle } from 'react-icons/hi';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';
import { Link } from 'react-router-dom';

const ArrowUpRight = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 17 17 7M7 7h10v10" />
    </svg>
);

export default function Profile() {
    const { user } = useSelector((state) => state.auth);

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).getFullYear()
        : new Date().getFullYear();

    const defaultAddress = user?.address?.find(
        (a) => String(a._id) === String(user?.selectedAddress)
    ) || user?.address?.[0] || null;

    const addressLine = defaultAddress
        ? [
            defaultAddress.address,
            defaultAddress.aptSuite,
            defaultAddress.city,
            defaultAddress.state,
            defaultAddress.zipcode,
        ].filter(Boolean).join(', ')
        : null;

    const defaultCard = user?.savedCards?.find(
        (c) => String(c._id) === String(user?.selectedCard)
    ) || user?.savedCards?.[0] || null;

    return (
        <AccountLayout>
            {/* Page Title */}
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-[28px] font-semibold text-primary ">Profile</h1>
                <div className="bg-primary uppercase py-2 px-6 text-base font-semibold">
                    EDIT
                </div>
            </div>

            {/* ── Personal Information ── */}
            <div className="mb-10">
                <p className="text-base font-semibold tracking-widest text-mainText uppercase mb-5">
                    Personal Information (Member since {memberSince})
                </p>

                {/* Row 1: First Name / Last Name */}
                <div className="grid grid-cols-2 gap-x-10 mb-6">
                    <div className="border-b border-border pb-3">
                        <p className={`text-sm ${user?.firstName ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>First Name</p>
                        <p className={`text-lg font-medium ${user?.firstName ? 'text-primary' : 'text-lightText'}`}>
                            {user?.firstName || <span className="text-primary">—</span>}
                        </p>
                    </div>
                    <div className="border-b border-border pb-3">
                        <p className={`text-sm ${user?.lastName ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>Last Name</p>
                        <p className={`text-lg font-medium ${user?.lastName ? 'text-primary' : 'text-lightText'}`}>
                            {user?.lastName || <span className="text-primary">—</span>}
                        </p>
                    </div>
                </div>

                {/* Row 2: Contact / Email */}
                <div className="grid grid-cols-2 gap-x-10">
                    {/* Contact Number */}
                    <div className="">
                        <div className="border-b border-border pb-3">
                            <p className={`text-sm ${user?.mobileNo ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>Contact Number</p>
                            <div className="flex items-center justify-between">
                                <p className={`text-lg font-medium ${user?.mobileNo ? 'text-primary' : 'text-lightText'}`}>
                                    {user?.mobileNo
                                        ? `+1 ${user.mobileNo}`
                                        : <span className="text-lightText">Not added yet</span>}
                                </p>
                                {user?.verified && (
                                    <span className="flex items-center gap-1 text-base font-semibold text-primary tracking-widest uppercase">
                                        <HiOutlineCheckCircle className="text-base text-[#009951]" />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Email Address */}
                    <div className="">
                        <div className="border-b border-border pb-3">
                            <p className={`text-sm ${user?.email ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>Email Address</p>
                            {user?.email ? (
                                <div className="flex items-center justify-between">
                                    <p className={`text-lg font-medium ${user?.email ? 'text-primary' : 'text-lightText'}`}>{user.email}</p>
                                    {user?.emailVerified ? (
                                        <span className="flex items-center gap-1 text-[11px] font-semibold text-primary tracking-widest uppercase">
                                            <HiOutlineCheckCircle className="text-sm" />
                                            Verified
                                        </span>
                                    ) : (
                                        <button className="flex items-center gap-1 text-base font-semibold text-gold tracking-widest uppercase hover:opacity-80 transition-opacity">
                                            <HiOutlineExclamationTriangle className="text-base" />
                                            Verify
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-lg text-lightText">Not added yet</p>
                                    </div>
                                    <button className="flex items-center gap-1 text-base font-semibold text-mainText tracking-widest uppercase hover:opacity-80 transition-opacity mt-0.5">
                                        <HiOutlineExclamationTriangle className="text-base text-gold" />
                                        Verify
                                    </button>
                                </div>
                            )}
                        </div>
                        <p className="text-base text-lightText mt-1">Add your email for order updates.</p>
                    </div>
                </div>
            </div>

            {/* ── Default Address ── */}
            <div className="mb-10">
                <div className="grid grid-cols-2 gap-x-10">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-base font-semibold tracking-normal text-mainText uppercase">
                            Default Address (Preview)
                        </p>
                        <Link to="/addresses"
                            className="flex items-center gap-1 text-base font-semibold tracking-widest text-mainText uppercase hover:text-primary transition-colors">
                            Manage <ArrowUpRight className='' />
                        </Link>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-x-10">
                    <div className="border-b border-border pb-3">
                        <p className={`text-sm ${user?.addressLine ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>Address</p>
                        {addressLine ? (
                            <p className="text-lg font-medium text-primary">{addressLine}</p>
                        ) : (
                            <p className="text-lg text-lightText">No address saved yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Payment Preview ── */}
            <div>
                <div className="grid grid-cols-2 gap-x-10">
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-base font-semibold tracking-normal text-mainText uppercase">
                            Payment (Preview)
                        </p>
                        <Link to="/payments"
                            className="flex items-center gap-1 text-base font-semibold tracking-widest text-mainText uppercase hover:text-primary transition-colors">
                            View <ArrowUpRight />
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-x-10">
                    <div className="border-b border-border pb-3">
                        <p className={`text-sm ${defaultCard ? 'text-lightText' : 'text-primary'} mb-1 font-bold`}>Payment</p>
                        {defaultCard ? (
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="bg-[#1A1F71] text-white text-[10px] font-extrabold px-2 py-1 rounded-sm uppercase tracking-wider">
                                        {defaultCard.cardType || 'Card'}
                                    </div>
                                    <span className="text-sm font-medium text-dark">
                                        ···· {defaultCard.cardNumber?.slice(-4)}
                                    </span>
                                </div>
                                <span className="text-sm text-lightText">
                                    Expires {defaultCard.expiryDate}
                                </span>
                            </div>
                        ) : (
                            <p className="text-lg text-lightText">No payment method saved yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </AccountLayout>
    );
}
