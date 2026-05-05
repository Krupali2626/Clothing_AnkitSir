import React, { useEffect } from 'react'
import * as Yup from 'yup';
import { useFormik } from 'formik';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { addSavedCard } from '../../redux/slice/paymentCard.slice';

const validationSchema = Yup.object({
    cardNumber: Yup.string()
        .test('len', 'Card number must be exactly 16 digits', val => val?.replace(/\s/g, '').length === 16)
        .required('Card number is required'),
    cardHolderName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Card holder name is required'),
    expiryDate: Yup.string()
        .matches(/^(0[1-9]|1[0-2])\/([0-9]{2})$/, 'Expiry date must be in MM/YY format')
        .test('future-date', 'Card has expired', (value) => {
            if (!value) return false;
            const [month, year] = value.split('/').map(num => parseInt(num, 10));
            if (!month || isNaN(year)) return false;

            const now = new Date();
            const currentMonth = now.getMonth() + 1; // 1-12
            const currentYear = parseInt(now.getFullYear().toString().slice(-2), 10);

            if (year > currentYear) return true;
            if (year === currentYear && month >= currentMonth) return true;
            return false;
        })
        .required('Expiry date is required'),
    cvv: Yup.string()
        .matches(/^[0-9]{3}$/, 'CVV must be exactly 3 digits')
        .required('CVV is required'),
});

const emptyInitialValues = {
    cardNumber: '',
    cardHolderName: '',
    expiryDate: '',
    cvv: '',
    isDefault: false,
};

export default function PaymentCardSidebar({ isOpen, onClose, editPayment = null }) {
    const dispatch = useDispatch();
    const { actionLoading } = useSelector((state) => state.payment);

    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const parts = [];
        for (let i = 0; i < v.length; i += 4) {
            parts.push(v.slice(i, i + 4));
        }
        return parts.join(' ').slice(0, 19); // 16 digits + 3 spaces
    };

    const formik = useFormik({
        initialValues: emptyInitialValues,
        validationSchema,
        onSubmit: async (values) => {
            const cardData = {
                cardNumber: values.cardNumber.replace(/\s/g, ''),
                cardHolderName: values.cardHolderName,
                expiryDate: values.expiryDate,
                cvv: values.cvv,
            };

            await dispatch(addSavedCard({ cardData, setAsDefault: values.isDefault }));
            onClose();
            formik.resetForm();
        },
    });

    const formatExpiryDate = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length > 2) {
            return `${v.slice(0, 2)}/${v.slice(2, 4)}`;
        }
        return v;
    };

    const handleCardNumberChange = (e) => {
        const formattedValue = formatCardNumber(e.target.value);
        formik.setFieldValue('cardNumber', formattedValue);
    };

    const handleExpiryDateChange = (e) => {
        const formattedValue = formatExpiryDate(e.target.value);
        formik.setFieldValue('expiryDate', formattedValue);
    };

    // Reset form when opening or changing editPayment
    useEffect(() => {
        if (isOpen) {
            formik.resetForm({ values: emptyInitialValues });
        }
    }, [isOpen, editPayment]);

    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop — below header z-50 */}
            <div
                className="fixed inset-0 bg-black/50 z-[60]"
                onClick={onClose}
            />
            {/* Panel — right-side drawer, below header */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-[70] flex flex-col shadow-2xl transition-transform duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-5">
                    <h2 className="text-xl font-bold text-dark">
                        {editPayment ? 'Edit Payment' : 'Add Card'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-dark hover:opacity-60 transition-opacity"
                        aria-label="Close"
                    >
                        <IoClose className="text-2xl" />
                    </button>
                </div>

                {/* Scrollable form body */}
                <div className="flex-1 overflow-y-auto px-7 pb-6">
                    <form onSubmit={formik.handleSubmit} className="space-y-6">

                        {/* Card Number */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-primary">
                                Card Number
                            </label>
                            <input
                                type="tel"
                                name="cardNumber"
                                value={formik.values.cardNumber}
                                onChange={handleCardNumberChange}
                                onBlur={formik.handleBlur}
                                placeholder="0000 0000 0000 0000"
                                maxLength={19}
                                className={`w-full border-b ${formik.touched.cardNumber && formik.errors.cardNumber
                                    ? 'border-red-400'
                                    : 'border-border'
                                    } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                            />
                            {formik.touched.cardNumber && formik.errors.cardNumber && (
                                <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.cardNumber}</p>
                            )}
                        </div>

                        {/* Card Holder Name */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-primary">
                                Card Holder Name
                            </label>
                            <input
                                type="text"
                                name="cardHolderName"
                                value={formik.values.cardHolderName}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="john doe"
                                className={`w-full border-b ${formik.touched.cardHolderName && formik.errors.cardHolderName
                                    ? 'border-red-400'
                                    : 'border-border'
                                    } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                            />
                            {formik.touched.cardHolderName && formik.errors.cardHolderName && (
                                <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.cardHolderName}</p>
                            )}
                        </div>

                        {/* Expiry Date / CVV */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-primary">
                                    Expiry Date
                                </label>
                                <input
                                    type="text"
                                    name="expiryDate"
                                    value={formik.values.expiryDate}
                                    onChange={handleExpiryDateChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="MM/YY"
                                    maxLength={5}
                                    className={`w-full border-b ${formik.touched.expiryDate && formik.errors.expiryDate
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base text-dark placeholder:text-lightText font-semibold focus:outline-none focus:border-primary bg-transparent`}
                                />
                                {formik.touched.expiryDate && formik.errors.expiryDate && (
                                    <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.expiryDate}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-primary">
                                    CVV
                                </label>
                                <input
                                    type="password"
                                    name="cvv"
                                    value={formik.values.cvv}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="***"
                                    maxLength={3}
                                    className={`w-full border-b ${formik.touched.cvv && formik.errors.cvv
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base text-dark placeholder:text-lightText focus:outline-none font-semibold focus:border-primary bg-transparent`}
                                />
                                {formik.touched.cvv && formik.errors.cvv && (
                                    <p className="text-xs text-red-500 font-medium mt-1">{formik.errors.cvv}</p>
                                )}
                            </div>
                        </div>

                        {/* Set as default */}
                        <label className="flex items-start gap-3 cursor-pointer group pt-2">
                            <span
                                className={`mt-0.5 w-5 h-5 shrink-0 border flex items-center justify-center transition-colors ${formik.values.isDefault
                                    ? 'border-primary bg-primary'
                                    : 'border-dark bg-white'
                                    }`}
                            >
                                {formik.values.isDefault && (
                                    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 10 8">
                                        <path d="M1 4l3 3 5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                            <input
                                type="checkbox"
                                name="isDefault"
                                checked={formik.values.isDefault}
                                onChange={formik.handleChange}
                                className="sr-only"
                            />
                            <div>
                                <p className="text-sm font-semibold text-dark">Set as default card</p>
                                <p className="text-xs font-medium text-lightText mt-0.5">Used as your primary payment method</p>
                            </div>
                        </label>
                    </form>
                </div>

                {/* Security Message */}
                <div className="px-7 py-4 flex items-center justify-center gap-2 text-lightText">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-xs font-medium">Your card details are safe and secure</span>
                </div>

                {/* Footer — Save button */}
                <div className="px-7 py-5">
                    <button
                        type="button"
                        onClick={formik.handleSubmit}
                        disabled={actionLoading}
                        className="w-full bg-primary text-white text-sm font-bold py-4 tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {actionLoading ? 'Saving...' : editPayment ? 'Update Card' : 'Add Card'}
                    </button>
                </div>
            </div>
        </>
    )
}