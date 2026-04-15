import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";
import { number } from "zod";
import { ProductApi } from "../productDetails/productDetailsSlice";

/* ===========================
   Types
=========================== */

export type OrderSeller = {
  id: number;
  customerName: string;
  timeCreateOrder: string;
  status: number;
};

export type OrderUserApi = {
  id: string;
  fullName: string;
  phoneNumber: string;
  imageUrl: string | null;
  email: string;
  countryCode: string;
};

export type DeliveryAddressApi = {
  id: number;
  country: string;
  governorate: string;
  phoneNumber: string;
  city: string;
  houseNumberAndStreet: string;
  isDefault: boolean;
  userId: number;
};

export type additionalDataSelectionsItem = {
  productAdditionalDataId: number;
  selectedValue: string;
};

export type OrderProductApi = {
  id: number;
  price: number;
  quantity: number;
  status: number;
  additionalDataSelections: additionalDataSelectionsItem[];
  product: ProductApi; // You can further type this if needed
};

export type OrderApi = {
  id: number;
  totalPrice: number;
  mainPrice: number;
  discount: number | null;
  status: number;
  itemsCount: number;
  hasDelivery: boolean;
  deliveryPrice: number | null;
  deliveryDate: string | null;
  user: OrderUserApi | null;
  deliveryAddress: DeliveryAddressApi | null;
  orderProducts: OrderProductApi[];
};

export type OrdersPaginationResponse = {
  items: OrderApi[];
  currentPage: number;
  nextPage: number;
  previousPage: number;
  firstPageLink?: string;
  lastPageLink?: string;
  nextPageLink?: string;
  previousPageLink?: string;
  totalItems: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  pageCount: number;
};

export type FetchOrdersParams = {
  page?: number;
  pageSize?: number;
};

/* ===========================
   Create Order Types
=========================== */

export type additionalDataSelectionPayload = {
  productAdditionalDataId: number;
  selectedValue: string;
};

export type OrderProductPayload = {
  productId: number;
  quantity: number;
  typeId: number | null;
  additionalDataSelections?: additionalDataSelectionPayload[];
};

export type CreateOrderPayload = {
  deliveryAddressId: number;
  couponCode?: string | null;
  orderProducts: OrderProductPayload[];
};

/* ===========================
   Order History Types (API returns array)
=========================== */

export type OrderHistoryItemApi = {
  orderId: number;
  orderDate: string;
  itemsCount: number;
  totalPrice: number;
  orderStatus: number;
};

/* ===========================
   State
=========================== */

type OrdersState = {
  loading: boolean;
  error: string | null;

  items: OrderApi[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;

  selectedLoading: boolean;
  selectedOrder: OrderApi | null;
  selectedError: string | null;

  createLoading: boolean;
  createError: string | null;
  createdOrder: OrderApi | null;

  // Order History (no pagination from API)
  historyLoading: boolean;
  historyError: string | null;
  historyItems: OrderHistoryItemApi[];

  sellerOrdersLoading: boolean;
  sellerOrdersError: string | null;
  sellerOrders: OrderSeller[];

  productLoading: Record<number, boolean>; // key = orderProductId
  productError: Record<number, string | null>; // key = orderProductId
};

const initialState: OrdersState = {
  loading: false,
  error: null,
  items: [],
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,

  selectedLoading: false,
  selectedOrder: null,
  selectedError: null,

  createLoading: false,
  createError: null,
  createdOrder: null,

  historyLoading: false,
  historyError: null,
  historyItems: [],

  sellerOrdersLoading: false,
  sellerOrdersError: null,
  sellerOrders: [],

  productLoading: {},
  productError: {},
};

/* ===========================
   Thunks
=========================== */

// GET /api/Order?page=1&pageSize=10
export const fetchOrdersPaginated = createAsyncThunk<
  OrdersPaginationResponse,
  FetchOrdersParams,
  { rejectValue: string }
>("orders/fetchPaginated", async ({ page = 1, pageSize = 10 }, thunkAPI) => {
  try {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    const res = await axios.get<OrdersPaginationResponse>(
      `/Order?${params.toString()}`,
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to load orders",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// GET /api/Order/seller/orders
export const fetchSellerOrders = createAsyncThunk<
  OrderSeller[], // returns an array of orders
  void,
  { rejectValue: string }
>("orders/fetchSellerOrders", async (_, thunkAPI) => {
  try {
    const res = await axios.get<OrderSeller[]>("/Order/seller/orders"); // <-- fix here
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to load seller orders",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// GET /api/Order/{id}
export const fetchOrderById = createAsyncThunk<
  OrderApi,
  number,
  { rejectValue: string }
>("orders/fetchById", async (id, thunkAPI) => {
  try {
    const res = await axios.get<OrderApi>(`/Order/${id}`);
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to load order details",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// POST /api/Order
export const createOrder = createAsyncThunk<
  OrderApi,
  CreateOrderPayload,
  { rejectValue: string }
>("orders/create", async (payload, thunkAPI) => {
  try {
    // userId is NOT included – it's derived from token on server
    const res = await axios.post<OrderApi>("/Order", payload);
    // Refresh list after creation
    const state = thunkAPI.getState() as any;
    const currentPage = state.orders?.currentPage ?? 1;
    const pageSize = state.orders?.pageSize ?? 10;
    await thunkAPI.dispatch(
      fetchOrdersPaginated({ page: currentPage, pageSize }),
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to create order",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// GET /api/OrderHistory/history – returns array
export const fetchOrderHistory = createAsyncThunk<
  OrderHistoryItemApi[],
  void,
  { rejectValue: string }
>("orders/fetchHistory", async (_, thunkAPI) => {
  try {
    const res = await axios.get<OrderHistoryItemApi[]>("/OrderHistory/history");
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to load order history",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// PUT /api/Order/{id}?orderId={id} – both are the same value
export type UpdateOrderStatusPayload = {
  orderId: number; // the same as path id
  status: number;
};

export const updateOrderStatus = createAsyncThunk<
  OrderApi,
  UpdateOrderStatusPayload,
  { rejectValue: string }
>("orders/updateStatus", async ({ orderId, status }, thunkAPI) => {
  try {
    const res = await axios.put<OrderApi>(
      `/Order/${orderId}?orderId=${orderId}`,
      { id: orderId, status },
    );
    // Refresh list after update
    const state = thunkAPI.getState() as any;
    const currentPage = state.orders?.currentPage ?? 1;
    const pageSize = state.orders?.pageSize ?? 10;
    await thunkAPI.dispatch(
      fetchOrdersPaginated({ page: currentPage, pageSize }),
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to update order status",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// PUT /api/Order/order-product/ready?OrderProductId=...
export type MarkOrderProductReadyPayload = {
  orderProductId: number;
};
export const markOrderProductReady = createAsyncThunk<
  boolean,
  MarkOrderProductReadyPayload,
  { rejectValue: string }
>("orders/markOrderProductReady", async ({ orderProductId }, thunkAPI) => {
  try {
    const res = await axios.put<boolean>(
      `/Order/order-product/ready?OrderProductId=${orderProductId}`,
    );

    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title ||
          "Failed to mark order product as ready",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

// DELETE /api/Order?orderId=...
export type DeleteOrderPayload = {
  orderId: number;
};

export const deleteOrder = createAsyncThunk<
  number,
  DeleteOrderPayload,
  { rejectValue: string }
>("orders/delete", async ({ orderId }, thunkAPI) => {
  try {
    await axios.delete(`/Order?orderId=${orderId}`);
    // Refresh list after delete
    const state = thunkAPI.getState() as any;
    const currentPage = state.orders?.currentPage ?? 1;
    const pageSize = state.orders?.pageSize ?? 10;
    await thunkAPI.dispatch(
      fetchOrdersPaginated({ page: currentPage, pageSize }),
    );
    return orderId;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        (err.response?.data as any)?.title || "Failed to delete order",
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrdersError: (state) => {
      state.error = null;
      state.selectedError = null;
      state.createError = null;
      state.historyError = null;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
      state.selectedError = null;
      state.selectedLoading = false;
    },
    clearCreatedOrder: (state) => {
      state.createdOrder = null;
      state.createError = null;
      state.createLoading = false;
    },
    clearHistory: (state) => {
      state.historyItems = [];
      state.historyLoading = false;
      state.historyError = null;
    },
    clearOrdersState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // fetchOrdersPaginated
      .addCase(fetchOrdersPaginated.pending, (state, action) => {
        state.loading = true;
        state.error = null;
        state.pageSize = action.meta.arg.pageSize ?? state.pageSize;
      })
      .addCase(fetchOrdersPaginated.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.currentPage = action.payload.currentPage ?? 1;
        state.totalItems = action.payload.totalItems ?? 0;
        state.pageCount = action.payload.pageCount ?? 0;
        state.hasNextPage = action.payload.hasNextPage ?? false;
        state.hasPreviousPage = action.payload.hasPreviousPage ?? false;
      })
      .addCase(fetchOrdersPaginated.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "An error occurred";
      })

      // fetchOrderById
      .addCase(fetchOrderById.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload || "An error occurred";
      })

      // createOrder
      .addCase(createOrder.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
        state.createdOrder = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.createLoading = false;
        state.createdOrder = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload || "An error occurred";
      })

      // fetchOrderHistory (array)
      .addCase(fetchOrderHistory.pending, (state) => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchOrderHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.historyItems = action.payload;
      })
      .addCase(fetchOrderHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload || "An error occurred";
      })

      // updateOrderStatus
      .addCase(updateOrderStatus.pending, (state) => {
        // state.selectedLoading = true;
        // state.selectedError = null;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        // state.selectedLoading = false;
        state.selectedOrder = action.payload;
        const idx = state.items.findIndex((o) => o.id === action.payload.id);
        if (idx !== -1) state.items[idx] = action.payload;
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.selectedLoading = false;
        // state.selectedError = action.payload || "An error occurred";
      })

// markOrderProductReady
.addCase(markOrderProductReady.pending, (state, action) => {
  const id = action.meta.arg.orderProductId;
  state.productLoading[id] = true;
  state.productError[id] = null;
})
.addCase(markOrderProductReady.fulfilled, (state, action) => {
  const id = action.meta.arg.orderProductId;
  state.productLoading[id] = false;

  // Update product status in selectedOrder
  if (state.selectedOrder) {
    const product = state.selectedOrder.orderProducts.find((p) => p.id === id);
    if (product) product.status = 2;
  }

  // Optional: update in orders list
  state.items?.forEach((order) =>
    order.orderProducts.forEach((p) => {
      if (p.id === id) p.status = 2;
    })
  );
})
.addCase(markOrderProductReady.rejected, (state, action) => {
  const id = action.meta.arg.orderProductId;
  state.productLoading[id] = false;
  state.productError[id] = action.payload || "An error occurred";
})
      
      // deleteOrder
      .addCase(deleteOrder.pending, (state) => {
        state.selectedLoading = true;
        state.selectedError = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.selectedLoading = false;
        state.items = state.items.filter((o) => o.id !== action.payload);
        if (state.selectedOrder?.id === action.payload) {
          state.selectedOrder = null;
        }
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.selectedLoading = false;
        state.selectedError = action.payload || "An error occurred";
      })

      // fetchSellerOrders
      .addCase(fetchSellerOrders.pending, (state) => {
        state.sellerOrdersLoading = true;
        state.sellerOrdersError = null;
      })
      .addCase(fetchSellerOrders.fulfilled, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrders = action.payload;
      })
      .addCase(fetchSellerOrders.rejected, (state, action) => {
        state.sellerOrdersLoading = false;
        state.sellerOrdersError = action.payload || "An error occurred";
      });
  },
});

export const {
  clearOrdersError,
  clearSelectedOrder,
  clearCreatedOrder,
  clearHistory,
  clearOrdersState,
} = ordersSlice.actions;

export default ordersSlice.reducer;
