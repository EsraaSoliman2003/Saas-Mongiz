import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios, { isAxiosError } from "axios";
import { toast } from "sonner";

/* =========================
   API Key
========================= */

const APIKEY = "68983f7c690449ce9bf2b92afea9e0da";

/* =========================
   Axios Instance
========================= */

const instance = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

/* =========================
   Types
========================= */

export interface CurrencyState {
  loading: boolean;
  data: Record<string, number>;
  error: string | null;
}

/* =========================
   Initial State
========================= */

const initialState: CurrencyState = {
  loading: false,
  data: {},
  error: null,
};

/* =========================
   Thunk
========================= */

export const fetchCurrency = createAsyncThunk<
  Record<string, number>,
  void,
  { rejectValue: string }
>("currency/fetchCurrency", async (_, thunkAPI) => {
  try {
    const res = await instance.get(
      `https://api.currencyfreaks.com/v2.0/rates/latest?apikey=${APIKEY}`,
    );

    const rates = res.data.rates;

    const neededCurrencies = ["EGP", "SAR", "JOD", "AED", "USD", "CNY"];

    const formatted: Record<string, number> = {};

    neededCurrencies.forEach((code) => {
      formatted[code] = Number(rates[code]);
    });

    return formatted;
  } catch (err) {
    if (isAxiosError(err)) {
      const message = err.response?.data?.message || "Failed to fetch currency";
      // toast.error(message);
      return thunkAPI.rejectWithValue(message);
    }

    // toast.error("Unexpected error occurred");
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* =========================
   Slice
========================= */

const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    resetCurrencyState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrency.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

/* =========================
   Exports
========================= */

export const { resetCurrencyState } = currencySlice.actions;
export default currencySlice.reducer;
