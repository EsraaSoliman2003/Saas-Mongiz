import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type CreateNotificationPayload = {
    title: string;
    body: string;
    type?: number;      // optional, default 1
    priority?: number;  // optional, default 1
    sender?: string;    // optional
};

export type SendNotificationToUserPayload = {
    userId: number;
    title: string;
    body: string;
    type?: number;
    priority?: number;
    sender?: string;
};

/* ===========================
   State
=========================== */

interface NotificationState {
    createLoading: boolean;
    sendLoading: boolean;
    createError: string | null;
    sendError: string | null;
}

const initialState: NotificationState = {
    createLoading: false,
    sendLoading: false,
    createError: null,
    sendError: null,
};

/* ===========================
   Thunks
=========================== */

// POST /api/NotificationsForMobile/broadcast
export const createNotification = createAsyncThunk<
    void,
    CreateNotificationPayload,
    { rejectValue: string }
>("notification/create", async (payload, thunkAPI) => {
    try {
        await axios.post("/NotificationsForMobile/broadcast", payload);
    } catch (err) {
        if (isAxiosError(err)) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "فشل إرسال الإشعار"
            );
        }
        return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
});

// POST /api/NotificationsForMobile/send-to-user
export const sendNotificationToUser = createAsyncThunk<
    void,
    SendNotificationToUserPayload,
    { rejectValue: string }
>("notification/sendToUser", async (payload, thunkAPI) => {
    try {
        await axios.post("/NotificationsForMobile/send-to-user", payload);
    } catch (err) {
        if (isAxiosError(err)) {
            return thunkAPI.rejectWithValue(
                err.response?.data?.message || "فشل إرسال الإشعار للمستخدم"
            );
        }
        return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
    }
});

/* ===========================
   Slice
=========================== */

const notificationSlice = createSlice({
    name: "notification",
    initialState,
    reducers: {
        clearNotificationErrors: (state) => {
            state.createError = null;
            state.sendError = null;
        },
        clearNotificationState: () => initialState,
    },
    extraReducers: (builder) => {
        // Broadcast notification
        builder
            .addCase(createNotification.pending, (state) => {
                state.createLoading = true;
                state.createError = null;
            })
            .addCase(createNotification.fulfilled, (state) => {
                state.createLoading = false;
            })
            .addCase(createNotification.rejected, (state, action) => {
                state.createLoading = false;
                state.createError = action.payload || "حدث خطأ";
            });

        // Send to specific user
        builder
            .addCase(sendNotificationToUser.pending, (state) => {
                state.sendLoading = true;
                state.sendError = null;
            })
            .addCase(sendNotificationToUser.fulfilled, (state) => {
                state.sendLoading = false;
            })
            .addCase(sendNotificationToUser.rejected, (state, action) => {
                state.sendLoading = false;
                state.sendError = action.payload || "حدث خطأ";
            });
    },
});

export const {
    clearNotificationErrors,
    clearNotificationState,
} = notificationSlice.actions;

export default notificationSlice.reducer;
