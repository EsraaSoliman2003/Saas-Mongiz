import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export interface StatisticalResponse {
  productsCount: number;
  categoriesCount: number;
  ordersCount: number;
}

interface StatisticalState {
  loading: boolean;
  data: StatisticalResponse | null;
  error: string | null;
}

/* ===========================
   Initial State
=========================== */

const initialState: StatisticalState = {
  loading: false,
  data: null,
  error: null,
};

/* ===========================
   Thunks
=========================== */

export const fetchStatistical = createAsyncThunk<
  StatisticalResponse,
  void,
  { rejectValue: string }
>("statistical/fetchStatistical", async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get("/Statistical");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return rejectWithValue(err.response?.data?.message || "Request failed");
    }
    return rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const statisticalSlice = createSlice({
  name: "statistical",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistical.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistical.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchStatistical.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch statistics";
      });
  },
});

export default statisticalSlice.reducer;
