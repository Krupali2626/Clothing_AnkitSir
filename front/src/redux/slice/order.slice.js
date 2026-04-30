import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    orders: [],
    currentOrder: null,
    loading: false,
    placeOrderLoading: false,
    detailLoading: false,
    cancelLoading: false,
    error: null,
    placeOrderError: null,
    detailError: null,
    cancelError: null,
};

const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

// Place a new order
export const placeOrder = createAsyncThunk(
    'order/placeOrder',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/order/place', orderData);
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Fetch logged-in user's orders
export const fetchMyOrders = createAsyncThunk(
    'order/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/order/my');
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Fetch single order by _id
export const fetchOrderById = createAsyncThunk(
    'order/fetchOrderById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/order/my`);
            // Filter from the full list since there's no single-order endpoint
            const orders = response.data?.result || [];
            const order = orders.find((o) => o._id === id);
            if (!order) throw new Error('Order not found');
            return order;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

// Cancel an order by _id
export const cancelOrder = createAsyncThunk(
    'order/cancelOrder',
    async ({ id, reason }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/order/cancel/${id}`, { reason });
            // response.data.result = { orderId, orderStatus, cancelledAt }
            return { id, result: response.data?.result };
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

const orderSlice = createSlice({
    name: 'order',
    initialState,
    reducers: {
        clearOrders: (state) => {
            state.orders = [];
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
            state.detailError = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // placeOrder
            .addCase(placeOrder.pending, (state) => {
                state.placeOrderLoading = true;
                state.placeOrderError = null;
            })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.placeOrderLoading = false;
                state.currentOrder = action.payload?.result || null;
                state.placeOrderError = null;
                toast.success(action.payload?.message || 'Order placed successfully!');
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.placeOrderLoading = false;
                state.placeOrderError = action.payload?.message || 'Failed to place order';
                toast.error(action.payload?.message || 'Failed to place order');
            })
            // fetchMyOrders
            .addCase(fetchMyOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload?.result || [];
                state.error = null;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch orders';
            })
            // fetchOrderById
            .addCase(fetchOrderById.pending, (state) => {
                state.detailLoading = true;
                state.detailError = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.detailLoading = false;
                state.currentOrder = action.payload;
                state.detailError = null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.detailLoading = false;
                state.detailError = action.payload?.message || 'Failed to fetch order';
            })
            // cancelOrder
            .addCase(cancelOrder.pending, (state) => {
                state.cancelLoading = true;
                state.cancelError = null;
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.cancelLoading = false;
                const cancelledAt = action.payload?.result?.cancelledAt || new Date().toISOString();
                // Update the currentOrder status and cancelledAt
                if (state.currentOrder && state.currentOrder._id === action.payload.id) {
                    state.currentOrder = {
                        ...state.currentOrder,
                        orderStatus: 'Cancelled',
                        cancelledAt,
                    };
                }
                // Also update in the orders list if present
                const idx = state.orders.findIndex((o) => o._id === action.payload.id);
                if (idx !== -1) {
                    state.orders[idx] = {
                        ...state.orders[idx],
                        orderStatus: 'Cancelled',
                        cancelledAt,
                    };
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.cancelLoading = false;
                state.cancelError = action.payload?.message || 'Failed to cancel order';
            });
    },
});

export const { clearOrders, clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
