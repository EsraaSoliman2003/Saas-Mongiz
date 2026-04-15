// rtk/slices/features/notifications/userNotificationSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type UserNotificationApi = {
  id: number;
  title: string;
  contentMessage: string;
  isRead: boolean;
  sender: string;
  type: string;
  priority: string;
  createdAt: string;
};

export type UnreadCountResponse = {
  unreadCount: number;
};

export type CreateUserNotificationPayload = {
  UserIds: number[];
  TitleEN: string;
  TitleAR: string;
  ContentMessageEN: string;
  ContentMessageAR: string;
  Type?: number;
  Priority?: number;
  Sender: string;
};

/* ===========================
   State
=========================== */

interface UserNotificationState {
  // list
  loading: boolean;
  items: UserNotificationApi[];
  error: string | null;

  // unread count
  unreadLoading: boolean;
  unreadCount: number;
  unreadError: string | null;

  // mark as read
  markReadLoading: boolean;
  markReadError: string | null;

  // delete
  deleteLoading: boolean;
  deleteError: string | null;

  // create
  createLoading: boolean;
  createError: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: UserNotificationState = {
  loading: false,
  items: [],
  error: null,

  unreadLoading: false,
  unreadCount: 0,
  unreadError: null,

  markReadLoading: false,
  markReadError: null,

  deleteLoading: false,
  deleteError: null,

  createLoading: false,
  createError: null,
};

/* ===========================
   Thunks
=========================== */

// ✅ GET /api/UserNotification?userId=34
export const fetchUserNotifications = createAsyncThunk<
  UserNotificationApi[],
  number,
  { rejectValue: string }
>("userNotification/fetchAll", async (userId, thunkAPI) => {
  try {
    const res = await axios.get<UserNotificationApi[]>(
      `/UserNotification?userId=${userId}`,
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تحميل الإشعارات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const fetchUnreadCount = createAsyncThunk<
  UnreadCountResponse,
  void,
  { rejectValue: string }
>("userNotification/fetchUnreadCount", async (_, thunkAPI) => {
  try {
    const res = await axios.get<UnreadCountResponse>(
      `/UserNotification/unread-count`
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تحميل عدد الإشعارات غير المقروءة"
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});


// ✅ PUT /api/UserNotification/{id}/read
export const markNotificationAsRead = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("userNotification/markAsRead", async (id, thunkAPI) => {
  try {
    await axios.put(`/UserNotification/${id}/read`);
    return { id };
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تحديث الإشعار كمقروء",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ DELETE /api/UserNotification/{id}
export const deleteNotification = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("userNotification/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/UserNotification/${id}`);
    return { id };
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل حذف الإشعار",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ POST /api/UserNotification
export const createUserNotification = createAsyncThunk<
  void,
  CreateUserNotificationPayload,
  { rejectValue: string }
>("userNotification/create", async (data, thunkAPI) => {
  try {
    const formData = new FormData();

    data.UserIds.forEach((id) => formData.append("UserIds", id.toString()));
    formData.append("TitleEN", data.TitleEN);
    formData.append("TitleAR", data.TitleAR);
    formData.append("ContentMessageEN", data.ContentMessageEN);
    formData.append("ContentMessageAR", data.ContentMessageAR);
    if (data.Type !== undefined) formData.append("Type", data.Type.toString());
    if (data.Priority !== undefined)
      formData.append("Priority", data.Priority.toString());
    formData.append("Sender", data.Sender);

    await axios.post("/UserNotification", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل إضافة الإشعار",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const userNotificationSlice = createSlice({
  name: "userNotification",
  initialState,
  reducers: {
    clearNotificationErrors: (state) => {
      state.error = null;
      state.unreadError = null;
      state.markReadError = null;
      state.deleteError = null;
      state.createError = null;
    },
    clearNotificationState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ================= fetchUserNotifications =================
      .addCase(fetchUserNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchUserNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // ================= fetchUnreadCount =================
      .addCase(fetchUnreadCount.pending, (state) => {
        state.unreadLoading = true;
        state.unreadError = null;
      })
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadLoading = false;
        state.unreadCount = action.payload.unreadCount ?? 0;
      })
      .addCase(fetchUnreadCount.rejected, (state, action) => {
        state.unreadLoading = false;
        state.unreadError = action.payload || "حدث خطأ";
      })

      // ================= markNotificationAsRead =================
      .addCase(markNotificationAsRead.pending, (state) => {
        state.markReadLoading = true;
        state.markReadError = null;
      })
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        state.markReadLoading = false;

        const id = action.payload.id;
        const n = state.items.find((x) => x.id === id);
        if (n) n.isRead = true;

        if (state.unreadCount > 0) state.unreadCount -= 1;
      })
      .addCase(markNotificationAsRead.rejected, (state, action) => {
        state.markReadLoading = false;
        state.markReadError = action.payload || "حدث خطأ";
      })

      // ================= deleteNotification =================
      .addCase(deleteNotification.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.deleteLoading = false;
        const id = action.payload.id;

        const deleted = state.items.find((x) => x.id === id);
        state.items = state.items.filter((x) => x.id !== id);

        if (deleted && !deleted.isRead && state.unreadCount > 0) {
          state.unreadCount -= 1;
        }
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      })
      // ================= createUserNotification =================
      .addCase(createUserNotification.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createUserNotification.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createUserNotification.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearNotificationErrors, clearNotificationState } =
  userNotificationSlice.actions;

export default userNotificationSlice.reducer;
