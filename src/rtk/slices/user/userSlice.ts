// /rtk/slices/features/user/usersSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===================== Interfaces ===================== */
export interface User {
  id: string;
  fullName: string;
  phoneNumber: string;
  countryCode: string;
  imageUrl: string | null;
  email: string;
}

export interface UserState {
  users: User[];
  currentUser: User | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  currentPage: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* ===================== Initial State ===================== */
const initialState: UserState = {
  users: [],
  currentUser: null,
  loading: false,
  saving: false,
  error: null,
  currentPage: 1,
  pageCount: 1,
  hasNextPage: false,
  hasPreviousPage: false,
};

/* ===================== Thunks ===================== */

// GET list (paginated)
export const fetchUsers = createAsyncThunk<
  any,
  { page: number; pageSize: number }
>("users/fetchUsers", async ({ page, pageSize }, thunkAPI) => {
  try {
    const res = await axios.get(`/User?page=${page}&pageSize=${pageSize}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch users",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// GET single user by ID
export const fetchUserById = createAsyncThunk<User, string>(
  "users/fetchUserById",
  async (id, thunkAPI) => {
    try {
      const res = await axios.get(`/User/${id}`);
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || "Failed to fetch user",
        );
      }
      return thunkAPI.rejectWithValue("Unexpected error");
    }
  },
);

// GET users with orders (paginated)
export const fetchUsersWithOrders = createAsyncThunk<
  any,
  { page: number; pageSize: number }
>("users/fetchUsersWithOrders", async ({ page, pageSize }, thunkAPI) => {
  try {
    const res = await axios.get(
      `/User/with-orders?page=${page}&pageSize=${pageSize}`,
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data || "Failed to fetch users with orders",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// PUT (update) user
export const updateUser = createAsyncThunk<User, FormData>(
  "users/updateUser",
  async (formData, thunkAPI) => {
    try {
      const res = await axios.put("/User", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || "Failed to update user",
        );
      }
      return thunkAPI.rejectWithValue("Unexpected error");
    }
  },
);

// DELETE user
export const deleteUser = createAsyncThunk<string, string>(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      await axios.delete(`/User/${id}`);
      return id;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data || "Failed to delete user",
        );
      }
      return thunkAPI.rejectWithValue("Unexpected error");
    }
  },
);

/* ===================== Slice ===================== */
const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    // لو حابة تفرغي المستخدم الحالي
    clearCurrentUser(state) {
      state.currentUser = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    /* ====== FETCH LIST ====== */
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.items;
      state.currentPage = action.payload.currentPage;
      state.pageCount = action.payload.pageCount;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
    });
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // FETCH USERS WITH ORDERS
    builder.addCase(fetchUsersWithOrders.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUsersWithOrders.fulfilled, (state, action) => {
      state.loading = false;
      state.users = action.payload.items;
      state.currentPage = action.payload.currentPage;
      state.pageCount = action.payload.pageCount;
      state.hasNextPage = action.payload.hasNextPage;
      state.hasPreviousPage = action.payload.hasPreviousPage;
    });
    builder.addCase(fetchUsersWithOrders.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ====== FETCH SINGLE ====== */
    builder.addCase(fetchUserById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUserById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentUser = action.payload;
    });
    builder.addCase(fetchUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    /* ====== UPDATE USER ====== */
    builder.addCase(updateUser.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.saving = false;
      // تحديث المستخدم بالقائمة إذا موجود
      const index = state.users.findIndex((u) => u.id === action.payload.id);
      if (index !== -1) state.users[index] = action.payload;
      if (state.currentUser?.id === action.payload.id)
        state.currentUser = action.payload;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload as string;
    });

    /* ====== DELETE USER ====== */
    builder.addCase(deleteUser.pending, (state) => {
      state.saving = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.saving = false;
      state.users = state.users.filter((u) => u.id !== action.payload);
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.saving = false;
      state.error = action.payload as string;
    });
  },
});

/* ===================== Export ===================== */
export const { clearCurrentUser } = usersSlice.actions;
export default usersSlice.reducer;
