import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    items: [],
    wishlistCount: 0,
    totalAmount: 0,
    isCartOpen: false,
    loading: false,
    error: null,
};

const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

// --- Thunks ---

export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/cart/my');
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async (cartData, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/cart/add', cartData);
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ productId, quantity, productVariantId, selectedSize }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put('/cart/update', { productId, quantity, productVariantId, selectedSize });
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async ({ productId, productVariantId, selectedSize }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.post('/cart/remove', { productId, productVariantId, selectedSize });
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        toggleCart: (state) => {
            state.isCartOpen = !state.isCartOpen;
        },
        openCart: (state) => {
            state.isCartOpen = true;
        },
        closeCart: (state) => {
            state.isCartOpen = false;
        },
        clearCartError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // fetchCart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.result?.items || [];
                state.totalAmount = action.payload?.result?.total || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })
            // addToCart
            .addCase(addToCart.fulfilled, (state, action) => {
                state.items = action.payload?.result?.items || [];
                state.totalAmount = action.payload?.result?.total || 0;
            })
            // updateCartItem
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.items = action.payload?.result?.items || [];
                state.totalAmount = action.payload?.result?.total || 0;
            })
            // removeFromCart
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.items = action.payload?.result?.items || [];
                state.totalAmount = action.payload?.result?.total || 0;
            });
    },
});

export const { toggleCart, openCart, closeCart, clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
