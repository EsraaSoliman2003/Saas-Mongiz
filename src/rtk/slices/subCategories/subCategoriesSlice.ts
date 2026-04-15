import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";
import {
  SubCategory,
  FullSubCategory,
  CreateSubCategoryDto,
  UpdateSubCategoryDto,
} from "@/utils/dtos";

/* ===========================
   State
=========================== */

export interface SubCategoriesState {
  data: Record<number, SubCategory[]>; // grouped by categoryId
  selected: FullSubCategory | null;

  loading: {
    fetchByCategory: Record<number, boolean>;
    fetchById: boolean;
    create: boolean;
    update: boolean;
    delete: Record<number, boolean>;
  };

  error: string | null;
}

const initialState: SubCategoriesState = {
  data: {},
  selected: null,

  loading: {
    fetchByCategory: {},
    fetchById: false,
    create: false,
    update: false,
    delete: {},
  },

  error: null,
};

/* ===========================
   GET SubCategories By Category
   GET /api/SubCategory/by-category/{categoryId}
=========================== */

export const fetchSubCategoryByCategory = createAsyncThunk<
  { categoryId: number; items: SubCategory[] },
  number,
  { rejectValue: string }
>("subCategories/fetchByCategory", async (categoryId, thunkAPI) => {
  try {
    const res = await axios.get(`SubCategory/by-category/${categoryId}`);
    return { categoryId, items: res.data };
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load subcategories",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   GET SubCategory By Id
   GET /api/SubCategory/{id}
=========================== */

export const fetchSubCategoryById = createAsyncThunk<
  FullSubCategory,
  number,
  { rejectValue: string }
>("subCategories/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`SubCategory/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load subcategory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   CREATE SubCategory
   POST /api/SubCategory
=========================== */

export const createSubCategory = createAsyncThunk<
  void,
  CreateSubCategoryDto,
  { rejectValue: string }
>("subCategories/create", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("CategoryId", data.categoryId.toString());

    await axios.post("SubCategory", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to create subcategory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   UPDATE SubCategory
   PUT /api/SubCategory/{id}
=========================== */

export const updateSubCategory = createAsyncThunk<
  void,
  UpdateSubCategoryDto,
  { rejectValue: string }
>("subCategories/update", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", data.id.toString());
    formData.append("Name", data.name);

    await axios.put(`SubCategory/${data.id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to update subcategory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   DELETE SubCategory
   DELETE /api/SubCategory/{id}
=========================== */

export const deleteSubCategory = createAsyncThunk<
  { categoryId: number; id: number },
  { categoryId: number; id: number },
  { rejectValue: string }
>("subCategories/delete", async (params, thunkAPI) => {
  try {
    await axios.delete(`SubCategory/${params.id}`);
    return params;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to delete subcategory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const subCategoriesSlice = createSlice({
  name: "subCategories",
  initialState,
  reducers: {
    resetSubCategoriesState: () => initialState,
    clearSelectedSubCategory: (state) => {
      state.selected = null;
    },
  },
  extraReducers: (builder) => {
    builder

      /* FETCH BY CATEGORY */
      .addCase(fetchSubCategoryByCategory.pending, (state, action) => {
        state.loading.fetchByCategory[action.meta.arg] = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryByCategory.fulfilled, (state, action) => {
        state.loading.fetchByCategory[action.payload.categoryId] = false;
        state.data[action.payload.categoryId] = action.payload.items;
      })
      .addCase(fetchSubCategoryByCategory.rejected, (state, action) => {
        state.loading.fetchByCategory[action.meta.arg] = false;
        state.error = action.payload || "Error";
      })

      /* FETCH BY ID */
      .addCase(fetchSubCategoryById.pending, (state) => {
        state.loading.fetchById = true;
        state.error = null;
      })
      .addCase(fetchSubCategoryById.fulfilled, (state, action) => {
        state.loading.fetchById = false;
        state.selected = action.payload;
      })
      .addCase(fetchSubCategoryById.rejected, (state, action) => {
        state.loading.fetchById = false;
        state.error = action.payload || "Error";
      })

      /* CREATE */
      .addCase(createSubCategory.pending, (state) => {
        state.loading.create = true;
        state.error = null;
      })
      .addCase(createSubCategory.fulfilled, (state) => {
        state.loading.create = false;
      })
      .addCase(createSubCategory.rejected, (state, action) => {
        state.loading.create = false;
        state.error = action.payload || "Error";
      })

      /* UPDATE */
      .addCase(updateSubCategory.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateSubCategory.fulfilled, (state) => {
        state.loading.update = false;
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload || "Error";
      })

      /* DELETE */
      .addCase(deleteSubCategory.pending, (state, action) => {
        state.loading.delete[action.meta.arg.id] = true;
        state.error = null;
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        const { categoryId, id } = action.payload;

        state.loading.delete[id] = false;

        state.data[categoryId] =
          state.data[categoryId]?.filter((sc) => sc.id !== id) || [];
      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.loading.delete[action.meta.arg.id] = false;
        state.error = action.payload || "Error";
      });
  },
});

export const { resetSubCategoriesState, clearSelectedSubCategory } =
  subCategoriesSlice.actions;

export default subCategoriesSlice.reducer;
