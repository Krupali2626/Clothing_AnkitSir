import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';

const initialState = {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
};

export const fetchNotifications = createAsyncThunk(
    'notification/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/notifications/my');
            return response.data.result;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
        }
    }
);

export const markAsRead = createAsyncThunk(
    'notification/markAsRead',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/notifications/mark-read/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update notification');
        }
    }
);

export const markAllAsRead = createAsyncThunk(
    'notification/markAllAsRead',
    async (_, { rejectWithValue }) => {
        try {
            await axiosInstance.put('/notifications/mark-all-read');
            return true;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to update notifications');
        }
    }
);

export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async (id, { rejectWithValue }) => {
        try {
            await axiosInstance.delete(`/notifications/delete/${id}`);
            return id;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to delete notification');
        }
    }
);

const notificationSlice = createSlice({
    name: 'notification',
    initialState,
    reducers: {
        addNotification: (state, action) => {
            state.notifications.unshift(action.payload);
            if (!action.payload.isRead) state.unreadCount += 1;
        },
        clearNotifications: (state) => {
            state.notifications = [];
            state.unreadCount = 0;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchNotifications.fulfilled, (state, action) => {
                state.loading = false;
                state.notifications = action.payload;
                state.unreadCount = action.payload.filter(n => !n.isRead).length;
            })
            .addCase(fetchNotifications.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(markAsRead.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification && !notification.isRead) {
                    notification.isRead = true;
                    state.unreadCount -= 1;
                }
            })
            .addCase(markAllAsRead.fulfilled, (state) => {
                state.notifications.forEach(n => n.isRead = true);
                state.unreadCount = 0;
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                const notification = state.notifications.find(n => n._id === action.payload);
                if (notification && !notification.isRead) {
                    state.unreadCount -= 1;
                }
                state.notifications = state.notifications.filter(n => n._id !== action.payload);
            });
    },
});

export const { addNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
