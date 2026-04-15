import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type ContactInfoItem = {
  id: number;
  location: string;
  phoneNumber: string;
  email: string;
  [key: string]: any;
};

// ✅ NEW: full response
export type ContactInfoFullItem = {
  id: number;
  location: string;
  phoneNumber: string;
  email: string;
};

export type CreateContactInfoPayload = {
  Location: string;
  PhoneNumber: string;
  Email: string;
};

export type UpdateContactInfoPayload = {
  id: number;
  location: string;
  phoneNumber: string;
  email: string;
};

export type DeleteContactInfoPayload = {
  id: number;
};

/* ===========================
   State
=========================== */

interface ContactInfoState {
  loading: boolean;
  list: ContactInfoItem[];
  error: string | null;

  detailsLoading: boolean;
  selected: ContactInfoItem | null;
  detailsError: string | null;

  // ✅ NEW: /ContactInfo/{id}/full
  detailsFullLoading: boolean;
  selectedFull: ContactInfoFullItem | null;
  detailsFullError: string | null;

  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: ContactInfoState = {
  loading: false,
  list: [],
  error: null,

  detailsLoading: false,
  selected: null,
  detailsError: null,

  // ✅ NEW
  detailsFullLoading: false,
  selectedFull: null,
  detailsFullError: null,

  createLoading: false,
  createError: null,

  updateLoading: false,
  updateError: null,

  deleteLoading: false,
  deleteError: null,
};

/* ===========================
   Thunks
=========================== */

// GET /api/ContactInfo
export const fetchContactInfoList = createAsyncThunk<
  ContactInfoItem[],
  void,
  { rejectValue: string }
>("contactInfo/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<ContactInfoItem[]>("/ContactInfo");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل بيانات التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// GET /api/ContactInfo/{id}
export const fetchContactInfoById = createAsyncThunk<
  ContactInfoItem,
  number,
  { rejectValue: string }
>("contactInfo/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<ContactInfoItem>(`/ContactInfo/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل بيانات التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ NEW: GET /api/ContactInfo/{id}/full
export const fetchContactInfoFullById = createAsyncThunk<
  ContactInfoFullItem,
  number,
  { rejectValue: string }
>("contactInfo/fetchFullById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<ContactInfoFullItem>(`/ContactInfo/${id}/full`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل بيانات التواصل كاملة");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// POST /api/ContactInfo (multipart/form-data)
export const createContactInfo = createAsyncThunk<
  void,
  CreateContactInfoPayload,
  { rejectValue: string }
>("contactInfo/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Location", payload.Location);
    formData.append("PhoneNumber", payload.PhoneNumber);
    formData.append("Email", payload.Email);

    await axios.post("/ContactInfo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await thunkAPI.dispatch(fetchContactInfoList());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل إضافة بيانات التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// PUT /api/ContactInfo/{id} (application/json)
export const updateContactInfo = createAsyncThunk<
  void,
  UpdateContactInfoPayload,
  { rejectValue: string }
>("contactInfo/update", async (payload, thunkAPI) => {
  try {
    await axios.put(`/ContactInfo/${payload.id}`, payload);

    await thunkAPI.dispatch(fetchContactInfoList());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تعديل بيانات التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// DELETE /api/ContactInfo/{id}
export const deleteContactInfo = createAsyncThunk<
  number,
  DeleteContactInfoPayload,
  { rejectValue: string }
>("contactInfo/delete", async ({ id }, thunkAPI) => {
  try {
    await axios.delete(`/ContactInfo/${id}`);

    await thunkAPI.dispatch(fetchContactInfoList());

    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل حذف بيانات التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const contactInfoSlice = createSlice({
  name: "contactInfo",
  initialState,
  reducers: {
    clearContactInfoErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.detailsFullError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },

    clearContactInfoSelected: (state) => {
      state.selected = null;
      state.detailsError = null;
      state.detailsLoading = false;
    },

    // ✅ NEW: clear full selected (لحل مشكلة البيانات القديمة)
    clearContactInfoSelectedFull: (state) => {
      state.selectedFull = null;
      state.detailsFullError = null;
      state.detailsFullLoading = false;
    },

    clearContactInfoState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchContactInfoList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactInfoList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContactInfoList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetch by id
      .addCase(fetchContactInfoById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchContactInfoById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchContactInfoById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || "حدث خطأ";
      })

      // ✅ fetch full by id
      .addCase(fetchContactInfoFullById.pending, (state) => {
        state.detailsFullLoading = true;
        state.detailsFullError = null;
      })
      .addCase(fetchContactInfoFullById.fulfilled, (state, action) => {
        state.detailsFullLoading = false;
        state.selectedFull = action.payload;
      })
      .addCase(fetchContactInfoFullById.rejected, (state, action) => {
        state.detailsFullLoading = false;
        state.detailsFullError = action.payload || "حدث خطأ";
      })

      // create
      .addCase(createContactInfo.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createContactInfo.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createContactInfo.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })

      // update
      .addCase(updateContactInfo.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateContactInfo.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateContactInfo.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "حدث خطأ";
      })

      // delete
      .addCase(deleteContactInfo.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteContactInfo.fulfilled, (state, action) => {
        state.deleteLoading = false;

        if (state.selected?.id === action.payload) state.selected = null;
        if (state.selectedFull?.id === action.payload) state.selectedFull = null;
      })
      .addCase(deleteContactInfo.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      });
  },
});

export const {
  clearContactInfoErrors,
  clearContactInfoSelected,
  clearContactInfoSelectedFull, // ✅ NEW
  clearContactInfoState,
} = contactInfoSlice.actions;

export default contactInfoSlice.reducer;
