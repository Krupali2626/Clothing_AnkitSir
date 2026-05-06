import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

export const fetchLowStockAlerts = createAsyncThunk(
    'inventory/fetchLowStockAlerts',
    async (threshold = 10, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/inventory/low-stock?threshold=${threshold}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch low stock alerts');
        }
    }
);

export const bulkUpdateStock = createAsyncThunk(
    'inventory/bulkUpdateStock',
    async (updates, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/inventory/bulk-update', { updates });
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to bulk update stock');
        }
    }
);

const inventorySlice = createSlice({
    name: 'inventory',
    initialState: {
        lowStockAlerts: [],
        loading: false,
        updateLoading: false,
        error: null,
    },
    reducers: {
        clearInventoryError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Low Stock Alerts
            .addCase(fetchLowStockAlerts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLowStockAlerts.fulfilled, (state, action) => {
                state.loading = false;
                state.lowStockAlerts = action.payload?.result || [];
            })
            .addCase(fetchLowStockAlerts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            
            // Bulk Update Stock
            .addCase(bulkUpdateStock.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(bulkUpdateStock.fulfilled, (state) => {
                state.updateLoading = false;
            })
            .addCase(bulkUpdateStock.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload;
            });
    }
});

export const { clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
