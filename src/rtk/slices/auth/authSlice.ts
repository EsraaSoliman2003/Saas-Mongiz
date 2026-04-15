import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { User, AuthResponse } from "@/utils/dtos";

/* ===========================
   Types
=========================== */

interface AuthState {
  loading: boolean;
  user: User | null;
  token: string | null;
  roles: string[] | null;
  message: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: AuthState = {
  loading: false,
  user: null,
  token: null,
  roles: null,
  message: null,
};

/* ===========================
   Register
=========================== */

export const registerUser = createAsyncThunk<
  AuthResponse,
  FormData,
  {
    rejectValue: {
      title: string;
      errors?: Record<string, string[]>;
      extra?: {
        isDeleted?: boolean;
      };
    };
  }
>("auth/register", async (formData, thunkAPI) => {
  try {
    const res = await axios.post("Account/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue({
        title: err.response?.data?.title || "Register failed",
        errors: err.response?.data?.errors,
        extra: err.response?.data?.extra,
      });
    }
    return thunkAPI.rejectWithValue({
      title: "Unexpected error",
    });
  }
});

/* ===========================
   Login
=========================== */

export const loginUser = createAsyncThunk<
  AuthResponse,
  { email: string; password: string },
  { rejectValue: { title: string } }
>("auth/login", async (data, thunkAPI) => {
  try {
    const res = await axios.post("Account/login", data);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue({
        title: err.response?.data?.title || "Login failed",
      });
    }
    return thunkAPI.rejectWithValue({ title: "Unexpected error" });
  }
});

/* ===========================
   Logout
=========================== */

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { title: string } }
>("auth/logout", async (_, thunkAPI) => {
  try {
    await axios.post("Account/logout");
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue({
        title: err.response?.data?.title || "Logout failed",
      });
    }
    return thunkAPI.rejectWithValue({ title: "Unexpected error" });
  }
});

/* ===========================
   Google Sign-In
=========================== */
export const googleSignIn = createAsyncThunk<
  AuthResponse,
  string, // token
  { rejectValue: { title: string } }
>("auth/googleSignIn", async (token, thunkAPI) => {
  try {
    const res = await axios.post("Account/googleSignIn", { token });
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue({
        title: err.response?.data?.title || "Google login failed",
      });
    }
    return thunkAPI.rejectWithValue({ title: "Unexpected error" });
  }
});

/* ===========================
   Google Sign-Up
=========================== */
export const googleSignUp = createAsyncThunk<
  AuthResponse,
  { token: string; phoneNumber: string; countryCode: string },
  { rejectValue: { title: string } }
>("auth/googleSignUp", async (data, thunkAPI) => {
  try {
    const res = await axios.post("Account/googleSignUp", data);
    return res.data;
  } catch (err: unknown) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue({
        title: err.response?.data?.title || "Google signup failed",
      });
    }
    return thunkAPI.rejectWithValue({ title: "Unexpected error" });
  }
});

/* ===========================
   Recovery Account
=========================== */
export const recoverAccount = createAsyncThunk(
  "auth/recover",
  async (email: string, thunkAPI) => {
    try {
      const res = await axios.get("Account/re-active-account", {
        params: { email },
      });

      return res.data;
    } catch (err: any) {
      return thunkAPI.rejectWithValue(
        err.response?.data || { message: "Recovery failed" },
      );
    }
  },
);
/* ===========================
   Slice
=========================== */

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    resetAuthState: () => initialState,
  },
  extraReducers: (builder) => {
    builder

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.title || null;
      })

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.title || null;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.token = null;
        state.roles = null;
      })

      // GOOGLE SIGN-IN
      .addCase(googleSignIn.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(googleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
      })
      .addCase(googleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.title || null;
      })

      // GOOGLE SIGN-UP
      .addCase(googleSignUp.pending, (state) => {
        state.loading = true;
        state.message = null;
      })
      .addCase(googleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.roles = action.payload.roles;
      })
      .addCase(googleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.message = action.payload?.title || null;
      });
  },
});

export const { resetAuthState } = authSlice.actions;
export default authSlice.reducer;
