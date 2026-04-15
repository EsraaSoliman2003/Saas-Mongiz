// profileSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type ProfileApi = {
  fullName?: string;
  email?: string;
  phone?: string;
  phoneNumber?: string; // <-- match API
  imageUrl?: string | null;
};

export type UpdatePasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateProfileForMobilePayload = {
  fullName: string;
  phoneNumber: string;
  email: string;
  profileImage?: File | null;
};

interface ProfileState {
  loading: boolean;
  profile: ProfileApi | null;
  error: string | null;

  updatePasswordLoading: boolean;
  updatePasswordError: string | null;

  deleteAccountLoading: boolean;
  deleteAccountError: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: ProfileState = {
  loading: false,
  profile: null,
  error: null,

  updatePasswordLoading: false,
  updatePasswordError: null,

  deleteAccountLoading: false,
  deleteAccountError: null,
};

/* ===========================
   Thunks
=========================== */

// GET profile
export const fetchProfile = createAsyncThunk<
  ProfileApi,
  void,
  { rejectValue: string }
>("profile/fetch", async (_, thunkAPI) => {
  try {
    const res = await axios.get<ProfileApi>(`/Profile`);
    return res.data; // نرجع البيانات كما هي
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to fetch profile",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error occurred");
  }
});

// Update password
export const updateProfilePassword = createAsyncThunk<
  void,
  UpdatePasswordPayload,
  { rejectValue: string }
>(
  "profile/updatePassword",
  async ({ currentPassword, newPassword }, thunkAPI) => {
    try {
      await axios.put(`/Profile/password`, { currentPassword, newPassword });
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "Failed to update password",
        );
      }
      return thunkAPI.rejectWithValue("Unexpected error occurred");
    }
  },
);

// updateProfileForMobile
export const updateProfileForMobile = createAsyncThunk<
  ProfileApi,
  UpdateProfileForMobilePayload,
  { rejectValue: string }
>(
  "profile/updateProfileForMobile",
  async ({ fullName, phoneNumber, email, profileImage }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("FullName", fullName);
      formData.append("PhoneNumber", phoneNumber);
      formData.append("Email", email);
      if (profileImage) formData.append("ProfileImage", profileImage);

      const res = await axios.put("/ProfileForMobile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Map phoneNumber → phone
      return {
        ...res.data,
        phone: res.data.phoneNumber,
      } as ProfileApi;
    } catch (err) {
      if (isAxiosError(err)) {
        return thunkAPI.rejectWithValue(
          err.response?.data?.title || "Failed to update profile",
        );
      }
      return thunkAPI.rejectWithValue("Unexpected error occurred");
    }
  },
);

// Delete account
export const deleteAccount = createAsyncThunk<
  void,
  { password: string },
  { rejectValue: string }
>("profile/deleteAccount", async ({ password }, thunkAPI) => {
  try {
    await axios.delete(`/Profile`, {
      data: { password },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to delete account",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error occurred");
  }
});

/* ===========================
   Slice
=========================== */

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {
    clearProfileErrors: (state) => {
      state.error = null;
      state.updatePasswordError = null;
    },
    clearProfileState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchProfile
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // updatePassword
      .addCase(updateProfilePassword.pending, (state) => {
        state.updatePasswordLoading = true;
        state.updatePasswordError = null;
      })
      .addCase(updateProfilePassword.fulfilled, (state) => {
        state.updatePasswordLoading = false;
      })
      .addCase(updateProfilePassword.rejected, (state, action) => {
        state.updatePasswordLoading = false;
        state.updatePasswordError = action.payload || "حدث خطأ";
      })

      // updateProfileForMobile
      .addCase(updateProfileForMobile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfileForMobile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateProfileForMobile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      .addCase(deleteAccount.pending, (state) => {
        state.deleteAccountLoading = true;
        state.deleteAccountError = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.deleteAccountLoading = false;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.deleteAccountLoading = false;
        state.deleteAccountError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearProfileErrors, clearProfileState } = profileSlice.actions;
export default profileSlice.reducer;
