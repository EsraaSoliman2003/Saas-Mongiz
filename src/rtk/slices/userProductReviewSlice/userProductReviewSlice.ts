// userProductReviewSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export interface UserProductReview {
  reviewId: number;
  userName: string;
  userImage: string;
  rate: number;
  comment: string;
  createdAt: string;
  isMe: boolean;
}

export interface UserProductReviewResponse {
  items: UserProductReview[];
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
}

interface UserProductReviewState {
  loading: boolean;
  error: string | null;
  items: UserProductReview[];
  currentPage: number;
  pageSize: number;
  totalItems: number;
  pageCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/* ===========================
   Initial State
=========================== */

const initialState: UserProductReviewState = {
  loading: false,
  error: null,
  items: [],
  currentPage: 1,
  pageSize: 10,
  totalItems: 0,
  pageCount: 0,
  hasNextPage: false,
  hasPreviousPage: false,
};

/* ===========================
   Thunks
=========================== */

export const fetchReviewsByProduct = createAsyncThunk<
  UserProductReviewResponse,
  { productId: number; page?: number; pageSize?: number },
  { rejectValue: string }
>("userProductReview/fetchByProduct", async (args, thunkAPI) => {
  try {
    const { productId, page = 1, pageSize = 10 } = args;
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });

    const res = await axios.get<UserProductReviewResponse>(
      `/UserProductReview/product/${productId}?${params.toString()}`
    );
    return res.data;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to fetch reviews"
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

export const deleteReview = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>("userProductReview/delete", async (reviewId, thunkAPI) => {
  try {
    await axios.delete(`/UserProductReview/${reviewId}`);
    return reviewId;
  } catch (err) {
    if (isAxiosError(err)) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.title || "Failed to delete review"
      );
    }
    return thunkAPI.rejectWithValue("Unexpected error");
  }
});

/* ===========================
   Slice
=========================== */

const userProductReviewSlice = createSlice({
  name: "userProductReview",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviewsByProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviewsByProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items ?? [];
        state.currentPage = action.payload.currentPage ?? 1;
        state.totalItems = action.payload.totalItems ?? 0;
        state.pageCount = action.payload.pageCount ?? 0;
        state.hasNextPage = action.payload.hasNextPage ?? false;
        state.hasPreviousPage = action.payload.hasPreviousPage ?? false;
      })
      .addCase(fetchReviewsByProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Error fetching reviews";
      })
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.items = state.items.filter((r) => r.reviewId !== deletedId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.error = action.payload || "Error deleting review";
      });
  },
});

export default userProductReviewSlice.reducer;