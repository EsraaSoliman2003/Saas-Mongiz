import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type FaqItem = {
  id: number;
  question: string;
  answer: string;
};

// ✅ NEW: full response
export type FaqFullItem = {
  id: number;
  question: string;
  answer: string;
};

export type CreateFaqPayload = {
  Question: string;
  Answer: string;
};

export type UpdateFaqPayload = {
  id: number;
  Question: string;
  Answer: string;
};

export type DeleteFaqPayload = {
  id: number;
};

/* ===========================
   State
=========================== */

interface FaqState {
  loading: boolean;
  faqs: FaqItem[];
  error: string | null;

  detailsLoading: boolean;
  selectedFaq: FaqItem | null;
  detailsError: string | null;

  // ✅ NEW: /Faq/{id}/full
  detailsFullLoading: boolean;
  selectedFaqFull: FaqFullItem | null;
  detailsFullError: string | null;

  createLoading: boolean;
  createError: string | null;

  updateLoading: boolean;
  updateError: string | null;

  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: FaqState = {
  loading: false,
  faqs: [],
  error: null,

  detailsLoading: false,
  selectedFaq: null,
  detailsError: null,

  // ✅ NEW
  detailsFullLoading: false,
  selectedFaqFull: null,
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

// GET /api/Faq
export const fetchFaqs = createAsyncThunk<
  FaqItem[],
  void,
  { rejectValue: string }
>("faq/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<FaqItem[]>("/Faq");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل الأسئلة الشائعة");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// GET /api/Faq/{id}
export const fetchFaqById = createAsyncThunk<
  FaqItem,
  number,
  { rejectValue: string }
>("faq/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<FaqItem>(`/Faq/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل السؤال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// ✅ NEW: GET /api/Faq/{id}/full
export const fetchFaqFullById = createAsyncThunk<
  FaqFullItem,
  number,
  { rejectValue: string }
>("faq/fetchFullById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<FaqFullItem>(`/Faq/${id}/full`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تحميل تفاصيل السؤال كاملة");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// POST /api/Faq (multipart/form-data)
export const createFaq = createAsyncThunk<
  void,
  CreateFaqPayload,
  { rejectValue: string }
>("faq/create", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Question", payload.Question);
    formData.append("Answer", payload.Answer);

    await axios.post("/Faq", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await thunkAPI.dispatch(fetchFaqs());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل إضافة السؤال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// PUT /api/Faq/{id} (multipart/form-data)
export const updateFaq = createAsyncThunk<
  void,
  UpdateFaqPayload,
  { rejectValue: string }
>("faq/update", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", String(payload.id));
    formData.append("Question", payload.Question);
    formData.append("Answer", payload.Answer);

    await axios.put(`/Faq/${payload.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    await thunkAPI.dispatch(fetchFaqs());
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل تعديل السؤال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

// DELETE /api/Faq/{id}
export const deleteFaq = createAsyncThunk<
  number,
  DeleteFaqPayload,
  { rejectValue: string }
>("faq/delete", async ({ id }, thunkAPI) => {
  try {
    await axios.delete(`/Faq/${id}`);

    await thunkAPI.dispatch(fetchFaqs());

    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue("فشل حذف السؤال");
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {
    clearFaqErrors: (state) => {
      state.error = null;
      state.detailsError = null;
      state.detailsFullError = null;
      state.createError = null;
      state.updateError = null;
      state.deleteError = null;
    },
    clearSelectedFaq: (state) => {
      state.selectedFaq = null;
      state.detailsError = null;
      state.detailsLoading = false;
    },
    // ✅ NEW: clear full selected (لحل مشكلة البيانات القديمة)
    clearSelectedFaqFull: (state) => {
      state.selectedFaqFull = null;
      state.detailsFullError = null;
      state.detailsFullLoading = false;
    },
    clearFaqState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchFaqs
      .addCase(fetchFaqs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFaqs.fulfilled, (state, action) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFaqs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // fetchFaqById
      .addCase(fetchFaqById.pending, (state) => {
        state.detailsLoading = true;
        state.detailsError = null;
      })
      .addCase(fetchFaqById.fulfilled, (state, action) => {
        state.detailsLoading = false;
        state.selectedFaq = action.payload;
      })
      .addCase(fetchFaqById.rejected, (state, action) => {
        state.detailsLoading = false;
        state.detailsError = action.payload || "حدث خطأ";
      })

      // ✅ fetchFaqFullById
      .addCase(fetchFaqFullById.pending, (state) => {
        state.detailsFullLoading = true;
        state.detailsFullError = null;
      })
      .addCase(fetchFaqFullById.fulfilled, (state, action) => {
        state.detailsFullLoading = false;
        state.selectedFaqFull = action.payload;
      })
      .addCase(fetchFaqFullById.rejected, (state, action) => {
        state.detailsFullLoading = false;
        state.detailsFullError = action.payload || "حدث خطأ";
      })

      // createFaq
      .addCase(createFaq.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createFaq.fulfilled, (state) => {
        state.createLoading = false;
      })
      .addCase(createFaq.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "حدث خطأ";
      })

      // updateFaq
      .addCase(updateFaq.pending, (state) => {
        state.updateLoading = true;
        state.updateError = null;
      })
      .addCase(updateFaq.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateFaq.rejected, (state, action) => {
        state.updateLoading = false;
        state.updateError = action.payload || "حدث خطأ";
      })

      // deleteFaq
      .addCase(deleteFaq.pending, (state) => {
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteFaq.fulfilled, (state, action) => {
        state.deleteLoading = false;

        if (state.selectedFaq?.id === action.payload) state.selectedFaq = null;
        if (state.selectedFaqFull?.id === action.payload)
          state.selectedFaqFull = null;
      })
      .addCase(deleteFaq.rejected, (state, action) => {
        state.deleteLoading = false;
        state.deleteError = action.payload || "حدث خطأ";
      });
  },
});

export const {
  clearFaqErrors,
  clearSelectedFaq,
  clearSelectedFaqFull,
  clearFaqState,
} = faqSlice.actions;

export default faqSlice.reducer;
