import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';

const initialState = {
    sizeGuides: [],
    loading: false,
    error: null,
};

const handleErrors = (error, rejectWithValue) => {
    const errorMessage = error.response?.data?.message || 'An error occurred';
    return rejectWithValue(error.response?.data || { message: errorMessage });
};

export const fetchSizeGuides = createAsyncThunk(
    'sizeGuide/fetchSizeGuides',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/size-guide/get-all');
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const createSizeGuide = createAsyncThunk(
    'sizeGuide/createSizeGuide',
    async (data, { rejectWithValue, dispatch }) => {
        try {
            // The existing route is /size-guide/create/:productId
            // But let's check if we can have a global create route or use a dummy productId
            // Actually, looking at back/routes/index.routes.js:
            // router.post("/size-guide/create", UserAuth, adminAuth, createSizeGuide);
            const response = await axiosInstance.post('/size-guide/create', data);
            dispatch(fetchSizeGuides());
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const updateSizeGuide = createAsyncThunk(
    'sizeGuide/updateSizeGuide',
    async ({ id, data }, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.put(`/size-guide/update/${id}`, data);
            dispatch(fetchSizeGuides());
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const deleteSizeGuide = createAsyncThunk(
    'sizeGuide/deleteSizeGuide',
    async (id, { rejectWithValue, dispatch }) => {
        try {
            const response = await axiosInstance.delete(`/size-guide/delete/${id}`);
            dispatch(fetchSizeGuides());
            return response.data;
        } catch (error) {
            return handleErrors(error, rejectWithValue);
        }
    }
);

export const sizeGuideSlice = createSlice({
    name: 'sizeGuide',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSizeGuides.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSizeGuides.fulfilled, (state, action) => {
                const data = action.payload?.result;
                state.sizeGuides = Array.isArray(data) ? data : (data?.result || []);
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchSizeGuides.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Failed to fetch size guides";
            });
    },
});

export default sizeGuideSlice.reducer;
