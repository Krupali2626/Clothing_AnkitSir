import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

// Fetch payment configuration (public endpoint - no auth required)
export const fetchPaymentConfig = createAsyncThunk(
    'settings/fetchPaymentConfig',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${API_URL}/settings/payment-config`);
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch payment configuration');
        }
    }
);

// Fetch all settings (admin only - requires auth)
export const fetchSettings = createAsyncThunk(
    'settings/fetchSettings',
    async (_, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.get(`${API_URL}/settings/get`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch settings');
        }
    }
);

// Update settings (admin only - requires auth)
export const updateSettings = createAsyncThunk(
    'settings/updateSettings',
    async (settingsData, { rejectWithValue }) => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.put(`${API_URL}/settings/update`, settingsData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update settings');
        }
    }
);

const settingsSlice = createSlice({
    name: 'settings',
    initialState: {
        settings: null,
        paymentConfig: {
            maxSavedCards: 3,
            isStripeEnabled: true,
            isPaypalEnabled: false,
            currency: 'AUD',
        },
        loading: false,
        updateLoading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch payment config
            .addCase(fetchPaymentConfig.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPaymentConfig.fulfilled, (state, action) => {
                state.loading = false;
                state.paymentConfig = action.payload;
            })
            .addCase(fetchPaymentConfig.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Fetch all settings (admin)
            .addCase(fetchSettings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSettings.fulfilled, (state, action) => {
                state.loading = false;
                state.settings = action.payload;
                // Also update payment config from full settings
                if (action.payload.payment) {
                    state.paymentConfig = {
                        maxSavedCards: action.payload.payment.maxSavedCards || 3,
                        isStripeEnabled: action.payload.payment.isStripeEnabled || true,
                        isPaypalEnabled: action.payload.payment.isPaypalEnabled || false,
                        currency: action.payload.general?.currency || 'AUD',
                    };
                }
            })
            .addCase(fetchSettings.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update settings (admin)
            .addCase(updateSettings.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateSettings.fulfilled, (state, action) => {
                state.updateLoading = false;
                state.settings = action.payload;
                // Also update payment config from full settings
                if (action.payload.payment) {
                    state.paymentConfig = {
                        maxSavedCards: action.payload.payment.maxSavedCards || 3,
                        isStripeEnabled: action.payload.payment.isStripeEnabled || true,
                        isPaypalEnabled: action.payload.payment.isPaypalEnabled || false,
                        currency: action.payload.general?.currency || 'AUD',
                    };
                }
            })
            .addCase(updateSettings.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    },
});

export default settingsSlice.reducer;
