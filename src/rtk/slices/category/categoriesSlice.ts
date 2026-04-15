import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import {
  Category,
  FullCategory,
  CreateCategoryDto,
  UpdateCategoryDto,
} from "@/utils/dtos";

/* ===========================
   State
=========================== */

interface CategoriesState {
  loading: boolean;
  updateLoading?: boolean;
  data: Category[];
  fullData: FullCategory[];
  selectedCategory: FullCategory | null; // full
  selectedSimpleCategory: Category | null; // 👈 الجديد
  error: string | null;
}

const initialState: CategoriesState = {
  loading: false,
  updateLoading: false,
  data: [],
  fullData: [],
  selectedCategory: null,
  selectedSimpleCategory: null, // 👈 الجديد
  error: null,
};

/* ===========================
   GET Categories
   GET /api/Category
=========================== */
export const fetchCategories = createAsyncThunk<
  Category[],
  void,
  { rejectValue: string }
>("categories/fetch", async (_, thunkAPI) => {
  try {
    const res = await axios.get("Category");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load categories",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   GET Category By Id (Full)
   GET /api/Category/{id}/full
=========================== */
export const fetchCategoryByIdFull = createAsyncThunk<
  FullCategory,
  number,
  { rejectValue: string }
>("categories/fetchByIdFull", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`Category/${id}/full`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   GET Category By Id
   GET /api/Category/{id}
=========================== */
export const fetchCategoryById = createAsyncThunk<
  Category,
  number,
  { rejectValue: string }
>("categories/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`Category/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   POST Category
   POST /api/Category
=========================== */
export const createCategory = createAsyncThunk<
  void,
  CreateCategoryDto,
  { rejectValue: string }
>("categories/create", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Image", data.image);

    await axios.post("Category", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to create category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   PUT Category
   PUT /api/Category/{id}
=========================== */
export const updateCategory = createAsyncThunk<
  void,
  UpdateCategoryDto,
  { rejectValue: string }
>("categories/update", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", data.id.toString());
    formData.append("Name", data.name);

    if (data.image) {
      formData.append("Image", data.image);
    }

    await axios.put(`Category/${data.id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to update category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   DELETE Category
   DELETE /api/Category/{id}
=========================== */
export const deleteCategory = createAsyncThunk<
  void,
  number,
  { rejectValue: string }
>("categories/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`Category/${id}`);
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to delete category",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const categoriesSlice = createSlice({
  name: "categories",
  initialState,

  reducers: {
    resetCategoriesState: () => initialState,
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
    clearSelectedSimpleCategory: (state) => {
      state.selectedSimpleCategory = null;
    },
  },

  extraReducers: (builder) => {
    builder

      // GET
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // GET FULL
      .addCase(fetchCategoryByIdFull.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryByIdFull.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
      })
      .addCase(fetchCategoryByIdFull.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedSimpleCategory = action.payload;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // POST
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // PUT
      .addCase(updateCategory.pending, (state) => {
        state.updateLoading = true;
      })
      .addCase(updateCategory.fulfilled, (state) => {
        state.updateLoading = false;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.updateLoading = false;
        state.error = action.payload || "Error";
      })

      // DELETE
      .addCase(deleteCategory.fulfilled, (state) => {
        state.loading = false;
      });
  },
});

export const { resetCategoriesState } = categoriesSlice.actions;
export default categoriesSlice.reducer;
