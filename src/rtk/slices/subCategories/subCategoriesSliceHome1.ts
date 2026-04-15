import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import { SubCategory, FullSubCategory } from "@/utils/dtos";

/* ===========================
   State
=========================== */

export interface SubCategoriesState {
  data: SubCategory[];
  selected: FullSubCategory | null;
  loading: {
    fetch: boolean;
    fetchById: boolean;
    create: boolean;
    update: boolean;
    delete: boolean;
  };
  error: string | null;
}

const initialState: SubCategoriesState = {
  data: [],
  selected: null,
  loading: {
    fetch: false,
    fetchById: false,
    create: false,
    update: false,
    delete: false,
  },
  error: null,
};

/* ===========================
   Thunk
=========================== */

export const fetchSubCategories = createAsyncThunk<
  SubCategory[],
  number,
  { rejectValue: string }
>("subCategoriesHome1/fetch", async (categoryId, thunkAPI) => {
  try {
    const res = await axios.get(
      `/SubCategory/by-category/${categoryId}`
    );

    // Adjust if API returns { items: [] }
    return res.data?.items || res.data || [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load subcategories"
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const subCategoriesSlice = createSlice({
  name: "subCategoriesHome1",
  initialState,
  reducers: {
    resetSubCategoriesState: () => initialState,
    clearSelectedSubCategory: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubCategories.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchSubCategories.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.data = action.payload;
      })
      .addCase(fetchSubCategories.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload || "Error";
      });
  },
});

export const {
  resetSubCategoriesState,
  clearSelectedSubCategory,
} = subCategoriesSlice.actions;

export default subCategoriesSlice.reducer;