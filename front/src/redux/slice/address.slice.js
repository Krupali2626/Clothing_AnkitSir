import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    addresses: [],
    selectedAddressId: null,
    loading: false,
    actionLoading: false, // add / update / delete / select
    error: null,
};

const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

// Fetch all addresses
export const fetchAddresses = createAsyncThunk(
    'address/fetchAddresses',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/user/address/my');
            return response.data?.result;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Add new address (optionally set as default after creation)
export const addAddress = createAsyncThunk(
    'address/addAddress',
    async ({ addressData, setAsDefault = false }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/user/address/add', addressData);
            const user = response.data?.result;

            // If user wants this as default and it's not already auto-selected (first address)
            if (setAsDefault && user?.address?.length > 1) {
                const newAddr = user.address[user.address.length - 1];
                if (newAddr?._id) {
                    const selectResp = await axiosInstance.put(`/user/address/select/${newAddr._id}`);
                    return selectResp.data?.result;
                }
            }

            return user;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Update existing address
export const updateAddress = createAsyncThunk(
    'address/updateAddress',
    async ({ addressId, addressData }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/user/address/update/${addressId}`, addressData);
            return response.data?.result;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Delete address
export const deleteAddress = createAsyncThunk(
    'address/deleteAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.delete(`/user/address/delete/${addressId}`);
            return response.data?.result;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Set default / selected address
export const selectAddress = createAsyncThunk(
    'address/selectAddress',
    async (addressId, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/user/address/select/${addressId}`);
            return response.data?.result;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        clearAddressError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchAddresses
            .addCase(fetchAddresses.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAddresses.fulfilled, (state, action) => {
                state.loading = false;
                state.addresses = action.payload?.addresses || [];
                state.selectedAddressId = action.payload?.selectedAddressId || null;
            })
            .addCase(fetchAddresses.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch addresses';
            })

            // addAddress
            .addCase(addAddress.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(addAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                const user = action.payload;
                state.addresses = user?.address || [];
                state.selectedAddressId = user?.selectedAddress || null;
                toast.success('Address added successfully');
            })
            .addCase(addAddress.rejected, (state, action) => {
                state.actionLoading = false;
                toast.error(action.payload?.message || 'Failed to add address');
            })

            // updateAddress
            .addCase(updateAddress.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(updateAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                const user = action.payload;
                state.addresses = user?.address || [];
                state.selectedAddressId = user?.selectedAddress || null;
                toast.success('Address updated successfully');
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.actionLoading = false;
                toast.error(action.payload?.message || 'Failed to update address');
            })

            // deleteAddress
            .addCase(deleteAddress.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(deleteAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                const user = action.payload;
                state.addresses = user?.address || [];
                state.selectedAddressId = user?.selectedAddress || null;
                toast.success('Address removed');
            })
            .addCase(deleteAddress.rejected, (state, action) => {
                state.actionLoading = false;
                toast.error(action.payload?.message || 'Failed to delete address');
            })

            // selectAddress
            .addCase(selectAddress.pending, (state) => {
                state.actionLoading = true;
            })
            .addCase(selectAddress.fulfilled, (state, action) => {
                state.actionLoading = false;
                const user = action.payload;
                state.addresses = user?.address || [];
                state.selectedAddressId = user?.selectedAddress || null;
                toast.success('Default address updated');
            })
            .addCase(selectAddress.rejected, (state, action) => {
                state.actionLoading = false;
                toast.error(action.payload?.message || 'Failed to set default address');
            });
    },
});

export const { clearAddressError } = addressSlice.actions;
export default addressSlice.reducer;
