import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoClose } from 'react-icons/io5';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { addAddress, updateAddress } from '../../redux/slice/address.slice';

const ADDRESS_TYPES = ['Home', 'Office', 'Other'];

const validationSchema = Yup.object({
    addressType: Yup.string().required('Required'),
    firstName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('First name is required'),
    lastName: Yup.string()
        .min(2, 'Too Short!')
        .max(50, 'Too Long!')
        .required('Last name is required'),
    phone: Yup.string()
        .matches(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits')
        .required('Contact number is required'),
    address: Yup.string().required('Address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipcode: Yup.string()
        .matches(/^[0-9]{5,6}$/, 'Must be a valid ZIP code')
        .required('ZIP code is required'),
    country: Yup.string().required('Country is required'),
});

const emptyInitialValues = {
    addressType: 'Home',
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    aptSuite: '',
    city: '',
    state: '',
    zipcode: '',
    country: 'India',
    isDefault: false,
};

export default function AddressSidebar({ isOpen, onClose, editAddress = null }) {
    const dispatch = useDispatch();
    const { actionLoading } = useSelector((state) => state.address);

    const formik = useFormik({
        initialValues: emptyInitialValues,
        validationSchema,
        enableReinitialize: true,
        onSubmit: async (values) => {
            const payload = {
                firstName: values.firstName,
                lastName: values.lastName,
                address: values.address,
                aptSuite: values.aptSuite,
                city: values.city,
                state: values.state,
                zipcode: values.zipcode,
                country: values.country,
                addressType: values.addressType,
                phone: values.phone,
            };

            let result;
            if (editAddress) {
                result = await dispatch(updateAddress({ addressId: editAddress._id, addressData: payload }));
            } else {
                result = await dispatch(addAddress({ addressData: payload, setAsDefault: values.isDefault }));
            }

            if (!result.error) {
                onClose();
            }
        },
    });

    // Populate form when editing
    useEffect(() => {
        if (isOpen) {
            if (editAddress) {
                formik.setValues({
                    addressType: editAddress.addressType || 'Home',
                    firstName: editAddress.firstName || '',
                    lastName: editAddress.lastName || '',
                    phone: editAddress.phone || '',
                    address: editAddress.address || '',
                    aptSuite: editAddress.aptSuite || '',
                    city: editAddress.city || '',
                    state: editAddress.state || '',
                    zipcode: editAddress.zipcode || '',
                    country: editAddress.country || 'India',
                    isDefault: false,
                });
            } else {
                formik.resetForm();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editAddress, isOpen]);

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
                className="fixed inset-0 bg-black/50 z-50"
                onClick={onClose}
            />
            {/* Panel — right-side drawer, below header */}
            <div className="fixed top-0 right-0 h-full w-full max-w-[480px] bg-white z-50 flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-7 pt-7 pb-5">
                    <h2 className="text-xl font-bold text-dark">
                        {editAddress ? 'Edit Address' : 'Add New Address'}
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

                        {/* Address Type */}
                        <div className="space-y-2">
                            <p className="text-sm font-bold text-primary">Address Type</p>
                            <div className="flex items-center gap-6">
                                {ADDRESS_TYPES.map((type) => (
                                    <label key={type} className="flex items-center gap-2 cursor-pointer">
                                        {/* Custom radio */}
                                        <span
                                            className={`w-[18px] h-[18px] rounded-full border flex items-center justify-center shrink-0 transition-colors ${formik.values.addressType === type
                                                ? 'border-dark'
                                                : 'border-dark'
                                                }`}
                                        >
                                            {formik.values.addressType === type && (
                                                <span className="w-3 h-3 rounded-full bg-dark" />
                                            )}
                                        </span>
                                        <input
                                            type="radio"
                                            name="addressType"
                                            value={type}
                                            checked={formik.values.addressType === type}
                                            onChange={formik.handleChange}
                                            className="sr-only"
                                        />
                                        <span className="text-sm font-medium text-lightText">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* First / Last Name */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-lightText">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formik.values.firstName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter first name"
                                    className={`w-full border-b ${formik.touched.firstName && formik.errors.firstName
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base text-dark placeholder:text-lightText font-semibold focus:outline-none focus:border-primary bg-transparent`}
                                />
                                {formik.touched.firstName && formik.errors.firstName && (
                                    <p className="text-xs text-red-500">{formik.errors.firstName}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-lightText">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formik.values.lastName}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter last name"
                                    className={`w-full border-b ${formik.touched.lastName && formik.errors.lastName
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base text-dark placeholder:text-lightText focus:outline-none font-semibold focus:border-primary bg-transparent`}
                                />
                                {formik.touched.lastName && formik.errors.lastName && (
                                    <p className="text-xs text-red-500">{formik.errors.lastName}</p>
                                )}
                            </div>
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-lightText">
                                Contact Number
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formik.values.phone}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter phone number"
                                className={`w-full border-b ${formik.touched.phone && formik.errors.phone
                                    ? 'border-red-400'
                                    : 'border-border'
                                    } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                                <p className="text-xs text-red-500">{formik.errors.phone}</p>
                            )}
                        </div>

                        {/* Address Line 1 */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-lightText">
                                Address Line 1
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={formik.values.address}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Street address, house number"
                                className={`w-full border-b ${formik.touched.address && formik.errors.address
                                    ? 'border-red-400'
                                    : 'border-border'
                                    } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                            />
                            {formik.touched.address && formik.errors.address && (
                                <p className="text-xs text-red-500">{formik.errors.address}</p>
                            )}
                        </div>

                        {/* Address Line 2 */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-lightText">
                                Address Line 2{' '}
                                <span className="font-bold text-lightText">(Optional)</span>
                            </label>
                            <input
                                type="text"
                                name="aptSuite"
                                value={formik.values.aptSuite}
                                onChange={formik.handleChange}
                                placeholder="Apartment, suite, etc."
                                className="w-full border-b border-border py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent"
                            />
                        </div>

                        {/* City / State */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-lightText">City</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={formik.values.city}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Enter city"
                                    className={`w-full border-b ${formik.touched.city && formik.errors.city
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                                />
                                {formik.touched.city && formik.errors.city && (
                                    <p className="text-xs text-red-500">{formik.errors.city}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-bold text-lightText">State</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={formik.values.state}
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    placeholder="Select state"
                                    className={`w-full border-b ${formik.touched.state && formik.errors.state
                                        ? 'border-red-400'
                                        : 'border-border'
                                        } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                                />
                                {formik.touched.state && formik.errors.state && (
                                    <p className="text-xs text-red-500">{formik.errors.state}</p>
                                )}
                            </div>
                        </div>

                        {/* ZIP Code */}
                        <div className="space-y-1">
                            <label className="block text-sm font-bold text-lightText">ZIP Code</label>
                            <input
                                type="text"
                                name="zipcode"
                                value={formik.values.zipcode}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                placeholder="Enter ZIP code"
                                className={`w-full border-b ${formik.touched.zipcode && formik.errors.zipcode
                                    ? 'border-red-400'
                                    : 'border-border'
                                    } py-2 text-base font-semibold text-dark placeholder:text-lightText focus:outline-none focus:border-primary bg-transparent`}
                            />
                            {formik.touched.zipcode && formik.errors.zipcode && (
                                <p className="text-xs text-red-500">{formik.errors.zipcode}</p>
                            )}
                        </div>

                        {/* Set as default */}
                        {!editAddress && (
                            <label className="flex items-start gap-3 cursor-pointer">
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
                                    <p className="text-base font-medium text-mainText">Set as default address</p>
                                    <p className="text-sm font-medium text-lightText mt-0.5">Used as your primary delivery address</p>
                                </div>
                            </label>
                        )}
                    </form>
                </div>

                {/* Footer — Save button */}
                <div className="px-7 py-5">
                    <button
                        type="button"
                        onClick={formik.handleSubmit}
                        disabled={actionLoading}
                        className="w-full bg-primary text-white text-sm font-bold py-4 tracking-widest uppercase hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {actionLoading ? 'Saving...' : editAddress ? 'Update Address' : 'Save Address'}
                    </button>
                </div>
            </div>
        </>
    );
}
