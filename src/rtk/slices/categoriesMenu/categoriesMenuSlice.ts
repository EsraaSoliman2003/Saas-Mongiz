import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

export interface subCategory {
  id: number;
  name: string;
  categoryId: number;
}

export interface categoriesMenu {
  id: number;
  name: string;
  image: string;
  subCategories: subCategory[];
}

/* ===========================
   Initial State
=========================== */
interface categoriesMenuState {
  loading: boolean;
  data: categoriesMenu[];
  error: string | null;
}

const initialState: categoriesMenuState = {
  loading: false,
  data: [],
  error: null,
};

/* ===========================
   Async Thunks
=========================== */
export const fetchMenu = createAsyncThunk<
  categoriesMenu[],
  void,
  { rejectValue: string }
>("categoriesMenu/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/Category/with-subcategories");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "فشل تحميل البانرات",
      );
    }
    return thunkAPI.rejectWithValue("حدث خطأ غير متوقع");
  }
});

/* ===========================
   Slice
=========================== */
const categoriesMenuSlice = createSlice({
  name: "categoriesMenu",
  initialState,
  reducers: {
    resetCategoriesMenuState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenu.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenu.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchMenu.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "حدث خطأ";
      });
  },
});

export const { resetCategoriesMenuState } = categoriesMenuSlice.actions;
export default categoriesMenuSlice.reducer;
