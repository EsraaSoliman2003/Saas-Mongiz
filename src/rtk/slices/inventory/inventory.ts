import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { isAxiosError } from "axios";
import axios from "@/lib/axios";

/* ===========================
   Types
=========================== */

export interface InventoryItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imagePath: string;
}

interface InventoryState {
  loading: boolean;
  addLoading: boolean;
  uploadLoading: boolean;
  deleteLoading: boolean;
  data: InventoryItem[];
  item: InventoryItem | null;
  error: string | null;
}

const initialState: InventoryState = {
  loading: false,
  addLoading: false,
  uploadLoading: false,
  deleteLoading: false,
  data: [],
  item: null,
  error: null,
};

/* ===========================
   GET Inventory
=========================== */

export const fetchInventory = createAsyncThunk<
  InventoryItem[],
  void,
  { rejectValue: string }
>("inventory/fetchAll", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/Inventory");

    return Array.isArray(res.data) ? res.data : [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to fetch inventory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   GET Inventory By Id
=========================== */

export const fetchInventoryById = createAsyncThunk<
  InventoryItem | null, // returned value can be null
  number, // payload is the inventory ID
  { rejectValue: string }
>("inventory/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get(`/Inventory/${id}`);

    // assuming API returns single object
    return res.data || null;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to fetch inventory",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   ADD Inventory
=========================== */

interface AddInventoryPayload {
  name: string;
  price: number;
  quantity: number;
  image?: File;
}

export const addInventory = createAsyncThunk<
  InventoryItem,
  AddInventoryPayload,
  { rejectValue: string }
>("inventory/add", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Name", data.name);
    formData.append("Price", String(data.price));
    formData.append("Quantity", String(data.quantity));

    if (data.image) {
      formData.append("Image", data.image);
    }

    const res = await axios.post("/Inventory", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to add item",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   UPDATE Inventory
=========================== */

interface UpdateInventoryPayload {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: File;
}

export const updateInventory = createAsyncThunk<
  void,
  UpdateInventoryPayload,
  { rejectValue: string }
>("inventory/update", async (data, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("Id", String(data.id));
    formData.append("Name", data.name);
    formData.append("Price", String(data.price));
    formData.append("Quantity", String(data.quantity));

    if (data.image) {
      formData.append("Image", data.image);
    }

    await axios.put(`/Inventory/${data.id}`, formData);
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to update item",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   DELETE Inventory
=========================== */

export const deleteInventory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("inventory/delete", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Inventory/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to delete item",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Upload Excel
=========================== */

export const uploadInventoryExcel = createAsyncThunk<
  void,
  File,
  { rejectValue: string }
>("inventory/uploadExcel", async (file, thunkAPI) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    await axios.post("/Inventory/upload-excel-products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      transformRequest: [(data) => data],
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to upload file",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Transfer Product
=========================== */
interface TransferProductPayload {
  id: number; // product id
  discount?: number;
  brandId: number;
  keywords?: string[];
  variants?: any; // type properly if you have Variant type
  additionalData?: any;
  images?: string[]; // array of image URLs or base64
  subCategoryId?: number;
  categoryId: number;
  limitStock?: number;
  description: string;
  limitProducts?: number;
}

export const transferProduct = createAsyncThunk<
  void,
  TransferProductPayload,
  { rejectValue: string }
>("inventory/transferProduct", async (payload, thunkAPI) => {
  try {
    const formData = new FormData();

    // Append fields if they exist
    if (payload.discount !== undefined)
      formData.append("Discount", payload.discount.toString());
    formData.append("BrandId", payload.brandId.toString());
    formData.append("CategoryId", payload.categoryId.toString());
    formData.append("Description", payload.description);

    if (payload.subCategoryId !== undefined)
      formData.append("SubCategoryId", payload.subCategoryId.toString());
    if (payload.limitStock !== undefined)
      formData.append("LimitStock", payload.limitStock.toString());
    if (payload.limitProducts !== undefined)
      formData.append("LimitProducts", payload.limitProducts.toString());

    // Arrays need to be appended individually or as JSON strings
    if (payload.keywords && payload.keywords.length > 0) {
      payload.keywords.forEach((kw) => formData.append("Keywords", kw));
    }
    if (payload.images && payload.images.length > 0) {
      payload.images.forEach((img) => formData.append("Images", img));
    }
    if (payload.variants) {
      formData.append("Variants", JSON.stringify(payload.variants));
    }
    if (payload.additionalData) {
      formData.append("AdditionalData", JSON.stringify(payload.additionalData));
    }

    await axios.post(`/Inventory/${payload.id}/Transfer-Products`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to transfer product",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const inventorySlice = createSlice({
  name: "inventory",
  initialState,
  reducers: {
    resetInventoryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // GET
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // GET by id
      .addCase(fetchInventoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.item = action.payload; // InventoryItem | null
      })
      .addCase(fetchInventoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error";
      })

      // ADD
      .addCase(addInventory.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(addInventory.fulfilled, (state, action) => {
        state.addLoading = false;
        state.data.unshift(action.payload);
      })

      // Transfer
      .addCase(transferProduct.pending, (state, action) => {
        state.addLoading = true;
      })
      .addCase(transferProduct.fulfilled, (state, action) => {
        state.addLoading = false;
      })

      // import
      .addCase(uploadInventoryExcel.pending, (state, action) => {
        state.uploadLoading = true;
      })
      .addCase(uploadInventoryExcel.fulfilled, (state, action) => {
        state.uploadLoading = false;
      })

      // UPDATE
      .addCase(updateInventory.fulfilled, (state, action) => {
        // optional: refetch OR update locally
      })

      // DELETE
      .addCase(deleteInventory.pending, (state, action) => {
        state.deleteLoading = true;
      })
      .addCase(deleteInventory.fulfilled, (state, action) => {
        state.deleteLoading = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      });
  },
});

export const { resetInventoryState } = inventorySlice.actions;
export default inventorySlice.reducer;
