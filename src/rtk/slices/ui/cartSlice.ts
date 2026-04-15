import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SelectedOptions {
  type?: { id: number; name: string | null };
  color?: { id: number; name: string | null };
  size?: { id: number; name: string | null };
  volume?: { id: number; name: string | null };
  shape?: { id: number; name: string | null };
  weight?: { id: number; name: string | null };
  memory?: { id: number; name: string | null };
}

export interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
  maxQty?: number;
  selectedOptions: SelectedOptions;
}

export interface Address {
  id: number;
  country: string | null;
  city: string | null;
  houseNumberAndStreet: string | null;
  isDefault?: boolean;
  phoneNumber: string;
}

export type CartState = {
  items: CartItem[];
  hydrated: boolean;
  address?: Address | null;
  coupon?: string | null;
};

const initialState: CartState = {
  items: [],
  hydrated: false,
  address: null,
  coupon: null,
};

// Generate a unique key for each product + selected options
const getItemKey = (item: { id: number; selectedOptions: SelectedOptions }) => {
  const o = item.selectedOptions;
  return `${item.id}-${o.type?.id ?? 0}-${o.color?.name ?? 0}-${o.size?.name ?? 0}-${o.volume?.name ?? 0}-${o.shape?.name ?? 0}-${o.weight?.name ?? 0}-${o.memory?.name ?? 0}`;
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCart(state, action: PayloadAction<CartItem[]>) {
      state.items = action.payload ?? [];
      state.hydrated = true;
    },

    addOrOverwrite(state, action: PayloadAction<CartItem>) {
      const newItem = action.payload;
      const key = getItemKey(newItem);
      const index = state.items.findIndex((item) => getItemKey(item) === key);

      const finalQty = newItem.maxQty
        ? Math.min(Math.max(1, newItem.qty), newItem.maxQty)
        : Math.max(1, newItem.qty);

      if (index !== -1) {
        // Overwrite existing item
        state.items[index] = {
          ...state.items[index],
          ...newItem,
          qty: finalQty,
        };
      } else {
        // Add as new item
        state.items.push({ ...newItem, qty: finalQty });
      }
    },

    setQty(
      state,
      action: PayloadAction<{ id: number; selectedOptions: SelectedOptions; qty: number }>
    ) {
      const { id, selectedOptions, qty } = action.payload;
      const key = getItemKey({ id, selectedOptions });
      state.items = state.items.map((item) => {
        if (getItemKey(item) === key) {
          const finalQty = item.maxQty
            ? Math.min(Math.max(1, qty), item.maxQty)
            : Math.max(1, qty);
          return { ...item, qty: finalQty };
        }
        return item;
      });
    },

    removeItem(
      state,
      action: PayloadAction<{ id: number; selectedOptions: SelectedOptions }>
    ) {
      const { id, selectedOptions } = action.payload;
      const key = getItemKey({ id, selectedOptions });
      state.items = state.items.filter((item) => getItemKey(item) !== key);
    },

    clearCart(state) {
      state.items = [];
      state.coupon = null;
      state.address = null;
    },

    setAddress(state, action: PayloadAction<Address | null>) {
      state.address = action.payload ?? null;
    },

    setCoupon(state, action: PayloadAction<string | null>) {
      state.coupon = action.payload;
    },
  },
});

export const {
  setCart,
  addOrOverwrite,
  setQty,
  removeItem,
  clearCart,
  setAddress,
  setCoupon,
} = cartSlice.actions;

export default cartSlice.reducer;