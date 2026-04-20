import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TenantState {
  id: string | null;
  name?: string;
}

const initialState: TenantState = {
  id: null,
  name: undefined,
};

const tenantSlice = createSlice({
  name: "tenant",
  initialState,
  reducers: {
    setTenant: (state, action: PayloadAction<TenantState>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
    },
    clearTenant: (state) => {
      state.id = null;
      state.name = undefined;
    },
  },
});

export const { setTenant, clearTenant } = tenantSlice.actions;
export default tenantSlice.reducer;