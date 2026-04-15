// store/howItWork/howItWorkSlice.ts
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { number } from "zod";

/* ===========================
   Types
=========================== */

export type HowItWorkApi = {
  id: string;
  title: string;
  highlight: string;
  description: string;
  images: string[];
};

export type HowItWorkFullApi = {
  id: string;
  titleEN: string;
  highlightEN: string;
  descriptionEN: string;
  titleAR: string;
  highlightAR: string;
  descriptionAR: string;
  images: string[];
};

/* ===========================
   State
=========================== */

interface HowItWorkState {
  loading: boolean;
  editLoading: boolean;
  items: HowItWorkApi[];
  error: string | null;
  editError: string | null;
  fullItem: HowItWorkFullApi | null;
  fullLoading: boolean;
  fullError: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: HowItWorkState = {
  loading: false,
  editLoading: false,
  items: [],
  error: null,
  editError: null,
  fullItem: null,
  fullLoading: false,
  fullError: null,
};

/* ===========================
   Thunk (GET)
=========================== */

export const fetchHowItWorkAll = createAsyncThunk<
  HowItWorkApi[],
  void,
  { rejectValue: string }
>("howItWork/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get<HowItWorkApi[]>("/HowItWork/All");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تحميل بيانات How It Work",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export interface EditPayload {
  Id: number;
  TitleEN: string;
  TitleAR: string;
  HighlightEN: string;
  HighlightAR: string;
  DescriptionEN: string;
  DescriptionAR: string;
  ExistsImages?: string[];
  Images?: File[];
}

export const editHowItWork = createAsyncThunk<
  void,
  EditPayload,
  { rejectValue: string }
>("howItWork/edit", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", String(payload.Id));
    formData.append("TitleEN", payload.TitleEN);
    formData.append("TitleAR", payload.TitleAR);
    formData.append("HighlightEN", payload.HighlightEN);
    formData.append("HighlightAR", payload.HighlightAR);
    formData.append("DescriptionEN", payload.DescriptionEN);
    formData.append("DescriptionAR", payload.DescriptionAR);

    if (payload.ExistsImages && payload.ExistsImages.length > 0) {
      payload.ExistsImages.forEach((img) =>
        formData.append("ExistsImages", img),
      );
    }

    if (payload.Images && payload.Images.length > 0) {
      payload.Images.forEach((file) => formData.append("Images", file));
    }

    const res = await axios.put(`/HowItWork/${payload.Id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تعديل بيانات How It Work",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

export const fetchHowItWorkFullById = createAsyncThunk<
  HowItWorkFullApi,
  number,
  { rejectValue: string }
>("howItWork/fetchFullById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<HowItWorkFullApi>(`/HowItWork/${id}/full`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title ||
          err.response?.data?.message ||
          "فشل تحميل تفاصيل How It Work",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */

const howItWorkSlice = createSlice({
  name: "howItWork",
  initialState,
  reducers: {
    clearHowItWorkError: (state) => {
      state.error = null;
    },
    clearHowItWorkState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // ===== GET all =====
      .addCase(fetchHowItWorkAll.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHowItWorkAll.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHowItWorkAll.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })

      // ===== EDIT =====
      .addCase(editHowItWork.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHowItWork.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editHowItWork.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ أثناء التعديل";
      })
      .addCase(fetchHowItWorkFullById.pending, (state) => {
        state.fullLoading = true;
        state.fullError = null;
      })
      .addCase(fetchHowItWorkFullById.fulfilled, (state, action) => {
        state.fullLoading = false;
        state.fullItem = action.payload;
      })
      .addCase(fetchHowItWorkFullById.rejected, (state, action) => {
        state.fullLoading = false;
        state.fullError = action.payload || "حدث خطأ";
      });
  },
});

export const { clearHowItWorkError, clearHowItWorkState } =
  howItWorkSlice.actions;

export default howItWorkSlice.reducer;
