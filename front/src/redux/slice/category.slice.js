import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from '../../utils/BASE_URL';
import axios from 'axios';

const initialState = {
    mainCategories: [],
    loading: false,
    error: null,
};

const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const fetchMainCategories = createAsyncThunk(
    'category/fetchMainCategories',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/main-category/get-all`);
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMainCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchMainCategories.fulfilled, (state, action) => {
                state.mainCategories = action.payload?.result || [];
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchMainCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch categories";
            });
    },
});

export default categorySlice.reducer;
