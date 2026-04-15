import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

export interface Colors {
  id: number;
  Primary: string;
  Secondary: string;
}

/* ===========================
   Initial State
=========================== */
interface ColorsState {
  loading: boolean;
  data: Colors[];
  error: string | null;
}

const initialState: ColorsState = {
  loading: false,
  data: [],
  error: null,
};

/* ===========================
   Async Thunks
=========================== */
export const fetchColors = createAsyncThunk<
  Colors[],
  void,
  { rejectValue: string }
>("colors/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/Colors");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل الألوان",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Update Colors
=========================== */
export const updateColors = createAsyncThunk<
  { id: number },
  number,
  { rejectValue: string }
>("colors/update", async (id, thunkAPI) => {
  try {
    await axios.put(`/Colors/${id}`);
    return { id };
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحديث الألوان",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */
const colorsSlice = createSlice({
  name: "color",
  initialState,
  reducers: {
    resetColorsState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchColors.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      })
      .addCase(updateColors.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateColors.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateColors.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { resetColorsState } = colorsSlice.actions;
export default colorsSlice.reducer;
