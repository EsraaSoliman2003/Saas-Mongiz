import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { Product } from "@/utils/dtos";

export interface SearchHistoryItem {
  id: number;
  keyword: string;
}

interface SearchState {
  loading: boolean;
  results: Product[];
  searchedKeyword: string; // 👈 new field
  history: SearchHistoryItem[];
  error: string | null;
}

const initialState: SearchState = {
  loading: false,
  results: [],
  searchedKeyword: "", // 👈 initialize
  history: [],
  error: null,
};

// Search Products
export const searchProducts = createAsyncThunk<
  Product[],
  string,
  { rejectValue: string }
>("search/searchProducts", async (keyword, thunkAPI) => {
  try {
    const res = await axios.post("/Search", { keyword });
    return res.data || [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Search failed",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// Fetch History
export const fetchSearchHistory = createAsyncThunk<
  SearchHistoryItem[],
  void,
  { rejectValue: string }
>("search/fetchHistory", async (_, thunkAPI) => {
  try {
    const res = await axios.get("/Search/history");
    return res.data || [];
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to load history",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// Delete History Item
export const deleteSearchHistory = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("search/deleteHistory", async (id, thunkAPI) => {
  try {
    await axios.delete(`/Search/history/${id}`);
    return id;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Delete failed",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    clearSearchResults: (state) => {
      state.results = [];
      state.searchedKeyword = ""; // also clear the tracked keyword
    },
  },
  extraReducers: (builder) => {
    builder
      // Search
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
        state.searchedKeyword = action.meta.arg; // 👈 store the keyword used
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Search error";
      })

      // History
      .addCase(fetchSearchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })
      .addCase(deleteSearchHistory.fulfilled, (state, action) => {
        state.history = state.history.filter(
          (item) => item.id !== action.payload,
        );
      });
  },
});

export const { clearSearchResults } = searchSlice.actions;
export default searchSlice.reducer;
