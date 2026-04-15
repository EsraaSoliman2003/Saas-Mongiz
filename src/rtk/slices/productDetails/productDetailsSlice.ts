import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "@/lib/axios";
import { isAxiosError } from "axios";

/* ===========================
   Types
=========================== */

export type BrandApi = {
  id: string;
  name: string;
};

export type ProductTypeApi = {
  id: number;
  type: string;
};

interface AdditionalDataItem {
  id: number;
  type: number;
  key: string;
  values: string[];
}

export type Variant = {
  attributes: Record<string, string>; // key: color, size, etc.
  quantity: number;
};

export type ProductApi = {
  lang?: string;

  brand?: BrandApi | null;
  types?: ProductTypeApi[];

  sellerId?: number;
  sellerName?: string | null;
  seller?: any;

  id: number;
  categoryId: number;
  subCategoryId?: number;

  name: string;
  description: string;

  mainPrice: number;
  price: number;
  discount: number;

  quantity: number;
  reviewCount: number;
  isFavourite: boolean;

  rate: number;
  averageRate: number;

  mainImage: string;
  images: string[];

  categoryName?: string;
  subCategoryName?: string;

  limitProducts?: number | null;
  limitStock?: number | null;

  hasReviewed?: boolean;
  keywords?: string[];
  additionalData?: AdditionalDataItem[];
  variants?: Variant[];
};

export type FeaturedProductApi = {
  brand?: BrandApi;
  types: ProductTypeApi[];
  id: number;
  categoryId: number;
  name: string;
  description: string;
  mainPrice: number;
  price: number;
  discount: number;
  quantity: number;
  reviewCount: number;
  isFavourite: boolean;
  rate: number;
  mainImage: string;
  averageRate: number;
  images: string[];
};

export type PaginationResponse<T> = {
  items: T[];
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

export type ReviewsSummaryApi = {
  averageRate: number;
  totalReviews: number;
  ratesBreakdown: Record<string, number>;
};

export type ProductReviewApi = {
  reviewId: number;
  isMe: boolean;
  userName: string;
  userImage: string | null;
  rate: number;
  comment: string;
  createdAt: string;
};

export type ProductDetailsResponse = {
  product: ProductApi;

  reviews: {
    summary: ReviewsSummaryApi;
    reviews: PaginationResponse<ProductReviewApi>;
  };

  featuredProducts: PaginationResponse<FeaturedProductApi>;

  limitProducts?: number | null;
  limitStock?: number | null;
  hasReviewed?: boolean;
};

export type FetchProductDetailsParams = {
  productId: number;
  reviewsPage?: number;
  reviewsPageSize?: number;
  featuredPage?: number;
  featuredPageSize?: number;
};

export type AddUserProductReviewBody = {
  review: string;
  rate: number;
  productId: number;
};

export type UserProductReviewResponse = {
  id: number;
  userId: number;
  productId: number;
  review: string;
  rate: number;
};

/* ===========================
   State
=========================== */

type ProductDetailsState = {
  loading: boolean;
  error: string | null;

  product: ProductApi | null;
  reviewsSummary: ReviewsSummaryApi | null;
  reviews: PaginationResponse<ProductReviewApi> | null;
  featuredProducts: PaginationResponse<FeaturedProductApi> | null;

  addReviewLoading: boolean;
  addReviewError: string | null;

  deleteReviewLoading: boolean;
  deleteReviewError: string | null;
};

const initialState: ProductDetailsState = {
  loading: false,
  error: null,

  product: null,
  reviewsSummary: null,
  reviews: null,
  featuredProducts: null,

  addReviewLoading: false,
  addReviewError: null,

  deleteReviewLoading: false,
  deleteReviewError: null,
};

/* ===========================
   Helpers
=========================== */

const getErrorMessage = (err: unknown, fallback: string) => {
  if (isAxiosError(err)) {
    const anyData = err.response?.data as any;
    return anyData?.title || anyData?.message || fallback;
  }
  return fallback;
};

/* ===========================
   Thunks
=========================== */

export const fetchProductDetails = createAsyncThunk<
  ProductDetailsResponse,
  FetchProductDetailsParams,
  { rejectValue: string }
>(
  "productDetails/fetch",
  async (
    {
      productId,
      reviewsPage = 1,
      reviewsPageSize = 10,
      featuredPage = 1,
      featuredPageSize = 10,
    },
    thunkAPI,
  ) => {
    try {
      const res = await axios.get<ProductDetailsResponse>(
        `/ProductDetails/${productId}`,
        {
          params: {
            reviewsPage,
            reviewsPageSize,
            featuredPage,
            featuredPageSize,
          },
        },
      );

      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(err, "Failed to load product details"),
      );
    }
  },
);

export const addUserProductReview = createAsyncThunk<
  UserProductReviewResponse,
  AddUserProductReviewBody,
  { rejectValue: string }
>("productDetails/addReview", async (body, thunkAPI) => {
  try {
    const res = await axios.post<UserProductReviewResponse>(
      "/UserProductReview",
      body,
    );
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to add review"),
    );
  }
});

export const deleteUserProductReview = createAsyncThunk<
  { reviewId: number },
  number,
  { rejectValue: string }
>("productDetails/deleteReview", async (reviewId, thunkAPI) => {
  try {
    await axios.delete(`/UserProductReview/${reviewId}`);
    return { reviewId };
  } catch (err) {
    return thunkAPI.rejectWithValue(
      getErrorMessage(err, "Failed to delete review"),
    );
  }
});

/* ===========================
   Slice
=========================== */

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    clearProductDetails: (state) => {
      Object.assign(state, initialState);
    },
    removeReviewFromDetails: (state, action: { payload: number }) => {
      const reviewId = action.payload;
      if (!state.reviews) return;

      state.reviews.items = state.reviews.items.filter(
        (r) => r.reviewId !== reviewId,
      );
      state.reviews.totalItems = Math.max(state.reviews.totalItems - 1, 0);

      if (state.product) {
        state.product.reviewCount = Math.max(state.product.reviewCount - 1, 0);
      }
    },
  },
  extraReducers: (builder) => {
    builder

      // FETCH
      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;

        const payload = action.payload;

        state.product = payload.product ?? null;
        state.reviewsSummary = payload.reviews?.summary ?? null;
        state.featuredProducts = payload.featuredProducts ?? null;

        const incoming = payload.reviews?.reviews ?? null;

        if (!incoming) {
          state.reviews = null;
          return;
        }

        const isFirstPage = incoming.currentPage <= 1;

        if (isFirstPage || !state.reviews) {
          state.reviews = incoming;
        } else {
          state.reviews = {
            ...incoming,
            items: [...(state.reviews.items ?? []), ...(incoming.items ?? [])],
          };
        }
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      // ADD REVIEW
      .addCase(addUserProductReview.pending, (state) => {
        state.addReviewLoading = true;
        state.addReviewError = null;
      })
      .addCase(addUserProductReview.fulfilled, (state, action) => {
        state.addReviewLoading = false;

        const newReview: ProductReviewApi = {
          reviewId: action.payload.id,
          userName: "You",
          isMe: true,
          userImage: null,
          rate: action.payload.rate,
          comment: action.payload.review,
          createdAt: new Date().toISOString(),
        };

        if (state.reviews) {
          state.reviews.items.unshift(newReview);
          state.reviews.totalItems += 1;
        }

        if (state.product) {
          state.product.reviewCount += 1;
        }

        if (state.reviewsSummary) {
          state.reviewsSummary.totalReviews += 1;
          const key = String(action.payload.rate);
          state.reviewsSummary.ratesBreakdown[key] =
            (state.reviewsSummary.ratesBreakdown[key] || 0) + 1;
        }
      })
      .addCase(addUserProductReview.rejected, (state, action) => {
        state.addReviewLoading = false;
        state.addReviewError = action.payload || "Something went wrong";
      })

      // DELETE REVIEW
      .addCase(deleteUserProductReview.pending, (state) => {
        state.deleteReviewLoading = true;
        state.deleteReviewError = null;
      })
      .addCase(deleteUserProductReview.fulfilled, (state, action) => {
        state.deleteReviewLoading = false;

        if (!state.reviews) return;

        state.reviews.items = state.reviews.items.filter(
          (r) => r.reviewId !== action.payload.reviewId,
        );

        state.reviews.totalItems = Math.max(state.reviews.totalItems - 1, 0);

        if (state.product) {
          state.product.reviewCount = Math.max(
            state.product.reviewCount - 1,
            0,
          );
        }
      })
      .addCase(deleteUserProductReview.rejected, (state, action) => {
        state.deleteReviewLoading = false;
        state.deleteReviewError = action.payload || "Something went wrong";
      });
  },
});

export const { clearProductDetails, removeReviewFromDetails } =
  productDetailsSlice.actions;
export default productDetailsSlice.reducer;
