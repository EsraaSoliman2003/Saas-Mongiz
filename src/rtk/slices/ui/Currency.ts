import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type CurrencyState = {
  currency: string | null;
};

const initialState: CurrencyState = {
  currency: "USD",
};

const currencySlice = createSlice({
  name: "selectedCurrency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<string>) => {
      state.currency = action.payload;
    },
  },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
