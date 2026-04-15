import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type ContactUsItem = {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  message: string;
  [key: string]: any;
};

export type CreateContactUsPayload = {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  message: string;
};

/* ===========================
   State
=========================== */

interface ContactUsState {
  loading: boolean;
  list: ContactUsItem[];
  error: string | null;

  detailsLoading: boolean;
  selected: ContactUsItem | null;
  detailsError: string | null;

  sendLoading: boolean;
  sendError: string | null;
  sentSuccess: boolean; // عشان لو عايزة تظهر رسالة نجاح في UI
}

const initialState: ContactUsState = {
  loading: false,
  list: [],
  error: null,

  detailsLoading: false,
  selected: null,
  detailsError: null,

  sendLoading: false,
  sendError: null,
  sentSuccess: false,
};

/* ===========================
   Thunks
=========================== */

// GET /api/ContactUs
export const fetchContactUsList = createAsyncThunk<
  ContactUsItem[],
  void,
  { rejectValue: string }
>("contactUs/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<ContactUsItem[]>("/ContactUs");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل رسائل التواصل");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// GET /api/ContactUs/{id}
export const fetchContactUsById = createAsyncThunk<
  ContactUsItem,
  number,
  { rejectValue: string }
>("contactUs/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<ContactUsItem>(`/ContactUs/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل الرسالة");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// POST /api/ContactUs  (application/json)
export const sendContactUs = createAsyncThunk<
  void,
  CreateContactUsPayload,
  { rejectValue: string }
>("contactUs/send", async (payload, thunkAPI) => {
  try {
    await axios.post("/ContactUs", payload);

    // (اختياري) لو عندك صفحة Admin بتعرض الرسائل وعايزة تعمل refetch بعد الإرسال:
    // await thunkAPI.dispatch(fetchContactUsList());

    return;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل إرسال الرسالة");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const contactUsSlice = createSlice({
  name: "contactUs",
  initialState,
  reducers: {
    clearContactUsErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.sendError = null;
    },
    clearContactUsSelected: (state) => {
      state.selected = null;
      state.detailsError = null;
      state.detailsLoading = false;
    },
    resetSendStatus: (state) => {
      state.sentSuccess = false;
      state.sendError = null;
      state.sendLoading = false;
    },
    clearContactUsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetch list
      .addCase(fetchContactUsList.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContactUsList.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContactUsList.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetch by id
      .addCase(fetchContactUsById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchContactUsById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selected = action.payload;
      })
      .addCase(fetchContactUsById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || "حدث خطأ";
      })

      // send
      .addCase(sendContactUs.pending, (state) => {
        state.sendLoading = true;
        state.sendError = null;
        state.sentSuccess = false;
      })
      .addCase(sendContactUs.fulfilled, (state) => {
        state.sendLoading = false;
        state.sentSuccess = true;
      })
      .addCase(sendContactUs.rejected, (state, action) => {
        state.sendLoading = false;
        state.sendError = action.payload || "حدث خطأ";
        state.sentSuccess = false;
      });
  },
});

export const {
  clearContactUsErrors,
  clearContactUsSelected,
  resetSendStatus,
  clearContactUsState,
} = contactUsSlice.actions;

export default contactUsSlice.reducer;
